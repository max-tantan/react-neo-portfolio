import { useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { initialProjects } from '@/lib/api/projects/projects'
import { useProjectStore } from '@/lib/api/projects/store'
import { ProjectService } from '@/lib/api/projects/service'
import { CachedRepository } from '@/lib/api/projects/repository/cached'
import { GitHubRepository } from '@/lib/api/projects/repository/github'
import { LocalStorageCache } from '@/lib/api/projects/repository/cache'
import ProjectDetail from '@/lib/components/project-detail/ProjectDetail'
import ProjectDetailLoading from '@/lib/components/project-detail/ProjectDetailLoading'
import ProjectDetailError from '@/lib/components/project-detail/ProjectDetailError'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const store = useProjectStore()
  const serviceRef = useRef<ProjectService | null>(null)

  const project = initialProjects.find(p => p.id === projectId)

  const initService = useCallback(() => {
    const cacheStore = new LocalStorageCache('project:', '1')
    const repo = new CachedRepository(new GitHubRepository(), cacheStore)
    const service = new ProjectService(repo)
    service.setStore(useProjectStore.getState())
    serviceRef.current = service
    return service
  }, [])

  useEffect(() => {
    if (!project) {
      navigate('/not-found', { replace: true })
      return
    }

    const service = initService()
    service.openDetail(project)

    return () => {
      store.setProjectDetail(null)
      store.setDetailLoading(false)
      store.setDetailError(null)
      serviceRef.current = null
    }
  }, [projectId, project, navigate, initService, store])

  if (!project) return null

  if (store.detailLoading) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-sm text-custom-3 hover:text-text transition-colors"
        >
          &larr; Back
        </button>
        <ProjectDetailLoading />
      </div>
    )
  }

  if (store.detailError) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-sm text-custom-3 hover:text-text transition-colors"
        >
          &larr; Back
        </button>
        <ProjectDetailError
          project={project}
          error={store.detailError ?? undefined}
          onRetry={() => {
            const service = initService()
            service.openDetail(project)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-8 text-sm text-custom-3 hover:text-text transition-colors"
      >
        &larr; Back
      </button>
      {store.projectDetail && serviceRef.current && (
        <ProjectDetail project={store.projectDetail} service={serviceRef.current} />
      )}
    </div>
  )
}
