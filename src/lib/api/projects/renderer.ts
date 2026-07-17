import { createSlug, resolveRelativeUrl } from '@/lib/utils'

interface RendererOptions {
  baseUrl: string
}

export function createRenderer(options: RendererOptions) {
  const { baseUrl } = options

  const heading = (token: { text: string; depth: number }) => {
    const slug = createSlug(token.text)
    const sizes: Record<number, string> = {
      1: 'text-3xl',
      2: 'text-2xl',
      3: 'text-xl',
    }
    const cls = ['font-heading font-bold mt-8 mb-4', sizes[token.depth] ?? '']
      .filter(Boolean)
      .join(' ')

    return `<h${token.depth} id="${slug}" class="${cls}">${token.text}</h${token.depth}>`
  }

  const paragraph = (token: { text: string }) => {
    return `<p class="mb-4 leading-relaxed">${token.text}</p>`
  }

  const image = (token: { href: string; text: string }) => {
    const src = resolveRelativeUrl(token.href, baseUrl)
    return `<img src="${src}" alt="${token.text}" loading="lazy" class="rounded-lg my-4 max-w-full" />`
  }

  const link = (token: { href: string; text: string }) => {
    const url = resolveRelativeUrl(token.href, baseUrl)
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${token.text}</a>`
  }

  const codespan = (token: { text: string }) => {
    return `<code class="px-1.5 py-0.5 rounded text-sm bg-custom-4 dark:bg-custom-2 font-mono">${token.text}</code>`
  }

  const blockquote = (token: { text: string }) => {
    return `<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-custom-3">${token.text}</blockquote>`
  }

  const hr = () => {
    return `<hr class="my-8 border-custom-4 dark:border-custom-2" />`
  }

  const strong = (token: { text: string }) => {
    return `<strong class="font-bold">${token.text}</strong>`
  }

  return {
    heading,
    paragraph,
    image,
    link,
    codespan,
    blockquote,
    hr,
    strong,
  }
}
