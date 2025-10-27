# 📡 API Documentation - Furry Friends Agenda

## Visão Geral da API

A API do **Furry Friends Agenda** é construída com **NestJS** e segue os padrões **RESTful**. Esta documentação detalha todos os endpoints, parâmetros, respostas e exemplos de uso.

---

## 🔐 Autenticação

### JWT Authentication

Todos os endpoints (exceto login/registro) requerem autenticação via JWT token.

```http
Authorization: Bearer <jwt_token>
```

### Endpoints de Autenticação

#### POST `/auth/login`

Autenticação de usuário.

**Request:**

```json
{
  "email": "admin@furryfriends.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "admin@furryfriends.com",
    "name": "Administrador",
    "role": "ADMIN"
  }
}
```

#### POST `/auth/register`

Registro de novo usuário.

**Request:**

```json
{
  "email": "newuser@furryfriends.com",
  "password": "securepassword",
  "name": "Novo Usuário"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_456",
    "email": "newuser@furryfriends.com",
    "name": "Novo Usuário",
    "role": "USER"
  }
}
```

---

## 👥 Gestão de Usuários

### GET `/users`

Lista todos os usuários (apenas ADMIN).

**Query Parameters:**

- `page` (number): Página atual (default: 1)
- `limit` (number): Itens por página (default: 20)
- `search` (string): Busca por nome/email
- `role` (string): Filtrar por role (USER/ADMIN)

**Response:**

```json
{
  "data": [
    {
      "id": "user_123",
      "email": "admin@furryfriends.com",
      "name": "Administrador",
      "role": "ADMIN",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET `/users/:id`

Obtém detalhes de um usuário específico.

**Response:**

```json
{
  "id": "user_123",
  "email": "admin@furryfriends.com",
  "name": "Administrador",
  "role": "ADMIN",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### PUT `/users/:id`

Atualiza dados de um usuário.

**Request:**

```json
{
  "name": "Administrador Atualizado",
  "role": "ADMIN"
}
```

### DELETE `/users/:id`

Remove um usuário (apenas ADMIN).

---

## 🐾 Gestão de Clientes

### GET `/clients`

Lista todos os clientes.

**Query Parameters:**

- `page` (number): Página atual
- `limit` (number): Itens por página
- `search` (string): Busca por nome/telefone/email
- `hasPets` (boolean): Filtrar clientes com/sem pets

**Response:**

```json
{
  "data": [
    {
      "id": "client_123",
      "name": "João Silva",
      "phone": "+5511999999999",
      "email": "joao@email.com",
      "address": "Rua das Flores, 123",
      "pets": [
        {
          "id": "pet_456",
          "name": "Rex",
          "species": "Cachorro",
          "breed": "Golden Retriever"
        }
      ],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### POST `/clients`

Cria um novo cliente.

**Request:**

```json
{
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "address": "Rua das Flores, 123, São Paulo - SP"
}
```

**Response:**

```json
{
  "id": "client_123",
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "address": "Rua das Flores, 123, São Paulo - SP",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### GET `/clients/:id`

Obtém detalhes completos de um cliente.

**Response:**

```json
{
  "id": "client_123",
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "address": "Rua das Flores, 123, São Paulo - SP",
  "pets": [
    {
      "id": "pet_456",
      "name": "Rex",
      "species": "Cachorro",
      "breed": "Golden Retriever",
      "birthDate": "2020-05-15",
      "observations": "Alergia a shampoo comum"
    }
  ],
  "appointments": [
    {
      "id": "appt_789",
      "dateTime": "2024-01-20T14:00:00Z",
      "status": "SCHEDULED",
      "totalPrice": 85.0,
      "pet": {
        "name": "Rex"
      }
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### PUT `/clients/:id`

Atualiza dados de um cliente.

**Request:**

```json
{
  "name": "João Silva Santos",
  "phone": "+5511999999999",
  "email": "joao.santos@email.com"
}
```

### DELETE `/clients/:id`

Remove um cliente (soft delete).

---

## 🐶 Gestão de Pets

### GET `/pets`

Lista todos os pets.

**Query Parameters:**

- `page`, `limit`: Paginação
- `search`: Busca por nome
- `species`: Filtrar por espécie
- `clientId`: Pets de um cliente específico

**Response:**

```json
{
  "data": [
    {
      "id": "pet_456",
      "name": "Rex",
      "species": "Cachorro",
      "breed": "Golden Retriever",
      "birthDate": "2020-05-15",
      "clientId": "client_123",
      "client": {
        "name": "João Silva"
      },
      "observations": "Alergia a shampoo comum",
      "foodType": "Ração premium",
      "lastTickMedicine": {
        "name": "Vermífugo",
        "date": "2024-01-10"
      },
      "rabiesVaccine": {
        "isUpToDate": true,
        "lastDate": "2024-01-05"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### POST `/pets`

Cria um novo pet.

**Request:**

```json
{
  "name": "Rex",
  "species": "Cachorro",
  "breed": "Golden Retriever",
  "birthDate": "2020-05-15",
  "clientId": "client_123",
  "observations": "Alergia a shampoo comum",
  "foodType": "Ração premium"
}
```

### GET `/pets/:id`

Obtém detalhes de um pet específico.

### PUT `/pets/:id`

Atualiza dados de um pet.

### DELETE `/pets/:id`

Remove um pet.

---

## ✂️ Gestão de Tosadores

### GET `/groomers`

Lista todos os tosadores.

**Response:**

```json
{
  "data": [
    {
      "id": "groomer_789",
      "name": "Maria Tosadora",
      "phone": "+5511988888888",
      "email": "maria@furryfriends.com",
      "specialties": ["Banho", "Tosa", "Hidratação"],
      "status": "available",
      "commissionPercentage": 20.0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/groomers`

Cria um novo tosador.

**Request:**

```json
{
  "name": "Maria Tosadora",
  "phone": "+5511988888888",
  "email": "maria@furryfriends.com",
  "specialties": ["Banho", "Tosa"],
  "commissionPercentage": 20.0
}
```

### PUT `/groomers/:id`

Atualiza dados de um tosador.

### DELETE `/groomers/:id`

Remove um tosador.

---

## 📅 Gestão de Agendamentos

### GET `/appointments`

Lista todos os agendamentos.

**Query Parameters:**

- `page`, `limit`: Paginação
- `startDate`, `endDate`: Filtro por período
- `status`: Filtrar por status
- `clientId`: Agendamentos de um cliente
- `groomerId`: Agendamentos de um tosador
- `petId`: Agendamentos de um pet

**Response:**

```json
{
  "data": [
    {
      "id": "appt_101",
      "dateTime": "2024-01-20T14:00:00Z",
      "status": "SCHEDULED",
      "notes": "Cliente prefere horário da tarde",
      "totalPrice": 85.0,
      "clientId": "client_123",
      "client": {
        "name": "João Silva",
        "phone": "+5511999999999"
      },
      "petId": "pet_456",
      "pet": {
        "name": "Rex",
        "species": "Cachorro",
        "observations": "Alergia a shampoo comum"
      },
      "groomerId": "groomer_789",
      "groomer": {
        "name": "Maria Tosadora"
      },
      "appointmentServices": [
        {
          "id": "appt_svc_202",
          "serviceId": "svc_303",
          "service": {
            "name": "Banho Completo",
            "price": 45.0,
            "durationMin": 60
          },
          "priceAtTime": 45.0,
          "quantity": 1
        },
        {
          "id": "appt_svc_203",
          "serviceId": "svc_304",
          "service": {
            "name": "Tosa Higiênica",
            "price": 40.0,
            "durationMin": 30
          },
          "priceAtTime": 40.0,
          "quantity": 1
        }
      ],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

### POST `/appointments`

Cria um novo agendamento.

**Request:**

```json
{
  "dateTime": "2024-01-20T14:00:00Z",
  "notes": "Cliente prefere horário da tarde",
  "clientId": "client_123",
  "petId": "pet_456",
  "groomerId": "groomer_789",
  "services": [
    {
      "serviceId": "svc_303",
      "quantity": 1
    },
    {
      "serviceId": "svc_304",
      "quantity": 1
    }
  ]
}
```

**Response:**

```json
{
  "id": "appt_101",
  "dateTime": "2024-01-20T14:00:00Z",
  "status": "SCHEDULED",
  "totalPrice": 85.00,
  "clientId": "client_123",
  "petId": "pet_456",
  "groomerId": "groomer_789",
  "appointmentServices": [...],
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### GET `/appointments/:id`

Obtém detalhes completos de um agendamento.

### PUT `/appointments/:id`

Atualiza um agendamento.

**Request:**

```json
{
  "dateTime": "2024-01-20T15:00:00Z",
  "status": "CONFIRMED",
  "notes": "Horário alterado por solicitação do cliente"
}
```

### DELETE `/appointments/:id`

Cancela um agendamento.

### PUT `/appointments/:id/status`

Atualiza apenas o status do agendamento.

**Request:**

```json
{
  "status": "COMPLETED",
  "notes": "Serviço realizado com sucesso"
}
```

---

## 💇‍♀️ Gestão de Serviços

### GET `/services`

Lista todos os serviços disponíveis.

**Response:**

```json
{
  "data": [
    {
      "id": "svc_303",
      "name": "Banho Completo",
      "description": "Banho, secagem e escovação",
      "price": 45.0,
      "durationMin": 60,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "svc_304",
      "name": "Tosa Higiênica",
      "description": "Tosa de unhas, ouvidos e região íntima",
      "price": 40.0,
      "durationMin": 30,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/services`

Cria um novo serviço.

**Request:**

```json
{
  "name": "Banho Premium",
  "description": "Banho com produtos importados",
  "price": 65.0,
  "durationMin": 90
}
```

### PUT `/services/:id`

Atualiza um serviço.

### DELETE `/services/:id`

Remove um serviço.

---

## 💰 Gestão Financeira

### GET `/financial/transactions`

Lista todas as transações financeiras.

**Query Parameters:**

- `page`, `limit`: Paginação
- `type`: INCOME ou EXPENSE
- `startDate`, `endDate`: Período
- `categoryId`: Categoria específica

**Response:**

```json
{
  "data": [
    {
      "id": "txn_404",
      "type": "INCOME",
      "amount": 85.0,
      "description": "Serviço - Rex (Banho Completo, Tosa Higiênica)",
      "date": "2024-01-20T14:00:00Z",
      "categoryId": "cat_505",
      "category": {
        "name": "Serviços de Banho e Tosa",
        "type": "INCOME"
      },
      "appointmentId": "appt_101",
      "appointment": {
        "client": { "name": "João Silva" },
        "pet": { "name": "Rex" }
      },
      "paymentMethod": "Dinheiro",
      "createdAt": "2024-01-20T14:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### POST `/financial/transactions`

Cria uma nova transação.

**Request:**

```json
{
  "type": "INCOME",
  "amount": 85.0,
  "description": "Pagamento de serviço",
  "date": "2024-01-20T14:00:00Z",
  "categoryId": "cat_505",
  "appointmentId": "appt_101",
  "paymentMethod": "Dinheiro"
}
```

### GET `/financial/categories`

Lista categorias financeiras.

**Response:**

```json
{
  "data": [
    {
      "id": "cat_505",
      "name": "Serviços de Banho e Tosa",
      "type": "INCOME",
      "isActive": true
    },
    {
      "id": "cat_606",
      "name": "Produtos e Materiais",
      "type": "EXPENSE",
      "isActive": true
    }
  ]
}
```

### GET `/financial/reports/summary`

Relatório financeiro resumido.

**Query Parameters:**

- `startDate`, `endDate`: Período do relatório

**Response:**

```json
{
  "period": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z"
  },
  "summary": {
    "totalIncome": 12500.0,
    "totalExpenses": 3200.0,
    "netProfit": 9300.0,
    "transactionCount": 180
  },
  "byCategory": {
    "Serviços de Banho e Tosa": {
      "total": 12500.0,
      "count": 150
    },
    "Produtos e Materiais": {
      "total": 2200.0,
      "count": 25
    }
  }
}
```

---

## 🔌 Sistema de Plugins

### GET `/plugins`

Lista plugins instalados.

**Response:**

```json
{
  "data": [
    {
      "id": "plugin_whatsapp",
      "name": "whatsapp-notifications",
      "version": "1.0.0",
      "description": "Notificações via WhatsApp",
      "author": "Furry Friends Team",
      "isActive": true,
      "isInstalled": true,
      "installedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### GET `/plugins/available`

Lista plugins disponíveis para instalação.

### POST `/plugins/:name/install`

Instala um plugin.

### POST `/plugins/:name/enable`

Ativa um plugin.

### POST `/plugins/:name/disable`

Desativa um plugin.

### PUT `/plugins/:name/config`

Atualiza configuração de um plugin.

**Request:**

```json
{
  "apiUrl": "https://api.whatsapp.com/send",
  "apiKey": "your-api-key",
  "enableReminders": true
}
```

---

## 📊 Relatórios

### GET `/reports/appointments`

Relatório de agendamentos.

**Query Parameters:**

- `startDate`, `endDate`: Período
- `status`: Status dos agendamentos
- `groomerId`: Filtrar por tosador

**Response:**

```json
{
  "period": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z"
  },
  "summary": {
    "totalAppointments": 150,
    "completedAppointments": 145,
    "cancelledAppointments": 3,
    "noShowAppointments": 2,
    "totalRevenue": 12500.0,
    "averageTicket": 86.21
  },
  "byStatus": {
    "SCHEDULED": 12,
    "CONFIRMED": 8,
    "COMPLETED": 145,
    "CANCELLED": 3,
    "NO_SHOW": 2
  },
  "byGroomer": {
    "Maria Tosadora": {
      "total": 75,
      "completed": 73,
      "revenue": 6500.0
    }
  }
}
```

### GET `/reports/clients`

Relatório de clientes.

**Response:**

```json
{
  "summary": {
    "totalClients": 120,
    "activeClients": 95,
    "newClientsThisMonth": 15,
    "returningClients": 80
  },
  "retention": {
    "oneTimeClients": 25,
    "returningClients": 80,
    "loyalClients": 15
  },
  "byAcquisition": {
    "Indicação": 45,
    "Redes Sociais": 30,
    "Google": 25,
    "Outros": 20
  }
}
```

---

## 📞 Notificações

### GET `/notifications`

Lista notificações do usuário.

**Response:**

```json
{
  "data": [
    {
      "id": "notif_707",
      "title": "Agendamento Confirmado",
      "message": "Seu agendamento para Rex foi confirmado para amanhã às 14h",
      "type": "APPOINTMENT_CONFIRMATION",
      "isRead": false,
      "createdAt": "2024-01-19T16:00:00Z",
      "data": {
        "appointmentId": "appt_101"
      }
    }
  ]
}
```

### PUT `/notifications/:id/read`

Marca notificação como lida.

### POST `/notifications/send`

Envia notificação manual (ADMIN).

**Request:**

```json
{
  "title": "Manutenção Programada",
  "message": "O sistema ficará indisponível amanhã das 2h às 4h",
  "type": "INFO",
  "targetUsers": ["all"] // ou ["user_123", "user_456"]
}
```

---

## ⚙️ Configurações do Sistema

### GET `/settings`

Obtém configurações do sistema.

**Response:**

```json
{
  "company": {
    "name": "Furry Friends Pet Shop",
    "cnpj": "12.345.678/0001-90",
    "address": "Rua das Flores, 123",
    "phone": "+5511999999999",
    "email": "contato@furryfriends.com"
  },
  "business": {
    "openingHours": {
      "monday": { "open": "08:00", "close": "18:00" },
      "tuesday": { "open": "08:00", "close": "18:00" }
    },
    "services": [...],
    "policies": {
      "cancellationHours": 24,
      "depositRequired": false
    }
  },
  "notifications": {
    "emailEnabled": true,
    "smsEnabled": false,
    "whatsappEnabled": true
  }
}
```

### PUT `/settings`

Atualiza configurações do sistema.

---

## 🔍 Pesquisa Global

### GET `/search`

Busca global no sistema.

**Query Parameters:**

- `q` (string): Termo de busca (obrigatório)
- `type` (string): Tipo de entidade (clients, pets, appointments, etc.)
- `limit` (number): Máximo de resultados por tipo

**Response:**

```json
{
  "query": "rex",
  "results": {
    "clients": [
      {
        "id": "client_123",
        "name": "João Silva",
        "type": "client",
        "match": "related_pet"
      }
    ],
    "pets": [
      {
        "id": "pet_456",
        "name": "Rex",
        "type": "pet",
        "match": "name"
      }
    ],
    "appointments": [
      {
        "id": "appt_101",
        "description": "Serviço para Rex",
        "type": "appointment",
        "match": "description"
      }
    ]
  },
  "total": 3
}
```

---

## 📋 Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Operação bem-sucedida sem conteúdo de retorno
- **400 Bad Request**: Dados inválidos na requisição
- **401 Unauthorized**: Token inválido ou ausente
- **403 Forbidden**: Permissão negada
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: email já existe)
- **422 Unprocessable Entity**: Validação falhou
- **429 Too Many Requests**: Rate limit excedido
- **500 Internal Server Error**: Erro interno do servidor

---

## 📊 Limites e Paginação

### Paginação Padrão

- **Página inicial**: 1
- **Itens por página**: 20
- **Máximo por página**: 100

### Rate Limiting

- **Autenticado**: 1000 requests/hora
- **Não autenticado**: 100 requests/hora
- **Headers**: `X-RateLimit-*`

### Timeouts

- **Database queries**: 30 segundos
- **External APIs**: 10 segundos
- **File uploads**: 5 minutos

---

## 🔒 Segurança da API

### Headers de Segurança

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### Validação de Dados

- **Input sanitization**: Prevenção de XSS
- **SQL injection**: Prevenção via ORM
- **Type validation**: Validação de tipos TypeScript
- **Business rules**: Validação de regras de negócio

### Logs de Auditoria

Todas as operações são logadas com:

- Usuário que executou
- Timestamp
- IP do cliente
- Dados alterados
- Resultado da operação

---

**Última atualização:** Outubro 2025
**Versão da API:** 2.0
