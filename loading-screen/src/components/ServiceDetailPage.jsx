import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import FooterCTA from './FooterCTA'
import { servicesData } from '../data/servicesData'
import { getService } from '../utils/api'
import { setGlobalLenis, getGlobalLenis } from './PageTransition'
import './ServiceDetailPage.css'

gsap.registerPlugin(ScrollTrigger)

// Service links for Working With Kyurex section
const serviceLinks = [
  { name: 'Web Development', slug: 'web-development', arrow: '→' },
  { name: 'AI Automation', slug: 'ai-automation', arrow: '→' },
  { name: 'Full Stack Products', slug: 'full-stack', arrow: '→' },
]

function ServiceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const lenisRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState(null)
  const accordionAutoOpened = useRef(false)
  const [service, setService] = useState(servicesData[slug] || servicesData['web-development'])
  const [loading, setLoading] = useState(true)
  const [accordionNumbers, setAccordionNumbers] = useState(
    service.approachItems.map((_, i) => String(i + 1).padStart(2, '0'))
  )

  useEffect(() => {
    if (service?.approachItems) {
      setAccordionNumbers(service.approachItems.map((_, i) => String(i + 1).padStart(2, '0')))
    }
  }, [service.approachItems])

  // Fetch service data from API and merge with static fields
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const staticData = servicesData[slug] || servicesData['web-development']
        const apiData = await getService(slug)
        if (apiData) {
          // Deep merge: API takes priority for editable fields,
          // static provides images and extended text not yet in DB
          setService({
            ...staticData,          // base: all static fields (images, para1, para2, quote)
            ...apiData,             // overlay: API fields override (name, hero, statement, vision title, approach, cards)
            // Prefer static fallback if API field is empty string / falsy
            statementImage: apiData.statementImage || staticData.statementImage,
            visionImage: apiData.visionImage || staticData.visionImage,
            visionQuote: apiData.visionQuote || staticData.visionQuote,
            visionPara1: apiData.visionPara1 || staticData.visionPara1,
            visionPara2: apiData.visionPara2 || staticData.visionPara2,
            // Prefer API arrays if they have content
            approachItems: (apiData.approachItems?.length > 0) ? apiData.approachItems : staticData.approachItems,
            serviceCards: (apiData.serviceCards?.length > 0) ? apiData.serviceCards : staticData.serviceCards,
          })
        } else {
          setService(staticData)
        }
      } catch (error) {
        console.warn('Failed to fetch service, using static data:', error)
        setService(servicesData[slug] || servicesData['web-development'])
      } finally {
        setLoading(false)
      }
    }
    fetchServiceData()
  }, [slug])

  // Hero refs
  const heroRef = useRef(null)
  const heroBgRef = useRef(null)
  const heroHeadingRef = useRef(null)
  const heroCharRefs = useRef([])
  const heroDividerRef = useRef(null)
  const heroDescriptionRef = useRef(null)
  const heroLinkRef = useRef(null)

  // Section divider refs
  const divider1Ref = useRef(null)
  const divider2Ref = useRef(null)
  const divider3Ref = useRef(null)
  const divider4Ref = useRef(null)

  // Statement Section refs (Part 2)
  const statementRef = useRef(null)
  const statementWordRefs = useRef([])
  const statementImageRef = useRef(null)
  const statementCurtainRef = useRef(null)
  const statementCurtainPurpleRef = useRef(null)

  // Vision Section refs (Part 3)
  const visionRef = useRef(null)
  const visionTitleRef = useRef(null)
  const visionDividerRef = useRef(null)
  const visionQuoteWordRefs = useRef([])
  const visionImageRef = useRef(null)
  const visionImageCurtainRef = useRef(null)
  const visionPara1Ref = useRef(null)
  const visionPara2Ref = useRef(null)

  // Approach Accordion refs (Part 4)
  const approachRef = useRef(null)
  const approachTitleRef = useRef(null)
  const approachLeftRef = useRef(null)
  const accordionItemRefs = useRef([])
  const accordionAnswerRefs = useRef([])
  const accordionNumRefs = useRef([])

  // Services Grid refs (Part 5)
  const servicesGridRef = useRef(null)
  const servicesLeftRef = useRef(null)
  const serviceCardRefs = useRef([])

  // Working With Kyurex refs (Part 6)
  const workingWithRef = useRef(null)
  const workingHeadingRef = useRef(null)
  const leftColRef = useRef(null)
  const centerColRef = useRef(null)
  const photoOverlayRef = useRef(null)
  const rightColRef = useRef(null)
  const serviceLinkArrowRefs = useRef([])

  // Initialize Lenis and ScrollTrigger on mount, cleanup on unmount
  useEffect(() => {
    // Kill existing ScrollTriggers from previous pages
    ScrollTrigger.getAll().forEach(t => t.kill())
    
    // Destroy existing Lenis if any
    const existingLenis = getGlobalLenis()
    if (existingLenis) {
      existingLenis.destroy()
    }

    // Create new Lenis instance
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
    setGlobalLenis(lenis)

    // Scroll to top on navigation
    window.scrollTo(0, 0)
    lenis.scrollTo(0, { immediate: true })

    // Sync Lenis scroll with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker drives Lenis
    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Parallax and rotation effects via Lenis
    const isMobile = window.innerWidth <= 992
    const handleLenisScroll = ({ scroll }) => {
      // Hero background parallax (slower than main scroll)
      if (heroBgRef.current) {
        gsap.set(heroBgRef.current, { y: scroll * 0.4 })
      }

      // Vision image parallax — use viewport-relative offset instead of absolute scroll
      if (!isMobile && visionImageRef.current) {
        const rect = visionImageRef.current.getBoundingClientRect()
        const viewportCenter = window.innerHeight / 2
        const offset = (rect.top + rect.height / 2 - viewportCenter) / viewportCenter
        gsap.set(visionImageRef.current, { y: offset * -40 }) // Subtle parallax ±40px
      }

      // Vision image rotation parallax — disabled on mobile
      if (!isMobile) {
        const visionImageEl = visionImageRef.current?.querySelector('.sdp-vision-image')
        if (visionImageEl) {
          const rect = visionImageRef.current.getBoundingClientRect()
          const centerY = rect.top + rect.height / 2
          const viewportCenter = window.innerHeight / 2
          const offset = (centerY - viewportCenter) / viewportCenter
          gsap.set(visionImageEl, { rotation: offset * 3 }) // Subtle rotation ±3deg
        }
      }
    }
    lenis.on('scroll', handleLenisScroll)

    // Refresh ScrollTrigger after mount
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)

    return () => {
      clearTimeout(refreshTimer)
      gsap.ticker.remove(rafCallback)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.off('scroll', handleLenisScroll)
      ScrollTrigger.getAll().forEach(t => t.kill())
      setGlobalLenis(null)
      lenis.destroy()
    }
  }, [slug])

  // All animations
  useEffect(() => {
    if (loading) return // wait for API data to finish merging before running GSAP

    const ctx = gsap.context(() => {
      // ==================== PART 1: HERO ANIMATIONS ====================
      // Character-by-character slam entrance
      const heroChars = heroCharRefs.current.filter(Boolean)
      if (heroChars.length > 0) {
        gsap.fromTo(heroChars,
          { y: 120, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.03,
            ease: 'power4.out',
            delay: 0.25
          }
        )
      }

      // Divider draws from left
      gsap.fromTo(heroDividerRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut', delay: 0.45 }
      )

      // Description fades in
      gsap.fromTo(heroDescriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.55 }
      )

      // Start a Project link fades in
      gsap.fromTo(heroLinkRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.65 }
      )

      // Section dividers - left to right draw
      const allDividers = [divider1Ref, divider2Ref, divider3Ref, divider4Ref]
      allDividers.forEach((divRef) => {
        if (divRef.current) {
          gsap.fromTo(divRef.current,
            { scaleX: 0, transformOrigin: 'left' },
            {
              scaleX: 1,
              duration: 0.8,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: divRef.current,
                start: 'top 85%',
                once: true
              }
            }
          )
        }
      })

      // ==================== PART 2: STATEMENT SECTION ====================
      // Two-tone curtain reveal: Purple first, then dark
      if (statementCurtainPurpleRef.current && statementCurtainRef.current) {
        const curtainTL = gsap.timeline({
          scrollTrigger: {
            trigger: statementImageRef.current,
            start: 'top 70%',
            once: true
          }
        })
        
        // Purple curtain sweeps right to left first
        curtainTL.fromTo(statementCurtainPurpleRef.current,
          { x: '0%' },
          { x: '-100%', duration: 0.6, ease: 'power3.inOut' }
        )
        // Then dark curtain follows
        .fromTo(statementCurtainRef.current,
          { x: '0%' },
          { x: '-100%', duration: 0.6, ease: 'power3.inOut' },
          '-=0.3' // Overlap slightly
        )
      }

      // Word opacity scroll effect - first half bright, second half dim
      if (statementWordRefs.current.length > 0) {
        const words = statementWordRefs.current.filter(Boolean)
        const halfLength = Math.floor(words.length / 2)
        
        words.forEach((word, i) => {
          if (word) {
            // First half starts bright, second half starts dim
            const startOpacity = i < halfLength ? 1 : 0.15
            word.style.opacity = startOpacity
            
            // Only animate the second half (dimmed words)
            if (i >= halfLength) {
              gsap.to(word, {
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: statementRef.current,
                  start: `top ${80 - ((i - halfLength) * 3)}%`,
                  end: `top ${50 - ((i - halfLength) * 3)}%`,
                  scrub: 1.5
                }
              })
            }
          }
        })
      }

      // ==================== PART 3: VISION SECTION ====================
      // Title blur + scale reveal
      if (visionTitleRef.current) {
        gsap.fromTo(visionTitleRef.current,
          { filter: 'blur(20px)', opacity: 0, scale: 0.94 },
          {
            filter: 'blur(0px)',
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: visionTitleRef.current,
              start: 'top 75%',
              once: true
            }
          }
        )
      }

      // Vision divider draw
      if (visionDividerRef.current) {
        gsap.fromTo(visionDividerRef.current,
          { scaleX: 0, transformOrigin: 'left' },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: visionDividerRef.current,
              start: 'top 80%',
              once: true
            }
          }
        )
      }

      // Vision quote word opacity effect
      if (visionQuoteWordRefs.current.length > 0) {
        const words = visionQuoteWordRefs.current.filter(Boolean)
        const isMobileView = window.innerWidth <= 992
        
        // Set all words to ghost state initially
        gsap.set(words, { opacity: 0.08, y: 4, color: '#999' })
        
        if (isMobileView) {
          // On mobile, reveal all words together with a simple stagger
          ScrollTrigger.create({
            trigger: words[0]?.parentElement,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(words, {
                opacity: 1,
                y: 0,
                color: '#0a0a0a',
                duration: 0.4,
                stagger: 0.02,
                ease: 'power2.out'
              })
            }
          })
        } else {
          // Desktop: staggered trigger points across scroll distance
          const scrollRange = 60
          const stepSize = scrollRange / words.length
          
          words.forEach((word, i) => {
            const startPoint = 80 - (i * stepSize)
            
            ScrollTrigger.create({
              trigger: word.parentElement,
              start: `top ${startPoint}%`,
              once: true,
              onEnter: () => {
                gsap.to(word, {
                  opacity: 1,
                  y: 0,
                  color: '#0a0a0a',
                  duration: 0.3,
                  ease: 'power2.out'
                })
              }
            })
          })
        }
      }

      // Vision paragraphs clip-path wipe-up reveal
      gsap.fromTo(visionPara1Ref.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: visionPara1Ref.current,
            start: 'top 80%',
            once: true
          }
        }
      )

      gsap.fromTo(visionPara2Ref.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: visionPara2Ref.current,
            start: 'top 80%',
            once: true
          }
        }
      )

      // Vision image curtain reveal
      if (visionImageCurtainRef.current) {
        gsap.fromTo(visionImageCurtainRef.current,
          { scaleY: 1, transformOrigin: 'top' },
          {
            scaleY: 0,
            duration: 1.4,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: visionImageRef.current,
              start: 'top 75%',
              once: true
            }
          }
        )
      }

      // ==================== PART 4: ACCORDION ANIMATIONS ====================
      // Approach title entrance animation
      if (approachTitleRef.current) {
        gsap.fromTo(approachTitleRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: approachRef.current,
              start: 'top 70%',
              once: true
            }
          }
        )

        // Sticky title fade on scroll away
        ScrollTrigger.create({
          trigger: approachRef.current,
          start: 'top 20%',
          end: 'bottom 40%',
          onUpdate: (self) => {
            const progress = self.progress
            if (approachLeftRef.current) {
              gsap.set(approachLeftRef.current, { 
                opacity: progress > 0.85 ? 1 - ((progress - 0.85) * 6.67) : 1 
              })
            }
          }
        })
      }

      // Accordion items stagger in
      accordionItemRefs.current.forEach((item, i) => {
        if (item) {
          gsap.fromTo(item,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true
              },
              delay: i * 0.08
            }
          )
        }
      })

      // Number scramble effect - trigger when accordion enters view
      const scrambleNumbers = () => {
        const finalNumbers = service.approachItems.map((_, i) => String(i + 1).padStart(2, '0'))
        const chars = '0123456789'
        
        finalNumbers.forEach((final, index) => {
          let iterations = 0
          const maxIterations = 10 + (index * 3)
          
          const interval = setInterval(() => {
            const scrambled = final.split('').map((char, charIndex) => {
              if (iterations > maxIterations - (2 - charIndex) * 2) {
                return char
              }
              return chars[Math.floor(Math.random() * chars.length)]
            }).join('')
            
            setAccordionNumbers(prev => {
              const newNums = [...prev]
              newNums[index] = scrambled
              return newNums
            })
            
            iterations++
            if (iterations >= maxIterations) {
              clearInterval(interval)
              setAccordionNumbers(prev => {
                const newNums = [...prev]
                newNums[index] = final
                return newNums
              })
            }
          }, 40)
        })
      }

      ScrollTrigger.create({
        trigger: approachRef.current,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          scrambleNumbers()
        }
      })

      // Auto-open first accordion item when section scrolls into view
      ScrollTrigger.create({
        trigger: approachRef.current,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          if (!accordionAutoOpened.current) {
            setTimeout(() => {
              handleAccordionClick(0)
              accordionAutoOpened.current = true
            }, 300)
          }
        }
      })

      // ==================== PART 5: SERVICES GRID ANIMATIONS ====================
      // Sticky title fade on scroll away
      if (servicesLeftRef.current) {
        ScrollTrigger.create({
          trigger: servicesGridRef.current,
          start: 'top 20%',
          end: 'bottom 40%',
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(servicesLeftRef.current, { 
              opacity: progress > 0.85 ? 1 - ((progress - 0.85) * 6.67) : 1 
            })
          }
        })
      }

      // Alternating card entrances - odd from left, even from right
      serviceCardRefs.current.forEach((card, i) => {
        if (card) {
          const fromLeft = i % 2 === 0
          gsap.fromTo(card,
            { x: fromLeft ? -40 : 40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true
              },
              delay: i * 0.08
            }
          )
        }
      })

      // Service card hover effects (desktop only)
      const createdBorderAccents = []
      if (window.innerWidth > 768) {
        serviceCardRefs.current.forEach((card) => {
          if (!card || card.classList.contains('sdp-service-card--empty')) return

          const title = card.querySelector('.sdp-service-card-title')
          const divider = card.querySelector('.sdp-service-card-divider')

          // Create border accent element
          const borderAccent = document.createElement('div')
          borderAccent.className = 'sdp-card-border-accent'
          card.appendChild(borderAccent)
          createdBorderAccents.push(borderAccent)

          const onEnter = () => {
            // Border slides up
            gsap.to(borderAccent, {
              scaleY: 1,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: true
            })
            // Title shifts right
            if (title) {
              gsap.to(title, {
                x: 10,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true
              })
            }
            // Divider color flash
            if (divider) {
              gsap.to(divider, {
                backgroundColor: '#6d28d9',
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true,
                onComplete: () => {
                  gsap.to(divider, {
                    backgroundColor: '#ebebeb',
                    duration: 0.4,
                    ease: 'power2.inOut'
                  })
                }
              })
            }
          }

          const onLeave = () => {
            // Border slides back down
            gsap.to(borderAccent, {
              scaleY: 0,
              duration: 0.3,
              ease: 'power2.inOut',
              overwrite: true
            })
            // Title returns
            if (title) {
              gsap.to(title, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true
              })
            }
          }

          card.addEventListener('mouseenter', onEnter, { passive: true })
          card.addEventListener('mouseleave', onLeave, { passive: true })
        })
      }

      // Store cleanup for border accents
      const cleanupBorderAccents = () => {
        createdBorderAccents.forEach(el => el?.remove())
      }

      // ==================== PART 6: WORKING WITH KYUREX ANIMATIONS ====================
      // Section heading
      gsap.fromTo(workingHeadingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: workingWithRef.current,
            start: 'top 70%',
            once: true
          }
        }
      )

      // Left column links stagger in
      const serviceLinksEl = leftColRef.current?.querySelectorAll('.sdp-service-link')
      if (serviceLinksEl) {
        gsap.fromTo(serviceLinksEl,
          { x: -30, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 70%',
              once: true
            }
          }
        )
      }

      // Center photo curtain reveal
      if (photoOverlayRef.current) {
        gsap.fromTo(photoOverlayRef.current,
          { scaleY: 1, transformOrigin: 'bottom' },
          {
            scaleY: 0,
            duration: 1.2,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: centerColRef.current,
              start: 'top 70%',
              once: true
            }
          }
        )
      }

      // Right quote fades in
      gsap.fromTo(rightColRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rightColRef.current,
            start: 'top 70%',
            once: true
          }
        }
      )

    }, pageRef)

    return () => {
      ctx.revert()
      // Cleanup border accent elements
      document.querySelectorAll('.sdp-card-border-accent').forEach(el => el.remove())
    }
  }, [service, loading]) // Re-run animations when service data updates from API

  // Accordion toggle handler
  const handleAccordionClick = (index) => {
    const prevIndex = activeAccordion
    setActiveAccordion(activeAccordion === index ? null : index)

    // Close previous
    if (prevIndex !== null && accordionAnswerRefs.current[prevIndex]) {
      gsap.to(accordionAnswerRefs.current[prevIndex], {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.inOut'
      })
    }

    // Open new (if different or if opening for first time)
    if (index !== prevIndex && accordionAnswerRefs.current[index]) {
      gsap.to(accordionAnswerRefs.current[index], {
        height: 'auto',
        opacity: 1,
        duration: 0.45,
        ease: 'power3.inOut'
      })
    }
  }

  // Service link hover handlers
  const handleServiceHover = (index) => {
    const arrow = serviceLinkArrowRefs.current[index]
    if (arrow) {
      gsap.to(arrow, { x: 6, duration: 0.3, ease: 'power2.out' })
    }
  }

  const handleServiceLeave = (index) => {
    const arrow = serviceLinkArrowRefs.current[index]
    if (arrow) {
      gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' })
    }
  }

  const handleServiceClick = (serviceSlug) => {
    if (serviceSlug !== slug) {
      navigate(`/services/${serviceSlug}`)
    }
  }

  // Split text into word spans helper
  const renderWordSpans = (text, refsArray) => {
    return text.split(' ').map((word, i) => (
      <span 
        key={i} 
        className="sdp-word"
        ref={el => refsArray.current[i] = el}
      >
        {word}{' '}
      </span>
    ))
  }

  // Split text into character spans helper for hero
  const renderCharSpans = useCallback((text) => {
    heroCharRefs.current = []
    return text.split('').map((char, i) => (
      <span 
        key={i} 
        className="sdp-hero-char"
        ref={el => heroCharRefs.current[i] = el}
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }, [])

  // Clear arrays before render to prevent stale refs on re-render 
  statementWordRefs.current = []
  visionQuoteWordRefs.current = []
  accordionItemRefs.current = []
  accordionAnswerRefs.current = []
  accordionNumRefs.current = []
  serviceCardRefs.current = []
  const serviceLinksArrowArray = leftColRef.current?.querySelectorAll ? true : false;
  if(serviceLinksArrowArray) serviceLinkArrowRefs.current = []

  return (
    <>
      <CustomCursor />
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />
      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* FOOTER fixed at bottom */}
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
      <main className="service-detail-page" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} ref={pageRef}>
        <div style={{ pointerEvents: 'auto' }}>

          {/* ==================== PART 1: HERO HEADER ==================== */}
          <section className="sdp-hero" ref={heroRef} data-cursor-theme="dark">
            <div className="sdp-hero-bg" ref={heroBgRef}></div>
            <div className="sdp-hero-content">
              <h1 className="sdp-hero-heading" ref={heroHeadingRef}>
                {renderCharSpans(service.name)}
              </h1>
              <div className="sdp-hero-divider" ref={heroDividerRef}></div>
              <div className="sdp-hero-row">
                <p className="sdp-hero-description" ref={heroDescriptionRef}>
                  {service.heroDescription}
                </p>
                <a href="/contact" className="sdp-hero-link" ref={heroLinkRef} data-cursor-hover>
                  Start a Project <span className="sdp-hero-arrow">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="sdp-section-divider" ref={divider1Ref}></div>

          {/* ==================== PART 2: STATEMENT SECTION ==================== */}
          <section className="sdp-statement" ref={statementRef} data-cursor-theme="dark">
            <div className="sdp-statement-left">
              <span className="sdp-statement-breadcrumb">• KYUREX AGENCY /</span>
              <p className="sdp-statement-text">
                {renderWordSpans(service.statementText, statementWordRefs)}
              </p>
            </div>
            <div className="sdp-statement-right">
              <div className="sdp-statement-image-wrapper" ref={statementImageRef}>
                <img 
                  src={service.statementImage} 
                  alt={`${service.name} visualization`}
                  className="sdp-statement-image"
                />
                <div className="sdp-statement-curtain-purple" ref={statementCurtainPurpleRef}></div>
                <div className="sdp-statement-curtain" ref={statementCurtainRef}></div>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="sdp-section-divider" ref={divider2Ref}></div>

          {/* ==================== PART 3: VISION SECTION ==================== */}
          <section className="sdp-vision" ref={visionRef} data-cursor-theme="light">
            <h2 className="sdp-vision-title" ref={visionTitleRef}>
              {service.visionTitle}
            </h2>
            <div className="sdp-vision-divider" ref={visionDividerRef}></div>
            
            <p className="sdp-vision-quote">
              {renderWordSpans(service.visionQuote, visionQuoteWordRefs)}
            </p>

            <div className="sdp-vision-grid">
              <div className="sdp-vision-image-col">
                <div className="sdp-vision-image-wrapper" ref={visionImageRef}>
                  <img 
                    src={service.visionImage}
                    alt={`${service.name} vision`}
                    className="sdp-vision-image"
                  />
                  <div className="sdp-vision-image-curtain" ref={visionImageCurtainRef}></div>
                </div>
              </div>
              <div className="sdp-vision-para-col">
                <p className="sdp-vision-para" ref={visionPara1Ref}>
                  {service.visionPara1}
                </p>
              </div>
              <div className="sdp-vision-para-col">
                <p className="sdp-vision-para" ref={visionPara2Ref}>
                  {service.visionPara2}
                </p>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="sdp-section-divider" ref={divider3Ref}></div>

          {/* ==================== PART 4: OUR APPROACH ACCORDION ==================== */}
          <section className="sdp-approach" ref={approachRef} data-cursor-theme="light">
            <div className="sdp-approach-left" ref={approachLeftRef}>
              <h2 className="sdp-approach-title" ref={approachTitleRef}>
                Our<br />Approach
              </h2>
            </div>
            <div className="sdp-approach-right">
              {service.approachItems.map((item, index) => (
                <div 
                  key={item.num} 
                  className={`sdp-accordion-item ${activeAccordion === index ? 'active' : ''}`}
                  ref={el => accordionItemRefs.current[index] = el}
                >
                  <div 
                    className="sdp-accordion-header"
                    onClick={() => handleAccordionClick(index)}
                    data-cursor-hover
                  >
                    <span 
                      className="sdp-accordion-num"
                      ref={el => accordionNumRefs.current[index] = el}
                    >
                      {accordionNumbers[index]}
                    </span>
                    <span className="sdp-accordion-question">{item.question}</span>
                    <span className="sdp-accordion-icon">
                      {activeAccordion === index ? '−' : '+'}
                    </span>
                  </div>
                  <div 
                    className="sdp-accordion-answer"
                    ref={el => accordionAnswerRefs.current[index] = el}
                  >
                    <p>{item.answer}</p>
                  </div>
                  <div className="sdp-accordion-divider"></div>
                </div>
              ))}
            </div>
          </section>

          {/* ==================== PART 5: DESIGN SERVICES GRID ==================== */}
          <section className="sdp-services-grid" ref={servicesGridRef} data-cursor-theme="light">
            <div className="sdp-services-left" ref={servicesLeftRef}>
              <h2 className="sdp-services-title">
                {service.name.split(' ')[0]}<br />Services
              </h2>
            </div>
            <div className="sdp-services-right">
              <div className="sdp-services-cards">
                {service.serviceCards.map((card, index) => (
                  card.title ? (
                    <div 
                      key={index}
                      className="sdp-service-card"
                      ref={el => serviceCardRefs.current[index] = el}
                    >
                      <h4 className="sdp-service-card-title">{card.title}</h4>
                      <p className="sdp-service-card-desc">{card.description}</p>
                      <div className="sdp-service-card-divider"></div>
                    </div>
                  ) : (
                    <div 
                      key={index}
                      className="sdp-service-card sdp-service-card--empty"
                      ref={el => serviceCardRefs.current[index] = el}
                    ></div>
                  )
                ))}
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="sdp-section-divider" ref={divider4Ref}></div>

          {/* ==================== PART 6: WORKING WITH KYUREX ==================== */}
          <section className="sdp-working-with" ref={workingWithRef} data-cursor-theme="dark">
            <h2 className="sdp-working-heading" ref={workingHeadingRef}>
              Working with Kyurex
            </h2>
            <div className="sdp-working-divider"></div>

            <div className="sdp-working-grid">
              {/* Left Column */}
              <div className="sdp-working-left" ref={leftColRef}>
                <p className="sdp-working-label">
                  Learn more about Kyurex Services
                </p>
                <div className="sdp-service-links">
                  {serviceLinks.map((link, index) => (
                    <a 
                      key={link.name}
                      href={`/services/${link.slug}`}
                      className={`sdp-service-link ${link.slug === slug ? 'active' : ''}`}
                      data-cursor-hover
                      onMouseEnter={() => handleServiceHover(index)}
                      onMouseLeave={() => handleServiceLeave(index)}
                      onClick={(e) => {
                        e.preventDefault()
                        handleServiceClick(link.slug)
                      }}
                    >
                      <span>{link.name}</span>
                      <span 
                        className="sdp-service-arrow"
                        ref={el => serviceLinkArrowRefs.current[index] = el}
                      >
                        {link.arrow}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Center Column - Photo */}
              <div className="sdp-working-center" ref={centerColRef}>
                <div className="sdp-photo-wrapper">
                  <img 
                    src="https://picsum.photos/seed/kyurex-service/400/500"
                    alt="Kyurex Team"
                    className="sdp-team-photo"
                  />
                  <div className="sdp-photo-overlay" ref={photoOverlayRef}></div>
                </div>
              </div>

              {/* Right Column - Testimonial */}
              <div className="sdp-working-right" ref={rightColRef}>
                <p className="sdp-testimonial-quote">
                  Working with Kyurex was an absolute shift in how we think about product. 
                  They didn't just execute — they brought structure, intelligence, and genuine 
                  care to every phase of the project. The result exceeded what we thought was possible.
                </p>
                <p className="sdp-testimonial-name">Alex Morrison</p>
                <p className="sdp-testimonial-company">TechVentures – Series A Startup</p>
              </div>
            </div>
          </section>

        </div>

        {/* Spacer - allows scrolling to reveal fixed footer */}
        <div style={{ height: '100vh' }} />
      </main>
    </>
  )
}

export default ServiceDetailPage
