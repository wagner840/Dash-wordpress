# Setup Coolify Deploy Automático

## 1. Configurar Secrets no GitHub

Vá em **Settings → Secrets and variables → Actions** e adicione:

```
COOLIFY_TOKEN=1|XCxiOrrdxYBJMaBSsEL7m3LlvUEQ9JmR99IhJ7hr9780b3eb
COOLIFY_WEBHOOK=http://31.97.170.218:8000/api/v1/deploy/webhook/SEU_WEBHOOK_ID
APP_URL=https://sua-app.dominio.com
```

## 2. Configurar Projeto no Coolify

### Via Painel Web (http://31.97.170.218:8000):

1. **Login**: contatopawa@gmail.com / Monkeytube19126161!!!
2. **New Project** → **Git Repository**
3. **Repository**: `https://github.com/SEU_USER/PRPs-agentic-eng`
4. **Branch**: `development`
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`

### Variáveis de Ambiente:
```
NODE_ENV=production
PORT=3000
# Adicione suas outras variáveis específicas
```

### Webhooks:
- Copie o **Webhook URL** gerado
- Adicione como `COOLIFY_WEBHOOK` nos secrets do GitHub

## 3. Deploy Manual (Alternativo)

```bash
# Deploy direto via API
curl --request GET "http://31.97.170.218:8000/api/v1/deploy/webhook/SEU_WEBHOOK_ID" \
  --header "Authorization: Bearer 1|XCxiOrrdxYBJMaBSsEL7m3LlvUEQ9JmR99IhJ7hr9780b3eb"

# Verificar status
curl --request GET "http://31.97.170.218:8000/api/v1/projects" \
  --header "Authorization: Bearer 1|XCxiOrrdxYBJMaBSsEL7m3LlvUEQ9JmR99IhJ7hr9780b3eb"
```

## 4. Configuração Completa Via Script

Execute este script para configurar tudo automaticamente:

```bash
#!/bin/bash
# coolify-auto-setup.sh

COOLIFY_URL="http://31.97.170.218:8000"
API_TOKEN="1|XCxiOrrdxYBJMaBSsEL7m3LlvUEQ9JmR99IhJ7hr9780b3eb"
REPO_URL="https://github.com/SEU_USER/PRPs-agentic-eng"

# Criar projeto
curl -X POST "$COOLIFY_URL/api/v1/projects" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "prps-agentic-eng",
    "description": "PRP Framework Auto Deploy",
    "repository": "'$REPO_URL'",
    "branch": "development"
  }'

echo "✅ Setup concluído! Configure os secrets no GitHub e faça push para deploy automático."
```

## Status

- ✅ GitHub Actions workflow criado
- ✅ Scripts de deploy configurados  
- ⏳ **PRÓXIMO**: Configurar secrets no GitHub e webhook no Coolify