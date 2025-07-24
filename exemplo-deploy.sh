#!/bin/bash

# Exemplo de como fazer o deploy (substitua pelos seus dados reais)

# SUBSTITUA ESTAS VARIÁVEIS:
COOLIFY_SERVER="192.168.1.100"  # ← Substitua pelo IP do seu servidor
COOLIFY_USER="root"             # ← Substitua pelo seu usuário SSH
COOLIFY_PORT="22"               # ← Substitua pela sua porta SSH

echo "🚀 Fazendo deploy para o servidor Coolify..."

# 1. Copiar arquivos para o servidor
echo "📤 Copiando arquivos..."
rsync -avz -e "ssh -i /tmp/coolify_private_key -p $COOLIFY_PORT" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="dist" \
    --exclude=".env.local" \
    ./ \
    "$COOLIFY_USER@$COOLIFY_SERVER:/opt/wordpress-saas-dashboard/"

# 2. Fazer deploy no servidor
echo "🐳 Iniciando containers..."
ssh -i /tmp/coolify_private_key -p $COOLIFY_PORT "$COOLIFY_USER@$COOLIFY_SERVER" << 'EOF'
cd /opt/wordpress-saas-dashboard

# Parar containers existentes (se houver)
docker-compose down 2>/dev/null || true

# Construir e iniciar
docker-compose build --no-cache
docker-compose up -d

# Verificar status
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deploy realizado com sucesso!"
    echo "🌐 Aplicação disponível em: http://$(hostname -I | awk '{print $1}'):3000"
    docker-compose ps
else
    echo "❌ Falha no deploy!"
    docker-compose logs
fi
EOF

echo "🎉 Deploy concluído!"