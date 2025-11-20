# Furry Friends Agenda 🐾

## Visão Geral
**Furry Friends Agenda** é um sistema completo e full-stack para gerenciamento de banho e tosa. Foi projetado para otimizar operações de pet shops, gerenciando agendamentos, clientes, pets e registros financeiros com uma arquitetura moderna, robusta e escalável.

## 🏗️ Arquitetura

O projeto segue uma estrutura de **Monorepo** utilizando NPM Workspaces, garantindo gerenciamento unificado de dependências e segurança de tipos em toda a stack.

### Estrutura
```text
/
├── apps/
│   ├── backend/    # API NestJS (Modular, Type-Safe)
│   └── frontend/   # React + Vite (UI Moderna)
└── packages/
    └── types/      # Interfaces TypeScript Compartilhadas & DTOs
```

### Tech Stack
*   **Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL.
*   **Frontend:** React, Vite, TailwindCSS, Shadcn/UI, TanStack Query.
*   **Infraestrutura:** Docker, Docker Compose.
*   **Qualidade:** ESLint (Estrito), Prettier.

## 🚀 Começando

### Pré-requisitos
*   Node.js (v18+)
*   Docker & Docker Compose

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <repo-url>
    cd furry-friends-agenda
    ```

2.  **Configuração de Ambiente:**
    Copie `.env.example` para `.env` na raiz e configure suas variáveis.

3.  **Execute com Docker (Recomendado):**
    ```bash
    docker-compose up --build
    ```
    *   Frontend: `http://localhost:8080`
    *   Backend: `http://localhost:3333`
    *   Prisma Studio: `http://localhost:5555`

### Desenvolvimento Manual

1.  **Instale Dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o Backend:**
    ```bash
    npm run start:dev --workspace=apps/backend
    ```

3.  **Inicie o Frontend:**
    ```bash
    npm run dev --workspace=apps/frontend
    ```

## 🛡️ Padrões de Código e Arquitetura

Seguimos diretrizes arquiteturais estritas para garantir escalabilidade e manutenibilidade.

*   **Arquitetura de Alto Nível:** Veja [Análise de Alto Nível](./docs/analise_arquitetural_alto_nivel.md) para design da solução, escalabilidade e roadmap.
*   **Arquitetura de Baixo Nível:** Veja [Análise de Baixo Nível](./docs/analise_arquitetural_baixo_nivel.md) para padrões de código, modularidade e melhores práticas.

## 🧪 Testes
*   **Backend:** `npm run test --workspace=apps/backend`
*   **Frontend:** `npm run test --workspace=apps/frontend` (Em Breve)

## 🤝 Contribuindo
1.  Faça um Fork do repositório.
2.  Crie uma branch para sua feature (`git checkout -b feature/recurso-incrivel`).
3.  Commit suas mudanças (`git commit -m 'Adiciona recurso incrível'`).
4.  Push para a branch (`git push origin feature/recurso-incrivel`).
5.  Abra um Pull Request.

## 📄 Licença
MIT
