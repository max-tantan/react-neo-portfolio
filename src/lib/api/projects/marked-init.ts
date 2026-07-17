import { createRenderer } from './renderer'

let configuredMarked: { parse: (src: string) => Promise<string> } | null = null

async function createConfiguredMarked(readmeBaseUrl: string) {
  const [
    { Marked },
    { markedHighlight },
    { markedEmoji },
    markedKatexModule,
    { baseUrl },
  ] = await Promise.all([
    import('marked'),
    import('marked-highlight'),
    import('marked-emoji'),
    import('marked-katex-extension'),
    import('marked-base-url'),
  ])

  const hljs = await import('highlight.js')

  const renderer = createRenderer({ baseUrl: readmeBaseUrl })

  const marked = new Marked()

  marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.default.getLanguage(lang) ? lang : 'plaintext'
      return hljs.default.highlight(code, { language }).value
    },
  }))

  marked.use(markedEmoji({ emojis: {} }))

  marked.use(markedKatexModule.default({ nonStandard: true }))

  marked.use(baseUrl(readmeBaseUrl))

  const { markedMermaid } = await import('./marked-mermaid')
  marked.use(markedMermaid)

  marked.use({ renderer })

  return marked
}

export async function getConfiguredMarked(readmeBaseUrl: string) {
  if (!configuredMarked) {
    configuredMarked = (await createConfiguredMarked(readmeBaseUrl)) as unknown as { parse: (src: string) => Promise<string> }
  }
  return configuredMarked
}

export function resetConfiguredMarked() {
  configuredMarked = null
}
