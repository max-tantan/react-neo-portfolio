import { useEffect, useRef } from 'react'
import { useProjectStore } from '@/lib/api/projects/store'
import { ProjectService } from '@/lib/api/projects/service'
import { CachedRepository } from '@/lib/api/projects/repository/cached'
import { GitHubRepository } from '@/lib/api/projects/repository/github'
import { LocalStorageCache } from '@/lib/api/projects/repository/cache'

export default function HomePage() {
  const { loading, error } = useProjectStore()
  const serviceRef = useRef<ProjectService | null>(null)

  useEffect(() => {
    const cacheStore = new LocalStorageCache('project:', '1')
    const repo = new CachedRepository(new GitHubRepository(), cacheStore)
    const service = new ProjectService(repo)
    service.setStore(useProjectStore.getState())
    serviceRef.current = service

    service.init()

    return () => {
      serviceRef.current = null
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Sections will be composed in Phase 6 */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-5xl md:text-7xl mb-4">
            Fatan Ala
          </h1>
          <p className="text-lg text-custom-3">Developer &amp; Problem Solver</p>
          {loading && (
            <p className="text-sm text-custom-3 mt-4">Loading projects...</p>
          )}
        </div>
      </section>
    </>
  )
}
