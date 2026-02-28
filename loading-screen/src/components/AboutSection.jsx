import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

const paragraphText = "Kyurex combines strategic clarity with engineering precision to help ambitious businesses transform ideas into intelligent digital systems people genuinely connect with.Every project begins with understanding your vision, your users, and your long-term goals. We align technology with purpose — turning complex challenges into scalable platforms that don’t just function, but create meaningful impact.We don’t just build websites or automation tools. We build systems that support growth, simplify operations, and strengthen the connection between businesses and the people they serve."

function AboutSection() {
  const sectionRef = useRef(null)
  const imageOverlayRef = useRef(null)
  const wordsRef = useRef([])

  // Split text into words
  const words = paragraphText.split('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const overlay = imageOverlayRef.current
      const wordElements = wordsRef.current

      // Curtain reveal animation for image
      gsap.fromTo(overlay,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            markers: false,
          }
        }
      )

      // Word-by-word opacity reveal
      gsap.fromTo(wordElements,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.5,
            markers: false,
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-container">
        {/* Left side - Image with curtain reveal */}
        <div className="about-image-wrapper">
          <div className="about-image-container">
            <img 
              src="https://images.unsplash.com/photo-1771600850804-da11efffee48?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Portrait" 
              className="about-image"
            />
            <div className="about-image-overlay" ref={imageOverlayRef} />
          </div>
        </div>

        {/* Right side - Word-by-word text reveal */}
        <div className="about-text-wrapper">
          <p className="about-paragraph">
            {words.map((word, index) => (
              <span 
                key={index} 
                className="about-word"
                ref={el => wordsRef.current[index] = el}
              >
                {word}{''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
