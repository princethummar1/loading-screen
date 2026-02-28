import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import CustomScrollbar from './CustomScrollbar'
import './PageTransition.css'

// Global lenis reference - will be set by useSmoothScroll
let globalLenis = null
export const setGlobalLenis = (lenis) => { globalLenis = lenis }
export const getGlobalLenis = () => globalLenis

function PageTransition({ children }) {
  const location = useLocation()
  const curtainRef = useRef(null)
  const logoRef = useRef(null)

  // displayChildren is what's actually rendered
  const [displayChildren, setDisplayChildren] = useState(children)

  // Use refs for animation state to avoid stale closures
  const isAnimatingRef = useRef(false)
  const pendingChildrenRef = useRef(null)
  const tlRef = useRef(null)
  const isFirstMount = useRef(true)

  const runTransition = useCallback((newChildren) => {
    const curtain = curtainRef.current
    const logo = logoRef.current
    if (!curtain || !logo) {
      // DOM not ready — just swap children
      setDisplayChildren(newChildren)
      return
    }

    // Kill any in-flight timeline safely
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    isAnimatingRef.current = true
    pendingChildrenRef.current = null

    // Lock scroll
    if (globalLenis) globalLenis.stop()
    document.body.style.overflow = 'hidden'

    // Make curtain block interactions during transition
    curtain.style.pointerEvents = 'all'

    const cleanup = () => {
      isAnimatingRef.current = false
      document.body.style.overflow = ''
      if (curtain) curtain.style.pointerEvents = 'none'
      if (globalLenis) globalLenis.start()
      tlRef.current = null

      // If a navigation was queued while we were animating, run it now
      if (pendingChildrenRef.current) {
        const next = pendingChildrenRef.current
        pendingChildrenRef.current = null
        // Small delay so React can settle the current render
        requestAnimationFrame(() => runTransition(next))
      }
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

    // Swap children + scroll to top while covered
    tl.call(() => {
      setDisplayChildren(newChildren)
      // Reset scroll position — works for both Lenis and native
      if (globalLenis) {
        globalLenis.scrollTo(0, { immediate: true })
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
      setDisplayChildren(children)
      return
    }

    if (isAnimatingRef.current) {
      // Queue this navigation — it will fire as soon as current transition ends
      pendingChildrenRef.current = children
      return
    }

    runTransition(children)

    // Note: we do NOT kill the timeline in cleanup here.
    // Killing mid-flight leaves overflow/lenis in a broken state.
    // The runTransition function manages its own lifecycle safely.
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  // Intentionally only depend on pathname, NOT children, to avoid double triggers

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
      <div className="page-content">
        {displayChildren}
      </div>
    </div>
  )
}

export default PageTransition
