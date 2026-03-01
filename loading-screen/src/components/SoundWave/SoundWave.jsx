import { useRef, useEffect, useState } from 'react'
import { useAudio } from '../../context/AudioContext'
import './SoundWave.css'

const SoundWave = () => {
  const { isPlaying, analyserRef, audioDataRef, toggleAudio } = useAudio()
  const barsRef = useRef([])
  const rafRef = useRef(null)
  const [bars] = useState([0, 1, 2, 3]) // 4 bars

  useEffect(() => {
    if (!isPlaying) {
      // Reset all bars to flat
      barsRef.current.forEach(bar => {
        if (bar) bar.style.height = '4px'
      })
      cancelAnimationFrame(rafRef.current)
      return
    }

    const animate = () => {
      if (!analyserRef.current) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      analyserRef.current.getByteFrequencyData(audioDataRef.current)
      const d = audioDataRef.current

      // Map 4 bars to different frequency ranges
      const frequencies = [
        d.slice(2, 8).reduce((a, b) => a + b, 0) / 6,     // bass
        d.slice(8, 30).reduce((a, b) => a + b, 0) / 22,   // low-mid
        d.slice(30, 80).reduce((a, b) => a + b, 0) / 50,  // mid
        d.slice(80, 128).reduce((a, b) => a + b, 0) / 48, // high
      ]

      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        // Map 0-255 to 4px-20px height
        const h = 4 + (frequencies[i] / 255) * 16
        bar.style.height = `${h}px`
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, analyserRef, audioDataRef])

  const handleClick = () => {
    // Use context toggle function
    toggleAudio()
  }

  return (
    <button
      className={`sound-wave ${isPlaying ? 'playing' : ''}`}
      onClick={handleClick}
      aria-label="Toggle sound"
      data-cursor-hover
    >
      <span className="sound-wave__label">SOUND</span>
      <div className="sound-wave__bars">
        {bars.map(i => (
          <span
            key={i}
            ref={el => barsRef.current[i] = el}
            className="sound-wave__bar"
          />
        ))}
      </div>
    </button>
  )
}

export default SoundWave
