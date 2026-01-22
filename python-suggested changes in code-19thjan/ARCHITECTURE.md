# Architecture & System Design

## System Architecture

### Deployment Architecture (Kubernetes)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Ingress / Load Balancer              │  │
│  │  (Routes traffic to Spring Boot and Python services)   │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│        ┌────────────┴─────────────┬─────────────────┐          │
│        │                          │                 │          │
│        ▼                          ▼                 ▼          │
│  ┌──────────────┐         ┌──────────────┐   ┌─────────────┐  │
│  │ Spring Boot  │         │   Python     │   │   MySQL     │  │
│  │  Service     │◄────────┤  FastAPI     │   │  Database   │  │
│  │  (8080)      │         │  Service     │   │             │  │
│  │              │         │  (8000)      │   │  (3306)     │  │
│  │ - Users      │         │              │   │             │  │
│  │ - Approvals  │         │ - Rules      │   └─────────────┘  │
│  │ - Workflows  │         │ - Automation │                    │
│  │              │         │ - Audit Logs │   ┌─────────────┐  │
│  └──────────────┘         │              │   │    Redis    │  │
│                           │              │   │   Cache     │  │
│                           └──────────────┘   │  (6379)     │  │
│                                   │          │             │  │
│                                   │          └─────────────┘  │
│                                   ▼                            │
│                           ┌──────────────┐                    │
│                           │   Celery     │                    │
│                           │   Worker     │                    │
│                           │              │                    │
│                           │ Background   │                    │
│                           │ Tasks        │                    │
│                           └──────────────┘                    │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow - Login

```
┌──────────────┐
│ React App    │
│ (Browser)    │
└──────┬───────┘
       │
       │ GET /users?email=...&password=...
       │ (with Bearer token if exists)
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌──────────────────┐                   ┌──────────────────┐
│ Spring Boot      │                   │  Python FastAPI  │
│ (CORS enabled)   │                   │  /users endpoint │
│                  │                   │                  │
│ Routes to:       │                   │ - Validates token│
│ - /approvals     │                   │ - Returns user   │
│ - /workflows     │                   │ - 200 OK + user  │
│ - /auth/logout   │                   │   object        │
└──────┬───────────┘                   └────────┬─────────┘
       │                                        │
       │ JWT Token                             │
       │ Generated                              │
       │                                        │
       └────────────┬────────────────────────┬──┘
                    │                        │
                    ▼                        ▼
             ┌──────────────┐         ┌──────────────┐
             │localStorage  │         │localStorage  │
             │ (token)      │         │ (user data)  │
             └──────────────┘         └──────────────┘
```

### Request Flow - Approvals Update

```
┌──────────────┐
│ React App    │
│ (with token) │
└──────┬───────┘
       │
       │ PATCH /approvals/id
       │ Authorization: Bearer <token>
       │ Body: { status: "APPROVED" }
       │
       ▼
┌──────────────────────────────────────┐
│  Python FastAPI                      │
│  /approvals/{id} endpoint            │
│                                      │
│  1. Extract Bearer token             │
│  2. Verify token signature           │
│  3. Validate request body            │
│  4. Update database                  │
│  5. Create audit log (async)         │
│  6. Return updated approval + 200    │
│                                      │
│  Database Query:                     │
│  UPDATE approvals SET status=...     │
│  WHERE id = id                       │
└──────┬───────────────────────────────┘
       │
       ├─────────────────┬──────────────┐
       │                 │              │
       ▼                 ▼              ▼
  ┌─────────┐    ┌──────────────┐  ┌──────────┐
  │ MySQL   │    │ Celery Task  │  │ Response │
  │ Updated │    │ (async audit)│  │ to React │
  └─────────┘    └──────┬───────┘  └──────────┘
                        │
                        ▼
                  ┌─────────────┐
                  │ Audit Log   │
                  │ Stored in   │
                  │ Database    │
                  └─────────────┘
```

## Service Communication

### Intra-Service Communication (Kubernetes)

```
Spring Boot Service
   │
   │ HTTP (service DNS)
   │ http://automation-engine-service:8000
   │
   ▼
Python FastAPI Service
   │
   ├─── /api/v1/automation/execute (internal)
   ├─── /approvals (shared)
   └─── /workflows (shared)
   │
   ▼
MySQL + Redis + Celery
```

### Cross-Origin Communication (CORS)

```
Frontend (React)
   │
   ├─ CORS preflight (OPTIONS)
   │  Request: Origin: http://localhost:3000
   │  Response: Access-Control-Allow-Origin: http://localhost:3000
   │
   └─ Actual Request (GET/POST/PATCH)
      With CORS headers validation
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Login                                           │
│    POST /users?email=...&password=...                  │
└──────┬────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Token Generated                                      │
│    JWT Token (HS256 or RS256)                          │
│    Payload: { sub: user-id, exp: timestamp }           │
│    Sent in Authorization: Bearer <token>               │
└──────┬────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Subsequent Requests                                  │
│    GET /approvals                                       │
│    Authorization: Bearer <token>                       │
└──────┬────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Token Verification                                   │
│    - Extract token from header                          │
│    - Verify signature (if JWT_PUBLIC_KEY set)          │
│    - Check expiration                                   │
│    - Extract user from payload                         │
└──────┬────────────────────────────────────────────────┘
       │
       ├─ Valid  ──┐
       │            ▼
       │    ┌─────────────────┐
       │    │ Process Request │
       │    │ Return Data     │
       │    └─────────────────┘
       │
       └─ Invalid ──┐
                    ▼
           ┌─────────────────┐
           │ 401 Unauthorized│
           │ Error Response  │
           └─────────────────┘
```

## Database Schema (Conceptual)

```
┌──────────────────┐
│     Users        │
├──────────────────┤
│ id (PK)          │
│ email            │
│ name             │
│ role             │
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐
│   Approvals      │
├──────────────────┤
│ id (PK)          │
│ workflow_id (FK) │
│ status           │
│ requester_id (FK)│
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐
│   Workflows      │
├──────────────────┤
│ id (PK)          │
│ name             │
│ status           │
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐
│   AuditLogs      │
├──────────────────┤
│ id (PK)          │
│ entity           │
│ entity_id        │
│ action           │
│ user_id (FK)     │
│ details (JSON)   │
│ timestamp        │
└──────────────────┘
```

## API Endpoint Structure

### Root Level (Direct Calls)
```
GET    /health                          Liveness probe
GET    /readiness                       Readiness probe
GET    /users                           Login
POST   /auth/logout                     Logout
GET    /approvals                       Get approvals
PATCH  /approvals/{id}                  Update approval
GET    /workflows                       Get workflows
PATCH  /workflows/{id}                  Update workflow
GET    /auditLogs                       Get audit logs
POST   /auditLogs                       Create audit log
GET    /aiInsights                      Get AI insights
```

### Versioned API (Internal)
```
GET    /api/v1/health                   Health check
POST   /api/v1/automation/execute       Execute automation
GET    /api/v1/rules                    Get rules
POST   /api/v1/rules                    Create rule
```

## Configuration Layers

```
┌─────────────────────────────────────┐
│  Environment Variables (Highest)    │
│  - DATABASE_URL                     │
│  - CORS_ORIGINS                     │
│  - JWT_PUBLIC_KEY                   │
│  - ENVIRONMENT                      │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  .env File (Development)            │
│  - Local overrides                  │
│  - Sensitive data                   │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  Kubernetes Secrets & ConfigMap     │
│  - Production values                │
│  - Encrypted secrets                │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  app/core/config.py (Defaults)      │
│  - Fallback values                  │
│  - Type validation                  │
└─────────────────────────────────────┘
```

## Kubernetes Resource Flow

```
┌─────────────────────────────────────┐
│  kubectl apply -f k8s-deployment.yaml│
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────────────────────┐
    │          │                          │
    ▼          ▼                          ▼
┌────────┐ ┌────────────┐           ┌─────────┐
│ConfigMap│ │   Secret   │           │Deployment
│         │ │            │           │          │
│- ENV    │ │- DB Pass   │           │- Replicas
│- Ports  │ │- JWT Key   │           │- Image
│- CORS   │ │- DB Host   │           │- Probes
└────────┘ └────────────┘           └─────┬────┘
                │                        │
                └────────────┬───────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │   Pod Template   │
                   │                  │
                   │ Container:       │
                   │ - Env vars       │
                   │ - Volumes        │
                   │ - Health checks  │
                   │ - Resources      │
                   └──────────┬───────┘
                              │
                              ▼
                   ┌──────────────────┐
                   │  Pod (Instance)  │
                   │                  │
                   │ Running Python   │
                   │ FastAPI app      │
                   └──────────┬───────┘
                              │
            ┌─────────────────┴─────────┐
            │                           │
            ▼                           ▼
    ┌──────────────┐          ┌──────────────┐
    │ Port 8000    │          │ Environment  │
    │ (HTTP API)   │          │ Variables    │
    └──────────────┘          └──────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────┐
│  Application Metrics                │
│  - Request count                    │
│  - Response time                    │
│  - Error rate                       │
│  - Database connections             │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  Kubernetes Metrics                 │
│  - CPU usage                        │
│  - Memory usage                     │
│  - Pod restarts                     │
│  - Health probe status              │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  Monitoring Stack (Optional)        │
│  - Prometheus (metrics)             │
│  - Grafana (dashboards)             │
│  - ELK (logs)                       │
│  - Jaeger (traces)                  │
└─────────────────────────────────────┘
```

## Deployment Workflow

```
┌──────────────────────────────────┐
│ 1. Code Changes (GitHub)         │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ 2. CI Pipeline                   │
│    - Test code                   │
│    - Build Docker image          │
│    - Push to registry            │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ 3. Deploy to Kubernetes          │
│    - Update image tag            │
│    - Apply manifests             │
│    - Rolling update              │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ 4. Health Checks                 │
│    - Liveness probe              │
│    - Readiness probe             │
│    - Traffic routing             │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ 5. Monitoring & Observability    │
│    - Metrics collection          │
│    - Log aggregation             │
│    - Alert management            │
└──────────────────────────────────┘
```

---

This architecture ensures:
- ✅ High availability (multiple replicas, auto-scaling)
- ✅ Graceful failure handling (health probes, auto-restart)
- ✅ Zero-downtime deployments (rolling updates)
- ✅ Security (RBAC, secrets management)
- ✅ Observability (logs, metrics, traces)
- ✅ Scalability (auto-scaling, load balancing)
