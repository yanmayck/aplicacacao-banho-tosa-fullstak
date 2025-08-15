## Project Overview

This is a full-stack application for managing a pet grooming shop, named "Furry Friends Agenda". It consists of a React-based frontend and a NestJS-based backend. The entire application is containerized using Docker for consistent development and deployment environments.

**Frontend (`furry-friends-agenda-app`):**

*   **Framework:** React with Vite
*   **Language:** TypeScript
*   **UI:** `shadcn/ui` and TailwindCSS
*   **Key Libraries:** React Router for navigation, TanStack Query for data fetching, and `react-hook-form` for form management.

**Backend (`furry-friends-agenda-backend`):**

*   **Framework:** NestJS
*   **Language:** TypeScript
*   **Database:** PostgreSQL with Prisma as the ORM.
*   **Authentication:** JWT-based authentication using Passport.

## Building and Running

The project is designed to be run using Docker Compose.

**1. Environment Variables:**

Before running the application, you need to create a `.env` file in the root of the project. You can copy the example file:

```bash
cp .env.example .env
```

Then, edit the `.env` file to set the required variables, especially `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `JWT_SECRET`.

**2. Running the Application:**

To start all services (frontend, backend, and database), run:

```bash
docker-compose up -d
```

*   The frontend will be available at `http://localhost:8080`.
*   The backend will be available at `http://localhost:3333`.
*   Prisma Studio (for database management) will be available at `http://localhost:5555`.

**3. Running Tests:**

*   **Backend:**

    *   To run unit and integration tests:

        ```bash
        docker-compose exec furry_friends_backend npm run test
        ```

    *   To run end-to-end tests:

        ```bash
        docker-compose exec furry_friends_backend npm run test:e2e
        ```

*   **Frontend:**

    *   The frontend currently does not have a test runner configured. The `TESTING_GUIDE.md` file outlines a plan to set up Vitest and React Testing Library. Once configured, the command will be:

        ```bash
        docker-compose exec furry_friends_frontend npm run test
        ```

## Development Conventions

*   **Containerized Development:** All development should be done within the Docker containers to ensure consistency.
*   **Database Migrations:** Database schema changes are managed by Prisma. To create a new migration, run:

    ```bash
    docker-compose exec furry_friends_backend npx prisma migrate dev --name <migration_name>
    ```

*   **Code Style:** The backend uses Prettier and ESLint for code formatting and linting. You can format the code by running:

    ```bash
    docker-compose exec furry_friends_backend npm run format
    ```

*   **API:** The backend provides a RESTful API. The frontend communicates with the backend through this API. The base URL for the API is configured in the frontend's environment variables.
