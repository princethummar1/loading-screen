import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SoundWave from './SoundWave/SoundWave'
import './Navbar.css'

function Navbar({ onMenuClick, isContactPage, isHomePage = false }) {
  const [isLight, setIsLight] = useState(false)
  const location = useLocation()
  const isOnContactPage = isContactPage || location.pathname === '/contact'
  const isOnHomePage = isHomePage || location.pathname === '/'

  useEffect(() => {
    // Contact page is always light background
    if (isOnContactPage) {
      setIsLight(true)
      return
    }

    const handleScroll = () => {
      const servicesSection = document.querySelector('.services-section')
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect()
        // Switch to light theme when services section is at the top
        setIsLight(rect.top <= 80 && rect.bottom > 80)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOnContactPage])

  return (
    <nav className={`navbar ${isLight ? 'navbar-light' : ''}`}>
      <button className="nav-pill" onClick={onMenuClick} data-cursor-hover>
        MENU
      </button>
      
      <Link to="/" className="nav-logo" data-cursor-hover>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 16L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 16L20 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Link>
      
      <div className="nav-right">
        {isOnHomePage && <SoundWave />}
        <Link 
          to="/contact" 
          className={`nav-pill ${isOnContactPage ? 'nav-pill-active' : ''}`}
          data-cursor-hover
        >
          CONTACT
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
