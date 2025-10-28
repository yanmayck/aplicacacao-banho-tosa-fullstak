# 🏗️ Arquitetura do Sistema - Furry Friends Agenda

## Visão Geral da Arquitetura

O **Furry Friends Agenda** é uma aplicação full-stack completa para gestão de pet shops, construída com tecnologias modernas e seguindo as melhores práticas de desenvolvimento.

---

## 📊 Arquitetura Geral

### Padrão Arquitetural

```mermaid
graph TB
    %% Interface do Usuário
    subgraph "🖥️ Interface do Usuário"
        UI[Interface do Usuário]
    end

    %% Frontend
    subgraph "🌐 Frontend"
        FE[Frontend<br/>React + Vite]
        FE_Components[Components<br/>UI + Business]
        FE_Pages[Pages<br/>+ Hooks]
        FE_Context[Context API<br/>+ TanStack Query]
    end

    %% Backend
    subgraph "🚀 Backend"
        API[API<br/>REST/GraphQL]
        Controllers[Controllers]
        Services[Services]
    end

    %% Plugins
    subgraph "🔌 Plugins"
        PluginSys[Sistema de Plugins]
        Registry[Plugin Registry]
        Hooks[Hook System]
    end

    %% Database
    subgraph "🗄️ Database"
        DB[(PostgreSQL)]
        Prisma[Prisma ORM]
    end

    %% Security
    subgraph "🔐 Security"
        Auth[JWT Auth]
        Guards[Guards & RBAC]
    end

    %% Infrastructure
    subgraph "🐳 Infrastructure"
        Docker[Docker<br/>Containers]
        Monitoring[Monitoring<br/>+ Logging]
    end

    %% Microservices
    subgraph "🔄 Microservices"
        Payments[Payments<br/>Service]
        Reports[Reports<br/>Service]
    end

    %% Conexões
    UI --> FE
    FE --> API
    API --> Controllers
    Controllers --> Services
    Services --> DB
    Services --> PluginSys
    PluginSys --> Registry
    PluginSys --> Hooks
    DB --> Prisma
    API --> Auth
    API --> Guards
    Services --> Docker
    Services --> Monitoring
    Services --> Payments
    Services --> Reports

    %% Estilos
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef plugins fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef database fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef security fill:#ffebee,stroke:#b71c1c,stroke-width:2px
    classDef infra fill:#f3e5f5,stroke:#880e4f,stroke-width:2px
    classDef micro fill:#e0f2f1,stroke:#004d40,stroke-width:2px

    class FE,FE_Components,FE_Pages,FE_Context frontend
    class API,Controllers,Services backend
    class PluginSys,Registry,Hooks plugins
    class DB,Prisma database
    class Auth,Guards security
    class Docker,Monitoring infra
    class Payments,Reports micro
```

---

## 🏢 Hierarquia Multi-Tenant

### Estrutura de Acesso por Níveis

```mermaid
graph TD
    %% Super Admin
    SA[SUPER_ADMIN<br/>👑 Administrador Global]
    SA --> CA1[COMPANY_ADMIN<br/>🏢 Admin Empresa A]
    SA --> CA2[COMPANY_ADMIN<br/>🏢 Admin Empresa B]
    SA --> CA3[COMPANY_ADMIN<br/>🏢 Admin Empresa C]

    %% Company Admins
    CA1 --> MA1[MANAGER<br/>👨‍💼 Gerente Loja 1]
    CA1 --> MA2[MANAGER<br/>👨‍💼 Gerente Loja 2]
    CA2 --> MA3[MANAGER<br/>👨‍💼 Gerente Loja 1]
    CA3 --> MA4[MANAGER<br/>👨‍💼 Gerente Loja 1]

    %% Managers
    MA1 --> E1[EMPLOYEE<br/>👷 Funcionário 1]
    MA1 --> E2[EMPLOYEE<br/>👷 Funcionário 2]
    MA2 --> E3[EMPLOYEE<br/>👷 Funcionário 3]
    MA3 --> E4[EMPLOYEE<br/>👷 Funcionário 4]
    MA4 --> E5[EMPLOYEE<br/>👷 Funcionário 5]

    %% Data Isolation
    subgraph "Empresa A"
        CA1
        MA1
        MA2
        E1
        E2
        E3
    end

    subgraph "Empresa B"
        CA2
        MA3
        E4
    end

    subgraph "Empresa C"
        CA3
        MA4
        E5
    end

    %% Permissions
    SA -.->|Full Access| DB[(Database<br/>Multi-Tenant)]
    CA1 -.->|Company Data| DB
    CA2 -.->|Company Data| DB
    CA3 -.->|Company Data| DB

    %% Estilos
    classDef superAdmin fill:#ffebee,stroke:#b71c1c,stroke-width:3px,color:#b71c1c
    classDef companyAdmin fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#e65100
    classDef manager fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#2e7d32
    classDef employee fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#1565c0
    classDef database fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class SA superAdmin
    class CA1,CA2,CA3 companyAdmin
    class MA1,MA2,MA3,MA4 manager
    class E1,E2,E3,E4,E5 employee
    class DB database
```

### Isolamento de Dados Multi-Tenant

- **Database Level**: Schema separado por empresa
- **Row Level Security**: Políticas RLS no PostgreSQL
- **Application Level**: Guards e middleware de isolamento
- **Cache Level**: Namespaces isolados por tenant

---

## 🏛️ Componentes da Arquitetura

### 1. 🎨 Frontend - Interface do Usuário

#### Tecnologias

- **Framework**: React 18+ com TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui + TailwindCSS
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod

#### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn)
│   │   ├── forms/          # Formulários específicos
│   │   ├── layout/         # Layout e navegação
│   │   └── business/       # Componentes de negócio
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Hooks customizados
│   ├── context/            # Context providers
│   ├── services/           # Chamadas de API
│   ├── types/              # Definições TypeScript
│   ├── lib/                # Utilitários
│   └── utils/              # Funções auxiliares
├── public/                 # Assets estáticos
├── tests/                  # Testes unitários/e2e
└── docs/                   # Documentação específica
```

#### Padrões de Componentes

- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **Custom Hooks**: Lógica reutilizável separada dos componentes
- **Compound Components**: Componentes compostos para APIs flexíveis
- **Render Props**: Para compartilhamento de lógica complexa

### 2. 🚀 Backend - API e Lógica de Negócio

#### Tecnologias

- **Framework**: NestJS (Node.js)
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Banco**: PostgreSQL
- **Autenticação**: JWT + Passport
- **Validação**: Class Validator + Class Transformer
- **Documentação**: Swagger/OpenAPI

#### Estrutura de Diretórios

```
backend/
├── src/
│   ├── modules/            # Módulos do NestJS
│   │   ├── auth/          # Autenticação
│   │   ├── users/         # Gestão de usuários
│   │   ├── clients/       # Gestão de clientes
│   │   ├── pets/          # Gestão de pets
│   │   ├── appointments/  # Agendamentos
│   │   ├── services/      # Serviços oferecidos
│   │   ├── financial/     # Financeiro
│   │   ├── reports/       # Relatórios
│   │   ├── notifications/ # Notificações
│   │   └── plugins/       # Sistema de plugins
│   ├── shared/            # Código compartilhado
│   │   ├── decorators/   # Decorators customizados
│   │   ├── guards/       # Guards de segurança
│   │   ├── interceptors/ # Interceptors
│   │   ├── filters/      # Exception filters
│   │   ├── pipes/        # Pipes de validação
│   │   └── utils/        # Utilitários
│   ├── config/           # Configurações
│   ├── types/            # Tipos TypeScript
│   └── main.ts           # Ponto de entrada
├── prisma/               # Schema do banco
├── test/                 # Testes
└── docs/                 # Documentação da API
```

#### Padrões Arquiteturais

- **Clean Architecture**: Separação clara de responsabilidades
- **Dependency Injection**: Injeção de dependências do NestJS
- **Repository Pattern**: Abstração do acesso a dados
- **CQRS**: Command Query Responsibility Segregation (opcional)
- **Event Sourcing**: Para auditoria e rastreabilidade

### 3. 🗄️ Banco de Dados

#### Modelo de Dados

```prisma
// Usuários e Autenticação
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Clientes e Pets
model Client {
  id           String   @id @default(cuid())
  name         String
  phone        String?
  email        String?  @unique
  address      String?
  pets         Pet[]
  appointments Appointment[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Pet {
  id           String     @id @default(cuid())
  name         String
  species      String
  breed        String?
  birthDate    String?
  clientId     String
  client       Client     @relation(fields: [clientId], references: [id])
  appointments Appointment[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

// Agendamentos e Serviços
model ServicePackage {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  price       Float
  durationMin Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Appointment {
  id            String            @id @default(cuid())
  dateTime      DateTime
  status        AppointmentStatus @default(SCHEDULED)
  notes         String?
  totalPrice    Float
  clientId      String
  client        Client            @relation(fields: [clientId], references: [id])
  petId         String
  pet           Pet               @relation(fields: [petId], references: [id])
  groomerId     String?
  groomer       Groomer?          @relation(fields: [groomerId], references: [id])
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}

// Financeiro
model Transaction {
  id          String          @id @default(cuid())
  type        TransactionType
  amount      Float
  description String
  date        DateTime        @default(now())
  categoryId  String
  category    FinancialCategory @relation(fields: [categoryId], references: [id])
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

// Sistema de Plugins
model Plugin {
  id          String      @id @default(cuid())
  name        String      @unique
  version     String
  description String?
  author      String
  isActive    Boolean     @default(false)
  isInstalled Boolean     @default(false)
  config      Json?
  permissions Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

#### Estratégias de Indexação

- Índices compostos para consultas frequentes
- Índices parciais para status específicos
- Índices de texto completo para buscas
- Índices de data para relatórios temporais

### 4. 🔌 Sistema de Plugins

#### Arquitetura de Extensibilidade

```mermaid
graph TD
    %% Plugin Registry
    subgraph "🔌 Plugin Registry"
        Registry[Plugin Registry<br/>Gerenciamento Central]
        Loader[Plugin Loader<br/>Carregamento Dinâmico]
        Security[Plugin Security<br/>Validação & Sandbox]
    end

    %% Hook System
    subgraph "🪝 Hook System"
        HookSys[Hook System<br/>Pontos de Extensão]
        Before[Before Hooks<br/>Pré-execução]
        After[After Hooks<br/>Pós-execução]
        Filter[Filter Hooks<br/>Modificação de Dados]
    end

    %% Sandbox Execution
    subgraph "🏖️ Sandbox Execution"
        Sandbox[Sandbox<br/>Execução Isolada]
        Monitor[Monitor<br/>Performance & Segurança]
    end

    %% Plugin Lifecycle
    subgraph "🔄 Plugin Lifecycle"
        Discovery[Discovery<br/>Encontrar Plugins]
        Validation[Validation<br/>Verificar Segurança]
        Registration[Registration<br/>Registrar Hooks]
        Activation[Activation<br/>Ativar Plugin]
    end

    %% Conexões
    Registry --> Loader
    Registry --> Security
    Loader --> HookSys
    Security --> Sandbox
    HookSys --> Before
    HookSys --> After
    HookSys --> Filter
    Sandbox --> Monitor
    Discovery --> Validation
    Validation --> Registration
    Registration --> Activation
    Activation --> HookSys

    %% Database
    DB_Plugins[(Plugin<br/>Database)]
    Registry -.-> DB_Plugins

    %% Estilos
    classDef registry fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef hooks fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef sandbox fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef lifecycle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef database fill:#ffebee,stroke:#c62828,stroke-width:2px

    class Registry,Loader,Security registry
    class HookSys,Before,After,Filter hooks
    class Sandbox,Monitor sandbox
    class Discovery,Validation,Registration,Activation lifecycle
    class DB_Plugins database
```

### Fluxo de Dados nos Plugins

```mermaid
sequenceDiagram
    participant App as Aplicação
    participant Hook as Hook System
    participant Plugin as Plugin
    participant DB as Database

    App->>Hook: Executar operação
    Hook->>Plugin: Before Hook
    Plugin->>Plugin: Validar/Modificar dados
    Plugin-->>Hook: Dados modificados
    Hook->>App: Continuar operação
    App->>DB: Salvar dados
    DB-->>App: Confirmação
    App->>Hook: After Hook
    Hook->>Plugin: Pós-processamento
    Plugin->>Plugin: Notificações/Logs
    Plugin-->>Hook: Resultado
    Hook-->>App: Operação completa
```

#### Ciclo de Vida dos Plugins

1. **Discovery**: Sistema encontra plugins disponíveis
2. **Loading**: Carregamento dinâmico do código
3. **Validation**: Verificação de segurança e compatibilidade
4. **Registration**: Registro no sistema com hooks
5. **Activation**: Ativação e execução de hooks
6. **Monitoring**: Monitoramento de performance e erros

### 5. 🔐 Segurança

#### Camadas de Segurança Multi-Tenant

```mermaid
graph TD
    %% Application Layer
    subgraph "🌐 Application Layer"
        Auth[JWT Authentication<br/>+ Refresh Tokens]
        Guards[Role-Based Guards<br/>RBAC + Multi-Tenant]
        TenantIsolation[Tenant Isolation<br/>Context Middleware]
    end

    %% API Layer
    subgraph "🔌 API Layer"
        Validation[Input Validation<br/>Class Validator + Zod]
        RateLimit[Rate Limiting<br/>Por Tenant/IP]
        CORS[CORS Configuration<br/>Tenant-Specific]
    end

    %% Plugin Security
    subgraph "🔌 Plugin Security"
        PluginValidation[Plugin Validation<br/>Sandbox Execution]
        PermissionCheck[Permission Checks<br/>Hook-Level Security]
        AuditTrail[Audit Trail<br/>Plugin Actions]
    end

    %% Database Layer
    subgraph "🗄️ Database Layer"
        RowLevel[Row Level Security<br/>PostgreSQL RLS]
        Encryption[Data Encryption<br/>Sensitive Fields]
        BackupSecurity[Backup Security<br/>Encrypted Backups]
    end

    %% Infrastructure
    subgraph "🏗️ Infrastructure"
        NetworkSec[Network Security<br/>Firewalls + VPN]
        ContainerSec[Container Security<br/>Image Scanning]
        Secrets[Secrets Management<br/>Vault/Key Management]
    end

    %% Conexões
    Auth --> Guards
    Guards --> TenantIsolation
    TenantIsolation --> Validation
    Validation --> RateLimit
    RateLimit --> CORS
    CORS --> PluginValidation
    PluginValidation --> PermissionCheck
    PermissionCheck --> AuditTrail
    AuditTrail --> RowLevel
    RowLevel --> Encryption
    Encryption --> BackupSecurity
    BackupSecurity --> NetworkSec
    NetworkSec --> ContainerSec
    ContainerSec --> Secrets

    %% External Threats
    Threats[External Threats<br/>🔴 SQL Injection<br/>🔴 XSS<br/>🔴 CSRF<br/>🔴 DDoS]
    Threats -.->|Blocked by| Auth
    Threats -.->|Blocked by| Validation
    Threats -.->|Blocked by| NetworkSec

    %% Estilos
    classDef app fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef api fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef plugin fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef db fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef infra fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef threat fill:#ffcdd2,stroke:#b71c1c,stroke-width:3px,stroke-dasharray: 5 5

    class Auth,Guards,TenantIsolation app
    class Validation,RateLimit,CORS api
    class PluginValidation,PermissionCheck,AuditTrail plugin
    class RowLevel,Encryption,BackupSecurity db
    class NetworkSec,ContainerSec,Secrets infra
    class Threats threat
```

### Fluxo de Segurança Multi-Tenant

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Auth as Authentication
    participant Tenant as Tenant Context
    participant Guard as RBAC Guard
    participant API as API Endpoint
    participant Plugin as Plugin Security
    participant DB as Database RLS

    User->>Auth: Login Request
    Auth->>Auth: Validate Credentials
    Auth->>Tenant: Extract Tenant ID
    Tenant->>Guard: Check Permissions
    Guard->>API: Authorize Access
    API->>Plugin: Plugin Security Check
    Plugin->>DB: Query with RLS
    DB->>DB: Filter by Tenant
    DB-->>Plugin: Tenant Data Only
    Plugin-->>API: Secure Response
    API-->>User: Filtered Data
```

#### Estratégias de Segurança

- **Autenticação JWT** com refresh tokens
- **Role-Based Access Control (RBAC)**
- **Input Validation** com sanitização
- **Rate Limiting** para proteção contra ataques
- **CORS** configurado adequadamente
- **Helmet** para headers de segurança
- **Encryption** de dados sensíveis

### 6. 📊 Monitoramento e Observabilidade

#### Métricas Coletadas

- **Performance**: Tempo de resposta, throughput, latência
- **Errors**: Taxa de erro, tipos de erro, stack traces
- **Business**: Conversões, retenção, uso de features
- **System**: CPU, memória, disco, rede
- **Plugins**: Execução de hooks, erros de plugins

#### Ferramentas

- **Logging**: Winston com rotação de logs
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Health Checks**: Endpoints de saúde
- **Alerts**: Notificações automáticas

---

## 🚀 Estratégias de Deployment

### Desenvolvimento

```yaml
# docker-compose.dev.yml
version: "3.8"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: furry_friends_dev

  backend:
    build:
      context: ./furry-friends-agenda-backend
      target: development
    volumes:
      - ./furry-friends-agenda-backend:/app
    environment:
      NODE_ENV: development

  frontend:
    build:
      context: ./furry-friends-agenda-app
      target: development
    volumes:
      - ./furry-friends-agenda-app:/app
```

### Produção

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: furry_friends_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    image: furry-friends-backend:latest
    environment:
      NODE_ENV: production
    depends_on:
      - db

  frontend:
    image: furry-friends-frontend:latest
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Estratégias de Escalabilidade Multi-Tenant

```mermaid
graph TD
    %% Load Balancing
    subgraph "⚖️ Load Balancing"
        LB[Load Balancer<br/>Nginx/K8s Ingress]
        LB --> BE1[Backend Instance 1<br/>Tenant A,B]
        LB --> BE2[Backend Instance 2<br/>Tenant C,D]
        LB --> BE3[Backend Instance 3<br/>Tenant E,F]
    end

    %% Database Sharding
    subgraph "🗄️ Database Sharding"
        Shard1[(Shard 1<br/>Tenants A-C)]
        Shard2[(Shard 2<br/>Tenants D-F)]
        Shard3[(Shard 3<br/>Tenants G-I)]
    end

    %% Caching Strategy
    subgraph "💾 Multi-Tenant Caching"
        RedisCluster[Redis Cluster]
        TenantCacheA[Cache Tenant A<br/>Namespace: tenant_a]
        TenantCacheB[Cache Tenant B<br/>Namespace: tenant_b]
        RedisCluster --> TenantCacheA
        RedisCluster --> TenantCacheB
    end

    %% CDN
    subgraph "🌐 CDN"
        CDN[CDN Global<br/>CloudFlare/AWS]
        StaticAssets[Static Assets<br/>Per Tenant]
        CDN --> StaticAssets
    end

    %% Microservices
    subgraph "🔄 Microservices"
        PaymentSvc[Payment Service<br/>Isolated per Tenant]
        ReportSvc[Report Service<br/>Async Processing]
        NotificationSvc[Notification Service<br/>Queue-Based]
    end

    %% Monitoring
    subgraph "📊 Monitoring"
        Metrics[Metrics Collection<br/>Per Tenant]
        Alerts[Alerts & Scaling<br/>Auto-scaling]
        Metrics --> Alerts
    end

    %% Conexões
    BE1 --> Shard1
    BE2 --> Shard2
    BE3 --> Shard3
    BE1 --> RedisCluster
    BE2 --> RedisCluster
    BE3 --> RedisCluster
    LB --> CDN
    BE1 --> PaymentSvc
    BE2 --> ReportSvc
    BE3 --> NotificationSvc
    PaymentSvc --> Metrics
    ReportSvc --> Metrics
    NotificationSvc --> Metrics

    %% Auto-scaling
    Alerts -.->|Scale Out| LB
    Alerts -.->|Scale DB| Shard1
    Alerts -.->|Scale Cache| RedisCluster

    %% Estilos
    classDef loadbalancer fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef backend fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef database fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef cache fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef cdn fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef microservice fill:#f1f8e9,stroke:#558b2f,stroke-width:2px
    classDef monitoring fill:#ffebee,stroke:#c62828,stroke-width:2px

    class LB loadbalancer
    class BE1,BE2,BE3 backend
    class Shard1,Shard2,Shard3 database
    class RedisCluster,TenantCacheA,TenantCacheB cache
    class CDN,StaticAssets cdn
    class PaymentSvc,ReportSvc,NotificationSvc microservice
    class Metrics,Alerts monitoring
```

### Estratégias de Escalabilidade por Camada

- **Application Layer**: Horizontal scaling com múltiplas instâncias
- **Database Layer**: Sharding por tenant com read replicas
- **Cache Layer**: Redis cluster com namespaces por tenant
- **Storage Layer**: CDN para assets, S3 buckets isolados
- **Queue Layer**: Filas separadas por tenant/criticalidade
- **Monitoring Layer**: Métricas isoladas com alertas automáticos

---

## 🔄 Padrões de Comunicação

### Entre Microsserviços

- **REST APIs** para comunicação síncrona
- **Message Queues** (RabbitMQ/Redis) para assíncrona
- **WebSockets** para tempo real
- **GraphQL** para queries complexas (opcional)

### Protocolos de API

```typescript
// REST Endpoints
GET    /api/clients           # Listar clientes
POST   /api/clients           # Criar cliente
GET    /api/clients/:id       # Obter cliente
PUT    /api/clients/:id       # Atualizar cliente
DELETE /api/clients/:id       # Remover cliente

// WebSocket Events
client.created
appointment.scheduled
payment.completed
notification.sent
```

---

## 📈 Estratégias de Performance

### Otimizações Frontend

- **Code Splitting**: Lazy loading de rotas
- **Bundle Analysis**: Identificação de pacotes grandes
- **Image Optimization**: WebP, lazy loading
- **Caching**: Service Worker para PWA
- **CDN**: Distribuição global de assets

### Otimizações Backend

- **Database Indexing**: Índices estratégicos
- **Query Optimization**: N+1 queries prevention
- **Caching**: Redis para dados frequentes
- **Connection Pooling**: Prisma connection pool
- **Async Processing**: Filas para tarefas pesadas

### Otimizações de Banco

- **Read Replicas**: Para consultas de leitura
- **Partitioning**: Por data/tipo de dados
- **Archiving**: Dados históricos
- **Backup Strategy**: Incremental + full backups

---

## 🧪 Estratégias de Teste

### Pirâmide de Testes Multi-Tenant

```mermaid
graph TD
    %% E2E Tests - Top
    subgraph "🌐 E2E Tests (10-20%)"
        E2E_Tenant[E2E Multi-Tenant<br/>Cross-Tenant Scenarios]
        E2E_Plugin[E2E Plugin Integration<br/>Plugin Lifecycle]
        E2E_Security[E2E Security<br/>Tenant Isolation]
    end

    %% Integration Tests - Middle
    subgraph "🔗 Integration Tests (20-30%)"
        Int_API[API Integration<br/>REST/GraphQL Endpoints]
        Int_DB[Database Integration<br/>Prisma + PostgreSQL]
        Int_Plugin[Plugin Integration<br/>Hook System + Registry]
        Int_Queue[Queue Integration<br/>Notifications + Jobs]
        Int_Cache[Cache Integration<br/>Redis Multi-Tenant]
    end

    %% Unit Tests - Base
    subgraph "🧩 Unit Tests (50-70%)"
        Unit_Services[Services Unit Tests<br/>Business Logic]
        Unit_Controllers[Controllers Unit Tests<br/>Request/Response]
        Unit_Guards[Guards Unit Tests<br/>Auth + RBAC]
        Unit_Utils[Utils Unit Tests<br/>Helpers + Validators]
        Unit_PluginCore[Plugin Core Unit Tests<br/>Hook Engine]
        Unit_TenantCore[Tenant Core Unit Tests<br/>Isolation Logic]
    end

    %% Test Infrastructure
    subgraph "🏗️ Test Infrastructure"
        TestDB[(Test Database<br/>Per Test Isolation)]
        TestRedis[(Test Redis<br/>Mock/Clean State)]
        TestQueue[(Test Queues<br/>In-Memory)]
        MockServices[Mock Services<br/>External APIs]
    end

    %% Conexões
    E2E_Tenant --> Int_API
    E2E_Plugin --> Int_Plugin
    E2E_Security --> Int_DB

    Int_API --> Unit_Services
    Int_DB --> Unit_Services
    Int_Plugin --> Unit_PluginCore
    Int_Queue --> Unit_Services
    Int_Cache --> Unit_Utils

    Unit_Services --> TestDB
    Unit_PluginCore --> TestRedis
    Unit_Services --> TestQueue
    Unit_Services --> MockServices

    %% Test Coverage Goals
    Coverage[Coverage Goals<br/>📊 Unit: 80%+<br/>📊 Integration: 70%+<br/>📊 E2E: 60%+]

    %% Estilos
    classDef e2e fill:#ffebee,stroke:#c62828,stroke-width:3px
    classDef integration fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef unit fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef infra fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef coverage fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class E2E_Tenant,E2E_Plugin,E2E_Security e2e
    class Int_API,Int_DB,Int_Plugin,Int_Queue,Int_Cache integration
    class Unit_Services,Unit_Controllers,Unit_Guards,Unit_Utils,Unit_PluginCore,Unit_TenantCore unit
    class TestDB,TestRedis,TestQueue,MockServices infra
    class Coverage coverage
```

### Tipos de Teste

- **Unit Tests**: Funções, classes, métodos isolados
- **Integration Tests**: Módulos trabalhando juntos
- **E2E Tests**: Fluxos completos do usuário
- **Performance Tests**: Load testing, stress testing
- **Security Tests**: Penetration testing, vulnerability scanning

### Ferramentas de Teste

- **Frontend**: Vitest, React Testing Library, Playwright
- **Backend**: Jest, Supertest
- **Database**: TestContainers
- **E2E**: Cypress, Playwright

---

## 📚 Padrões de Documentação

### Estrutura da Documentação

```
docs/
├── README.md              # Visão geral do projeto
├── ARCHITECTURE.md        # Esta documentação
├── API.md                 # Documentação da API
├── DEVELOPMENT.md         # Guia de desenvolvimento
├── DEPLOYMENT.md          # Guia de deployment
├── SECURITY.md            # Políticas de segurança
├── plugins/               # Documentação de plugins
├── diagrams/              # Diagramas de arquitetura
└── CHANGELOG.md           # Histórico de mudanças
```

### Padrões de Documentação

- **README-Driven Development**: Documentação primeiro
- **Living Documentation**: Sempre atualizada
- **API Documentation**: OpenAPI/Swagger
- **Code Comments**: JSDoc/TSDoc
- **Architecture Decision Records**: Decisões documentadas

---

## 🎯 Conclusão

Esta arquitetura fornece uma base sólida e escalável para o **Furry Friends Agenda**, combinando:

- **🏗️ Arquitetura Modular**: Fácil manutenção e extensão
- **🔒 Segurança Robusta**: Proteção em múltiplas camadas
- **📈 Escalabilidade**: Suporte a crescimento
- **🧪 Testabilidade**: Código bem testado
- **📊 Observabilidade**: Monitoramento completo
- **🔌 Extensibilidade**: Sistema de plugins poderoso

A arquitetura segue as melhores práticas da indústria e está preparada para evoluir conforme as necessidades do negócio crescem.

---

**Última atualização:** Outubro 2025
**Versão da Arquitetura:** 2.0
