import { useState, useEffect } from 'react'
import { getLogos } from '../utils/api'
import './LogoMarquee.css'

const defaultLogos = [
  { name: 'OpenAI', url: 'https://openai.com', logoUrl: 'https://logo.clearbit.com/openai.com' },
  { name: 'Webflow', url: 'https://webflow.com', logoUrl: 'https://logo.clearbit.com/webflow.com' },
  { name: 'Vercel', url: 'https://vercel.com', logoUrl: 'https://logo.clearbit.com/vercel.com' },
  { name: 'Figma', url: 'https://figma.com', logoUrl: 'https://logo.clearbit.com/figma.com' },
  { name: 'Notion', url: 'https://notion.so', logoUrl: 'https://logo.clearbit.com/notion.so' },
  { name: 'Stripe', url: 'https://stripe.com', logoUrl: 'https://logo.clearbit.com/stripe.com' },
  { name: 'Shopify', url: 'https://shopify.com', logoUrl: 'https://logo.clearbit.com/shopify.com' },
  { name: 'HubSpot', url: 'https://hubspot.com', logoUrl: 'https://logo.clearbit.com/hubspot.com' },
  { name: 'Framer', url: 'https://framer.com', logoUrl: 'https://logo.clearbit.com/framer.com' },
  { name: 'Anthropic', url: 'https://anthropic.com', logoUrl: 'https://logo.clearbit.com/anthropic.com' },
]

function LogoMarquee({ showLabel = true }) {
  const [logos, setLogos] = useState(defaultLogos)

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const data = await getLogos()
        if (data && data.length > 0) {
          setLogos(data)
        }
      } catch (error) {
        console.warn('Failed to fetch logos, using defaults')
      }
    }
    fetchLogos()
  }, [])
  // Duplicate logos for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div className="logo-marquee-section">
      {showLabel && (
        <p className="marquee-label">Trusted tools & partners</p>
      )}
      
      <div className="marquee-container">
        <div className="marquee-track">
          {duplicatedLogos.map((logo, index) => (
            <a
              key={`${logo.name}-${index}`}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-logo"
              data-cursor-hover
            >
              <img
                src={logo.logoUrl}
                alt={logo.name}
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogoMarquee
