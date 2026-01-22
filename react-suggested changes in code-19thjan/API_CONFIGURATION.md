# API Configuration Refactoring - Complete Guide

## Overview

This frontend has been refactored to make API calls configurable and Kubernetes-friendly **without** relying on Nginx reverse proxying. The backend API URL is now controlled entirely through environment variables, allowing the same container image to work in any environment.

---

## Architecture Changes

### Before (Nginx Proxy Pattern)
```
Browser → Nginx (Port 80)
    ├── /          → React static files
    └── /api/      → proxy_pass http://springboot:8080/
```

**Problems:**
- Hardcoded DNS name `springboot` in Nginx config
- Tight coupling between frontend container and backend
- Cannot easily change backend URL without rebuilding
- Requires all API requests to go through Nginx

### After (Environment-Driven Configuration)
```
Browser → Nginx (Port 80) → React static files only
    ↓
    └─→ Direct HTTP calls to backend (via VITE_API_BASE_URL)
```

**Benefits:**
- Fully configurable at build time or deployment time
- No hardcoded URLs in code
- Works with Kubernetes services, Ingress, NodePorts, or external IPs
- Same container image works in dev, test, staging, production

---

## Files Modified

### 1. **[src/api/apiConfig.js](src/api/apiConfig.js)** - NEW FILE
**Purpose:** Centralized API configuration module

**Key Features:**
- Reads `VITE_API_BASE_URL` from environment variables
- Fallback to `/api` for reverse proxy scenarios
- Backward compatible with legacy `VITE_API_URL`
- Logs configuration in development for debugging

```javascript
// How it works:
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api'; // fallback
};
```

### 2. **[src/api/baseApi.js](src/api/baseApi.js)** - MODIFIED
**Change:** Import and use `apiConfig.baseUrl` instead of hardcoded `/api`

**Before:**
```javascript
baseQuery: fetchBaseQuery({
  baseUrl: "/api",  // ❌ Hardcoded
  // ...
})
```

**After:**
```javascript
import { apiConfig } from "./apiConfig";

baseQuery: fetchBaseQuery({
  baseUrl: apiConfig.baseUrl,  // ✅ Dynamic
  // ...
})
```

### 3. **[vite.config.js](vite.config.js)** - MODIFIED
**Change:** Added `define` option to ensure env variables are available

```javascript
define: {
  __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '/api'),
},
```

This ensures `import.meta.env.VITE_API_BASE_URL` is properly substituted during build.

### 4. **[.env.example](.env.example)** - NEW FILE
**Purpose:** Template for environment configuration

```dotenv
# Local development
VITE_API_BASE_URL=http://localhost:8080

# Kubernetes (NodePort)
# VITE_API_BASE_URL=http://backend-service:8080

# Kubernetes (Ingress)
# VITE_API_BASE_URL=http://your-ingress-domain/api
```

### 5. **[Dockerfile](Dockerfile)** - MODIFIED
**Changes:**
- Added `ARG VITE_API_BASE_URL=/api` for build-time configuration
- Removed hardcoded API proxy comments
- Nginx now serves static files only

```dockerfile
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build can now be customized:
# docker build --build-arg VITE_API_BASE_URL=http://backend:8080 .
```

### 6. **[nginx.conf](nginx.conf)** - MODIFIED
**Changes:**
- Removed `/api/` location block with `proxy_pass`
- Now serves only React static files
- Added comments explaining the architecture

**Before:**
```nginx
location /api/ {
    proxy_pass http://springboot:8080/;
    # ... proxy headers
}
```

**After:**
```nginx
# API calls are made directly from the browser to the backend
# No proxying needed - backend URL is configured via VITE_API_BASE_URL
```

---

## How to Use

### Local Development

**Option 1: Using .env file**
```bash
# Copy template
cp .env.example .env

# Edit .env with your backend URL
# VITE_API_BASE_URL=http://localhost:8080

# Run
npm run dev
```

**Option 2: Using json-server (mock backend)**
```bash
# In one terminal
npm run json-server

# In another terminal
npm run dev
# Set VITE_API_BASE_URL=http://localhost:5000 in .env
```

---

### Docker Build (Local Testing)

**Default (reverse proxy pattern):**
```bash
docker build -t frontend:latest .
# API calls will go to /api (assumes proxy)
```

**With explicit backend URL:**
```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://backend:8080 \
  -t frontend:latest \
  .
```

**Testing the container:**
```bash
docker run -p 8000:80 frontend:latest
# Frontend accessible at http://localhost:8000
# API calls will target http://backend:8080 (from the container's perspective)
```

---

### Kubernetes Deployment

**Scenario 1: Backend on same cluster (ClusterIP service)**

```yaml
# backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  ports:
    - port: 8080
  selector:
    app: backend

---
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  template:
    spec:
      containers:
        - name: frontend
          image: frontend:latest
          env:
            - name: VITE_API_BASE_URL
              value: "http://backend-service:8080"
```

**Scenario 2: Backend on NodePort**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  template:
    spec:
      containers:
        - name: frontend
          image: frontend:latest
          env:
            - name: VITE_API_BASE_URL
              value: "http://backend-node:30080"  # NodePort
```

**Scenario 3: Backend via Ingress**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  template:
    spec:
      containers:
        - name: frontend
          image: frontend:latest
          env:
            - name: VITE_API_BASE_URL
              value: "http://api.example.com"
```

---

### Build-Time Configuration (CI/CD Pipeline)

**In GitHub Actions / GitLab CI / Jenkins:**

```bash
#!/bin/bash
docker build \
  --build-arg VITE_API_BASE_URL="$API_BASE_URL" \
  -t frontend:$VERSION \
  .
```

**Environment Variables in CI:**
- `DEV_API_BASE_URL=http://localhost:8080`
- `STAGING_API_BASE_URL=https://api-staging.example.com`
- `PROD_API_BASE_URL=https://api.example.com`

---

## All API Endpoints

All API calls flow through Redux Toolkit Query, which uses the centralized `baseUrl`:

- `[src/api/authApi.js](src/api/authApi.js)` → Uses `/users`, `/auth/logout`
- `[src/api/managementApi.js](src/api/managementApi.js)` → Uses `/approvals`
- `[src/api/leadershipApi.js](src/api/leadershipApi.js)` → Uses `/aiInsights`, `/workflows`
- `[src/api/auditApi.js](src/api/auditApi.js)` → Uses `/auditLogs`

All requests are resolved as:
```
${VITE_API_BASE_URL}/users
${VITE_API_BASE_URL}/approvals
${VITE_API_BASE_URL}/workflows
etc.
```

---

## Configuration Priority (Runtime)

When the app loads, it resolves the API base URL in this order:

1. **`import.meta.env.VITE_API_BASE_URL`** (from .env or build args)
2. **`import.meta.env.VITE_API_URL`** (legacy, for backward compatibility)
3. **`/api`** (fallback - assumes reverse proxy)

Check [src/api/apiConfig.js](src/api/apiConfig.js#L14) for the implementation.

---

## Troubleshooting

### API calls fail in Kubernetes
**Check:**
1. Verify the backend service name or IP in `VITE_API_BASE_URL`
2. Check network policies allow traffic between frontend and backend pods
3. Verify CORS headers are set on the backend

### Wrong API endpoint used
**Check:**
1. Confirm `.env` file exists with `VITE_API_BASE_URL` set
2. Run `npm run dev` with `DEBUG=* npm run dev` to see logs
3. Check browser console → Application → Environment Variables

### Docker build doesn't apply the API URL
**Check:**
1. Ensure `--build-arg VITE_API_BASE_URL=...` is passed to `docker build`
2. Verify Dockerfile has the `ARG` and `ENV` lines
3. Check the build output log for the build args

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| API URL location | `/api` (hardcoded in baseApi.js) | Configurable via `VITE_API_BASE_URL` |
| Nginx role | Proxy to backend | Static file serving only |
| Backend discovery | Hardcoded DNS `springboot:8080` | Environment variable |
| Config changes | Requires rebuild | Single .env change or env var |
| Kubernetes friendly | ❌ No | ✅ Yes |
| Container image reuse | ❌ No | ✅ Yes across all environments |

---

## Next Steps

1. **Create `.env` file** from `.env.example` with your backend URL
2. **Test locally:** `npm run dev`
3. **Build Docker image** with appropriate `--build-arg VITE_API_BASE_URL`
4. **Deploy to Kubernetes** with env var set in Deployment manifest
5. **Monitor:** Check browser console → Network tab for API calls

---

## Files Reference

- 🆕 **New:** [src/api/apiConfig.js](src/api/apiConfig.js)
- 🆕 **New:** [.env.example](.env.example)
- ✏️ **Modified:** [src/api/baseApi.js](src/api/baseApi.js)
- ✏️ **Modified:** [vite.config.js](vite.config.js)
- ✏️ **Modified:** [Dockerfile](Dockerfile)
- ✏️ **Modified:** [nginx.conf](nginx.conf)
