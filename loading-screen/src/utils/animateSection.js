import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Universal section entrance animation
 * @param {string} selector - CSS selector for the element(s) to animate
 * @param {Object} options - Animation options
 */
export function animateSection(selector, options = {}) {
  const {
    y = 50,
    opacity = 0,
    duration = 1,
    ease = "power3.out",
    start = "top 82%",
    end = "top 30%",
    scrub = false,
    stagger = 0,
    delay = 0,
  } = options

  const elements = document.querySelectorAll(selector)
  if (!elements.length) return null

  return gsap.fromTo(selector,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: {
        trigger: selector,
        start,
        end: scrub ? end : undefined,
        scrub: scrub ? 1.5 : false,
        once: !scrub,
      }
    }
  )
}

/**
 * Fade-in animation for section entry before pinning
 * @param {string} selector - CSS selector
 */
export function fadeInBeforePin(selector) {
  return gsap.fromTo(selector,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 85%",
        end: "top 40%",
        scrub: 1.5,
      }
    }
  )
}

/**
 * Exit transition for section after horizontal scroll
 * @param {string} selector - CSS selector for the next section
 */
export function exitTransition(selector) {
  return gsap.fromTo(selector,
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 90%",
        end: "top 40%",
        scrub: 1.5,
      }
    }
  )
}
