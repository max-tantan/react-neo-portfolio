import { useInView } from '@/lib/hooks/useInView'
import { toolsData } from '@/lib/api/tools/tools'

export default function Tools() {
  const { ref, isInView } = useInView({ once: true })

  return (
    <section id="tools" className="py-20 bg-custom-4/30 dark:bg-custom-2/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl mb-8 text-center">Tools &amp; Technologies</h2>

        <div
          ref={ref}
          className={`grid md:grid-cols-3 gap-8 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
                    className="px-3 py-1.5 rounded-full border border-custom-4 dark:border-custom-2 text-sm hover:border-primary transition-colors"
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
