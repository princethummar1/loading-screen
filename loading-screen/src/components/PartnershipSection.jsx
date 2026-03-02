import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './PartnershipSection.css'

gsap.registerPlugin(ScrollTrigger)

// Text scramble effect
const scrambleText = (element, finalText, duration = 1800) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*'
  let iterations = 0
  const speed = finalText.length / (duration / 30)

  const interval = setInterval(() => {
    element.textContent = finalText
      .split('')
      .map((char, index) => {
        if (index < iterations) return finalText[index]
        if (char === ' ') return ' '
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')

    iterations += speed
    if (iterations >= finalText.length) {
      element.textContent = finalText
      clearInterval(interval)
    }
  }, 30)
  return interval
}

// Typewriter component with cursor
const TypewriterTitle = ({ text, isActive }) => {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!containerRef.current || !isActive || hasAnimated.current) return
    
    hasAnimated.current = true
    const chars = containerRef.current.querySelectorAll('.tw-char')
    const cursor = cursorRef.current

    gsap.set(chars, { opacity: 0 })
    gsap.set(cursor, { opacity: 1 })

    gsap.to(chars, {
      opacity: 1,
      stagger: 0.04,
      duration: 0.01,
      ease: 'none',
      onComplete: () => {
        gsap.to(cursor, { opacity: 0, duration: 0.3, delay: 0.5 })
      }
    })
  }, [isActive, text])

  useEffect(() => {
    if (!isActive) {
      hasAnimated.current = false
      if (containerRef.current) {
        const chars = containerRef.current.querySelectorAll('.tw-char')
        gsap.set(chars, { opacity: 0 })
      }
    }
  }, [isActive])

  return (
    <span ref={containerRef} className="typewriter-title">
      {text.split('').map((char, i) => (
        <span key={i} className="tw-char">{char}</span>
      ))}
      <span ref={cursorRef} className="tw-cursor">|</span>
    </span>
  )
}

function PartnershipSection() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const paragraphRef = useRef(null)
  const statsRef = useRef(null)
  const divider1Ref = useRef(null)
  const divider2Ref = useRef(null)
  const stepsContainerRef = useRef(null)
  const stepsTrackRef = useRef(null)
  const stepsHeaderRef = useRef(null)
  const testimonialRef = useRef(null)
  const quoteMarkRef = useRef(null)
  const quoteTextRef = useRef(null)
  const attributionRef = useRef(null)
  const ctaWrapperRef = useRef(null)
  const ctaButtonRef = useRef(null)
  const dotsRef = useRef([])

  const [activeStep, setActiveStep] = useState(0)
  const [quoteRevealed, setQuoteRevealed] = useState(false)

  const steps = [
    { num: '01', title: 'Think', desc: 'Define goals, map workflows, and align technology with your business vision before writing a single line of code.', icon: '→' },
    { num: '02', title: 'Build', desc: 'Craft intuitive interfaces and scalable backend architecture engineered for performance from day one.', icon: '◻' },
    { num: '03', title: 'Automate', desc: 'Integrate AI-driven systems that reduce manual work, multiply operational efficiency, and capture opportunities 24/7.', icon: '⬡' },
    { num: '04', title: 'Scale', desc: 'Validate, optimize, and grow. We stay partners through launch and beyond — ensuring long-term reliability and performance.', icon: '↑' }
  ]

  const originalQuote = "Kyurex didn't just build our platform — they structured our product vision and execution from the ground up."

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label animation
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%' }
        }
      )

      // Left column - split lines animation
      const headingLines = leftColRef.current.querySelectorAll('.statement-line')
      gsap.fromTo(headingLines,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: { trigger: leftColRef.current, start: 'top 70%' }
        }
      )

      // Right column paragraph
      gsap.fromTo(paragraphRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: rightColRef.current, start: 'top 70%' }
        }
      )

      // Stats count up with slam
      const stat1El = statsRef.current.querySelector('.stat-1 .stat-number')
      const stat2El = statsRef.current.querySelector('.stat-2 .stat-number')
      const counter1 = { val: 0 }
      const counter2 = { val: 0 }

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(counter1, {
            val: 15,
            duration: 2.5,
            ease: 'power4.out',
            snap: { val: 1 },
            onUpdate: () => { stat1El.textContent = Math.ceil(counter1.val) },
            onComplete: () => {
              gsap.to(stat1El, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' })
            }
          })
          gsap.to(counter2, {
            val: 100,
            duration: 2.5,
            ease: 'power4.out',
            snap: { val: 1 },
            onUpdate: () => { stat2El.textContent = Math.ceil(counter2.val) },
            onComplete: () => {
              gsap.to(stat2El, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' })
            }
          })
        }
      })

      // First divider
      gsap.fromTo(divider1Ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: divider1Ref.current, start: 'top 80%' }
        }
      )

      // Horizontal scroll for process steps (desktop only)
      const isMobile = window.innerWidth <= 900
      
      if (!isMobile) {
        const track = stepsTrackRef.current
        const container = stepsContainerRef.current

        // Set will-change and GPU acceleration for smoother animations
        gsap.set(track, { 
          willChange: 'transform',
          force3D: true,
          backfaceVisibility: 'hidden'
        })

        // Phase 1: Fade-in the steps section BEFORE it pins
        gsap.fromTo(container,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.3,
            }
          }
        )

        // Phase 2: Horizontal scroll with pin
        const scrollDistance = track.scrollWidth - window.innerWidth + 100
        
        gsap.to(track, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            pinSpacing: true,
            pinType: 'transform',
            anticipatePin: 1,
            scrub: 0.8,
            start: 'top top',
            end: `+=${scrollDistance}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const activeIndex = Math.min(3, Math.floor(self.progress * 4))
              setActiveStep(activeIndex)
              dotsRef.current.forEach((dot, i) => {
                if (dot) dot.style.background = i <= activeIndex ? '#6d28d9' : '#333'
              })
            },
          }
        })

        // Refresh after a short delay to ensure correct measurements
        setTimeout(() => {
          ScrollTrigger.refresh()
        }, 100)
      } else {
        // Mobile: simple staggered fade-in for cards
        const cards = stepsTrackRef.current?.querySelectorAll('.step-card')
        if (cards) {
          gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stepsContainerRef.current,
                start: 'top 80%',
              }
            }
          )
        }
      }

      // Second divider
      gsap.fromTo(divider2Ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: divider2Ref.current, start: 'top 80%' }
        }
      )

      // Phase 3: Exit transition - testimonial slides up from behind
      gsap.fromTo(testimonialRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1.5,
          }
        }
      )

      // Quote mark fade in
      gsap.fromTo(quoteMarkRef.current,
        { opacity: 0 },
        {
          opacity: 0.15,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: testimonialRef.current, start: 'top 70%' }
        }
      )

      // Testimonial scramble
      ScrollTrigger.create({
        trigger: testimonialRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          if (!quoteRevealed && quoteTextRef.current) {
            setQuoteRevealed(true)
            scrambleText(quoteTextRef.current, originalQuote, 1800)
            // Fade in attribution after scramble
            setTimeout(() => {
              gsap.fromTo(attributionRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
              )
            }, 2000)
          }
        }
      })

      // CTA button entrance
      gsap.fromTo(ctaWrapperRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: ctaWrapperRef.current, start: 'top 85%' }
        }
      )
    }, sectionRef)

    // Magnetic button effect
    const wrapper = ctaWrapperRef.current
    const btn = ctaButtonRef.current

    const handleMouseMove = (e) => {
      const rect = wrapper.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY

      gsap.to(btn, { x: dx * 0.38, y: dy * 0.38, duration: 0.4, ease: 'power2.out' })
      const span = btn.querySelector('span')
      if (span) gsap.to(span, { x: dx * 0.15, y: dy * 0.15, duration: 0.4, ease: 'power2.out' })
    }

    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      const span = btn.querySelector('span')
      if (span) gsap.to(span, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    }

    wrapper?.addEventListener('mousemove', handleMouseMove, { passive: true })
    wrapper?.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // ResizeObserver for ScrollTrigger refresh on resize (debounced)
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      ctx.revert()
      clearTimeout(resizeTimeout)
      wrapper?.removeEventListener('mousemove', handleMouseMove)
      wrapper?.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [quoteRevealed])

  return (
    <section className="partnership-section" ref={sectionRef} data-cursor-theme="light">
      {/* Ambient Orbs */}
      <div className="orbs-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Section Label */}
      <div className="section-label" ref={labelRef}>
        <span className="label-line"></span>
        <span className="label-text">THE KYUREX MODEL</span>
      </div>

      {/* Two Column Statement Block */}
      <div className="statement-block">
        <div className="statement-left" ref={leftColRef}>
          <h2 className="statement-heading">
            <span className="statement-line">We are your technology</span>
            <span className="statement-line">partner — not just</span>
            <span className="statement-line">a vendor.</span>
          </h2>
        </div>
        <div className="statement-divider"></div>
        <div className="statement-right" ref={rightColRef}>
          <p className="statement-paragraph" ref={paragraphRef}>
            We collaborate with founders and growing businesses to design, build, and scale high-performance web platforms powered by intelligent automation. Every product is engineered for long-term growth — not short-term delivery.
          </p>
          <div className="stats-row" ref={statsRef}>
            <div className="stat-item stat-1">
              <div className="stat-number-row">
                <span className="stat-number">0</span>
                <span className="stat-symbol">+</span>
              </div>
              <span className="stat-label">Products Launched</span>
            </div>
            <div className="stat-item stat-2">
              <div className="stat-number-row">
                <span className="stat-number">0</span>
                <span className="stat-symbol">%</span>
              </div>
              <span className="stat-label">Client Retention</span>
            </div>
          </div>
        </div>
      </div>

      {/* First Divider */}
      <div className="animated-divider" ref={divider1Ref}></div>

      {/* Horizontal Pin-Scroll Steps */}
      <div className="steps-container" ref={stepsContainerRef} data-cursor-theme="dark">
        <div className="steps-header" ref={stepsHeaderRef}>
          <span className="steps-label">Our Process</span>
          <div className="steps-dots">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                className="step-dot"
                ref={el => dotsRef.current[i] = el}
                style={{ background: i === 0 ? '#6d28d9' : '#ddd' }}
              ></span>
            ))}
          </div>
        </div>
        <div className="steps-track" ref={stepsTrackRef}>
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <span className="step-number">({step.num})</span>
              <h3 className="step-title">
                <TypewriterTitle text={step.title} isActive={activeStep >= index} />
              </h3>
              <div className="step-line"></div>
              <p className="step-desc">{step.desc}</p>
              <span className="step-icon">{step.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Second Divider */}
      <div className="animated-divider" ref={divider2Ref}></div>

      {/* Testimonial Block */}
      <div className="testimonial-block" ref={testimonialRef} data-cursor-text="READ">
        <div className="testimonial-glow"></div>
        <span className="quote-mark" ref={quoteMarkRef}>"</span>
        <blockquote className="testimonial-quote" ref={quoteTextRef}>
          &nbsp;
        </blockquote>
        <p className="testimonial-attribution" ref={attributionRef}>
          — Founder, Healthcare SaaS Startup
        </p>
      </div>

      {/* Magnetic CTA Button */}
      <div className="cta-wrapper" ref={ctaWrapperRef} data-cursor-text="GO">
        <button className="cta-button" ref={ctaButtonRef}>
          <span>Start Your Project →</span>
        </button>
      </div>
    </section>
  )
}

export default PartnershipSection
