# Furry Friends Agenda - Sistema de Gestão de Agendamentos para Pet Shop

## Visão Geral
Este é um sistema full-stack de gestão de agendamentos para pet shops, que ajuda a gerenciar clientes, pets, tosadores, agendamentos e pacotes. A aplicação foi originalmente projetada para rodar com Docker Compose e foi adaptada para rodar no Replit.

## Estrutura do Projeto

### Backend (`furry-friends-agenda-backend/`)
- **Framework**: NestJS (Framework Node.js)
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: Autenticação baseada em JWT
- **Porta**: 3333 (apenas localhost)

### Frontend (`furry-friends-agenda-app/`)
- **Framework**: React com Vite
- **UI**: Tailwind CSS com componentes shadcn/ui
- **Gerenciamento de Estado**: React Context API
- **Porta**: 5000 (exposta publicamente)

## Arquitetura

### Schema do Banco de Dados
A aplicação usa Prisma ORM com os seguintes modelos principais:
- **User**: Usuários do sistema com acesso baseado em funções (USER/ADMIN)
- **Client**: Proprietários de pets/clientes
- **Pet**: Pets pertencentes aos clientes
- **Groomer**: Tosadores profissionais
- **Appointment**: Agendamentos de tosa/banho
- **ServicePackage**: Serviços de tosa disponíveis
- **Package**: Pacotes de serviços com preços

### Funcionalidades Principais
- Autenticação e autorização de usuários
- Gestão de clientes e pets
- Gestão de tosadores com especialidades e comissões
- Agendamento e rastreamento de horários
- Pacotes de serviços e preços
- Quadro de agendamentos com funcionalidade de arrastar e soltar (drag-and-drop)
- Relatórios e análises

## Configuração de Desenvolvimento

### Variáveis de Ambiente
Segredos necessários (já configurados nos Segredos do Replit):
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
- `JWT_EXPIRES_IN`: Tempo de expiração do token (ex: "1d")
- `DATABASE_URL`: String de conexão do PostgreSQL

### Configuração do Banco de Dados
⚠️ **Importante**: Você precisa configurar um banco de dados PostgreSQL para que esta aplicação funcione corretamente.

1. Na barra lateral do Replit, vá para **Tools → Database**
2. Provisione um banco de dados PostgreSQL
3. Copie a URL de conexão
4. Atualize o segredo `DATABASE_URL` com a nova string de conexão
5. Execute as migrações:
   ```bash
   cd furry-friends-agenda-backend
   npx prisma migrate deploy
   ```

### Executando a Aplicação
A aplicação usa um script de inicialização combinado (`start.sh`) que:
1. Inicia o backend na porta 3333
2. Inicia o frontend na porta 5000

O fluxo de trabalho já está configurado e iniciará automaticamente.

## Configuração de Portas
- **Frontend**: Porta 5000 (webview) - Esta é a interface principal da aplicação
- **Backend**: Porta 3333 (apenas localhost) - Servidor API

O frontend se comunica com o backend via `http://localhost:3333`.

## Mudanças Recentes (Configuração Replit - 13 de Out, 2025)

### Atualizações de Configuração
1. **Backend (`furry-friends-agenda-backend/src/main.ts`)**
   - CORS atualizado para incluir o domínio do Replit
   - Porta alterada para 3333 (de 3000)
   - Host alterado para 'localhost' (backend acessível apenas internamente)
   - Adicionado suporte para variável de ambiente REPLIT_DEV_DOMAIN

2. **Frontend (`furry-friends-agenda-app/vite.config.ts`)**
   - Porta alterada de 8080 para 5000
   - Host alterado para "0.0.0.0" para compatibilidade com Replit
   - Adicionado strictPort: true para garantir o uso da porta 5000

3. **Ambiente Frontend (`furry-friends-agenda-app/.env`)**
   - VITE_API_BASE_URL definido para http://localhost:3333

### Configuração do Workflow
- Workflow único chamado "Server" que roda tanto backend quanto frontend
- Frontend exposto na porta 5000 para webview
- Backend roda internamente na porta 3333

## Endpoints da API

### Autenticação
- POST `/auth/register` - Registrar novo usuário
- POST `/auth/login` - Login de usuário

### Clientes
- GET `/clients` - Listar todos os clientes
- GET `/clients/:id` - Obter cliente por ID
- POST `/clients` - Criar novo cliente
- PATCH `/clients/:id` - Atualizar cliente
- DELETE `/clients/:id` - Deletar cliente

### Pets
- GET `/pets` - Listar todos os pets
- GET `/pets/:id` - Obter pet por ID
- POST `/pets` - Criar novo pet
- PATCH `/pets/:id` - Atualizar pet
- DELETE `/pets/:id` - Deletar pet

### Tosadores (Groomers)
- GET `/groomers` - Listar todos os tosadores
- GET `/groomers/:id` - Obter tosador por ID
- POST `/groomers` - Criar novo tosador
- PATCH `/groomers/:id` - Atualizar tosador
- DELETE `/groomers/:id` - Deletar tosador

### Agendamentos (Appointments)
- GET `/appointments` - Listar todos os agendamentos
- GET `/appointments/:id` - Obter agendamento por ID
- POST `/appointments` - Criar novo agendamento
- PATCH `/appointments/:id` - Atualizar agendamento
- DELETE `/appointments/:id` - Deletar agendamento

### Pacotes (Packages)
- GET `/packages` - Listar todos os pacotes
- GET `/packages/:id` - Obter pacote por ID
- POST `/packages` - Criar novo pacote
- PATCH `/packages/:id` - Atualizar pacote
- DELETE `/packages/:id` - Deletar pacote

### Serviços
- GET `/services` - Listar todos os serviços
- GET `/services/:id` - Obter serviço por ID
- POST `/services` - Criar novo serviço
- PATCH `/services/:id` - Atualizar serviço
- DELETE `/services/:id` - Deletar serviço

## Preferências do Usuário
- Idioma: Português (BR) - A UI da aplicação está em Português
- Autenticação: Baseada em JWT com controle de acesso por função (USER/ADMIN)

## Deployment
A configuração de deployment será definida após o banco de dados ser devidamente provisionado e testado.

## Testes
O projeto inclui arquivos de teste para vários componentes. Execute os testes com:
```bash
# Testes do Backend
cd furry-friends-agenda-backend
npm test

# Testes do Frontend
cd furry-friends-agenda-app
npm test
```

## Notas
- A aplicação foi originalmente projetada para deployment com Docker Compose
- Atualmente adaptada para o ambiente Replit
- O banco de dados precisa ser provisionado através da UI do Replit antes da funcionalidade completa estar disponível
- O frontend usa localStorage para gerenciamento de tokens
- O backend usa bcrypt para hash de senhas
