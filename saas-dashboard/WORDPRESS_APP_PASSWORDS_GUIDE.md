# Como Gerar Application Passwords no WordPress

## Problema Atual
O WordPress está rejeitando as credenciais atuais porque elas são senhas normais do WordPress, mas a API REST precisa de **Application Passwords** para funcionar com autenticação Basic.

## Passo a Passo para Corrigir

### 1. Para OPTEMIL.COM:
1. Acesse: `https://optemil.com/wp-admin/profile.php`
2. Role para baixo até a seção **"Application Passwords"**
3. No campo "New Application Password Name", digite: `SaaS Dashboard API`
4. Clique em **"Add New Application Password"**
5. **COPIE A SENHA GERADA** (formato: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Anote esta senha com segurança

### 2. Para EINSOF7.COM:
1. Acesse: `https://einsof7.com/wp-admin/profile.php`
2. Role para baixo até a seção **"Application Passwords"**
3. No campo "New Application Password Name", digite: `SaaS Dashboard API`
4. Clique em **"Add New Application Password"**
5. **COPIE A SENHA GERADA** (formato: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Anote esta senha com segurança

### 3. Atualizar .env.local:
Substitua as senhas atuais pelas Application Passwords geradas:

```bash
# WordPress Configuration - Einsof7
VITE_WORDPRESS_EINSOF7_URL=https://einsof7.com/
VITE_WORDPRESS_EINSOF7_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_EINSOF7_PASSWORD=NOVA_APP_PASSWORD_EINSOF7

# WordPress Configuration - Optemil
VITE_WORDPRESS_OPTEMIL_URL=https://optemil.com/
VITE_WORDPRESS_OPTEMIL_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_OPTEMIL_PASSWORD=NOVA_APP_PASSWORD_OPTEMIL
```

### 4. Reiniciar Aplicação:
```bash
npm run dev
```

## Por que Application Passwords?
- As senhas normais do WordPress não funcionam com a API REST por questões de segurança
- Application Passwords são específicas para aplicações e podem ser revogadas individualmente
- Elas têm as mesmas permissões do usuário que as criou

## Teste de Funcionamento:
Após gerar as Application Passwords, você pode testar no terminal:

```bash
curl -H "Authorization: Basic $(echo -n 'contatopawa@gmail.com:NOVA_APP_PASSWORD' | base64)" "https://optemil.com/wp-json/wp/v2/posts?status=draft&per_page=1"
```

Se funcionar, você verá posts draft em vez de erro 401.