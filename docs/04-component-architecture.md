# Component Architecture

## Component Tree

```
App
├── ProjectProvider (context / store)
├── Navbar
│   ├── Logo
│   ├── NavLinks (list)
│   ├── ThemeToggle
│   └── HamburgerMenu (mobile)
├── HomePage
│   ├── Hero
│   │   └── TypewriterText
│   ├── About
│   │   ├── PhotoCard (×3)
│   │   └── MarqueeText
│   ├── Portfolio
│   │   ├── ProjectCard (×n)
│   │   │   └── ProjectStats
│   │   ├── ProjectCardLoading (×n)
│   │   └── ProjectCardError
│   ├── Achievements
│   │   └── AchievementCard (×n)
│   ├── Tools
│   │   └── ToolCategory
│   ├── Social
│   │   └── SocialLink (×n)
│   ├── Contact
│   │   ├── ContactButton (×n)
│   │   └── ContactForm
│   └── Footer
│       ├── Emblem
│       ├── SocialLinks
│       └── NavLinks
└── ProjectDetailPage
    ├── ProjectDetail
    │   ├── ReadmeStatusIndicator
    │   └── MarkdownRenderer  (dangerouslySetInnerHTML)
    ├── ProjectDetailLoading
    └── ProjectDetailError
```

## Component Categories

### 1. Common / Reusable Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `href?`, `variant`, `disabled?`, `fullWidth?`, `small?`, `onClick?`, `children` | 18 color variants, renders as `<a>` or `<button>` |
| `Wrapper` | `children` | Width-constrained container (`max-w-6xl mx-auto`) |
| `MarqueeText` | `duration?`, `repeat?`, `direction?`, `paused?`, `children` | Pure CSS marquee animation |
| `ThemeToggle` | none | Dark mode toggle button |
| `Emblem` | `size?` | SVG logo mark |
| `Moon` | none | Moon SVG icon |
| `PhotoCard` | `imageSrc?`, `title`, `description`, `bgClass?`, `halftone?` | Card with optional halftone pattern overlay |

### 2. Section Components (Home Page)

| Component | Data Source | Description |
|-----------|-------------|-------------|
| `Navbar` | scroll position (hook) | Fixed top nav, auto-hide on scroll down, background opacity by scroll depth |
| `Hero` | static config | Full-viewport intro with typewriter effect |
| `About` | `about.ts` | Bio paragraphs + photo cards + marquee |
| `Portfolio` | project store | Project grid with staggered reveal |
| `Achievements` | `achievements.ts` | Competition + course cards |
| `Tools` | `tools.ts` | Categorized tool icons grid |
| `Social` | `socials.ts` | Social link buttons |
| `Contact` | `contacts.ts` | Contact buttons + optional message form |
| `Footer` | config + socials | Emblem, nav links, socials, copyright |

### 3. Project Detail Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ProjectDetail` | `project`, `service` | Full detail: header, image, tags, stats, README |
| `ProjectDetailLoading` | `project?` | Loading skeleton |
| `ProjectDetailError` | `project`, `error?` | Error state with retry |
| `ReadmeStatusIndicator` | `status`, `message?` | Status icon for README fetch/render |

### 4. Graphics (SVGs)

SVGs are imported as React components using Vite's built-in SVG support or `vite-plugin-svgr`:

```typescript
import Emblem from './graphics/Emblem';
import Moon from './graphics/Moon';
```

## Key Component Patterns to Migrate

### Svelte Snippet → React Children

**Svelte:**
```svelte
<Button let:icon>
  {#snippet icon()}<svg ... />{/snippet}
  Click me
</Button>
```

**React:**
```tsx
<Button icon={<svg ... />}>Click me</Button>
```

### Svelte Class Directive → React className

**Svelte:**
```svelte
<button class:active={isActive} class:loading>
```

**React:**
```tsx
<button className={`btn ${isActive ? 'active' : ''} ${loading ? 'loading' : ''}`}>
```
or use `clsx`:
```tsx
<button className={clsx('btn', { active: isActive, loading })}>
```

### Svelte Transition → CSS / Framer Motion

**Svelte:**
```svelte
{#each items as item (item.id, index)}
  <div transition:scale={{ duration: 367, delay: index * 100 }}>
```

**React (CSS):**
```tsx
<div
  className="scale-up-center"
  style={{ animationDelay: `${index * 100}ms` }}
>
```

**React (framer-motion):**
```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.367, delay: index * 0.1 }}
>
```

### Svelte Store Subscription → React Hook

**Svelte:**
```
$loading, $projects (auto-subscribe to store)
```

**React (zustand):**
```typescript
const loading = useProjectStore(s => s.loading);
const projects = useProjectStore(s => s.projects);
```

### Svelte onMount → React useEffect

**Svelte:**
```svelte
<script>
  import { onMount } from 'svelte';
  onMount(() => { /* init */ });
</script>
```

**React:**
```tsx
useEffect(() => {
  // init
  return () => { /* cleanup */ };
}, []);
```

## Staggered Reveal Pattern

**Current:** `useStaggered` Svelte action with IntersectionObserver

**Target:** Custom `useStaggered` hook:

```typescript
function useStaggered(
  itemCount: number,
  options?: { interval?: number; delay?: number; once?: boolean }
): {
  containerRef: React.RefObject<HTMLDivElement>;
  visibleItems: boolean[];
}
```

The hook observes the container, reveals items one by one at set intervals, and persists the "already shown" state in localStorage with a TTL (e.g., 5 minutes).

## Scroll-Aware Animations

**Current:** `Saos.svelte` — scroll-into-view wrapper with CSS animation triggers

**Target:** Custom `useInView` hook:

```typescript
function useInView(options?: {
  threshold?: number;
  once?: boolean;
}): {
  ref: React.RefObject<HTMLDivElement>;
  isInView: boolean;
}
```

Usage:
```tsx
function About() {
  const { ref, isInView } = useInView({ once: true });
  return (
    <div ref={ref} className={isInView ? 'animate-fade-in' : 'opacity-0'}>
      ...
    </div>
  );
}
```

## ProjectCard Color System

Each project card gets a deterministic color variant based on its index:

```typescript
const cardColors = ['default', 'blue', 'yellow', 'red', 'purple', 'green'] as const;
const cardColor = cardColors[index % cardColors.length];
```

Color variants define border, background, and hover styles for both light and dark modes.

## Button Color Variants

18 color variants mapped to CSS classes for social links, contacts, and actions:

```typescript
type ButtonVariant =
  | 'primary' | 'secondary' | 'disabled' | 'white' | 'custom-3'
  | 'whatsapp' | 'email' | 'github' | 'hackerrank' | 'instagram'
  | 'facebook' | 'linkedIn' | 'medium' | 'telegram' | 'x'
  | 'codeforces' | 'gitlab' | 'threads';

const buttonColors: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  whatsapp: 'bg-green-600 text-white hover:bg-green-700',
  // ...
};
```
