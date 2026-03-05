import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowRight } from 'react-icons/fi'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import MenuPanel from './MenuPanel'
import FooterCTA from './FooterCTA'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { getProjects } from '../utils/api'
import './PortfolioPage.css'

gsap.registerPlugin(ScrollTrigger)

const filterTags = [
  'BRANDING',
  'WEB DEVELOPMENT',
  'AI AUTOMATION',
  'SAAS MVP',
  'CREATIVE DEVELOPMENT',
  'WEB DESIGN'
]

// Static fallback data
const staticProjects = [
  {
    id: 1,
    slug: 'cliniflow',
    name: 'CliniFlow',
    description: 'AI-powered appointment booking & lead automation for healthcare — reducing manual handling and improving response time.',
    tags: ['AI AUTOMATION', 'WEB INTEGRATION'],
    industry: 'HEALTHCARE',
    location: 'INDIA',
    accent: '#e85d26',
    images: [
      'https://picsum.photos/seed/cliniflow1/700/450',
      'https://picsum.photos/seed/cliniflow2/700/450',
      'https://picsum.photos/seed/cliniflow3/700/450',
    ]
  },
  {
    id: 2,
    slug: 'estatepro',
    name: 'EstatePro',
    description: 'Scalable property listing platform with admin control, lead capture, and dynamic filtering for real estate operations.',
    tags: ['CUSTOM WEB APPLICATION', 'WEB DEVELOPMENT'],
    industry: 'REAL ESTATE',
    location: 'REMOTE',
    accent: '#2563eb',
    images: [
      'https://picsum.photos/seed/estatepro1/700/450',
      'https://picsum.photos/seed/estatepro2/700/450',
      'https://picsum.photos/seed/estatepro3/700/450',
    ]
  },
  {
    id: 3,
    slug: 'edutrack',
    name: 'EduTrack',
    description: 'SaaS MVP for institutes to manage student records, attendance, and reporting in one unified dashboard.',
    tags: ['SAAS MVP', 'DASHBOARD'],
    industry: 'EDUCATION',
    location: 'INDIA',
    accent: '#16a34a',
    images: [
      'https://picsum.photos/seed/edutrack1/700/450',
      'https://picsum.photos/seed/edutrack2/700/450',
      'https://picsum.photos/seed/edutrack3/700/450',
    ]
  },
  {
    id: 4,
    slug: 'leadsphere',
    name: 'LeadSphere',
    description: 'Automated lead qualification and follow-up system with CRM integration to increase B2B conversion rates.',
    tags: ['AI AUTOMATION', 'CRM INTEGRATION'],
    industry: 'B2B SERVICES',
    location: 'REMOTE',
    accent: '#9333ea',
    images: [
      'https://picsum.photos/seed/leadsphere1/700/450',
      'https://picsum.photos/seed/leadsphere2/700/450',
      'https://picsum.photos/seed/leadsphere3/700/450',
    ]
  },
  {
    id: 5,
    slug: 'retailsync',
    name: 'RetailSync',
    description: 'Centralized inventory and analytics system managing multiple product categories across offline and online channels.',
    tags: ['CUSTOM WEB APPLICATION', 'WEB DEVELOPMENT'],
    industry: 'RETAIL / E-COMMERCE',
    location: 'INDIA',
    accent: '#0891b2',
    images: [
      'https://picsum.photos/seed/retailsync1/700/450',
      'https://picsum.photos/seed/retailsync2/700/450',
      'https://picsum.photos/seed/retailsync3/700/450',
    ]
  },
  {
    id: 6,
    slug: 'financehub',
    name: 'FinanceHub',
    description: 'Comprehensive financial dashboard with real-time analytics, budget tracking, and automated reporting for enterprise clients.',
    tags: ['DASHBOARD', 'DATA VISUALIZATION'],
    industry: 'FINTECH',
    location: 'REMOTE',
    accent: '#dc2626',
    images: [
      'https://picsum.photos/seed/financehub1/700/450',
      'https://picsum.photos/seed/financehub2/700/450',
      'https://picsum.photos/seed/financehub3/700/450',
    ]
  },
]

const serviceLinks = [
  { name: 'Web Development', path: '/services/web-development', arrow: '→' },
  { name: 'AI Automation', path: '/services/ai-automation', arrow: '→' },
  { name: 'Full Stack Products', path: '/services/full-stack', arrow: '→' },
]

// Project Row Component
function ProjectRow({ project, isVisible }) {
  const navigate = useNavigate()
  const rowRef = useRef(null)
  const panelRef = useRef(null)
  const nameRef = useRef(null)
  const ctaRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const dynamicSlug = project.slug || project._id || project.id || (project.name ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')
  const isCaseStudy = project.type === 'case-study' || !!dynamicSlug
  const projectLink = dynamicSlug ? `/case-study/${dynamicSlug}` : (project.liveUrl || '#')

  const handleMouseEnter = () => {
    setIsHovered(true)
    
    gsap.to(panelRef.current, {
      height: 380,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.inOut'
    })
    
    gsap.to(nameRef.current, {
      x: 8,
      color: '#fff',
      duration: 0.3
    })
    
    gsap.to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      delay: 0.1
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    
    gsap.to(panelRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut'
    })
    
    gsap.to(nameRef.current, {
      x: 0,
      color: '#ccc',
      duration: 0.3
    })
    
    gsap.to(ctaRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.2
    })
  }

  if (!isVisible) return null

  const handleRowClick = () => {
    if (projectLink.startsWith('/')) {
      navigate(projectLink)
    } else if (projectLink !== '#') {
      window.open(projectLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div 
      className={`pp-project-row ${isHovered ? 'hovered' : ''}`}
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleRowClick}
      style={{ cursor: isCaseStudy ? 'pointer' : 'default' }}
    >
      <div className="pp-project-divider" />
      
      <div className="pp-project-content">
        <div className="pp-project-grid">
          {/* Column 1 - Project Name */}
          <div className="pp-project-name-col">
            <h3 className="pp-project-name" ref={nameRef}>
              {project.name}
            </h3>
            <a
              href={projectLink}
              className="pp-project-cta"
              ref={ctaRef}
              data-cursor-hover
              onClick={(e) => {
                if (projectLink === '#') e.preventDefault()
                else if (projectLink.startsWith('/')) {
                  e.preventDefault()
                  e.stopPropagation()
                  navigate(projectLink)
                }
              }}
            >
              {dynamicSlug ? 'View Selected Work' : 'View Project'} <span className="arrow">→</span>
            </a>
          </div>

          {/* Column 2 - Description */}
          <div className="pp-project-desc-col">
            <p className="pp-project-description">
              {project.description}
            </p>
          </div>

          {/* Column 3 - Tags & Location */}
          <div className="pp-project-meta-col">
            <div className="pp-project-tags">
              {project.tags.map((tag, i) => (
                <span key={i} className="pp-project-tag">{tag}</span>
              ))}
            </div>
            <span className="pp-project-location">{project.location}</span>
          </div>
        </div>
      </div>

      {/* Hover Image Panel */}
      <div 
        className="pp-project-panel"
        ref={panelRef}
        style={{ backgroundColor: project.accent }}
      >
        <div className="pp-panel-images">
          {project.images.map((img, i) => (
            <img 
              key={i}
              src={img}
              alt={`${project.name} screenshot ${i + 1}`}
              className="pp-panel-image"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PortfolioPage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const heroDividerRef = useRef(null)
  const filterTagsRef = useRef(null)
  const caseStudiesRef = useRef(null)
  const workingWithRef = useRef(null)
  const workingHeadingRef = useRef(null)
  const leftColRef = useRef(null)
  const centerColRef = useRef(null)
  const photoOverlayRef = useRef(null)
  const rightColRef = useRef(null)
  const serviceLinkArrowRefs = useRef([])

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [projects, setProjects] = useState(staticProjects)
  const [loading, setLoading] = useState(true)

  // Initialize smooth scroll
  useSmoothScroll()

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects()
        if (data && data.length > 0) {
          // Transform API data to match static data shape if needed
          const mapped = data.map(p => ({
            id: p._id || p.id,
            slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined),
            name: p.name || p.title,
            description: p.description,
            tags: p.tags || [],
            industry: p.industry || '',
            location: p.location || '',
            accent: p.accent || '#e85d26',
            images: p.images || []
          }))
          setProjects(mapped)
        }
      } catch (error) {
        console.warn('Failed to fetch projects, using static data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Toggle filter
  const toggleFilter = (tag) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Check if project matches filters
  const isProjectVisible = (project) => {
    if (activeFilters.length === 0) return true
    return project.tags.some(tag => 
      activeFilters.some(filter => 
        tag.toLowerCase().includes(filter.toLowerCase()) ||
        filter.toLowerCase().includes(tag.toLowerCase())
      )
    )
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

  useEffect(() => {
    // Refresh ScrollTrigger after mount
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    const ctx = gsap.context(() => {
      // === HERO ENTRANCE ANIMATIONS ===
      const heroTl = gsap.timeline({ delay: 0.2 })

      // Main heading slams up
      heroTl.fromTo(headingRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
      )

      // Subheading follows
      heroTl.fromTo(subheadingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
        '-=0.85'
      )

      // Divider draws from left
      heroTl.fromTo(heroDividerRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )

      // Filter tags fade in staggered
      const filterItems = filterTagsRef.current?.querySelectorAll('.pp-filter-tag')
      if (filterItems) {
        heroTl.fromTo(filterItems,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
          '-=0.4'
        )
      }

      // === CASE STUDIES SCROLL ANIMATIONS ===
      const projectRows = caseStudiesRef.current?.querySelectorAll('.pp-project-row')
      if (projectRows) {
        projectRows.forEach((row, index) => {
          gsap.fromTo(row,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 80%',
                once: true
              }
            }
          )
        })
      }

      // === WORKING WITH SECTION ANIMATIONS ===
      // Section heading
      gsap.fromTo(workingHeadingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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
      const serviceLinksEl = leftColRef.current?.querySelectorAll('.pp-service-link')
      if (serviceLinksEl) {
        gsap.fromTo(serviceLinksEl,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
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
          y: 0,
          opacity: 1,
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
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [])

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
      <main style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} ref={pageRef}>
        <div style={{ pointerEvents: 'auto' }}>
          {/* ==================== HERO SECTION ==================== */}
          <section className="pp-hero" ref={heroRef}>
            <div className="pp-hero-content">
              <h1 className="pp-hero-heading" ref={headingRef}>
                Portfolio
              </h1>
              <p className="pp-hero-subheading" ref={subheadingRef}>
                Web Development, AI Automation, and beyond
              </p>
              <div className="pp-hero-divider" ref={heroDividerRef}></div>
              
              {/* Filter Tags */}
              <div className="pp-filter-tags" ref={filterTagsRef}>
                {filterTags.map((tag) => (
                  <button
                    key={tag}
                    className={`pp-filter-tag ${activeFilters.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleFilter(tag)}
                    data-cursor-hover
                  >
                    <span className="pp-filter-checkbox">
                      {activeFilters.includes(tag) ? '■' : '□'}
                    </span>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== CASE STUDIES LIST ==================== */}
          <section className="pp-case-studies" ref={caseStudiesRef}>
            {projects.map((project) => (
              <ProjectRow 
                key={project.id} 
                project={project}
                isVisible={isProjectVisible(project)}
              />
            ))}
            {/* Final divider */}
            <div className="pp-project-divider" />
          </section>

          {/* ==================== WORKING WITH KYUREX ==================== */}
          <section className="pp-working-with" ref={workingWithRef}>
            <h2 className="pp-working-heading" ref={workingHeadingRef}>
              Working with Kyurex
            </h2>
            <div className="pp-working-divider"></div>

            <div className="pp-working-grid">
              {/* Left Column */}
              <div className="pp-working-left" ref={leftColRef}>
                <p className="pp-working-label">
                  Learn more about Kyurex Services
                </p>
                <div className="pp-service-links">
                  {serviceLinks.map((link, index) => (
                    <a 
                      key={link.name}
                      href={link.path}
                      className="pp-service-link"
                      data-cursor-hover
                      onMouseEnter={() => handleServiceHover(index)}
                      onMouseLeave={() => handleServiceLeave(index)}
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(link.path)
                      }}
                    >
                      <span>{link.name}</span>
                      <span 
                        className="pp-service-arrow"
                        ref={el => serviceLinkArrowRefs.current[index] = el}
                      >
                        {link.arrow}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Center Column - Photo */}
              <div className="pp-working-center" ref={centerColRef}>
                <div className="pp-photo-wrapper">
                  <img 
                    src="https://picsum.photos/seed/kyurex-team/400/500"
                    alt="Kyurex Team"
                    className="pp-team-photo"
                  />
                  <div className="pp-photo-overlay" ref={photoOverlayRef}></div>
                </div>
              </div>

              {/* Right Column - Testimonial */}
              <div className="pp-working-right" ref={rightColRef}>
                <p className="pp-testimonial-quote">
                  Working with Kyurex was an absolute shift in how we think about product. 
                  They didn't just execute — they brought structure, intelligence, and genuine 
                  care to every phase of the project. The result exceeded what we thought was possible.
                </p>
                <p className="pp-testimonial-name">Alex Morrison</p>
                <p className="pp-testimonial-company">TechVentures – Series A Startup</p>
              </div>
            </div>
          </section>
        </div>

        {/* Spacer for footer reveal */}
        <div style={{ height: '100vh' }} />
      </main>
    </>
  )
}

export default PortfolioPage
