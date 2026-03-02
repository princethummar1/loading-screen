import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import FooterCTA from './FooterCTA'
import MagneticIcon from './MagneticIcon'
import { setGlobalLenis, getGlobalLenis } from './PageTransition'
import { getArticles } from '../utils/api'
import './NewsInsightsPage.css'

gsap.registerPlugin(ScrollTrigger)

// Static fallback for horizontal scroll articles (3 cards)
const staticHorizontalArticles = [
  {
    slug: 'award-winning-website-pays-for-itself',
    category: 'INSIGHTS',
    date: 'Feb 19, 2026',
    title: 'When an Award-Winning Website Pays for Itself (Twice)',
    image: 'https://picsum.photos/seed/horiz1/1400/900',
  },
  {
    slug: 'ai-automation-reshaping-agency-model',
    category: 'AI',
    date: 'Jan 21, 2026',
    title: 'How AI Automation Is Reshaping the Agency Model',
    image: 'https://picsum.photos/seed/horiz2/1400/900',
  },
  {
    slug: 'venture-capital-websites-failing',
    category: 'NEWS',
    date: 'Dec 10, 2025',
    title: 'Why Venture Capital Websites Are Failing and How to Fix It',
    image: 'https://picsum.photos/seed/horiz3/1400/900',
  },
]



// Other articles 3-card grid
const staticOtherArticles = [
  {
    slug: 'optimize-content-ai-search',
    image: 'https://picsum.photos/seed/article-a/600/450',
    category: 'INSIGHTS',
    date: '8.6.25',
    title: 'How to Optimize Content for AI-Powered Search?',
    readTime: '4 MIN READ',
  },
  {
    slug: 'award-winning-website-pays-for-itself',
    image: 'https://picsum.photos/seed/article-b/600/450',
    category: 'INSIGHTS',
    date: '2.19.25',
    title: 'When an Award-Winning Website Pays for Itself',
    readTime: '7 MIN READ',
  },
  {
    slug: '2025-playbook-startups-brand-strategy',
    image: 'https://picsum.photos/seed/article-c/600/450',
    category: 'INSIGHTS',
    date: '1.21.25',
    title: '2025 Playbook: How Startups Can Thrive with Brand Strategy',
    readTime: '11 MIN READ',
  },
]

// Archive articles
const staticArchiveArticles = [
  {
    slug: 'optimize-content-ai-search',
    category: 'INSIGHTS',
    date: 'Aug 6',
    title: 'How to Optimize Content for AI-Powered Search?',
    excerpt: 'SEO is evolving fast. Discover how AEO and GEO help your content stay visible in AI-powered search environments.',
    readTime: '4 min',
  },
  {
    slug: 'venture-capital-websites-failing',
    category: 'NEWS',
    date: 'Mar 20',
    title: 'Break the Mold or Fade Away: Why Boldness Wins',
    excerpt: 'In a world where decent is the new basic, only bold brands stand out. Learn how smart disruption drives growth.',
    readTime: '7 min',
  },
  {
    slug: 'award-winning-website-pays-for-itself',
    category: 'INSIGHTS',
    date: 'Feb 14',
    title: 'The Hidden ROI of Premium Web Design',
    excerpt: 'Cheap websites cost more in the long run. We break down the real numbers behind investing in quality.',
    readTime: '5 min',
  },
  {
    slug: 'ai-automation-reshaping-agency-model',
    category: 'AI',
    date: 'Jan 28',
    title: 'How AI Automation Saved Our Clients 40 Hours Per Week',
    excerpt: 'Real case studies showing where intelligent automation creates the most measurable impact for growing businesses.',
    readTime: '6 min',
  },
  {
    slug: 'psychology-white-space-premium-design',
    category: 'NEWS',
    date: 'Jan 10',
    title: 'Kyurex Launches Full Stack AI Product Studio',
    excerpt: 'We expanded our service offering to include end-to-end AI-powered SaaS product development for ambitious founders.',
    readTime: '3 min',
  },
  {
    slug: 'communication-gap-costing-millions',
    category: 'INSIGHTS',
    date: 'Dec 18',
    title: 'Why Your Website Needs to Feel Like a Product',
    excerpt: 'The lines between website and product have dissolved. Here is how to build digital presence that performs like software.',
    readTime: '8 min',
  },
]

// Archive filter categories
const archiveCategories = [
  'ALL',
  'GENERAL',
  'WEB DESIGN',
  'AI AUTOMATION',
  'CREATIVE DEVELOPMENT',
  'MARKETING',
  'ARTIFICIAL INTELLIGENCE (AI)',
  'AGENCY LIFE',
]

function NewsInsightsPage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const lenisRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeArchiveCategory, setActiveArchiveCategory] = useState('ALL')
  const [inputFocused, setInputFocused] = useState(false)
  
  // Articles state - fetched from API with static fallback
  const [horizontalArticles, setHorizontalArticles] = useState(staticHorizontalArticles)
  const [otherArticles, setOtherArticles] = useState(staticOtherArticles)
  const [archiveArticles, setArchiveArticles] = useState(staticArchiveArticles)
  const [articlesLoaded, setArticlesLoaded] = useState(false)

  // Fetch articles from API on mount
  useEffect(() => {
    async function fetchArticles() {
      try {
        const allArticles = await getArticles()
        if (allArticles && allArticles.length > 0) {
          // Map API data to match static data shape
          const mapped = allArticles.map(a => ({
            slug: a.slug,
            category: a.category?.toUpperCase() || 'INSIGHTS',
            date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
            title: a.title,
            image: a.image || a.heroImage || `https://picsum.photos/seed/${a.slug}/1400/900`,
            excerpt: a.subtitle || a.excerpt || '',
            readTime: a.readTime || '5 min',
            featuredNewsTop: a.featuredNewsTop,
            featuredNewsOther: a.featuredNewsOther
          }))
          
          // Distribute articles to different sections
          const topFeatures = mapped.filter(a => a.featuredNewsTop);
          const otherFeatures = mapped.filter(a => a.featuredNewsOther && !a.featuredNewsTop);
          const remaining = mapped.filter(a => !a.featuredNewsTop && !a.featuredNewsOther);

          // Top horizontal needs up to 3
          const horizontal = [...topFeatures, ...remaining].slice(0, 3);
          setHorizontalArticles(horizontal);

          // Grid needs up to 3
          const usedSlugMap = new Set(horizontal.map(a => a.slug));
          const availableOther = [...otherFeatures, ...remaining].filter(a => !usedSlugMap.has(a.slug));
          const grid = availableOther.slice(0, 3);
          setOtherArticles(grid);

          // Rest goes to archive
          const usedGridSlugMap = new Set([...horizontal.map(a => a.slug), ...grid.map(a => a.slug)]);
          const archive = mapped.filter(a => !usedGridSlugMap.has(a.slug));
          setArchiveArticles(archive);
        }
      } catch (error) {
        console.warn('Failed to fetch articles, using static data:', error)
      } finally {
        setArticlesLoaded(true)
      }
    }
    fetchArticles()
  }, [])

  // Section refs
  const heroRef = useRef(null)
  const letterRefs = useRef([])
  const subtextRef = useRef(null)

  // Horizontal scroll refs
  const horizontalRef = useRef(null)
  const horizontalTrackRef = useRef(null)
  const horizontalCardRefs = useRef([])
  const horizontalCurtainPurpleRefs = useRef([])
  const horizontalCurtainDarkRefs = useRef([])
  const horizontalContentRefs = useRef([])
  const horizontalNumberRefs = useRef([])
  const progressDotsRef = useRef(null)
  const [activeHorizCard, setActiveHorizCard] = useState(0)

  // Ignite section refs
  const igniteRef = useRef(null)
  const igniteTextRef = useRef(null)
  const igniteSweepRef = useRef(null)
  const igniteCharRefs = useRef([])
  const igniteStatsRef = useRef(null)

  // Deck section refs
  const deckRef = useRef(null)
  const deckCardRefs = useRef([])

  // Other articles refs
  const otherArticlesRef = useRef(null)
  const otherCardRefs = useRef([])
  const otherCurtainRefs = useRef([])

  // Archive refs
  const archiveRef = useRef(null)
  const archiveHeadingRef = useRef(null)
  const archiveRowRefs = useRef([])
  const archiveDividerRefs = useRef([])
  const archiveFilterRefs = useRef([])
  const archiveIndicatorRef = useRef(null)

  // CTA section refs
  const ctaRef = useRef(null)
  const ctaLetterRefs = useRef([])
  const ctaSubtextRef = useRef(null)
  const ctaFormRef = useRef(null)
  const ctaInputRef = useRef(null)
  const ctaUnderlineRef = useRef(null)
  const ctaArrowRef = useRef(null)

  // Generate random positions for letters
  const generateRandomPosition = useCallback(() => ({
    x: (Math.random() - 0.5) * window.innerWidth * 0.8,
    y: (Math.random() - 0.5) * window.innerHeight * 0.8,
    rotation: (Math.random() - 0.5) * 90,
    opacity: 0.1 + Math.random() * 0.2,
    scale: 0.5 + Math.random() * 0.5,
  }), [])

  // Initialize Lenis and ScrollTrigger
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
    
    ScrollTrigger.getAll().forEach(t => t.kill())
    
    const existingLenis = getGlobalLenis()
    if (existingLenis) existingLenis.destroy()

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

    lenis.on('scroll', ScrollTrigger.update)

    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after initial render
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 500)

    // Handle resize
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true)
      }, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(refreshTimer)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      gsap.ticker.remove(rafCallback)
      lenis.off('scroll', ScrollTrigger.update)
      ScrollTrigger.getAll().forEach(t => t.kill())
      setGlobalLenis(null)
      lenis.destroy()
    }
  }, [])

  // Hero letter assembly animation
  useEffect(() => {
    const letters = letterRefs.current.filter(Boolean)
    if (letters.length === 0) return

    const ctx = gsap.context(() => {
      // Set initial random positions for all letters
      letters.forEach((letter) => {
        const pos = generateRandomPosition()
        gsap.set(letter, {
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          opacity: pos.opacity,
          scale: pos.scale,
        })
      })

      // Animate letters to their correct positions
      const centerIndex = Math.floor(letters.length / 2)
      letters.forEach((letter, i) => {
        const distanceFromCenter = Math.abs(i - centerIndex)
        gsap.to(letter, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          delay: distanceFromCenter * 0.03,
          ease: 'power4.out',
        })
      })

      // Subtext fade in
      gsap.fromTo(subtextRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.6 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [generateRandomPosition])

  // Mouse repel effect on hero letters
  useEffect(() => {
    const letters = letterRefs.current.filter(Boolean)
    const hero = heroRef.current
    if (!hero || letters.length === 0) return

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      letters.forEach((letter) => {
        const letterRect = letter.getBoundingClientRect()
        const letterCenterX = letterRect.left + letterRect.width / 2 - rect.left
        const letterCenterY = letterRect.top + letterRect.height / 2 - rect.top

        const distance = Math.sqrt(
          Math.pow(mouseX - letterCenterX, 2) + 
          Math.pow(mouseY - letterCenterY, 2)
        )

        const maxDistance = 150
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 15
          const angle = Math.atan2(letterCenterY - mouseY, letterCenterX - mouseX)
          const offsetX = Math.cos(angle) * force
          const offsetY = Math.sin(angle) * force

          gsap.to(letter, {
            x: offsetX,
            y: offsetY,
            duration: 0.6,
            ease: 'power2.out',
          })
        } else {
          gsap.to(letter, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
      })
    }

    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Horizontal scroll animation
  useEffect(() => {
    const track = horizontalTrackRef.current
    const section = horizontalRef.current
    const cards = horizontalCardRefs.current.filter(Boolean)
    const curtainsPurple = horizontalCurtainPurpleRefs.current.filter(Boolean)
    const curtainsDark = horizontalCurtainDarkRefs.current.filter(Boolean)
    const contents = horizontalContentRefs.current.filter(Boolean)
    const numbers = horizontalNumberRefs.current.filter(Boolean)
    const dotsContainer = progressDotsRef.current
    if (!track || !section || cards.length === 0) return

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth
      const viewportWidth = window.innerWidth
      const scrollDistance = totalWidth - viewportWidth

      // Main horizontal scroll tween
      const horizontalTween = gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => dotsContainer?.classList.add('visible'),
          onLeave: () => dotsContainer?.classList.remove('visible'),
          onEnterBack: () => dotsContainer?.classList.add('visible'),
          onLeaveBack: () => dotsContainer?.classList.remove('visible'),
          onUpdate: (self) => {
            const progress = self.progress
            let newActive = 0
            if (progress < 0.33) newActive = 0
            else if (progress < 0.66) newActive = 1
            else newActive = 2
            setActiveHorizCard(newActive)
          }
        }
      })

      // Per-card animations
      cards.forEach((card, i) => {
        const image = card.querySelector('.nip-horiz-card-bg')
        const curtainPurple = curtainsPurple[i]
        const curtainDark = curtainsDark[i]
        const content = contents[i]
        const number = numbers[i]
        const contentItems = content?.querySelectorAll('.nip-horiz-content-item')

        // Background parallax (30% to 70%)
        if (image) {
          gsap.fromTo(image,
            { backgroundPositionX: '30%' },
            {
              backgroundPositionX: '70%',
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: 'left 100%',
                end: 'left -50%',
                scrub: 1,
              }
            }
          )
        }

        // Curtain reveal when card reaches center
        // First card triggers on section enter since it's already visible
        if (i === 0) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              const tl = gsap.timeline({ delay: 0.3 })
              
              tl.to(curtainPurple, {
                x: '-100%',
                duration: 0.6,
                ease: 'power4.inOut'
              })
              
              tl.to(curtainDark, {
                x: '-100%',
                duration: 0.5,
                ease: 'power4.inOut'
              }, '-=0.2')

              tl.to(number, {
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out'
              }, '-=0.3')

              if (contentItems && contentItems.length > 0) {
                tl.to(contentItems, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: 'power3.out'
                }, '-=0.2')
              }
            }
          })
        } else {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left center',
            once: true,
            onEnter: () => {
              const tl = gsap.timeline()
              
              tl.to(curtainPurple, {
                x: '-100%',
                duration: 0.6,
                ease: 'power4.inOut'
              })
              
              tl.to(curtainDark, {
                x: '-100%',
                duration: 0.5,
                ease: 'power4.inOut'
              }, '-=0.2')

              tl.to(number, {
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out'
              }, '-=0.3')

              if (contentItems && contentItems.length > 0) {
                tl.to(contentItems, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: 'power3.out'
                }, '-=0.2')
              }
            }
          })
        }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // Ignite text sweep animation
  useEffect(() => {
    const section = igniteRef.current
    const chars = igniteCharRefs.current.filter(Boolean)
    const sweep = igniteSweepRef.current
    const stats = igniteStatsRef.current
    if (!section || chars.length === 0 || !sweep) return

    const ctx = gsap.context(() => {
      // Set initial ghost state
      chars.forEach(char => {
        gsap.set(char, {
          color: 'transparent',
          webkitTextStroke: '1px rgba(255,255,255,0.2)',
        })
      })

      // Sweep animation timeline
      const sweepTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          once: true,
        }
      })

      // Animate sweep across
      sweepTl.fromTo(sweep,
        { x: '-200px' },
        { x: 'calc(100% + 200px)', duration: 1.5, ease: 'power2.inOut' }
      )

      // Reveal characters as sweep passes
      chars.forEach((char, i) => {
        const charPosition = i / chars.length
        sweepTl.to(char, {
          color: '#ffffff',
          webkitTextStroke: '0px transparent',
          duration: 0.1,
          ease: 'none',
        }, charPosition * 1.5)
      })

      // Stats fade in after sweep
      sweepTl.fromTo(stats,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        1.6
      )
    }, section)

    return () => ctx.revert()
  }, [])

 

  // Other Articles grid animations
  useEffect(() => {
    const section = otherArticlesRef.current
    const cards = otherCardRefs.current.filter(Boolean)
    const curtains = otherCurtainRefs.current.filter(Boolean)
    if (!section || cards.length === 0) return

    const ctx = gsap.context(() => {
      // Card entrance with stagger
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              once: true,
            }
          }
        )
      })

      // Curtain reveals (right to left)
      curtains.forEach((curtain, i) => {
        gsap.fromTo(curtain,
          { scaleX: 1 },
          {
            scaleX: 0,
            duration: 1.1,
            delay: i * 0.15,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              once: true,
            }
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // Archive section animations
  useEffect(() => {
    const section = archiveRef.current
    const heading = archiveHeadingRef.current
    const rows = archiveRowRefs.current.filter(Boolean)
    const dividers = archiveDividerRefs.current.filter(Boolean)
    const filters = archiveFilterRefs.current.filter(Boolean)
    if (!section) return

    const ctx = gsap.context(() => {
      // Heading slam
      if (heading) {
        gsap.fromTo(heading,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            }
          }
        )
      }

      // Row entrance with stagger
      rows.forEach((row, i) => {
        gsap.fromTo(row,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            }
          }
        )
      })

      // Divider draws
      dividers.forEach((divider, i) => {
        gsap.fromTo(divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power2.out',
            transformOrigin: 'left',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            }
          }
        )
      })

      // Filter sidebar entrance
      filters.forEach((filter, i) => {
        gsap.fromTo(filter,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            }
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // CTA letter scatter animation
  useEffect(() => {
    const section = ctaRef.current
    const letters = ctaLetterRefs.current.filter(Boolean)
    const subtext = ctaSubtextRef.current
    const form = ctaFormRef.current
    const underline = ctaUnderlineRef.current
    if (!section || letters.length === 0) return

    const ctx = gsap.context(() => {
      // Set initial scattered positions
      letters.forEach((letter) => {
        const pos = generateRandomPosition()
        gsap.set(letter, {
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          opacity: pos.opacity,
          scale: pos.scale,
        })
      })

      // Assemble on scroll
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        }
      })

      const centerIndex = Math.floor(letters.length / 2)
      letters.forEach((letter, i) => {
        const distanceFromCenter = Math.abs(i - centerIndex)
        ctaTl.to(letter, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power4.out',
        }, distanceFromCenter * 0.025)
      })

      // Subtext fade in
      if (subtext) {
        ctaTl.fromTo(subtext,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          1.2
        )
      }

      // Form entrance
      if (form) {
        ctaTl.fromTo(form,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          1.5
        )
      }

      // Underline draws from center
      if (underline) {
        ctaTl.fromTo(underline,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.inOut' },
          1.5
        )
      }
    }, section)

    return () => ctx.revert()
  }, [generateRandomPosition])

  // Archive category filter handler
  const handleCategoryFilter = useCallback((category) => {
    const indicator = archiveIndicatorRef.current
    const currentIndex = archiveCategories.indexOf(activeArchiveCategory)
    const newIndex = archiveCategories.indexOf(category)
    
    // Animate indicator slide
    if (indicator && currentIndex !== newIndex) {
      const itemHeight = 45 // Approximate height of each filter item
      gsap.to(indicator, {
        y: newIndex * itemHeight,
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    // Animate rows
    const rows = archiveRowRefs.current.filter(Boolean)
    rows.forEach((row) => {
      const rowCategory = row.dataset.category
      const shouldShow = category === 'ALL' || rowCategory === category
      
      if (shouldShow) {
        gsap.to(row, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.inOut',
        })
      } else {
        gsap.to(row, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })
      }
    })

    setActiveArchiveCategory(category)
  }, [activeArchiveCategory])

  // Card image hover handler
  const handleCardHover = useCallback((e, isEntering) => {
    const img = e.currentTarget.querySelector('.nip-other-card-img')
    if (img) {
      gsap.to(img, {
        scale: isEntering ? 1.04 : 1,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }, [])

  // Read more arrow hover handler
  const handleArrowHover = useCallback((e, isEntering) => {
    const arrow = e.currentTarget.querySelector('.nip-arrow-icon')
    if (arrow) {
      gsap.to(arrow, {
        x: isEntering ? 6 : 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  // CTA submit click handler
  const handleCtaSubmit = useCallback(() => {
    const arrow = ctaArrowRef.current
    if (arrow) {
      gsap.to(arrow, {
        rotation: 360,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(arrow, { rotation: 0 })
        }
      })
    }
  }, [])

  // Render scattered letters
  const renderScatteredLetters = useCallback((text, refs, baseClass) => {
    refs.current = []
    const words = text.split(' ')
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className={`${baseClass}-word`}>
        {word.split('').map((char, charIndex) => (
          <span
            key={`${wordIndex}-${charIndex}`}
            className={`${baseClass}-char`}
            ref={el => refs.current.push(el)}
          >
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className={`${baseClass}-space`}>&nbsp;</span>}
      </span>
    ))
  }, [])

  // Render ignite chars with line breaks
  const renderIgniteChars = useCallback((lines) => {
    igniteCharRefs.current = []
    return lines.map((line, lineIndex) => (
      <div key={lineIndex} className="nip-ignite-line">
        {line.split('').map((char, charIndex) => (
          <span
            key={`${lineIndex}-${charIndex}`}
            className="nip-ignite-char"
            ref={el => igniteCharRefs.current.push(el)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    ))
  }, [])

  // Filter archive articles based on active category
  const filteredArchiveArticles = useMemo(() => {
    if (activeArchiveCategory === 'ALL') return archiveArticles
    return archiveArticles.filter(article => {
      // Map categories for filtering
      const categoryMap = {
        'INSIGHTS': 'INSIGHTS',
        'NEWS': 'NEWS',
        'AI': 'AI AUTOMATION',
        'GENERAL': 'GENERAL',
        'WEB DESIGN': 'WEB DESIGN',
        'ARTIFICIAL INTELLIGENCE (AI)': 'AI',
        'AGENCY LIFE': 'AGENCY LIFE',
        'CREATIVE DEVELOPMENT': 'CREATIVE DEVELOPMENT',
        'MARKETING': 'MARKETING',
      }
      return article.category === activeArchiveCategory || categoryMap[article.category] === activeArchiveCategory
    })
  }, [activeArchiveCategory])

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

      {/* MAIN CONTENT */}
      <main className="news-insights-page" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} ref={pageRef}>
        <div style={{ pointerEvents: 'auto' }}>

          {/* ==================== SECTION 1: MAGNETIC PARTICLE HERO ==================== */}
          <section className="nip-hero" ref={heroRef}>
            <h1 className="nip-hero-title">
              {renderScatteredLetters('News & Insights', letterRefs, 'nip-hero')}
            </h1>
            <p className="nip-hero-subtext" ref={subtextRef}>
              Exploring ideas, sharing knowledge
            </p>
          </section>

          {/* ==================== SECTION 2: HORIZONTAL SCROLL ==================== */}
          <section className="nip-horizontal" ref={horizontalRef}>
            <div className="nip-horizontal-track" ref={horizontalTrackRef}>
              {horizontalArticles.map((article, index) => (
                <div 
                  key={index}
                  className="nip-horiz-card"
                  ref={el => horizontalCardRefs.current[index] = el}
                >
                  <div 
                    className="nip-horiz-card-bg"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="nip-horiz-card-overlay" />
                  {/* Curtain overlays for right-to-left reveal */}
                  <div 
                    className="nip-horiz-curtain nip-horiz-curtain-purple"
                    ref={el => horizontalCurtainPurpleRefs.current[index] = el}
                  />
                  <div 
                    className="nip-horiz-curtain nip-horiz-curtain-dark"
                    ref={el => horizontalCurtainDarkRefs.current[index] = el}
                  />
                  <span 
                    className="nip-horiz-card-number"
                    ref={el => horizontalNumberRefs.current[index] = el}
                  >
                    {String(index + 1).padStart(2, '0')} / {String(horizontalArticles.length).padStart(2, '0')}
                  </span>
                  <div 
                    className="nip-horiz-card-content"
                    ref={el => horizontalContentRefs.current[index] = el}
                  >
                    <span className="nip-horiz-pill nip-horiz-content-item">{article.category}</span>
                    <span className="nip-horiz-date nip-horiz-content-item">{article.date}</span>
                    <h2 className="nip-horiz-title nip-horiz-content-item">{article.title}</h2>
                    <button 
                      className="nip-horiz-link nip-horiz-content-item" 
                      onClick={() => navigate(`/news/${article.slug}`)}
                      data-cursor-hover
                    >
                      Read Article <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={`nip-progress-dots ${activeHorizCard >= 0 ? 'visible' : ''}`} ref={progressDotsRef}>
              {[0, 1, 2].map(i => (
                <span 
                  key={i} 
                  className={`nip-progress-dot ${activeHorizCard === i ? 'active' : ''}`} 
                />
              ))}
            </div>
          </section>

          {/* ==================== SECTION 3: IGNITE TEXT REVEAL ==================== */}
          <section className="nip-ignite" ref={igniteRef}>
            <div className="nip-ignite-text" ref={igniteTextRef}>
              {renderIgniteChars(['Intelligence', 'Driven Content'])}
              <div className="nip-ignite-sweep" ref={igniteSweepRef} />
            </div>
            <div className="nip-ignite-stats" ref={igniteStatsRef}>
              <span>24+ Articles</span>
              <span className="nip-ignite-dot">•</span>
              <span>Weekly Updates</span>
            </div>
          </section>
          {/* ==================== SECTION 5: OTHER ARTICLES 3-CARD GRID ==================== */}
          <section className="nip-other-articles" ref={otherArticlesRef} data-cursor-theme="light">
            <div className="nip-other-divider" />
            <h3 className="nip-other-label">Other articles</h3>
            
            <div className="nip-other-grid">
              {otherArticles.map((article, index) => (
                <div 
                  key={index}
                  className="nip-other-card"
                  ref={el => otherCardRefs.current[index] = el}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                  onClick={() => navigate(`/news/${article.slug}`)}
                  data-cursor-hover
                >
                  <div className="nip-other-card-image">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="nip-other-card-img"
                    />
                    <div 
                      className="nip-other-card-curtain"
                      ref={el => otherCurtainRefs.current[index] = el}
                    />
                  </div>
                  <div className="nip-other-card-meta">
                    <span className="nip-other-pill">{article.category}</span>
                    <span className="nip-other-date">{article.date}</span>
                  </div>
                  <h4 className="nip-other-card-title">{article.title}</h4>
                  <span className="nip-other-read-time">{article.readTime}</span>
                  <div className="nip-other-card-divider" />
                  <span 
                    className="nip-other-link"
                    onMouseEnter={(e) => handleArrowHover(e, true)}
                    onMouseLeave={(e) => handleArrowHover(e, false)}
                  >
                    Read more <span className="nip-arrow-icon">→</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ==================== SECTION 6: ARCHIVE ==================== */}
          <section className="nip-archive" ref={archiveRef} data-cursor-theme="light">
            <h2 className="nip-archive-heading" ref={archiveHeadingRef}>Archive</h2>
            <div className="nip-archive-divider" />
            
            <div className="nip-archive-layout">
              {/* Left column - Article list */}
              <div className="nip-archive-list">
                {archiveArticles.map((article, index) => (
                  <div 
                    key={index}
                    className="nip-archive-row"
                    ref={el => archiveRowRefs.current[index] = el}
                    data-category={article.category}
                    onClick={() => navigate(`/news/${article.slug}`)}
                    data-cursor-hover
                  >
                    <div 
                      className="nip-archive-row-divider"
                      ref={el => archiveDividerRefs.current[index] = el}
                    />
                    <div className="nip-archive-row-content">
                      <div className="nip-archive-row-left">
                        <div className="nip-archive-row-meta">
                          <span className="nip-archive-pill">{article.category}</span>
                          <span className="nip-archive-date">{article.date}</span>
                        </div>
                        <h4 className="nip-archive-row-title">{article.title}</h4>
                        <p className="nip-archive-row-excerpt">{article.excerpt}</p>
                      </div>
                      <div className="nip-archive-row-right">
                        <span className="nip-archive-read-time">{article.readTime} read</span>
                        <span className="nip-archive-read-link">
                          Read <FiArrowUpRight />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right column - Sticky filter sidebar */}
              <div className="nip-archive-sidebar">
                <div className="nip-archive-filter-indicator" ref={archiveIndicatorRef} />
                {archiveCategories.map((category, index) => (
                  <button
                    key={category}
                    className={`nip-archive-filter-item ${activeArchiveCategory === category ? 'active' : ''}`}
                    ref={el => archiveFilterRefs.current[index] = el}
                    onClick={() => handleCategoryFilter(category)}
                    data-cursor-hover
                  >
                    {category}
                    {activeArchiveCategory === category && <span className="nip-archive-filter-square">■</span>}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== SECTION 7: EMAIL CTA ==================== */}
          <section className="nip-cta" ref={ctaRef}>
            <div className="nip-cta-orb nip-cta-orb-1" />
            <div className="nip-cta-orb nip-cta-orb-2" />
            
            <h2 className="nip-cta-title">
              {renderScatteredLetters('Never miss an insight.', ctaLetterRefs, 'nip-cta')}
            </h2>
            <p className="nip-cta-subtext" ref={ctaSubtextRef}>
              Web development, AI automation, and agency insights — delivered.
            </p>
            
            <div className="nip-cta-form" ref={ctaFormRef}>
              <div className="nip-cta-input-wrapper">
                <label className="nip-cta-label">YOUR EMAIL</label>
                <input 
                  type="email" 
                  className="nip-cta-input" 
                  placeholder="your@email.com"
                  ref={ctaInputRef}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
                <div className={`nip-cta-underline ${inputFocused ? 'focused' : ''}`} ref={ctaUnderlineRef} />
              </div>
              <MagneticIcon strength={0.45} padding={20}>
                <button 
                  className="nip-cta-submit" 
                  data-cursor-hover
                  onClick={handleCtaSubmit}
                >
                  <span ref={ctaArrowRef}><FiArrowRight /></span>
                </button>
              </MagneticIcon>
            </div>
          </section>

          {/* Spacer for footer reveal */}
          <div style={{ height: '100vh', background: 'transparent' }} />
        </div>
      </main>
    </>
  )
}

export default NewsInsightsPage
