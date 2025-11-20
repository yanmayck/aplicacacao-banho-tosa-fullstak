## Visão Geral do Projeto

Esta é uma aplicação full-stack para gerenciamento de um pet shop de banho e tosa, chamada "Furry Friends Agenda". Consiste em um frontend baseado em React e um backend baseado em NestJS. Toda a aplicação é containerizada usando Docker para ambientes de desenvolvimento e deployment consistentes.

**Frontend (`furry-friends-agenda-app`):**

*   **Framework:** React com Vite
*   **Linguagem:** TypeScript
*   **UI:** `shadcn/ui` e TailwindCSS
*   **Bibliotecas Chave:** React Router para navegação, TanStack Query para busca de dados e `react-hook-form` para gerenciamento de formulários.

**Backend (`furry-friends-agenda-backend`):**

*   **Framework:** NestJS
*   **Linguagem:** TypeScript
*   **Banco de Dados:** PostgreSQL com Prisma como ORM.
*   **Autenticação:** Autenticação baseada em JWT usando Passport.

## Construindo e Rodando

O projeto foi projetado para ser executado usando Docker Compose.

**1. Variáveis de Ambiente:**

Antes de rodar a aplicação, você precisa criar um arquivo `.env` na raiz do projeto. Você pode copiar o arquivo de exemplo:

```bash
cp .env.example .env
```

Então, edite o arquivo `.env` para definir as variáveis necessárias, especialmente `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` e `JWT_SECRET`.

**2. Rodando a Aplicação:**

Para iniciar todos os serviços (frontend, backend e banco de dados), execute:

```bash
docker-compose up -d
```

*   O frontend estará disponível em `http://localhost:8080` (desenvolvimento) ou `http://localhost:5000` (Replit).
*   O backend estará disponível em `http://localhost:3333`.
*   O Prisma Studio (para gerenciamento do banco de dados) estará disponível em `http://localhost:5555`.

**3. Rodando Testes:**

*   **Backend:**

    *   Para rodar testes unitários e de integração:

        ```bash
        docker-compose exec furry_friends_backend npm run test
        ```

    *   Para rodar testes end-to-end:

        ```bash
        docker-compose exec furry_friends_backend npm run test:e2e
        ```

*   **Frontend:**

    *   O frontend atualmente não possui um executor de testes configurado. O arquivo `TESTING_GUIDE.md` descreve um plano para configurar Vitest e React Testing Library. Uma vez configurado, o comando será:

        ```bash
        docker-compose exec furry_friends_frontend npm run test
        ```

## Convenções de Desenvolvimento

*   **Desenvolvimento Containerizado:** Todo o desenvolvimento deve ser feito dentro dos containers Docker para garantir consistência.
*   **Migrações de Banco de Dados:** Alterações no schema do banco de dados são gerenciadas pelo Prisma. Para criar uma nova migração, execute:

    ```bash
    docker-compose exec furry_friends_backend npx prisma migrate dev --name <nome_da_migracao>
    ```

*   **Estilo de Código:** O backend usa Prettier e ESLint para formatação e linting de código. Você pode formatar o código executando:

    ```bash
    docker-compose exec furry_friends_backend npm run format
    ```

*   **API:** O backend fornece uma API RESTful. O frontend se comunica com o backend através desta API. A URL base para a API é configurada nas variáveis de ambiente do frontend.
