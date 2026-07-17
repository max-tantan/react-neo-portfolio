import type { ProjectRepository } from './repository/types'
import type { Project } from './types'
import { initialProjects } from './projects'
import type { ProjectStore } from './store'

export class ProjectService {
  private repo: ProjectRepository
  private store: ProjectStore | null = null

  constructor(repo: ProjectRepository) {
    this.repo = repo
  }

  setStore(store: ProjectStore): void {
    this.store = store
  }

  async init(fetch?: typeof globalThis.fetch): Promise<void> {
    if (!this.store) return

    this.store.setLoading(true)
    this.store.setError(null)

    const results = await Promise.allSettled(
      initialProjects.map(p => this.repo.fetchProject(p, fetch)),
    )

    const projects: Project[] = []
    for (const result of results) {
      if (result.status === 'fulfilled') {
        projects.push(result.value)
      }
    }

    this.store.setProjects(projects)

    if (projects.length === 0) {
      this.store.setError('Failed to load projects')
    }

    this.store.setLoading(false)
  }

  async openDetail(
    project: Project,
    fetch?: typeof globalThis.fetch,
  ): Promise<void> {
    if (!this.store) return

    this.store.setDetailLoading(true)
    this.store.setDetailError(null)
    this.store.setProjectDetail(null)

    try {
      const enriched = await this.repo.fetchProject(project, fetch)
      this.store.setProjectDetail(enriched)
    } catch {
      this.store.setProjectDetail(project)
      this.store.setDetailError('Failed to fetch live data')
    }

    this.store.setDetailLoading(false)
  }

  async getReadme(
    project: Project,
    fetch?: typeof globalThis.fetch,
  ): Promise<string | null> {
    return this.repo.fetchReadme(project, fetch)
  }
}
