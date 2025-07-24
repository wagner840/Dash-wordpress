# WordPress SaaS Dashboard - Deployment Guide

Este guia explica como fazer deploy da aplicação WordPress SaaS Dashboard no seu servidor Coolify.

## 📋 Pré-requisitos

- Servidor Coolify configurado e funcionando
- Acesso SSH ao servidor
- Docker e Docker Compose instalados no servidor
- Chave SSH privada configurada

## 🚀 Deploy Automático

### 1. Configurar Servidor

Edite o arquivo `deploy-coolify.sh` e atualize as seguintes variáveis:

```bash
COOLIFY_SERVER="SEU_IP_OU_HOSTNAME_DO_SERVIDOR"
COOLIFY_USER="root"  # Ou seu usuário SSH
COOLIFY_PORT="22"    # Porta SSH (padrão: 22)
```

### 2. Executar Deploy

```bash
./deploy-coolify.sh
```

## 🔧 Deploy Manual

### 1. Copiar arquivos para o servidor

```bash
rsync -avz -e "ssh -i /tmp/coolify_private_key" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="dist" \
    ./ \
    root@SEU_SERVIDOR:/opt/wordpress-saas-dashboard/
```

### 2. Conectar ao servidor e fazer deploy

```bash
ssh -i /tmp/coolify_private_key root@SEU_SERVIDOR
cd /opt/wordpress-saas-dashboard
docker-compose up -d --build
```

## 🌐 Configuração de Variáveis de Ambiente

No painel do Coolify ou diretamente no servidor, configure as seguintes variáveis:

### Supabase
```env
VITE_SUPABASE_URL=https://wayzhnpwphekjuznwqnr.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### WordPress Einsof7
```env
VITE_WORDPRESS_EINSOF7_URL=https://einsof7.com/
VITE_WORDPRESS_EINSOF7_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_EINSOF7_PASSWORD=sua_senha
```

### WordPress Optemil
```env
VITE_WORDPRESS_OPTEMIL_URL=https://optemil.com/
VITE_WORDPRESS_OPTEMIL_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_OPTEMIL_PASSWORD=sua_senha
```

## 🔍 Verificação do Deploy

### 1. Verificar status dos containers

```bash
docker-compose ps
```

### 2. Verificar logs

```bash
docker-compose logs -f wordpress-saas-dashboard
```

### 3. Testar aplicação

```bash
curl http://SEU_SERVIDOR:3000/health
```

## 🌍 Configuração de Domínio

1. **No Coolify Dashboard:**
   - Acesse seu projeto
   - Vá para "Domains"
   - Adicione seu domínio personalizado
   - Configure SSL automático

2. **Configuração DNS:**
   ```
   Type: A
   Name: seudominio.com (ou subdominio)
   Value: IP_DO_SEU_SERVIDOR
   ```

## 🔒 Configuração SSL

O Coolify pode configurar SSL automaticamente usando Let's Encrypt:

1. Certifique-se de que o domínio aponta para o servidor
2. No dashboard do Coolify, ative "SSL Certificate"
3. Aguarde a geração do certificado

## 📊 Monitoramento

### Health Check
A aplicação inclui um endpoint de health check em `/health`

### Logs
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos do nginx
docker-compose logs nginx
```

### Métricas
- CPU e memória: disponível no dashboard do Coolify
- Uptime: monitorado automaticamente pelo health check

## 🔧 Troubleshooting

### Problema: Container não inicia
```bash
# Verificar logs detalhados
docker-compose logs --details wordpress-saas-dashboard

# Reconstruir imagem
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Aplicação não carrega
1. Verificar se a porta 3000 está acessível
2. Verificar configuração do nginx
3. Verificar variáveis de ambiente

### Problema: Erro de conexão com APIs
1. Verificar variáveis de ambiente do Supabase
2. Verificar credenciais do WordPress
3. Verificar conectividade de rede

## 📝 Estrutura de Arquivos

```
saas-dashboard/
├── Dockerfile              # Configuração Docker multi-stage
├── docker-compose.yml      # Orquestração de containers
├── nginx.conf             # Configuração do servidor web
├── coolify.json           # Configuração específica do Coolify
├── deploy-coolify.sh      # Script de deploy automatizado
├── .dockerignore          # Arquivos ignorados no build
└── DEPLOYMENT.md          # Este guia
```

## 🎯 Próximos Passos

1. ✅ Deploy realizado com sucesso
2. 🔧 Configurar variáveis de ambiente
3. 🌐 Configurar domínio personalizado
4. 🔒 Ativar SSL
5. 📊 Configurar monitoramento
6. 🔄 Configurar backups automáticos
7. 🚀 Configurar CI/CD para deploys automáticos