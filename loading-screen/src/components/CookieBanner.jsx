import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './CookieBanner.css'

function CookieBanner({ isVisible }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cookie-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="cookie-text"> use Cookies.</span>
          <div className="cookie-buttons">
            <button className="cookie-btn" data-cursor-hover>PREFERENCES</button>
            <button className="cookie-btn" onClick={() => setDismissed(true)} data-cursor-hover>REJECT</button>
            <button className="cookie-btn cookie-btn-accept" onClick={() => setDismissed(true)} data-cursor-hover>ACCEPT</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieBanner
