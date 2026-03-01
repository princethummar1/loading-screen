import { createContext, useContext, useRef, useState, useCallback } from 'react'

const AudioCtx = createContext(null)

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasClicked, setHasClicked] = useState(
    () => sessionStorage.getItem('soundClicked') === 'true'
  )
  
  // References shared between components
  const analyserRef = useRef(null)
  const audioDataRef = useRef(new Uint8Array(128))
  const audioCtxRef = useRef(null)
  const audioElementRef = useRef(null)
  const sourceRef = useRef(null)
  
  // Toggle callback - registered by HeroOrganism
  const toggleCallbackRef = useRef(null)
  
  const registerToggle = useCallback((callback) => {
    toggleCallbackRef.current = callback
  }, [])
  
  const toggleAudio = useCallback(() => {
    if (toggleCallbackRef.current) {
      toggleCallbackRef.current()
    }
  }, [])
  
  // Mark as clicked (for cursor badge)
  const markClicked = useCallback(() => {
    setHasClicked(true)
    sessionStorage.setItem('soundClicked', 'true')
  }, [])

  return (
    <AudioCtx.Provider value={{
      isPlaying,
      setIsPlaying,
      hasClicked,
      markClicked,
      analyserRef,
      audioDataRef,
      audioCtxRef,
      audioElementRef,
      sourceRef,
      registerToggle,
      toggleAudio
    }}>
      {children}
    </AudioCtx.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioCtx)
  if (!context) {
    // Return safe defaults when outside provider (other pages)
    return {
      isPlaying: false,
      setIsPlaying: () => {},
      hasClicked: false,
      markClicked: () => {},
      analyserRef: { current: null },
      audioDataRef: { current: new Uint8Array(128) },
      audioCtxRef: { current: null },
      audioElementRef: { current: null },
      sourceRef: { current: null },
      registerToggle: () => {},
      toggleAudio: () => {}
    }
  }
  return context
}

export default AudioCtx
