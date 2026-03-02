import { motion, AnimatePresence } from 'framer-motion'
import { useCookieConsent } from '../hooks/useCookieConsent'
import './CookieBanner.css'

const categoryInfo = {
  essential: {
    label: 'Essential',
    description: 'Required for site to work'
  },
  analytics: {
    label: 'Analytics',
    description: 'Helps us improve the site'
  },
  marketing: {
    label: 'Marketing',
    description: 'Personalized ads'
  },
  personalization: {
    label: 'Personalization',
    description: 'Remembers your settings'
  }
}

function CookieBanner({ isVisible }) {
  const {
    showBanner,
    showPreferences,
    preferences,
    acceptAll,
    rejectAll,
    saveCustom,
    toggleCategory,
    openPreferences,
    closePreferences,
  } = useCookieConsent()

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="cookie-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="cookie-text"> use Cookies.</span>
            <div className="cookie-buttons">
              <button className="cookie-btn" onClick={openPreferences} data-cursor-hover>PREFERENCES</button>
              <button className="cookie-btn" onClick={rejectAll} data-cursor-hover>REJECT</button>
              <button className="cookie-btn cookie-btn-accept" onClick={acceptAll} data-cursor-hover>ACCEPT</button>
            </div>
          </motion.div>

          {/* Preferences Modal */}
          <AnimatePresence>
            {showPreferences && (
              <motion.div
                className="cookie-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePreferences}
              >
                <motion.div
                  className="cookie-modal"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="cookie-modal-header">
                    <h3>Cookie Preferences</h3>
                  </div>
                  
                  <div className="cookie-modal-body">
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <div key={key} className="cookie-category-row">
                        <div className="cookie-category-info">
                          <span className="cookie-category-label">{info.label}</span>
                          <span className="cookie-category-desc">{info.description}</span>
                        </div>
                        <div className="cookie-category-toggle">
                          {key === 'essential' ? (
                            <span className="cookie-toggle-locked">Always On</span>
                          ) : (
                            <button
                              className={`cookie-toggle-btn ${preferences[key] ? 'active' : ''}`}
                              onClick={() => toggleCategory(key)}
                              data-cursor-hover
                            >
                              {preferences[key] ? 'ON' : 'OFF'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cookie-modal-footer">
                    <button className="cookie-btn" onClick={rejectAll} data-cursor-hover>REJECT ALL</button>
                    <button className="cookie-btn" onClick={saveCustom} data-cursor-hover>SAVE</button>
                    <button className="cookie-btn cookie-btn-accept" onClick={acceptAll} data-cursor-hover>ACCEPT ALL</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

export default CookieBanner
