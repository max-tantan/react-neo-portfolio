import type { Project } from '../types'
import type { ProjectRepository } from './types'

interface RepoBase {
  repoData: Record<string, unknown>
  downloadCount: number
  prCount: number
}

export class GitHubRepository implements ProjectRepository {
  async fetchProject(
    project: Project,
    fetchFn = globalThis.fetch,
  ): Promise<Project> {
    const { repoData, downloadCount, prCount } = await this.fetchRepoBase(project, fetchFn)

    const result: Project = {
      ...project,
      starsCount: (repoData.stargazers_count as number) ?? 0,
      forksCount: (repoData.forks_count as number) ?? 0,
      issuesCount: (repoData.open_issues_count as number) ?? 0,
      pullRequestsCount: prCount,
      downloadsCount: downloadCount,
      repositoryUrl: (repoData.html_url as string) ?? project.url,
    }

    const language = repoData.language as string | null
    if (language && !result.tags.includes(language)) {
      result.tags = [...result.tags, language]
    }

    return result
  }

  async fetchReadme(
    project: Project,
    fetchFn = globalThis.fetch,
  ): Promise<string | null> {
    if (!project.readmeUrl) return null

    try {
      const response = await this.fetchWithRetry(() => fetchFn(project.readmeUrl!))
      if (!response.ok) return null
      return await response.text()
    } catch {
      return null
    }
  }

  private async fetchRepoBase(
    project: Project,
    fetchFn: typeof globalThis.fetch,
  ): Promise<RepoBase> {
    const repoResponse = await this.fetchWithRetry(() => fetchFn(project.url))
    const repoData = await repoResponse.json()

    const downloadCount = await this.fetchDownloadCount(project, fetchFn)
    const prCount = await this.fetchPRCount(project, fetchFn)

    return { repoData, downloadCount, prCount }
  }

  private async fetchDownloadCount(
    project: Project,
    fetchFn: typeof globalThis.fetch,
  ): Promise<number> {
    try {
      const response = await this.fetchWithRetry(
        () => fetchFn(`${project.url}/releases?per_page=100`),
      )
      if (!response.ok) return 0

      const releases: { assets: { download_count: number }[] }[] = await response.json()
      return releases.reduce(
        (sum, release) =>
          sum + release.assets.reduce((s, a) => s + a.download_count, 0),
        0,
      )
    } catch {
      return 0
    }
  }

  private async fetchPRCount(
    project: Project,
    fetchFn: typeof globalThis.fetch,
  ): Promise<number> {
    try {
      const response = await this.fetchWithRetry(
        () => fetchFn(`${project.url}/pulls?state=all&per_page=1`),
        { maxRetries: 2 },
      )
      if (!response.ok) return 0

      const linkHeader = response.headers.get('Link')
      if (!linkHeader) return 0

      const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
      return lastMatch ? Number(lastMatch[1]) : 0
    } catch {
      return 0
    }
  }

  private async fetchWithRetry(
    fn: () => Promise<Response>,
    options?: { maxRetries?: number; baseDelay?: number },
  ): Promise<Response> {
    const maxRetries = options?.maxRetries ?? 3
    const baseDelay = options?.baseDelay ?? 1000

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fn()
      if (response.ok) return response

      if (attempt < maxRetries && (response.status === 429 || response.status === 403)) {
        const delay = baseDelay * 2 ** attempt
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      return response
    }

    throw new Error(`Failed after ${maxRetries} retries`)
  }
}
