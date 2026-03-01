import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

function CustomCursor() {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isOnLight, setIsOnLight] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const position = useRef({ x: -100, y: -100 })
  const targetPosition = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true)
      targetPosition.current = { x: e.clientX, y: e.clientY }
      
      // First check if cursor is over the menu panel (dark) - cursor should stay white
      const menuPanel = document.querySelector('.menu-panel')
      if (menuPanel) {
        const menuRect = menuPanel.getBoundingClientRect()
        if (
          e.clientX >= menuRect.left &&
          e.clientX <= menuRect.right &&
          e.clientY >= menuRect.top &&
          e.clientY <= menuRect.bottom
        ) {
          setIsOnLight(false)
          return
        }
      }
      
      // Check if cursor is over a light section
      const lightSections = document.querySelectorAll('.services-section, .partnership-section, .contact-page, .adp-header, .adp-hero, .adp-body, .adp-other-articles, .adp-not-found, .cs-hero, .cs-marquee, .cs-cases')
      let onLight = false
      
      lightSections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (
          e.clientY >= rect.top && 
          e.clientY <= rect.bottom &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right
        ) {
          // Check if over the dark steps container
          const stepsContainer = section.querySelector('.steps-container')
          if (stepsContainer) {
            const stepsRect = stepsContainer.getBoundingClientRect()
            if (
              e.clientY >= stepsRect.top && 
              e.clientY <= stepsRect.bottom &&
              e.clientX >= stepsRect.left &&
              e.clientX <= stepsRect.right
            ) {
              // On dark steps area - don't set onLight
              return
            }
          }
          // Check if cursor is over a dark code block within the light section
          const codeBlock = section.querySelector('.adp-code')
          if (codeBlock) {
            const codeRect = codeBlock.getBoundingClientRect()
            if (
              e.clientY >= codeRect.top && 
              e.clientY <= codeRect.bottom &&
              e.clientX >= codeRect.left &&
              e.clientX <= codeRect.right
            ) {
              return // On dark code block - don't set onLight
            }
          }
          onLight = true
        }
      })

      setIsOnLight(onLight)
      
      // Note: footer-cta upper section and footer bar are now DARK theme
      // so they don't need special light handling anymore
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseOver = (e) => {
      // Check for cursor text attribute
      const cursorTextEl = e.target.closest('[data-cursor-text]')
      if (cursorTextEl) {
        setCursorText(cursorTextEl.getAttribute('data-cursor-text'))
        setIsHovering(true)
        return
      }
      
      if (e.target.closest('[data-cursor-hover]') || 
          e.target.closest('button') || 
          e.target.closest('a')) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e) => {
      const cursorTextEl = e.target.closest('[data-cursor-text]')
      if (cursorTextEl) {
        setCursorText('')
        setIsHovering(false)
        return
      }
      
      if (e.target.closest('[data-cursor-hover]') || 
          e.target.closest('button') || 
          e.target.closest('a')) {
        setIsHovering(false)
        setCursorText('')
      }
    }

    // Animation loop with lerp
    let animationId
    const animate = () => {
      // Lerp factor (higher = faster follow)
      const lerp = 0.15
      
      position.current.x += (targetPosition.current.x - position.current.x) * lerp
      position.current.y += (targetPosition.current.y - position.current.y) * lerp

      if (cursorRef.current) {
        // Use translate for position and include -50%, -50% for centering
        cursorRef.current.style.transform = `translate(calc(${position.current.x}px - 50%), calc(${position.current.y}px - 50%))`
      }

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isOnLight ? 'cursor-dark' : ''} ${cursorText ? 'has-text' : ''}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {cursorText && <span className="cursor-text">{cursorText}</span>}
    </div>
  )
}

export default CustomCursor
