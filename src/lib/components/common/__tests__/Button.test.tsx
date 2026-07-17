import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders as link when href is provided', () => {
    render(<Button href="https://example.com">Link</Button>)
    const link = screen.getByText('Link')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('renders as button by default', () => {
    render(<Button>Button</Button>)
    const btn = screen.getByText('Button')
    expect(btn.tagName).toBe('BUTTON')
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disables button when variant is disabled', () => {
    render(<Button variant="disabled">Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
