import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import FooterCTA from './FooterCTA'
import { setGlobalLenis, getGlobalLenis } from './PageTransition'
import './CaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ──────────────────────────────────────────────
// Fallback static data (used when API unavailable)
// ──────────────────────────────────────────────
const FALLBACK_DATA = {
  name: 'Heimdall Power',
  slug: 'heimdall-power',
  accent: '#FF4D2E',
  services: ['3D Animations', 'Branding', 'Creative Development', 'Web Design', 'Webflow Development'],
  location: 'Norway',
  description: 'Heimdall Power is an innovative Norwegian technology company specializing in advanced power grid monitoring. We crafted a full digital experience from 3D product visualization to scalable web platform.',
  heroHeadline: 'The Power of Knowing',
  heroSubtext: 'Blending Scandinavian design with 3D visuals',
  liveUrl: '#',
  images: [],
  sections: [],
  results: [],
  tags: [],
}

const FALLBACK_OTHER = [
  { slug: 'starred',  name: 'Starred',  accent: '#00D4AA', description: 'A recruitment platform reimagined for the modern workforce' },
  { slug: 'cula',     name: 'Cula',     accent: '#6366f1', description: 'Carbon tracking tools that turn sustainability data into compelling narratives' },
]


function CaseStudy() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  // API data
  const [data, setData] = useState(null)
  const [otherCases, setOtherCases] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Refs ──
  const pageRef = useRef(null)

  // Hero
  const heroRef = useRef(null)
  const headlineRef = useRef(null)
  const heroDividerRef = useRef(null)
  const heroColsRef = useRef(null)

  // Gallery
  const galleryRef = useRef(null)
  const galleryContainerRef = useRef(null)
  const cardsRef = useRef([])

  // Marquee
  const marqueeRef = useRef(null)
  const marqueeTrackRef = useRef(null)

  // Video showcase
  const videoSectionRef = useRef(null)
  const videoInnerRef = useRef(null)
  const videoElRef = useRef(null)

  // GSAP context ref — persists across the effect for slug-change cleanup
  const ctxRef = useRef(null)

  // Cases
  const casesRef = useRef(null)
  const casesTitleRef = useRef(null)

  // ──────────────────────────────────────────────
  // FETCH DATA FROM API
  // ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      setLoading(true)

      // Fetch current case study by slug
      try {
        const res = await fetch(`${API_URL}/api/projects/slug/${slug}`)
        if (res.ok) {
          const json = await res.json()
          if (!cancelled && json.success && json.data) {
            setData(json.data)
          } else if (!cancelled) {
            setData(FALLBACK_DATA)
          }
        } else {
          if (!cancelled) setData(FALLBACK_DATA)
        }
      } catch {
        if (!cancelled) setData(FALLBACK_DATA)
      }

      // Fetch other case studies for the bottom section
      try {
        const res = await fetch(`${API_URL}/api/projects?type=case-study`)
        if (res.ok) {
          const json = await res.json()
          if (!cancelled && json.success && json.data) {
            const others = json.data.filter(p => p.slug !== slug).slice(0, 3)
            setOtherCases(others)
          } else if (!cancelled) {
            setOtherCases(FALLBACK_OTHER.filter(c => c.slug !== slug))
          }
        } else {
          if (!cancelled) setOtherCases(FALLBACK_OTHER.filter(c => c.slug !== slug))
        }
      } catch {
        if (!cancelled) setOtherCases(FALLBACK_OTHER.filter(c => c.slug !== slug))
      }

      if (!cancelled) setLoading(false)
    }

    fetchData()
    return () => { cancelled = true }
  }, [slug])

  // ──────────────────────────────────────────────
  // Set page title + meta description from API data
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (data) {
      document.title = data.metaTitle || `${data.name} — Case Study`
      // Set meta description
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = data.metaDescription || data.description || ''
    }
    return () => { document.title = 'Kyurex' }
  }, [data])

  // ──────────────────────────────────────────────
  // MAIN EFFECT — Lenis + GSAP animations
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (loading || !data) return

    // ── Kill ALL stale ScrollTriggers from previous page immediately ──
    // This MUST happen before we create new ones, otherwise pinned
    // sections from the old page block the new page's scroll calculation.
    ScrollTrigger.getAll().forEach(t => t.kill())

    // ── Destroy existing global Lenis if any ──
    const existingLenis = getGlobalLenis()
    if (existingLenis) {
      existingLenis.destroy()
    }

    // ── Lenis ──
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      syncTouch: true,
      syncTouchLerp: 0.075,
    })

    // ── Set as global Lenis for PageTransition ──
    setGlobalLenis(lenis)

    const lenisRaf = (time) => { lenis.raf(time * 1000) }
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)

    // ── Scroll to top — use lenis so it works with smooth scroll ──
    lenis.scrollTo(0, { immediate: true })

    // ── Wait a tick for DOM to settle after data renders, then animate ──
    const setupTimer = setTimeout(() => {
      ScrollTrigger.refresh()

      // ── GSAP context ──
      const ctx = gsap.context(() => {

        // ────────── HERO ANIMATIONS ──────────
        if (headlineRef.current) {
          const words = headlineRef.current.querySelectorAll('.cs-word')
          gsap.from(words, {
            y: 150,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.3,
          })
        }

        if (heroDividerRef.current) {
          gsap.from(heroDividerRef.current, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1,
            delay: 0.6,
            ease: 'power3.out',
          })
        }

        if (heroColsRef.current) {
          gsap.from(heroColsRef.current.children, {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.8,
          })
        }

        // ────────── VIDEO SHOWCASE SCROLL ZOOM ──────────
        if (videoSectionRef.current && videoInnerRef.current && videoElRef.current) {
          gsap.fromTo(videoInnerRef.current,
            { borderRadius: '28px', scale: 0.88 },
            {
              borderRadius: '0px',
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: videoSectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1.2,
              }
            }
          )
          gsap.fromTo(videoElRef.current,
            { scale: 1.15 },
            {
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: videoSectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.8,
              }
            }
          )
        }

        // ────────── 3D GALLERY ──────────
        if (galleryRef.current && cardsRef.current.length === 7) {
          const cards = cardsRef.current

          const positions = [
            { top: '5%',  left: '25%', rotateX: 0, rotateY: 8,   scale: 0.85 },
            { top: '5%',  right: '8%', rotateX: -5, rotateY: 0,  scale: 0.85 },
            { top: '8%',  right: '-2%', rotateX: 0, rotateY: 8,  scale: 0.85 },
            { top: '35%', left: '2%',  rotateX: -5, rotateY: 0,  scale: 0.85 },
            { top: '22%', left: '28%', rotateX: 0, rotateY: 0,   scale: 1.15 },
            { bottom: '5%', left: '28%', rotateX: 0, rotateY: -6, scale: 0.85 },
            { bottom: '5%', left: '48%', rotateX: 0, rotateY: -6, scale: 0.85 },
          ]

          cards.forEach((card, i) => {
            if (!card) return
            gsap.set(card, { ...positions[i], position: 'absolute' })
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top top',
              end: '+=300%',
              pin: true,
              scrub: 1.5,
              anticipatePin: 1,
            }
          })

          const outerCards = cards.filter((_, i) => i !== 4)

          outerCards.forEach(card => {
            if (!card) return
            tl.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' }, 0)
          })
          if (cards[4]) tl.to(cards[4], { scale: 1.0, duration: 0.4 }, 0)

          if (cards[4]) {
            tl.to(cards[4], { scale: 1.8, z: 200, boxShadow: '0 30px 100px rgba(0,0,0,0.5)', duration: 0.3, ease: 'power2.in' }, 0.4)
          }
          outerCards.forEach(card => {
            if (!card) return
            tl.to(card, { scale: 0.6, opacity: 0.4, duration: 0.3 }, 0.4)
          })

          if (cards[4]) {
            tl.to(cards[4], { scale: 4, z: 400, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.7)
          }
          outerCards.forEach(card => {
            if (!card) return
            tl.to(card, { opacity: 0, scale: 0.3, duration: 0.3 }, 0.7)
          })
        }

        // ────────── HORIZONTAL MARQUEE ──────────
        if (marqueeRef.current && marqueeTrackRef.current) {
          const marqueeCards = marqueeTrackRef.current.querySelectorAll('.cs-marquee-card')

          gsap.from(marqueeCards, {
            x: 100, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: marqueeRef.current, start: 'top 80%' }
          })

          gsap.to(marqueeTrackRef.current, {
            x: () => -(marqueeTrackRef.current.scrollWidth - window.innerWidth + 80),
            ease: 'none',
            scrollTrigger: {
              trigger: marqueeRef.current,
              start: 'top top',
              end: '+=200%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          })
        }

        // ────────── CASE STUDIES ENTRANCE ──────────
        if (casesRef.current && casesTitleRef.current) {
          ScrollTrigger.create({
            trigger: casesRef.current,
            start: 'top 70%',
            once: true,
            onEnter: () => {
              const titleWords = casesTitleRef.current?.querySelectorAll('.cs-word')
              if (titleWords) {
                gsap.from(titleWords, { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out' })
              }
              const caseCards = casesRef.current?.querySelectorAll('.cs-case-card')
              if (caseCards) {
                gsap.from(caseCards, { clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: 0.15, ease: 'power3.inOut', delay: 0.4 })
              }
            }
          })
        }

      }, pageRef)

      // Store ctx so cleanup can access it
      ctxRef.current = ctx

    }, 100) // 100ms delay gives React time to fully commit the new DOM

    // ── Cleanup ──
    return () => {
      clearTimeout(setupTimer)
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }
      ScrollTrigger.getAll().forEach(t => t.kill())
      gsap.ticker.remove(lenisRaf)
      lenis.off('scroll', ScrollTrigger.update)
      setGlobalLenis(null)
      lenis.destroy()
    }
  }, [slug, loading, data])

  // ── Helpers ──

  const dots = Array.from({ length: 80 }, (_, i) => <span key={i} />)
  const logoDots = Array.from({ length: 16 }, (_, i) => <span key={i} />)

  // Dynamic accent color
  const accentColor = data?.accent || '#FF4D2E'

  // Helper: lighten a hex color for gradient effects
  const lightenColor = (hex, percent = 30) => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, (num >> 16) + Math.round((255 - (num >> 16)) * percent / 100))
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * percent / 100))
    const b = Math.min(255, (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * percent / 100))
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
  }

  const accentLight = lightenColor(accentColor, 30)
  const accentDark = lightenColor(accentColor, -30)

  // CSS custom properties for the accent color cascade
  const accentVars = {
    '--cs-accent': accentColor,
    '--cs-accent-light': accentLight,
    '--cs-accent-dark': accentDark,
  }

  // Derive sections by type for the layout (only stats + quote are used)
  const statsSection = data?.sections?.find(s => s.type === 'stats')
  const quoteSection = data?.sections?.find(s => s.type === 'quote')

  // ──────────────────────────────────────────────
  // LOADING SKELETON
  // ──────────────────────────────────────────────
  if (loading || !data) {
    return (
      <>
        <CustomCursor />
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main style={{ position: 'relative', zIndex: 2, minHeight: '100vh', background: '#0a0a0a' }}>
          <div style={{ padding: '120px 5vw 60px', maxWidth: '100%' }}>
            {/* Hero skeleton */}
            <div style={{ marginBottom: '40px' }}>
              <div className="cs-skeleton" style={{ width: '70%', height: '80px', borderRadius: '12px', marginBottom: '20px' }} />
              <div className="cs-skeleton" style={{ width: '100%', height: '2px', marginBottom: '40px' }} />
              <div style={{ display: 'flex', gap: '40px' }}>
                <div className="cs-skeleton" style={{ flex: 1, height: '120px', borderRadius: '8px' }} />
                <div className="cs-skeleton" style={{ flex: 1, height: '120px', borderRadius: '8px' }} />
                <div className="cs-skeleton" style={{ flex: 1, height: '120px', borderRadius: '8px' }} />
              </div>
            </div>
            {/* Gallery skeleton */}
            <div className="cs-skeleton" style={{ width: '100%', height: '60vh', borderRadius: '16px', marginBottom: '40px' }} />
            {/* Cards skeleton */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="cs-skeleton" style={{ flex: 1, height: '200px', borderRadius: '12px' }} />
              <div className="cs-skeleton" style={{ flex: 1, height: '200px', borderRadius: '12px' }} />
              <div className="cs-skeleton" style={{ flex: 1, height: '200px', borderRadius: '12px' }} />
            </div>
          </div>
        </main>
      </>
    )
  }

  // Display name — use heroHeadline if available, fall back to name
  const displayName = data.heroHeadline || data.name

  return (
    <>
      <CustomCursor />
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />
      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* FOOTER fixed at bottom — same pattern as PortfolioPage */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'auto',
      }}>
        <FooterCTA />
      </div>

      {/* MAIN CONTENT scrolls over fixed footer */}
      <main style={{ position: 'relative', zIndex: 2, pointerEvents: 'none', ...accentVars }} ref={pageRef}>
        <div style={{ pointerEvents: 'auto' }}>

          {/* ═══════════════ SECTION 1 — HERO ═══════════════ */}
          <section className="cs-hero" ref={heroRef}>
            <h1 className="cs-hero-headline" ref={headlineRef}>
              {displayName.split(' ').map((word, i) => (
                <span className="cs-word-wrap" key={i}>
                  <span className="cs-word">{word} </span>
                </span>
              ))}
            </h1>

            <div className="cs-hero-divider" ref={heroDividerRef} />

            <div className="cs-hero-columns" ref={heroColsRef}>
              <div className="cs-hero-col">
                <div className="cs-hero-col-label">• Services /</div>
                <div className="cs-hero-col-list">
                  {(data.services || []).map((s, i) => <span key={i}>{s}</span>)}
                </div>
              </div>

              <div className="cs-hero-col">
                <div className="cs-hero-col-label">• Location /</div>
                <div className="cs-hero-col-list">
                  <span>{data.location}</span>
                  {data.industry && <span>{data.industry}</span>}
                </div>
              </div>

              <div className="cs-hero-col">
                <p className="cs-hero-description">{data.description}</p>
                {(data.tags || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                    {data.tags.map((tag, i) => (
                      <span key={i} style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'rgba(255,255,255,0.8)',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
                {data.liveUrl && (
                  <a href={data.liveUrl} className="cs-hero-link" data-cursor-hover target="_blank" rel="noopener noreferrer">
                    Live Website →
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* ═══════════════ SECTION 1.5 — SHOWCASE VIDEO ═══════════════ */}
          {data.topVideoUrl && (
            <section className="cs-top-video" ref={videoSectionRef}>

              <div className="cs-top-video-inner" ref={videoInnerRef}>
                <video
                  ref={videoElRef}
                  src={data.topVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="cs-top-video-el"
                />

                {/* Gradient vignette overlays */}
                <div className="cs-top-video-vignette-top" />
                <div className="cs-top-video-vignette-bottom" />
                <div className="cs-top-video-vignette-sides" />

                {/* Top-left label pill */}
                <div className="cs-top-video-label">
                  <span className="cs-top-video-dot" />
                  In Action
                </div>

                {/* Bottom overlay — project name + year */}
                <div className="cs-top-video-footer">
                  <div className="cs-top-video-footer-left">
                    <p className="cs-top-video-project-name">{data.name}</p>
                    {data.year && <span className="cs-top-video-year">— {data.year}</span>}
                  </div>
                  {data.liveUrl && (
                    <a
                      href={data.liveUrl}
                      className="cs-top-video-cta"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-hover
                    >
                      View Live →
                    </a>
                  )}
                </div>

                {/* Corner accent badge */}
                <div className="cs-top-video-corner-badge">
                  {(data.tags?.[0] || data.industry || 'Creative')}
                </div>
              </div>

              {/* Scroll indicator */}
              <div className="cs-top-video-scroll">
                <span>Scroll</span>
                <div className="cs-top-video-scroll-line" />
              </div>
            </section>
          )}

          {/* ═══════════════ SECTION 2 — 3D BENTO GALLERY ═══════════════ */}
          <section className="cs-gallery" ref={galleryRef}>
            <div className="cs-gallery-container" ref={galleryContainerRef}>

              {/* Card 0 — Accent CTA card */}
              <div className="cs-gallery-card cs-card-1" ref={el => cardsRef.current[0] = el}>
                <div className="cs-card1-inner">
                  <div className="cs-card1-btn">{data.heroHeadline ? 'Explore' : 'Download Report'}</div>
                  <p className="cs-card1-sub">{data.name} {data.year ? `— ${data.year}` : ''}</p>
                </div>
              </div>

              {/* Card 1 — Dark dot grid */}
              <div className="cs-gallery-card cs-card-2" ref={el => cardsRef.current[1] = el}>
                <div className="cs-dot-grid">{dots}</div>
              </div>

              {/* Card 2 — White tall quote */}
              <div className="cs-gallery-card cs-card-3" ref={el => cardsRef.current[2] = el}>
                <div className="cs-card3-quote">
                  {quoteSection?.quote || `"Their vision transformed how we monitor power lines — delivering the intelligence utilities need to keep the grid resilient."`}
                </div>
                <div className="cs-card3-author">— {quoteSection?.author || `CEO, ${data.name}`}</div>
              </div>

              {/* Card 3 — Dot logo */}
              <div className="cs-gallery-card cs-card-4" ref={el => cardsRef.current[3] = el}>
                <div className="cs-dot-logo">{logoDots}</div>
              </div>

              {/* Card 4 — Center dark UI (MAIN CARD) */}
              <div className="cs-gallery-card cs-card-5" ref={el => cardsRef.current[4] = el}>
                <div className="cs-card5-inner">
                  <div className="cs-card5-header">
                    <span className="cs-card5-dot" />
                    {data.name} — {data.industry || 'Dashboard'}
                  </div>
                  <div className="cs-card5-bars">
                    <div className="cs-card5-bar" />
                    <div className="cs-card5-bar" />
                    <div className="cs-card5-bar" />
                    <div className="cs-card5-bar" />
                    <div className="cs-card5-bar" />
                    <div className="cs-card5-bar" />
                    <div className="cs-card5-bar" />
                  </div>
                  <div className="cs-card5-footer">
                    <span>Jan</span><span>Feb</span><span>Mar</span>
                    <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                  </div>
                </div>
              </div>

              {/* Card 5 — Image from project images */}
              <div className="cs-gallery-card cs-card-6" ref={el => cardsRef.current[5] = el}>
                {data.images?.[0] ? (
                  <img src={data.images[0]} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
                <div className="cs-card6-overlay">{data.industry || data.name} — {data.location || 'Field'}</div>
              </div>

              {/* Card 6 — Striped pattern */}
              <div className="cs-gallery-card cs-card-7" ref={el => cardsRef.current[6] = el} />
            </div>
          </section>

          {/* ═══════════════ SECTION 3 — HORIZONTAL MARQUEE ═══════════════ */}
          <section className="cs-marquee" ref={marqueeRef}>
            <div className="cs-marquee-track" ref={marqueeTrackRef}>

              {/* Dynamic Marquee Cards */}
              {(data.marqueeCards && data.marqueeCards.length > 0 ? data.marqueeCards : [
                { cardType: 'product', label: '• Product', heading: '', body: data.heroSubtext || data.description?.slice(0, 60) || 'Next-gen product experience', ctaText: 'Learn More →', ctaLink: data.liveUrl || '#' },
                { cardType: 'standard', label: '• Hero', heading: displayName.split(' ').slice(0, 2).join(' ') + '\n' + (displayName.split(' ').slice(2).join(' ') || ''), body: data.heroSubtext || data.description?.slice(0, 100), ctaText: 'Get Started →', ctaLink: data.liveUrl || '#' },
                { cardType: 'security', label: '• Security', heading: 'Enterprise-grade\nSecurity', body: 'SOC 2 Type II Certified', ctaText: '', ctaLink: '' },
                { cardType: 'testimonial', label: '• Testimonial', heading: '', body: quoteSection?.quote || `"Their attention to detail and creative vision transformed our brand presence entirely. Outstanding partnership."`, author: quoteSection?.author || `${data.industry} Director`, ctaText: '', ctaLink: '' },
                { cardType: 'stats', label: '• Impact', heading: '', body: '', ctaText: '', ctaLink: '' },
                { cardType: 'dashboard', label: `• ${data.industry || 'Dashboard'}`, heading: 'Platform', body: '', ctaText: 'View Demo →', ctaLink: '' },
              ]).map((card, i) => {
                
                // Helper to render CTA
                const renderCTA = () => {
                  if (!card.ctaText) return null
                  if (card.ctaLink && card.ctaLink !== '#') {
                    return <a href={card.ctaLink} className="cs-mc-cta" data-cursor-hover target="_blank" rel="noopener noreferrer">{card.ctaText}</a>
                  }
                  return <button className="cs-mc-cta" data-cursor-hover>{card.ctaText}</button>
                }

                if (card.cardType === 'product') {
                  return (
                    <div className="cs-marquee-card" key={i}>
                      <div className="cs-mc-label">{card.label || `• ${data.name}`}</div>
                      <div className="cs-mc-body">
                        <div className="cs-mc-sphere" />
                        <p className="cs-mc-sphere-label">{card.body}</p>
                      </div>
                      {renderCTA()}
                    </div>
                  )
                }

                if (card.cardType === 'standard') {
                  return (
                    <div className="cs-marquee-card" key={i}>
                      <div className="cs-mc-label">{card.label}</div>
                      <div className="cs-mc-body" style={{ justifyContent: 'flex-start', paddingTop: 20 }}>
                        {card.heading && <div className="cs-mc-headline" style={{ whiteSpace: 'pre-line' }}>{card.heading}</div>}
                        <p className="cs-mc-desc">{card.body}</p>
                        {renderCTA()}
                      </div>
                    </div>
                  )
                }

                if (card.cardType === 'security') {
                  return (
                    <div className="cs-marquee-card" key={i}>
                      <div className="cs-mc-label">{card.label}</div>
                      <div className="cs-mc-body">
                        <div className="cs-mc-lock" />
                        <p className="cs-mc-security-title" style={{ whiteSpace: 'pre-line' }}>{card.heading}</p>
                        <p className="cs-mc-security-sub">{card.body}</p>
                      </div>
                    </div>
                  )
                }

                if (card.cardType === 'testimonial') {
                   // Fallback to section quote if card body is empty for backward compatibility
                   const quote = card.body || quoteSection?.quote || `"Their attention to detail..."`
                   const author = card.heading || card.author || quoteSection?.author || 'Client'
                   return (
                    <div className="cs-marquee-card" style={{ padding: 0 }} key={i}>
                      <div className="cs-mc-quote-wrap">
                        <div className="cs-mc-label">{card.label}</div>
                        <blockquote>{quote}</blockquote>
                        <cite>— {author}</cite>
                      </div>
                    </div>
                  )
                }

                if (card.cardType === 'stats') {
                  const displayStats = (card.stats && card.stats.length > 0) ? card.stats : (statsSection?.stats || data.results || []).slice(0, 4)
                  return (
                    <div className="cs-marquee-card" key={i}>
                      <div className="cs-mc-label">{card.label}</div>
                      <div className="cs-mc-body">
                        <div className="cs-mc-stats">
                          {displayStats.map((stat, idx) => (
                            <div className="cs-mc-stat" key={idx}>
                              <div className="cs-mc-stat-val">{stat.value}</div>
                              <div className="cs-mc-stat-label">{stat.label || stat.metric}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                if (card.cardType === 'dashboard') {
                  return (
                    <div className="cs-marquee-card" key={i}>
                      <div className="cs-mc-label">{card.label}</div>
                      <div className="cs-mc-body">
                        <div className="cs-mc-product">
                          <div className="cs-mc-ring-outer">
                            <div className="cs-mc-ring-inner">{data.name?.[0] || 'K'}</div>
                          </div>
                          <p className="cs-mc-product-label">{data.name}<br />{card.heading}</p>
                        </div>
                      </div>
                      {renderCTA()}
                    </div>
                  )
                }

                if (card.cardType === 'image' || card.cardType === 'video') {
                  return (
                    <div className="cs-marquee-card" style={{ padding: 0, position: 'relative', overflow: 'hidden' }} key={i}>
                      {card.cardType === 'image' && <img src={card.mediaUrl} alt="" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />}
                      {card.cardType === 'video' && <video src={card.mediaUrl} autoPlay muted loop playsInline style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />}
                      
                      <div style={{ position: 'relative', zIndex: 2, padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="cs-mc-label">{card.label}</div>
                        <div className="cs-mc-body" style={{ justifyContent: 'flex-start', paddingTop: 20 }}>
                          {card.heading && <div className="cs-mc-headline" style={{ whiteSpace: 'pre-line' }}>{card.heading}</div>}
                          <p className="cs-mc-desc">{card.body}</p>
                          {renderCTA()}
                        </div>
                      </div>
                    </div>
                  )
                }

                return null
              })}
            </div>
          </section>

          {/* ═══════════════ SECTION 4 — OTHER CASE STUDIES ═══════════════ */}
          <section className="cs-cases" ref={casesRef}>
            <div className="cs-cases-header">
              <div className="cs-cases-year">2021 — {new Date().getFullYear()}</div>
              <div className="cs-cases-title" ref={casesTitleRef}>
                <span className="cs-word-wrap"><span className="cs-word">Case </span></span>
                <span className="cs-word-wrap"><span className="cs-word">Studies</span></span>
              </div>
            </div>

            <div className="cs-cases-divider" />

            <div className="cs-cases-nav">
              <button className="cs-cases-nav-btn" aria-label="Previous" data-cursor-hover>←</button>
              <button className="cs-cases-nav-btn" aria-label="Next" data-cursor-hover>→</button>
            </div>

            <div className="cs-cases-cards">
              {otherCases.map((c, i) => (
                <a
                  key={c.slug || c._id}
                  href={`/case-study/${c.slug}`}
                  className={`cs-case-card cs-case-card-${i}`}
                  data-cursor-text="View →"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`/case-study/${c.slug}`)
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="cs-card-browser">
                    <div className="cs-browser-dots">
                      <span /><span /><span />
                    </div>
                    <div className="cs-browser-content" style={{ backgroundColor: c.accent || '#111720' }}>
                      <h3>{c.heroHeadline || c.name}</h3>
                      {c.description && <p>{c.description.slice(0, 80)}{c.description.length > 80 ? '...' : ''}</p>}
                    </div>
                  </div>
                  <div className="cs-card-name-pill">{c.name}</div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* Spacer for footer reveal */}
        <div style={{ height: '100vh' }} />
      </main>
    </>
  )
}

export default CaseStudy
