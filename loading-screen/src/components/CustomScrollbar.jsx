/**
 * CustomScrollbar.jsx
 *
 * A site-wide custom scrollbar that:
 *  - Listens to real scroll events (Lenis re-dispatches these on window)
 *  - Uses GSAP for butter-smooth thumb/progress animation
 *  - Reads the current page's --cs-accent CSS variable in real-time
 *    so it changes color when navigating between themed pages
 *  - Shows a thin horizontal progress bar at the top
 *  - Shows a vertical track + thumb on the right side
 */

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLocation } from 'react-router-dom'
import './CustomScrollbar.css'

export default function CustomScrollbar() {
  const trackRef     = useRef(null)
  const thumbRef     = useRef(null)
  const progressRef  = useRef(null)
  const accentRef    = useRef('#6d28d9')
  const rafRef       = useRef(null)
  const isDragging   = useRef(false)
  const dragStartY   = useRef(0)
  const dragStartScroll = useRef(0)

  const [visible, setVisible] = useState(false)
  const location = useLocation()

  // Re-read the accent color whenever the route changes.
  // Only case-study pages set --cs-accent; everywhere else use brand purple.
  useEffect(() => {
    const BRAND = '#6d28d9'

    const readAccent = () => {
      if (!location.pathname.startsWith('/case-study')) {
        accentRef.current = BRAND
        return
      }
      // On case-study pages, read the dynamic project accent
      const el = document.querySelector('[style*="--cs-accent"]')
      const color = el ? getComputedStyle(el).getPropertyValue('--cs-accent').trim() : ''
      accentRef.current = color || BRAND
    }

    readAccent()
    const t1 = setTimeout(readAccent, 300)
    const t2 = setTimeout(readAccent, 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [location.pathname])

  useEffect(() => {
    // Hide on admin routes
    if (location.pathname.startsWith('/admin')) return

    let scrollRatio = 0
    let smoothRatio = 0
    let showTimer = null

    const getScrollRatio = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      return maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0
    }

    const onScroll = () => {
      scrollRatio = getScrollRatio()
      setVisible(true)
      clearTimeout(showTimer)
      showTimer = setTimeout(() => setVisible(false), 1200)
    }

    // GSAP ticker for smooth interpolation
    const tick = () => {
      smoothRatio += (scrollRatio - smoothRatio) * 0.12

      if (!trackRef.current || !thumbRef.current || !progressRef.current) return

      const trackH = trackRef.current.clientHeight
      const thumbH = thumbRef.current.clientHeight
      const maxY   = trackH - thumbH
      const y      = smoothRatio * maxY

      const accent = accentRef.current

      gsap.set(thumbRef.current, { y, backgroundColor: accent })
      gsap.set(progressRef.current, { scaleX: smoothRatio, backgroundColor: accent })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    gsap.ticker.add(tick)

    // Initial read
    scrollRatio = getScrollRatio()

    return () => {
      window.removeEventListener('scroll', onScroll)
      gsap.ticker.remove(tick)
      clearTimeout(showTimer)
    }
  }, [location.pathname])

  // ── Drag support ──
  const onThumbMouseDown = (e) => {
    e.preventDefault()
    isDragging.current = true
    dragStartY.current = e.clientY
    dragStartScroll.current = window.scrollY

    const onMove = (ev) => {
      if (!isDragging.current || !trackRef.current) return
      const trackH  = trackRef.current.clientHeight
      const thumbH  = thumbRef.current.clientHeight
      const maxY    = trackH - thumbH
      const delta   = ev.clientY - dragStartY.current
      const ratio   = Math.max(0, Math.min(delta / maxY, 1))
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo(0, dragStartScroll.current + ratio * maxScroll)
    }
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp, { once: true })
  }

  // ── Track click to jump ──
  const onTrackClick = (e) => {
    if (!trackRef.current) return
    const rect   = trackRef.current.getBoundingClientRect()
    const ratio  = (e.clientY - rect.top) / rect.height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' })
  }

  // Don't render on admin
  if (location.pathname.startsWith('/admin')) return null

  return (
    <>
      {/* Top progress bar */}
      <div
        ref={progressRef}
        className={`csb-progress${visible ? ' csb-visible' : ''}`}
      />

      {/* Right-side vertical track + thumb */}
      <div
        ref={trackRef}
        className={`csb-track${visible ? ' csb-visible' : ''}`}
        onClick={onTrackClick}
      >
        <div
          ref={thumbRef}
          className="csb-thumb"
          onMouseDown={onThumbMouseDown}
        />
      </div>
    </>
  )
}
