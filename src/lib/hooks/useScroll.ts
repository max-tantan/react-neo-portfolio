import { useState, useEffect, useRef } from 'react'

interface ScrollState {
  scrollY: number
  direction: 'up' | 'down'
}

export function useScroll(): ScrollState {
  const [scrollY, setScrollY] = useState(0)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY
      setDirection(current > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = current
      setScrollY(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, direction }
}
