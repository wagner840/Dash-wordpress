name: "WordPress SaaS Dashboard - React + TypeScript + Supabase Implementation PRP"
description: |

## Purpose

Context-rich PRP for implementing a comprehensive WordPress SaaS Dashboard using React 19, TypeScript, Vite, Supabase, and WordPress REST API integration. Enables full management of multiple WordPress blogs (Optmil & Einsof7) with N8N workflow automation and real-time analytics.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats for WordPress API, Supabase integration, and N8N workflows
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix for React/TypeScript stack
3. **Information Dense**: Use keywords and patterns from existing React/Supabase codebases
4. **Progressive Success**: Start with authentication, validate, then build features incrementally

---

## Goal

Build a production-ready React-based dashboard that provides unified control over WordPress content generation SaaS platform with:
- **Multi-blog WordPress management** (Optmil & Einsof7 blogs)
- **Supabase database integration** with existing schema
- **N8N workflow automation** for content generation
- **Real-time analytics and monitoring**
- **Scalable, maintainable TypeScript architecture**

## Why

- **Business value**: Centralize multi-blog WordPress management, reducing operational overhead by 80%
- **User impact**: Single dashboard for content creators, automation managers, and business owners
- **Integration**: Leverages existing Supabase schema with blogs, content_posts, production_pipeline tables
- **Problems solved**: Fragmented management, manual processes, limited visibility, scalability issues

## What

### User-visible behavior
- **Multi-blog selector**: Switch between Optmil and Einsof7 WordPress blogs seamlessly
- **Content management**: Create, edit, publish, and schedule posts across multiple WordPress sites
- **Workflow controls**: Start, stop, monitor N8N automation workflows
- **Real-time dashboard**: Live metrics, performance tracking, and operational status
- **Responsive UI**: Works on desktop and tablet devices

### Technical requirements
- **React 19** with TypeScript strict mode and modern hooks (useActionState, use API)
- **Vite** build system with optimized production builds
- **Supabase Auth** with role-based access control
- **WordPress REST API** integration with Basic Auth (Application Passwords)
- **N8N API** integration for workflow management
- **TanStack Query** for server state management with caching
- **Tailwind CSS** with component library (Headless UI)
- **Real-time subscriptions** using Supabase realtime

### Success Criteria

- [ ] User can authenticate and access dashboard within 3 seconds
- [ ] Switch between WordPress blogs without page reload
- [ ] Create/edit/publish posts to both WordPress sites from single interface
- [ ] Monitor N8N workflow execution with real-time status updates
- [ ] View comprehensive analytics with <100ms load times
- [ ] System handles 10+ concurrent users without performance degradation
- [ ] All API integrations include proper error handling and retry logic
- [ ] 95%+ uptime with graceful error recovery

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://developer.wordpress.org/rest-api/reference/
  why: Complete WordPress REST API documentation for posts, categories, tags, media management

- url: https://supabase.com/docs/reference/javascript/
  why: Supabase JavaScript client methods for auth, database queries, real-time subscriptions

- url: https://tanstack.com/query/latest/docs/framework/react/overview
  why: TanStack Query patterns for server state management, caching, background updates

- url: https://react.dev/reference/react/useActionState
  why: React 19 Actions API for form handling with automatic pending states

- url: https://docs.n8n.io/api/
  why: N8N REST API for workflow management, execution monitoring, webhook triggers

- file: /mnt/w/FrontEnd-Final/PRPs-agentic-eng/claude_md_files/CLAUDE-REACT.md
  why: React 19 patterns, TypeScript requirements, testing standards, component architecture

- file: /mnt/w/FrontEnd-Final/PRPs-agentic-eng/PRPs/ai_docs/cc_supabase_backend
  why: Existing Supabase schema with blogs, content_posts, production_pipeline tables

- doc: https://headlessui.com/v2.0/react
  section: Components and Patterns
  critical: Accessible UI components with proper ARIA labels and keyboard navigation

- doc: https://tailwindcss.com/docs/utility-first
  section: Component Patterns
  critical: Utility-first CSS approach for consistent styling and responsive design

- docfile: PRPs/ai_docs/cc_mcp.md
  why: MCP server documentation for development workflow integration
```

### Current Codebase tree

```bash
PRPs-agentic-eng/
├── .claude/
│   ├── commands/           # 28+ pre-configured commands
│   └── settings.local.json # Tool permissions
├── PRPs/
│   ├── ai_docs/           # Curated documentation
│   ├── templates/         # PRP templates
│   └── wordpress-saas-dashboard-prd.md  # Source requirements
├── claude_md_files/       # Framework-specific patterns
│   └── CLAUDE-REACT.md   # React 19 + TypeScript guidelines
└── saas-dashboard/        # Target implementation directory
```

### Desired Codebase tree with files to be added

```bash
saas-dashboard/
├── package.json                    # Project configuration with all dependencies
├── vite.config.ts                 # Vite configuration with proxy and build optimization
├── tsconfig.json                  # TypeScript strict configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── .env.local                     # Environment variables (git-ignored)
├── .env.example                   # Environment template
├── src/
│   ├── main.tsx                   # Application entry point
│   ├── App.tsx                    # Root component with routing
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client configuration
│   │   ├── wordpress.ts          # WordPress API clients (Optmil & Einsof7)
│   │   ├── n8n.ts                # N8N API client
│   │   └── utils.ts              # Utility functions
│   ├── hooks/
│   │   ├── useAuth.ts            # Authentication state management
│   │   ├── useWordPress.ts       # WordPress API integration
│   │   ├── useN8N.ts             # N8N workflow management
│   │   └── useRealtime.ts        # Supabase realtime subscriptions
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx   # Authentication context
│   │   │   ├── LoginForm.tsx      # Login component with Actions API
│   │   │   └── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx # Main dashboard layout
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   └── TopBar.tsx         # Header with user menu
│   │   ├── blogs/
│   │   │   ├── BlogSelector.tsx   # Multi-blog switcher
│   │   │   ├── BlogStats.tsx      # Blog performance metrics
│   │   │   └── BlogCard.tsx       # Blog information card
│   │   ├── content/
│   │   │   ├── PostManager.tsx    # WordPress post management
│   │   │   ├── PostEditor.tsx     # Post creation/editing form
│   │   │   ├── PostList.tsx       # Posts table with filters
│   │   │   └── BulkOperations.tsx # Bulk post operations
│   │   ├── workflows/
│   │   │   ├── WorkflowManager.tsx # N8N workflow controls
│   │   │   ├── WorkflowMonitor.tsx # Real-time workflow status
│   │   │   └── TriggerControls.tsx # Workflow trigger interface
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx # Main analytics view
│   │   │   ├── PerformanceCharts.tsx  # Chart components
│   │   │   └── LiveStats.tsx          # Real-time statistics
│   │   └── ui/
│   │       ├── Button.tsx         # Reusable button component
│   │       ├── Input.tsx          # Form input component
│   │       ├── Skeleton.tsx       # Loading skeletons
│   │       └── ErrorBoundary.tsx  # Error handling component
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main dashboard page
│   │   ├── Content.tsx           # Content management page
│   │   ├── Analytics.tsx         # Analytics page
│   │   └── Settings.tsx          # Settings and configuration
│   ├── types/
│   │   ├── wordpress.ts          # WordPress API types
│   │   ├── supabase.ts           # Database schema types
│   │   └── n8n.ts                # N8N workflow types
│   └── styles/
│       └── globals.css           # Global styles and Tailwind imports
└── __tests__/
    ├── setup.ts                  # Test configuration
    ├── components/               # Component tests
    └── hooks/                    # Hook tests
```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: React 19 requires specific patterns
// Example: Must use ReactElement instead of JSX.Element
import { ReactElement } from 'react';
function Component(): ReactElement { return <div />; }

// CRITICAL: Supabase client initialization pattern
// Example: Separate clients for auth vs database operations
const supabase = createClient(url, anonKey);
const supabaseAdmin = createClient(url, serviceKey); // Server-side only

// CRITICAL: WordPress REST API authentication
// Example: Must use Application Passwords (Basic Auth)
const wpAuth = btoa(`${username}:${applicationPassword}`);
headers: { 'Authorization': `Basic ${wpAuth}` }

// CRITICAL: N8N webhook patterns
// Example: Webhook URLs must be registered before workflow execution
await n8n.post('/webhooks/register', { url: callbackUrl });

// CRITICAL: TanStack Query with Supabase real-time
// Example: Must invalidate queries on real-time updates
useEffect(() => {
  const subscription = supabase
    .channel('content_posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'content_posts' }, 
        () => queryClient.invalidateQueries(['posts']))
    .subscribe();
  return () => subscription.unsubscribe();
}, []);

// CRITICAL: TypeScript strict mode requirements
// Example: All external data must be validated with Zod
const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  status: z.enum(['publish', 'draft', 'private'])
});
const validatedPost = PostSchema.parse(apiResponse);

// CRITICAL: Error boundaries for API failures
// Example: WordPress sites may be temporarily unavailable
<ErrorBoundary fallback={<OfflineMessage />}>
  <WordPressContent />
</ErrorBoundary>
```

## Implementation Blueprint

### Data models and structure

Create the core data models to ensure type safety and API consistency.

```typescript
// Supabase database types (generated from existing schema)
interface Blog {
  id: string;
  name: string;
  domain: string;
  niche: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentPost {
  id: string;
  blog_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  wordpress_post_id?: number;
  seo_data: Record<string, unknown>;
  performance_metrics: Record<string, unknown>;
  created_at: string;
  published_at?: string;
}

interface ProductionPipeline {
  id: string;
  blog_id: string;
  workflow_name: string;
  n8n_workflow_id: string;
  status: 'active' | 'paused' | 'error';
  last_execution: string;
  success_rate: number;
  configuration: Record<string, unknown>;
}

// WordPress API response types
interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  status: string;
  slug: string;
  date: string;
  categories: number[];
  tags: number[];
}

// N8N workflow types
interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    parameters: Record<string, unknown>;
  }>;
}

// Zod validation schemas
const BlogSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  domain: z.string().url(),
  niche: z.string(),
  is_active: z.boolean()
});

const WordPressPostSchema = z.object({
  id: z.number(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  status: z.enum(['publish', 'future', 'draft', 'pending', 'private']),
  slug: z.string()
});
```

### List of tasks to be completed in order

```yaml
Task 1: Project Setup and Configuration
CREATE saas-dashboard/ directory structure:
  - Initialize Vite project with React + TypeScript template
  - Configure package.json with all required dependencies
  - Setup TypeScript strict configuration
  - Configure Tailwind CSS with Headless UI
  - Create environment configuration (.env.example, .env.local)

Task 2: Authentication Foundation
CREATE src/lib/supabase.ts:
  - PATTERN: Follow existing Supabase client patterns
  - Initialize createClient with environment variables
  - Export typed client instance

CREATE src/components/auth/AuthProvider.tsx:
  - PATTERN: React Context pattern for auth state
  - Implement session management with useEffect
  - Handle token refresh and logout

Task 3: WordPress API Integration
CREATE src/lib/wordpress.ts:
  - PATTERN: Axios instances for each WordPress site
  - Implement Basic Auth with Application Passwords
  - Create typed methods for posts, categories, tags CRUD
  - Add retry logic and error handling

Task 4: Dashboard Layout Structure
CREATE src/components/layout/DashboardLayout.tsx:
  - PATTERN: Modern dashboard layout with sidebar
  - Implement responsive design with Tailwind
  - Add navigation state management

CREATE src/components/layout/Sidebar.tsx:
  - PATTERN: Collapsible sidebar with icons
  - Route-based active state highlighting
  - Mobile-responsive hamburger menu

Task 5: Blog Management Core
CREATE src/components/blogs/BlogSelector.tsx:
  - PATTERN: Dropdown selector with search
  - Integrate with Supabase blogs table
  - Context-based selected blog state

CREATE src/hooks/useBlogs.ts:
  - PATTERN: TanStack Query hook
  - Fetch blogs from Supabase with caching
  - Real-time updates subscription

Task 6: WordPress Content Management
CREATE src/components/content/PostManager.tsx:
  - PATTERN: Table with filters and pagination
  - Integrate WordPress REST API for posts
  - Implement bulk operations (publish, draft, delete)

CREATE src/components/content/PostEditor.tsx:
  - PATTERN: Form with React 19 Actions API
  - Rich text editing capability
  - Zod validation for all form fields

Task 7: N8N Workflow Integration
CREATE src/lib/n8n.ts:
  - PATTERN: REST API client with authentication
  - Methods for workflow CRUD operations
  - Webhook management and execution monitoring

CREATE src/components/workflows/WorkflowManager.tsx:
  - PATTERN: Grid layout with workflow cards
  - Real-time status indicators
  - Start/stop/pause controls

Task 8: Analytics Dashboard
CREATE src/components/analytics/AnalyticsDashboard.tsx:
  - PATTERN: Grid layout with metric cards
  - Chart integration with performance data
  - Real-time data updates

Task 9: Real-time Features
CREATE src/hooks/useRealtime.ts:
  - PATTERN: Supabase subscription management
  - Query invalidation on data changes
  - Connection status monitoring

Task 10: Testing and Error Handling
CREATE __tests__ directory structure:
  - Component tests with React Testing Library
  - Hook tests with test utilities
  - API integration tests with mock services
  - Error boundary implementation and testing
```

### Per task pseudocode with CRITICAL details

```typescript
// Task 1: Project Setup
npm create vite@latest saas-dashboard -- --template react-ts
cd saas-dashboard
npm install @supabase/supabase-js @tanstack/react-query
npm install @headlessui/react @heroicons/react
npm install tailwindcss postcss autoprefixer
npm install react-router-dom axios date-fns zod
npm install -D @testing-library/react @testing-library/jest-dom vitest

// Task 2: Authentication with React 19 patterns
function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  // PATTERN: Use React 19 use() hook for async context
  const [user, setUser] = useState<User | null>(null);
  
  // CRITICAL: Handle session restoration on app load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    // CRITICAL: Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => setUser(session?.user ?? null)
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Task 3: WordPress API with error handling
class WordPressClient {
  constructor(private baseURL: string, private auth: string) {}
  
  // PATTERN: Typed API methods with Zod validation
  async getPosts(params?: PostsParams): Promise<WordPressPost[]> {
    try {
      // CRITICAL: Include authentication header
      const response = await axios.get(`${this.baseURL}/wp-json/wp/v2/posts`, {
        headers: { 'Authorization': `Basic ${this.auth}` },
        params
      });
      
      // CRITICAL: Validate response with Zod
      return z.array(WordPressPostSchema).parse(response.data);
    } catch (error) {
      // PATTERN: Structured error handling
      if (axios.isAxiosError(error)) {
        throw new WordPressError(error.response?.status, error.message);
      }
      throw error;
    }
  }
}

// Task 4: Dashboard Layout with React 19 patterns
function DashboardLayout(): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // PATTERN: Mobile-first responsive design
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog onClose={setSidebarOpen}>
          <div className="fixed inset-0 z-40 flex">
            <TransitionChild /* ... mobile sidebar content */ />
          </div>
        </Dialog>
      </Transition>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Task 6: WordPress Content with Actions API
function PostEditor({ postId }: { postId?: number }): ReactElement {
  // PATTERN: React 19 Actions for form handling
  const [state, submitAction, isPending] = useActionState(
    async (previousState: any, formData: FormData) => {
      // CRITICAL: Validate form data with Zod
      const result = PostEditorSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        status: formData.get('status')
      });
      
      if (!result.success) {
        return { error: result.error.flatten() };
      }
      
      try {
        // CRITICAL: Handle both create and update cases
        if (postId) {
          await wordpressClient.updatePost(postId, result.data);
        } else {
          await wordpressClient.createPost(result.data);
        }
        return { success: true };
      } catch (error) {
        return { error: 'Failed to save post' };
      }
    },
    null
  );
  
  return (
    <form action={submitAction} className="space-y-6">
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="block w-full rounded-md border-gray-300"
        />
      </div>
      
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Saving...' : 'Save Post'}
      </button>
      
      {state?.error && (
        <div className="text-red-600">{state.error}</div>
      )}
    </form>
  );
}

// Task 9: Real-time with TanStack Query integration
function useRealtime() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // CRITICAL: Subscribe to relevant table changes
    const subscription = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_posts' },
        () => {
          // PATTERN: Invalidate related queries on data change
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'production_pipeline' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
}
```

### Integration Points

```yaml
ENVIRONMENT:
  - add to: .env.local
  - pattern: |
    VITE_SUPABASE_URL=https://wayzhnpwphekjuznwqnr.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    VITE_WORDPRESS_OPTMIL_URL=https://optmil.com
    VITE_WORDPRESS_OPTMIL_AUTH=base64(username:app-password)
    VITE_WORDPRESS_EINSOF7_URL=https://einsof7.com
    VITE_WORDPRESS_EINSOF7_AUTH=base64(username:app-password)
    VITE_N8N_API_URL=https://n8n-instance.com
    VITE_N8N_API_KEY=your-api-key

SUPABASE_TABLES:
  - existing: blogs, content_posts, production_pipeline, keyword_opportunities
  - new_views: executive_dashboard, keyword_opportunities, production_pipeline
  - rls_policies: "Enable RLS on all tables, policy per blog_id"

WORDPRESS_ENDPOINTS:
  - posts: "/wp-json/wp/v2/posts"
  - categories: "/wp-json/wp/v2/categories"
  - tags: "/wp-json/wp/v2/tags"
  - media: "/wp-json/wp/v2/media"
  - auth_method: "Basic Authentication with Application Passwords"

N8N_INTEGRATION:
  - workflows_api: "/api/v1/workflows"
  - execution_api: "/api/v1/executions"
  - webhook_api: "/webhook"
  - auth_method: "API Key in X-N8N-API-KEY header"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run type-check          # TypeScript compilation check
npm run lint               # ESLint with --max-warnings 0
npm run format            # Prettier code formatting

# Expected: No errors. If errors, READ the error and fix.
# Common TypeScript errors:
# - Missing React import for JSX
# - Incorrect prop types in components  
# - Missing return type annotations
# - Using 'any' type (forbidden in strict mode)
```

### Level 2: Unit Tests with existing patterns

```typescript
// CREATE __tests__/components/AuthProvider.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';

// PATTERN: Test authentication state management
describe('AuthProvider', () => {
  test('provides initial auth state', () => {
    const TestComponent = () => {
      const { user } = useAuth();
      return <div>{user ? 'Authenticated' : 'Not authenticated'}</div>;
    };
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });
  
  test('handles sign in flow', async () => {
    // Mock Supabase auth
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: '123', email: 'test@example.com' } },
          error: null
        })
      }
    };
    
    // Test sign in functionality
    const { signIn } = useAuth();
    await signIn('test@example.com', 'password');
    
    await waitFor(() => {
      expect(screen.getByText('Authenticated')).toBeInTheDocument();
    });
  });
});

// CREATE __tests__/hooks/useWordPress.test.ts  
import { renderHook, waitFor } from '@testing-library/react';
import { useWordPressPosts } from '@/hooks/useWordPress';

describe('useWordPressPosts', () => {
  test('fetches posts with proper error handling', async () => {
    const { result } = renderHook(() => 
      useWordPressPosts('optmil', { status: 'publish' })
    );
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBeDefined();
    });
  });
  
  test('handles API errors gracefully', async () => {
    // Mock WordPress API failure
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => 
      useWordPressPosts('optmil')
    );
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });
});
```

```bash
# Run and iterate until passing:
npm test                   # Run all tests
npm run test:coverage     # Generate coverage report (must be >80%)

# If failing: Read error, understand root cause, fix code, re-run
# Never mock to make tests pass - fix the actual implementation
```

### Level 3: Integration Test

```bash
# Start the development server
npm run dev

# Test authentication flow
curl -X POST http://localhost:5173/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'

# Expected: Authentication success response
# If error: Check browser console and Supabase Auth configuration

# Test Supabase connection
curl -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  "https://wayzhnpwphekjuznwqnr.supabase.co/rest/v1/blogs"

# Expected: JSON array of blogs
# If error: Verify Supabase credentials and RLS policies

# Test WordPress API integration
curl --user "$WP_USERNAME:$WP_APP_PASSWORD" \
  "https://optmil.com/wp-json/wp/v2/posts?per_page=1"

# Expected: JSON array with one WordPress post
# If error: Verify WordPress Application Password is configured

# Test N8N API connection  
curl -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_API_URL/api/v1/workflows"

# Expected: JSON array of N8N workflows
# If error: Verify N8N API key and endpoint URL
```

### Level 4: End-to-End Integration

```bash
# Production build test
npm run build
npm run preview

# Expected: Successful build with optimized chunks
# Common build issues:
# - Environment variables not prefixed with VITE_
# - Missing dependencies in production build
# - TypeScript errors not caught in development

# Test complete user workflow
# 1. Navigate to http://localhost:4173
# 2. Login with test credentials
# 3. Switch between Optmil and Einsof7 blogs
# 4. Create a new post and publish to WordPress
# 5. Trigger an N8N workflow
# 6. Monitor real-time analytics updates

# Performance validation
npm run build:analyze      # Bundle size analysis
lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html

# Expected metrics:
# - Performance score >90
# - Accessibility score >95  
# - Bundle size <500KB initial load
# - Time to Interactive <3s on 3G network
```

## Final Validation Checklist

- [ ] All tests pass: `npm test` with >80% coverage
- [ ] No linting errors: `npm run lint` with --max-warnings 0  
- [ ] No type errors: `npm run type-check`
- [ ] Supabase connection successful: Can fetch blogs and posts
- [ ] WordPress APIs working: Can CRUD posts on both sites
- [ ] N8N integration functional: Can list and trigger workflows
- [ ] Authentication complete: Login/logout/session management
- [ ] Real-time features: Live updates from Supabase subscriptions
- [ ] Responsive design: Works on desktop, tablet, mobile
- [ ] Error boundaries: Graceful handling of API failures
- [ ] Performance targets met: <3s initial load, <100ms query responses
- [ ] Accessibility compliance: ARIA labels, keyboard navigation
- [ ] Security validation: No sensitive data logged, proper auth headers

---

## Anti-Patterns to Avoid

- ❌ Don't use `any` type - use proper TypeScript types and Zod validation
- ❌ Don't skip authentication on WordPress API calls - always include Basic Auth
- ❌ Don't ignore TanStack Query caching - leverage staleTime and cacheTime appropriately  
- ❌ Don't mix client and server state - use TanStack Query for all server data
- ❌ Don't hardcode blog URLs - use environment variables and configuration
- ❌ Don't catch all errors generically - handle specific error types appropriately
- ❌ Don't skip loading states - always show appropriate UI feedback
- ❌ Don't ignore accessibility - include proper ARIA labels and keyboard navigation
- ❌ Don't expose sensitive data - keep API keys and passwords in environment variables
- ❌ Don't skip error boundaries - wrap feature components with proper error handling