import { useInView } from '@/lib/hooks/useInView'
import { aboutData } from '@/lib/api/about/about'
import PhotoCard from '../common/PhotoCard'
import MarqueeText from '../common/MarqueeText'

export default function About() {
  const { ref, isInView } = useInView({ once: true })

  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading text-3xl mb-8 text-center">About Me</h2>

        <div
          ref={ref}
          className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {aboutData.map(item => (
            <PhotoCard key={item.title} {...item} />
          ))}
        </div>

        <MarqueeText>
          <span className="mx-8 text-lg font-heading">
            TypeScript &bull; React &bull; Node.js &bull; Tailwind &bull; PostgreSQL &bull; Git &bull;
          </span>
        </MarqueeText>
      </div>
    </section>
  )
}
