# Spring Boot Integration Summary - For Backend Developers

## What Happened: React Frontend Changes

Your frontend was refactored to **call Spring Boot directly** instead of going through Nginx proxy.

---

## ⚠️ The Most Important Changes

### Old Way (With Nginx Proxy)
```
Browser → Nginx (port 80)
         └─→ /api/* → proxy_pass http://springboot:8080/*

API URL in React: /api/users
Actual call: http://springboot:8080/users (through proxy)
```

### New Way (Direct Calls)
```
Browser → React App (reads VITE_API_BASE_URL from environment)
       └─→ Direct call to http://localhost:8080/users

API URL in React: /users
Actual call: http://localhost:8080/users (direct, no proxy)
```

---

## 🔧 What You Need to Change in Spring Boot

### 1. ✅ Enable CORS (CRITICAL!)

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**Why?** Frontend is now on a different origin → CORS headers required

---

### 2. ✅ Remove `/api/` Prefix from All Endpoints

**Before (OLD):**
```java
@RestController
@RequestMapping("/api/users")
public class UserController { }
```

**After (NEW):**
```java
@RestController
@RequestMapping("/users")
public class UserController { }
```

**All endpoints must be directly under root, not under `/api/`**

---

### 3. ✅ Implement These Exact Endpoints

React will call these URLs (no `/api/` prefix):

```java
// Login endpoint (used for authentication)
GET  /users?email={email}&password={password}

// Auth logout
POST /auth/logout

// Approvals management
GET  /approvals
PATCH /approvals/{id}

// Workflow management
GET  /workflows
PATCH /workflows/{id}

// AI Insights
GET  /aiInsights

// Audit Logging
GET  /auditLogs
POST /auditLogs
```

---

### 4. ✅ Handle Authorization Header

Every request will include:
```
Authorization: Bearer <token>
```

Extract and validate it:

```java
@GetMapping("/approvals")
public ResponseEntity<List<Approval>> getApprovals(
    @RequestHeader(value = "Authorization", required = false) String authHeader
) {
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        // Validate token
        if (!isValidToken(token)) {
            return ResponseEntity.status(401).build();
        }
    }
    return ResponseEntity.ok(getAllApprovals());
}
```

---

## 📡 All API Endpoints Required

| Endpoint | Method | Purpose | Request Body | Expected Response |
|----------|--------|---------|--------------|-------------------|
| `/users` | GET | Login (query by email & password) | Query params | `[{ id, email, name, role, ... }]` |
| `/auth/logout` | POST | Logout | - | `{ success: true }` |
| `/approvals` | GET | Get pending approvals | - | `[{ id, workflowId, status, ... }]` |
| `/approvals/{id}` | PATCH | Update approval status | `{ status, reason? }` | `{ id, status, ... }` |
| `/workflows` | GET | Get workflows | - | `[{ id, status, ... }]` |
| `/workflows/{id}` | PATCH | Update workflow status | `{ status }` | `{ id, status, ... }` |
| `/aiInsights` | GET | Get AI insights | - | `[{ id, title, risk, ... }]` |
| `/auditLogs` | GET | Get audit logs | - | `[{ id, entity, action, ... }]` |
| `/auditLogs` | POST | Create audit log | `{ entity, entityId, action, details }` | `{ id, entity, action, ... }` |

---

## 🧪 Quick Setup Checklist

- [ ] Spring Boot running on port 8080
- [ ] CORS config added and enabled
- [ ] All 9 endpoints exist (see table above)
- [ ] All endpoints return JSON (not HTML)
- [ ] Authorization header validated where needed
- [ ] `/users` endpoint: returns array of users
- [ ] `/approvals/{id}` PATCH: accepts `status` field
- [ ] `/workflows/{id}` PATCH: accepts `status` field
- [ ] `/auditLogs` POST: accepts entity, entityId, action, details
- [ ] Test: `curl http://localhost:8080/users?email=test@test.com&password=test`
- [ ] Test: Frontend can reach backend (check browser Network tab)

---

## 🚨 Common Mistakes

### ❌ MISTAKE 1: Keeping `/api/` prefix
```java
// WRONG
@RestController
@RequestMapping("/api/approvals")
public class ApprovalController { }

// RIGHT
@RestController
@RequestMapping("/approvals")
public class ApprovalController { }
```

### ❌ MISTAKE 2: Forgetting CORS
```java
// WRONG - No CORS config
public class Application { }

// RIGHT - Add CORS
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    // ... add mapping
}
```

### ❌ MISTAKE 3: Wrong HTTP Methods
```java
// WRONG - POST instead of PATCH
@PostMapping("/approvals/{id}")

// RIGHT - PATCH for updates
@PatchMapping("/approvals/{id}")
```

### ❌ MISTAKE 4: Ignoring Authorization
```java
// WRONG - No auth check
@GetMapping("/approvals")
public List<Approval> get() { }

// RIGHT - Check auth header
@GetMapping("/approvals")
public List<Approval> get(
    @RequestHeader("Authorization") String auth
) {
    validateToken(auth);
}
```

### ❌ MISTAKE 5: Not returning JSON array for `/users`
```java
// WRONG - returns single object
@GetMapping("/users")
public User getUser() { return user; }

// RIGHT - returns array (React expects array)
@GetMapping("/users")
public List<User> getUsers() { return List.of(user); }
```

---

## 📝 Complete Implementation Example

```java
package com.example.api;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// CORS Configuration
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}

// User Controller
@RestController
public class UserController {
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(
        @RequestParam String email,
        @RequestParam String password
    ) {
        // Find user by email and password
        // Return as array (important!)
        return ResponseEntity.ok(List.of(
            new User(1L, email, "John Doe", "ADMIN")
        ));
    }
}

// Approval Controller
@RestController
public class ApprovalController {
    @GetMapping("/approvals")
    public ResponseEntity<List<Approval>> getApprovals() {
        return ResponseEntity.ok(getAllApprovals());
    }
    
    @PatchMapping("/approvals/{id}")
    public ResponseEntity<Approval> updateApproval(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        Approval approval = findAndUpdate(id, status);
        return ResponseEntity.ok(approval);
    }
}

// Workflow Controller
@RestController
public class WorkflowController {
    @GetMapping("/workflows")
    public ResponseEntity<List<Workflow>> getWorkflows() {
        return ResponseEntity.ok(getAllWorkflows());
    }
    
    @PatchMapping("/workflows/{id}")
    public ResponseEntity<Workflow> updateWorkflow(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        Workflow workflow = findAndUpdate(id, status);
        return ResponseEntity.ok(workflow);
    }
}

// AI Insights Controller
@RestController
public class AiInsightController {
    @GetMapping("/aiInsights")
    public ResponseEntity<List<AiInsight>> getInsights() {
        return ResponseEntity.ok(getAllInsights());
    }
}

// Audit Log Controller
@RestController
public class AuditLogController {
    @GetMapping("/auditLogs")
    public ResponseEntity<List<AuditLog>> getLogs() {
        return ResponseEntity.ok(getAllLogs());
    }
    
    @PostMapping("/auditLogs")
    public ResponseEntity<AuditLog> createLog(
        @RequestBody Map<String, Object> body
    ) {
        AuditLog log = new AuditLog(
            body.get("entity").toString(),
            Long.valueOf(body.get("entityId").toString()),
            body.get("action").toString()
        );
        return ResponseEntity.status(201).body(saveLog(log));
    }
}

// Auth Controller
@RestController
public class AuthController {
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}
```

---

## 🔗 How Frontend Reaches Backend Now

```
Frontend Configuration (.env):
VITE_API_BASE_URL=http://localhost:8080

Frontend Code (src/api/apiConfig.js):
const baseUrl = import.meta.env.VITE_API_BASE_URL;
// = "http://localhost:8080"

Redux Query baseApi (src/api/baseApi.js):
baseUrl: apiConfig.baseUrl
// = "http://localhost:8080"

Actual HTTP Requests:
GET http://localhost:8080/users?email=...&password=...
GET http://localhost:8080/approvals
PATCH http://localhost:8080/approvals/5
POST http://localhost:8080/auditLogs
...etc
```

---

## 🧪 Testing Integration

### Test 1: Is Backend Reachable?
```bash
curl http://localhost:8080/users?email=test@test.com&password=test

# Should return JSON (may be empty or error, but not "connection refused")
```

### Test 2: Does CORS Work?
```bash
# In browser DevTools, run:
fetch('http://localhost:8080/users?email=test@test.com&password=test', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer test' }
})
.then(r => r.json())
.then(console.log)

# Should return data (not CORS error)
```

### Test 3: Check Frontend Network Tab
1. Open React app
2. Press F12 → Network tab
3. Try to login
4. Look for requests to `http://localhost:8080/users`
5. Check response is valid JSON

---

## 📞 Troubleshooting

| Problem | Check |
|---------|-------|
| CORS error in browser | Add CORS config to Spring Boot |
| 404 on `/api/users` | Remove `/api/` prefix! Use `/users` |
| Empty response from `/users` | Ensure endpoint returns array: `List<User>` |
| 405 Method Not Allowed | Check HTTP method (GET vs PATCH) |
| 401 Unauthorized | Check token validation in Authorization header |
| No data returned | Check endpoint returns JSON (not String) |

---

## 📚 Reference Files in Frontend Repo

For more details, check these files:
- `SPRINGBOOT_INTEGRATION.md` - Full integration guide
- `SPRINGBOOT_QUICK_SETUP.md` - Quick setup reference
- `REQUEST_RESPONSE_FLOWS.md` - Visual flow diagrams
- `src/api/apiConfig.js` - How React gets API URL
- `src/api/baseApi.js` - How React makes requests

---

## ✅ Final Checklist Before Going Live

- [ ] CORS enabled in Spring Boot
- [ ] All 9 endpoints exist
- [ ] No `/api/` prefix on endpoints
- [ ] All responses are JSON
- [ ] Authorization header is validated
- [ ] Frontend .env has correct VITE_API_BASE_URL
- [ ] Spring Boot running on port 8080
- [ ] Test: Login works
- [ ] Test: Can get approvals
- [ ] Test: Can update approvals
- [ ] Test: Can create audit logs
- [ ] Check backend logs for errors
- [ ] Check frontend console for errors
- [ ] Ready for deployment!

---

**You're all set! Implement the endpoints above and your Spring Boot will integrate with the React frontend.**

