import { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import CustomScrollbar from './CustomScrollbar'
import { getGlobalLenis } from './PageTransition'
import './PageTransition.css'

function PageTransitionWrapper({ children }) {
  const location = useLocation()
  const curtainRef = useRef(null)
  const logoRef = useRef(null)
  const contentRef = useRef(null)

  // Track if this is the first mount
  const isFirstMount = useRef(true)
  const isAnimatingRef = useRef(false)
  const tlRef = useRef(null)
  const previousPathRef = useRef(location.pathname)

  const runTransition = useCallback(() => {
    const curtain = curtainRef.current
    const logo = logoRef.current
    const content = contentRef.current
    
    if (!curtain || !logo) return

    // Kill any in-flight timeline safely
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    isAnimatingRef.current = true

    // Lock scroll
    const lenis = getGlobalLenis()
    if (lenis) lenis.stop()
    document.body.style.overflow = 'hidden'

    // Make curtain block interactions during transition
    curtain.style.pointerEvents = 'all'

    const cleanup = () => {
      isAnimatingRef.current = false
      document.body.style.overflow = ''
      if (curtain) curtain.style.pointerEvents = 'none'
      const lenisCleanup = getGlobalLenis()
      if (lenisCleanup) lenisCleanup.start()
      tlRef.current = null
    }

    const tl = gsap.timeline({ onComplete: cleanup })
    tlRef.current = tl

    // Phase 1: Curtain slides in from right
    tl.set(curtain, { x: '100%' })
    tl.to(curtain, { x: '0%', duration: 0.55, ease: 'power4.inOut' })

    // Logo fades in
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' },
      '-=0.25'
    )

    // Scroll to top while covered
    tl.call(() => {
      const lenisScroll = getGlobalLenis()
      if (lenisScroll) {
        lenisScroll.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    })

    // Brief hold at full coverage
    tl.to({}, { duration: 0.08 })

    // Logo fades out
    tl.to(logo, { opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in' })

    // Phase 2: Curtain exits to left
    tl.to(curtain, { x: '-100%', duration: 0.55, ease: 'power4.inOut' }, '-=0.1')

    // Reset position ready for next transition
    tl.set(curtain, { x: '100%' })
  }, [])

  useEffect(() => {
    // Skip on first mount — no transition needed
    if (isFirstMount.current) {
      isFirstMount.current = false
      previousPathRef.current = location.pathname
      return
    }

    // Only run transition if pathname actually changed
    if (previousPathRef.current === location.pathname) {
      return
    }
    
    previousPathRef.current = location.pathname

    // Skip transitions for admin routes
    if (location.pathname.startsWith('/admin')) {
      window.scrollTo(0, 0)
      return
    }

    runTransition()
  }, [location.pathname, runTransition])

  return (
    <div className="page-transition-container">
      {/* Custom global scrollbar */}
      <CustomScrollbar />

      {/* Curtain overlay */}
      <div className="page-transition-curtain" ref={curtainRef}>
        <div className="curtain-logo" ref={logoRef}>
          <span className="curtain-logo-text">KYUREX</span>
        </div>
      </div>

      {/* Page content */}
      <div className="page-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

export default PageTransitionWrapper
