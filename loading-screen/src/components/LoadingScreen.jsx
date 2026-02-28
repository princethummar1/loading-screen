import { useState, useEffect, useRef, forwardRef } from 'react'
import gsap from 'gsap'
import './LoadingScreen.css'

const LoadingScreen = forwardRef(({ onComplete }, ref) => {
  const [percentage, setPercentage] = useState(0)
  const containerRef = useRef(null)

  // Expose the container ref to parent
  useEffect(() => {
    if (ref) {
      ref.current = containerRef.current
    }
  }, [ref])

  useEffect(() => {
    const duration = 2500 // ~2.5 seconds
    const steps = 100
    const intervalTime = duration / steps

    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, intervalTime)

    return () => clearInterval(interval)
  }, [])

  // Trigger exit animation when percentage reaches 100
  useEffect(() => {
    if (percentage === 100) {
      // Small delay before exit animation
      const timeout = setTimeout(() => {
        gsap.to(containerRef.current, {
          y: '-100%',
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            if (onComplete) onComplete()
          }
        })
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [percentage, onComplete])

  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="percentage-container">
        <span className="percentage-number">{percentage}</span>
        <span className="percentage-symbol">%</span>
      </div>
    </div>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

export default LoadingScreen
