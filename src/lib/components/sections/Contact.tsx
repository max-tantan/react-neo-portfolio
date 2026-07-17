import { useState } from 'react'
import { contactsData } from '@/lib/api/contact/contacts'
import { sendContactForm } from '@/lib/api/contact/service'
import Button from '../common/Button'
import Wrapper from '../common/Wrapper'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return

    setSending(true)
    const ok = await sendContactForm({ name, email, message })
    setSending(false)

    if (ok) {
      setSent(true)
      setName('')
      setEmail('')
      setMessage('')
    }
  }

  return (
    <section id="contact" className="py-20 bg-custom-4/30 dark:bg-custom-2/30">
      <Wrapper>
        <h2 className="font-heading text-3xl mb-8 text-center">Get In Touch</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {contactsData.map(contact => (
            <Button
              key={contact.label}
              href={contact.href}
              variant={contact.variant as never}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.label}
            </Button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto space-y-4"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-4 dark:border-custom-2 bg-white dark:bg-custom-1 focus:outline-none focus:border-primary transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-4 dark:border-custom-2 bg-white dark:bg-custom-1 focus:outline-none focus:border-primary transition-colors"
            required
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-4 dark:border-custom-2 bg-white dark:bg-custom-1 focus:outline-none focus:border-primary transition-colors resize-none"
            required
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={sending || !name || !email || !message}
          >
            {sending ? 'Sending...' : sent ? 'Sent!' : 'Send Message'}
          </Button>
        </form>
      </Wrapper>
    </section>
  )
}
