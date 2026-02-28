import Lenis from '@studio-freight/lenis'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { setGlobalLenis } from '../components/PageTransition'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Create Lenis instance with optimized settings for horizontal scroll sections
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      syncTouch: true,
      syncTouchLerp: 0.075,
    })

    lenisRef.current = lenis

    // Set global lenis for page transitions
    setGlobalLenis(lenis)

    // Sync Lenis scroll with ScrollTrigger - use ScrollTrigger.update on each Lenis scroll
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker drives Lenis - RAF loop
    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Refresh on resize
    const handleResize = () => {
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    // Initial refresh after mount
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    return () => {
      window.removeEventListener('resize', handleResize)
      gsap.ticker.remove(rafCallback)
      lenis.off('scroll', ScrollTrigger.update)
      setGlobalLenis(null)
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
