# 🚀 Guia de Deployment - Furry Friends Agenda

## Visão Geral do Deployment

Este documento detalha as estratégias de deployment, configuração de infraestrutura e processos de CI/CD para o **Furry Friends Agenda**.

---

## 🏗️ Estratégias de Deployment

### Ambientes de Deployment

#### 1. Desenvolvimento (Development)

```yaml
# docker-compose.dev.yml
version: "3.8"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: furry_friends_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    volumes:
      - dev_db_data:/var/lib/postgresql/data
    ports:
      - "5433:5432"

  backend:
    build:
      context: ./furry-friends-agenda-backend
      dockerfile: Dockerfile.dev
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://dev_user:dev_password@db:5432/furry_friends_dev
    volumes:
      - ./furry-friends-agenda-backend:/app
      - /app/node_modules
    ports:
      - "3333:3333"
    depends_on:
      - db

  frontend:
    build:
      context: ./furry-friends-agenda-app
      dockerfile: Dockerfile.dev
    environment:
      NODE_ENV: development
      VITE_API_URL: http://localhost:3333
    volumes:
      - ./furry-friends-agenda-app:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  dev_db_data:
```

#### 2. Staging/Testing

```yaml
# docker-compose.staging.yml
version: "3.8"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: furry_friends_staging
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - staging_db_data:/var/lib/postgresql/data
    networks:
      - staging_network

  redis:
    image: redis:7-alpine
    networks:
      - staging_network

  backend:
    image: furry-friends-backend:staging
    environment:
      NODE_ENV: staging
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379
    networks:
      - staging_network
    depends_on:
      - db
      - redis

  frontend:
    image: furry-friends-frontend:staging
    environment:
      VITE_API_URL: ${API_URL}
    networks:
      - staging_network
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.staging.conf:/etc/nginx/nginx.conf
    networks:
      - staging_network
    depends_on:
      - frontend

networks:
  staging_network:
    driver: bridge

volumes:
  staging_db_data:
```

#### 3. Produção (Production)

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - prod_db_data:/var/lib/postgresql/data
    networks:
      - prod_network
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "1.0"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - prod_network
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"

  backend:
    image: furry-friends-backend:${TAG:-latest}
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    networks:
      - prod_network
    depends_on:
      - db
      - redis
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
          cpus: "1.0"
      restart_policy:
        condition: on-failure

  frontend:
    image: furry-friends-frontend:${TAG:-latest}
    environment:
      VITE_API_URL: ${API_URL}
    networks:
      - prod_network
    depends_on:
      - backend
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: "0.5"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    networks:
      - prod_network
    depends_on:
      - frontend
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: "0.25"

networks:
  prod_network:
    driver: overlay

volumes:
  prod_db_data:
  redis_data:
```

---

## 🐳 Docker e Containerização

### Dockerfile Multi-stage (Backend)

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3333
USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:prod"]
```

### Dockerfile Multi-stage (Frontend)

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM base AS builder
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1
```

### Configuração Nginx

```nginx
# nginx.prod.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

    upstream backend {
        server backend:3333;
    }

    server {
        listen 80;
        server_name _;

        # Frontend
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeout settings
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## ☁️ Cloud Deployment

### AWS ECS Fargate

```yaml
# ecs-task-definition.json
{
  "family": "furry-friends-backend",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions":
    [
      {
        "name": "backend",
        "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/furry-friends-backend:latest",
        "essential": true,
        "portMappings":
          [{ "containerPort": 3333, "hostPort": 3333, "protocol": "tcp" }],
        "environment":
          [
            { "name": "NODE_ENV", "value": "production" },
            { "name": "DATABASE_URL", "value": "${DATABASE_URL}" },
            { "name": "JWT_SECRET", "value": "${JWT_SECRET}" },
          ],
        "secrets":
          [
            {
              "name": "DB_PASSWORD",
              "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/db-password",
            },
          ],
        "logConfiguration":
          {
            "logDriver": "awslogs",
            "options":
              {
                "awslogs-group": "/ecs/furry-friends-backend",
                "awslogs-region": "us-east-1",
                "awslogs-stream-prefix": "ecs",
              },
          },
        "healthCheck":
          {
            "command":
              ["CMD-SHELL", "curl -f http://localhost:3333/health || exit 1"],
            "interval": 30,
            "timeout": 5,
            "retries": 3,
            "startPeriod": 60,
          },
      },
    ],
}
```

### Google Cloud Run

```yaml
# cloud-run-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: furry-friends-backend
spec:
  template:
    spec:
      containers:
        - image: gcr.io/project-id/furry-friends-backend:latest
          ports:
            - containerPort: 3333
          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-url
                  key: url
          resources:
            limits:
              cpu: 1000m
              memory: 1Gi
          startupProbe:
            httpGet:
              path: /health
              port: 3333
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: 3333
            initialDelaySeconds: 30
            periodSeconds: 30
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: 3333
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
```

### Vercel (Frontend)

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.furryfriends.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://api.furryfriends.com"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Completo

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ${{ github.repository }}/backend
  FRONTEND_IMAGE: ${{ github.repository }}/frontend

jobs:
  # ===== TESTES =====
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: |
          cd furry-friends-agenda-backend && npm ci
          cd ../furry-friends-agenda-app && npm ci

      - name: Run linting
        run: |
          cd furry-friends-agenda-backend && npm run lint
          cd ../furry-friends-agenda-app && npm run lint

      - name: Run backend tests
        run: cd furry-friends-agenda-backend && npm run test:cov
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run frontend tests
        run: cd furry-friends-agenda-app && npm run test:run

      - name: Build applications
        run: |
          cd furry-friends-agenda-backend && npm run build
          cd ../furry-friends-agenda-app && npm run build

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          directory: ./coverage

  # ===== SEGURANÇA =====
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run security audit
        run: |
          cd furry-friends-agenda-backend && npm audit --audit-level high
          cd ../furry-friends-agenda-app && npm audit --audit-level high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --file=furry-friends-agenda-backend/package.json

  # ===== BUILD =====
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for backend
        id: meta-backend
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.BACKEND_IMAGE }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push backend image
        uses: docker/build-push-action@v4
        with:
          context: ./furry-friends-agenda-backend
          push: true
          tags: ${{ steps.meta-backend.outputs.tags }}
          labels: ${{ steps.meta-backend.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Extract metadata for frontend
        id: meta-frontend
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.FRONTEND_IMAGE }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push frontend image
        uses: docker/build-push-action@v4
        with:
          context: ./furry-friends-agenda-app
          push: true
          tags: ${{ steps.meta-frontend.outputs.tags }}
          labels: ${{ steps.meta-frontend.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ===== DEPLOY STAGING =====
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # Commands to deploy to staging

  # ===== DEPLOY PRODUCTION =====
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment..."
          # Commands to deploy to production
```

---

## 📊 Monitoramento e Observabilidade

### Métricas de Aplicação

```typescript
// metrics.service.ts
import { Injectable } from "@nestjs/common";
import {
  register,
  collectDefaultMetrics,
  Gauge,
  Counter,
  Histogram,
} from "prom-client";

@Injectable()
export class MetricsService {
  private readonly httpRequestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  });

  private readonly activeUsers = new Gauge({
    name: "active_users_total",
    help: "Number of active users",
  });

  private readonly appointmentsCreated = new Counter({
    name: "appointments_created_total",
    help: "Total number of appointments created",
  });

  constructor() {
    collectDefaultMetrics({ register });
  }

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number
  ) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration);
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }

  incrementAppointmentsCreated() {
    this.appointmentsCreated.inc();
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
```

### Dashboard Grafana

```json
// grafana-dashboard.json
{
  "dashboard": {
    "title": "Furry Friends Agenda - Production",
    "tags": ["furry-friends", "production"],
    "timezone": "browser",
    "panels": [
      {
        "title": "HTTP Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_users_total",
            "legendFormat": "Active Users"
          }
        ]
      },
      {
        "title": "Appointments Created",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(appointments_created_total[5m])",
            "legendFormat": "Appointments/min"
          }
        ]
      }
    ]
  }
}
```

### Alertas Prometheus

```yaml
# alert-rules.yml
groups:
  - name: furry-friends-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: 'Error rate is {{ $value | printf "%.2f" }}%'

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time detected"
          description: '95th percentile response time is {{ $value | printf "%.2f" }}s'

      - alert: DatabaseConnectionIssues
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection lost"
          description: "PostgreSQL is down"

      - alert: HighMemoryUsage
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: 'Memory usage is {{ $value | printf "%.2f" }}%'
```

---

## 🔄 Estratégias de Backup e Recuperação

### Backup Automático

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="furry_friends_backup_$TIMESTAMP"

# Backup do banco de dados
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/$BACKUP_NAME.sql

# Compressão
gzip $BACKUP_DIR/$BACKUP_NAME.sql

# Upload para S3
aws s3 cp $BACKUP_DIR/$BACKUP_NAME.sql.gz s3://furry-friends-backups/

# Limpeza de backups antigos (manter últimos 30 dias)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Log
echo "$(date): Backup completed - $BACKUP_NAME" >> /var/log/backup.log
```

### Estratégia de Recuperação

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Parar aplicação
docker-compose down

# Restaurar banco
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Reiniciar aplicação
docker-compose up -d

# Verificar integridade
curl -f http://localhost/health || echo "Health check failed"
```

### Backup de Configuração

```yaml
# backup-config.yml
version: "3.8"
services:
  backup:
    image: alpine:latest
    volumes:
      - ./backups:/backups
      - ./config:/config
    command: >
      sh -c "
        apk add --no-cache postgresql-client aws-cli &&
        # Database backup
        pg_dump -h db -U postgres furry_friends > /backups/db_backup.sql &&
        # Config backup
        tar -czf /backups/config_backup.tar.gz /config &&
        # Upload to cloud
        aws s3 sync /backups s3://furry-friends-backups/daily/
      "
    depends_on:
      - db
    networks:
      - backup_network
```

---

## 🚨 Plano de Rollback

### Rollback Automático

```bash
#!/bin/bash
# rollback.sh

DEPLOYMENT_ID=$1
ROLLBACK_TAG=$2

if [ -z "$DEPLOYMENT_ID" ] || [ -z "$ROLLBACK_TAG" ]; then
    echo "Usage: $0 <deployment_id> <rollback_tag>"
    exit 1
fi

# Log rollback start
echo "$(date): Starting rollback for deployment $DEPLOYMENT_ID to $ROLLBACK_TAG" >> /var/log/rollback.log

# Update deployment
kubectl set image deployment/furry-friends-backend backend=furry-friends-backend:$ROLLBACK_TAG
kubectl set image deployment/furry-friends-frontend frontend=furry-friends-frontend:$ROLLBACK_TAG

# Wait for rollout
kubectl rollout status deployment/furry-friends-backend
kubectl rollout status deployment/furry-friends-frontend

# Health check
if curl -f http://api.furryfriends.com/health; then
    echo "$(date): Rollback successful" >> /var/log/rollback.log
    # Notify team
    curl -X POST -H 'Content-type: application/json' \
         --data '{"text":"✅ Rollback successful for deployment '"$DEPLOYMENT_ID"' to '"$ROLLBACK_TAG"'"}' \
         $SLACK_WEBHOOK_URL
else
    echo "$(date): Rollback failed - manual intervention required" >> /var/log/rollback.log
    # Critical alert
    curl -X POST -H 'Content-type: application/json' \
         --data '{"text":"🚨 Rollback failed for deployment '"$DEPLOYMENT_ID"' - MANUAL INTERVENTION REQUIRED"}' \
         $SLACK_WEBHOOK_URL
fi
```

### Estratégia Blue-Green

```yaml
# blue-green-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: furry-friends-backend-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: furry-friends-backend
      version: blue
  template:
    metadata:
      labels:
        app: furry-friends-backend
        version: blue
    spec:
      containers:
        - name: backend
          image: furry-friends-backend:new-version
          ports:
            - containerPort: 3333

---
apiVersion: v1
kind: Service
metadata:
  name: furry-friends-backend-service
spec:
  selector:
    app: furry-friends-backend
    version: blue # Switch to green when ready
  ports:
    - port: 80
      targetPort: 3333
```

---

## 📈 Escalabilidade e Performance

### Auto-scaling Horizontal

```yaml
# hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: furry-friends-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: furry-friends-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
```

### Cache Estratégico

```typescript
// cache.service.ts
@Injectable()
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }

  // Cache para dados frequentes
  async getUserProfile(userId: string) {
    const cacheKey = `user:profile:${userId}`;
    let profile = await this.get(cacheKey);

    if (!profile) {
      profile = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
      await this.set(cacheKey, profile, 600); // 10 minutes
    }

    return profile;
  }
}
```

### CDN e Edge Computing

```typescript
// CDN invalidation
const invalidateCDN = async (paths: string[]) => {
  const cloudfront = new AWS.CloudFront();

  await cloudfront
    .createInvalidation({
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    })
    .promise();
};
```

---

## 🔧 Manutenção e Operações

### Tarefas de Manutenção

```bash
# maintenance.sh
#!/bin/bash

# Database maintenance
echo "Running database maintenance..."
docker-compose exec db vacuumdb --all --analyze

# Clear old logs
echo "Cleaning old logs..."
find /var/log/furry-friends -name "*.log" -mtime +30 -delete

# Update dependencies
echo "Updating dependencies..."
npm audit fix

# Restart services
echo "Restarting services..."
docker-compose restart

# Health check
echo "Running health checks..."
curl -f http://localhost/health || echo "Health check failed"
```

### Window de Manutenção

```yaml
# maintenance-window.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: maintenance-config
data:
  maintenance.enabled: "false"
  maintenance.message: "Sistema em manutenção. Retorne em breve."
  maintenance.start: "2024-01-15T02:00:00Z"
  maintenance.end: "2024-01-15T04:00:00Z"
  maintenance.allowed_ips: "192.168.1.0/24,10.0.0.0/8"
```

### Monitoramento de Recursos

```bash
# resource-monitor.sh
#!/bin/bash

# CPU usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

# Memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')

# Disk usage
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

# Send metrics
curl -X POST http://monitoring.internal/metrics \
  -H "Content-Type: application/json" \
  -d "{\"cpu\": $CPU_USAGE, \"memory\": $MEM_USAGE, \"disk\": $DISK_USAGE}"
```

---

## 📚 Referências e Padrões

### Padrões de Deployment

- **12-Factor App**: Metodologia para aplicações cloud-native
- **Infrastructure as Code**: Terraform, CloudFormation
- **GitOps**: Flux, ArgoCD
- **Observability**: Logs, métricas, traces

### Ferramentas Recomendadas

- **Container Orchestration**: Kubernetes, Docker Swarm
- **Service Mesh**: Istio, Linkerd
- **API Gateway**: Kong, Traefik
- **Load Balancer**: NGINX, HAProxy
- **Monitoring**: Prometheus, Grafana, ELK Stack

---

**Última atualização:** Outubro 2025
**Versão do Guia:** 2.0
