# Backend Developer - Visual Reference Card

## 🎯 One-Page Summary: What React Frontend Now Expects

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND CHANGES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OLD ARCHITECTURE (with Nginx proxy):                          │
│  ────────────────────────────────────                          │
│  Browser → Nginx (/api/*) → proxy_pass http://springboot:8080/ │
│  URL: /api/users                                               │
│                                                                 │
│  NEW ARCHITECTURE (direct calls):                              │
│  ────────────────────────────────                              │
│  Browser → Direct to Backend                                   │
│  URL: http://localhost:8080/users  (from VITE_API_BASE_URL)   │
│                                                                 │
│  ⚠️ NO MORE /api/ PREFIX!                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Your Spring Boot Must Have

### 1. CORS Configuration
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .allowedHeaders("*");
    }
}
```

### 2. These 9 Endpoints (NO /api/ PREFIX!)
```
GET    /users?email={email}&password={password}
POST   /auth/logout
GET    /approvals
PATCH  /approvals/{id}
GET    /workflows
PATCH  /workflows/{id}
GET    /aiInsights
GET    /auditLogs
POST   /auditLogs
```

### 3. Handle Authorization Header
```java
@RequestHeader(value = "Authorization", required = false) String auth
// Extract: String token = auth.substring(7); // Remove "Bearer "
```

---

## 📊 Request/Response Examples

### Example 1: Login (GET /users)
```
REQUEST:
GET http://localhost:8080/users?email=john@example.com&password=pass123
Authorization: Bearer token123

RESPONSE:
HTTP 200 OK
[
  {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
]
```

### Example 2: Update Approval (PATCH /approvals/{id})
```
REQUEST:
PATCH http://localhost:8080/approvals/5
Content-Type: application/json
Authorization: Bearer token123
{
  "status": "APPROVED"
}

RESPONSE:
HTTP 200 OK
{
  "id": 5,
  "status": "APPROVED",
  "approvedBy": "admin"
}
```

### Example 3: Create Audit Log (POST /auditLogs)
```
REQUEST:
POST http://localhost:8080/auditLogs
Content-Type: application/json
Authorization: Bearer token123
{
  "entity": "TICKET",
  "entityId": 42,
  "action": "CREATED",
  "details": "New ticket"
}

RESPONSE:
HTTP 201 Created
{
  "id": 100,
  "entity": "TICKET",
  "entityId": 42,
  "action": "CREATED",
  "timestamp": "2026-01-19T10:30:00Z"
}
```

---

## ❌ Common Mistakes - DO NOT DO

| ❌ Wrong | ✅ Right | Why |
|---------|----------|-----|
| `/api/users` | `/users` | React now calls directly |
| `@PostMapping("/approvals/{id}")` | `@PatchMapping("/approvals/{id}")` | React sends PATCH |
| No CORS config | Add CORS config | Different origin now |
| Single User object | `List<User>` (array) | React expects array |
| Ignore Authorization | Extract & validate token | React sends token |

---

## 🧪 Quick Test

```bash
# Test if backend works
curl http://localhost:8080/users?email=test@test.com&password=test

# In browser console
fetch('http://localhost:8080/users?email=test@test.com&password=test')
  .then(r => r.json())
  .then(console.log)
```

---

## 📋 Endpoint Implementation Checklist

```
Controllers:
├── [ ] UserController
│   ├── [ ] GET /users (query by email & password)
│   └── [ ] Returns List<User> (array)
│
├── [ ] AuthController
│   └── [ ] POST /auth/logout
│
├── [ ] ApprovalController
│   ├── [ ] GET /approvals
│   └── [ ] PATCH /approvals/{id}
│
├── [ ] WorkflowController
│   ├── [ ] GET /workflows
│   └── [ ] PATCH /workflows/{id}
│
├── [ ] AiInsightController
│   └── [ ] GET /aiInsights
│
└── [ ] AuditLogController
    ├── [ ] GET /auditLogs
    └── [ ] POST /auditLogs

Config:
├── [ ] CORS enabled
├── [ ] Port 8080 running
└── [ ] All endpoints respond with JSON
```

---

## 🔐 Authorization Header Template

```java
@GetMapping("/approvals")
public ResponseEntity<List<Approval>> getApprovals(
    @RequestHeader(value = "Authorization", required = false) String authHeader
) {
    // Validate token
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        // validateToken(token); // Your validation logic
        
        if (!isValid(token)) {
            return ResponseEntity.status(401).build();
        }
    }
    
    return ResponseEntity.ok(getAllApprovals());
}
```

---

## 📞 Troubleshooting Flowchart

```
API calls failing?
│
├─ CORS error?
│  └─ Add CorsConfig with addCorsMappings()
│
├─ 404 Not Found?
│  └─ Check: Remove /api/ prefix! Use /users not /api/users
│
├─ 405 Method Not Allowed?
│  └─ Check: Use PATCH for updates, not POST
│
├─ 401 Unauthorized?
│  └─ Check: Validate Authorization header correctly
│
├─ Empty response?
│  └─ Check: Returns List<T>, not single object
│
└─ 500 Internal Error?
   └─ Check: Spring Boot logs for errors
```

---

## 🎯 Implementation Priority

1. **CRITICAL:** Add CORS configuration
2. **CRITICAL:** Create all 9 endpoints (no /api/ prefix)
3. **IMPORTANT:** Return JSON arrays from GET endpoints
4. **IMPORTANT:** Use correct HTTP methods (PATCH not POST)
5. **IMPORTANT:** Handle Authorization header
6. **NICE:** Add proper error handling and logging

---

## 📝 Minimal Working Example

```java
@Configuration
class CorsConfig implements WebMvcConfigurer {
    public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/**").allowedOriginPatterns("*").allowedMethods("*");
    }
}

@RestController
class UserCtrl {
    @GetMapping("/users")
    List<User> getUsers(@RequestParam String email, @RequestParam String pass) {
        return List.of(new User(1L, email, "John", "ADMIN"));
    }
}

@RestController
class ApprovalCtrl {
    @GetMapping("/approvals")
    List<Approval> get() { return approvals; }
    
    @PatchMapping("/approvals/{id}")
    Approval update(@PathVariable Long id, @RequestBody Map<String, String> b) {
        // Update using b.get("status")
        return updated;
    }
}
```

---

## 🚀 Frontend Configuration

Frontend will use:
```
.env file:
VITE_API_BASE_URL=http://localhost:8080

React sends requests to:
http://localhost:8080/users
http://localhost:8080/approvals
etc.
```

---

## ✅ You're Ready When

- [x] Spring Boot running on port 8080
- [x] CORS enabled
- [x] All 9 endpoints exist
- [x] No /api/ prefix on any endpoint
- [x] All responses are JSON (not HTML)
- [x] GET endpoints return arrays
- [x] PATCH endpoints update resources
- [x] POST endpoints create resources
- [x] Authorization header validated
- [x] Test: curl works
- [x] Test: Frontend can reach backend

---

**Go implement and test the endpoints above!**

