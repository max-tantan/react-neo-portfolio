import { useScroll } from '@/lib/hooks/useScroll'
import { navLinks } from '@/lib/config'
import ThemeToggle from '../common/ThemeToggle'
import Emblem from '../graphics/Emblem'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { scrollY, direction } = useScroll()
  const [mobileOpen, setMobileOpen] = useState(false)
  const hidden = direction === 'down' && scrollY > 100
  const scrolled = scrollY > 50

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0',
        scrolled
          ? 'bg-background/90 dark:bg-custom-1/90 backdrop-blur-sm shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 font-heading text-lg">
          <Emblem size={32} />
          <span className="hidden sm:inline">Fatan Ala</span>
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-custom-3 hover:text-text transition-colors"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-text"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background dark:bg-custom-1 border-t border-custom-4 dark:border-custom-2">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-custom-3 hover:text-text transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
