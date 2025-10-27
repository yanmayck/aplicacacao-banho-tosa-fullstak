# 🛠️ Guia de Desenvolvimento - Furry Friends Agenda

## Visão Geral do Ambiente de Desenvolvimento

Este guia detalha como configurar, desenvolver e contribuir para o **Furry Friends Agenda**, seguindo as melhores práticas de desenvolvimento.

---

## 📋 Pré-requisitos

### Sistema Operacional

- **Windows 10/11** (recomendado)
- **macOS 12+**
- **Linux Ubuntu 20.04+**

### Software Essencial

```bash
# Node.js (versão LTS recomendada)
node --version  # 18.17.0+

# npm ou yarn
npm --version   # 9.6.0+

# Git
git --version   # 2.34.0+

# Docker Desktop
docker --version  # 24.0.0+
docker-compose --version  # 2.17.0+
```

### IDE Recomendada

- **Visual Studio Code** com extensões:
  - TypeScript and JavaScript Language Features
  - Prettier - Code formatter
  - ESLint
  - Prisma
  - Docker
  - GitLens

---

## 🚀 Configuração do Ambiente

### 1. Clonagem do Repositório

```bash
# Clone o repositório
git clone https://github.com/your-org/furry-friends-agenda.git
cd furry-friends-agenda

# Instale dependências do projeto raiz
npm install
```

### 2. Configuração do Backend

```bash
# Entre no diretório do backend
cd furry-friends-agenda-backend

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações locais
```

### 3. Configuração do Frontend

```bash
# Entre no diretório do frontend
cd ../furry-friends-agenda-app

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações locais
```

### 4. Configuração do Banco de Dados

```bash
# Certifique-se de que o Docker está rodando
docker --version

# Inicie os serviços de desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Aguarde os containers subirem
sleep 30

# Execute as migrações do banco
cd furry-friends-agenda-backend
npx prisma migrate dev --name init

# Gere o cliente Prisma
npx prisma generate

# (Opcional) Abra o Prisma Studio para visualizar o banco
npx prisma studio
```

### 5. Inicialização da Aplicação

```bash
# Terminal 1: Backend
cd furry-friends-agenda-backend
npm run start:dev

# Terminal 2: Frontend
cd ../furry-friends-agenda-app
npm run dev

# Acesse:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3333
# Prisma Studio: http://localhost:5555
```

---

## 🏗️ Estrutura do Projeto

### Visão Geral dos Diretórios

```
furry-friends-agenda/
├── docs/                          # 📚 Documentação
│   ├── ARCHITECTURE.md           # Arquitetura do sistema
│   ├── API.md                    # Documentação da API
│   ├── DEVELOPMENT.md            # Este arquivo
│   ├── plugins.md                # Sistema de plugins
│   └── ...
├── furry-friends-agenda-backend/  # 🚀 Backend (NestJS)
│   ├── src/
│   │   ├── modules/              # Módulos do NestJS
│   │   ├── shared/               # Código compartilhado
│   │   ├── config/               # Configurações
│   │   └── main.ts               # Ponto de entrada
│   ├── prisma/                   # 🗄️ Schema do banco
│   ├── test/                     # 🧪 Testes
│   └── docker/                   # 🐳 Dockerfiles
├── furry-friends-agenda-app/      # 🎨 Frontend (React)
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── pages/                # Páginas
│   │   ├── hooks/                # Hooks customizados
│   │   ├── context/              # Context API
│   │   └── services/             # Chamadas de API
│   ├── public/                   # Assets estáticos
│   └── tests/                    # Testes frontend
├── plugins/                       # 🔌 Plugins do sistema
│   └── whatsapp-notifications/   # Plugin de exemplo
└── docker-compose.*.yml          # 🐳 Configurações Docker
```

### Convenções de Nomenclatura

#### Arquivos e Diretórios

- **PascalCase**: Componentes React (`UserProfile.tsx`)
- **camelCase**: Funções, variáveis (`getUserData()`)
- **kebab-case**: Arquivos e diretórios (`user-profile.tsx`)
- **UPPER_CASE**: Constantes (`API_BASE_URL`)

#### Branches Git

```bash
# Feature branches
feature/add-payment-integration
feature/implement-user-auth

# Bug fixes
fix/login-validation-error
fix/appointment-calendar-bug

# Hotfixes
hotfix/critical-security-patch

# Release branches
release/v1.2.0
```

#### Commits

```bash
# Formato: type(scope): description
feat(auth): add JWT authentication
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
refactor(db): optimize query performance
test(appointments): add unit tests for booking logic
```

---

## 💻 Desenvolvimento Backend (NestJS)

### Estrutura de um Módulo

```typescript
// user.module.ts
@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

// user.controller.ts
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}

// user.service.ts
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: UserQueryDto) {
    return this.prisma.user.findMany({
      where: this.buildWhereClause(query),
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }
}
```

### Padrões de Desenvolvimento

#### DTOs (Data Transfer Objects)

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;
}

// user-query.dto.ts
export class UserQueryDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit: number = 20;

  @IsString()
  @IsOptional()
  search?: string;
}
```

#### Guards e Decorators

```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}

// roles.decorator.ts
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

#### Interceptors

```typescript
// response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
      catchError((error) => {
        throw new HttpException(
          {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          error.status || 500
        );
      })
    );
  }
}
```

### Testes Backend

```typescript
// user.service.spec.ts
describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should return paginated users", async () => {
    const mockUsers = [{ id: "1", email: "test@example.com" }];
    prisma.user.findMany = jest.fn().mockResolvedValue(mockUsers);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result).toEqual(mockUsers);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {},
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });
  });
});
```

---

## 🎨 Desenvolvimento Frontend (React)

### Estrutura de Componentes

```typescript
// components/UserProfile/UserProfile.tsx
import React from "react";
import { useUser } from "@/hooks/useUser";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileProps {
  userId: string;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  className,
}) => {
  const { user, loading, error } = useUser(userId);

  if (loading) return <UserProfileSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFoundMessage />;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserProfileDetails user={user} />
      </CardContent>
    </Card>
  );
};
```

### Custom Hooks

```typescript
// hooks/useUser.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User } from "@/types/user";

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const updateUser = async (updates: Partial<User>) => {
    try {
      const response = await api.put(`/users/${userId}`, updates);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Erro ao atualizar",
      };
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Refetch logic
    },
  };
};
```

### Context API

```typescript
// context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "@/lib/api";
import { User, AuthState } from "@/types/auth";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const response = await api.get("/auth/me");
          dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
        }
      } catch (error) {
        localStorage.removeItem("auth_token");
      } finally {
        // Set loading to false regardless
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem("auth_token", access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error instanceof Error ? error.message : "Erro no login",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete api.defaults.headers.common["Authorization"];
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### Testes Frontend

```typescript
// components/UserProfile/UserProfile.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { UserProfile } from "./UserProfile";
import { api } from "@/lib/api";

// Mock the API
jest.mock("@/lib/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("UserProfile", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "avatar.jpg",
  };

  beforeEach(() => {
    mockedApi.get.mockClear();
  });

  it("renders loading state initially", () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {}));

    render(<UserProfile userId="1" />);

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders user data when loaded", async () => {
    mockedApi.get.mockResolvedValue({ data: mockUser });

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  it("renders error state when API fails", async () => {
    mockedApi.get.mockRejectedValue(new Error("User not found"));

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar usuário")).toBeInTheDocument();
    });
  });
});
```

---

## 🔧 Ferramentas de Desenvolvimento

### Scripts NPM

#### Backend

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

#### Frontend

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "type-check": "tsc --noEmit"
  }
}
```

### Debugging

#### Backend (NestJS)

```typescript
// Adicione logs de debug
import { Logger } from "@nestjs/common";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async findUser(id: string) {
    this.logger.debug(`Finding user with id: ${id}`);

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      this.logger.debug(`Found user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user ${id}`, error);
      throw error;
    }
  }
}
```

#### Frontend (React)

```typescript
// Use React DevTools
// Adicione console.logs estratégicos
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  console.log("UserProfile rendered with userId:", userId);

  const { user, loading, error } = useUser(userId);

  useEffect(() => {
    console.log("UserProfile effect:", { user, loading, error });
  }, [user, loading, error]);

  // ... resto do componente
};
```

### Performance Monitoring

#### Backend

```typescript
// middleware/performance.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} - ${duration}ms`);

      // Log slow requests
      if (duration > 1000) {
        console.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
      }
    });

    next();
  }
}
```

#### Frontend

```typescript
// hooks/usePerformance.ts
import { useEffect, useRef } from "react";

export const usePerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `${componentName} rendered ${renderCount.current} times, took ${renderTime}ms`
      );
    }
  });

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} mounted`);
      return () => console.log(`${componentName} unmounted`);
    }
  }, []);
};
```

---

## 🧪 Estratégias de Teste

### Testes Unitários

```typescript
// Backend
describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Setup
  });

  it("should create a user", async () => {
    // Test implementation
  });
});

// Frontend
describe("UserProfile", () => {
  it("should render user data", () => {
    // Test implementation
  });
});
```

### Testes de Integração

```typescript
// Teste completo do fluxo de agendamento
describe("Appointment Flow", () => {
  it("should create appointment and send notification", async () => {
    // 1. Criar cliente
    // 2. Criar pet
    // 3. Criar agendamento
    // 4. Verificar notificação enviada
  });
});
```

### Testes E2E

```typescript
// e2e/appointment.e2e-spec.ts
describe("Appointment (e2e)", () => {
  it("should create appointment via API", () => {
    return request(app.getHttpServer())
      .post("/appointments")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        clientId: "client-1",
        petId: "pet-1",
        dateTime: "2024-01-20T14:00:00Z",
      })
      .expect(201);
  });
});
```

---

## 🚀 Deployment e CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:cov

      - name: Build application
        run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    # Deployment steps...

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    # Deployment steps...
```

### Docker Multi-stage Build

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3333
CMD ["npm", "run", "start:prod"]
```

---

## 📊 Monitoramento e Observabilidade

### Logs Estruturados

```typescript
// logger.service.ts
@Injectable()
export class LoggerService {
  private logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });

  log(level: string, message: string, meta?: any) {
    this.logger.log(level, message, meta);
  }

  error(message: string, error?: Error, meta?: any) {
    this.logger.error(message, {
      error: error?.message,
      stack: error?.stack,
      ...meta,
    });
  }
}
```

### Métricas de Performance

```typescript
// metrics.service.ts
@Injectable()
export class MetricsService {
  private registry = new promClient.Registry();

  constructor() {
    promClient.collectDefaultMetrics({ register: this.registry });
  }

  incrementCounter(name: string, labels?: Record<string, string>) {
    const counter =
      (this.registry.getSingleMetric(name) as promClient.Counter) ||
      new promClient.Counter({
        name,
        help: `${name} counter`,
        labelNames: Object.keys(labels || {}),
      });

    counter.inc(labels);
  }

  observeHistogram(
    name: string,
    value: number,
    labels?: Record<string, string>
  ) {
    const histogram =
      (this.registry.getSingleMetric(name) as promClient.Histogram) ||
      new promClient.Histogram({
        name,
        help: `${name} histogram`,
        labelNames: Object.keys(labels || {}),
      });

    histogram.observe(labels || {}, value);
  }
}
```

---

## 🔒 Segurança no Desenvolvimento

### Pre-commit Hooks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test:run
npm run type-check
```

### Code Quality Tools

```json
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
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
      - name: Run npm audit
        run: npm audit --audit-level high
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Comunidade e Suporte

- [NestJS Discord](https://discord.gg/nestjs)
- [React Discord](https://discord.gg/reactiflux)
- [Prisma Slack](https://slack.prisma.io/)

### Ferramentas Recomendadas

- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Postman](https://www.postman.com/) para testes de API
- [Figma](https://www.figma.com/) para design

---

**Última atualização:** Outubro 2025
**Versão do Guia:** 2.0
