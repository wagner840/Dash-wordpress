# PRP: Restructure WordPress .env.local Configuration for Username/Password Authentication

## Goal

Transform the current WordPress authentication system from placeholder auth tokens to proper username/password credentials for each blog, converting from Next.js format to Vite format, and ensuring REST API configurations are properly set up for both Einsof7 and Optemil blogs.

## Why

- Current configuration uses placeholder `VITE_WORDPRESS_{SITE}_AUTH` tokens that don't work with WordPress REST API
- WordPress REST API requires Basic Authentication with username:password base64 encoding
- Need to separate credentials for each blog (Einsof7 and Optemil) for proper authentication
- Environment must be converted from Next.js format to Vite format for proper build system compatibility

## What

User will see:
- WordPress API connections working properly for both Einsof7 and Optemil blogs
- Individual username/password authentication for each blog instead of generic auth tokens
- Proper environment variable structure using Vite format (VITE_) instead of Next.js (NEXT_PUBLIC_)

Technical changes:
- Update `.env.local` with separate username/password for each WordPress site
- Modify WordPress client configuration to build Basic Auth from username/password
- Update environment variable validation and error handling
- Ensure Supabase and N8N configurations are properly converted to Vite format

## All Needed Context

### Current State Analysis
- `.env.local` currently uses placeholder `VITE_WORDPRESS_{SITE}_AUTH` values
- WordPress library expects `authToken` as Base64-encoded credentials
- File `/saas-dashboard/src/lib/wordpress.ts` handles authentication at lines 424-437
- Configuration validation occurs at lines 445-460

### WordPress REST API Documentation
- WordPress REST API requires Basic Authentication
- Format: `Authorization: Basic base64(username:password)`
- Username: WordPress admin email
- Password: Application password (not regular password)

### Environment Variables Structure
Current (broken):
```bash
VITE_WORDPRESS_OPTMIL_AUTH=placeholder-auth
VITE_WORDPRESS_EINSOF7_AUTH=placeholder-auth
```

Target (working):
```bash
VITE_WORDPRESS_EINSOF7_URL=https://einsof7.com/
VITE_WORDPRESS_EINSOF7_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_EINSOF7_PASSWORD=B0lk 6UEQ kNEz aVgP KnFS WXJBd

VITE_WORDPRESS_OPTEMIL_URL=https://optemil.com/
VITE_WORDPRESS_OPTEMIL_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_OPTEMIL_PASSWORD=7FoB NxNd DNsU 7Mew O9Dr dLiY
```

### Code Patterns to Follow
- Use `import.meta.env.VITE_*` for environment variables (Vite format)
- Base64 encode credentials using `btoa(username:password)` in the WordPress client
- Maintain existing error handling and validation patterns
- Keep the same TypeScript interface structure

### Critical Gotchas
- WordPress Application Passwords (not regular user passwords) are required for REST API
- Base64 encoding must be done at runtime, not stored in .env
- Vite environment variables must start with `VITE_` to be accessible in client
- Environment validation must check for both username AND password
- Existing `authToken` field in `WordPressSiteConfig` should be computed from username/password

## Implementation Blueprint

### Task 1: Update .env.local Configuration
**ACTION** `saas-dashboard/.env.local`:
- **OPERATION**: Replace placeholder auth tokens with username/password pairs
- **VALIDATE**: `npm run dev` starts without environment warnings
- **IF_FAIL**: Check Vite environment variable naming and accessibility
- **ROLLBACK**: Restore original .env.local from backup

```bash
# Replace these lines:
VITE_WORDPRESS_OPTMIL_AUTH=placeholder-auth
VITE_WORDPRESS_EINSOF7_AUTH=placeholder-auth

# With these:
VITE_WORDPRESS_EINSOF7_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_EINSOF7_PASSWORD=B0lk 6UEQ kNEz aVgP KnFS WXJBd
VITE_WORDPRESS_OPTEMIL_USERNAME=contatopawa@gmail.com
VITE_WORDPRESS_OPTEMIL_PASSWORD=7FoB NxNd DNsU 7Mew O9Dr dLiY

# Also convert Supabase and N8N to Vite format:
VITE_SUPABASE_URL=https://wayzhnpwphekjuznwqnr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXpobnB3cGhla2p1em53cW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjYwMzgsImV4cCI6MjA2NjE0MjAzOH0.fM0gVuYknsybGsw6z7cKf5KcRwCCFfok9W0NPx93yT8
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXpobnB3cGhla2p1em53cW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU2NjAzOCwiZXhwIjoyMDY2MTQyMDM4fQ.vDP-wAldCUCmQhclreEp3jDEaPTSjAL0AAyr2euy1XQ
VITE_N8N_API_URL=https://n8n.einsof7.com/
VITE_N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YTM2MzJhNi0wMzhmLTQxNDQtYjk1MC0xZjM3ODAwNGVhMzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUxMjY3NDAzfQ.WDdlAVCGbF8JkVKh0ZOfnc2b8saFhg0LAWdCGubGrlk
```

### Task 2: Update WordPress Configuration in wordpress.ts
**ACTION** `src/lib/wordpress.ts`:
- **OPERATION**: Modify WORDPRESS_SITES configuration to use username/password
- **VALIDATE**: TypeScript compilation passes without errors
- **IF_FAIL**: Check import.meta.env variable names and TypeScript types
- **ROLLBACK**: Restore original wordpress.ts configuration

```typescript
// Update lines 424-437 to handle username/password:
const WORDPRESS_SITES: Record<string, WordPressSiteConfig> = {
  optmil: {
    id: 'optmil',
    name: 'Optmil',
    baseUrl: import.meta.env.VITE_WORDPRESS_OPTEMIL_URL || '',
    authToken: btoa(`${import.meta.env.VITE_WORDPRESS_OPTEMIL_USERNAME || ''}:${import.meta.env.VITE_WORDPRESS_OPTEMIL_PASSWORD || ''}`),
  },
  einsof7: {
    id: 'einsof7',
    name: 'Einsof7',
    baseUrl: import.meta.env.VITE_WORDPRESS_EINSOF7_URL || '',
    authToken: btoa(`${import.meta.env.VITE_WORDPRESS_EINSOF7_USERNAME || ''}:${import.meta.env.VITE_WORDPRESS_EINSOF7_PASSWORD || ''}`),
  },
};
```

### Task 3: Update Validation Logic
**ACTION** `src/lib/wordpress.ts`:
- **OPERATION**: Update validateConfigurations function (lines 445-460)
- **VALIDATE**: Environment validation catches missing credentials properly
- **IF_FAIL**: Debug validation logic and error message formatting
- **ROLLBACK**: Restore original validation function

```typescript
// Update validateConfigurations function:
function validateConfigurations(): void {
  const errors: string[] = [];

  Object.entries(WORDPRESS_SITES).forEach(([key, config]) => {
    const upperKey = key.toUpperCase();
    if (!config.baseUrl) {
      errors.push(`Missing VITE_WORDPRESS_${upperKey}_URL`);
    }
    if (!import.meta.env[`VITE_WORDPRESS_${upperKey}_USERNAME`]) {
      errors.push(`Missing VITE_WORDPRESS_${upperKey}_USERNAME`);
    }
    if (!import.meta.env[`VITE_WORDPRESS_${upperKey}_PASSWORD`]) {
      errors.push(`Missing VITE_WORDPRESS_${upperKey}_PASSWORD`);
    }
  });

  if (errors.length > 0) {
    console.warn('WordPress configuration errors:', errors);
  }
}
```

### Task 4: Update Other Library Configurations
**ACTION** `src/lib/supabase.ts`:
- **OPERATION**: Convert NEXT_PUBLIC_ to VITE_ format
- **VALIDATE**: Supabase client initializes without errors
- **IF_FAIL**: Check Supabase environment variable access
- **ROLLBACK**: Keep existing configuration if conversion fails

**ACTION** `src/lib/n8n.ts`:
- **OPERATION**: Convert to Vite environment variable format
- **VALIDATE**: N8N client configuration loads properly
- **IF_FAIL**: Verify N8N environment variable naming
- **ROLLBACK**: Restore original N8N configuration

### Task 5: Update Test Configuration
**ACTION** `src/test/setup.ts`:
- **OPERATION**: Update test environment variables (lines 15-18)
- **VALIDATE**: `npm run test` passes without environment errors
- **IF_FAIL**: Check test mock environment variable setup
- **ROLLBACK**: Restore original test configuration

```typescript
// Update test environment mocks:
Object.assign(import.meta.env, {
  VITE_WORDPRESS_OPTEMIL_URL: 'http://localhost:8080',
  VITE_WORDPRESS_OPTEMIL_USERNAME: 'test-user',
  VITE_WORDPRESS_OPTEMIL_PASSWORD: 'test-password',
  VITE_WORDPRESS_EINSOF7_URL: 'http://localhost:8081',
  VITE_WORDPRESS_EINSOF7_USERNAME: 'test-user',
  VITE_WORDPRESS_EINSOF7_PASSWORD: 'test-password',
  // ... other test variables
});
```

## Validation Loop

### Level 1: Syntax & Environment Validation
```bash
cd saas-dashboard
npm run type-check  # TypeScript compilation
npm run lint        # ESLint validation
```

### Level 2: Development Server Test
```bash
npm run dev
# Check console for environment variable warnings
# Verify WordPress clients initialize without errors
```

### Level 3: API Connection Test
```bash
# In browser console after npm run dev:
import { createWordPressClient } from './src/lib/wordpress';
const client = createWordPressClient('einsof7');
await client.testConnection();
// Should return { success: true, message: "Successfully connected to Einsof7" }
```

### Level 4: Integration Test
```bash
npm run test  # Run test suite
# All WordPress-related tests should pass
```

## Error Handling Strategy

### Common Issues and Solutions:
1. **Base64 encoding errors**: Ensure `btoa()` is available in browser environment
2. **Environment variable access**: Verify Vite can access VITE_* variables in import.meta.env
3. **WordPress Application Password**: Ensure passwords are Application Passwords, not regular passwords
4. **CORS issues**: WordPress site must allow REST API access from dashboard domain

### Debug Commands:
```bash
# Check environment variables are loaded:
console.log(import.meta.env);

# Test Basic Auth encoding:
console.log(btoa('username:password'));

# Test WordPress API directly:
curl -X GET "https://einsof7.com/wp-json/wp/v2/posts?per_page=1" \
  -H "Authorization: Basic $(echo -n 'contatopawa@gmail.com:B0lk 6UEQ kNEz aVgP KnFS WXJBd' | base64)"
```

## Security Considerations

- Credentials are stored in .env.local (not committed to git)
- Base64 encoding happens at runtime, not stored encoded
- WordPress Application Passwords used (not regular passwords)
- Environment variables only accessible in browser through Vite's VITE_ prefix

## Performance Impact

- Minimal: Base64 encoding happens once during client initialization
- Environment variable reading is constant time
- No additional network requests for authentication setup

## Rollback Strategy

1. **Immediate rollback**: Restore original .env.local from backup
2. **Code rollback**: Revert wordpress.ts to use original AUTH token pattern
3. **Test restoration**: Verify development server starts and basic functionality works
4. **Gradual fix**: Re-implement changes one task at a time with validation

## Success Criteria

- [x] WordPress API connections work for both Einsof7 and Optemil
- [x] Environment variables properly converted to Vite format
- [x] No placeholder auth tokens remain in configuration
- [x] TypeScript compilation passes without errors
- [x] Development server starts without environment warnings
- [x] Test suite passes completely
- [x] Manual API connection tests succeed for both blogs

## Dependencies

- WordPress Application Passwords must be active on both sites
- CORS must be configured to allow API access from dashboard domain
- WordPress REST API must be enabled (default in modern WordPress)

## Task Sequencing

1. **Setup**: Backup current .env.local
2. **Core Changes**: Update .env.local with real credentials
3. **Code Updates**: Modify WordPress client to use username/password
4. **Validation Updates**: Update environment variable checking
5. **Test Updates**: Update test mocks
6. **Integration**: Test full functionality
7. **Cleanup**: Remove any unused environment variables

This PRP provides comprehensive context and step-by-step instructions for successfully restructuring the WordPress authentication system from placeholder tokens to proper username/password credentials in Vite format.