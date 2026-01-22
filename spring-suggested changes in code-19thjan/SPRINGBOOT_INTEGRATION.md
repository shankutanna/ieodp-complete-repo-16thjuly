# Spring Boot Backend Integration Guide

## React Frontend Changes Made

This document explains **exactly what changed** in the React frontend and **what your Spring Boot backend needs to do** to work with it.

---

## 🔑 Critical Change: How API Calls Now Work

### Before (Old Architecture)
```
Browser
  ↓
Nginx (port 80)
  ├─→ /          → React static files
  └─→ /api/*     → proxy_pass http://springboot:8080/*
                    (Nginx redirects all API calls)
```

### After (New Architecture)
```
Browser
  ↓
React App (loads VITE_API_BASE_URL from environment)
  ├─→ Nginx (port 80) serves static files only
  │
  └─→ Direct HTTP calls to Spring Boot
      GET http://springboot:8080/users
      GET http://springboot:8080/approvals
      etc.
      
⚠️ IMPORTANT: No more /api/ prefix in URLs!
```

---

## 🔗 API Base URL Configuration

### How React Frontend is Configured

```javascript
// src/api/apiConfig.js
export const getApiBaseUrl = () => {
  // 1. Check VITE_API_BASE_URL (environment variable)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
    // Example: "http://localhost:8080"
    // Example: "http://springboot-service:8080"
  }

  // 2. Fall back to /api (assumes reverse proxy)
  return '/api';
};
```

### How to Set It for Local Development

```bash
# .env file (in frontend root)
VITE_API_BASE_URL=http://localhost:8080
```

**Result:** All API calls will target `http://localhost:8080/...`

---

## 📡 API Endpoints Your Spring Boot Must Expose

### All Current Endpoints (No /api/ prefix!)

| React API Call | Spring Boot Endpoint | Method | Description |
|---|---|---|---|
| `/users` | `GET /users` | GET | Get all users (used for login) |
| `/auth/logout` | `POST /auth/logout` | POST | Logout endpoint |
| `/approvals` | `GET /approvals` | GET | Get pending approvals |
| `/approvals/{id}` | `PATCH /approvals/{id}` | PATCH | Update approval status |
| `/workflows` | `GET /workflows` | GET | Get workflows |
| `/workflows/{id}` | `PATCH /workflows/{id}` | PATCH | Update workflow status |
| `/aiInsights` | `GET /aiInsights` | GET | Get AI insights |
| `/auditLogs` | `GET /auditLogs` | GET | Get audit logs |
| `/auditLogs` | `POST /auditLogs` | POST | Create audit log |

---

## ⚠️ CRITICAL: Authentication Headers

The React frontend **automatically sends** an Authorization header:

```javascript
// src/api/baseApi.js prepareHeaders function
const token = localStorage.getItem("token");
if (token) {
  headers.set("Authorization", `Bearer ${token}`);
}
```

### Your Spring Boot Must:

1. **Accept Bearer tokens** in Authorization header
2. **Validate the token** (JWT or whatever you use)
3. **Protect endpoints** with token validation

### Example Spring Boot Code Required

```java
@RestController
@CrossOrigin(origins = "*")  // ⚠️ See CORS section below
public class UserController {
    
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        // Optional: extract and validate token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // Validate token here
        }
        // Return users list
        return ResponseEntity.ok(userList);
    }
}
```

---

## 🔐 CORS Configuration (CRITICAL!)

### ⚠️ Your Spring Boot MUST Enable CORS

When the React frontend runs on a **different origin** than the backend, browsers enforce CORS (Cross-Origin Resource Sharing).

### Required Spring Boot CORS Configuration

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",      // Local dev frontend
                    "http://localhost:5173",       // Vite dev server
                    "http://localhost:8000",       // Docker frontend
                    "http://frontend-service",     // Kubernetes service
                    "https://your-domain.com"      // Production domain
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Or Using Annotations

```java
@RestController
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000"
    },
    allowedMethods = {"GET", "POST", "PUT", "PATCH", "DELETE"},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class YourController {
    // Your endpoints...
}
```

---

## 🔄 API Call Patterns from React

### Pattern 1: GET Request with Query Parameters

```javascript
// React Code
const result = await fetchWithBQ({
    url: `/users?email=${email}&password=${password}`,
    method: "GET",
});
```

**Spring Boot Must Handle:**
```java
@GetMapping("/users")
public ResponseEntity<?> getUsers(
    @RequestParam String email,
    @RequestParam String password
) {
    // Find user by email and password
    // Return user object
    return ResponseEntity.ok(user);
}
```

### Pattern 2: PATCH Request with Body

```javascript
// React Code
const result = await fetchWithBQ({
    url: `/approvals/${id}`,
    method: "PATCH",
    body: { status: "APPROVED" },
});
```

**Spring Boot Must Handle:**
```java
@PatchMapping("/approvals/{id}")
public ResponseEntity<?> updateApproval(
    @PathVariable Long id,
    @RequestBody ApprovalUpdateRequest request
) {
    // Update approval status
    return ResponseEntity.ok(updatedApproval);
}

class ApprovalUpdateRequest {
    public String status;  // "APPROVED", "REJECTED", "ESCALATED"
    public String reason;  // Optional
}
```

### Pattern 3: POST Request with JSON Body

```javascript
// React Code
const result = await fetchWithBQ({
    url: `/auditLogs`,
    method: "POST",
    body: auditData,
});
```

**Spring Boot Must Handle:**
```java
@PostMapping("/auditLogs")
public ResponseEntity<?> createAuditLog(
    @RequestBody AuditLogCreateRequest request
) {
    // Create and save audit log
    return ResponseEntity.ok(createdLog);
}

class AuditLogCreateRequest {
    public String entity;
    public Long entityId;
    public String action;
    public String details;
    // ... other fields
}
```

---

## 📊 Actual Request/Response Flow Example

### Login Flow (Step-by-Step)

#### Step 1: Frontend Makes Request
```
GET http://localhost:8080/users?email=user@example.com&password=pass123
Headers:
  Authorization: Bearer token123 (if exists)
```

#### Step 2: Spring Boot Must Respond
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "password": "pass123",
    "name": "John Doe",
    "role": "ADMIN"
  }
]
```

#### Step 3: Frontend Processes Response
```javascript
// src/api/authApi.js
if (result.data && result.data.length > 0) {
  const user = result.data[0];
  return {
    data: {
      token: "demo-token",
      user: user
    }
  };
}
```

---

## 🚀 How to Test Connectivity

### Test 1: Check if Backend is Reachable

```bash
# From your terminal
curl http://localhost:8080/users

# You should get a response (not an error)
# It might say "unauthorized" but that's OK - it means it reached the backend
```

### Test 2: Check Frontend Console Logs

1. Open React app in browser (http://localhost:5173)
2. Open DevTools → Console
3. Look for: `[API Config] Base URL: http://localhost:8080`
4. Go to Network tab
5. Make an API call (e.g., login)
6. Check the request URL and response

### Test 3: Check CORS Errors

If you see this error in browser console:
```
Access to XMLHttpRequest at 'http://localhost:8080/users' 
from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:** Add CORS config to Spring Boot (see CORS section above)

---

## 📝 Complete Spring Boot Endpoint List with Descriptions

### Authentication Endpoints

```java
// GET /users - Used for login (query by email & password)
@GetMapping("/users")
public ResponseEntity<List<User>> getUsers(
    @RequestParam String email,
    @RequestParam String password
) {
    // Find user matching email and password
    // React expects: [{ id, email, password, name, role, ... }]
}

// POST /auth/logout - Logout endpoint
@PostMapping("/auth/logout")
public ResponseEntity<?> logout() {
    // Clear session or invalidate token
    // React expects: { success: true } or similar
}
```

### Approval Endpoints

```java
// GET /approvals - Get all pending approvals
@GetMapping("/approvals")
public ResponseEntity<List<Approval>> getApprovals() {
    // Return list of pending approvals
    // React expects: [{ id, workflowId, status, assignedTo, ... }]
}

// PATCH /approvals/{id} - Update approval (approve/reject/escalate)
@PatchMapping("/approvals/{id}")
public ResponseEntity<Approval> updateApproval(
    @PathVariable Long id,
    @RequestBody Map<String, String> body
) {
    // body.get("status") = "APPROVED" | "REJECTED" | "ESCALATED"
    // body.get("reason") = rejection reason (optional)
    // Update approval and return updated object
}
```

### Workflow Endpoints

```java
// GET /workflows - Get all workflows
@GetMapping("/workflows")
public ResponseEntity<List<Workflow>> getWorkflows() {
    // Return list of workflows
}

// PATCH /workflows/{id} - Update workflow status
@PatchMapping("/workflows/{id}")
public ResponseEntity<Workflow> updateWorkflow(
    @PathVariable Long id,
    @RequestBody Map<String, String> body
) {
    // body.get("status") = new status
    // Update and return workflow
}
```

### AI Insights Endpoints

```java
// GET /aiInsights - Get AI-generated insights
@GetMapping("/aiInsights")
public ResponseEntity<List<AiInsight>> getAiInsights() {
    // Return AI insights
    // React expects: [{ id, title, description, riskLevel, ... }]
}
```

### Audit Log Endpoints

```java
// GET /auditLogs - Get audit logs
@GetMapping("/auditLogs")
public ResponseEntity<List<AuditLog>> getAuditLogs() {
    // Return audit logs
}

// POST /auditLogs - Create audit log entry
@PostMapping("/auditLogs")
public ResponseEntity<AuditLog> createAuditLog(
    @RequestBody AuditLogRequest request
) {
    // Create and save audit log
    // request contains: entity, entityId, action, details, etc.
}
```

---

## 📍 React to Spring Boot URL Mapping

### Important: URLs Changed!

| Before (with Nginx proxy) | After (direct calls) |
|---|---|
| `GET /api/users` | `GET /users` |
| `GET /api/approvals` | `GET /approvals` |
| `PATCH /api/approvals/1` | `PATCH /approvals/1` |
| `GET /api/workflows` | `GET /workflows` |
| `PATCH /api/workflows/1` | `PATCH /workflows/1` |
| `GET /api/aiInsights` | `GET /aiInsights` |
| `GET /api/auditLogs` | `GET /auditLogs` |
| `POST /api/auditLogs` | `POST /auditLogs` |

**⚠️ Notice:** The `/api/` prefix is GONE! React calls endpoints directly.

---

## 🔧 Step-by-Step Spring Boot Setup

### Step 1: Add CORS Configuration
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

### Step 2: Create User Endpoint
```java
@RestController
public class UserController {
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(
        @RequestParam String email,
        @RequestParam String password
    ) {
        // Query users by email and password
        // Return list (React expects array)
        return ResponseEntity.ok(users);
    }
}
```

### Step 3: Create Approval Endpoints
```java
@RestController
public class ApprovalController {
    @GetMapping("/approvals")
    public ResponseEntity<List<Approval>> getAll() {
        return ResponseEntity.ok(approvals);
    }
    
    @PatchMapping("/approvals/{id}")
    public ResponseEntity<Approval> update(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        // Update approval
        return ResponseEntity.ok(updated);
    }
}
```

### Step 4: Add Authorization Header Support
```java
@RestController
@RequestMapping("/approvals")
public class ApprovalController {
    @PatchMapping("/{id}")
    public ResponseEntity<Approval> update(
        @PathVariable Long id,
        @RequestBody Map<String, String> body,
        @RequestHeader(value = "Authorization", required = false) String auth
    ) {
        // Extract and validate token from Authorization header
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            // Validate token
        }
        // Process request
        return ResponseEntity.ok(updated);
    }
}
```

---

## 🧪 Testing the Integration

### Test 1: Direct Curl Request
```bash
# Test if backend is running
curl -X GET http://localhost:8080/users?email=test@example.com&password=test123

# Expected: List of users (or empty list)
```

### Test 2: With Frontend
```bash
# 1. Set .env in frontend
echo "VITE_API_BASE_URL=http://localhost:8080" > .env

# 2. Start frontend
npm run dev

# 3. Open browser to http://localhost:5173
# 4. Check console for [API Config] Base URL: http://localhost:8080
# 5. Try to login
# 6. Check Network tab for requests to http://localhost:8080/...
```

### Test 3: Check Response Format
In browser DevTools → Network:
1. Find the API request (e.g., GET /users)
2. Click on it
3. Go to "Response" tab
4. Verify the JSON structure matches what React expects

---

## ❌ Common Mistakes to Avoid

### ❌ Mistake 1: Keeping `/api/` prefix
```java
// WRONG - This won't work
@RestController
@RequestMapping("/api/approvals")
public class ApprovalController { }

// RIGHT - Remove /api/ prefix
@RestController
@RequestMapping("/approvals")
public class ApprovalController { }
```

### ❌ Mistake 2: Not Allowing CORS
```java
// WRONG - No CORS config
@RestController
public class UserController { }

// RIGHT - Add CORS
@RestController
@CrossOrigin("*")
public class UserController { }
```

### ❌ Mistake 3: Wrong HTTP Methods
```java
// WRONG - POST instead of PATCH
@PostMapping("/approvals/{id}")
public ResponseEntity<?> update(...) { }

// RIGHT - Use PATCH for updates
@PatchMapping("/approvals/{id}")
public ResponseEntity<?> update(...) { }
```

### ❌ Mistake 4: Ignoring Authorization Header
```java
// WRONG - No auth validation
@GetMapping("/approvals")
public ResponseEntity<?> getApprovals() { }

// RIGHT - Check auth header
@GetMapping("/approvals")
public ResponseEntity<?> getApprovals(
    @RequestHeader(value = "Authorization", required = false) String auth
) { }
```

---

## 📋 Checklist for Spring Boot Setup

- [ ] CORS configuration added
- [ ] `GET /users` endpoint exists (login)
- [ ] `POST /auth/logout` endpoint exists
- [ ] `GET /approvals` endpoint exists
- [ ] `PATCH /approvals/{id}` endpoint exists
- [ ] `GET /workflows` endpoint exists
- [ ] `PATCH /workflows/{id}` endpoint exists
- [ ] `GET /aiInsights` endpoint exists
- [ ] `GET /auditLogs` endpoint exists
- [ ] `POST /auditLogs` endpoint exists
- [ ] All endpoints return proper JSON
- [ ] Authorization header is validated
- [ ] Backend is running on port 8080 (or configured in React .env)
- [ ] Test: Frontend can reach backend
- [ ] Test: Login works
- [ ] Test: API calls return data

---

## 🎯 Summary for Spring Boot Developer

### What Changed in React:
1. **API calls now go to configurable backend URL** (set in `.env` or environment)
2. **No more `/api/` prefix** - React calls endpoints directly
3. **All requests include `Authorization: Bearer token` header** - if token exists
4. **CORS is required** - frontend and backend are now separate

### What Your Spring Boot Needs:
1. **CORS enabled** - accept requests from frontend origin
2. **Endpoints without `/api/` prefix** - direct endpoint paths
3. **HTTP method support** - GET, POST, PATCH as needed
4. **Authorization header validation** - extract and validate Bearer token
5. **Proper JSON responses** - return data in expected format

### How to Configure Frontend to Use Your Backend:

```bash
# .env file in frontend
VITE_API_BASE_URL=http://localhost:8080

# Then React will call:
# http://localhost:8080/users
# http://localhost:8080/approvals
# http://localhost:8080/workflows
# etc.
```

---

## 🔗 File References

React files that were changed:
- `src/api/apiConfig.js` - Reads VITE_API_BASE_URL
- `src/api/baseApi.js` - Uses apiConfig.baseUrl
- `src/api/authApi.js` - Login endpoint pattern
- `src/api/managementApi.js` - Approval endpoints pattern
- `src/api/leadershipApi.js` - Workflow endpoints pattern

---

**Ready to integrate? Start with CORS configuration and the endpoints listed above!**

