import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('toggles dark class on document', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await userEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await userEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists theme to localStorage', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    await userEvent.click(button)
    expect(localStorage.getItem('theme')).toBe('dark')

    await userEvent.click(button)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
