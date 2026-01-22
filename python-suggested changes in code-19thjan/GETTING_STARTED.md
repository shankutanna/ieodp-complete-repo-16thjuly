# Getting Started - Python Backend Integration

## Quick Start (5 minutes)

### 1. Local Setup (No Docker)

```bash
# Clone and navigate
cd python-backend

# Create virtual environment
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.local .env

# Run the application
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: **http://localhost:8000**

### 2. Docker Compose Setup (Recommended)

```bash
# Navigate to project
cd python-backend

# Start all services (MySQL, Redis, Python Backend, Celery)
docker-compose up -d

# View logs
docker-compose logs -f python-backend

# Stop services
docker-compose down
```

API will be available at: **http://localhost:8000**

---

## Testing the Endpoints

### 1. Check Service Health

```bash
# Liveness probe
curl http://localhost:8000/health

# Readiness probe
curl http://localhost:8000/readiness

# API documentation
curl http://localhost:8000/docs  # Open in browser
```

### 2. Login (User Authentication)

```bash
# Get users (login flow)
curl -X GET "http://localhost:8000/users?email=test@example.com&password=test123"

# Response
[
  {
    "id": "user-001",
    "email": "test@example.com",
    "name": "Demo User",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### 3. Authentication with Bearer Token

```bash
# First, you need a token (for testing, any JWT works)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsImV4cCI6OTk5OTk5OTk5OX0.test"

# Get approvals
curl -X GET "http://localhost:8000/approvals" \
  -H "Authorization: Bearer $TOKEN"

# Get workflows
curl -X GET "http://localhost:8000/workflows" \
  -H "Authorization: Bearer $TOKEN"

# Get AI insights
curl -X GET "http://localhost:8000/aiInsights" \
  -H "Authorization: Bearer $TOKEN"

# Get audit logs
curl -X GET "http://localhost:8000/auditLogs" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Approval Status

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsImV4cCI6OTk5OTk5OTk5OX0.test"

curl -X PATCH "http://localhost:8000/approvals/approval-001" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "reason": "Approved by admin"
  }'
```

### 5. Create Audit Log

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsImV4cCI6OTk5OTk5OTk5OX0.test"

curl -X POST "http://localhost:8000/auditLogs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity": "approval",
    "entityId": "approval-001",
    "action": "APPROVED",
    "details": {
      "reason": "Approved by admin",
      "approver": "John Doe"
    }
  }'
```

### 6. Logout

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsImV4cCI6OTk5OTk5OTk5OX0.test"

curl -X POST "http://localhost:8000/auth/logout" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Kubernetes Deployment

### Prerequisites
- kubectl configured
- Docker image pushed to registry
- MySQL and Redis running in cluster

### Deploy

```bash
# Apply configuration and deployment
kubectl apply -f k8s-deployment.yaml

# Verify deployment
kubectl get pods -l app=automation-engine
kubectl get svc automation-engine-service

# Port forward for testing
kubectl port-forward svc/automation-engine-service 8000:8000

# Check logs
kubectl logs -f deployment/automation-engine

# Describe pod for debugging
kubectl describe pod <pod-name>
```

### Scale Up/Down

```bash
# Manually scale
kubectl scale deployment automation-engine --replicas=3

# Auto-scaling is enabled (see HPA in k8s-deployment.yaml)
# Min: 2 replicas, Max: 5 replicas
kubectl get hpa automation-engine-hpa
```

### Update Deployment

```bash
# Update image
kubectl set image deployment/automation-engine \
  automation-engine=your-registry/automation-engine:2.0.1

# Rollout status
kubectl rollout status deployment/automation-engine

# Rollback if needed
kubectl rollout undo deployment/automation-engine
```

---

## Integration with Spring Boot

### 1. Configure Spring Boot

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

### 2. Call Python Backend from Spring Boot

```java
@RestController
@RequestMapping("/api/integration")
public class IntegrationController {
    
    @Value("${python.backend.url:http://localhost:8000}")
    private String pythonBackendUrl;
    
    @PostMapping("/automation")
    public ResponseEntity<?> triggerAutomation(@RequestBody AutomationEvent event) {
        String pythonUrl = pythonBackendUrl + "/api/v1/automation/execute";
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            String response = restTemplate.postForObject(
                pythonUrl,
                event,
                String.class
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> checkPythonHealth() {
        String healthUrl = pythonBackendUrl + "/health";
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            String response = restTemplate.getForObject(healthUrl, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(503).body("Python backend unavailable");
        }
    }
}
```

### 3. Configuration in application.properties

```properties
# Python Backend Connection
python.backend.url=http://localhost:8000

# For Kubernetes
# python.backend.url=http://automation-engine-service:8000
```

---

## Monitoring & Logs

### Local Logs

```bash
# View container logs
docker-compose logs -f python-backend

# View specific service
docker-compose logs -f celery-worker
```

### Kubernetes Logs

```bash
# Pod logs
kubectl logs -f deployment/automation-engine

# Specific pod
kubectl logs -f pod/automation-engine-xxxxx

# Previous logs (if container crashed)
kubectl logs -p pod/automation-engine-xxxxx

# Stream logs from multiple pods
kubectl logs -f deployment/automation-engine --tail=100
```

### Health Checks

```bash
# Local
curl http://localhost:8000/health
curl http://localhost:8000/readiness

# Kubernetes pod
kubectl exec -it pod/automation-engine-xxxxx -- curl http://localhost:8000/health
```

---

## Troubleshooting

### Issue: Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: Database Connection Failed

```bash
# Check MySQL service
docker-compose ps mysql

# Check MySQL connectivity
docker-compose exec mysql mysql -u ieodp_user -p orchestration_db -e "SELECT 1;"

# View MySQL logs
docker-compose logs mysql
```

### Issue: Redis Connection Failed

```bash
# Check Redis service
docker-compose ps redis

# Test Redis
docker-compose exec redis redis-cli ping

# View Redis logs
docker-compose logs redis
```

### Issue: CORS Errors

**Error:** `Access to XMLHttpRequest from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** Check CORS_ORIGINS in .env matches your frontend URL

```bash
# .env
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Issue: 401 Unauthorized

**Error:** `{"detail":"Authorization header required"}`

**Solution:** Include Bearer token in Authorization header

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/approvals
```

### Issue: Service Unreachable in Kubernetes

```bash
# Check DNS
kubectl exec -it pod/automation-engine-xxxxx -- nslookup automation-engine-service

# Check service endpoints
kubectl get endpoints automation-engine-service

# Check pod network
kubectl exec -it pod/automation-engine-xxxxx -- curl http://automation-engine-service:8000/health
```

---

## Development Workflow

### 1. Code Changes (with Docker Compose)

```bash
# Hot reload is enabled
# Edit files in app/ and changes will be reflected

# View logs
docker-compose logs -f python-backend

# Restart service if needed
docker-compose restart python-backend
```

### 2. Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest app/tests/test_api.py

# Run with coverage
pytest --cov=app

# Run in docker
docker-compose exec python-backend pytest
```

### 3. Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Add new column"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

---

## Performance Tips

1. **Enable Connection Pooling** - Already configured in `app/db/session.py`
2. **Use Redis for Caching** - Configured in config
3. **Async Task Processing** - Use Celery for long-running tasks
4. **Database Indexing** - Add indices on frequently queried columns
5. **API Response Caching** - Implement cache headers

---

## Next Steps

1. ✅ Start application locally or with Docker
2. ✅ Test endpoints using provided curl examples
3. ✅ Configure Spring Boot integration
4. ✅ Deploy to Kubernetes
5. ✅ Set up monitoring (Prometheus, ELK)
6. ✅ Implement database models and migrations
7. ✅ Add comprehensive unit and integration tests

---

## Documentation

- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **Alternative Docs:** http://localhost:8000/redoc (ReDoc)
- **Integration Guide:** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Spring Boot Changes:** [SPRINGBOOT_INTEGRATION.md](SPRINGBOOT_INTEGRATION.md)
- **Kubernetes Deployment:** [k8s-deployment.yaml](k8s-deployment.yaml)
