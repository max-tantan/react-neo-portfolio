import { useProjectStore } from '@/lib/api/projects/store'
import { useStaggered } from '@/lib/hooks/useStaggered'
import ProjectCard from '../common/ProjectCard'
import ProjectCardLoading from '../common/ProjectCardLoading'
import ProjectCardError from '../common/ProjectCardError'

export default function Portfolio() {
  const { projects, loading, error } = useProjectStore()
  const { containerRef, visibleItems } = useStaggered(projects.length, {
    interval: 100,
    delay: 200,
  })

  return (
    <section id="portfolio" className="py-20 bg-custom-4/30 dark:bg-custom-2/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl mb-8 text-center">Projects</h2>

        {error && (
          <div className="text-center mb-8">
            <ProjectCardError message={error} />
          </div>
        )}

        <div
          ref={containerRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardLoading key={i} />
              ))
            : projects.map((project, i) => (
                <div
                  key={project.id}
                  className={
                    visibleItems[i]
                      ? 'card-enter'
                      : 'opacity-0'
                  }
                  style={{
                    animationDelay: visibleItems[i] ? `${i * 100}ms` : undefined,
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
