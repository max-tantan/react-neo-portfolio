import { useInView } from '@/lib/hooks/useInView'
import { toolsData } from '@/lib/api/tools/tools'

export default function Tools() {
  const { ref: headingRef, isInView: headingVisible } = useInView({ once: true })
  const { ref: gridRef, isInView: gridVisible } = useInView({ once: true })

  return (
    <section id="tools" className="py-20 bg-custom-4/30 dark:bg-custom-2/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          ref={headingRef}
          className={`font-heading text-3xl mb-8 text-center transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Tools &amp; Technologies
        </h2>

        <div
          ref={gridRef}
          className={`grid md:grid-cols-3 gap-8 transition-all duration-700 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {toolsData.map(category => (
            <div key={category.name}>
              <h3 className="font-heading text-lg mb-4 text-primary">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.tools.map(tool => (
                  <span
                    key={tool.name}
                    className="px-3 py-1.5 rounded-full border border-custom-4 dark:border-custom-2 text-sm hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {toolsData.length === 0 && (
            <div className="col-span-full text-center py-16 text-custom-3">
              No tools to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
