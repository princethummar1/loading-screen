import { useState, useEffect, useRef, forwardRef } from 'react'
import gsap from 'gsap'
import './LoadingScreen.css'

const SHUTTER_COUNT = 5

const LoadingScreen = forwardRef(({ onComplete }, ref) => {
  const [percentage, setPercentage] = useState(0)
  const containerRef = useRef(null)
  const shuttersRef = useRef([])

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

  // Trigger shutter exit animation when percentage reaches 100
  useEffect(() => {
    if (percentage === 100) {
      // Small delay before exit animation
      const timeout = setTimeout(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete()
          }
        })

        // Fade out percentage
        tl.to('.percentage-container', {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        })

        // Animate shutters with stagger - each slides up
        tl.to(shuttersRef.current, {
          y: '-100%',
          duration: 0.8,
          ease: 'power4.inOut',
          stagger: 0.08
        }, '-=0.1')

      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [percentage, onComplete])

  return (
    <div className="loading-screen" ref={containerRef}>
      {/* Shutter strips */}
      <div className="shutter-container">
        {[...Array(SHUTTER_COUNT)].map((_, i) => (
          <div
            key={i}
            className="shutter-strip"
            ref={el => shuttersRef.current[i] = el}
          />
        ))}
      </div>
      
      {/* Percentage display */}
      <div className="percentage-container">
        <span className="percentage-number">{percentage}</span>
        <span className="percentage-symbol">%</span>
      </div>
    </div>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

export default LoadingScreen
