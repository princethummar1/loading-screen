import { motion } from 'framer-motion'
import './HeroText.css'

function HeroText({ isVisible }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }
    }
  }

  return (
    <motion.div 
      className="hero-text"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <h1>
        Brands and Websites that move people and drive growth.
      </h1>
    </motion.div>
  )
}

export default HeroText
