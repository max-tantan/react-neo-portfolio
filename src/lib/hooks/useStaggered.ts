import { useState, useEffect, useRef, useCallback } from 'react'

interface StaggeredOptions {
  interval?: number
  delay?: number
  once?: boolean
}

export function useStaggered(
  itemCount: number,
  options: StaggeredOptions = {},
) {
  const { interval = 100, delay = 0, once = true } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<boolean[]>(() =>
    Array(itemCount).fill(false),
  )

  const revealNext = useCallback(() => {
    setVisibleItems(prev => {
      const idx = prev.findIndex(v => !v)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = true
      return next
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTimeout = setTimeout(() => {
            revealNext()
            const intervalId = setInterval(() => {
              revealNext()
            }, interval)

            const totalTimeout = setTimeout(() => {
              clearInterval(intervalId)
            }, interval * itemCount)

            return () => {
              clearTimeout(startTimeout)
              clearTimeout(totalTimeout)
              clearInterval(intervalId)
            }
          }, delay)

          if (once) {
            observer.disconnect()
          }
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [itemCount, interval, delay, once, revealNext])

  return { containerRef, visibleItems }
}
