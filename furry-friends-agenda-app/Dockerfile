# Dockerfile for Furry Friends Agenda Frontend (Vite + React + TypeScript)

# ---- Stage 1: Build ----
FROM node:20-slim AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Set the API URL at build time if needed, or rely on runtime env var for dev server
# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application
RUN npm run build

# ---- Stage 2: Production Server (using a simple static server) ----
FROM nginx:stable-alpine AS production-server

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (optional, if you have a custom one)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ---- Stage 3: Development Server (for use with Docker Compose volume mounting) ----
FROM node:20-slim AS development-server

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
# We do this again because this stage might be used independently
# and to ensure devDependencies are available for the dev server.
RUN npm install

# Copy the rest of the app's source code
# This will be overwritten by volume mounts in docker-compose for local dev
COPY . .

# Expose the Vite development server port (default 5173, but our vite.config.ts uses 8080)
EXPOSE 8080

# Command to run the Vite development server
# It will listen on all available network interfaces (0.0.0.0 or '::')
# The host is set to '::' in vite.config.ts, so just `npm run dev` is fine.
CMD ["npm", "run", "dev"]
