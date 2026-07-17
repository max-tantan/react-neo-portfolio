# Architecture Overview

## Tech Stack

| Layer | Current (SvelteKit) | Target (React + Vite) |
|-------|-------------------|----------------------|
| Framework | SvelteKit 5 | React 19 + Vite 6 |
| Language | TypeScript | TypeScript |
| Styling | Tailwind CSS v4 | Tailwind CSS v4 |
| Routing | File-based (SvelteKit) | React Router v7 |
| Build | Vite + adapter-static | Vite |
| Test | Vitest + jsdom | Vitest + jsdom |
| Package Manager | Bun | pnpm |

## Architectural Decisions

### 1. Fully Static SPA

Current app is a fully prerendered SPA via `adapter-static` — no SSR runtime. Every route is rendered to static HTML at build time. React version follows the same approach:

- `react-router-dom` with static route definitions
- Export to static files via `vite build`
- All data fetching happens client-side after initial render
- No server runtime required

### 2. Layered Data Architecture

Data flows through clearly separated layers, each independently testable:

```
Static Metadata (projects.ts)
       |
GitHubRepository (raw API fetcher)
       |
CachedRepository (caching decorator)
       |
LocalStorageCache (persistent + in-memory cache)
       |
ProjectService (orchestrator)
       |
Store (reactive state)
       |
UI Components
```

The entire data layer (except Store) is plain TypeScript — migrates 1:1 without framework changes.

### 3. Cache-First Strategy

Prioritize cached data over fresh data:

- **localStorage** with versioned keys for cross-session persistence
- **In-memory Map** as fallback for non-browser environments (prerender, test)
- **TTL-based expiry**: 1h project stats, 30min README
- **Stale-while-revalidate**: serve stale cache on fetch failure instead of error
- **Dev fallback**: dummy data when API unreachable during development

### 4. Lazy Rendering Pipeline

Markdown rendering is intentionally deferred:

- `marked`, `highlight.js`, `KaTeX`, `Mermaid` dynamically imported only on detail pages
- Each dependency code-split into separate Vite chunks (`rollupOptions.output.manualChunks`)
- Mermaid loaded from CDN (not bundled), rendered post-DOM via `MutationObserver`

### 5. Static Generation + Dynamic Enrichment

- Static metadata array defines all projects at build time (drives route generation)
- Dynamic enrichment (stars, forks, downloads) fetched client-side from GitHub API
- Hybrid approach: fast initial render + rich runtime data

## Folder Structure (Target)

```
src/
  main.tsx                 # React entry point (ReactDOM.createRoot)
  App.tsx                  # Root: providers, router
  index.css                # Tailwind v4 entry + @theme
  routes/
    index.tsx              # Route definitions
    HomePage.tsx           # Home: sections compose
    ProjectDetailPage.tsx  # Project detail: markdown rendering
    NotFoundPage.tsx       # 404
  lib/
    config.ts              # App-wide constants
    environment.ts         # Browser detection
    utils.ts               # Utilities
    hooks/                 # Custom React hooks
      useScroll.ts         # Scroll position
      useStaggered.ts      # Staggered reveal
      useInView.ts         # IntersectionObserver
      useTypewriter.ts     # Typewriter effect
    api/
      about/               # About data
      achievements/        # Achievements data
      contact/             # Contact data + form service
      projects/            # Core data pipeline
        types.ts
        projects.ts        # initialProjects array
        store.ts           # React context / zustand
        service.ts         # ProjectService
        repository/
          types.ts
          github.ts
          cached.ts
          cache.ts
      socials/
      tools/
    components/
      common/              # Button, Wrapper, MarqueeText, ThemeToggle, etc.
      sections/            # Hero, About, Portfolio, Achievements, Tools, Social, Contact, Footer, Navbar
      project-detail/      # ProjectDetail, loading/error states, markdown
      graphics/            # SVG components (Emblem, Moon, etc.)
```

## Svelte → React Pattern Mapping

| Svelte | React |
|--------|-------|
| `$state()` rune | `useState()` / zustand |
| `$derived()` | `useMemo()` |
| `onMount` | `useEffect(fn, [])` |
| `onDestroy` | `useEffect` cleanup |
| Svelte actions | `useRef` + `useEffect` |
| `writable()` store | zustand store / React context |
| `{#each items}` | `items.map()` |
| `{#if condition}` | `{condition && ...}` |
| `{@html html}` | `dangerouslySetInnerHTML` |
| `$props()` | destructured props |
| `$slots` / snippets | `children` prop |
| `bind:property` | controlled value + onChange |
