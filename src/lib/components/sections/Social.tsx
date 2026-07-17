import { socialsData } from '@/lib/api/socials/socials'
import Button from '../common/Button'

export default function Social() {
  return (
    <section id="social" className="py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl mb-8">Connect With Me</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {socialsData.map(social => (
            <Button
              key={social.label}
              href={social.url}
              variant={social.variant as never}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
