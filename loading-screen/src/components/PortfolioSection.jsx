import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProjects } from '../utils/api'
import './PortfolioSection.css'

gsap.registerPlugin(ScrollTrigger)

// Static fallback data — shown while API loads or if API is unavailable
const staticFeaturedProjects = [
  {
    _id: 'static-1',
    slug: 'cliniflow',
    name: 'CliniFlow',
    description: 'AI-powered appointment booking & lead automation for healthcare — reducing manual handling and improving response time.',
    tags: ['AI AUTOMATION', 'WEB INTEGRATION'],
    industry: 'HEALTHCARE',
    accent: '#e85d26',
    images: [
      'https://picsum.photos/seed/cliniflow1/700/450',
      'https://picsum.photos/seed/cliniflow2/700/450',
      'https://picsum.photos/seed/cliniflow3/700/450',
    ]
  },
  {
    _id: 'static-2',
    slug: 'estatepro',
    name: 'EstatePro',
    description: 'Scalable property listing platform with admin control, lead capture, and dynamic filtering for real estate operations.',
    tags: ['CUSTOM WEB APPLICATION'],
    industry: 'REAL ESTATE',
    accent: '#2563eb',
    images: [
      'https://picsum.photos/seed/estatepro1/700/450',
      'https://picsum.photos/seed/estatepro2/700/450',
      'https://picsum.photos/seed/estatepro3/700/450',
    ]
  },
  {
    _id: 'static-3',
    slug: 'edutrack',
    name: 'EduTrack',
    description: 'SaaS MVP for institutes to manage student records, attendance, and reporting in one unified dashboard.',
    tags: ['SAAS MVP', 'DASHBOARD'],
    industry: 'EDUCATION',
    accent: '#16a34a',
    images: [
      'https://picsum.photos/seed/edutrack1/700/450',
      'https://picsum.photos/seed/edutrack2/700/450',
      'https://picsum.photos/seed/edutrack3/700/450',
    ]
  },
]

function ProjectRow({ project }) {
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
    gsap.to(panelRef.current, { height: 380, opacity: 1, duration: 0.6, ease: 'power3.inOut' })
    gsap.to(nameRef.current, { x: 8, color: '#fff', duration: 0.3 })
    gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    gsap.to(panelRef.current, { height: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut' })
    gsap.to(nameRef.current, { x: 0, color: '#ccc', duration: 0.3 })
    gsap.to(ctaRef.current, { opacity: 0, y: 8, duration: 0.2 })
  }

  const handleRowClick = () => {
    if (projectLink.startsWith('/')) {
      navigate(projectLink)
    } else if (projectLink !== '#') {
      window.open(projectLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={`project-row ${isHovered ? 'hovered' : ''}`}
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleRowClick}
      style={{ cursor: isCaseStudy ? 'pointer' : 'default' }}
    >
      <div className="project-divider" />

      <div className="project-content">
        <div className="project-grid">
          {/* Column 1 - Project Name */}
          <div className="project-name-col">
            <h3 className="project-name" ref={nameRef}>
              {project.name}
            </h3>
            <a
              href={projectLink}
              className="project-cta"
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
              {dynamicSlug ? 'View Case Study' : 'View Project'} <span className="arrow">→</span>
            </a>
          </div>

          {/* Column 2 - Description */}
          <div className="project-desc-col">
            <p className="project-description">
              {project.description}
            </p>
          </div>

          {/* Column 3 - Tags & Industry */}
          <div className="project-meta-col">
            <div className="project-tags">
              {(project.tags || []).map((tag, i) => (
                <span key={i} className="project-tag">{tag}</span>
              ))}
            </div>
            <span className="project-industry">{project.industry}</span>
          </div>
        </div>
      </div>

      {/* Hover Image Panel */}
      <div
        className="project-panel"
        ref={panelRef}
        style={{ backgroundColor: project.accent || '#6d28d9' }}
      >
        <div className="panel-images">
          {(project.images || []).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${project.name} screenshot ${i + 1}`}
              className="panel-image"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PortfolioSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const rowsRef = useRef([])
  const dividersRef = useRef([])

  // Start with static fallback — immediate render, no blank flash
  const [projects, setProjects] = useState(staticFeaturedProjects)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch featured projects from API
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${API_URL}/api/projects?featured=true`)
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (json.data && json.data.length > 0) {
          setProjects(json.data)
        }
        // If no featured projects set yet, keep static fallback
      } catch (err) {
        console.warn('PortfolioSection: using static fallback', err.message)
      } finally {
        setDataLoaded(true)
      }
    }
    fetchFeatured()
  }, [])

  // GSAP animations — run after data loads so rows are in DOM
  useEffect(() => {
    if (!dataLoaded) return

    const section = sectionRef.current
    const header = headerRef.current
    const rows = rowsRef.current.filter(Boolean)
    const dividers = dividersRef.current.filter(Boolean)

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(header,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      )

      // Row stagger
      gsap.fromTo(rows,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )

      // Divider draw
      gsap.fromTo(dividers,
        { scaleX: 0 },
        {
          scaleX: 1, stagger: 0.12, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      )

      // Refresh once rows are laid out
      setTimeout(() => ScrollTrigger.refresh(), 100)
    }, section)

    return () => ctx.revert()
  }, [dataLoaded, projects])

  return (
    <section className="portfolio-section" ref={sectionRef}>
      {/* Section Header */}
      <div className="portfolio-header" ref={headerRef}>
        <div className="portfolio-header-grid">
          <span className="header-label">Selected Work</span>
          <span className="header-count">(0{projects.length})</span>
        </div>
        <div
          className="header-divider"
          ref={el => dividersRef.current[0] = el}
        />
      </div>

      {/* Project Rows */}
      <div className="portfolio-list">
        {projects.map((project, index) => (
          <div
            key={project._id || project.id || index}
            ref={el => rowsRef.current[index] = el}
          >
            <ProjectRow project={project} index={index} />
          </div>
        ))}
      </div>

      {/* Bottom divider */}
      <div
        className="portfolio-bottom-divider"
        ref={el => dividersRef.current[projects.length] = el}
      />
    </section>
  )
}

export default PortfolioSection
