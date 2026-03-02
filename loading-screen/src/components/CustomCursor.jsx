import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './CustomCursor.css'

// Theme color definitions
const THEMES = {
  dark:   { dot: '#ffffff', ring: 'rgba(255,255,255,0.6)' },
  light:  { dot: '#111111', ring: 'rgba(0,0,0,0.4)' },
  purple: { dot: '#a855f7', ring: 'rgba(168,85,247,0.5)' },
}

function CustomCursor() {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorTheme, setCursorTheme] = useState('dark')
  const [isVisible, setIsVisible] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const position = useRef({ x: -100, y: -100 })
  const targetPosition = useRef({ x: -100, y: -100 })
  const lastTheme = useRef('dark')

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true)
      targetPosition.current = { x: e.clientX, y: e.clientY }
      
      // First check if cursor is over the menu panel (always dark theme)
      const menuPanel = document.querySelector('.menu-panel')
      if (menuPanel) {
        const menuRect = menuPanel.getBoundingClientRect()
        if (
          e.clientX >= menuRect.left &&
          e.clientX <= menuRect.right &&
          e.clientY >= menuRect.top &&
          e.clientY <= menuRect.bottom
        ) {
          setCursorTheme('dark')
          return
        }
      }
      
      // Find element under cursor and check for data-cursor-theme
      const elements = document.elementsFromPoint(e.clientX, e.clientY)
      
      for (const el of elements) {
        const themeEl = el.closest('[data-cursor-theme]')
        if (themeEl) {
          // Check if section is hovered AND has a hover theme defined
          const isHovered = themeEl.matches(':hover')
          const hoverTheme = themeEl.getAttribute('data-cursor-theme-hover')
          const defaultTheme = themeEl.getAttribute('data-cursor-theme')
          
          // Use hover theme if section is hovered AND hover theme exists
          const theme = (isHovered && hoverTheme) ? hoverTheme : defaultTheme
          
          if (theme && THEMES[theme]) {
            setCursorTheme(theme)
            return
          }
        }
      }
      
      // Fallback: check legacy light sections
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
              return
            }
          }
          // Check if over dark code block
          const codeBlock = section.querySelector('.adp-code')
          if (codeBlock) {
            const codeRect = codeBlock.getBoundingClientRect()
            if (
              e.clientY >= codeRect.top && 
              e.clientY <= codeRect.bottom &&
              e.clientX >= codeRect.left &&
              e.clientX <= codeRect.right
            ) {
              return
            }
          }
          onLight = true
        }
      })
      
      setCursorTheme(onLight ? 'light' : 'dark')
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
      const lerp = 0.15
      
      position.current.x += (targetPosition.current.x - position.current.x) * lerp
      position.current.y += (targetPosition.current.y - position.current.y) * lerp

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(calc(${position.current.x}px - 50%), calc(${position.current.y}px - 50%))`
      }

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
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

  // Smooth color transition with GSAP when theme changes
  useEffect(() => {
    if (!cursorRef.current || lastTheme.current === cursorTheme) return
    lastTheme.current = cursorTheme
    
    const colors = THEMES[cursorTheme] || THEMES.dark
    
    // Don't animate color when has-text (purple badge)
    if (cursorText) return
    
    gsap.to(cursorRef.current, {
      '--cursor-dot-color': colors.dot,
      '--cursor-ring-color': colors.ring,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true
    })
  }, [cursorTheme, cursorText])

  // Get current colors for initial render
  const colors = THEMES[cursorTheme] || THEMES.dark

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${isHovering ? 'hovering' : ''} ${cursorText ? 'has-text' : ''}`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        '--cursor-dot-color': colors.dot,
        '--cursor-ring-color': colors.ring
      }}
    >
      {cursorText && <span className="cursor-text">{cursorText}</span>}
    </div>
  )
}

export default CustomCursor
