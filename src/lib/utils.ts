export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function resolveRelativeUrl(href: string, baseUrl: string): string {
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('data:')) {
    return href
  }
  return `${baseUrl.replace(/\/+$/, '')}/${href.replace(/^\/+/, '')}`
}
