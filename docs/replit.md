# Furry Friends Agenda - Pet Grooming Appointment Management System

## Overview
This is a full-stack pet grooming appointment management system that helps manage clients, pets, groomers, appointments, and packages. The application was originally designed to run with Docker Compose and has been adapted to run on Replit.

## Project Structure

### Backend (`furry-friends-agenda-backend/`)
- **Framework**: NestJS (Node.js framework)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Port**: 3333 (localhost only)

### Frontend (`furry-friends-agenda-app/`)
- **Framework**: React with Vite
- **UI**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Port**: 5000 (exposed to public)

## Architecture

### Database Schema
The application uses Prisma ORM with the following main models:
- **User**: System users with role-based access (USER/ADMIN)
- **Client**: Pet owners/customers
- **Pet**: Pets belonging to clients
- **Groomer**: Professional groomers
- **Appointment**: Grooming appointments
- **ServicePackage**: Available grooming services
- **Package**: Service packages with pricing

### Key Features
- User authentication and authorization
- Client and pet management
- Groomer management with specialties and commissions
- Appointment scheduling and tracking
- Service packages and pricing
- Grooming board with drag-and-drop functionality
- Reports and analytics

## Development Setup

### Environment Variables
Required secrets (already configured in Replit Secrets):
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: Token expiration time (e.g., "1d")
- `DATABASE_URL`: PostgreSQL connection string

### Database Setup
⚠️ **Important**: You need to set up a PostgreSQL database for this application to work properly.

1. From the Replit sidebar, go to **Tools → Database**
2. Provision a PostgreSQL database
3. Copy the connection URL
4. Update the `DATABASE_URL` secret with the new connection string
5. Run migrations:
   ```bash
   cd furry-friends-agenda-backend
   npx prisma migrate deploy
   ```

### Running the Application
The application uses a combined startup script (`start.sh`) that:
1. Starts the backend on port 3333
2. Starts the frontend on port 5000

The workflow is already configured and will start automatically.

## Port Configuration
- **Frontend**: Port 5000 (webview) - This is the main application interface
- **Backend**: Port 3333 (localhost only) - API server

The frontend communicates with the backend via `http://localhost:3333`.

## Recent Changes (Replit Setup - Oct 13, 2025)

### Configuration Updates
1. **Backend (`furry-friends-agenda-backend/src/main.ts`)**
   - Updated CORS to include Replit domain
   - Changed port to 3333 (from 3000)
   - Changed host to 'localhost' (backend only accessible internally)
   - Added support for REPLIT_DEV_DOMAIN environment variable

2. **Frontend (`furry-friends-agenda-app/vite.config.ts`)**
   - Changed port from 8080 to 5000
   - Changed host to "0.0.0.0" for Replit compatibility
   - Added strictPort: true to ensure port 5000 is used

3. **Frontend Environment (`furry-friends-agenda-app/.env`)**
   - Set VITE_API_BASE_URL to http://localhost:3333

### Workflow Setup
- Single workflow named "Server" that runs both backend and frontend
- Frontend exposed on port 5000 for webview
- Backend runs internally on port 3333

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user

### Clients
- GET `/clients` - List all clients
- GET `/clients/:id` - Get client by ID
- POST `/clients` - Create new client
- PATCH `/clients/:id` - Update client
- DELETE `/clients/:id` - Delete client

### Pets
- GET `/pets` - List all pets
- GET `/pets/:id` - Get pet by ID
- POST `/pets` - Create new pet
- PATCH `/pets/:id` - Update pet
- DELETE `/pets/:id` - Delete pet

### Groomers
- GET `/groomers` - List all groomers
- GET `/groomers/:id` - Get groomer by ID
- POST `/groomers` - Create new groomer
- PATCH `/groomers/:id` - Update groomer
- DELETE `/groomers/:id` - Delete groomer

### Appointments
- GET `/appointments` - List all appointments
- GET `/appointments/:id` - Get appointment by ID
- POST `/appointments` - Create new appointment
- PATCH `/appointments/:id` - Update appointment
- DELETE `/appointments/:id` - Delete appointment

### Packages
- GET `/packages` - List all packages
- GET `/packages/:id` - Get package by ID
- POST `/packages` - Create new package
- PATCH `/packages/:id` - Update package
- DELETE `/packages/:id` - Delete package

### Services
- GET `/services` - List all services
- GET `/services/:id` - Get service by ID
- POST `/services` - Create new service
- PATCH `/services/:id` - Update service
- DELETE `/services/:id` - Delete service

## User Preferences
- Language: Portuguese (BR) - Application UI is in Portuguese
- Authentication: JWT-based with role-based access control (USER/ADMIN)

## Deployment
The deployment configuration will be set up after the database is properly provisioned and tested.

## Testing
The project includes test files for various components. Run tests with:
```bash
# Backend tests
cd furry-friends-agenda-backend
npm test

# Frontend tests
cd furry-friends-agenda-app
npm test
```

## Notes
- The application was originally designed for Docker Compose deployment
- Currently adapted for Replit environment
- Database needs to be provisioned through Replit UI before full functionality is available
- Frontend uses localStorage for token management
- Backend uses bcrypt for password hashing
