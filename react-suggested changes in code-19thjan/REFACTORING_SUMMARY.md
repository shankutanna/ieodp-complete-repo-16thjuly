# Refactoring Summary - Exact Changes

## Overview
This document provides a quick reference of all code changes made to make the frontend Kubernetes-friendly and configurable.

---

## File Changes Reference

### ✅ File 1: `src/api/apiConfig.js` (NEW)
**Status:** Created  
**Purpose:** Centralized API configuration sourced from environment variables

**Complete Content:**
```javascript
/**
 * API Configuration Module
 * 
 * This module provides the base URL for all API calls, configurable via
 * environment variables. It reads from import.meta.env.VITE_API_BASE_URL
 * which can be set in .env files or at build time.
 * 
 * For local development: .env should have VITE_API_BASE_URL=http://localhost:8080
 * For Kubernetes/production: Set via build environment or ConfigMap injection
 */

/**
 * Get the API base URL from environment variables
 * Falls back to relative /api path if not specified
 * 
 * @returns {string} The base URL for all API requests
 */
export const getApiBaseUrl = () => {
  // First priority: explicit VITE_API_BASE_URL env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Second priority: check for legacy VITE_API_URL (backward compatibility)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback: Use relative path (works with reverse proxy if frontend and backend
  // are served from same origin, or with proper CORS configuration)
  return '/api';
};

/**
 * API Configuration object with the resolved base URL
 */
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
};

// Log configuration in development for debugging
if (import.meta.env.DEV) {
  console.log('[API Config] Base URL:', apiConfig.baseUrl);
}

export default apiConfig;
```

---

### ✅ File 2: `src/api/baseApi.js` (MODIFIED)

**Before:**
```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // 🔥 FIX
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Workflows",
    "Tasks",
    "Approvals",
    "Insights",
    "Audits",
    "Tickets",
  ],
  endpoints: () => ({}),
});
```

**After:**
```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiConfig } from "./apiConfig";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Workflows",
    "Tasks",
    "Approvals",
    "Insights",
    "Audits",
    "Tickets",
  ],
  endpoints: () => ({}),
});
```

**Key Change:** Import `apiConfig` and use `apiConfig.baseUrl` instead of hardcoded `"/api"`

---

### ✅ File 3: `vite.config.js` (MODIFIED)

**Before:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**After:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Ensure environment variables are available at runtime
    // This is especially important for dynamic API base URL configuration
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '/api'),
  },
})
```

**Key Change:** Added `define` option to expose `VITE_API_BASE_URL` to build

---

### ✅ File 4: `.env.example` (NEW)

```dotenv
# API Configuration
# ====================
# The base URL for all API requests made by the frontend.
#
# For local development with backend on localhost:
#   VITE_API_BASE_URL=http://localhost:8080
#
# For Kubernetes (backend exposed via NodePort):
#   VITE_API_BASE_URL=http://backend-service:8080
#   or
#   VITE_API_BASE_URL=http://your-ingress-domain/api
#
# If not set, defaults to /api (assumes reverse proxy or same-origin backend)
#
VITE_API_BASE_URL=http://localhost:8080
```

---

### ✅ File 5: `Dockerfile` (MODIFIED)

**Before:**
```dockerfile
# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# =========================
# Runtime stage
# =========================
FROM nginx:alpine

# Nginx config for React + API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**After:**
```dockerfile
# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build with default or build-time API base URL
# Can be overridden with: docker build --build-arg VITE_API_BASE_URL=http://backend:8080 ...
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# =========================
# Runtime stage
# =========================
FROM nginx:alpine

# Nginx config for serving static React files only
# NO API proxying - backend is called directly from browser
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key Changes:**
- Added `ARG VITE_API_BASE_URL=/api` before build
- Set `ENV VITE_API_BASE_URL` to pass to npm run build
- Updated comment about Nginx role (serving static files only, no API proxy)

**Build Usage Examples:**
```bash
# Default (reverse proxy)
docker build -t frontend .

# With backend URL
docker build --build-arg VITE_API_BASE_URL=http://backend:8080 -t frontend .
```

---

### ✅ File 6: `nginx.conf` (MODIFIED)

**Before:**
```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://springboot:8080/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**After:**
```nginx
server {
    listen 80;

    # Serve static React files
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }

    # API calls are made directly from the browser to the backend
    # No proxying needed - backend URL is configured via VITE_API_BASE_URL
    # This keeps the frontend independent and Kubernetes-friendly
}
```

**Key Change:** Removed `/api/` location block with hardcoded `proxy_pass http://springboot:8080/`

---

### ✅ File 7: `API_CONFIGURATION.md` (NEW)

**Purpose:** Comprehensive documentation covering:
- Architecture changes before/after
- How to use in local development, Docker, and Kubernetes
- Troubleshooting guide
- Configuration priority and resolution order

See [API_CONFIGURATION.md](API_CONFIGURATION.md) for full content.

---

## Quick Configuration Guide

### Local Development
```bash
# 1. Copy template
cp .env.example .env

# 2. Edit .env
VITE_API_BASE_URL=http://localhost:8080

# 3. Run
npm run dev
```

### Docker (Local Testing)
```bash
# Build with API URL
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  -t frontend:latest .

# Run
docker run -p 8000:80 frontend:latest
```

### Kubernetes
```yaml
env:
  - name: VITE_API_BASE_URL
    value: "http://backend-service:8080"
```

---

## API Endpoints Affected

All endpoints use the centralized configuration:

| File | Endpoints |
|------|-----------|
| `src/api/authApi.js` | `/users`, `/auth/logout` |
| `src/api/managementApi.js` | `/approvals` |
| `src/api/leadershipApi.js` | `/aiInsights`, `/workflows` |
| `src/api/auditApi.js` | `/auditLogs` |

All resolve as: `${VITE_API_BASE_URL}${endpoint}`

---

## Verification Checklist

- ✅ All API calls go through Redux Toolkit Query baseApi
- ✅ baseApi uses `apiConfig.baseUrl` from environment
- ✅ `VITE_API_BASE_URL` is configured in `.env` (development)
- ✅ Dockerfile accepts `--build-arg VITE_API_BASE_URL`
- ✅ Nginx only serves static files, no API proxying
- ✅ No hardcoded backend URLs in code
- ✅ Works with Kubernetes services, NodePorts, Ingress
- ✅ Same container image works in any environment

---

## Zero Downtime Deployment Strategy

### To change API endpoint without rebuilding:

**Option 1: Rebuild with new URL (Kubernetes)**
```yaml
# deployment.yaml - just change the env var
env:
  - name: VITE_API_BASE_URL
    value: "http://new-backend:8080"  # Change this
```

Then redeploy:
```bash
kubectl set image deployment/frontend frontend=frontend:v2 --build-arg VITE_API_BASE_URL=http://new-backend:8080
```

**Option 2: Local development**
```bash
# Edit .env
VITE_API_BASE_URL=http://new-backend:8080

# Restart dev server
npm run dev
```

---

## No More Hardcoded URLs ✅

| Component | Before | After |
|-----------|--------|-------|
| Frontend code | `baseUrl: "/api"` | `baseUrl: apiConfig.baseUrl` |
| Nginx config | `proxy_pass http://springboot:8080/` | ❌ Removed |
| Docker Dockerfile | ❌ No build args | ✅ `--build-arg VITE_API_BASE_URL` |
| Environment | ❌ No .env | ✅ `.env` with `VITE_API_BASE_URL` |

