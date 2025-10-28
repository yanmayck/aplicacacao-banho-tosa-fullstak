# Arquitetura Multi-Tenancy

## Visão Geral da Arquitetura Multi-Tenant

A arquitetura multi-tenant permite que múltiplas empresas (tenants) utilizem a mesma instância da aplicação Furry Friends Agenda, mantendo isolamento completo de dados e configurações. Cada tenant opera como se tivesse sua própria aplicação dedicada, com subdomínios personalizados e controle total sobre seus dados de clientes, pets, agendamentos e configurações.

### Princípios Fundamentais

- **Isolamento de Dados**: Cada tenant possui seu próprio banco de dados lógico ou esquema separado
- **Subdomínios Dinâmicos**: URLs como `empresa1.furryfriends.com` roteiam automaticamente para o tenant correto
- **Configurações Personalizáveis**: Cada tenant pode personalizar branding, serviços e regras de negócio
- **Escalabilidade Horizontal**: Novos tenants podem ser adicionados sem impacto na performance de outros

## Problemas Resolvidos pela Nova Arquitetura

### Problemas Atuais

1. **Escalabilidade Limitada**: Instâncias separadas consomem recursos excessivos
2. **Manutenção Complexa**: Atualizações precisam ser aplicadas em múltiplas instâncias
3. **Custos Elevados**: Infraestrutura duplicada para cada cliente
4. **Isolamento Inconsistente**: Risco de vazamento de dados entre tenants

### Soluções Implementadas

1. **Banco de Dados Compartilhado com Isolamento**: Schema separado por tenant com Row Level Security (RLS)
2. **Middleware de Tenant Resolution**: Identificação automática do tenant via subdomínio
3. **Configurações Dinâmicas**: Carregamento de configurações específicas por tenant em runtime
4. **Auditoria Multi-Tenant**: Logs e auditoria isolados por tenant

## Modelo de Dados

### Entidades Principais

#### Company (Tenant)

```prisma
model Company {
  id          String   @id @default(cuid())
  name        String
  subdomain   String   @unique
  domain      String?
  logo        String?
  theme       Json?
  settings    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  users       User[]
  clients     Client[]
  pets        Pet[]
  services    Service[]
  // ... outras relações
}
```

#### User Roles

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  companyId String
  company   Company  @relation(fields: [companyId], references: [id])

  // ... outros campos
}

enum Role {
  SUPER_ADMIN  // Acesso global (raramente usado)
  ADMIN        // Administrador da empresa
  MANAGER      // Gerente
  GROOMER      // Tosador
  USER         // Usuário básico
}
```

#### Dados Isolados por Tenant

- Clients, Pets, Appointments, Services, Financial records
- Todas as entidades incluem `companyId` para isolamento

## Hierarquia de Permissões e Roles

### Níveis de Acesso

1. **Super Admin** (Global)

   - Acesso a todos os tenants
   - Gerenciamento de infraestrutura
   - Configurações do sistema

2. **Admin** (Por Tenant)

   - Gerenciamento completo da empresa
   - Configurações de tenant
   - Gestão de usuários

3. **Manager** (Por Tenant)

   - Relatórios e analytics
   - Gestão de agendamentos
   - Controle financeiro

4. **Groomer** (Por Tenant)

   - Visualização de agendamentos próprios
   - Atualização de status de serviços
   - Gestão de pets

5. **User** (Por Tenant)
   - Acesso básico de leitura
   - Funcionalidades limitadas

### Controle de Acesso Baseado em Roles (RBAC)

- Permissões granulares por módulo
- Herança de permissões (roles superiores incluem permissões inferiores)
- Controle de acesso a dados específicos (ex: apenas pets do groomer)

## Separação Público vs Privado

### Área Pública

- Landing page genérica
- Formulário de contato
- Serviços disponíveis (sem autenticação)
- URL: `furryfriends.com`

### Área Privada (Por Tenant)

- Dashboard administrativo
- Gestão de clientes e pets
- Agendamentos e financeiro
- URL: `{subdomain}.furryfriends.com`

### Middleware de Separação

```typescript
// Middleware para identificar contexto
if (isPublicRoute(req)) {
  // Lógica pública
} else {
  const tenant = await resolveTenant(req.subdomain);
  req.tenant = tenant;
  // Lógica privada com isolamento
}
```

## Sistema de Subdomínios

### Resolução de Tenant

1. **Subdomínio Dinâmico**: `empresa.furryfriends.com`
2. **Domínio Personalizado**: `empresa.com` (opcional)
3. **Fallback**: Redirecionamento para página de erro se tenant não existir

### Implementação Técnica

```typescript
// Serviço de resolução de tenant
@Injectable()
export class TenantService {
  async resolveTenant(subdomain: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { subdomain },
    });

    if (!company) {
      throw new NotFoundException("Tenant not found");
    }

    return company;
  }
}
```

### Configuração DNS

- Wildcard DNS: `*.furryfriends.com`
- SSL automático via Let's Encrypt
- CDN com suporte a subdomínios dinâmicos

## Plano de Implementação com Fases

### Fase 1: Fundamentos (Semanas 1-2)

- [x] Modelo de dados multi-tenant
- [x] Middleware de resolução de tenant
- [x] Isolamento básico de dados
- [x] Autenticação por tenant

### Fase 2: Funcionalidades Core (Semanas 3-6)

- [ ] Sistema de subdomínios
- [ ] Configurações personalizáveis
- [ ] RBAC completo
- [ ] Separação público/privado

### Fase 3: Otimizações (Semanas 7-8)

- [ ] Cache multi-tenant
- [ ] Otimização de performance
- [ ] Backup e restore por tenant
- [ ] Analytics por tenant

### Fase 4: Produção (Semanas 9-10)

- [ ] Migração de dados existentes
- [ ] Testes de carga
- [ ] Documentação completa
- [ ] Deploy em produção

## Notas de Migração

Esta seção documenta as mudanças breaking que precisam ser implementadas quando o multi-tenancy for ativado. Estas tarefas servem como lembrete das modificações necessárias para garantir isolamento completo de dados entre tenants.

### 1. Migração de Dados Existente para Empresa Padrão

**Status:** Pendente
**Prioridade:** Alta

- Criar empresa padrão (Company) para dados existentes
- Associar todos os registros atuais (clients, pets, services, etc.) à empresa padrão
- Executar script de migração que adiciona `companyId` a todas as tabelas existentes
- Verificar integridade dos dados após migração

```sql
-- Exemplo de script de migração
INSERT INTO "Company" (id, name, subdomain, "createdAt", "updatedAt")
VALUES ('default-company-id', 'Empresa Padrão', 'default', NOW(), NOW());

-- Atualizar todas as tabelas com companyId
UPDATE "User" SET "companyId" = 'default-company-id' WHERE "companyId" IS NULL;
UPDATE "Client" SET "companyId" = 'default-company-id' WHERE "companyId" IS NULL;
-- ... continuar para todas as entidades
```

### 2. Atualização de Queries para Incluir companyId

**Status:** Pendente
**Prioridade:** Alta

- Modificar todos os serviços para incluir filtros por `companyId`
- Atualizar queries do Prisma para usar `where: { companyId }`
- Implementar Row Level Security (RLS) no banco de dados
- Revisar queries de relatório para isolamento por tenant

```typescript
// Antes
const clients = await this.prisma.client.findMany();

// Depois
const clients = await this.prisma.client.findMany({
  where: { companyId: currentTenant.id },
});
```

### 3. Modificação de Guards e Middlewares

**Status:** Pendente
**Prioridade:** Crítica

- Atualizar `JwtAuthGuard` para validar tenant do usuário
- Modificar middlewares de autenticação para incluir contexto de tenant
- Implementar `TenantGuard` para proteção de rotas multi-tenant
- Atualizar interceptors para adicionar `companyId` automaticamente

```typescript
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenant = request.tenant;

    return user.companyId === tenant.id;
  }
}
```

### 4. Criação de Usuário SUPER_ADMIN

**Status:** Pendente
**Prioridade:** Média

- Criar role `SUPER_ADMIN` no enum Role
- Implementar usuário global com acesso a todos os tenants
- Configurar permissões especiais para gerenciamento cross-tenant
- Atualizar guards para permitir acesso global ao SUPER_ADMIN

```typescript
enum Role {
  SUPER_ADMIN  // Acesso global a todos os tenants
  ADMIN        // Administrador da empresa
  MANAGER      // Gerente
  GROOMER      // Tosador
  USER         // Usuário básico
}
```

### 5. Testes de Isolamento de Dados

**Status:** Pendente
**Prioridade:** Alta

- Implementar testes automatizados para isolamento entre tenants
- Criar tenants de teste para validação
- Testar vazamento de dados entre empresas
- Validar permissões e acesso por role

```typescript
describe("Multi-Tenant Isolation", () => {
  it("should not allow tenant A to access tenant B data", async () => {
    const tenantA = await createTestTenant("tenantA");
    const tenantB = await createTestTenant("tenantB");

    const clientA = await createTestClient(tenantA.id);
    const clientB = await createTestClient(tenantB.id);

    // Testar acesso negado
    await expect(getClient(clientA.id, tenantB)).rejects.toThrow();
  });
});
```

### Checklist de Migração

- [ ] Backup completo do banco de dados
- [ ] Ambiente de staging para testes de migração
- [ ] Scripts de rollback preparados
- [ ] Documentação de rollback atualizada
- [ ] Time de desenvolvimento alinhado sobre downtime
- [ ] Plano de comunicação com usuários
- [ ] Testes de performance pós-migração
- [ ] Validação de integridade de dados

## Benefícios e Roadmap

### Benefícios Imediatos

1. **Redução de Custos**: ~70% economia em infraestrutura
2. **Manutenção Simplificada**: Atualizações em uma única base de código
3. **Escalabilidade**: Adição de novos tenants instantânea
4. **Isolamento Garantido**: Segurança de dados por design

### Benefícios de Longo Prazo

1. **Analytics Global**: Insights agregados de todos os tenants
2. **Feature Flags por Tenant**: Rollout controlado de funcionalidades
3. **Marketplace de Plugins**: Ecossistema extensível
4. **Integração com SaaS**: Possibilidade de white-label

### Roadmap 2024-2025

#### Q4 2024

- Implementação base multi-tenant
- Migração de clientes existentes
- Sistema de subdomínios

#### Q1 2025

- Marketplace de templates
- Integrações avançadas
- Mobile app multi-tenant

#### Q2 2025

- Analytics avançado
- IA personalizada por tenant
- Suporte a múltiplos idiomas

#### Q3-Q4 2025

- Enterprise features
- Compliance avançado (GDPR, LGPD)
- Global expansion

### Métricas de Sucesso

- Tempo de provisionamento de novo tenant: < 5 minutos
- Uptime por tenant: > 99.9%
- Performance: < 100ms latência adicional por isolamento
- Segurança: Zero vazamentos de dados entre tenants
