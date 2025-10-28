# Sistema de Seed - Furry Friends Agenda

## Visão Geral

O sistema de seed é responsável por criar dados iniciais no banco de dados, incluindo uma empresa padrão e um usuário SUPER_ADMIN para desenvolvimento e configuração inicial do sistema.

## Funcionalidades

### ✅ Script de Seed (`prisma/seed.ts`)

- Cria empresa padrão "Furry Friends Agenda"
- Cria usuário SUPER_ADMIN com credenciais seguras
- Verifica duplicatas para evitar execução múltipla
- Usa variáveis de ambiente para configuração

### ✅ Verificação de Duplicatas

- Verifica se SUPER_ADMIN já existe antes de criar
- Evita criação de dados duplicados
- Seguro para execução múltipla

### ✅ Configuração para Desenvolvimento (Docker)

- Script `docker-entrypoint.sh` executa seed automaticamente
- Apenas em ambiente de desenvolvimento
- Aguardar banco de dados estar disponível

### ✅ Configuração para Produção

- Seed desabilitado por padrão em produção
- Variáveis de ambiente controlam execução
- Credenciais configuráveis via ambiente

### ✅ Estratégia Segura para Credenciais

- Senhas hasheadas com bcrypt
- Variáveis de ambiente para credenciais
- Seed condicional baseado em NODE_ENV

## Credenciais Padrão (Desenvolvimento)

### SUPER_ADMIN

- **Email:** `superadmin@furryfriends.com`
- **Senha:** `SuperAdmin123!`
- **Nome:** `Super Administrador`
- **Role:** `SUPER_ADMIN`

### Empresa Padrão

- **Nome:** `Furry Friends Agenda`
- **Slug:** `furry-friends-agenda`
- **Email:** `admin@furryfriends.com`
- **Telefone:** `+55 11 99999-9999`

## Como Usar

### Desenvolvimento (Docker)

O seed é executado automaticamente quando o container inicia em modo desenvolvimento:

```bash
# No docker-compose.yml, certifique-se que as variáveis estão definidas
environment:
  - NODE_ENV=development
  - SEED_SUPER_ADMIN_EMAIL=superadmin@furryfriends.com
  - SEED_SUPER_ADMIN_PASSWORD=SuperAdmin123!
  # ... outras variáveis
```

### Desenvolvimento (Local)

```bash
# Executar seed manualmente
npm run prisma:seed

# Ou executar migrações + seed
npm run db:setup
```

### Produção

**IMPORTANTE:** Em produção, o seed NÃO deve ser executado automaticamente. Configure o banco manualmente:

1. **Remova** as variáveis `SEED_*` do arquivo `.env`
2. Execute as migrações:
   ```bash
   npx prisma migrate deploy
   ```
3. Crie o SUPER_ADMIN manualmente através da interface ou API
4. Ou execute o seed uma vez manualmente (se necessário):
   ```bash
   SEED_SUPER_ADMIN_EMAIL=seu-email@empresa.com \
   SEED_SUPER_ADMIN_PASSWORD=SuaSenhaSegura123! \
   npx prisma db seed
   ```

## Variáveis de Ambiente

### Obrigatórias para Seed

```env
# Credenciais do SUPER_ADMIN
SEED_SUPER_ADMIN_EMAIL=superadmin@furryfriends.com
SEED_SUPER_ADMIN_PASSWORD=SuperAdmin123!
SEED_SUPER_ADMIN_NAME=Super Administrador

# Dados da empresa
SEED_COMPANY_NAME=Furry Friends Agenda
SEED_COMPANY_SLUG=furry-friends-agenda
SEED_COMPANY_EMAIL=admin@furryfriends.com
SEED_COMPANY_PHONE=+55 11 99999-9999
```

### Recomendações de Segurança

1. **Nunca commite credenciais reais** no código
2. **Use senhas fortes** em produção
3. **Altere a senha** após o primeiro login
4. **Remova variáveis SEED\_\*** em produção
5. **Configure credenciais via secrets** em produção (Docker, Kubernetes, etc.)

## Estrutura dos Arquivos

```
prisma/
├── seed.ts                    # Script principal de seed
└── schema.prisma             # Schema do banco

docker-entrypoint.sh          # Script de entrada Docker

.env                          # Variáveis de desenvolvimento
.env.example                  # Exemplo de configuração

package.json                  # Scripts npm para seed
```

## Comandos Disponíveis

```bash
# Executar seed
npm run prisma:seed

# Executar migrações + seed
npm run db:setup

# Apenas migrações (produção)
npx prisma migrate deploy
```

## Logs de Execução

O seed produz logs informativos:

```
🌱 Iniciando seed do banco de dados...
✅ Empresa padrão criada: Furry Friends Agenda
✅ SUPER_ADMIN criado com sucesso!
📧 Email: superadmin@furryfriends.com
🔑 Senha: SuperAdmin123!
⚠️  IMPORTANTE: Altere a senha após o primeiro login!
🎉 Seed concluído com sucesso!
```

## Troubleshooting

### Seed não executa

- Verifique se `NODE_ENV=development`
- Confirme que variáveis `SEED_*` estão definidas
- Execute `npm run prisma:seed` manualmente

### Erro de duplicata

- Seed já foi executado anteriormente
- Verifique se SUPER_ADMIN já existe no banco

### Problemas com Docker

- Certifique-se que `docker-entrypoint.sh` tem permissões de execução
- Verifique logs do container: `docker logs <container_id>`

## Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Verificação de duplicatas
- ✅ Execução condicional baseada em ambiente
- ✅ Variáveis de ambiente para credenciais
- ✅ Seed desabilitado em produção por padrão

## Próximos Passos

Após executar o seed:

1. **Faça login** com as credenciais padrão
2. **Altere a senha** imediatamente
3. **Configure** usuários adicionais conforme necessário
4. **Remova** variáveis SEED\_\* do ambiente de produção
