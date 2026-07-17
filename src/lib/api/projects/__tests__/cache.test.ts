import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageCache } from '../repository/cache'

describe('LocalStorageCache', () => {
  let cache: LocalStorageCache

  beforeEach(() => {
    localStorage.clear()
    cache = new LocalStorageCache('test:', '1')
  })

  it('stores and retrieves values', () => {
    cache.set('key1', { hello: 'world' })
    expect(cache.get('key1')).toEqual({ hello: 'world' })
  })

  it('returns null for missing keys', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  it('respects TTL expiry', () => {
    cache.set('key1', 'value', -1)
    expect(cache.get('key1')).toBeNull()
  })

  it('returns stale data via peek when expired', () => {
    cache.set('key1', 'value', -1)
    expect(cache.peek('key1')).toBe('value')
  })

  it('get returns null for expired entry', () => {
    cache.set('key1', 'value', -1)
    expect(cache.get('key1')).toBeNull()
  })

  it('removes values', () => {
    cache.set('key1', 'value')
    cache.remove('key1')
    expect(cache.get('key1')).toBeNull()
  })

  it('clears all values with prefix', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.clear()
    expect(cache.get('a')).toBeNull()
    expect(cache.get('b')).toBeNull()
  })

  it('busts cache on version change', () => {
    cache.set('key', 'old')
    const newCache = new LocalStorageCache('test:', '2')
    expect(newCache.get('key')).toBeNull()
  })

  it('persists to localStorage', () => {
    cache.set('persist', 'stored')
    const raw = localStorage.getItem('test:1:persist')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.data).toBe('stored')
  })
})
