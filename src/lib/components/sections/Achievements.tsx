import { useInView } from '@/lib/hooks/useInView'
import { achievementsData } from '@/lib/api/achievements/achievements'

export default function Achievements() {
  const { ref: headingRef, isInView: headingVisible } = useInView({ once: true })
  const { ref: gridRef, isInView: gridVisible } = useInView({ once: true })

  return (
    <section id="achievements" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          ref={headingRef}
          className={`font-heading text-3xl mb-8 text-center transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Achievements
        </h2>

        <div
          ref={gridRef}
          className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {achievementsData.map((item, i) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-custom-4 dark:border-custom-2 bg-white dark:bg-custom-1 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-custom-3 mb-2">{item.description}</p>
              {item.date && (
                <span className="text-xs text-primary">{item.date}</span>
              )}
            </div>
          ))}
          {achievementsData.length === 0 && (
            <div className="col-span-full text-center py-16 text-custom-3">
              No achievements to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
