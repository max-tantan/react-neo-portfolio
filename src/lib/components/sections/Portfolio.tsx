import { useProjectStore } from '@/lib/api/projects/store'
import { useStaggered } from '@/lib/hooks/useStaggered'
import ProjectCard from '../common/ProjectCard'
import ProjectCardLoading from '../common/ProjectCardLoading'
import ProjectCardError from '../common/ProjectCardError'
import { useInView } from '@/lib/hooks/useInView'

export default function Portfolio() {
  const { projects, loading, error } = useProjectStore()
  const { containerRef, visibleItems } = useStaggered(projects.length, {
    interval: 100,
    delay: 200,
  })
  const { ref: headingRef, isInView: headingVisible } = useInView({ once: true })

  return (
    <section id="portfolio" className="py-20 bg-custom-4/30 dark:bg-custom-2/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          ref={headingRef}
          className={`font-heading text-3xl mb-8 text-center transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Projects
        </h2>

        {error && (
          <div className="text-center mb-8">
            <ProjectCardError message={error} />
          </div>
        )}

        <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          {!loading && projects.length === 0 && !error && (
            <div className="col-span-full text-center py-16 text-custom-3">
              No projects to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
