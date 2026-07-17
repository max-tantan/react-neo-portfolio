import type { Project } from '../types'
import type { ProjectRepository, CacheStore } from './types'
import { isDev } from '@/lib/environment'

const STATS_TTL = 3_600_000
const README_TTL = 1_800_000

const DEV_FALLBACK = {
  starsCount: 767,
  forksCount: 67,
  issuesCount: 12,
  pullRequestsCount: 89,
  downloadsCount: 3400,
}

export class CachedRepository implements ProjectRepository {
  private inner: ProjectRepository
  private cache: CacheStore

  constructor(inner: ProjectRepository, cache: CacheStore) {
    this.inner = inner
    this.cache = cache
  }

  async fetchProject(
    project: Project,
    fetch?: typeof globalThis.fetch,
  ): Promise<Project> {
    const cacheKey = `project:${project.id}`

    const cached = this.cache.get<Project>(cacheKey)
    if (cached) return cached

    try {
      const result = await this.inner.fetchProject(project, fetch)
      this.cache.set(cacheKey, result, STATS_TTL)
      return result
    } catch (error) {
      const stale = this.cache.peek<Project>(cacheKey)
      if (stale) return stale

      if (isDev) {
        return { ...project, ...DEV_FALLBACK, statusMessage: 'Dev fallback data' }
      }

      throw error
    }
  }

  async fetchReadme(
    project: Project,
    fetch?: typeof globalThis.fetch,
  ): Promise<string | null> {
    const cacheKey = `readme:${project.id}`

    const cached = this.cache.get<string>(cacheKey)
    if (cached) return cached

    try {
      const result = await this.inner.fetchReadme(project, fetch)
      if (result) {
        this.cache.set(cacheKey, result, README_TTL)
      }
      return result
    } catch {
      const stale = this.cache.peek<string>(cacheKey)
      return stale ?? null
    }
  }
}
