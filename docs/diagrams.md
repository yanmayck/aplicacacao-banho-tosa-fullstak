# Diagramas de Arquitetura

## Visão Geral da Arquitetura

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        UI[Interface do Usuário]
        PaymentForm[Formulário de Pagamento]
        PluginUI[Interface de Plugins]
        State[Gerenciamento de Estado]
    end

    subgraph "Backend (NestJS + TypeScript)"
        API[API REST/GraphQL]
        AuthSvc[Auth Service]
        PaymentSvc[Payment Service]
        PluginSvc[Plugin Service]
        HookSvc[Hook Service]
        FinancialSvc[Financial Service]
        NotificationSvc[Notification Service]
    end

    subgraph "Banco de Dados (PostgreSQL)"
        Users[(Users)]
        Clients[(Clients)]
        Pets[(Pets)]
        Appointments[(Appointments)]
        Payments[(Payments)]
        Plugins[(Plugins)]
        Transactions[(Transactions)]
        AuditLogs[(Audit Logs)]
    end

    subgraph "Gateways Externos"
        Stripe[(Stripe)]
        WhatsApp[(WhatsApp API)]
        Email[(Email Service)]
    end

    subgraph "Sistema de Plugins"
        PluginReg[Plugin Registry]
        PluginLoader[Plugin Loader]
        PluginStore[Plugin Store]
        SecurityMgr[Security Manager]
    end

    UI --> API
    PaymentForm --> PaymentSvc
    PluginUI --> PluginSvc

    PaymentSvc --> Stripe
    NotificationSvc --> WhatsApp
    NotificationSvc --> Email

    PaymentSvc --> Payments
    PluginSvc --> Plugins
    FinancialSvc --> Transactions
    AuthSvc --> Users

    HookSvc --> PluginReg
    PluginLoader --> PluginStore
    SecurityMgr --> PluginReg

    style UI fill:#e1f5fe
    style PaymentSvc fill:#c8e6c9
    style PluginSvc fill:#c8e6c9
    style Stripe fill:#fff3e0
    style PluginReg fill:#f3e5f5
```

## Fluxo de Pagamento Completo

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant B as Backend
    participant S as Stripe
    participant W as Webhook
    participant DB as Database
    participant H as Hook System

    C->>F: Inicia checkout
    F->>B: POST /payments/create-payment-intent
    B->>DB: Criar registro Payment (PENDING)
    B->>S: Criar PaymentIntent
    S-->>B: PaymentIntent com client_secret
    B-->>F: Retornar client_secret
    F-->>C: Exibir formulário Stripe

    C->>S: Inserir dados do cartão
    S->>S: Processar pagamento
    S->>W: payment_intent.succeeded
    W->>B: POST /webhooks/stripe
    B->>B: Validar webhook
    B->>DB: Atualizar Payment (COMPLETED)
    B->>DB: Criar Transaction financeira
    B->>H: Executar hook payment.completed
    H->>B: Plugins processam evento
    B-->>F: Notificação em tempo real
    F-->>C: Confirmação de sucesso
```

## Arquitetura de Plugins Detalhada

```mermaid
graph TD
    subgraph "Plugin System Core"
        PluginReg[Plugin Registry]
        PluginLoader[Plugin Loader]
        HookSvc[Hook Service]
        SecurityMgr[Security Manager]
        PluginMgr[Plugin Manager]
    end

    subgraph "Plugin Lifecycle"
        Install[Install]
        Enable[Enable]
        Execute[Execute]
        Disable[Disable]
        Uninstall[Uninstall]
    end

    subgraph "Plugin Types"
        CorePlugins[Core Plugins<br/>Stripe, WhatsApp, etc.]
        Community[Community Plugins]
        Enterprise[Enterprise Plugins]
    end

    subgraph "Extension Points"
        Hooks[Hooks System]
        API[API Extensions]
        UI[UI Extensions]
        DB[Database Extensions]
    end

    PluginReg --> PluginLoader
    PluginLoader --> Install
    Install --> Enable
    Enable --> Execute
    Execute --> Hooks
    Execute --> API
    Execute --> UI
    Execute --> DB
    Execute --> Disable
    Disable --> Uninstall

    CorePlugins --> PluginReg
    Community --> PluginReg
    Enterprise --> PluginReg

    SecurityMgr --> PluginReg
    PluginMgr --> PluginReg
    HookSvc --> PluginReg

    style PluginReg fill:#e8f5e8
    style HookSvc fill:#e8f5e8
    style SecurityMgr fill:#fff2cc
    style CorePlugins fill:#d5e8d4
```

## Fluxo de Plugin

```mermaid
stateDiagram-v2
    [*] --> Uploaded: Plugin enviado
    Uploaded --> Validating: Validando estrutura
    Validating --> Invalid: Estrutura inválida
    Invalid --> [*]: Rejeitado

    Validating --> Installing: Estrutura válida
    Installing --> Installed: Instalado no banco
    Installed --> Enabling: Ativando
    Enabling --> Enabled: Ativo

    Enabled --> Executing: Executando hooks
    Executing --> Enabled: Hook executado

    Enabled --> Disabling: Desativando
    Disabling --> Disabled: Desativado
    Disabled --> Uninstalling: Desinstalando
    Uninstalling --> [*]: Removido

    Enabled --> Error: Erro de execução
    Error --> Disabled: Desativado automaticamente
    Executing --> Error
```

## Integração Frontend-Backend

```mermaid
graph LR
    subgraph "Frontend Layers"
        React[React Components]
        Hooks[Custom Hooks]
        Services[API Services]
        Context[React Context]
    end

    subgraph "State Management"
        Zustand[(Zustand Store)]
        ReactQuery[(React Query)]
        LocalStorage[(Local Storage)]
    end

    subgraph "Backend Layers"
        Controllers[NestJS Controllers]
        Services[NestJS Services]
        Modules[NestJS Modules]
        Guards[Auth Guards]
    end

    subgraph "Data Layer"
        Prisma[Prisma Client]
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis Cache)]
    end

    React --> Hooks
    Hooks --> Services
    Services --> Context
    Context --> Zustand
    Context --> ReactQuery

    Controllers --> Services
    Services --> Modules
    Modules --> Guards

    Services --> Prisma
    Prisma --> PostgreSQL
    Services --> Redis

    Services --> Services
```

## Sistema de Hooks

```mermaid
graph TD
    subgraph "Hook Types"
        Sync[Sync Hooks<br/>Bloqueiam execução]
        Async[Async Hooks<br/>Não bloqueiam]
        Filter[Filter Hooks<br/>Modificam dados]
        Action[Action Hooks<br/>Executam ações]
    end

    subgraph "Hook Execution"
        Register[Register Hook]
        Trigger[Trigger Hook]
        Execute[Execute Handlers]
        Result[Process Results]
    end

    subgraph "Hook Management"
        Priority[Priority System]
        ErrorHandling[Error Handling]
        Metrics[Execution Metrics]
        Logging[Audit Logging]
    end

    Register --> Trigger
    Trigger --> Priority
    Priority --> Execute
    Execute --> ErrorHandling
    Execute --> Metrics
    Execute --> Result
    Result --> Logging

    Sync --> Execute
    Async --> Execute
    Filter --> Execute
    Action --> Execute
```

## Modelo de Dados - Relacionamentos

```mermaid
erDiagram
    User ||--o{ Client : has
    Client ||--o{ Pet : owns
    Client ||--o{ Appointment : schedules
    Pet ||--o{ Appointment : has
    Groomer ||--o{ Appointment : services

    Appointment ||--o{ Payment : generates
    Appointment ||--o{ Transaction : creates

    Payment ||--o{ Transaction : links
    Payment ||--o{ PaymentRefund : has

    Plugin ||--o{ PluginHook : defines
    Plugin ||--o{ PluginLog : generates

    User ||--o{ AuditLog : creates
    Client ||--o{ AuditLog : affects

    FinancialCategory ||--o{ Transaction : categorizes
    CashRegister ||--o{ Transaction : contains

    ServicePackage ||--o{ AppointmentService : used_in
    Product ||--o{ ServiceProduct : used_in
    Product ||--o{ StockMovement : tracked_in

    NotificationTemplate ||--o{ Notification : uses
    Client ||--o{ Notification : receives
    Groomer ||--o{ Notification : receives
```

## Fluxo de Autenticação e Autorização

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as Auth Service
    participant J as JWT Service
    participant DB as Database
    participant P as Plugin Security

    U->>F: Login request
    F->>A: POST /auth/login
    A->>DB: Validate credentials
    DB-->>A: User data
    A->>J: Generate JWT
    J-->>A: JWT token
    A-->>F: Token + user info
    F->>F: Store token

    U->>F: Access protected route
    F->>A: Request with JWT
    A->>J: Validate token
    J->>P: Check permissions
    P->>DB: Verify user roles
    DB-->>P: Permission data
    P-->>J: Permission result
    J-->>A: Authorization result
    A-->>F: Allow/deny access
```

## Pipeline de Processamento de Plugins

```mermaid
graph TD
    A[Hook Triggered] --> B{Plugin Active?}
    B -->|No| C[Skip Plugin]
    B -->|Yes| D{Dependencies Met?}
    D -->|No| E[Log Warning]
    D -->|Yes| F{Check Permissions}
    F -->|Denied| G[Log Security Error]
    F -->|Granted| H[Execute in Sandbox]
    H --> I{Execution Success?}
    I -->|Yes| J[Process Result]
    I -->|No| K[Handle Error]
    J --> L[Update Metrics]
    K --> M[Log Error]
    L --> N[Continue Pipeline]
    M --> N
    E --> N
    G --> N
    C --> N
```

## Dashboard de Métricas

```mermaid
graph TD
    subgraph "Real-time Metrics"
        ActiveUsers[Active Users]
        PaymentVolume[Payment Volume]
        PluginUsage[Plugin Usage]
        SystemHealth[System Health]
    end

    subgraph "Data Sources"
        Database[(PostgreSQL)]
        Redis[(Redis Cache)]
        Logs[(Application Logs)]
        Webhooks[Webhook Events]
    end

    subgraph "Processing"
        Aggregator[Metrics Aggregator]
        Analyzer[Data Analyzer]
        AlertEngine[Alert Engine]
    end

    subgraph "Visualization"
        Dashboard[Admin Dashboard]
        API[Metrics API]
        Reports[Automated Reports]
    end

    Database --> Aggregator
    Redis --> Aggregator
    Logs --> Aggregator
    Webhooks --> Aggregator

    Aggregator --> Analyzer
    Analyzer --> AlertEngine
    Analyzer --> Dashboard
    Analyzer --> API
    Analyzer --> Reports

    AlertEngine --> Dashboard
    AlertEngine --> API

    style Dashboard fill:#e1f5fe
    style AlertEngine fill:#ffebee
    style Aggregator fill:#f3e5f5
```

## Estratégia de Deploy

```mermaid
graph TD
    subgraph "Development"
        LocalDev[Local Development]
        DockerDev[Docker Compose Dev]
    end

    subgraph "Staging"
        StagingDeploy[Staging Deployment]
        E2ETests[E2E Tests]
        IntegrationTests[Integration Tests]
    end

    subgraph "Production"
        ProdDeploy[Production Deployment]
        BlueGreen[Blue-Green Deployment]
        Rollback[Rollback Strategy]
    end

    subgraph "Monitoring"
        HealthChecks[Health Checks]
        Metrics[Application Metrics]
        Alerts[Alert System]
        Logs[Centralized Logging]
    end

    LocalDev --> DockerDev
    DockerDev --> StagingDeploy
    StagingDeploy --> E2ETests
    E2ETests --> IntegrationTests
    IntegrationTests --> ProdDeploy
    ProdDeploy --> BlueGreen
    BlueGreen --> Rollback

    ProdDeploy --> HealthChecks
    ProdDeploy --> Metrics
    ProdDeploy --> Alerts
    ProdDeploy --> Logs

    HealthChecks --> Alerts
    Metrics --> Alerts
```

---

## Glossário de Diagramas

### Tipos de Fluxo

- **Sequence Diagrams**: Mostram interações entre componentes ao longo do tempo
- **Flow Charts**: Ilustram processos e decisões
- **Entity Relationship**: Demonstram relacionamentos entre dados
- **State Diagrams**: Representam estados e transições
- **Architecture Diagrams**: Visão geral da estrutura do sistema

### Convenções de Cores

- 🔵 **Azul**: Componentes principais do sistema
- 🟢 **Verde**: Serviços e lógica de negócio
- 🟡 **Amarelo**: Integrações externas
- 🟣 **Roxo**: Sistema de plugins
- 🔴 **Vermelho**: Alertas e tratamento de erros
- ⚪ **Branco**: Estados neutros ou dados

### Níveis de Abstração

- **Nível 1**: Visão geral do sistema
- **Nível 2**: Detalhes de componentes específicos
- **Nível 3**: Implementação técnica detalhada

---

**Última atualização:** Outubro 2025
