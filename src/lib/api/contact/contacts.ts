export interface Contact {
  label: string
  value: string
  href: string
  variant: string
}

export const contactsData: Contact[] = [
  {
    label: 'Email',
    value: 'hello@example.com',
    href: 'mailto:hello@example.com',
    variant: 'email',
  },
  {
    label: 'WhatsApp',
    value: '+62 812 3456 7890',
    href: 'https://wa.me/6281234567890',
    variant: 'whatsapp',
  },
  {
    label: 'GitHub',
    value: '@fatanala',
    href: 'https://github.com/fatanala',
    variant: 'github',
  },
]
