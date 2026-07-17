import { useTypewriter } from '@/lib/hooks/useTypewriter'

const roles = [
  'Full-Stack Developer',
  'Open Source Enthusiast',
  'Problem Solver',
]

export default function Hero() {
  const { displayText } = useTypewriter(roles, { speed: 70, delay: 2000, loop: true })

  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="text-center px-4">
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl mb-4 text-stroke">
          Fatan Ala
        </h1>
        <p className="text-lg md:text-xl text-custom-3 h-8">
          {displayText}
          <span className="animate-pulse">|</span>
        </p>
        <a
          href="#portfolio"
          className="mt-8 inline-block px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          View My Work
        </a>
      </div>
    </section>
  )
}
