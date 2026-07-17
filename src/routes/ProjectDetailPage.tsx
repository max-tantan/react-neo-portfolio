import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { initialProjects } from '@/lib/api/projects/projects'
import { useProjectStore } from '@/lib/api/projects/store'
import { ProjectService } from '@/lib/api/projects/service'
import { CachedRepository } from '@/lib/api/projects/repository/cached'
import { GitHubRepository } from '@/lib/api/projects/repository/github'
import { LocalStorageCache } from '@/lib/api/projects/repository/cache'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const project = initialProjects.find(p => p.id === projectId)
  const { projectDetail, detailLoading, detailError } = useProjectStore()
  const serviceRef = useRef<ProjectService | null>(null)

  useEffect(() => {
    if (!project) {
      navigate('/not-found', { replace: true })
      return
    }

    const cacheStore = new LocalStorageCache('project:', '1')
    const repo = new CachedRepository(new GitHubRepository(), cacheStore)
    const service = new ProjectService(repo)
    service.setStore(useProjectStore.getState())
    serviceRef.current = service

    service.openDetail(project)

    return () => {
      const store = useProjectStore.getState()
      store.setProjectDetail(null)
      store.setDetailLoading(false)
      store.setDetailError(null)
      serviceRef.current = null
    }
  }, [projectId, project, navigate])

  if (!project) return null

  if (detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-custom-4 rounded" />
          <div className="h-4 w-48 bg-custom-4 rounded" />
        </div>
      </div>
    )
  }

  if (detailError) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">{detailError}</p>
        <p className="text-custom-3">{project.name}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 text-sm text-custom-3 hover:text-text transition-colors"
      >
        &larr; Back
      </button>
      {projectDetail && (
        <div>
          <h1 className="font-heading text-3xl mb-2">{projectDetail.name}</h1>
          <p className="text-custom-3 mb-4">{projectDetail.description}</p>
          <p className="text-sm">
            Stars: {projectDetail.starsCount ?? '-'} | Forks:{' '}
            {projectDetail.forksCount ?? '-'} | Downloads:{' '}
            {projectDetail.downloadsCount ?? '-'}
          </p>
        </div>
      )}
    </div>
  )
}
