# Python Backend - Spring Boot & Kubernetes Integration Guide

## Overview

This Python FastAPI backend has been updated to:
1. **Support direct calls from React frontend** (no Nginx proxy required)
2. **Enable Spring Boot backend integration** (service-to-service communication)
3. **Support Kubernetes deployment** (health checks, graceful shutdown, environment configuration)
4. **Enable CORS for cross-origin requests** (essential for microservices)

---

## Architecture Changes

### Before (Nginx Proxy)
```
React → Nginx (reverse proxy) → Spring Boot
        ↓
        → Python Backend (/api/v1/*)
```

### After (Direct Calls)
```
React → Spring Boot (port 8080)
React → Python Backend (port 8000)
Spring Boot ↔ Python Backend (service mesh)
```

---

## New Endpoints (Spring Boot Integration)

All endpoints are now exposed **without** `/api/v1` prefix for direct frontend calls:

### User Management
```
GET    /users?email={email}&password={password}     # Login
POST   /auth/logout                                  # Logout
```

### Approvals
```
GET    /approvals                                    # Get all approvals
PATCH  /approvals/{id}                               # Update approval status
```

### Workflows
```
GET    /workflows                                    # Get all workflows
PATCH  /workflows/{id}                               # Update workflow status
```

### Audit Logging
```
GET    /auditLogs                                    # Get audit logs
POST   /auditLogs                                    # Create audit log
```

### AI Insights
```
GET    /aiInsights                                   # Get AI recommendations
```

### Health & Readiness
```
GET    /health                                       # Liveness probe
GET    /readiness                                    # Readiness probe
```

---

## Configuration for Spring Boot

### Enable CORS in Spring Boot

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Call Python Backend from Spring Boot

```java
// Configure the Python backend URL
@Value("${python.backend.url:http://localhost:8000}")
private String pythonBackendUrl;

// Example: Call Python automation endpoint
RestTemplate restTemplate = new RestTemplate();
String response = restTemplate.postForObject(
    pythonBackendUrl + "/api/v1/automation/execute",
    automationEvent,
    String.class
);
```

---

## Environment Variables

### Database Configuration
```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=ieodp_user
DATABASE_PASSWORD=password
DATABASE_NAME=orchestration_db
```

### Redis/Cache
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
```

### API Configuration
```bash
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:8080,http://springboot-service:8080
```

### JWT Configuration
```bash
JWT_PUBLIC_KEY=your-public-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
```

### Environment
```bash
ENVIRONMENT=production
LOG_LEVEL=INFO
DEBUG=false
```

---

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- Docker registry
- MySQL StatefulSet
- Redis StatefulSet

### Build Docker Image

```bash
docker build -f Dockerfile.k8s -t automation-engine:2.0.0 .
docker push your-registry/automation-engine:2.0.0
```

### Deploy to Kubernetes

```bash
# Apply Kubernetes manifest
kubectl apply -f k8s-deployment.yaml

# Verify deployment
kubectl get pods -l app=automation-engine
kubectl get svc automation-engine-service

# Check logs
kubectl logs -f deployment/automation-engine

# Port forward for testing
kubectl port-forward svc/automation-engine-service 8000:8000
```

### Kubernetes Features Implemented

1. **Health Checks**
   - `GET /health` - Liveness probe (pod restart)
   - `GET /readiness` - Readiness probe (traffic routing)

2. **Graceful Shutdown**
   - SIGTERM signal handling
   - 30-second termination grace period
   - Clean connection closure

3. **Resource Management**
   - CPU: 250m request, 500m limit
   - Memory: 256Mi request, 512Mi limit
   - Auto-scaling: 2-5 replicas based on CPU/Memory

4. **Configuration Management**
   - ConfigMap for non-sensitive settings
   - Secret for database credentials
   - Environment variable injection

5. **Service Discovery**
   - ClusterIP service for internal communication
   - Service naming: `automation-engine-service`
   - Port: 8000

---

## API Usage Examples

### Login (from React)
```bash
curl -X GET "http://localhost:8000/users?email=john@example.com&password=test123"
```

### Get Approvals (with auth)
```bash
curl -X GET "http://localhost:8000/approvals" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update Approval
```bash
curl -X PATCH "http://localhost:8000/approvals/approval-001" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED", "reason": "Approved by admin"}'
```

### Create Audit Log
```bash
curl -X POST "http://localhost:8000/auditLogs" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "entity": "approval",
    "entityId": "approval-001",
    "action": "APPROVED",
    "details": {"reason": "Approved by admin"}
  }'
```

---

## Local Development

### Setup

```bash
# Create virtual environment
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=mysql+mysqldb://ieodp_user:password@localhost:3306/orchestration_db
CELERY_BROKER_URL=redis://localhost:6379/0
ENVIRONMENT=development
DEBUG=true
EOF

# Run migrations (if using Alembic)
# alembic upgrade head

# Start the application
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Access API

- **API Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health
- **Root:** http://localhost:8000/

---

## Spring Boot Integration Points

### 1. Direct API Calls
Python endpoints can be called directly from Spring Boot:

```java
@RestController
public class IntegrationController {
    
    @PostMapping("/integrate/automation")
    public ResponseEntity<?> triggerAutomation(@RequestBody AutomationRequest request) {
        // Call Python automation endpoint
        String pythonUrl = "http://automation-engine-service:8000/api/v1/automation/execute";
        // Make HTTP request to Python backend
    }
}
```

### 2. Authentication Flow
- React sends token to Spring Boot
- Spring Boot validates token (if custom auth) or passes to Python
- Python validates token using same JWT key

### 3. Async Tasks
- Spring Boot can trigger long-running tasks in Python
- Python uses Celery for background processing
- Results stored in Redis for retrieval

---

## Monitoring & Troubleshooting

### Check Service Health
```bash
# Local
curl http://localhost:8000/health
curl http://localhost:8000/readiness

# Kubernetes
kubectl exec -it <pod-name> -- curl http://localhost:8000/health
```

### View Logs
```bash
# Local
# Check console output

# Kubernetes
kubectl logs -f deployment/automation-engine
kubectl logs -f pod/automation-engine-xxxxx
```

### Database Connection
```bash
# Verify MySQL connectivity
mysql -h localhost -u ieodp_user -p -e "SELECT 1;"

# Kubernetes
kubectl exec -it mysql-0 -- mysql -u root -p -e "SELECT 1;"
```

### Redis Connection
```bash
# Local
redis-cli PING

# Kubernetes
kubectl exec -it redis-0 -- redis-cli PING
```

---

## Troubleshooting Common Issues

### CORS Errors
**Issue:** `Access to XMLHttpRequest blocked by CORS policy`
**Solution:** Verify CORS origins in config match your frontend/backend URLs

```python
# app/core/config.py
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8080"]
```

### Database Connection Failed
**Issue:** `MySQL connection error`
**Solution:** Verify DATABASE_URL and MySQL is running

```bash
# Check MySQL service
docker ps | grep mysql
# or
kubectl get pods -l app=mysql
```

### Token Invalid
**Issue:** `401 Unauthorized - Invalid token`
**Solution:** Ensure token is sent in Authorization header with "Bearer " prefix

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/approvals
```

### Service Unreachable in Kubernetes
**Issue:** Pod fails to reach Python backend
**Solution:** Verify service discovery and DNS

```bash
# Check service DNS
kubectl exec -it <pod-name> -- nslookup automation-engine-service
```

---

## Performance Tuning

### Database Connection Pooling
```python
# app/db/session.py
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,      # Number of connections
    max_overflow=20,   # Additional connections when needed
)
```

### Kubernetes Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Caching Strategy
- Use Redis for frequently accessed data
- Implement cache headers in responses
- Use Celery for async processing

---

## Next Steps

1. **Update Spring Boot configuration** to connect to this backend
2. **Deploy to Kubernetes** using `k8s-deployment.yaml`
3. **Configure environment variables** for your deployment
4. **Test endpoints** using provided curl examples
5. **Set up monitoring** (Prometheus, ELK, etc.)
6. **Implement database migrations** using Alembic
7. **Add comprehensive tests** using pytest

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Kubernetes logs
3. Verify all environment variables are set
4. Check service connectivity
