#!/bin/bash

# Docker entrypoint script para desenvolvimento
# Este script garante que o banco de dados esteja configurado antes de iniciar a aplicação

set -e

echo "🚀 Iniciando Furry Friends Agenda Backend..."

# Aguardar o banco de dados estar disponível
echo "⏳ Aguardando banco de dados..."
until npx prisma migrate deploy --preview-feature; do
  echo "Banco de dados não está pronto, tentando novamente em 2 segundos..."
  sleep 2
done

echo "✅ Banco de dados conectado!"

# Executar seed APENAS se for desenvolvimento E as variáveis SEED_ estiverem definidas
# Isso garante que em produção o seed não seja executado automaticamente
if [ "$NODE_ENV" = "development" ] && [ -n "$SEED_SUPER_ADMIN_EMAIL" ]; then
  echo "🌱 Verificando se seed é necessário..."
  npx prisma db seed
else
  echo "ℹ️  Ambiente de produção ou seed desabilitado. Pulando seed automático."
fi

echo "🎯 Iniciando aplicação..."
exec "$@"