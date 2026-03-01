import { useState, useRef } from 'react'
import LoadingScreen from './components/LoadingScreen'
import HeroBackground from './components/HeroBackground'
import HeroOrganism from './components/HeroOrganism'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import MenuPanel from './components/MenuPanel'
import HeroText from './components/HeroText'
import CookieBanner from './components/CookieBanner'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import PortfolioSection from './components/PortfolioSection'
import PartnershipSection from './components/PartnershipSection'
import FooterCTA from './components/FooterCTA'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showHeroContent, setShowHeroContent] = useState(false)
  const loaderRef = useRef(null)

  // Initialize global smooth scroll
  useSmoothScroll()

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay to let the loading screen finish sliding up
    setTimeout(() => {
      setShowHeroContent(true)
    }, 100)
  }

  return (
    <>
      <CustomCursor />
      
      {/* Fixed Navbar */}
      <Navbar onMenuClick={() => setIsMenuOpen(true)} isHomePage={true} />

      {/* FOOTER fixed at bottom - revealed when scrolling past content */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100vh',
        zIndex: 1,
        overflow: 'visible',
        pointerEvents: 'auto',
      }}>
        <FooterCTA />
      </div>

      {/* MAIN CONTENT scrolls over fixed footer */}
      <main style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        {/* Content wrapper with pointer events */}
        <div style={{ pointerEvents: 'auto' }}>
          {/* Hero Section */}
          <HeroBackground>
            <HeroOrganism />
            <HeroText isVisible={showHeroContent} />
            <CookieBanner isVisible={showHeroContent} />
          </HeroBackground>

          {/* About Section */}
          <AboutSection />

          {/* Services Section */}
          <ServicesSection />

          {/* Portfolio Section */}
          <PortfolioSection />

          {/* Partnership Section */}
          <PartnershipSection />
        </div>

        {/* Spacer - inherits pointer-events: none from main, footer receives events */}
        <div style={{ height: '100vh' }} />
      </main>

      {/* Menu Panel */}
      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Loading screen overlay */}
      {isLoading && (
        <LoadingScreen ref={loaderRef} onComplete={handleLoadingComplete} />
      )}
    </>
  )
}

export default App
