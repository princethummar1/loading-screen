import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'
import MagneticIcon from './MagneticIcon'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import { useSiteData } from '../context/SiteDataContext'
import './ContactPage.css'

gsap.registerPlugin(ScrollTrigger)

// Static fallback FAQs (used if API unavailable)
const staticFaqData = [
  {
    question: "What type of clients does Kyurex work with?",
    answer: "We work with founders, growing startups, and established businesses across healthcare, real estate, education, retail, and B2B services. What matters most is that our clients are ready to build something meaningful — whether it's their first digital product or a complete platform overhaul."
  },
  {
    question: "How big does my project need to be?",
    answer: "No project is too small or too large. We've built everything from focused landing pages to full SaaS platforms. We scope every project individually and are transparent about timelines and investment from the first conversation."
  },
  {
    question: "How much does a web project cost?",
    answer: "Project investment varies based on scope, complexity, and timeline. Most web projects range from $3,000 to $25,000+. AI automation integrations are scoped separately. We'll give you a clear breakdown after our discovery call — no surprises."
  },
  {
    question: "Do you also handle AI integration for existing platforms?",
    answer: "Yes. We can integrate AI automation, chatbots, lead systems, and workflow tools into platforms that are already live. We assess your current stack and build integrations that fit without disrupting what's working."
  },
  {
    question: "How long does a typical project take?",
    answer: "Most web projects take 4–8 weeks from kickoff to launch. AI automation projects typically run 3–5 weeks. We give you a detailed timeline before we start and keep you updated throughout every phase."
  }
]

function ContactPage() {
  const { faqs, testimonials } = useSiteData()
  const pageRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const dividerRef = useRef(null)
  const testimonialRef = useRef(null)
  const formRef = useRef(null)
  const submitRef = useRef(null)
  const submitArrowRef = useRef(null)
  const submitUnderlineRef = useRef(null)
  const responseTextRef = useRef(null)
  const faqSectionRef = useRef(null)
  const faqItemsRef = useRef([])
  const faqAnswersRef = useRef([])
  const faqIconsRef = useRef([])
  const socialIconsRef = useRef(null)
  
  const [activeIndex, setActiveIndex] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    budget: '',
    message: ''
  })

  // Use API FAQs if available, otherwise fall back to static
  const faqData = (faqs && faqs.length > 0) ? faqs : staticFaqData
  
  // Get first testimonial for contact page, filter by page if applicable
  const contactTestimonial = testimonials?.find(t => t.pages?.includes('contact')) || testimonials?.[0] || null

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations timeline
      const tl = gsap.timeline({ delay: 0.2 })

      // Heading lines animate in
      const headingLines = headingRef.current?.querySelectorAll('.heading-line')
      if (headingLines) {
        tl.fromTo(headingLines,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
          0
        )
      }

      // Subheading + divider
      tl.fromTo([subheadingRef.current, dividerRef.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
        0.3
      )

      // Testimonial card
      tl.fromTo(testimonialRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.4
      )

      // Form fields
      const formRows = formRef.current?.querySelectorAll('.form-row')
      if (formRows) {
        tl.fromTo(formRows,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
          0.3
        )
      }

      // Submit button
      tl.fromTo(submitRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        0.5
      )

      // Response text
      tl.fromTo(responseTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.7
      )

      // FAQ scroll animation
      if (faqSectionRef.current) {
        const faqItems = faqSectionRef.current.querySelectorAll('.faq-item')
        gsap.fromTo(faqItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: faqSectionRef.current,
              start: 'top 80%',
              once: true
            }
          }
        )
      }

      // Social icons scroll animation
      if (socialIconsRef.current) {
        const icons = socialIconsRef.current.querySelectorAll('.contact-social-icon')
        gsap.fromTo(icons,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: socialIconsRef.current,
              start: 'top 85%',
              once: true
            }
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleFAQ = (index) => {
    const answerEl = faqAnswersRef.current[index]
    const iconEl = faqIconsRef.current[index]
    
    if (activeIndex === index) {
      // Close current
      gsap.to(answerEl, {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.inOut'
      })
      gsap.to(iconEl, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      setActiveIndex(null)
    } else {
      // Close previous if exists
      if (activeIndex !== null) {
        const prevAnswer = faqAnswersRef.current[activeIndex]
        const prevIcon = faqIconsRef.current[activeIndex]
        gsap.to(prevAnswer, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.inOut'
        })
        gsap.to(prevIcon, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
      
      // Open new
      gsap.set(answerEl, { height: 'auto', opacity: 1 })
      const naturalHeight = answerEl.offsetHeight
      gsap.set(answerEl, { height: 0, opacity: 0 })
      
      gsap.to(answerEl, {
        height: naturalHeight,
        opacity: 1,
        duration: 0.45,
        ease: 'power3.inOut'
      })
      gsap.to(iconEl, {
        rotation: 45,
        duration: 0.3,
        ease: 'power2.out'
      })
      setActiveIndex(index)
    }
  }

  const handleSubmitHover = () => {
    gsap.to(submitArrowRef.current, {
      x: 8,
      duration: 0.3,
      ease: 'power2.out'
    })
    // Underline shimmer effect
    gsap.to(submitUnderlineRef.current, {
      scaleX: 0,
      transformOrigin: 'right',
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(submitUnderlineRef.current, {
          scaleX: 1,
          transformOrigin: 'left',
          duration: 0.2,
          ease: 'power2.out'
        })
      }
    })
  }

  const handleSubmitLeave = () => {
    gsap.to(submitArrowRef.current, {
      x: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  return (
    <>
      <CustomCursor />
      <Navbar isContactPage onMenuClick={() => setIsMenuOpen(true)} />
      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="contact-page" ref={pageRef}>
        <div className="contact-container">
          {/* Left Column */}
          <div className="contact-left">
            <h1 className="contact-heading" ref={headingRef}>
              <span className="heading-line">It's time to build</span>
              <span className="heading-line">something great.</span>
            </h1>
            
            <p className="contact-subheading" ref={subheadingRef}>
              Let's create something intelligent, together.
            </p>
            
            <div className="contact-divider" ref={dividerRef}></div>
            
            {/* Testimonial Card */}
            {contactTestimonial && (
              <div className="testimonial-card" ref={testimonialRef}>
                <div className="testimonial-accent"></div>
                <div className="testimonial-photo">
                  <img 
                    src={contactTestimonial.authorImage || `https://picsum.photos/seed/${contactTestimonial.authorName?.replace(/\s/g, '')}/200/200`} 
                    alt={contactTestimonial.authorName || 'Client'}
                  />
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-quote">
                    "{contactTestimonial.quote}"
                  </p>
                  <p className="testimonial-name">{contactTestimonial.authorName}</p>
                  <p className="testimonial-company">{contactTestimonial.authorCompany}</p>
                </div>
              </div>
            )}
            {!contactTestimonial && (
              <div className="testimonial-card" ref={testimonialRef}>
                <div className="testimonial-accent"></div>
                <div className="testimonial-photo">
                  <img 
                    src="https://picsum.photos/seed/alex/200/200" 
                    alt="Alex Morrison"
                  />
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-quote">
                    "From proposal to launch, the execution was precise, strategic, and genuinely impressive."
                  </p>
                  <p className="testimonial-name">Alex Morrison</p>
                  <p className="testimonial-company">TechVentures</p>
                </div>
              </div>
            )}

            {/* FAQ Accordion */}
            <div className="faq-section" ref={faqSectionRef}>
              {faqData.map((item, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === index ? 'faq-item-open' : ''}`}
                  ref={el => faqItemsRef.current[index] = el}
                >
                  <button 
                    className="faq-question" 
                    onClick={() => toggleFAQ(index)}
                    data-cursor-hover
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span 
                      className="faq-icon" 
                      ref={el => faqIconsRef.current[index] = el}
                    >+</span>
                  </button>
                  <div 
                    className="faq-answer" 
                    ref={el => faqAnswersRef.current[index] = el}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Icons Row */}
            <div className="contact-social-row" ref={socialIconsRef}>
              <MagneticIcon strength={0.4} padding={20}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-social-icon" data-cursor-hover>
                  <FiInstagram />
                </a>
              </MagneticIcon>
              <MagneticIcon strength={0.4} padding={20}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-social-icon" data-cursor-hover>
                  <FiLinkedin />
                </a>
              </MagneticIcon>
              <MagneticIcon strength={0.4} padding={20}>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="contact-social-icon" data-cursor-hover>
                  <FaXTwitter />
                </a>
              </MagneticIcon>
              <MagneticIcon strength={0.4} padding={20}>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="contact-social-icon" data-cursor-hover>
                  <FiYoutube />
                </a>
              </MagneticIcon>
            </div>
          </div>

          {/* Right Column — Contact Form */}
          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
              {/* Row 1: Name + Company */}
              <div className="form-row form-row-half">
                <div className="form-field">
                  <label className="form-label">FULL NAME</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    data-cursor-hover
                  />
                  <span className="input-underline"></span>
                </div>
                <div className="form-field">
                  <label className="form-label">COMPANY</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    data-cursor-hover
                  />
                  <span className="input-underline"></span>
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    data-cursor-hover
                  />
                  <span className="input-underline"></span>
                </div>
              </div>

              {/* Row 3: Budget */}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">YOUR BUDGET</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="form-select"
                    data-cursor-hover
                  >
                    <option value="">Select one...</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 – $15,000</option>
                    <option value="15k-30k">$15,000 – $30,000</option>
                    <option value="30k-plus">$30,000+</option>
                  </select>
                  <span className="input-underline"></span>
                </div>
              </div>

              {/* Row 4: Message */}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">MESSAGE</label>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    data-cursor-hover
                  />
                  <span className="input-underline"></span>
                </div>
              </div>

              {/* Submit Button - Minimal Style */}
              <div className="form-submit-wrapper" ref={submitRef}>
                <MagneticIcon strength={0.3} padding={30}>
                  <button 
                    type="submit" 
                    className="form-submit-minimal" 
                    data-cursor-hover
                    onMouseEnter={handleSubmitHover}
                    onMouseLeave={handleSubmitLeave}
                  >
                    <span className="submit-text">Send Message</span>
                    <span className="submit-arrow" ref={submitArrowRef}>→</span>
                    <span className="submit-underline" ref={submitUnderlineRef}></span>
                  </button>
                </MagneticIcon>
              </div>

              <p className="form-response-text" ref={responseTextRef}>
                We typically respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
