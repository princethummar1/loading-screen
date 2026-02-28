import './HeroBackground.css'

function HeroBackground({ children }) {
  // Generate lines spaced 50px apart
  const lineCount = Math.ceil(window.innerWidth / 50)
  const lines = Array.from({ length: lineCount }, (_, i) => i)

  return (
    <div className="hero-background">
      <div className="vertical-lines">
        {lines.map((i) => (
          <div 
            key={i} 
            className="vertical-line" 
            style={{ 
              left: `${i * 50}px`,
              animationDelay: `${i * 0.1}s`
            }} 
          />
        ))}
      </div>
      {children}
    </div>
  )
}

export default HeroBackground
