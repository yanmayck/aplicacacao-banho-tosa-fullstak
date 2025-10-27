# 🔒 Política de Segurança - Furry Friends Agenda

## Visão Geral da Segurança

A segurança é prioridade máxima no **Furry Friends Agenda**. Este documento detalha nossas políticas, práticas e medidas de segurança implementadas para proteger dados de usuários, prevenir vulnerabilidades e garantir conformidade com regulamentações.

---

## 🛡️ Princípios de Segurança

### 1. Defense in Depth (Defesa em Profundidade)

Implementamos múltiplas camadas de proteção:

- **Rede**: Firewalls, VPN, rate limiting
- **Aplicação**: Validação de entrada, sanitização, autenticação
- **Dados**: Criptografia, controle de acesso, auditoria
- **Infraestrutura**: Containers seguros, monitoramento, backups

### 2. Zero Trust Architecture

- **Nunca confie, sempre verifique**: Toda requisição é autenticada e autorizada
- **Menor privilégio**: Usuários têm apenas permissões necessárias
- **Segmentação**: Isolamento de componentes e dados

### 3. Privacy by Design

- **Minimização de dados**: Coletamos apenas dados essenciais
- **Consentimento**: Usuários controlam seus dados
- **Transparência**: Políticas claras de uso de dados

---

## 🔐 Autenticação e Autorização

### JWT (JSON Web Tokens)

```typescript
// Configuração segura do JWT
export const jwtConfig = {
  secret: process.env.JWT_SECRET, // 256-bit key
  expiresIn: "1h", // Token expira em 1 hora
  issuer: "furry-friends-agenda",
  audience: "furry-friends-users",
  algorithm: "HS256",
};
```

### Refresh Tokens

- **Rotação automática**: Novos refresh tokens são gerados a cada uso
- **Expiração longa**: 30 dias para conveniência do usuário
- **Revogação**: Possibilidade de invalidar tokens específicos

### Multi-Factor Authentication (MFA)

```typescript
// Implementação futura do MFA
interface MFASetup {
  userId: string;
  method: "TOTP" | "SMS" | "EMAIL";
  secret: string; // Para TOTP
  backupCodes: string[]; // Códigos de recuperação
}
```

### Controle de Acesso Baseado em Roles (RBAC)

```typescript
enum UserRole {
  ADMIN = "admin", // Acesso total ao sistema
  MANAGER = "manager", // Gestão de equipe e relatórios
  GROOMER = "groomer", // Acesso limitado à agenda
  CLIENT = "client", // Portal do cliente
}

const rolePermissions = {
  [UserRole.ADMIN]: ["users.*", "financial.*", "reports.*", "settings.*"],
  [UserRole.MANAGER]: [
    "appointments.*",
    "clients.*",
    "groomers.*",
    "reports.read",
  ],
  [UserRole.GROOMER]: [
    "appointments.read",
    "appointments.update",
    "clients.read",
    "pets.read",
  ],
  [UserRole.CLIENT]: [
    "appointments.read",
    "appointments.create",
    "pets.*",
    "profile.*",
  ],
};
```

---

## 🗄️ Segurança de Dados

### Criptografia em Trânsito

```typescript
// Configuração HTTPS obrigatória
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  ca: fs.readFileSync(process.env.SSL_CA_PATH),
  secureProtocol: "TLSv1_2_method",
  ciphers: "ECDHE-RSA-AES128-GCM-SHA256:!RC4:!MD5:!DSS",
};
```

### Criptografia em Repouso

```typescript
// Dados sensíveis criptografados
const sensitiveFields = [
  "password",
  "creditCard",
  "ssn", // CPF/CNPJ
  "bankAccount",
];

// Implementação de criptografia
const encrypt = (text: string): string => {
  const cipher = crypto.createCipher("aes-256-gcm", process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted + "." + cipher.getAuthTag().toString("hex");
};
```

### Hashing de Senhas

```typescript
// bcrypt com salt rounds altos
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Aumentado para 12 rounds
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### Tokenização de Dados de Pagamento

```typescript
// Integração com gateways de pagamento
const tokenizeCard = async (cardData: CardData): Promise<Token> => {
  // Nunca armazenamos dados do cartão
  const token = await paymentGateway.tokenize(cardData);
  return {
    token: token.id,
    last4: cardData.number.slice(-4),
    brand: token.brand,
    expiryMonth: cardData.expiryMonth,
    expiryYear: cardData.expiryYear,
  };
};
```

---

## 🌐 Segurança da Aplicação

### Validação de Entrada

```typescript
// DTOs com validação rigorosa
export class CreateAppointmentDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  petId: string;

  @IsDateString()
  @IsFuture()
  dateTime: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
```

### Sanitização de Dados

```typescript
// Prevenção de XSS
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Sem tags HTML
    ALLOWED_ATTR: [],
  });
};

// SQL Injection prevention (via Prisma ORM)
const safeQuery = await prisma.user.findMany({
  where: {
    email: {
      contains: searchTerm, // Prisma escapa automaticamente
      mode: "insensitive",
    },
  },
});
```

### Rate Limiting

```typescript
// Configuração de rate limiting
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por janela
  message: {
    error: "Muitas requisições, tente novamente mais tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Whitelist para IPs confiáveis
  skip: (req) => req.ip === "127.0.0.1",
};
```

### CORS (Cross-Origin Resource Sharing)

```typescript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://furryfriends.com",
      "https://app.furryfriends.com",
      process.env.NODE_ENV === "development" ? "http://localhost:5173" : null,
    ].filter(Boolean);

    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

---

## 🔌 Segurança de Plugins

### Isolamento de Plugins

```typescript
// Sandbox para execução de plugins
const createPluginSandbox = (plugin: PluginInterface) => {
  return {
    // APIs seguras permitidas
    database: createSecureDatabaseProxy(plugin),
    http: createSecureHttpProxy(plugin),
    logger: createSecureLogger(plugin),

    // Contexto limitado
    pluginId: plugin.name,
    permissions: plugin.getRequiredPermissions(),

    // Recursos limitados
    setTimeout: limitedSetTimeout,
    setInterval: limitedSetInterval,
    fetch: limitedFetch,
  };
};
```

### Validação de Plugins

```typescript
// Verificação de integridade
const validatePluginIntegrity = async (
  pluginPath: string
): Promise<boolean> => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(pluginPath, "package.json"), "utf8")
  );

  // Verificar assinatura digital (futuro)
  if (process.env.NODE_ENV === "production") {
    const signature = packageJson.signature;
    const isValidSignature = await verifySignature(pluginPath, signature);
    if (!isValidSignature) {
      throw new Error("Plugin signature verification failed");
    }
  }

  // Verificar dependências seguras
  const dependencies = packageJson.dependencies || {};
  for (const [name, version] of Object.entries(dependencies)) {
    if (!isAllowedDependency(name, version)) {
      throw new Error(`Unsafe dependency: ${name}@${version}`);
    }
  }

  return true;
};
```

### Controle de Permissões por Plugin

```typescript
const pluginPermissions = {
  "whatsapp-notifications": {
    database: {
      read: ["clients", "appointments"],
      write: [],
    },
    external: {
      allowedDomains: ["api.whatsapp.com", "graph.facebook.com"],
      methods: ["GET", "POST"],
    },
    filesystem: {
      read: false,
      write: false,
    },
  },
};
```

---

## 📊 Monitoramento e Auditoria

### Logs de Segurança

```typescript
// Estrutura de logs de segurança
interface SecurityLog {
  id: string;
  timestamp: Date;
  level: "INFO" | "WARN" | "ERROR" | "CRITICAL";
  event: SecurityEvent;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  sessionId?: string;
}

enum SecurityEvent {
  LOGIN_SUCCESS = "login.success",
  LOGIN_FAILURE = "login.failure",
  PASSWORD_CHANGE = "password.change",
  PERMISSION_DENIED = "permission.denied",
  SUSPICIOUS_ACTIVITY = "suspicious.activity",
  DATA_ACCESS = "data.access",
  PLUGIN_EXECUTION = "plugin.execution",
}
```

### Alertas de Segurança

```typescript
// Sistema de alertas automáticos
const securityAlerts = {
  [SecurityEvent.LOGIN_FAILURE]: {
    threshold: 5, // 5 tentativas falhadas
    window: "15m", // em 15 minutos
    action: "lock_account",
    notify: ["admin", "user"],
  },

  [SecurityEvent.SUSPICIOUS_ACTIVITY]: {
    threshold: 1, // Qualquer atividade suspeita
    action: "investigate",
    notify: ["admin", "security_team"],
  },
};
```

### Auditoria de Dados

```typescript
// Logs de auditoria para dados sensíveis
const auditDataAccess = async (
  userId: string,
  action: "CREATE" | "READ" | "UPDATE" | "DELETE",
  entity: string,
  entityId: string,
  changes?: Record<string, any>
) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType: entity,
      entityId,
      oldValues: changes?.old,
      newValues: changes?.new,
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
      metadata: {
        sessionId: getSessionId(),
        timestamp: new Date(),
      },
    },
  });
};
```

---

## 🚨 Plano de Resposta a Incidentes

### Classificação de Incidentes

```typescript
enum IncidentSeverity {
  LOW = "low", // Sem impacto nos usuários
  MEDIUM = "medium", // Impacto limitado
  HIGH = "high", // Impacto significativo
  CRITICAL = "critical", // Sistema comprometido
}

enum IncidentType {
  SECURITY_BREACH = "security_breach",
  DATA_LEAK = "data_leak",
  SERVICE_DISRUPTION = "service_disruption",
  UNAUTHORIZED_ACCESS = "unauthorized_access",
  MALWARE_INFECTION = "malware_infection",
}
```

### Processo de Resposta

```typescript
const incidentResponseProcess = {
  1: "Detecção e Avaliação",
  2: "Contenção",
  3: "Erradicação",
  4: "Recuperação",
  5: "Lições Aprendidas",
  6: "Relatório Final",
};
```

### Comunicação em Incidentes

```typescript
// Template de comunicação
const incidentCommunication = {
  internal: {
    subject: "🚨 Incidente de Segurança - {severity}",
    recipients: ["security_team", "management"],
    content: `
      Tipo: {type}
      Severidade: {severity}
      Impacto: {impact}
      Status: {status}
      Ações tomadas: {actions}
    `,
  },

  external: {
    subject: "Atualização sobre Incident de Segurança",
    recipients: ["affected_users"],
    content: `
      Prezados clientes,

      Detectamos uma situação de segurança que pode afetar suas informações.
      Estamos trabalhando para resolver o problema.

      Status atual: {status}
      Ações recomendadas: {recommendations}

      Atenciosamente,
      Equipe Furry Friends
    `,
  },
};
```

---

## 📋 Conformidade Regulatória

### LGPD (Lei Geral de Proteção de Dados)

```typescript
// Controle de consentimento
interface DataConsent {
  userId: string;
  purpose: DataPurpose;
  consentedAt: Date;
  expiresAt?: Date;
  withdrawnAt?: Date;
}

enum DataPurpose {
  MARKETING = "marketing",
  ANALYTICS = "analytics",
  PERSONALIZATION = "personalization",
  LEGAL_COMPLIANCE = "legal_compliance",
}

// Direito de exclusão
const deleteUserData = async (userId: string) => {
  // Soft delete de dados pessoais
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${userId}@anonymous.local`,
      name: "[Dados Removidos]",
    },
  });

  // Anonimização de dados históricos
  await prisma.appointment.updateMany({
    where: { clientId: userId },
    data: {
      notes: "[Dados anonimizados por solicitação do usuário]",
    },
  });
};
```

### PCI DSS (Para pagamentos)

- **Segmentação de rede**: Ambiente de pagamento isolado
- **Criptografia**: Dados de cartão nunca armazenados
- **Monitoramento**: Logs de todas as transações
- **Testes regulares**: Scans de vulnerabilidade mensais

---

## 🧪 Testes de Segurança

### Penetration Testing

```bash
# Ferramentas recomendadas
npm install -g owasp-zap  # Automated scanning
npm install -g sqlmap     # SQL injection testing
npm install -g nikto      # Web server scanner

# Comandos básicos
owasp-zap -cmd -quickurl http://localhost:3333 -quickout report.html
sqlmap -u "http://localhost:3333/api/users?id=1" --dbs
nikto -h http://localhost:3333
```

### Security Headers Testing

```bash
# Verificar headers de segurança
curl -I http://localhost:3333

# Deve incluir:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000
# Content-Security-Policy: default-src 'self'
```

### Dependency Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  schedule:
    - cron: "0 0 * * 0" # Weekly
  push:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit dependencies
        run: npm audit --audit-level high
      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## 🔧 Configurações de Segurança

### Variáveis de Ambiente Seguras

```bash
# .env.example (NUNCA committar valores reais)
JWT_SECRET=your-super-secure-jwt-secret-here
DATABASE_URL=postgresql://user:password@localhost:5432/furry_friends
ENCRYPTION_KEY=your-256-bit-encryption-key
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/private.key

# Configurações de produção
NODE_ENV=production
FORCE_HTTPS=true
RATE_LIMIT_MAX=100
SESSION_TIMEOUT=3600000
```

### Configuração do Servidor

```typescript
// main.ts - Configurações de segurança
const app = await NestFactory.create(AppModule, {
  httpsOptions:
    process.env.NODE_ENV === "production" ? httpsOptions : undefined,
  cors: corsOptions,
  logger: ["error", "warn", "log"], // Não logar em debug em produção
});

// Security middleware
app.use(helmet(helmetConfig));
app.use(rateLimit(rateLimitConfig));
app.use(compression());

// Global validation pipe
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Remove propriedades não decoradas
    forbidNonWhitelisted: true, // Lança erro para propriedades não permitidas
    transform: true, // Transforma payloads para DTOs
    disableErrorMessages: process.env.NODE_ENV === "production", // Oculta mensagens em produção
  })
);
```

---

## 📞 Contato e Relatórios

### Reportar Vulnerabilidades

- **Email**: security@furryfriends.com
- **PGP Key**: Disponível em security.furryfriends.com/pgp
- **Programa de Bug Bounty**: Em breve

### Equipe de Segurança

- **CISO**: Chief Information Security Officer
- **Security Team**: Equipe dedicada de segurança
- **External Auditors**: Auditores independentes

### Atualizações de Segurança

- **Security Advisories**: Publicados em security.furryfriends.com
- **Changelog**: Mudanças de segurança documentadas
- **Training**: Capacitação regular da equipe

---

## 📚 Referências e Padrões

### OWASP Top 10

1. **Injection**: Prevenção via ORM e validação
2. **Broken Authentication**: JWT seguro + MFA
3. **Sensitive Data Exposure**: Criptografia end-to-end
4. **XML External Entities**: Não aplicável (não usamos XML)
5. **Broken Access Control**: RBAC rigoroso
6. **Security Misconfiguration**: Configuração automatizada
7. **Cross-Site Scripting**: Sanitização e CSP
8. **Insecure Deserialization**: Não aplicável
9. **Vulnerable Components**: Scanning automático
10. **Insufficient Logging**: Logs abrangentes

### Padrões de Segurança

- **NIST Cybersecurity Framework**
- **ISO 27001**
- **GDPR** (para usuários europeus)
- **LGPD** (Brasil)

---

**Última atualização:** Outubro 2025
**Versão da Política:** 2.0
**Próxima revisão:** Abril 2026
