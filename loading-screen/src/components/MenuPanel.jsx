import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getGlobalLenis } from './PageTransition'
import './MenuPanel.css'

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { 
    name: 'Services', 
    hasSubmenu: true,
    submenu: [
      { name: 'Web Development', path: '/services/web-development' },
      { name: 'AI Automation', path: '/services/ai-automation' },
      { name: 'Full Stack Products', path: '/services/full-stack' },
    ]
  },
  { name: 'News & Insights', path: '/news' },
  { name: 'Contact', path: '/contact' },
]

const footerLinks = ['News', 'Careers', 'LinkedIn', 'Instagram']

function MenuPanel({ isOpen, onClose }) {
  const [expandedItem, setExpandedItem] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Lock body scroll and stop Lenis when menu is open
  useEffect(() => {
    const lenis = getGlobalLenis()
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [isOpen])

  const handleNavClick = (item, e) => {
    e.preventDefault()
    
    if (item.path) {
      // Page navigation - close menu with delay for curtain animation
      onClose()
      // Delay navigation to let menu close first
      setTimeout(() => {
        navigate(item.path)
      }, 600)
    } else if (item.hasSubmenu) {
      // Toggle submenu, don't navigate
      return
    } else if (item.href && item.href.startsWith('#')) {
      // Hash navigation on same page
      onClose()
      if (location.pathname === '/') {
        // Already on home page, scroll to section
        setTimeout(() => {
          const element = document.querySelector(item.href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 600)
      } else {
        // Navigate to home first, then scroll
        setTimeout(() => {
          navigate('/')
          setTimeout(() => {
            const element = document.querySelector(item.href)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 800)
        }, 600)
      }
    }
  }

  const handleSubmenuClick = (subItem, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (subItem.path) {
      // Navigate to service page with curtain transition
      onClose()
      setTimeout(() => {
        navigate(subItem.path)
      }, 600)
    }
  }

  const panelVariants = {
    closed: { x: '-100%' },
    open: { x: 0 }
  }

  const transition = {
    type: 'tween',
    duration: 0.6,
    ease: [0.76, 0, 0.24, 1]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="menu-panel"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={transition}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="menu-close" onClick={onClose} data-cursor-hover>
              ✕
            </button>

            {/* Navigation links */}
            <nav className="menu-nav">
              {menuItems.map((item, index) => (
                <div key={item.name} className="menu-item-wrapper">
                  <div className="menu-item">
                    <a 
                      href={item.path || item.href || '#'} 
                      className={`menu-link ${(item.path && location.pathname === item.path) ? 'active' : ''}`}
                      onClick={(e) => {
                        if (item.hasSubmenu) {
                          e.preventDefault()
                          setExpandedItem(expandedItem === index ? null : index)
                        } else {
                          handleNavClick(item, e)
                        }
                      }}
                      data-cursor-hover
                    >
                      {item.name}
                    </a>
                    {item.submenu && (
                      <button 
                        className="submenu-toggle"
                        onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                        data-cursor-hover
                      >
                        {expandedItem === index ? '−' : '+'}
                      </button>
                    )}
                  </div>
                  
                  {/* Submenu - Service Sub-links */}
                  <AnimatePresence>
                    {item.submenu && expandedItem === index && (
                      <motion.div
                        className="submenu submenu-services"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <motion.a 
                            key={subItem.name} 
                            href={subItem.path || '#'} 
                            className={`submenu-service-link ${(subItem.path && location.pathname === subItem.path) ? 'active' : ''}`}
                            onClick={(e) => handleSubmenuClick(subItem, e)}
                            data-cursor-hover
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: subIndex * 0.08 
                            }}
                          >
                            {subItem.name}
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="menu-divider" />
                </div>
              ))}
            </nav>

            {/* Footer links */}
            <div className="menu-footer">
              {footerLinks.map((link) => (
                <a key={link} href="#" className="footer-link" data-cursor-hover>
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MenuPanel
