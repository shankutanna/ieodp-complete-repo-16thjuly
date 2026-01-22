# Request/Response Flow Diagrams - React to Spring Boot

## 1️⃣ Login Flow (Complete Step-by-Step)

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React App)                      │
│                                                             │
│  User clicks "Login"                                        │
│       │                                                     │
│       ▼                                                     │
│  src/api/authApi.js: login mutation                        │
│       │                                                     │
│       ├─→ Reads: email = "john@example.com"                │
│       │           password = "password123"                 │
│       │                                                    │
│       ├─→ Reads: VITE_API_BASE_URL = "http://localhost:8080"
│       │                                                    │
│       ▼                                                    │
│  Creates HTTP Request:                                   │
│  ┌────────────────────────────────────────────────┐       │
│  │ GET /users?email=john@example.com&password=... │       │
│  │ Host: localhost:8080                           │       │
│  │ Authorization: Bearer token123 (if logged in)  │       │
│  └────────────────────────────────────────────────┘       │
│       │                                                    │
│       ▼ (Network Call)                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP GET request
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot Backend                        │
│                  (Port 8080)                               │
│                                                             │
│  UserController.getUsers() receives:                       │
│  ┌────────────────────────────────────────────────┐        │
│  │ @RequestParam String email                    │        │
│  │ @RequestParam String password                 │        │
│  │ @RequestHeader String Authorization (optional)│        │
│  └────────────────────────────────────────────────┘        │
│       │                                                    │
│       ├─→ Validate token (if present)                     │
│       ├─→ Query database: SELECT * FROM users WHERE ...   │
│       │                                                    │
│       ▼                                                    │
│  Return JSON Response:                                    │
│  ┌────────────────────────────────────────────────┐        │
│  │ HTTP 200 OK                                   │        │
│  │ Content-Type: application/json                │        │
│  │                                                │        │
│  │ [                                              │        │
│  │   {                                            │        │
│  │     "id": 1,                                   │        │
│  │     "email": "john@example.com",               │        │
│  │     "name": "John Doe",                        │        │
│  │     "role": "ADMIN"                            │        │
│  │   }                                            │        │
│  │ ]                                              │        │
│  └────────────────────────────────────────────────┘        │
│       │                                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Response
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React App)                      │
│                                                             │
│  authApi.js processes response:                           │
│       │                                                    │
│       ├─→ result.data[0] = User object                    │
│       │                                                    │
│       ├─→ Generate token: "demo-token"                    │
│       │                                                    │
│       ├─→ Save to localStorage:                           │
│       │   localStorage.setItem("token", "demo-token")     │
│       │                                                    │
│       ▼                                                    │
│  Return to Redux:                                         │
│  {                                                         │
│    data: {                                                 │
│      token: "demo-token",                                  │
│      user: { id: 1, email: "john@example.com", ... }      │
│    }                                                       │
│  }                                                         │
│       │                                                    │
│       ▼                                                    │
│  Redux stores user data                                   │
│  Redirect to dashboard                                    │
│  Login successful! ✅                                     │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Get Approvals Flow

```
┌─────────────────────────────────────┐
│         React Component             │
│    (AdminDashboard)                 │
│                                     │
│  useGetApprovalsQuery()             │
│       │                             │
│       ▼                             │
│  Redux Toolkit Query triggers:      │
│  managementApi.js                   │
│       │                             │
│       ├─→ URL: "/approvals"         │
│       ├─→ Method: GET               │
│       ├─→ Base URL: apiConfig.baseUrl
│       │           = "http://localhost:8080"
│       │                             │
│       ▼                             │
│  Actual Request:                    │
│  GET http://localhost:8080/approvals
│  Headers:                           │
│    Authorization: Bearer token123   │
│                                     │
└─────────────────────────────────────┘
          │
          │ HTTP GET
          ▼
┌─────────────────────────────────────┐
│     Spring Boot Backend             │
│                                     │
│  @GetMapping("/approvals")          │
│  ApprovalController.getApprovals()  │
│       │                             │
│       ├─→ Check Authorization header
│       ├─→ Validate token            │
│       ├─→ Query: SELECT * FROM approvals
│       │                             │
│       ▼                             │
│  Return List<Approval>:             │
│  [                                  │
│    {                                │
│      "id": 1,                       │
│      "workflowId": 10,              │
│      "status": "PENDING",           │
│      "assignedTo": "manager1"       │
│    },                               │
│    {                                │
│      "id": 2,                       │
│      "workflowId": 11,              │
│      "status": "PENDING",           │
│      "assignedTo": "manager2"       │
│    }                                │
│  ]                                  │
│                                     │
└─────────────────────────────────────┘
          │
          │ JSON Response
          ▼
┌─────────────────────────────────────┐
│    React Component                  │
│                                     │
│  Receive data from Redux Query      │
│  Update component state             │
│  Render ApprovalCard for each item  │
│  Display on screen ✅              │
│                                     │
└─────────────────────────────────────┘
```

---

## 3️⃣ Update Approval Status Flow (PATCH)

```
User clicks "Approve" button
    │
    ▼
┌──────────────────────────────────────────────────┐
│         React Component                          │
│  (FinalApprovalActions)                          │
│                                                  │
│  useFinalApproveWorkflowMutation()               │
│  Called with: workflowId = 5                     │
│       │                                          │
│       ▼                                          │
│  Sends PATCH Request:                           │
│  ┌──────────────────────────────────────────┐   │
│  │ PATCH /workflows/5                       │   │
│  │ Host: localhost:8080                     │   │
│  │ Content-Type: application/json           │   │
│  │ Authorization: Bearer token123           │   │
│  │                                          │   │
│  │ Body:                                    │   │
│  │ {                                        │   │
│  │   "status": "FINAL_APPROVED"             │   │
│  │ }                                        │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
                  │
                  │ HTTP PATCH
                  ▼
┌──────────────────────────────────────────────────┐
│         Spring Boot Backend                      │
│                                                  │
│  @PatchMapping("/workflows/{id}")                │
│  WorkflowController.updateWorkflow()             │
│       │                                          │
│       ├─→ @PathVariable Long id = 5             │
│       ├─→ @RequestBody Map<String,String> body  │
│       │    → body.get("status") = "FINAL_APPROVED"
│       │                                          │
│       ├─→ Check Authorization header            │
│       ├─→ Find workflow with id=5               │
│       ├─→ Update status = "FINAL_APPROVED"      │
│       ├─→ Save to database                      │
│       │                                          │
│       ▼                                          │
│  Return Updated Workflow:                       │
│  {                                              │
│    "id": 5,                                     │
│    "status": "FINAL_APPROVED",                  │
│    "approvedBy": "leader1",                     │
│    "approvalDate": "2026-01-19T10:30:00Z"       │
│  }                                              │
│                                                  │
└──────────────────────────────────────────────────┘
                  │
                  │ JSON Response
                  ▼
┌──────────────────────────────────────────────────┐
│         React Component                          │
│                                                  │
│  Receive updated workflow                       │
│  Redux updates cache                            │
│  Component re-renders                           │
│  Show success toast: "Approved!" ✅             │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 4️⃣ Create Audit Log Flow (POST)

```
Action happens (user logs in, approves workflow, etc.)
    │
    ▼
┌────────────────────────────────────────────────┐
│      React Component                           │
│  (Any component that triggers action)          │
│                                                │
│  useLogAuditMutation()                         │
│  Called with auditData:                        │
│  {                                             │
│    "entity": "TICKET",                         │
│    "entityId": 42,                             │
│    "action": "CREATED",                        │
│    "details": "New ticket created"             │
│  }                                             │
│       │                                        │
│       ▼                                        │
│  Sends POST Request:                          │
│  ┌────────────────────────────────────────┐   │
│  │ POST /auditLogs                        │   │
│  │ Host: localhost:8080                   │   │
│  │ Content-Type: application/json         │   │
│  │ Authorization: Bearer token123         │   │
│  │                                        │   │
│  │ Body:                                  │   │
│  │ {                                      │   │
│  │   "entity": "TICKET",                  │   │
│  │   "entityId": 42,                      │   │
│  │   "action": "CREATED",                 │   │
│  │   "details": "New ticket created"      │   │
│  │ }                                      │   │
│  └────────────────────────────────────────┘   │
│                                                │
└────────────────────────────────────────────────┘
                  │
                  │ HTTP POST
                  ▼
┌────────────────────────────────────────────────┐
│     Spring Boot Backend                        │
│                                                │
│  @PostMapping("/auditLogs")                    │
│  AuditLogController.createAuditLog()           │
│       │                                        │
│       ├─→ @RequestBody Map<String, Object>    │
│       │                                        │
│       ├─→ Create new AuditLog object:          │
│       │   log.setEntity("TICKET")              │
│       │   log.setEntityId(42)                  │
│       │   log.setAction("CREATED")             │
│       │   log.setDetails("...")                │
│       │   log.setTimestamp(now)                │
│       │                                        │
│       ├─→ Save to database                     │
│       │   auditLogRepository.save(log)         │
│       │                                        │
│       ▼                                        │
│  Return Created Audit Log:                    │
│  {                                             │
│    "id": 100,                                  │
│    "entity": "TICKET",                         │
│    "entityId": 42,                             │
│    "action": "CREATED",                        │
│    "details": "New ticket created",            │
│    "timestamp": "2026-01-19T10:30:00Z"         │
│  }                                             │
│                                                │
└────────────────────────────────────────────────┘
                  │
                  │ JSON Response (201 Created)
                  ▼
┌────────────────────────────────────────────────┐
│      React Component                           │
│                                                │
│  Receive created audit log                    │
│  Update Redux cache                            │
│  Audit log saved successfully ✅              │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 5️⃣ Authorization Header Flow (Every Request)

```
Every HTTP Request from React includes:

┌────────────────────────────────────────┐
│  React App                             │
│                                        │
│  baseApi.js prepareHeaders:            │
│  ├─→ const token = localStorage.getItem("token")
│  │                                     │
│  │  If token exists:                   │
│  │  headers.set("Authorization",       │
│  │             "Bearer " + token)      │
│  │                                     │
│  └─→ token = "demo-token"              │
│                                        │
│  Resulting Header:                     │
│  Authorization: Bearer demo-token      │
│                                        │
└────────────────────────────────────────┘
          │
          ▼ (sent with every request)
┌────────────────────────────────────────┐
│  Spring Boot Controller                │
│                                        │
│  @GetMapping("/approvals")             │
│  public List<Approval> getApprovals(   │
│    @RequestHeader(value = "Authorization")
│    String authHeader                   │
│  ) {                                   │
│                                        │
│    if (authHeader != null &&           │
│        authHeader.startsWith("Bearer "))
│    {                                   │
│      String token = authHeader         │
│        .substring(7);                  │
│      // token = "demo-token"           │
│                                        │
│      // Validate token here            │
│      validateToken(token);             │
│                                        │
│      if (token is invalid)             │
│        throw new UnauthorizedException()
│        → Return 401 Unauthorized       │
│    }                                   │
│                                        │
│    // Token is valid, process request  │
│    return getAllApprovals();           │
│  }                                     │
│                                        │
└────────────────────────────────────────┘
```

---

## 📋 Request/Response Format Reference

### GET Request Example

```
GET /users?email=john@example.com&password=pass123 HTTP/1.1
Host: localhost:8080
Authorization: Bearer token123
Content-Type: application/json

(No body for GET)

---

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 256

[
  {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
]
```

### PATCH Request Example

```
PATCH /approvals/5 HTTP/1.1
Host: localhost:8080
Authorization: Bearer token123
Content-Type: application/json
Content-Length: 28

{
  "status": "APPROVED"
}

---

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 5,
  "workflowId": 123,
  "status": "APPROVED",
  "approvedBy": "admin",
  "approvalDate": "2026-01-19T10:30:00Z"
}
```

### POST Request Example

```
POST /auditLogs HTTP/1.1
Host: localhost:8080
Authorization: Bearer token123
Content-Type: application/json
Content-Length: 92

{
  "entity": "TICKET",
  "entityId": 42,
  "action": "CREATED",
  "details": "New ticket"
}

---

HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 100,
  "entity": "TICKET",
  "entityId": 42,
  "action": "CREATED",
  "details": "New ticket",
  "timestamp": "2026-01-19T10:30:00Z"
}
```

---

## 🔍 Debugging Checklist

When debugging, check in this order:

```
1. Frontend .env
   □ VITE_API_BASE_URL=http://localhost:8080
   
2. Browser DevTools → Console
   □ [API Config] Base URL: http://localhost:8080
   
3. Browser DevTools → Network
   □ Request URL: http://localhost:8080/users (or other endpoint)
   □ Method: GET / POST / PATCH
   □ Headers: Authorization: Bearer token123
   
4. Backend Spring Boot
   □ Running on port 8080
   □ CORS enabled
   □ Endpoint exists: @GetMapping("/users")
   
5. Backend Response
   □ Status: 200 OK
   □ Content-Type: application/json
   □ Body: Valid JSON array or object
   
6. Check for Errors
   □ CORS error → Add CORS config
   □ 404 error → Check endpoint path (no /api/ prefix!)
   □ 401 error → Check token validation
   □ 500 error → Check Spring Boot logs
```

---

**Use this guide to understand the exact flow of requests between React and Spring Boot!**

