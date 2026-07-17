export const isBrowser = typeof window !== 'undefined'

export const isDev = import.meta.env.DEV

export const isProd = import.meta.env.PROD

export function isLocalStorageAvailable(): boolean {
  if (!isBrowser) return false
  try {
    const key = '__test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
