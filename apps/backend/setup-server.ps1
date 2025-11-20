# setup-server.ps1 - Script para configurar o backend Furry Friends Agenda em um servidor Windows

Write-Host "Iniciando configuração do Furry Friends Agenda Backend..."

# Verificar se o Node.js está instalado (simplificado)
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Node.js não encontrado. Por favor, instale o Node.js LTS e adicione ao PATH."
    exit 1
}
Write-Host "Node.js encontrado: $nodeVersion"

# Verificar se o npm está instalado (geralmente vem com o Node)
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm não encontrado. Verifique sua instalação do Node.js."
    exit 1
}
Write-Host "npm encontrado: $npmVersion"

# 1. Instalar dependências
Write-Host "Instalando dependências do projeto (npm install)..."
& npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao instalar dependências com npm install."
    exit 1
}
Write-Host "Dependências instaladas com sucesso."

# 2. Configurar .env
if (-not (Test-Path .\.env)) {
    Write-Warning ".env não encontrado. Copiando de .env.example..."
    if (Test-Path .\.env.example) {
        Copy-Item .\.env.example .\.env
        Write-Host "Arquivo .env criado a partir de .env.example."
        Write-Host "POR FAVOR, EDITE O ARQUIVO .env AGORA E CONFIGURE SUAS VARIÁVEIS DE AMBIENTE (especialmente DATABASE_URL, JWT_SECRET)!"
        Read-Host "Pressione Enter para continuar após editar o .env..."
    } else {
        Write-Error ".env.example não encontrado! Não é possível criar .env. Por favor, crie o .env manualmente com as variáveis necessárias (DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, PORT)."
        exit 1
    }
} else {
    Write-Host ".env já existe. Verifique se DATABASE_URL e JWT_SECRET estão configurados corretamente."
    Read-Host "Pressione Enter para continuar..."
}

# 3. Aplicar migrações do Prisma
# Este passo requer que o PostgreSQL esteja instalado, rodando e a DATABASE_URL no .env esteja correta.
Write-Host "Tentando aplicar migrações do banco de dados (npx prisma migrate deploy)..."
Write-Host "Certifique-se que seu servidor PostgreSQL está rodando e acessível conforme configurado no .env."
& npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao aplicar migrações do Prisma. Verifique a conexão com o banco de dados e a DATABASE_URL no .env."
    Write-Warning "O setup continuará, mas a aplicação pode não funcionar corretamente sem as migrações."
} else {
    Write-Host "Migrações do banco de dados aplicadas com sucesso."
}

# 4. Gerar Prisma Client
Write-Host "Gerando Prisma Client (npx prisma generate)..."
& npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao gerar o Prisma Client."
    # Mesmo se a migração falhar, tentar gerar pode ser útil para ter os tipos base se o schema mudou.
    # Mas é provável que falhe ou gere tipos incompletos se a conexão com o banco não estiver ok.
}
Write-Host "Prisma Client gerado."

# 5. Fazer o build da aplicação
Write-Host "Fazendo build da aplicação (npm run build)..."
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao fazer o build da aplicação."
    exit 1
}
Write-Host "Build da aplicação concluído com sucesso."

Write-Host ""
Write-Host "Configuração do backend concluída!"
Write-Host "Para iniciar a aplicação em modo de produção, use: npm run start:prod"
Write-Host "Lembre-se de configurar um gerenciador de processos (como PM2) para rodar a aplicação de forma robusta em produção." 