# Markdown Rendering Pipeline

## Overview

The markdown rendering pipeline is the most complex part of the app. It converts GitHub-flavored markdown (project READMEs) into styled HTML with syntax highlighting, math rendering, emoji, alerts, and Mermaid diagrams — all loaded lazily.

```
raw README.md
       |
getConfiguredMarked()   ← singleton, lazy-init
       |
marked.parse(md)        ← with all plugins
       |
custom renderer         ← adds Tailwind classes, resolves relative URLs
       |
HTML string             ← dangerouslySetInnerHTML
       |
Post-processing:
  MutationObserver       ← detects .mermaid divs
       |
  Mermaid (CDN)         ← renders diagrams
```

## Lazy Initialization: `getConfiguredMarked()`

```typescript
async function getConfiguredMarked(readmeBaseUrl: string): Promise<Marked>
```

Singleton pattern — initializes once, returns cached instance.

### Import Chain (Dynamic)

The function dynamically imports all dependencies:

1. **`marked`** — core markdown parser
2. **`marked-highlight`** — plugin: highlight.js integration
3. **`highlight.js`** — syntax highlighting (languages: js, ts, xml, css, bash, shell, json, plaintext, python, php)
4. **`marked-alert`** — plugin: GitHub-style alerts (`> [!NOTE]`, `> [!WARNING]`, etc.)
5. **`marked-emoji`** — plugin: `:emoji:` shortcodes
6. **`@octokit/rest`** — fetches GitHub emoji list for `marked-emoji`
7. **`marked-katex-extension`** — plugin: LaTeX math rendering
8. **`marked-base-url`** — plugin: resolves relative URLs against `readmeBaseUrl`
9. **`marked-mermaid`** — custom plugin: ` ```mermaid ` fenced code blocks

### Configuration Order

```typescript
marked.use(markedHighlight({
  async: true,
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));
marked.use(markedAlert());
marked.use(markedEmoji({ emojis: githubEmojiMap }));
marked.use(markedKatex({ nonStandard: true }));
marked.use(markedMermaid());
// markedBaseUrl applied per-instance in final config
```

### CSS Split

To avoid bundling all highlight.js styles, only the dark theme is imported:

```typescript
import 'highlight.js/styles/github-dark-dimmed.css';
// Imported only in the detail page component, not globally
```

## Custom Renderer

The `marked` renderer is heavily customized to produce Tailwind-styled HTML:

```typescript
const renderer = {
  heading({ text, depth }) {
    const slug = createSlug(text);
    return `<h${depth} id="${slug}" class="heading-${depth}">${text}</h${depth}>`;
  },
  image({ href, text }) {
    const src = resolveRelativeUrl(href, baseUrl);
    return `<img src="${src}" alt="${text}" loading="lazy" />`;
  },
  link({ href, text }) {
    const url = resolveRelativeUrl(href, baseUrl);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  },
  table({ header, rows }) {
    return `<div class="table-wrapper"><table>...</table></div>`;
  },
  codespan({ text }) {
    return `<code class="inline-code">${text}</code>`;
  },
  blockquote({ text }) {
    return `<blockquote class="custom-blockquote">${text}</blockquote>`;
  },
  hr() {
    return `<hr class="custom-hr" />`;
  },
  // ... paragraph, strong, list, listitem, tablecell, html
};
```

**Key responsibilities:**
- Relative URL resolution against `readmeBaseUrl` (images, links)
- Slug generation for heading IDs
- Tailwind utility classes applied to HTML elements
- Wrapper divs for responsive tables

## Marked-Mermaid Plugin

Custom `marked` extension for rendering Mermaid diagrams:

```typescript
const markedMermaid = {
  extensions: [{
    name: 'mermaid',
    level: 'block',
    start(src) { return src.match(/```mermaid\n/)?.index; },
    tokenizer(src) {
      const match = src.match(/^```mermaid\n([\s\S]*?)```\n?/);
      if (match) {
        return {
          type: 'mermaid',
          raw: match[0],
          text: match[1].trim(),
        };
      }
    },
    renderer(token) {
      return `<pre class="mermaid" data-diagram="${encodeURI(token.text)}">${token.text}</pre>`;
    },
  }],
};
```

## Client-Side Mermaid Rendering

Mermaid cannot be prerendered (it needs a browser DOM), so rendering happens client-side:

```typescript
useEffect(() => {
  // Load mermaid from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
  script.onload = () => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });

    // Observe DOM for new .mermaid elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.mermaid[data-processed="false"]').forEach(async (el) => {
        const { svg } = await mermaid.render(el.id, el.textContent!);
        el.innerHTML = svg;
        el.setAttribute('data-processed', 'true');
      });
    });
    observer.observe(markdownContainerRef.current!, { childList: true, subtree: true });

    return () => observer.disconnect();
  };
  document.head.appendChild(script);
}, [markdown]);
```

## KaTeX Preprocessing

GitHub READMEs often use double-backslash escaping (`\\`). The markdown is preprocessed:

```typescript
// Fix GitHub-style double backslash escaping for KaTeX
const preprocessed = rawMarkdown.replace(/\\\\([()\\[\]])/g, '\\$1');
```

## Full Pipeline in React

```typescript
function ProjectDetail({ project, service }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'fetching' | 'rendering' | 'done' | 'error'>('idle');
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('fetching');
      const raw = await service.getReadme(project, fetch);
      if (cancelled || !raw) return;

      setStatus('rendering');
      const configuredMarked = await getConfiguredMarked(project.readmeBaseUrl);
      const preprocessed = raw.replace(/\\\\([()\\[\]])/g, '\\$1');
      const result = await configuredMarked.parse(preprocessed);
      if (cancelled) return;

      setHtml(result);
      setStatus('done');
    }

    load();
    return () => { cancelled = true; };
  }, [project.id]);

  return (
    <div ref={containerRef}>
      <ReadmeStatusIndicator status={status} />
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
}
```

## Vite Chunk Splitting

To keep bundles small, the markdown dependencies are manually chunked:

```typescript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      'markdown': ['highlight.js', 'marked',
        'marked-alert', 'marked-base-url', 'marked-emoji',
        'marked-highlight', 'marked-katex-extension'],
      'vendor': ['react', 'react-dom', 'react-router-dom'],
    },
  },
},
```

This ensures the heavy markdown stack is only loaded when the user navigates to a project detail page.

## Testing

The markdown pipeline has both unit and rendering tests:

- **`renderer.test.ts`** — tests individual renderer overrides (headings, links, images, tables)
- **`marked-mermaid.test.ts`** — tests mermaid tokenizer and renderer
- **Snapshot tests** — verify rendered HTML output against known markdown inputs
