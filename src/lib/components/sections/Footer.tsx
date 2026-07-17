import { siteConfig, navLinks } from '@/lib/config'
import { socialsData } from '@/lib/api/socials/socials'
import Emblem from '../graphics/Emblem'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-custom-4 dark:border-custom-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Emblem size={32} />
            <span className="font-heading text-lg">{siteConfig.author}</span>
          </div>

          <div className="flex gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-custom-3 hover:text-text transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            {socialsData.map(social => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-custom-3 hover:text-text transition-colors"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-custom-3 mt-8">
          {siteConfig.copyright}
        </p>
      </div>
    </footer>
  )
}
