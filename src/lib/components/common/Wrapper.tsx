import type { ReactNode } from 'react'

interface WrapperProps {
  children: ReactNode
  className?: string
}

export default function Wrapper({ children, className = '' }: WrapperProps) {
  return (
    <div className={`max-w-6xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  )
}
