import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'
import MagneticIcon from './MagneticIcon'
import { useSiteData } from '../context/SiteDataContext'
import './FooterCTA.css'

gsap.registerPlugin(ScrollTrigger)

function FooterCTA() {
  const navigate = useNavigate()
  const { settings } = useSiteData()
  const sectionRef = useRef(null)
  const upperSectionRef = useRef(null)
  const leftPanelRef = useRef(null)
  const rightPanelRef = useRef(null)
  const leftTopRef = useRef(null)
  const leftBottomRef = useRef(null)
  const rightTopRef = useRef(null)
  const rightBottomRef = useRef(null)
  const startProjectRef = useRef(null)
  const contactLinkRef = useRef(null)
  const socialIconsRef = useRef(null)
  const navLinksRef = useRef(null)
  const footerBarRef = useRef(null)
  const linesRef = useRef(null)
  const socialIconRefs = useRef([])

  // Track which social icons are being hovered (for magnetic glow effect)
  const [hoveredIcon, setHoveredIcon] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // === PANEL ENTRANCE ANIMATIONS ===
      // Footer is fixed positioned, so we play animations immediately
      // with a small delay to let page load
      const tl = gsap.timeline({ delay: 0.3 })

      // Upper section slides down from above
      tl.fromTo(upperSectionRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0
      )

      // Left panel slides in from left
      tl.fromTo(leftPanelRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        0.1
      )

      // Right panel slides in from right (0.15s delay after left)
      tl.fromTo(rightPanelRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        0.25
      )

      // "Start a Project" slams up
      tl.fromTo(startProjectRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
        0.6
      )

      // Social icons slide in from left, staggered
      tl.fromTo(socialIconsRef.current?.querySelectorAll('.social-icon-wrap'),
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.5
      )

      // Nav links fade in from right, staggered
      tl.fromTo(navLinksRef.current?.querySelectorAll('.nav-item'),
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.5
      )

      // Contact link fades in
      tl.fromTo(contactLinkRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        0.8
      )

      // Footer bar fades in
      tl.fromTo(footerBarRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        0.9
      )
    }, sectionRef)

    // === RIGHT PANEL HOVER COLOR SHIFT ===
    const rightPanel = rightPanelRef.current
    if (!rightPanel) return

    const whiteTextEls = rightPanel.querySelectorAll('.white-text')
    const mutedTextEls = rightPanel.querySelectorAll('.muted-text')

    // Create paused timeline for hover - faster transitions
    const hoverTl = gsap.timeline({ paused: true })
    hoverTl
      .to(rightPanel, {
        backgroundColor: '#ffffff',
        duration: 0.25,
        ease: 'power2.out'
      }, 0)
      .to(startProjectRef.current, {
        color: '#0a0a0a',
        duration: 0.2,
        ease: 'power2.out'
      }, 0)
      .to(whiteTextEls, {
        color: '#1a1a1a',
        duration: 0.2,
        ease: 'power2.out',
        stagger: 0.02
      }, 0)
      .to(mutedTextEls, {
        color: '#888888',
        duration: 0.2,
        ease: 'power2.out'
      }, 0)

    const onPanelEnter = () => hoverTl.play()
    const onPanelLeave = () => hoverTl.reverse()

    rightPanel.addEventListener('mouseenter', onPanelEnter)
    rightPanel.addEventListener('mouseleave', onPanelLeave)

    return () => {
      ctx.revert()
      rightPanel.removeEventListener('mouseenter', onPanelEnter)
      rightPanel.removeEventListener('mouseleave', onPanelLeave)
      hoverTl.kill()
    }
  }, [])

  // Magnetic icon hover handlers - apply glow effect
  const handleIconHoverStart = (index, iconEl) => {
    setHoveredIcon(index)
    if (iconEl) {
      gsap.to(iconEl, {
        borderColor: '#6d28d9',
        backgroundColor: 'rgba(109, 40, 217, 0.15)',
        color: '#ffffff',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const handleIconHoverEnd = (index, iconEl) => {
    setHoveredIcon(null)
    if (iconEl) {
      gsap.to(iconEl, {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.7)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const handleNavClick = (path) => {
    navigate(path)
  }

  const handleContactClick = () => {
    navigate('/contact')
  }

  // Build social links from settings - always show all icons
  const socialLinks = [
    { icon: FiInstagram, href: settings?.socialInstagram || 'https://instagram.com', label: 'Instagram' },
    { icon: FiLinkedin, href: settings?.socialLinkedIn || 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaXTwitter, href: settings?.socialTwitter || 'https://x.com', label: 'Twitter' },
    { icon: FiYoutube, href: settings?.socialYouTube || 'https://youtube.com', label: 'YouTube' }
  ]

  return (
    <section className="footer-cta" ref={sectionRef}>
      {/* Vertical Lines Background */}
      <div className="vertical-lines" ref={linesRef}>
        {[...Array(25)].map((_, i) => (
          <div key={i} className="v-line" style={{ left: `${i * 45}px` }}></div>
        ))}
      </div>

      {/* Upper Section with Social Icons and Nav - DARK THEME */}
      <div className="upper-section" ref={upperSectionRef}>
        {/* Social Icons - Left with Magnetic Effect */}
        <div className="social-icons" ref={socialIconsRef}>
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon
            return (
              <div key={social.label} className="social-icon-wrap">
                <MagneticIcon
                  strength={0.4}
                  padding={20}
                  onHoverStart={() => handleIconHoverStart(index, socialIconRefs.current[index])}
                  onHoverEnd={() => handleIconHoverEnd(index, socialIconRefs.current[index])}
                >
                  <a 
                    href={social.href} 
                    className="social-icon" 
                    ref={el => socialIconRefs.current[index] = el}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    data-cursor-hover
                  >
                    <IconComponent />
                  </a>
                </MagneticIcon>
              </div>
            )
          })}
        </div>

        {/* Navigation Links - Right */}
        <nav className="nav-links" ref={navLinksRef}>
          <div className="nav-item" onClick={() => handleNavClick('/')} data-cursor-hover>
            HOME
          </div>
          <div className="nav-item" onClick={() => handleNavClick('/portfolio')} data-cursor-hover>
            PORTFOLIO
          </div>
          <div className="nav-item" onClick={() => handleNavClick('/news')} data-cursor-hover>
            NEWS & INSIGHTS
          </div>
          <div className="nav-item" onClick={() => handleNavClick('/about')} data-cursor-hover>
            ABOUT
          </div>
        </nav>
      </div>

      {/* Two Panel Split */}
      <div className="panels-container">
        {/* Left Panel - 32% */}
        <div className="left-panel" ref={leftPanelRef}>
          <div className="left-top" ref={leftTopRef}>
            <span 
              className="panel-label animate-in" 
              onClick={() => handleNavClick('/portfolio')}
              data-cursor-hover
            >
              PORTFOLIO →
            </span>
            <h2 className="panel-heading animate-in">
              Selected Work<br />& Case Studies
            </h2>
          </div>
          <div className="left-bottom" ref={leftBottomRef}>
            <p className="panel-desc">
              Web Development<br />and AI Automation.
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="panel-divider"></div>

        {/* Right Panel - 68% */}
        <div className="right-panel" ref={rightPanelRef}>
          <div className="right-top" ref={rightTopRef}>
            <span className="panel-label muted-text animate-in">GET IN TOUCH</span>
            <h3 className="panel-subheading white-text animate-in">
              Let's get to it.<br />together.
            </h3>
          </div>
          <div className="right-bottom" ref={rightBottomRef}>
            <h2 
              className="start-project white-text" 
              ref={startProjectRef}
              onClick={handleContactClick}
              style={{ cursor: 'pointer' }}
              data-cursor-hover
            >
              Start a Project
            </h2>
            <a 
              href="#" 
              className="contact-link white-text" 
              ref={contactLinkRef} 
              onClick={(e) => { e.preventDefault(); handleContactClick(); }}
              data-cursor-hover
            >
              Contact us →
              <span className="link-underline"></span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="footer-bar" ref={footerBarRef}>
        <div className="footer-left">
          <span className="footer-link" data-cursor-hover>Cookie Preference</span>
          <span className="footer-text">Web Development & AI Agency</span>
        </div>
        <div className="footer-right">
          <div className="footer-badge">
            <span className="badge-dot"></span>
            AI & Web Agency
          </div>
        </div>
      </footer>
    </section>
  )
}

export default FooterCTA
