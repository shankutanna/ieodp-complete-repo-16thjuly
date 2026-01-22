# Quick Reference Card - API Configuration

## 📋 What Changed?

Your React frontend is now **Kubernetes-friendly** with **environment-configurable API endpoints**.

### Old Way ❌
```
Nginx proxy in container → hardcoded to http://springboot:8080
Browser → /api → Nginx proxy → Backend
```

### New Way ✅
```
Browser → Direct HTTP calls to configurable backend URL
Backend URL = VITE_API_BASE_URL (environment variable)
```

---

## 🚀 How to Use

### Development
```bash
cp .env.example .env
# Edit .env and set:
# VITE_API_BASE_URL=http://localhost:8080

npm run dev
```

### Docker
```bash
# Build with specific backend URL
docker build \
  --build-arg VITE_API_BASE_URL=http://backend:8080 \
  -t frontend .

docker run -p 8000:80 frontend
```

### Kubernetes
```yaml
containers:
  - name: frontend
    image: frontend:latest
    env:
      - name: VITE_API_BASE_URL
        value: "http://backend-service:8080"
```

---

## 📝 Files Modified

| File | Status | Key Change |
|------|--------|-----------|
| `src/api/apiConfig.js` | ✨ NEW | Reads `VITE_API_BASE_URL` from env |
| `src/api/baseApi.js` | ✏️ MODIFIED | Uses `apiConfig.baseUrl` instead of hardcoded `/api` |
| `vite.config.js` | ✏️ MODIFIED | Exposes `VITE_API_BASE_URL` to build |
| `.env.example` | ✨ NEW | Template for configuration |
| `Dockerfile` | ✏️ MODIFIED | Accepts `--build-arg VITE_API_BASE_URL` |
| `nginx.conf` | ✏️ MODIFIED | Removed API proxy config |

---

## 🔍 Configuration Resolution Order

When the app starts:
1. Check `VITE_API_BASE_URL` environment variable
2. Check legacy `VITE_API_URL` (backward compat)
3. Fall back to `/api` (reverse proxy mode)

---

## 📍 API Endpoint Examples

All endpoints now use the configurable base URL:

```javascript
// If VITE_API_BASE_URL = "http://backend:8080"
/users           → http://backend:8080/users
/approvals       → http://backend:8080/approvals
/workflows       → http://backend:8080/workflows
/auditLogs       → http://backend:8080/auditLogs

// If VITE_API_BASE_URL = "/api" (default)
/users           → http://same-origin/api/users
/approvals       → http://same-origin/api/approvals
```

---

## ✅ Verification Checklist

Before deploying:

- [ ] `.env` file created with `VITE_API_BASE_URL` set
- [ ] `npm run dev` works and backend calls are successful
- [ ] Docker builds with `--build-arg VITE_API_BASE_URL=...`
- [ ] Kubernetes deployment has `VITE_API_BASE_URL` env var
- [ ] Browser console shows correct API URL (check Application → Environment)
- [ ] No errors about "Cannot find module 'apiConfig'"

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| API calls fail | Check `VITE_API_BASE_URL` in .env or deployment |
| Wrong URL used | Run `npm run dev` with correct `.env`, check console logs |
| Docker build fails | Ensure `--build-arg VITE_API_BASE_URL=...` matches your setup |
| CORS errors | Configure CORS headers on backend (not frontend issue) |

---

## 📚 Full Documentation

See [API_CONFIGURATION.md](API_CONFIGURATION.md) for comprehensive guide.

---

## 🎯 Key Takeaway

**One change to update API endpoint:**

### Before (rebuild required)
```
❌ Edit nginx.conf proxy_pass
❌ Rebuild Docker image
❌ Deploy new container
```

### After (config only)
```
✅ Edit .env file or env variable
✅ Restart container
✅ Done - same image, new endpoint
```

---

## Examples

### Local Dev + Mock Backend (json-server)
```bash
VITE_API_BASE_URL=http://localhost:5000
npm run dev
```

### Local Dev + Remote Backend
```bash
VITE_API_BASE_URL=http://192.168.1.100:8080
npm run dev
```

### Docker + Local Backend
```bash
docker build --build-arg VITE_API_BASE_URL=http://host.docker.internal:8080 -t frontend .
```

### Kubernetes + ClusterIP Service
```bash
kubectl set env deployment/frontend VITE_API_BASE_URL=http://backend-service:8080
```

### Kubernetes + Ingress
```bash
kubectl set env deployment/frontend VITE_API_BASE_URL=https://api.example.com
```

---

## 🎓 Learn More

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Docker Build Arguments](https://docs.docker.com/engine/reference/commandline/build/)
- [Kubernetes Environment Variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)

