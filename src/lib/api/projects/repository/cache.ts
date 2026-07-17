import type { CacheStore } from './types'
import { isLocalStorageAvailable } from '@/lib/environment'

interface CacheEntry {
  version: string
  data: unknown
  expiry: number | null
}

export class LocalStorageCache implements CacheStore {
  private memoryCache = new Map<string, CacheEntry>()
  private lsAvailable = isLocalStorageAvailable()
  private prefix: string
  private version: string

  constructor(prefix = 'project:', version = '1') {
    this.prefix = prefix
    this.version = version
  }

  private buildKey(key: string): string {
    return `${this.prefix}${this.version}:${key}`
  }

  get<T>(key: string): T | null {
    const cacheKey = this.buildKey(key)

    const entry = this.memoryCache.get(cacheKey) ?? this.readStorage(cacheKey) as CacheEntry | null
    if (!entry) return null

    if (entry.version !== this.version) {
      this.remove(key)
      return null
    }

    if (entry.expiry !== null && Date.now() > entry.expiry) {
      this.remove(key)
      return null
    }

    return entry.data as T
  }

  peek<T>(key: string): T | null {
    const cacheKey = this.buildKey(key)

    const entry = this.memoryCache.get(cacheKey) ?? this.readStorage(cacheKey) as CacheEntry | null
    if (!entry) return null

    return entry.data as T
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const cacheKey = this.buildKey(key)
    const entry: CacheEntry = {
      version: this.version,
      data: value,
      expiry: ttlMs ? Date.now() + ttlMs : null,
    }

    this.memoryCache.set(cacheKey, entry)

    if (this.lsAvailable) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry))
      } catch {
        if (this.isQuotaExceededError()) {
          this.evictOldest()
          try {
            localStorage.setItem(cacheKey, JSON.stringify(entry))
          } catch {}
        }
      }
    }
  }

  remove(key: string): void {
    const cacheKey = this.buildKey(key)
    this.memoryCache.delete(cacheKey)
    if (this.lsAvailable) {
      localStorage.removeItem(cacheKey)
    }
  }

  clear(): void {
    this.memoryCache.clear()
    if (this.lsAvailable) {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k?.startsWith(this.prefix)) {
          keysToRemove.push(k)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
    }
  }

  private readStorage(cacheKey: string): CacheEntry | null {
    if (!this.lsAvailable) return null
    try {
      const raw = localStorage.getItem(cacheKey)
      if (!raw) return null
      const entry = JSON.parse(raw) as CacheEntry
      this.memoryCache.set(cacheKey, entry)
      return entry
    } catch {
      return null
    }
  }

  private isQuotaExceededError(): boolean {
    return true
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(this.prefix)) {
        const raw = localStorage.getItem(k)
        if (raw) {
          try {
            const entry = JSON.parse(raw) as CacheEntry
            const time = entry.expiry ?? Date.now()
            if (time < oldestTime) {
              oldestTime = time
              oldestKey = k
            }
          } catch {}
        }
      }
    }

    if (oldestKey) {
      localStorage.removeItem(oldestKey)
      this.memoryCache.delete(oldestKey)
    }
  }
}
