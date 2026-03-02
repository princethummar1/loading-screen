import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoMarquee from './LogoMarquee'
import { getServices } from '../utils/api'
import './ServicesSection.css'

gsap.registerPlugin(ScrollTrigger)

const headlineText = "We don't just build brands, we shape how people feel about them."

const defaultServices = [
  {
    name: "Web\nDevelopment",
    heroDescription: "We build digital experiences where performance meets precision. From intuitive user interfaces to robust backend systems, every line of code is crafted with clarity, structure, and long-term scalability in mind. Our approach blends clean architecture with seamless interaction — ensuring your platform performs flawlessly across every device and business goal.",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=450&fit=crop",
    slug: "web-development"
  },
  {
    name: "AI\nAutomation",
    heroDescription: "We transform manual processes into intelligent systems. From conversational chatbots to fully automated lead management, our AI solutions are built to operate seamlessly in the background — reducing repetitive tasks, enhancing customer engagement, and driving measurable efficiency aligned with your operational objectives.",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=450&fit=crop",
    slug: "ai-automation"
  },
  {
    name: "Full Stack\nProducts",
    heroDescription: "We design and build custom digital products tailored to your business needs. From full-stack applications to intelligent APIs and scalable platforms, our development services empower your business with robust capabilities — delivering seamless experiences, data-driven insights, and next-generation functionality.",
    heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=450&fit=crop",
    slug: "full-stack"
  }
]

function ServicesSection() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const headlineWordsRef = useRef([])
  const serviceRowsRef = useRef([])
  const serviceBodyColsRef = useRef([])
  const serviceImagesRef = useRef([])
  const shutterOverlaysRef = useRef([])
  const paragraphWordsRef = useRef([])
  const [services, setServices] = useState(defaultServices)
  const [dataLoaded, setDataLoaded] = useState(false)

  const headlineWords = headlineText.split(' ')

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        if (data && data.length > 0) {
          // Transform API data to match component format
          const transformed = data.map(s => ({
            name: s.name?.includes('\n') ? s.name : s.name?.replace(' ', '\n') || s.name,
            heroDescription: s.heroDescription,
            heroImage: s.heroImage,
            slug: s.slug
          }))
          setServices(transformed)
        }
      } catch (error) {
        console.warn('Failed to fetch services, using defaults')
      } finally {
        setDataLoaded(true)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const headlineWordEls = headlineWordsRef.current
      const rows = serviceRowsRef.current
      const images = serviceImagesRef.current

      // Headline blur-scrub animation
      gsap.fromTo(headlineWordEls,
        { filter: 'blur(12px)', opacity: 0 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 1,
            markers: false,
          }
        }
      )

      const shutterOverlays = shutterOverlaysRef.current
      const bodyCols = serviceBodyColsRef.current

      // Service row animations
      rows.forEach((row, index) => {
        if (!row) return

        // Animate body column only (not title)
        if (bodyCols[index]) {
          gsap.fromTo(bodyCols[index],
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
              scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' }
            }
          )
        }

        // Shutter close effect on images (top to bottom reveal)
        if (shutterOverlays[index]) {
          gsap.fromTo(shutterOverlays[index],
            { scaleY: 1 },
            {
              scaleY: 0,
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: row,
                start: 'top 75%',
                end: 'top 25%',
                scrub: 1,
              }
            }
          )
        }

        if (images[index]) {
          gsap.set(images[index], { opacity: 1 })
        }

        const words = paragraphWordsRef.current[index]
        if (words && words.length > 0) {
          gsap.fromTo(words,
            { opacity: 0.2 },
            {
              opacity: 1, stagger: 0.02, ease: 'none',
              scrollTrigger: { trigger: row, start: 'top 70%', end: 'bottom 30%', scrub: 1.5 }
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [services])

  return (
    <section className="services-section" ref={sectionRef} data-cursor-theme="light">
      {/* Headline */}
      <div className="services-headline" ref={headlineRef}>
        <h2>
          {headlineWords.map((word, index) => (
            <span
              key={index}
              className="headline-word"
              ref={el => headlineWordsRef.current[index] = el}
            >
              {word}{' '}
            </span>
          ))}
        </h2>
      </div>

      {/* Service Rows */}
      <div className="services-list">
        {services.map((service, serviceIndex) => {
          const bodyWords = (service.heroDescription || '').split(' ')
          paragraphWordsRef.current[serviceIndex] = []

          return (
            <div
              key={service.slug || serviceIndex}
              className="service-row"
              ref={el => serviceRowsRef.current[serviceIndex] = el}
            >
              <div className="service-grid">
                {/* Column 1 - Title */}
                <div className="service-title-col">
                  <h3 className="service-title">
                    {(service.name || '').split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                  </h3>
                </div>

                {/* Column 2 - Body */}
                <div className="service-body-col" ref={el => serviceBodyColsRef.current[serviceIndex] = el}>
                  <p className="service-body">
                    {bodyWords.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="body-word"
                        ref={el => {
                          if (!paragraphWordsRef.current[serviceIndex]) {
                            paragraphWordsRef.current[serviceIndex] = []
                          }
                          paragraphWordsRef.current[serviceIndex][wordIndex] = el
                        }}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                  <Link to={`/services/${service.slug}`} className="learn-more" data-cursor-hover>
                    Learn more <span className="arrow">→</span>
                  </Link>
                </div>

                {/* Column 3 - Image */}
                <div className="service-image-col">
                  <div className="service-image-wrapper">
                    <img
                      src={service.heroImage}
                      alt={(service.name || '').replace('\n', ' ')}
                      className="service-image"
                      ref={el => serviceImagesRef.current[serviceIndex] = el}
                    />
                    <div 
                      className="shutter-overlay"
                      ref={el => shutterOverlaysRef.current[serviceIndex] = el}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Logo Marquee */}
      <LogoMarquee />
    </section>
  )
}

export default ServicesSection
