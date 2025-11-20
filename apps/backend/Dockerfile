# Dockerfile para Furry Friends Agenda Backend

# ---- Estágio de Desenvolvimento ----
FROM node:20-slim AS development

WORKDIR /usr/src/app

# Instalar dependências do sistema para o Prisma (libssl)
RUN apt-get update -y && apt-get install -y openssl libssl-dev

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm install

# Copiar o restante do código-fonte (será sobreposto pelo volume no docker-compose, mas é bom ter para consistência)
COPY . .

# Comando para iniciar em modo de desenvolvimento com hot-reload
CMD ["npm", "run", "start:dev"]


# ---- Estágio de Build ----
FROM node:20-slim AS builder

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Variáveis de ambiente para o Prisma
ENV PRISMA_TELEMETRY_INFORMATION='disable' \
    PRISMA_UPDATE_NOTIFIER='disable'

# Instalar dependências do sistema para o Prisma (libssl)
RUN apt-get update -y && apt-get install -y openssl libssl-dev

# Copiar package.json e package-lock.json (ou yarn.lock, etc.)
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build e Prisma)
RUN npm install

# Copiar todo o código da aplicação
COPY . .

# Gerar o Prisma Client (requer o schema.prisma e as dependências)
# Este passo pode falhar se DATABASE_URL não estiver disponível em tempo de build
# para alguns provedores de banco de dados que o Prisma tenta contatar.
# Para PostgreSQL, geralmente funciona sem uma DATABASE_URL real aqui, pois ele gera baseado no schema.
# Se precisar de uma DATABASE_URL para este passo, ela pode ser passada como build arg.
RUN npx prisma generate

# Fazer o build da aplicação TypeScript para JavaScript
RUN npm run build

# Remover devDependencies para preparar para o estágio de produção
# Isso ajuda a copiar apenas as dependências de produção para o próximo estágio
RUN npm prune --production

# ---- Estágio de Produção ----
FROM node:20-alpine AS runner

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Variáveis de ambiente
ENV NODE_ENV=production
# A PORTA será definida pelo .env ou docker-compose
# A DATABASE_URL será definida pelo .env ou docker-compose
# O JWT_SECRET será definido pelo .env ou docker-compose
# O JWT_EXPIRES_IN será definido pelo .env ou docker-compose

# Copiar schema.prisma para o diretório de produção (Prisma Client precisa dele em runtime)
COPY --from=builder /usr/src/app/prisma ./prisma

# Copiar o Prisma Client gerado
COPY --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Copiar os artefatos de build (dist) do estágio builder
COPY --from=builder /usr/src/app/dist ./dist

# Copiar as dependências de produção do estágio builder
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiar package.json (alguns frameworks ou ferramentas podem precisar dele)
COPY package.json .

# Expor a porta que a aplicação vai rodar (definida no .env ou aqui)
# Este valor deve corresponder à variável de ambiente PORT usada pela sua aplicação
# EXPOSE 3000 # Será exposto pelo docker-compose

# Comando para iniciar a aplicação em modo de produção
# Executa as migrações do Prisma e então inicia a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"] 