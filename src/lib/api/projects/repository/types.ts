import type { Project } from '../types'

export interface ProjectRepository {
  fetchProject(
    project: Project,
    fetch?: typeof globalThis.fetch
  ): Promise<Project>

  fetchReadme(
    project: Project,
    fetch?: typeof globalThis.fetch
  ): Promise<string | null>
}

export interface CacheStore {
  get<T>(key: string): T | null
  peek<T>(key: string): T | null
  set<T>(key: string, value: T, ttlMs?: number): void
  remove(key: string): void
  clear(): void
}
