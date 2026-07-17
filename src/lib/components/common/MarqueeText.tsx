import type { ReactNode } from 'react'

interface MarqueeTextProps {
  children: ReactNode
  duration?: number
  repeat?: number
  direction?: 'left' | 'right'
  paused?: boolean
}

export default function MarqueeText({
  children,
  duration = 15,
  repeat = 2,
  direction = 'left',
  paused = false,
}: MarqueeTextProps) {
  const animationDuration = `${duration}s`
  const animationPlayState = paused ? 'paused' : 'running'

  return (
    <div className="marquee-container">
      <div
        className="marquee-content"
        style={{
          animationDuration,
          animationPlayState,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i}>{children}</span>
        ))}
      </div>
    </div>
  )
}
