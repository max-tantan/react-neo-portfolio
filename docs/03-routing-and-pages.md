# Routing & Pages

## Route Structure

```
/                  → HomePage       (sections: Navbar, Hero, About, Portfolio, Achievements, Tools, Social, Contact, Footer)
/:projectId        → ProjectDetail  (project detail with README rendering)
/*                 → NotFoundPage   (404)
```

## Current SvelteKit Routing

SvelteKit uses file-based routing: `src/routes/+page.svelte` maps to `/`, `src/routes/$projects$/[id]/+page.svelte` maps to `/$projects$/:id`. Each route has an optional `+page.ts` load function that returns `data` props to the page component.

### Home Page Load (`+page.ts`)

```typescript
// Runs at build time (prerender) and client-side navigation
export function load() {
  const cacheStore = new LocalStorageCache(
    import.meta.env.DEV ? 'project:dev:' : 'project:',
    '1'
  );
  const repo = new CachedRepository(new GitHubRepository(), cacheStore);
  const projectService = new ProjectService(repo);
  return { fetch, projectService, cacheStore };
}
```

### Project Detail Page Load (`+page.ts`)

```typescript
export function load({ params, url }) {
  const project = initialProjects.find(p => p.id === params.id);
  if (!project) {
    if (import.meta.env.DEV && isDevSpecialRoute(url.pathname)) {
      return { project: initialProjects[0], ... };
    }
    throw error(404, 'Project not found');
  }
  // Create fresh instances
  const cacheStore = new LocalStorageCache(...);
  const repo = new CachedRepository(new GitHubRepository(), cacheStore);
  const projectService = new ProjectService(repo);
  return { project, projectService, fetch };
}
```

## Target React Routing

Use `react-router-dom` v7 with createBrowserRouter:

```typescript
// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import ProjectDetailPage from './ProjectDetailPage';
import NotFoundPage from './NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/:projectId',
    element: <ProjectDetailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### Data Loading Pattern

Replace SvelteKit's `load` functions with React's approach:

**HomePage — useEffect initialization:**

```typescript
function HomePage() {
  const { projects, loading, error, setProjects, setLoading, setError } = useProjectStore();
  const serviceRef = useRef<ProjectService | null>(null);

  useEffect(() => {
    const cacheStore = new LocalStorageCache('project:', '1');
    const repo = new CachedRepository(new GitHubRepository(), cacheStore);
    const service = new ProjectService(repo);
    serviceRef.current = service;

    service.init().then(() => {
      // Store is updated internally by service
    });
  }, []);

  if (error) return <ErrorState message={error} />;
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Portfolio projects={projects} loading={loading} />
      <Achievements />
      <Tools />
      <Social />
      <Contact />
      <Footer />
    </>
  );
}
```

**ProjectDetailPage — dynamic param:**

```typescript
function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = initialProjects.find(p => p.id === projectId);
  const { projectDetail, detailLoading, detailError, ... } = useProjectStore();
  const serviceRef = useRef<ProjectService | null>(null);

  useEffect(() => {
    if (!project) {
      navigate('/not-found', { replace: true });
      return;
    }
    // Initialize service + fetch detail
  }, [projectId]);

  if (detailLoading) return <ProjectDetailLoading />;
  if (detailError) return <ProjectDetailError />;
  if (!projectDetail) return null;
  return <ProjectDetail project={projectDetail} service={serviceRef.current!} />;
}
```

### Route Parameter Convention

The current app uses `/$projects$/[id]` as the path. For the generic template, simplify to `/:projectId` — cleaner and more reusable.

### Static Generation

To maintain the fully static SPA approach:

1. **Build-time route detection:** At build, iterate `initialProjects` to know which `/:projectId` routes exist
2. **Vite static export:** Use `vite build` with the `@vitejs/plugin-react` plugin
3. **Server config:** For Nginx/deployment, configure fallback to `index.html` for all routes (standard SPA setup)

### 404 Handling

```typescript
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="...">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );
}
```

### Dev-Only Special Routes

The current app has dev-only routes for `/[$]projects$/loading` and `/[$]projects$/error` that return dummy data for UI development. In React, replace with:

```typescript
if (import.meta.env.DEV && (projectId === 'loading' || projectId === 'error')) {
  // Render placeholder UI with dummy project data
  const dummyProject = initialProjects[0];
  // ...
}
```

Remove this branch for production builds — code-split it behind `import.meta.env.DEV`.
