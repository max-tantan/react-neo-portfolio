# Styling & Theming

## Stack

- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, NOT PostCSS)
- **No `tailwind.config.js`** — all customization in `src/index.css` via `@theme` block
- **Dark mode** via class-based strategy

## Tailwind v4 Entry Point

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --font-heading: 'Cascadia Mono', monospace;
  --font-body: 'Space Grotesk', sans-serif;
  --font-mechsuit: 'Mechsuit', sans-serif;
  --font-angeles: 'Angeles', sans-serif;

  --color-text: #0f0f0f;
  --color-background: #f5f5f5;
  --color-primary: #f59e0b;
  --color-secondary: #1d4ed8;
  --color-accent: #d97706;
  --color-custom-1: #171717;
  --color-custom-2: #262626;
  --color-custom-3: #d4d4d4;
  --color-custom-4: #e5e5e5;
}

@custom-variant dark (&:where(.dark, .dark *));

@font-face {
  font-family: 'Mechsuit';
  src: url('/fonts/Mechsuit.woff2') format('woff2');
}

@font-face {
  font-family: 'Angeles';
  src: url('/fonts/ANGELES.woff2') format('woff2');
}
```

## Dark Mode Architecture

### Strategy: Class-based with localStorage persistence

```typescript
// ThemeToggle.tsx
function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

### FOUC Prevention

To prevent flash of unstyled content, inject an inline script in `index.html`:

```html
<!-- index.html -->
<script>
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

## Font Strategy

| Font | Usage | Source |
|------|-------|--------|
| Cascadia Mono | Headings | `@fontsource/cascadia-mono` (npm) |
| Space Grotesk | Body text | `@fontsource/space-grotesk` (npm) |
| Mechsuit | Logo/emblem | `/fonts/Mechsuit.woff2` (static asset) |
| Angeles | Decorative | `/fonts/ANGELES.woff2` (static asset) |

Import fonts in `index.css`:

```css
@import "@fontsource/cascadia-mono";
@import "@fontsource/space-grotesk";
```

## Custom Utilities

```css
/* Text stroke effect */
.text-stroke {
  -webkit-text-stroke: 1px currentColor;
}

/* Halftone dot pattern background */
.bg-halftone {
  background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 4px 4px;
}
```

## Animation System

### Keyframes

```css
@keyframes scale-up-center {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### CSS Marquee

```css
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  animation: marquee 15s linear infinite;
}
```

### Staggered Card Entrance

Instead of Svelte transitions, use CSS animations with `animation-delay`:

```css
.card-enter {
  animation: scale-up-center 367ms ease-out both;
}

.card-enter:nth-child(1) { animation-delay: 0ms; }
.card-enter:nth-child(2) { animation-delay: 100ms; }
/* ...generated dynamically via inline style */
```

## Component-Level Styling

All styling uses Tailwind utility classes directly in JSX:

```tsx
function Button({ variant, children, ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:opacity-90',
    whatsapp: 'bg-green-600 text-white hover:bg-green-700',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
    // ...18 variants
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
```

No CSS modules or styled-components — the project uses Tailwind exclusively.

## Responsive Design

Breakpoints follow Tailwind v4 defaults:

| Breakpoint | Min Width |
|-----------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Layout shifts from stacked (mobile) to grid (desktop) for portfolio, tools, and achievements sections. Navbar collapses to hamburger menu below `lg`.

## Transition Patterns

| Element | Transition | Trigger |
|---------|-----------|---------|
| Navbar background | `bg-opacity 300ms` | Scroll depth |
| Navbar visibility | `translate-y 300ms` | Scroll direction (hide down, show up) |
| Theme toggle | `rotate 300ms` | Click |
| Project cards | `scale 367ms` staggered | Scroll into view (IntersectionObserver) |
| Stats counter | Animated number count | Card mount |
| Back-to-top button | `opacity 200ms` | Scroll position >= 400px |
