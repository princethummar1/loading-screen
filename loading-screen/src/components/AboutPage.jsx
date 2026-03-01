import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import FooterCTA from './FooterCTA'
import LogoMarquee from './LogoMarquee'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { getArticles } from '../utils/api'
import './AboutPage.css'

gsap.registerPlugin(ScrollTrigger)

// Accordion data for Part 4
const accordionItems = [
  {
    num: '01',
    question: 'Intelligence First',
    answer: 'We lead every project with strategic thinking before touching design or code. Understanding your audience, your goals, and your market shapes everything we build.'
  },
  {
    num: '02',
    question: 'Design Empowered',
    answer: 'Design is not decoration — it\'s communication. Every visual decision we make is intentional, purposeful, and engineered to connect with people emotionally.'
  },
  {
    num: '03',
    question: 'Technology Driven',
    answer: 'From custom web applications to AI automation systems, we build with modern stacks that are fast, scalable, and future-ready from day one.'
  },
  {
    num: '04',
    question: 'Client Collaboration',
    answer: 'We work with you, not for you. Transparent communication, regular updates, and genuine partnership throughout every phase of the project.'
  },
  {
    num: '05',
    question: 'Human Focused',
    answer: 'Every product we build is ultimately used by people. We design interactions that feel natural, intuitive, and genuinely enjoyable to use.'
  },
  {
    num: '06',
    question: 'Results Oriented',
    answer: 'Beautiful work that doesn\'t convert is just art. We measure success by the impact our work creates for your business — leads, growth, and retention.'
  }
]

// Static fallback for Articles data for Part 7 (used if API fails)
const staticArticles = [
  {
    image: 'https://picsum.photos/seed/article1/600/380',
    tag: 'INSIGHTS',
    date: 'Mar 15',
    title: 'Why AI Automation Is the Next Competitive Advantage for Growing Businesses',
    readTime: '4 MIN READ',
    slug: 'ai-automation-advantage'
  },
  {
    image: 'https://picsum.photos/seed/article2/600/380',
    tag: 'INSIGHTS',
    date: 'Feb 28',
    title: 'What Makes a High-Converting Web Platform in 2025?',
    readTime: '3 MIN READ',
    slug: 'high-converting-platform'
  },
  {
    image: 'https://picsum.photos/seed/article3/600/380',
    tag: 'NEWS',
    date: 'Jan 10',
    title: 'Kyurex Launches AI-Powered Lead Automation for Healthcare Startups',
    readTime: '3 MIN READ',
    slug: 'kyurex-launches-ai'
  }
]

function AboutPage() {
  const pageRef = useRef(null)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState(null)
  const [articles, setArticles] = useState(staticArticles)
  const [articlesLoading, setArticlesLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const allArticles = await getArticles()
        if (allArticles && allArticles.length > 0) {
          // Map to format required by the component
          const mapped = allArticles.map(a => ({
            slug: a.slug,
            tag: a.category?.toUpperCase() || 'INSIGHTS',
            date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
            title: a.title,
            image: a.image || a.heroImage || `https://picsum.photos/seed/${a.slug}/600/380`,
            readTime: (a.readTime || '5 min').toUpperCase() + ' READ',
            featuredAbout: a.featuredAbout
          }))

          const aboutFeatures = mapped.filter(a => a.featuredAbout);
          const remaining = mapped.filter(a => !a.featuredAbout);
          
          setArticles([...aboutFeatures, ...remaining].slice(0, 3));
        }
      } catch (error) {
        console.warn('Failed to fetch articles, using static fallback:', error)
      } finally {
        setArticlesLoading(false)
      }
    }
    fetchArticles()
  }, [])

  // Hero refs
  const heroRef = useRef(null)
  const heroBgRef = useRef(null)
  const heroHeadingRef = useRef(null)
  const heroDividerRef = useRef(null)
  const heroParagraphRef = useRef(null)
  const heroLinkRef = useRef(null)

  // Part 2 refs
  const statementRef = useRef(null)
  const statementPara1Ref = useRef(null)
  const statementPara2Ref = useRef(null)
  const statementPhotoRef = useRef(null)
  const statementCurtainRef = useRef(null)
  const wordRefs = useRef([])

  // Part 4 refs
  const accordionSectionRef = useRef(null)
  const accordionItemRefs = useRef([])
  const accordionAnswerRefs = useRef([])

  // Part 5 refs - Fan gallery with center expand
  const gallerySectionRef = useRef(null)
  const galleryImagesRef = useRef([]) // 5 images in fan layout
  const galleryOrbRef = useRef(null)
  const galleryButtonRef = useRef(null)
  const galleryScrollHintRef = useRef(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Part 6 refs
  const valuesSectionRef = useRef(null)
  const valuesLineRefs = useRef([])
  const valuesParagraphRef = useRef(null)
  const valuesPhotoRef = useRef(null)
  const valuesCurtainRef = useRef(null)

  // Part 7 refs
  const articlesSectionRef = useRef(null)
  const articlesHeadingRef = useRef(null)
  const articleCardRefs = useRef([])

  // Initialize smooth scroll
  useSmoothScroll()

  // Word opacity scroll text
  const wordOpacityText = "Our team works remotely, bringing together diverse perspectives to create unique, intelligent, and emotionally engaging digital products."

  // Gallery mouse parallax handler
  const handleGalleryMouseMove = (e) => {
    if (!gallerySectionRef.current) return
    const rect = gallerySectionRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePos({ x, y })
  }

  // Video modal handlers
  const openVideoModal = () => setShowVideoModal(true)
  const closeVideoModal = () => setShowVideoModal(false)

  useEffect(() => {
    // Refresh ScrollTrigger after mount
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)

    const ctx = gsap.context(() => {
      // ==================== PART 1: HERO ANIMATIONS ====================
      // Background tiles fade in
      gsap.fromTo(heroBgRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 1.2, delay: 0.1 }
      )

      // Background parallax on scroll
      gsap.to(heroBgRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

      // Hero heading slam up
      gsap.fromTo(heroHeadingRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.3 }
      )

      // Divider draw
      gsap.fromTo(heroDividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut', delay: 0.4 }
      )

      // Paragraph fade in
      gsap.fromTo(heroParagraphRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      )

      // Link fade in
      gsap.fromTo(heroLinkRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.6 }
      )

      // ==================== PART 2: STATEMENT ANIMATIONS ====================
      // First paragraph fade in
      gsap.fromTo(statementPara1Ref.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 70%',
            once: true
          }
        }
      )

      // Word opacity scroll effect for second paragraph
      if (wordRefs.current.length > 0) {
        wordRefs.current.forEach((word, i) => {
          if (word) {
            gsap.fromTo(word,
              { opacity: 0.15 },
              {
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: statementPara2Ref.current,
                  start: `top ${80 - (i * 2)}%`,
                  end: `top ${50 - (i * 2)}%`,
                  scrub: 1.5
                }
              }
            )
          }
        })
      }

      // Photo curtain reveal
      gsap.fromTo(statementCurtainRef.current,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: statementPhotoRef.current,
            start: 'top 70%',
            once: true
          }
        }
      )

      // ==================== PART 4: ACCORDION ANIMATIONS ====================
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
                start: 'top 75%',
                once: true
              },
              delay: i * 0.08
            }
          )
        }
      })

      // ==================== PART 5: FAN GALLERY WITH CENTER EXPAND ====================
      if (gallerySectionRef.current && galleryImagesRef.current[2]) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gallerySectionRef.current,
            start: 'top top',
            end: '+=150%',
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1
          }
        })

        // Scroll hint fades out immediately
        tl.to(galleryScrollHintRef.current, {
          opacity: 0,
          duration: 0.2
        }, 0)

        // Side images (0, 1, 3, 4) fade out and scale down
        galleryImagesRef.current.forEach((img, index) => {
          if (img && index !== 2) {
            tl.to(img, {
              opacity: 0,
              scale: 0.85,
              duration: 0.4
            }, 0)
          }
        })

        // Center image (index 2) expands to fullscreen
        tl.to(galleryImagesRef.current[2], {
          width: '85vw',
          height: '55vh',
          rotation: 0,
          borderRadius: '0px',
          duration: 0.6
        }, 0.2)

        // Glowing orb and button fade in
        tl.to([galleryOrbRef.current, galleryButtonRef.current], {
          opacity: 1,
          scale: 1,
          duration: 0.4
        }, 0.6)
      }

      // ==================== PART 6: VALUES ANIMATIONS ====================
      valuesLineRefs.current.forEach((line, i) => {
        if (line) {
          gsap.fromTo(line,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.8,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: valuesSectionRef.current,
                start: 'top 70%',
                once: true
              },
              delay: i * 0.2
            }
          )
        }
      })

      gsap.fromTo(valuesParagraphRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: valuesSectionRef.current,
            start: 'top 60%',
            once: true
          },
          delay: 0.6
        }
      )

      // Values photo curtain reveal
      gsap.fromTo(valuesCurtainRef.current,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: valuesPhotoRef.current,
            start: 'top 70%',
            once: true
          }
        }
      )

      // ==================== PART 7: ARTICLES ANIMATIONS ====================
      gsap.fromTo(articlesHeadingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: articlesSectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      )

      // We only want to run GSAP animations for articles if they've finished loading
      // To ensure that cards are in the DOM, we can add a simple condition here.
      if (!articlesLoading && articleCardRefs.current.length > 0) {
        articleCardRefs.current.forEach((card, i) => {
          if (card) {
            gsap.fromTo(card,
              { x: 40, opacity: 0 },
              {
                x: 0, opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: articlesSectionRef.current,
                  start: 'top 75%',
                  once: true
                },
                delay: i * 0.15
              }
            )
          }
        })
      }

    }, pageRef)

    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [articlesLoading]) // re-run GSAP when articles finish loading

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

    // Open new (if different)
    if (index !== prevIndex && accordionAnswerRefs.current[index]) {
      gsap.to(accordionAnswerRefs.current[index], {
        height: 'auto',
        opacity: 1,
        duration: 0.45,
        ease: 'power3.inOut'
      })
    }
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

      {/* MAIN CONTENT scrolls over fixed footer */}
      <main className="about-page" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} ref={pageRef}>
        <div style={{ pointerEvents: 'auto' }}>

          {/* ==================== PART 1: HERO HEADER ==================== */}
          <section className="ap-hero" ref={heroRef}>
            {/* Tiled background */}
            <div className="ap-hero-bg" ref={heroBgRef}></div>
            
            {/* Bottom-left content */}
            <div className="ap-hero-content">
              <h1 className="ap-hero-heading" ref={heroHeadingRef}>
                A new breed of Agency
              </h1>
              <div className="ap-hero-divider" ref={heroDividerRef}></div>
              <div className="ap-hero-row">
                <p className="ap-hero-paragraph" ref={heroParagraphRef}>
                  A unique breed of Digital Agency that blends high-end design with conversion-focused strategy. We build intelligent web platforms and AI automation systems that engage, convert, and help businesses scale.
                </p>
                <a href="/contact" className="ap-hero-link" ref={heroLinkRef} data-cursor-hover>
                  Start a Project <span className="ap-hero-arrow">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* ==================== PART 2: ABOUT STATEMENT ==================== */}
          <section className="ap-statement" ref={statementRef}>
            <div className="ap-statement-left">
              <p className="ap-statement-para1" ref={statementPara1Ref}>
                At Kyurex, we believe that a great product is more than just a digital presence — it's an intelligent experience. We specialize in blending cutting-edge web development with AI automation to connect businesses with their audiences.
              </p>
              <p className="ap-statement-para2" ref={statementPara2Ref}>
                {wordOpacityText.split(' ').map((word, i) => (
                  <span 
                    key={i} 
                    className="ap-word"
                    ref={el => wordRefs.current[i] = el}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>
            <div className="ap-statement-right">
              <div className="ap-statement-photo-wrapper" ref={statementPhotoRef}>
                <img 
                  src="https://picsum.photos/seed/about-kyurex/500/750" 
                  alt="Kyurex team" 
                  className="ap-statement-photo"
                />
                <div className="ap-statement-curtain" ref={statementCurtainRef}></div>
              </div>
            </div>
          </section>

          {/* ==================== PART 3: LOGO MARQUEE ==================== */}
          <section className="ap-marquee">
            <LogoMarquee showLabel={false} />
          </section>

          {/* ==================== PART 4: ACCORDION ==================== */}
          <section className="ap-accordion" ref={accordionSectionRef}>
            <div className="ap-accordion-left">
              <h2 className="ap-accordion-title">
                The Kyurex<br />Approach
              </h2>
            </div>
            <div className="ap-accordion-right">
              {accordionItems.map((item, index) => (
                <div 
                  key={item.num} 
                  className={`ap-accordion-item ${activeAccordion === index ? 'active' : ''}`}
                  ref={el => accordionItemRefs.current[index] = el}
                >
                  <div 
                    className="ap-accordion-header"
                    onClick={() => handleAccordionClick(index)}
                    data-cursor-hover
                  >
                    <span className="ap-accordion-num">{item.num}</span>
                    <span className="ap-accordion-question">{item.question}</span>
                    <span className="ap-accordion-icon">
                      {activeAccordion === index ? '×' : '+'}
                    </span>
                  </div>
                  <div 
                    className="ap-accordion-answer"
                    ref={el => accordionAnswerRefs.current[index] = el}
                  >
                    <p>{item.answer}</p>
                  </div>
                  <div className="ap-accordion-divider"></div>
                </div>
              ))}
            </div>
          </section>

          {/* ==================== PART 5: FAN GALLERY ==================== */}
          <section 
            className="ap-gallery" 
            ref={gallerySectionRef}
            onMouseMove={handleGalleryMouseMove}
          >
            {/* Fan layout images */}
            <div className="ap-gallery-fan">
              {[
                { seed: 'fan1', rot: -12, size: 'small' },
                { seed: 'fan2', rot: -6, size: 'medium' },
                { seed: 'fan3', rot: 0, size: 'large' },
                { seed: 'fan4', rot: 6, size: 'medium' },
                { seed: 'fan5', rot: 12, size: 'small' }
              ].map((img, index) => (
                <div 
                  key={img.seed}
                  className={`ap-gallery-card ap-gallery-card--${img.size}`}
                  ref={el => galleryImagesRef.current[index] = el}
                  style={{
                    transform: `rotate(${img.rot}deg) translateX(${
                      index !== 2 ? mousePos.x * (20 - Math.abs(index - 2) * 5) : 0
                    }px) translateY(${
                      index !== 2 ? mousePos.y * (15 - Math.abs(index - 2) * 3) : 0
                    }px)`
                  }}
                >
                  <img 
                    src={`https://picsum.photos/seed/${img.seed}/800/1200`}
                    alt="Kyurex work"
                    className="ap-gallery-card-img"
                  />
                </div>
              ))}
            </div>
            
            {/* Scroll hint */}
            <div className="ap-gallery-scroll-hint" ref={galleryScrollHintRef}>
              <span className="ap-gallery-scroll-text">Scroll to Explore</span>
              <span className="ap-gallery-scroll-arrow">↓</span>
            </div>

            {/* Glowing orb */}
            <div className="ap-gallery-orb" ref={galleryOrbRef}></div>

            {/* Watch Showreel button */}
            <button 
              className="ap-gallery-showreel-btn"
              ref={galleryButtonRef}
              onClick={openVideoModal}
              data-cursor-hover
            >
              <span className="ap-gallery-btn-icon">▶</span>
              <span className="ap-gallery-btn-text">Watch Showreel</span>
            </button>
          </section>

          {/* Video Modal */}
          {showVideoModal && (
            <div className="ap-video-modal" onClick={closeVideoModal}>
              <div className="ap-video-modal-content" onClick={e => e.stopPropagation()}>
                <button className="ap-video-modal-close" onClick={closeVideoModal}>×</button>
                <video 
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  autoPlay 
                  controls 
                  className="ap-video-modal-video"
                />
              </div>
            </div>
          )}

          {/* ==================== PART 6: VALUES STATEMENT ==================== */}
          <section className="ap-values" ref={valuesSectionRef}>
            <div className="ap-values-left">
              <h2 
                className="ap-values-line"
                ref={el => valuesLineRefs.current[0] = el}
              >
                Intelligence driven
              </h2>
              <h2 
                className="ap-values-line"
                ref={el => valuesLineRefs.current[1] = el}
              >
                Technology empowered
              </h2>
              <h2 
                className="ap-values-line"
                ref={el => valuesLineRefs.current[2] = el}
              >
                Human focused
              </h2>
              <p className="ap-values-paragraph" ref={valuesParagraphRef}>
                We believe that the synergy between design and technology is reshaping what's possible for businesses. Every product we build combines intelligence, precision, and genuine care for the humans who use it.
              </p>
            </div>
            <div className="ap-values-right">
              <div className="ap-values-photo-wrapper" ref={valuesPhotoRef}>
                <img 
                  src="https://picsum.photos/seed/team-kyurex/600/450" 
                  alt="Kyurex team" 
                  className="ap-values-photo"
                />
                <div className="ap-values-curtain" ref={valuesCurtainRef}></div>
              </div>
            </div>
          </section>

          {/* ==================== PART 7: ARTICLES ==================== */}
          <section className="ap-articles" ref={articlesSectionRef}>
            <h2 className="ap-articles-heading" ref={articlesHeadingRef}>
              Most popular articles
            </h2>
            <div className="ap-articles-divider"></div>
            <div className="ap-articles-grid">
              {articles.map((article, i) => (
                <div 
                  key={article.slug || i} 
                  className="ap-article-card"
                  ref={el => articleCardRefs.current[i] = el}
                  data-cursor-hover
                  onClick={() => navigate(`/news/${article.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="ap-article-img-wrapper">
                    <img src={article.image} alt={article.title} className="ap-article-img" />
                  </div>
                  <div className="ap-article-meta">
                    <span className="ap-article-tag">{article.tag}</span>
                    <span className="ap-article-date">{article.date}</span>
                  </div>
                  <h3 className="ap-article-title">{article.title}</h3>
                  <span className="ap-article-read">{article.readTime}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Spacer - allows scrolling to reveal fixed footer */}
        <div style={{ height: '100vh' }} />
      </main>
    </>
  )
}

export default AboutPage