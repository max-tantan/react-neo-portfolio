# Migration Checklist — SvelteKit → React + Vite

## Project Setup

- [ ] Initialize Vite + React + TypeScript project
- [ ] Install Tailwind CSS v4 + `@tailwindcss/vite` plugin
- [ ] Install React Router v7 (`react-router-dom`)
- [ ] Install zustand (state management)
- [ ] Install Vitest + jsdom + testing-library
- [ ] Set up `@fontsource/cascadia-mono`, `@fontsource/space-grotesk`
- [ ] Install icon libraries: `@iconify/react`, `@fortawesome/react-fontawesome`
- [ ] Copy static assets (`/fonts/`, `/favicon.*`, `/robots.txt`, `/sitemap.xml`)
- [ ] Copy `index.html` template with FOUC-prevention script

## Data Layer (No Framework Changes — Plain TypeScript)

- [ ] `src/lib/api/projects/types.ts` — 1:1 copy
- [ ] `src/lib/api/projects/projects.ts` — 1:1 copy
- [ ] `src/lib/api/projects/repository/types.ts` — 1:1 copy
- [ ] `src/lib/api/projects/repository/github.ts` — 1:1 copy
- [ ] `src/lib/api/projects/repository/cache.ts` — 1:1 copy
- [ ] `src/lib/api/projects/repository/cached.ts` — 1:1 copy (replace `import.meta.env.DEV` if needed)
- [ ] `src/lib/api/projects/service.ts` — 1:1 copy
- [ ] `src/lib/api/projects/store.ts` — rewrite Svelte runes → zustand store
- [ ] `src/lib/api/about/about.ts` — 1:1 copy
- [ ] `src/lib/api/achievements/achievements.ts` — 1:1 copy
- [ ] `src/lib/api/contact/contacts.ts` — 1:1 copy
- [ ] `src/lib/api/contact/service.ts` — 1:1 copy
- [ ] `src/lib/api/socials/socials.ts` — 1:1 copy
- [ ] `src/lib/api/tools/tools.ts` — 1:1 copy
- [ ] `src/lib/config.ts` — remove personal data, keep structure
- [ ] `src/lib/environment.ts` — 1:1 copy
- [ ] `src/lib/utils.ts` — 1:1 copy
- [ ] Copy all test files — they run as-is with Vitest

## Hooks (Replace Svelte-specific Patterns)

- [ ] `src/lib/hooks/useScroll.ts` — scroll position state
- [ ] `src/lib/hooks/useStaggered.ts` — IntersectionObserver staggered reveal
- [ ] `src/lib/hooks/useInView.ts` — scroll-into-view detection
- [ ] `src/lib/hooks/useTypewriter.ts` — typewriter text effect
- [ ] `src/lib/hooks/useDarkMode.ts` — theme toggle with localStorage persistence

## Styling

- [ ] `src/index.css` — Tailwind v4 entry, `@theme`, fonts, animations
- [ ] Copy `highlight.js` theme CSS (import in detail page only)
- [ ] Configure `vite.config.ts` — `@tailwindcss/vite` plugin, manual chunk splitting

## Routing

- [ ] `src/routes/index.tsx` — `createBrowserRouter` with all routes
- [ ] `src/routes/HomePage.tsx` — compose section components
- [ ] `src/routes/ProjectDetailPage.tsx` — dynamic param `:projectId`
- [ ] `src/routes/NotFoundPage.tsx` — 404 page
- [ ] `src/App.tsx` — `RouterProvider`
- [ ] `src/main.tsx` — `ReactDOM.createRoot`

## Common Components

- [ ] `Button.tsx` — 18 color variants, `<a>`/`<button>` dual render
- [ ] `Wrapper.tsx` — max-width container
- [ ] `MarqueeText.tsx` — CSS marquee
- [ ] `ThemeToggle.tsx` — dark mode button
- [ ] `Emblem.tsx` — SVG logo
- [ ] `Moon.tsx` — SVG icon
- [ ] `PhotoCard.tsx` — card with optional halftone effect
- [ ] `Hamburger.tsx` — mobile menu toggle
- [ ] `ProjectCard.tsx` — project card with stats
- [ ] `ProjectCardLoading.tsx` — skeleton card
- [ ] `ProjectCardError.tsx` — error card
- [ ] `ProjectStats.tsx` — animated stats bar
- [ ] `ReadmeStatusIndicator.tsx` — README fetch status

## Home Page Sections

- [ ] `Navbar.tsx` — fixed nav, scroll hide/show, background opacity
- [ ] `Hero.tsx` — typewriter effect, full viewport
- [ ] `About.tsx` — bio + photo cards + marquee
- [ ] `Portfolio.tsx` — project grid, staggered reveal
- [ ] `Achievements.tsx` — competition + course cards
- [ ] `Tools.tsx` — categorized tool icons
- [ ] `Social.tsx` — social link buttons
- [ ] `Contact.tsx` — contact buttons + form
- [ ] `Footer.tsx` — emblem, nav, socials, copyright

## Project Detail

- [ ] `ProjectDetail.tsx` — full detail with markdown rendering
- [ ] `ProjectDetailLoading.tsx` — loading skeleton
- [ ] `ProjectDetailError.tsx` — error state with retry

## Markdown Pipeline

- [ ] `marked-init.ts` — lazy singleton marked initializer
- [ ] `marked-mermaid.ts` — custom mermaid extension
- [ ] `renderer.ts` — custom marked renderer (Tailwind classes, URL resolution)
- [ ] Copy all dependencies: `marked`, `marked-alert`, `marked-base-url`, `marked-emoji`, `marked-highlight`, `marked-katex-extension`, `highlight.js`, `katex`, `@octokit/rest`

## Build Configuration

- [ ] `vite.config.ts`:
  - `@tailwindcss/vite` plugin
  - `@vitejs/plugin-react` plugin
  - `vite-plugin-svgr` (for SVG imports as components)
  - Manual chunk splitting: markdown, octokit, iconify, vendor
  - SSR `noExternal` for `@iconify/react`

- [ ] `vitest.config.ts`:
  - jsdom environment
  - Inline deps for `@testing-library/react`
  - Coverage config

- [ ] `vitest.setup.ts`: localStorage polyfill + animate polyfill

## Dependency Equivalents

| SvelteKit | React |
|-----------|-------|
| `@sveltejs/kit` | `react-router-dom` |
| `@sveltejs/adapter-static` | Vite default (static assets) |
| `@iconify/svelte` | `@iconify/react` |
| `svelte-fa` | `@fortawesome/react-fontawesome` |
| `svelte-typewriter` | Custom `useTypewriter` hook |
| `$app/stores` | zustand / React context |
| `<svelte:window bind:scrollY>` | `useScroll` hook |
| `{#each}` | `.map()` |
| `{#if}` | `{condition && }` / ternary |
| `{@html}` | `dangerouslySetInnerHTML` |
| `transition:scale` | CSS `@keyframes` / framer-motion |
| `tweened` | Custom `useTween` hook |

## Migration Order (Recommended)

### Phase 1: Foundation
1. Scaffold Vite + React project
2. Set up Tailwind v4, fonts, index.html
3. Copy all data layer files (plain TypeScript — zero changes)
4. Set up zustand store
5. Verify tests pass

### Phase 2: Shell
6. Set up React Router
7. Build common components (Button, Wrapper, etc.)
8. Build Navbar + Footer + ThemeToggle
9. Set up scroll hook + dark mode

### Phase 3: Pages
10. Build HomePage with all sections
11. Build ProjectDetailPage shell
12. Build 404 page

### Phase 4: Complex Features
13. Markdown pipeline — copy `marked-init.ts`, `renderer.ts`, `marked-mermaid.ts`
14. Mermaid CDN loading + MutationObserver
15. Project detail with full README rendering

### Phase 5: Polish
16. Animations — staggered reveal, scroll-into-view, stats counter
17. Responsive design — mobile nav, grid breakpoints
18. Loading/error/empty states for every component

### Phase 6: Quality
19. Copy and adapt all tests
20. Build configuration — chunk splitting, static export
21. ESLint + Prettier setup
22. README documentation

## File Mapping: Data API

| File | Action |
|------|--------|
| `src/lib/api/projects/projects.js` → `src/lib/api/projects/projects.ts` | Copy, rename to `.ts` |
| `src/lib/api/projects/types.ts` | Copy |
| `src/lib/api/projects/repository/types.ts` | Copy |
| `src/lib/api/projects/repository/github.ts` | Copy |
| `src/lib/api/projects/repository/cache.ts` | Copy |
| `src/lib/api/projects/repository/cached.ts` | Copy |
| `src/lib/api/projects/store.svelte.ts` → `src/lib/api/projects/store.ts` | Rewrite Svelte runes → zustand |
| `src/lib/api/projects/service.ts` | Copy, update store import |
| `src/lib/api/about/about.ts` | Copy |
| `src/lib/api/achievements/achievements.ts` | Copy |
| `src/lib/api/contact/contacts.ts` | Copy |
| `src/lib/api/contact/service.ts` | Copy |
| `src/lib/api/socials/socials.ts` | Copy |
| `src/lib/api/tools/tools.ts` | Copy |
| `src/lib/config.ts` | Copy, generalize |
| `src/lib/environment.ts` | Copy |
| `src/lib/utils.ts` | Copy |

| Directory | Action |
|-----------|--------|
| `src/lib/components/colors/` | Copy (index.ts, types.ts, colors.ts, button.ts) |
| `src/lib/components/navigation/` | Copy (index.ts, types.ts) |
| `src/lib/components/form/` | Copy (index.ts) |
| `src/lib/components/graphics/*.svg` | Copy, import via svgr |
