export interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function sendContactForm(data: ContactFormData): Promise<boolean> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.ok
  } catch {
    return false
  }
}
