import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { FiArrowLeft, FiArrowRight, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import FooterCTA from './FooterCTA'
import MagneticIcon from './MagneticIcon'
import { setGlobalLenis, getGlobalLenis } from './PageTransition'
import { getArticle, getRelatedArticles } from '../utils/api'
import { getArticleBySlug, getRelatedArticles as getStaticRelated } from '../data/articlesData'
import './ArticleDetailPage.css'

gsap.registerPlugin(ScrollTrigger)

function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const lenisRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeOutlineIndex, setActiveOutlineIndex] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch article data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const articleData = await getArticle(slug)
        if (articleData) {
          setArticle(articleData)
          const related = await getRelatedArticles(slug, 3)
          setRelatedArticles(related || [])
        } else {
          // Fallback to static data
          const staticArticle = getArticleBySlug(slug)
          setArticle(staticArticle)
          const staticRelated = getStaticRelated(slug, 3)
          setRelatedArticles(staticRelated || [])
        }
      } catch (error) {
        console.warn('Error fetching article, using static fallback:', error)
        const staticArticle = getArticleBySlug(slug)
        setArticle(staticArticle)
        const staticRelated = getStaticRelated(slug, 3)
        setRelatedArticles(staticRelated || [])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  // Refs for animations
  const headerRef = useRef(null)
  const goBackRef = useRef(null)
  const goBackArrowRef = useRef(null)
  const titleLineRefs = useRef([])
  const headerDividerRef = useRef(null)

  // Hero section refs
  const heroRef = useRef(null)
  const heroImageRef = useRef(null)
  const heroCurtainRef = useRef(null)
  const sidebarRef = useRef(null)
  const sidebarBlockRefs = useRef([])

  // Article body refs
  const bodyRef = useRef(null)
  const outlineRef = useRef(null)
  const outlineItemRefs = useRef([])
  const contentBlockRefs = useRef([])
  const contentImageCurtainRefs = useRef([])
  const headingRefs = useRef([])

  // Other articles refs
  const otherArticlesRef = useRef(null)
  const otherCardRefs = useRef([])
  const otherCurtainRefs = useRef([])

  // CTA refs
  const ctaRef = useRef(null)
  const ctaLetterRefs = useRef([])
  const ctaSubtextRef = useRef(null)
  const ctaFormRef = useRef(null)
  const ctaInputRef = useRef(null)
  const ctaUnderlineRef = useRef(null)
  const ctaArrowRef = useRef(null)

  // Generate random positions for CTA letters
  const generateRandomPosition = useCallback(() => ({
    x: (Math.random() - 0.5) * window.innerWidth * 0.8,
    y: (Math.random() - 0.5) * window.innerHeight * 0.8,
    rotation: (Math.random() - 0.5) * 90,
    opacity: 0.1 + Math.random() * 0.2,
    scale: 0.5 + Math.random() * 0.5,
  }), [])

  // Initialize Lenis and ScrollTrigger
  useEffect(() => {
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

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 500)

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
  }, [slug])

  // Header entrance animations
  useEffect(() => {
    if (!article || loading) return
    const titleLines = titleLineRefs.current.filter(Boolean)
    const divider = headerDividerRef.current
    const goBack = goBackRef.current

    const ctx = gsap.context(() => {
      // Title lines stagger up
      titleLines.forEach((line, i) => {
        gsap.fromTo(line,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.3 + i * 0.12,
            ease: 'power4.out',
          }
        )
      })

      // Divider draws from left
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out',
            transformOrigin: 'left',
          }
        )
      }

      // Go back entrance
      if (goBack) {
        gsap.fromTo(goBack,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.5,
            ease: 'power3.out',
          }
        )
      }
    }, headerRef)

    return () => ctx.revert()
  }, [article, loading])

  // Hero image curtain reveal + parallax
  useEffect(() => {
    if (!article || loading) return
    const curtain = heroCurtainRef.current
    const image = heroImageRef.current
    const sidebar = sidebarRef.current
    const sidebarBlocks = sidebarBlockRefs.current.filter(Boolean)

    const ctx = gsap.context(() => {
      // Curtain reveals image from top
      if (curtain) {
        gsap.fromTo(curtain,
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 1.4,
            delay: 0.5,
            ease: 'power4.inOut',
            transformOrigin: 'top',
          }
        )
      }

      // Image parallax on scroll
      if (image) {
        gsap.to(image, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        })
      }

      // Sidebar blocks stagger in
      sidebarBlocks.forEach((block, i) => {
        gsap.fromTo(block,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.8 + i * 0.15,
            ease: 'power3.out',
          }
        )
      })
    }, heroRef)

    return () => ctx.revert()
  }, [article, loading])

  // Outline entrance animation
  useEffect(() => {
    if (!article || loading) return
    const outlineItems = outlineItemRefs.current.filter(Boolean)
    const outline = outlineRef.current

    const ctx = gsap.context(() => {
      outlineItems.forEach((item, i) => {
        gsap.fromTo(item,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: outline,
              start: 'top 80%',
              once: true,
            }
          }
        )
      })
    }, bodyRef)

    return () => ctx.revert()
  }, [article, loading])

  // Content blocks scroll animations
  useEffect(() => {
    if (!article || loading) return
    const blocks = contentBlockRefs.current.filter(Boolean)
    const imageCurtains = contentImageCurtainRefs.current.filter(Boolean)

    const ctx = gsap.context(() => {
      // Content blocks fade up
      blocks.forEach((block, i) => {
        gsap.fromTo(block,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              once: true,
            }
          }
        )
      })

      // Image curtains reveal top to bottom
      imageCurtains.forEach((curtain) => {
        gsap.fromTo(curtain,
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 1,
            ease: 'power4.inOut',
            transformOrigin: 'top',
            scrollTrigger: {
              trigger: curtain.parentElement,
              start: 'top 80%',
              once: true,
            }
          }
        )
      })
    }, bodyRef)

    return () => ctx.revert()
  }, [article, loading])

  // Active outline tracking with IntersectionObserver
  useEffect(() => {
    if (!article || loading) return
    const headings = headingRefs.current.filter(Boolean)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = headings.indexOf(entry.target)
            if (index !== -1) {
              setActiveOutlineIndex(index)
            }
          }
        })
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [article, loading])

  // Other articles animations
  useEffect(() => {
    if (!article || loading || relatedArticles.length === 0) return
    const cards = otherCardRefs.current.filter(Boolean)
    const curtains = otherCurtainRefs.current.filter(Boolean)
    const section = otherArticlesRef.current

    const ctx = gsap.context(() => {
      // Cards stagger up
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            }
          }
        )
      })

      // Curtains reveal left to right
      curtains.forEach((curtain, i) => {
        gsap.fromTo(curtain,
          { scaleX: 1 },
          {
            scaleX: 0,
            duration: 1.1,
            delay: i * 0.15,
            ease: 'power4.inOut',
            transformOrigin: 'left',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            }
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [article, loading, relatedArticles])

  // CTA letter scatter animation
  useEffect(() => {
    if (!article || loading) return
    const section = ctaRef.current
    const letters = ctaLetterRefs.current.filter(Boolean)
    const subtext = ctaSubtextRef.current
    const form = ctaFormRef.current
    const underline = ctaUnderlineRef.current

    const ctx = gsap.context(() => {
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

      if (subtext) {
        ctaTl.fromTo(subtext,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          1.2
        )
      }

      if (form) {
        ctaTl.fromTo(form,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          1.5
        )
      }

      if (underline) {
        ctaTl.fromTo(underline,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.inOut' },
          1.5
        )
      }
    }, section)

    return () => ctx.revert()
  }, [article, loading, generateRandomPosition])

  // ScrollTrigger refresh for layout changes (e.g., images loading)
  useEffect(() => {
    if (!article || loading) return;
    const t1 = setTimeout(() => { ScrollTrigger.refresh(true); }, 250);
    const t2 = setTimeout(() => { ScrollTrigger.refresh(true); }, 1500);
    const t3 = setTimeout(() => { ScrollTrigger.refresh(true); }, 3000);
    
    let observer;
    if (bodyRef.current && window.ResizeObserver) {
      observer = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      observer.observe(bodyRef.current);
    }
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
    };
  }, [article, loading, relatedArticles])

  // Go back hover animation
  const handleGoBackHover = useCallback((isEntering) => {
    const arrow = goBackArrowRef.current
    if (arrow) {
      gsap.to(arrow, {
        x: isEntering ? -6 : 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  // Go back click
  const handleGoBack = useCallback(() => {
    navigate('/news')
  }, [navigate])

  // Outline click - smooth scroll
  const handleOutlineClick = useCallback((id) => {
    const element = document.getElementById(id)
    if (element && lenisRef.current) {
      // Find the y position of the element relative to the document
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const absoluteY = rect.top + scrollTop;
      
      lenisRef.current.scrollTo(absoluteY, { offset: -120, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      console.warn("Could not find matching heading ID for outline scroll:", id);
    }
  }, [])

  // Card hover animation
  const handleCardHover = useCallback((e, isEntering) => {
    const img = e.currentTarget.querySelector('.adp-other-card-img')
    if (img) {
      gsap.to(img, {
        scale: isEntering ? 1.04 : 1,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }, [])

  // Arrow hover animation
  const handleArrowHover = useCallback((e, isEntering) => {
    const arrow = e.currentTarget.querySelector('.adp-arrow-icon')
    if (arrow) {
      gsap.to(arrow, {
        x: isEntering ? 6 : 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  // CTA submit
  const handleCtaSubmit = useCallback(() => {
    const arrow = ctaArrowRef.current
    if (arrow) {
      gsap.to(arrow, {
        rotation: 360,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => gsap.set(arrow, { rotation: 0 })
      })
    }
  }, [])

  // Render scattered letters for CTA
  const renderScatteredLetters = useCallback((text, refs, baseClass) => {
    if (!text) return null;
    let globalCharIndex = 0;
    const words = text.split(' ')
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className={`${baseClass}-word`}>
        {word.split('').map((char, charIndex) => {
          const currentIndex = globalCharIndex++;
          return (
            <span
              key={`${wordIndex}-${charIndex}`}
              className={`${baseClass}-char`}
              ref={el => {
                if (!refs.current) refs.current = [];
                refs.current[currentIndex] = el;
              }}
            >
              {char}
            </span>
          );
        })}
        {wordIndex < words.length - 1 && <span className={`${baseClass}-space`}>&nbsp;</span>}
      </span>
    ))
  }, [])

  // Split title into lines for animation
  const renderTitleLines = useCallback((title) => {
    if (!title) return null;
    const words = title.split(' ')
    const lines = []
    let currentLine = []
    
    // Simple line breaking - split roughly in half
    const midPoint = Math.ceil(words.length / 2)
    words.forEach((word, i) => {
      currentLine.push(word)
      if (i === midPoint - 1 || i === words.length - 1) {
        lines.push(currentLine.join(' '))
        currentLine = []
      }
    })

    return lines.map((line, i) => (
      <span
        key={i}
        className="adp-title-line"
        ref={el => {
          if (!titleLineRefs.current) titleLineRefs.current = [];
          titleLineRefs.current[i] = el;
        }}
      >
        {line}
      </span>
    ))
  }, [])

  // Render content blocks based on type
  const renderContentBlock = useCallback((block, index) => {
    const blockRef = (el) => {
      contentBlockRefs.current[index] = el;
    };

    switch (block.type) {
      case 'paragraph':
        return (
          <div
            key={index}
            className="adp-content-paragraph"
            ref={blockRef}
          >
            <p className="adp-paragraph" style={{ whiteSpace: 'pre-wrap' }}>{block.text || block.content}</p>
          </div>
        );

      case 'heading': {
        const HeadingTag = block.level || 'h2';
        
        // Calculate the safest most reliable ID for this heading to match outline anchor links
        let linkId = block.outlineId;
        if (!linkId && article?.outline?.length > 0) {
          const matchedOutline = article.outline.find(o => 
            o.label.toLowerCase() === (block.text || block.content || '').toLowerCase()
          );
          if (matchedOutline) {
            linkId = matchedOutline.id;
          }
        }
        // Fallback to a normalized text id if no outline link was supplied/matched
        if (!linkId) {
          linkId = (block.text || block.content || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        return (
          <div
            key={index}
            className={`adp-content-heading adp-content-${HeadingTag}`}
            ref={(el) => {
              blockRef(el);
              if (linkId && el) {
                // Determine if this heading is part of the outline array
                const headingIndex = (article.outline || []).findIndex(o => o.id === linkId);
                if (headingIndex !== -1) {
                  if (!headingRefs.current) headingRefs.current = [];
                  headingRefs.current[headingIndex] = el;
                }
              }
            }}
          >
            <HeadingTag id={linkId} className="adp-heading">{block.text || block.content}</HeadingTag>
          </div>
        );
      }

      case 'subheading':
        return (
          <div
            key={index}
            className="adp-content-subheading"
            ref={blockRef}
          >
            <h3 className="adp-subheading">{block.text || block.content}</h3>
          </div>
        );

      case 'quote':
        return (
          <div
            key={index}
            className="adp-content-quote"
            ref={blockRef}
          >
            <blockquote className="adp-quote">
              <p>{block.text || block.content}</p>
              {block.author && <cite>— {block.author}</cite>}
            </blockquote>
          </div>
        );

      case 'list': {
        const ListTag = block.listType === 'ordered' ? 'ol' : 'ul';
        return (
          <div
            key={index}
            className="adp-content-list"
            ref={blockRef}
          >
            <ListTag className="adp-list">
              {(block.items || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          </div>
        );
      }

      case 'image':
        return (
          <div
            key={index}
            className="adp-content-image"
            ref={blockRef}
          >
            <figure className="adp-image-block">
              <div className="adp-image-wrapper">
                <img src={block.src} alt={block.alt} />
                <div
                  className="adp-image-curtain"
                  ref={(el) => contentImageCurtainRefs.current[index] = el}
                />
              </div>
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          </div>
        );

      case 'code':
        return (
          <div
            key={index}
            className="adp-content-code"
            ref={blockRef}
          >
            <pre className="adp-code"><code className={`language-${block.language || 'javascript'}`}>{block.code || block.content}</code></pre>
          </div>
        );

      default:
        return null;
    }
  }, [article]);

  // Reset array refs before main render to prevent accumulation of stale DOM nodes
  titleLineRefs.current = [];
  sidebarBlockRefs.current = [];
  outlineItemRefs.current = [];
  contentBlockRefs.current = [];
  contentImageCurtainRefs.current = [];
  headingRefs.current = [];
  otherCardRefs.current = [];
  otherCurtainRefs.current = [];
  ctaLetterRefs.current = [];

  // If loading
  if (loading) {
    return (
      <>
        <CustomCursor />
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="adp-not-found" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTopColor: '#6d28d9', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p>Loading article...</p>
          </div>
        </div>
      </>
    )
  }

  // If article not found
  if (!article) {
    return (
      <>
        <CustomCursor />
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="adp-not-found">
          <h1>Article Not Found</h1>
          <p>The article you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/news')} data-cursor-hover>
            <FiArrowLeft /> Back to News
          </button>
        </div>
      </>
    )
  }

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
      <main className="article-detail-page" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} ref={pageRef}>
        <div style={{ pointerEvents: 'auto' }}>

          {/* ==================== PART 1: ARTICLE HEADER ==================== */}
          <header className="adp-header" ref={headerRef}>
            <a 
              className="adp-go-back"
              ref={goBackRef}
              onClick={handleGoBack}
              onMouseEnter={() => handleGoBackHover(true)}
              onMouseLeave={() => handleGoBackHover(false)}
              data-cursor-hover
            >
              <span className="adp-go-back-arrow" ref={goBackArrowRef}>←</span>
              GO BACK
            </a>
            
            <div className="adp-header-content">
              <h1 className="adp-title">
                {renderTitleLines(article.title)}
              </h1>
            </div>

            <div className="adp-header-divider" ref={headerDividerRef} />
          </header>

          {/* ==================== PART 2: HERO IMAGE + AUTHOR SIDEBAR ==================== */}
          <section className="adp-hero" ref={heroRef}>
            <div className="adp-hero-image-wrapper">
              <img 
                src={article.heroImage || `https://picsum.photos/seed/${article.slug}/1400/900`} 
                alt={article.title}
                className="adp-hero-image"
                ref={heroImageRef}
              />
              <div className="adp-hero-curtain" ref={heroCurtainRef} />
            </div>

            <aside className="adp-sidebar" ref={sidebarRef}>
              {/* Author block */}
              <div className="adp-sidebar-block" ref={el => sidebarBlockRefs.current[0] = el}>
                <img 
                  src={article.authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author || 'Author')}&background=random`} 
                  alt={article.author}
                  className="adp-author-image"
                />
                <span className="adp-author-name">By {article.author}</span>
              </div>

              <div className="adp-sidebar-divider" />

              {/* Meta block */}
              <div className="adp-sidebar-block adp-sidebar-meta" ref={el => sidebarBlockRefs.current[1] = el}>
                <span className="adp-meta-date">
                  {typeof article.date === 'string' 
                    ? new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : (article.date instanceof Date 
                        ? article.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                        : article.date)}
                </span>
                <span className="adp-meta-read-time">{article.readTime}</span>
              </div>

              <div className="adp-sidebar-divider" />

              {/* Share block */}
              <div className="adp-sidebar-block adp-sidebar-share" ref={el => sidebarBlockRefs.current[2] = el}>
                <span className="adp-share-label">• SHARE /</span>
                <div className="adp-share-icons">
                  <MagneticIcon strength={0.4} padding={12}>
                    <button className="adp-share-btn" data-cursor-hover>
                      <FiLinkedin />
                    </button>
                  </MagneticIcon>
                  <MagneticIcon strength={0.4} padding={12}>
                    <button className="adp-share-btn" data-cursor-hover>
                      <FiTwitter />
                    </button>
                  </MagneticIcon>
                  <MagneticIcon strength={0.4} padding={12}>
                    <button className="adp-share-btn" data-cursor-hover>
                      <FiFacebook />
                    </button>
                  </MagneticIcon>
                </div>
              </div>
            </aside>
          </section>

          {/* ==================== PART 3: ARTICLE BODY (THREE COLUMN) ==================== */}
          <section className="adp-body" ref={bodyRef}>
            {/* Left - Sticky Outline */}
            <nav className="adp-outline" ref={outlineRef}>
              <span className="adp-outline-label">• ARTICLE OUTLINE /</span>
              <div className="adp-outline-divider" />
              <ul className="adp-outline-list">
                {(article.outline || []).map((item, index) => (
                  <li 
                    key={item.id || index}
                    ref={el => outlineItemRefs.current[index] = el}
                  >
                    <button
                      className={`adp-outline-item ${activeOutlineIndex === index ? 'active' : ''}`}
                      onClick={() => handleOutlineClick(item.id)}
                      data-cursor-hover
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Center - Article Content */}
            <article className="adp-content">

              {article.content && article.content.length > 0 ? (
                article.content.map((block, index) => renderContentBlock(block, index))
              ) : (
                <p className="adp-paragraph" style={{ opacity: 0.5, fontStyle: 'italic', marginTop: '2rem' }}>
                  This article has no content yet.
                </p>
              )}
            </article>

            {/* Right - Empty reserved column */}
            <div className="adp-reserved-column" />
          </section>

          {/* ==================== PART 4: OTHER ARTICLES ==================== */}
          <section className="adp-other-articles" ref={otherArticlesRef}>
            <div className="adp-other-divider" />
            <h3 className="adp-other-label">Other articles</h3>
            
            <div className="adp-other-grid">
              {(relatedArticles || []).map((relArticle, index) => (
                <div 
                  key={relArticle.slug}
                  className="adp-other-card"
                  ref={el => otherCardRefs.current[index] = el}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                  onClick={() => navigate(`/news/${relArticle.slug}`)}
                  data-cursor-hover
                >
                  <div className="adp-other-card-image">
                    <img 
                      src={relArticle.heroImage || `https://picsum.photos/seed/${relArticle.slug}/800/600`} 
                      alt={relArticle.title}
                      className="adp-other-card-img"
                    />
                    <div 
                      className="adp-other-card-curtain"
                      ref={el => otherCurtainRefs.current[index] = el}
                    />
                  </div>
                  <div className="adp-other-card-meta">
                    <span className="adp-other-pill">{relArticle.category}</span>
                    <span className="adp-other-date">{relArticle.date}</span>
                  </div>
                  <h4 className="adp-other-card-title">{relArticle.title}</h4>
                  <span className="adp-other-read-time">{relArticle.readTime.toUpperCase()} READ</span>
                  <div className="adp-other-card-divider" />
                  <span 
                    className="adp-other-link"
                    onMouseEnter={(e) => handleArrowHover(e, true)}
                    onMouseLeave={(e) => handleArrowHover(e, false)}
                  >
                    Read more <span className="adp-arrow-icon">→</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ==================== PART 5: EMAIL CTA ==================== */}
          <section className="adp-cta" ref={ctaRef}>
            <div className="adp-cta-orb adp-cta-orb-1" />
            <div className="adp-cta-orb adp-cta-orb-2" />
            
            <h2 className="adp-cta-title">
              {renderScatteredLetters('Never miss an insight.', ctaLetterRefs, 'adp-cta')}
            </h2>
            <p className="adp-cta-subtext" ref={ctaSubtextRef}>
              Web development, AI automation, and agency insights — delivered.
            </p>
            
            <div className="adp-cta-form" ref={ctaFormRef}>
              <div className="adp-cta-input-wrapper">
                <label className="adp-cta-label">YOUR EMAIL</label>
                <input 
                  type="email" 
                  className="adp-cta-input" 
                  placeholder="your@email.com"
                  ref={ctaInputRef}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
                <div className={`adp-cta-underline ${inputFocused ? 'focused' : ''}`} ref={ctaUnderlineRef} />
              </div>
              <MagneticIcon strength={0.45} padding={20}>
                <button 
                  className="adp-cta-submit" 
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

export default ArticleDetailPage
