# Data Layer — Project Pipeline

## Overview

The project data pipeline is the most architecturally significant part of the app. It is fully framework-agnostic and migrates to React with zero changes to business logic.

```
initialProjects (static metadata)
       |
GitHubRepository.fetchProject()    ← raw API calls
       |
CachedRepository.fetchProject()    ← decorator: checks cache, falls back to stale
       |
LocalStorageCache.get()/set()      ← dual storage: memory + localStorage
       |
ProjectService.init()              ← orchestrator: batch-fetch all projects
       |
Store (zustand / React context)    ← reactive state for UI
       |
UI Components                      ← read from store
```

## Layer 1: Static Metadata

**File:** `src/lib/api/projects/projects.ts`

A plain array of `Project` objects serves as the source of truth for what projects exist:

```typescript
interface Project {
  id: string;
  name: string;
  url: string;              // GitHub API URL
  description?: string;
  readmeBaseUrl: string;
  imageUrl: string;
  readmeUrl?: string;
  tags: string[];
  // Augmented at runtime:
  starsCount?: number;
  forksCount?: number;
  downloadsCount?: number;
  issuesCount?: number;
  pullRequestsCount?: number;
  statusMessage?: string;
  repositoryUrl?: string;
  hasLivePreview?: boolean;
  livePreviewUrl?: string;
}
```

This array also drives route generation — every project `id` produces a prerendered route at `/:id`.

**Migration:** 1:1 copy. No changes needed.

## Layer 2: Repository Interface

**File:** `src/lib/api/projects/repository/types.ts`

Two interfaces define the contract:

```typescript
interface ProjectRepository {
  fetchProject(
    project: Project,
    fetch?: typeof globalThis.fetch
  ): Promise<Project>;

  fetchReadme(
    project: Project,
    fetch?: typeof globalThis.fetch
  ): Promise<string | null>;
}

interface CacheStore {
  get<T>(key: string): T | null;
  peek<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs?: number): void;
  remove(key: string): void;
  clear(): void;
}
```

The `fetch` parameter enables dependency injection for testing and server-side rendering.

**Migration:** 1:1 copy. No framework dependencies.

## Layer 3: GitHubRepository

**File:** `src/lib/api/projects/repository/github.ts`

Implements `ProjectRepository`. Makes these GitHub API calls for each project:

```
GET {project.url}           → repo data (stars, forks, issues, language, html_url)
GET {project.url}/releases  → downloads (paginated, sums all assets)
GET {project.url}/pulls?state=all&per_page=1  → PR count (via Link header)
GET {project.readmeUrl}     → raw README.md content
```

Key behaviors:
- **Retry with backoff:** 3 retries, exponential backoff (1s, 2s, 4s) for 429/403
- **Downloads:** paginates through releases, sums `assets[].download_count`
- **PR count:** parses `Link` header for last page number
- **Tags merge:** auto-detected language from GitHub API merged into `project.tags`
- **Custom fetch:** accepts optional `fetch` argument for DI (e.g., SvelteKit's `fetch` in dev mode)

**Migration:** 1:1 copy. Replace SvelteKit's `fetch` with global `fetch` or pass explicitly.

### fetchRepoBase

```typescript
private async fetchRepoBase(
  project: Project,
  fetch: typeof globalThis.fetch
): Promise<RepoBase>
```

Fetches repo info, releases (paginated), and PR count. Returns merged JSON, download count, and PR count.

### fetchWithRetry

```typescript
private async fetchWithRetry(
  fn: () => Promise<Response>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response>
```

Simple retry wrapper with exponential backoff.

## Layer 4: LocalStorageCache

**File:** `src/lib/api/projects/repository/cache.ts`

Implements `CacheStore` with dual-layer storage:

```typescript
class LocalStorageCache implements CacheStore {
  private memoryCache = new Map<string, CacheEntry>();

  constructor(
    private prefix = 'project:',    // 'project:dev:' in dev, 'project:' in prod
    private version = '1'           // increment to bust all caches
  ) {}
}
```

**Key behaviors:**
- **`get(key)`:** returns cached entry only if version matches AND not expired
- **`peek(key)`:** returns entry ignoring version/expiry (stale-while-revalidate)
- **`set(key, value, ttlMs?)`:** stores with optional expiry timestamp
- **`remove(key)` / `clear()`:** cache management
- **Server safety:** gracefully falls back to in-memory Map when `localStorage` unavailable

**Cache key format:** `{prefix}{version}:{key}` (e.g., `project:1:ruwet-meter`)

**Migration:** 1:1 copy. Pure TypeScript, no framework dependency.

## Layer 5: CachedRepository

**File:** `src/lib/api/projects/repository/cached.ts`

Decorator that wraps a `ProjectRepository` with caching:

```typescript
class CachedRepository implements ProjectRepository {
  constructor(
    private inner: ProjectRepository,
    private cache: CacheStore
  ) {}
}
```

**Cache rules:**
- **Project stats TTL:** 1 hour (3600000ms)
- **README TTL:** 30 minutes (1800000ms)
- **Cache key:** `project:project:{id}` for stats, `project:readme:{id}` for README

**fetchProject flow:**
```
1. Check cache.get(project:stats:{id})
2. Hit → return cached
3. Miss → inner.fetchProject() → cache.set() → return
4. Error → peek() for stale data → return stale or fallback
```

**Dev fallback:** In dev mode (`import.meta.env.DEV`), returns dummy project stats (767 stars, 67 forks, etc.) when no cache and API fails.

**Migration:** 1:1 copy. Replace `import.meta.env.DEV` with `process.env.NODE_ENV === 'development'` or Vite's `import.meta.env.DEV` (works in React+Vite too).

## Layer 6: ProjectService

**File:** `src/lib/api/projects/service.ts`

Orchestrator that coordinates batch and single project fetches:

```typescript
class ProjectService {
  constructor(private repo: ProjectRepository) {}

  async init(fetch?: typeof globalThis.fetch): Promise<void>
  // Batch-fetches all projects, updates store
  // On partial failure: keeps successes, marks failures with statusMessage
  // On total failure: sets error state

  async openDetail(
    project: Project,
    fetch?: typeof globalThis.fetch
  ): Promise<void>
  // Fetches single project detail, updates store

  async getReadme(
    project: Project,
    fetch?: typeof globalThis.fetch
  ): Promise<string | null>
  // Fetches and caches README content
}
```

**`init` flow:**
```
1. Set loading = true
2. Promise.allSettled(initialProjects.map(p => repo.fetchProject(p, fetch)))
3. Merge successful results into store
4. Apply statusMessage to failed results
5. Set loading = false
```

**Migration:** 1:1 copy. The service calls store methods — migrate store from Svelte runes to React state.

## Layer 7: Store (Reactive State)

**Current (Svelte 5 runes):**

```typescript
class ProjectStore {
  projects = $state<Project[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);
  projectDetail = $state<Project | null>(null);
  detailLoading = $state(false);
  detailError = $state<string | null>(null);
}
export const projectStore = new ProjectStore();
```

**Target (zustand):**

```typescript
interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  projectDetail: Project | null;
  detailLoading: boolean;
  detailError: string | null;
  setProjects: (projects: Project[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProjectDetail: (project: Project | null) => void;
  setDetailLoading: (loading: boolean) => void;
  setDetailError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,
  projectDetail: null,
  detailLoading: false,
  detailError: null,
  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setProjectDetail: (project) => set({ projectDetail: project }),
  setDetailLoading: (loading) => set({ detailLoading: loading }),
  setDetailError: (error) => set({ detailError: error }),
}));
```

**Alternative:** React Context + useReducer if you prefer built-in state management.

## Service → Store Integration

The service needs access to the store. In React, pass store setters via constructor or method injection:

```typescript
// Option A: Constructor injection
const service = new ProjectService(repo);
service.setStore(useProjectStore.getState());

// Option B: Direct import in service
import { useProjectStore } from './store';
// Inside service:
const store = useProjectStore.getState();
store.setLoading(true);
```

## Testing

The layered architecture makes testing straightforward:

- **LocalStorageCache:** unit test with mocked `localStorage`
- **GitHubRepository:** unit test with mocked `fetch` (returns fixture data)
- **CachedRepository:** test with mock inner repository + mock cache
- **ProjectService:** integration test with real cache + mock GitHub
- **Store:** unit test state transitions
- **Data integrity:** validate all project entries have required fields

All existing tests are Vitest + plain TypeScript — they run as-is in the React project.
