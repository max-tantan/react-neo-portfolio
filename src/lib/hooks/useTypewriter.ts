import { useState, useEffect, useRef } from 'react'

interface TypewriterOptions {
  speed?: number
  delay?: number
  loop?: boolean
}

export function useTypewriter(
  texts: string[],
  options: TypewriterOptions = {},
) {
  const { speed = 80, delay = 2000, loop = false } = options
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const textIndex = useRef(0)
  const charIndex = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!texts.length) return

    function type() {
      const currentText = texts[textIndex.current]

      if (charIndex.current < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex.current + 1))
        charIndex.current++
        timeoutRef.current = setTimeout(type, speed)
      } else {
        setIsComplete(true)
        timeoutRef.current = setTimeout(() => {
          setIsComplete(false)
          charIndex.current = 0
          textIndex.current++

          if (textIndex.current >= texts.length) {
            if (loop) {
              textIndex.current = 0
            } else {
              return
            }
          }

          timeoutRef.current = setTimeout(type, speed)
        }, delay)
      }
    }

    timeoutRef.current = setTimeout(type, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [texts, speed, delay, loop])

  return { displayText, isComplete }
}
