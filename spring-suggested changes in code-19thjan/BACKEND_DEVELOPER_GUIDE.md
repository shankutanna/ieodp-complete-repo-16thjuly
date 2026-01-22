# Backend Developer Guide Index

## 📖 For Spring Boot Developers - Start Here

Your React frontend was refactored to call Spring Boot **directly** instead of through Nginx proxy. This means Spring Boot needs some configuration changes.

### Quick Answer: What Changed?

| Old (Nginx Proxy) | New (Direct Calls) |
|---|---|
| `GET /api/users` | `GET /users` |
| `PATCH /api/approvals/1` | `PATCH /approvals/1` |
| No CORS needed | **CORS required** |
| No auth header | **Authorization: Bearer token** sent automatically |

---

## 📚 Documentation for Backend

Choose based on what you need:

### 🚀 **I need to setup Spring Boot quickly**
→ [BACKEND_REFERENCE_CARD.md](BACKEND_REFERENCE_CARD.md)
- One-page visual reference
- Minimal working example
- Quick checklist
- **Read Time: 5 minutes**

### 🔧 **I need complete setup instructions**
→ [SPRINGBOOT_QUICK_SETUP.md](SPRINGBOOT_QUICK_SETUP.md)
- CORS configuration
- All 9 endpoints needed
- Request/response examples
- Common mistakes to avoid
- **Read Time: 10 minutes**

### 📖 **I need detailed integration guide**
→ [SPRINGBOOT_INTEGRATION.md](SPRINGBOOT_INTEGRATION.md)
- Complete architecture explanation
- All API endpoints with details
- CORS deep dive
- Complete Spring Boot code examples
- Troubleshooting guide
- **Read Time: 20 minutes**

### 📋 **I need backend changes summary**
→ [SPRINGBOOT_BACKEND_CHANGES.md](SPRINGBOOT_BACKEND_CHANGES.md)
- What happened to frontend
- What you need to change
- Complete implementation example
- Testing procedures
- **Read Time: 15 minutes**

### 📡 **I need to see the actual request/response flow**
→ [REQUEST_RESPONSE_FLOWS.md](REQUEST_RESPONSE_FLOWS.md)
- Step-by-step flow diagrams
- Login flow (complete)
- Update approval flow
- Create audit log flow
- Authorization flow
- **Read Time: 10 minutes**

---

## ⚡ Fastest Setup Path

If you just want to make it work (5 minute setup):

1. Add CORS config to Spring Boot:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

2. Create these endpoints (remove `/api/` prefix):
```
GET    /users?email={email}&password={password}
GET    /approvals
PATCH  /approvals/{id}
GET    /workflows
PATCH  /workflows/{id}
GET    /aiInsights
GET    /auditLogs
POST   /auditLogs
POST   /auth/logout
```

3. Test:
```bash
curl http://localhost:8080/users?email=test@test.com&password=test
```

✅ Done!

---

## 🎯 Key Points to Remember

### ⚠️ Most Important Changes

1. **No `/api/` prefix anymore**
   - Old: `/api/users` ❌
   - New: `/users` ✅

2. **CORS is required**
   - Frontend and backend are now separate origins
   - Add `@CrossOrigin` or `CorsConfig`

3. **Authorization header is sent automatically**
   - React sends: `Authorization: Bearer <token>`
   - Your Spring Boot must validate it

4. **All responses must be JSON**
   - Return `List<T>` for GET
   - Return objects for PATCH/POST
   - Not HTML or strings

5. **Use correct HTTP methods**
   - GET for retrieval
   - PATCH for updates (not POST!)
   - POST for creation

---

## 📡 All Endpoints React Expects

```
AUTHENTICATION:
  GET    /users?email={email}&password={password}  → [{ user }]
  POST   /auth/logout                               → { success }

APPROVALS:
  GET    /approvals                                 → [{ approval }]
  PATCH  /approvals/{id}                            → { updated approval }

WORKFLOWS:
  GET    /workflows                                 → [{ workflow }]
  PATCH  /workflows/{id}                            → { updated workflow }

AI INSIGHTS:
  GET    /aiInsights                                → [{ insight }]

AUDIT LOGS:
  GET    /auditLogs                                 → [{ log }]
  POST   /auditLogs                                 → { created log }
```

---

## 🔐 Authorization Header Pattern

Every request includes this header:

```
Authorization: Bearer demo-token
```

Extract in Spring Boot:

```java
@RequestHeader(value = "Authorization", required = false) String auth

// Extract token:
if (auth != null && auth.startsWith("Bearer ")) {
    String token = auth.substring(7);
    // Validate token
}
```

---

## 🧪 Testing

### Test 1: Is backend reachable?
```bash
curl http://localhost:8080/users?email=test@test.com&password=test
```

### Test 2: Check frontend integration
1. Open React app in browser
2. Press F12 → Network tab
3. Make an action (login, approve, etc.)
4. Check that requests go to `http://localhost:8080/...`
5. Check responses are valid JSON

### Test 3: Check CORS
```javascript
// In browser console
fetch('http://localhost:8080/users?email=test@test.com&password=test')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Should return data (not CORS error)
```

---

## ❌ Don't Make These Mistakes

| ❌ | ✅ | Why |
|---|---|---|
| `/api/users` | `/users` | Remove /api/ prefix |
| `@PostMapping("/approvals/{id}")` | `@PatchMapping("/approvals/{id}")` | Use PATCH for updates |
| `return user;` | `return List.of(user);` | Return arrays |
| No CORS config | Add CORS | Frontend is different origin |
| Ignore auth header | Check auth header | React sends token |

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error in browser console | Add CORS configuration to Spring Boot |
| 404 error on requests | Remove `/api/` prefix from endpoints |
| 405 Method Not Allowed | Check HTTP method (use PATCH not POST) |
| Empty response or null | Return `List<T>` for GET endpoints |
| 401 Unauthorized | Validate Authorization header correctly |
| No requests reaching backend | Check VITE_API_BASE_URL in frontend .env |

---

## 🚀 Implementation Checklist

Before going live:

- [ ] Spring Boot running on port 8080
- [ ] CORS configuration added
- [ ] All 9 endpoints exist (without /api/ prefix)
- [ ] All endpoints return JSON
- [ ] GET endpoints return arrays
- [ ] PATCH uses correct method (not POST)
- [ ] Authorization header validated
- [ ] Test: curl command works
- [ ] Test: Frontend can reach backend
- [ ] Test: Login works
- [ ] Test: Approvals can be updated
- [ ] Test: Audit logs can be created

---

## 📝 Frontend Configuration

Frontend is configured with:

```
.env file:
VITE_API_BASE_URL=http://localhost:8080
```

This means React will call:
- `http://localhost:8080/users`
- `http://localhost:8080/approvals`
- etc.

---

## 🎯 Next Steps

1. **Choose your path:**
   - Quick setup (5 min)? → [BACKEND_REFERENCE_CARD.md](BACKEND_REFERENCE_CARD.md)
   - Complete setup (10 min)? → [SPRINGBOOT_QUICK_SETUP.md](SPRINGBOOT_QUICK_SETUP.md)
   - Deep dive (20 min)? → [SPRINGBOOT_INTEGRATION.md](SPRINGBOOT_INTEGRATION.md)

2. **Add CORS configuration** to your Spring Boot app

3. **Create all 9 endpoints** listed above

4. **Test** with curl command

5. **Verify** frontend can reach backend (check Network tab)

---

## 🔗 Related Frontend Documents

If you need to understand frontend changes:
- [src/api/apiConfig.js](src/api/apiConfig.js) - How API base URL is read
- [src/api/baseApi.js](src/api/baseApi.js) - How requests are made
- [SPRINGBOOT_INTEGRATION.md](SPRINGBOOT_INTEGRATION.md) - Detailed integration guide

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Frontend can reach backend (no 404 or connection errors)
2. ✅ CORS errors are gone
3. ✅ Login works
4. ✅ Can view approvals
5. ✅ Can update approvals
6. ✅ Can view workflows
7. ✅ Can update workflows
8. ✅ Audit logs are created
9. ✅ All API calls return valid JSON
10. ✅ Authorization header is validated

---

**Pick a document above and start implementing!**

**Fastest path: Start with [BACKEND_REFERENCE_CARD.md](BACKEND_REFERENCE_CARD.md) or [SPRINGBOOT_QUICK_SETUP.md](SPRINGBOOT_QUICK_SETUP.md)**

