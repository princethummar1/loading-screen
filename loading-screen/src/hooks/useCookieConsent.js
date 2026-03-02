import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'site_cookie_consent'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const defaultPreferences = {
  essential: true,        // always on, cannot change
  analytics: false,
  marketing: false,
  personalization: false,
}

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({ ...defaultPreferences })

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences(parsed.preferences || defaultPreferences)
        setShowBanner(false)
      } catch {
        setShowBanner(true)
      }
    } else {
      setShowBanner(true)
    }
  }, [])

  // Fire-and-forget POST to backend
  const saveToBackend = useCallback((decision, prefs) => {
    fetch(`${API_URL}/api/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decision,
        preferences: prefs
      })
    }).catch(() => {
      // Silent fail - non-blocking
    })
  }, [])

  // Save to localStorage
  const saveToStorage = useCallback((decision, prefs) => {
    const data = {
      decision,
      preferences: prefs,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allEnabled = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    }
    setPreferences(allEnabled)
    saveToStorage('accepted', allEnabled)
    saveToBackend('accepted', allEnabled)
    setShowBanner(false)
    setShowPreferences(false)
  }, [saveToStorage, saveToBackend])

  // Reject all cookies (only essential)
  const rejectAll = useCallback(() => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    }
    setPreferences(onlyEssential)
    saveToStorage('rejected', onlyEssential)
    saveToBackend('rejected', onlyEssential)
    setShowBanner(false)
    setShowPreferences(false)
  }, [saveToStorage, saveToBackend])

  // Save custom preferences
  const saveCustom = useCallback(() => {
    saveToStorage('custom', preferences)
    saveToBackend('custom', preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }, [preferences, saveToStorage, saveToBackend])

  // Toggle individual category
  const toggleCategory = useCallback((category) => {
    if (category === 'essential') return // Cannot toggle essential
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }, [])

  // Open/close preferences modal
  const openPreferences = useCallback(() => {
    setShowPreferences(true)
  }, [])

  const closePreferences = useCallback(() => {
    setShowPreferences(false)
  }, [])

  return {
    showBanner,
    showPreferences,
    preferences,
    acceptAll,
    rejectAll,
    saveCustom,
    toggleCategory,
    openPreferences,
    closePreferences,
  }
}

export default useCookieConsent
