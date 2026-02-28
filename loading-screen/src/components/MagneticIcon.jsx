import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

/**
 * MagneticIcon - A reusable wrapper that adds magnetic pull effect to any element
 * 
 * Props:
 * - children: The element to apply the effect to
 * - strength: How strong the pull is (0.38 = 38% of distance), default 0.4
 * - padding: Size of invisible detection zone in px, default 20
 * - className: Additional CSS class for the wrapper
 * - onHoverStart: Callback when hover starts
 * - onHoverEnd: Callback when hover ends
 * 
 * Strength guide:
 * - 0.2: subtle, barely noticeable
 * - 0.38: default, same as CTA buttons
 * - 0.4: slightly stronger, good for small icons
 * - 0.5: strong, very reactive
 */
function MagneticIcon({ 
  children, 
  strength = 0.4, 
  padding = 20, 
  className = '',
  onHoverStart,
  onHoverEnd 
}) {
  const wrapperRef = useRef(null)
  const innerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const inner = innerRef.current
    if (!wrapper || !inner) return

    let activeTween = null
    let isActive = false

    const resetPosition = () => {
      if (!isActive) return
      isActive = false
      setIsHovered(false)
      
      // Kill any existing tween before starting snap-back
      if (activeTween) activeTween.kill()

      // Spring back to original position
      activeTween = gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: true
      })
      onHoverEnd?.()
    }

    const onMouseEnter = () => {
      isActive = true
      setIsHovered(true)
      onHoverStart?.()
    }

    const onDocumentMove = (e) => {
      if (!isActive) return
      
      // Get wrapper bounds (not inner, since inner moves)
      const wrapperBounds = wrapper.getBoundingClientRect()

      // Check if cursor is outside wrapper bounds
      const isOutside = 
        e.clientX < wrapperBounds.left ||
        e.clientX > wrapperBounds.right ||
        e.clientY < wrapperBounds.top ||
        e.clientY > wrapperBounds.bottom

      if (isOutside) {
        resetPosition()
        return
      }

      // Calculate center of the wrapper
      const centerX = wrapperBounds.left + wrapperBounds.width / 2
      const centerY = wrapperBounds.top + wrapperBounds.height / 2

      // Calculate distance from cursor to center
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Kill any existing tween before starting a new one
      if (activeTween) activeTween.kill()

      // Move icon toward cursor by strength percentage
      activeTween = gsap.to(inner, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true
      })
    }

    const onMouseLeave = () => {
      resetPosition()
    }

    // Use pointerenter on wrapper, but track globally for movement
    wrapper.addEventListener('pointerenter', onMouseEnter)
    wrapper.addEventListener('pointerleave', onMouseLeave)
    document.addEventListener('pointermove', onDocumentMove)

    return () => {
      wrapper.removeEventListener('pointerenter', onMouseEnter)
      wrapper.removeEventListener('pointerleave', onMouseLeave)
      document.removeEventListener('pointermove', onDocumentMove)
      // Kill any active tween on cleanup to prevent memory leaks
      if (activeTween) activeTween.kill()
      gsap.killTweensOf(inner)
    }
  }, [strength, onHoverStart, onHoverEnd])

  return (
    <div 
      ref={wrapperRef}
      className={`magnetic-wrapper ${className}`}
      style={{
        padding: `${padding}px`,
        margin: `-${padding}px`,
        cursor: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        pointerEvents: 'auto',
        touchAction: 'none'
      }}
    >
      <div 
        ref={innerRef} 
        style={{ 
          display: 'inline-flex',
          position: 'relative',
          zIndex: isHovered ? 10 : 1,
          pointerEvents: 'auto',
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default MagneticIcon
