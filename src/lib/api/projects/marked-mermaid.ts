export const markedMermaid = {
  extensions: [
    {
      name: 'mermaid',
      level: 'block' as const,
      start(src: string) {
        return src.match(/^```mermaid\n/)?.index
      },
      tokenizer(src: string) {
        const match = src.match(/^```mermaid\n([\s\S]*?)```\n?/)
        if (match) {
          return {
            type: 'mermaid',
            raw: match[0],
            text: match[1].trim(),
            tokens: [],
          }
        }
      },
      renderer(token: { text: string }) {
        const encoded = encodeURIComponent(token.text)
        return `<pre class="mermaid" data-diagram="${encoded}">${token.text}</pre>`
      },
    },
  ],
}
