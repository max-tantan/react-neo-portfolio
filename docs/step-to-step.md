# Step-by-Step Execution Plan

## Current Status

Project sudah di-scaffold dengan Vite + React + TypeScript (template default).  
**Yang sudah ada:** React 19, Vite 8.1, TypeScript, ESLint.  
**Yang belum ada:** Tailwind, router, zustand, data layer, komponen, testing — semuanya masih template kosong.

---

## Phase 1: Foundation — Setup & Konfigurasi

| # | Step | Detail |
|---|------|--------|
| 1.1 | Install dependencies | `react-router-dom`, `zustand`, `tailwindcss`, `@tailwindcss/vite`, `@fontsource/cascadia-mono`, `@fontsource/space-grotesk`, `@iconify/react`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `clsx`, `vite-plugin-svgr` |
| 1.2 | Set up Tailwind v4 | Ubah `src/index.css` → `@import "tailwindcss"` + `@theme` block + `@custom-variant dark`. Hapus `App.css` dan seluruh CSS template default |
| 1.3 | Set up FOUC prevention | Tambah `<script>` inline di `index.html` untuk deteksi theme sebelum render |
| 1.4 | Konfigurasi `vite.config.ts` | Plugin: `@tailwindcss/vite`, `@vitejs/plugin-react`, `vite-plugin-svgr`. Manual chunks: `vendor`, `markdown` |
| 1.5 | Set up path alias | `@/` → `src/` di `tsconfig.app.json` + `vite.config.ts` |
| 1.6 | Set up Vitest | Buat `vitest.config.ts` (jsdom, setup file), `vitest.setup.ts` (localStorage polyfill) |
| 1.7 | Hapus boilerplate template | Bersihkan `App.tsx`, hapus `src/App.css`, hapus `src/assets/` |

**Output:** Project siap dengan Tailwind v4, path alias, testing infra. Semua template default dibersihkan.

---

## Phase 2: Data Layer (Plain TypeScript — 1:1 Copy)

Semua file di fase ini framework-agnostic, migrasi langsung tanpa perubahan kode.

| # | Step | File Target |
|---|------|-------------|
| 2.1 | API types — project | `src/lib/api/projects/types.ts` |
| 2.2 | API types — repository | `src/lib/api/projects/repository/types.ts` |
| 2.3 | Static metadata | `src/lib/api/projects/projects.ts` — array `initialProjects` |
| 2.4 | Cache store | `src/lib/api/projects/repository/cache.ts` — `LocalStorageCache` (dual storage) |
| 2.5 | GitHub repository | `src/lib/api/projects/repository/github.ts` — fetch GitHub API + retry + pagination |
| 2.6 | Cached repository | `src/lib/api/projects/repository/cached.ts` — decorator pattern, TTL, stale-while-revalidate |
| 2.7 | Project service | `src/lib/api/projects/service.ts` — orchestrator, init, openDetail, getReadme |
| 2.8 | Store (zustand) | `src/lib/api/projects/store.ts` — rewrite dari Svelte `$state()` ke zustand |
| 2.9 | About data | `src/lib/api/about/about.ts` |
| 2.10 | Achievements data | `src/lib/api/achievements/achievements.ts` |
| 2.11 | Contact data + service | `src/lib/api/contact/contacts.ts`, `src/lib/api/contact/service.ts` |
| 2.12 | Socials data | `src/lib/api/socials/socials.ts` |
| 2.13 | Tools data | `src/lib/api/tools/tools.ts` |
| 2.14 | Config & utilities | `src/lib/config.ts`, `src/lib/environment.ts`, `src/lib/utils.ts` |

**Output:** Seluruh data layer berfungsi, store zustand siap digunakan oleh komponen.

---

## Phase 3: Hooks

| # | Step | File Target | Deskripsi |
|---|------|-------------|-----------|
| 3.1 | useScroll | `src/lib/hooks/useScroll.ts` | Scroll Y position + direction detection |
| 3.2 | useStaggered | `src/lib/hooks/useStaggered.ts` | IntersectionObserver + reveal items satu per satu |
| 3.3 | useInView | `src/lib/hooks/useInView.ts` | Scroll-into-view detection (threshold, once) |
| 3.4 | useTypewriter | `src/lib/hooks/useTypewriter.ts` | Typewriter text effect |
| 3.5 | useDarkMode | `src/lib/hooks/useDarkMode.ts` | Theme toggle + localStorage persistence |

**Output:** Semua custom hooks siap digunakan.

---

## Phase 4: Routing & App Shell

| # | Step | File Target | Detail |
|---|------|-------------|--------|
| 4.1 | Route definitions | `src/routes/index.tsx` | `createBrowserRouter` dengan 3 route: `/`, `/:projectId`, `*` |
| 4.2 | Rewrite `App.tsx` | `src/App.tsx` | `RouterProvider` + ProjectProvider dari zustand |
| 4.3 | Cleanup `main.tsx` | `src/main.tsx` | Pastikan hanya `StrictMode` + `App` |
| 4.4 | NotFoundPage | `src/routes/NotFoundPage.tsx` | 404 dengan tombol Back to Home |
| 4.5 | Update `index.html` | `index.html` | Title, favicon, meta tags, FOUC script |

**Output:** Routing berfungsi, navigasi antar halaman, 404 handling.

---

## Phase 5: Common Components

| # | Step | File Target | Detail |
|---|------|-------------|--------|
| 5.1 | Button | `src/lib/components/common/Button.tsx` | 18 color variants, dual render `<a>`/`<button>` |
| 5.2 | Wrapper | `src/lib/components/common/Wrapper.tsx` | `max-w-6xl mx-auto` container |
| 5.3 | MarqueeText | `src/lib/components/common/MarqueeText.tsx` | Pure CSS marquee |
| 5.4 | ThemeToggle | `src/lib/components/common/ThemeToggle.tsx` | Dark mode toggle button |
| 5.5 | Emblem | `src/lib/components/graphics/Emblem.tsx` | SVG logo mark |
| 5.6 | Moon | `src/lib/components/graphics/Moon.tsx` | SVG moon icon |
| 5.7 | PhotoCard | `src/lib/components/common/PhotoCard.tsx` | Card + optional halftone |
| 5.8 | ProjectCard | `src/lib/components/common/ProjectCard.tsx` | Project card dengan stats |
| 5.9 | ProjectCardLoading | `src/lib/components/common/ProjectCardLoading.tsx` | Skeleton card |
| 5.10 | ProjectCardError | `src/lib/components/common/ProjectCardError.tsx` | Error card |
| 5.11 | ProjectStats | `src/lib/components/common/ProjectStats.tsx` | Animated stats bar |

**Output:** Semua reusable component siap dipakai di section dan halaman.

---

## Phase 6: HomePage Sections

| # | Step | File Target | Detail |
|---|------|-------------|--------|
| 6.1 | Navbar | `src/lib/components/sections/Navbar.tsx` | Fixed top, auto-hide scroll, background opacity |
| 6.2 | Hero | `src/lib/components/sections/Hero.tsx` | Full viewport + typewriter effect |
| 6.3 | About | `src/lib/components/sections/About.tsx` | Bio paragraphs + PhotoCard + MarqueeText |
| 6.4 | Portfolio | `src/lib/components/sections/Portfolio.tsx` | Project grid + staggered reveal |
| 6.5 | Achievements | `src/lib/components/sections/Achievements.tsx` | Competitions + courses cards |
| 6.6 | Tools | `src/lib/components/sections/Tools.tsx` | Categorized tool icons grid |
| 6.7 | Social | `src/lib/components/sections/Social.tsx` | Social link buttons |
| 6.8 | Contact | `src/lib/components/sections/Contact.tsx` | Contact buttons + form |
| 6.9 | Footer | `src/lib/components/sections/Footer.tsx` | Emblem, nav links, socials, copyright |
| 6.10 | HomePage route | `src/routes/HomePage.tsx` | Composisi semua sections + useEffect init service |

**Output:** Halaman homepage lengkap dengan semua section.

---

## Phase 7: Markdown Pipeline (Fitur Paling Kompleks)

| # | Step | File Target | Detail |
|---|------|-------------|--------|
| 7.1 | Install dependencies | `package.json` | `marked`, `highlight.js`, `marked-alert`, `marked-emoji`, `marked-highlight`, `marked-katex-extension`, `marked-base-url`, `katex`, `@octokit/rest` |
| 7.2 | marked-init | `src/lib/api/projects/marked-init.ts` | Lazy singleton `getConfiguredMarked()` — dynamic import semua deps |
| 7.3 | marked-mermaid | `src/lib/api/projects/marked-mermaid.ts` | Custom marked extension untuk ` ```mermaid ` blocks |
| 7.4 | renderer | `src/lib/api/projects/renderer.ts` | Custom renderer: Tailwind classes, relative URL resolution, heading slugs |
| 7.5 | ProjectDetailPage | `src/routes/ProjectDetailPage.tsx` | `useParams`, inisialisasi service, routing ke detail/loading/error |
| 7.6 | ProjectDetail | `src/lib/components/project-detail/ProjectDetail.tsx` | Fetch README → parse markdown → `dangerouslySetInnerHTML` |
| 7.7 | ProjectDetailLoading | `src/lib/components/project-detail/ProjectDetailLoading.tsx` | Loading skeleton |
| 7.8 | ProjectDetailError | `src/lib/components/project-detail/ProjectDetailError.tsx` | Error state + retry |
| 7.9 | ReadmeStatusIndicator | `src/lib/components/project-detail/ReadmeStatusIndicator.tsx` | Status icon (idle/fetching/rendering/done/error) |
| 7.10 | Mermaid rendering | (di dalam ProjectDetail) | CDN load mermaid.js + MutationObserver render post-DOM |

**Output:** Project detail page dengan full README rendering, syntax highlighting, math, mermaid diagrams.

---

## Phase 8: Animasi & Polish

| # | Step | Detail |
|---|------|--------|
| 8.1 | CSS keyframes | Tambah `@keyframes scale-up-center`, `fade-in-up`, `marquee` di `index.css` |
| 8.2 | Staggered reveal | Integrasi `useStaggered` di Portfolio, Achievements, Tools grid |
| 8.3 | Scroll-in-view | Integrasi `useInView` di tiap section (About, Portfolio, Achievements, dll) |
| 8.4 | Stats counter animation | Animasi angka di ProjectStats |
| 8.5 | Responsive design | Hamburger menu mobile, grid breakpoints di Portfolio/Tools/Achievements |
| 8.6 | Loading/error/empty states | Coverage semua komponen — tidak ada kondisi tanpa state handling |
| 8.7 | Navbar transition | Animated hide/show on scroll direction, background opacity |

**Output:** UI halus, responsif, accessible.

---

## Phase 9: Testing & Quality

| # | Step | Detail |
|---|------|--------|
| 9.1 | Unit test — cache | `LocalStorageCache` dengan mock localStorage |
| 9.2 | Unit test — GitHub repo | `GitHubRepository` dengan mock fetch |
| 9.3 | Unit test — CachedRepository | Mock inner repo + mock cache |
| 9.4 | Integration test — ProjectService | Real cache + mock GitHub |
| 9.5 | Unit test — store | State transitions zustand |
| 9.6 | Unit test — hooks | Scroll, staggered, inView, typewriter |
| 9.7 | Component test — Button | Render variants, click handler |
| 9.8 | Component test — ThemeToggle | Toggle + localStorage |
| 9.9 | Unit test — markdown renderer | Headings, links, images, tables |
| 9.10 | Snapshot test — markdown | Known input → expected HTML output |
| 9.11 | Build config final | Verifikasi chunk splitting, `vite build` sukses |
| 9.12 | Lint fix | `npm run lint` — zero errors |

**Output:** Test coverage di semua layer, build production siap.

---

## Dependency Map

```
Phase 1 (Foundation)
    ↓
Phase 2 (Data Layer)
    ↓
Phase 3 (Hooks) ──────────────┐
    ↓                          ↓
Phase 4 (Routing & Shell)      │
    ↓                          │
Phase 5 (Common Components) ←──┘
    ↓
Phase 6 (HomePage Sections)
    ↓
Phase 7 (Markdown Pipeline)    ← bisa paralel dengan Phase 5-6
    ↓
Phase 8 (Animasi & Polish)
    ↓
Phase 9 (Testing & Quality)
```

- **Linear:** Phase 1 → 2 → 3 → 4 (dependensi berantai)
- **Paralel:** Phase 5 & 6 bisa dikerjakan setelah Phase 3 & 4
- **Independen:** Phase 7 bisa dimulai kapan saja, tapi paling kompleks
- **Final:** Phase 8 & 9 selalu di akhir
