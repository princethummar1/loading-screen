/**
 * Database Seed Script
 * Run with: node server/scripts/seed.js
 * 
 * Seeds the MongoDB database with initial data from the existing static files.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Article = require('../models/Article');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Logo = require('../models/Logo');
const Settings = require('../models/Settings');

// Seed data
const articlesData = [
  {
    slug: 'award-winning-website-pays-for-itself',
    title: 'When an Award-Winning Website Pays for Itself (Twice)',
    category: 'INSIGHTS',
    date: new Date('2026-02-19'),
    readTime: '7 min',
    author: 'Marcus Chen',
    authorImage: 'https://picsum.photos/seed/author1/100/100',
    heroImage: 'https://picsum.photos/seed/horiz1/1400/900',
    excerpt: 'How strategic web design investment delivered 340% ROI for a B2B SaaS company, and the exact framework we used to achieve it.',
    outline: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'the-problem', label: 'The Problem' },
      { id: 'our-approach', label: 'Our Approach' },
      { id: 'the-results', label: 'The Results' },
      { id: 'key-takeaways', label: 'Key Takeaways' },
    ],
    content: [
      { type: 'paragraph', text: 'In the digital age, a website isn\'t just a virtual storefront—it\'s often the first and most critical touchpoint between a brand and its potential customers.' },
      { type: 'heading', id: 'the-problem', text: 'The Problem: A Website Working Against Itself' },
      { type: 'paragraph', text: 'When TechFlow Solutions approached us, they had a familiar story. Their product was excellent—a project management tool with genuinely innovative features—but their website told a different story entirely.' },
      { type: 'heading', id: 'our-approach', text: 'Our Approach: Design as a Revenue Driver' },
      { type: 'paragraph', text: 'We began with an intensive two-week discovery phase. Rather than jumping straight into wireframes, we embedded ourselves in TechFlow\'s sales process.' },
      { type: 'heading', id: 'the-results', text: 'The Results: Numbers That Speak' },
      { type: 'paragraph', text: 'The new website launched after eight weeks of development. Within the first 90 days, the impact was undeniable.' },
      { type: 'heading', id: 'key-takeaways', text: 'Key Takeaways for Your Brand' },
      { type: 'paragraph', text: 'Premium web design isn\'t an expense—it\'s an investment with measurable returns.' },
    ],
    status: 'published',
    featuredNewsTop: true,
    featuredNewsOther: false,
    featuredAbout: true,
    order: 0
  },
  {
    slug: 'ai-automation-reshaping-agency-model',
    title: 'How AI Automation Is Reshaping the Agency Model',
    category: 'AI',
    date: new Date('2026-01-21'),
    readTime: '9 min',
    author: 'Elena Rodriguez',
    authorImage: 'https://picsum.photos/seed/author2/100/100',
    heroImage: 'https://picsum.photos/seed/horiz2/1400/900',
    excerpt: 'The agencies that embrace AI won\'t just survive—they\'ll define the next era of creative services.',
    outline: [
      { id: 'the-shift', label: 'The Shift' },
      { id: 'automation-opportunities', label: 'Automation Opportunities' },
      { id: 'human-in-loop', label: 'Human in the Loop' },
      { id: 'implementation', label: 'Implementation' },
      { id: 'future-outlook', label: 'Future Outlook' },
    ],
    content: [
      { type: 'paragraph', text: 'The agency landscape is experiencing its most significant transformation since the digital revolution.' },
      { type: 'heading', id: 'the-shift', text: 'The Shift: From Hours to Outcomes' },
      { type: 'paragraph', text: 'Traditional agency models were built on selling time. AI automation allows us to shift toward outcome-based pricing.' },
    ],
    status: 'published',
    featuredNewsTop: false,
    featuredNewsOther: true,
    featuredAbout: true,
    order: 1
  },
  {
    slug: 'minimalism-in-web-design-2026',
    title: 'Minimalism in Web Design: Less Really Is More in 2026',
    category: 'WEB DESIGN',
    date: new Date('2025-12-15'),
    readTime: '6 min',
    author: 'James Wilson',
    authorImage: 'https://picsum.photos/seed/author3/100/100',
    heroImage: 'https://picsum.photos/seed/horiz3/1400/900',
    excerpt: 'Why the most successful brands are stripping away complexity to create digital experiences that truly resonate.',
    outline: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'principles', label: 'Core Principles' },
      { id: 'examples', label: 'Real Examples' },
      { id: 'implementation', label: 'Implementation Guide' },
    ],
    content: [
      { type: 'paragraph', text: 'In an age of constant digital noise, minimalism has emerged as the most powerful design philosophy.' },
      { type: 'heading', id: 'principles', text: 'Core Principles of Modern Minimalism' },
      { type: 'paragraph', text: 'Minimalism isn\'t about removing features—it\'s about removing friction.' },
    ],
    status: 'published',
    featuredNewsTop: true,
    featuredNewsOther: false,
    featuredAbout: false,
    order: 2
  },
  {
    slug: 'performance-optimization-secrets',
    title: 'Performance Optimization Secrets from Our Engineering Team',
    category: 'RESOURCES',
    date: new Date('2025-11-28'),
    readTime: '8 min',
    author: 'Alex Thompson',
    authorImage: 'https://picsum.photos/seed/author4/100/100',
    heroImage: 'https://picsum.photos/seed/horiz4/1400/900',
    excerpt: 'The specific techniques we use to achieve sub-second load times on complex, animation-heavy websites.',
    outline: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'critical-path', label: 'Critical Rendering Path' },
      { id: 'lazy-loading', label: 'Smart Lazy Loading' },
      { id: 'animation-perf', label: 'Animation Performance' },
    ],
    content: [
      { type: 'paragraph', text: 'Performance isn\'t a feature—it\'s the foundation everything else is built on.' },
      { type: 'heading', id: 'critical-path', text: 'Optimizing the Critical Rendering Path' },
      { type: 'paragraph', text: 'The first step in any performance optimization is understanding what blocks initial render.' },
    ],
    status: 'published',
    featuredNewsTop: false,
    featuredNewsOther: true,
    featuredAbout: false,
    order: 3
  },
  {
    slug: 'future-of-interactive-storytelling',
    title: 'The Future of Interactive Storytelling on the Web',
    category: 'INSIGHTS',
    date: new Date('2025-10-05'),
    readTime: '5 min',
    author: 'Sophie Laurent',
    authorImage: 'https://picsum.photos/seed/author5/100/100',
    heroImage: 'https://picsum.photos/seed/horiz5/1400/900',
    excerpt: 'How scroll-driven narratives and WebGL are creating new possibilities for brand storytelling.',
    outline: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'techniques', label: 'Core Techniques' },
      { id: 'case-studies', label: 'Case Studies' },
    ],
    content: [
      { type: 'paragraph', text: 'The web is evolving from a document platform to an experience medium.' },
      { type: 'heading', id: 'techniques', text: 'Techniques Driving the Revolution' },
      { type: 'paragraph', text: 'Modern browsers support capabilities that rival native applications.' },
    ],
    status: 'published',
    featuredNewsTop: false,
    featuredNewsOther: false,
    featuredAbout: true,
    order: 4
  },
  {
    slug: 'building-design-systems-scale',
    title: 'Building Design Systems That Actually Scale',
    category: 'RESOURCES',
    date: new Date('2025-09-12'),
    readTime: '10 min',
    author: 'Michael Park',
    authorImage: 'https://picsum.photos/seed/author6/100/100',
    heroImage: 'https://picsum.photos/seed/horiz6/1400/900',
    excerpt: 'Lessons from designing component libraries used across 50+ projects and hundreds of pages.',
    outline: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'foundations', label: 'Foundations' },
      { id: 'tokens', label: 'Design Tokens' },
      { id: 'components', label: 'Component Architecture' },
    ],
    content: [
      { type: 'paragraph', text: 'A design system is only as valuable as its adoption rate.' },
      { type: 'heading', id: 'foundations', text: 'Starting with Strong Foundations' },
      { type: 'paragraph', text: 'The best design systems start with clear principles, not components.' },
    ],
    status: 'published',
    order: 5
  }
];

const projectsData = [
  // ─── CASE STUDIES ───
  {
    name: 'Heimdall Power',
    slug: 'heimdall-power',
    type: 'case-study',
    description: 'Heimdall Power is an innovative Norwegian technology company specializing in advanced power grid monitoring. We crafted a full digital experience from 3D product visualization to scalable web platform.',
    tags: ['3D Animations', 'Branding', 'Web Design'],
    industry: 'Energy Technology',
    location: 'Norway',
    accent: '#FF4D2E',
    images: [
      'https://picsum.photos/seed/heimdall1/800/600',
      'https://picsum.photos/seed/heimdall2/800/600',
      'https://picsum.photos/seed/heimdall3/800/600'
    ],
    visible: true,
    featured: true,
    heroHeadline: 'The Power of Knowing',
    heroSubtext: 'Blending Scandinavian design with 3D visuals to create an unforgettable digital experience for the energy sector.',
    services: ['3D Animations', 'Branding', 'Creative Development', 'Web Design', 'Webflow Development'],
    sections: [
      {
        type: 'text',
        heading: 'The Challenge',
        body: 'Heimdall Power needed a digital presence that matched the sophistication of their power-line sensor technology. The existing site failed to communicate the scale and innovation behind their Neuron product — a tiny device that delivers massive grid intelligence.'
      },
      {
        type: 'stats',
        heading: 'Impact at a Glance',
        stats: [
          { label: 'Grid capacity increase', value: '40%' },
          { label: 'Uptime reliability', value: '98%' },
          { label: 'Sensors deployed', value: '15K+' },
          { label: 'Grid value protected', value: '$2.1B' }
        ]
      },
      {
        type: 'quote',
        quote: 'Their vision transformed how we monitor power lines — delivering the intelligence utilities need to keep the grid resilient.',
        author: 'CEO, Heimdall Power'
      },
      {
        type: 'text',
        heading: 'Our Approach',
        body: 'We built a cinematic web experience using Three.js for 3D product visualization, GSAP for scroll-driven storytelling, and a custom CMS for the engineering team to publish real-time grid data. Every interaction was designed to communicate precision, scale, and trust.'
      }
    ],
    results: [
      { metric: 'Load Increase', value: '40%' },
      { metric: 'Page Speed Score', value: '98' },
      { metric: 'Engagement Time', value: '+220%' },
      { metric: 'Lead Conversion', value: '+165%' }
    ],
    liveUrl: 'https://heimdallpower.com',
    fullBleedImages: [
      'https://picsum.photos/seed/heimdall_fb1/1920/1080',
      'https://picsum.photos/seed/heimdall_fb2/1920/1080'
    ],
    outcomeLabel: 'OUTCOME',
    outcomeDescription: 'The redesigned digital platform elevated Heimdall Power\'s brand perception across the energy sector, translating complex grid intelligence into a visually compelling narrative that resonated with utility executives and investors alike.',
    outcomeLiveUrl: 'https://heimdallpower.com',
    outcomeBgColor: '#FF4D2E',
    outcomeImage: 'https://picsum.photos/seed/heimdall_outcome/800/1000',
    outcomeImageAlt: 'Heimdall Power final website showcase',
    contentBlocks: [
      {
        type: 'text-image-right',
        order: 0,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'THE CHALLENGE',
        heading: 'Transforming Grid Intelligence',
        headingSize: 'large',
        body: 'Heimdall Power\'s existing digital presence failed to convey the scale of their Neuron sensor technology. We needed to create an experience that translated highly technical data into compelling visual storytelling — one that resonated equally with utility engineers and C-suite executives.',
        imageUrl: 'https://picsum.photos/seed/heimdall_block1/900/700',
        imageAlt: 'Heimdall Power grid monitoring dashboard',
        imageFit: 'cover',
        splitRatio: '60-40',
      },
      {
        type: 'image-full',
        order: 1,
        bgColor: '#111111',
        imageUrl: 'https://picsum.photos/seed/heimdall_block2/1920/800',
        imageAlt: 'Full-width hero of Heimdall Power website',
        imageFit: 'cover',
      },
      {
        type: 'quote',
        order: 2,
        bgColor: '#0d0d0d',
        textColor: '#ffffff',
        quote: 'Their team understood the nuance between enterprise credibility and creative storytelling. The result exceeded every benchmark we set.',
        quoteAuthor: 'Jørgen Festervoll, CEO — Heimdall Power',
      },
      {
        type: 'stats',
        order: 3,
        bgColor: '#FF4D2E',
        textColor: '#ffffff',
        heading: 'Impact at a Glance',
        headingSize: 'medium',
        stats: [
          { value: '40%', label: 'Grid capacity increase' },
          { value: '98%', label: 'Uptime reliability' },
          { value: '15K+', label: 'Sensors deployed globally' },
          { value: '$2.1B', label: 'Grid value protected' },
        ],
      },
      {
        type: 'image-text-right',
        order: 4,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'OUR APPROACH',
        heading: 'Cinematic 3D Storytelling',
        headingSize: 'large',
        body: 'We built a cinematic web experience using Three.js for 3D product visualization, GSAP for scroll-driven storytelling, and a custom CMS for the engineering team to publish real-time grid data. Every interaction was designed to communicate precision, scale, and trust.',
        imageUrl: 'https://picsum.photos/seed/heimdall_block3/900/700',
        imageAlt: 'Heimdall Power 3D visualization process',
        imageFit: 'cover',
        splitRatio: '50-50',
      },
      {
        type: 'text-full',
        order: 5,
        bgColor: '#111111',
        textColor: '#ffffff',
        label: 'TECHNOLOGY',
        heading: 'Built for Scale',
        headingSize: 'medium',
        body: 'The platform was engineered with a headless architecture, leveraging Next.js for server-side rendering, Sanity as the content layer, and a custom WebGL pipeline that delivers real-time 3D with sub-second load times. The result: a Lighthouse score of 98 on a page with full 3D interactivity.',
      },
    ],
    metaTitle: 'Heimdall Power — Selected Work — Kyurex',
    metaDescription: 'How we crafted a 3D-driven web experience for Norway\'s leading power grid intelligence company.',
    year: 2024,
    order: 0
  },
  {
    name: 'Starred',
    slug: 'starred',
    type: 'case-study',
    description: 'Starred is a recruitment platform reimagined for the modern workforce. We redesigned the entire candidate experience with data-driven design patterns and conversion-focused UX.',
    tags: ['Web App', 'Dashboard', 'SaaS'],
    industry: 'HR Technology',
    location: 'San Francisco, US',
    accent: '#00D4AA',
    images: [
      'https://picsum.photos/seed/starred1/800/600',
      'https://picsum.photos/seed/starred2/800/600',
      'https://picsum.photos/seed/starred3/800/600'
    ],
    visible: true,
    featured: true,
    heroHeadline: 'Hire Smarter, Faster',
    heroSubtext: 'Redesigning the candidate experience with data-driven insights and conversion-focused UX.',
    services: ['Web Design', 'Branding', 'Creative Development', 'UX Research', 'Webflow Development'],
    sections: [
      {
        type: 'text',
        heading: 'The Challenge',
        body: 'Starred\'s recruitment analytics platform had powerful data but a dated interface that confused recruiters. They needed a complete redesign that made complex hiring data feel intuitive and actionable.'
      },
      {
        type: 'stats',
        heading: 'Key Metrics',
        stats: [
          { label: 'User onboarding time', value: '-60%' },
          { label: 'Portal engagement', value: '+180%' },
          { label: 'NPS score improvement', value: '+45' },
          { label: 'Support tickets reduced', value: '70%' }
        ]
      },
      {
        type: 'quote',
        quote: 'The redesign completely transformed how our clients interact with hiring data. It went from confusing to delightful overnight.',
        author: 'Head of Product, Starred'
      }
    ],
    results: [
      { metric: 'Time to Hire', value: '-35%' },
      { metric: 'User Satisfaction', value: '94%' },
      { metric: 'Feature Adoption', value: '+200%' }
    ],
    liveUrl: 'https://starred.com',
    fullBleedImages: [
      'https://picsum.photos/seed/starred_fb1/1920/1080'
    ],
    outcomeLabel: 'THE RESULT',
    outcomeDescription: 'A complete platform transformation that turned a confusing data tool into an intuitive hiring companion, dramatically reducing onboarding friction and boosting recruiter confidence.',
    outcomeLiveUrl: 'https://starred.com',
    outcomeBgColor: '#00D4AA',
    outcomeImage: 'https://picsum.photos/seed/starred_outcome/800/1000',
    outcomeImageAlt: 'Starred platform redesign showcase',
    contentBlocks: [
      {
        type: 'text-full',
        order: 0,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'CONTEXT',
        heading: 'Data Should Feel Effortless',
        headingSize: 'large',
        body: 'Starred had built an incredibly powerful recruitment analytics engine — but the interface made recruiters feel like they needed a PhD to use it. Our mission was to strip away the complexity without sacrificing the depth, creating a platform that felt intuitive from the first click.',
      },
      {
        type: 'image-text-right',
        order: 1,
        bgColor: '#0d0d0d',
        textColor: '#ffffff',
        label: 'DESIGN PROCESS',
        heading: 'Clarity Through Iteration',
        headingSize: 'large',
        body: 'We ran 30+ user testing sessions, rebuilding the core dashboard three times until every chart, filter, and action was where recruiters instinctively expected it. The new information hierarchy reduced average task completion time by 60%.',
        imageUrl: 'https://picsum.photos/seed/starred_block1/900/700',
        imageAlt: 'Starred dashboard wireframe iterations',
        imageFit: 'cover',
        splitRatio: '50-50',
      },
      {
        type: 'stats',
        order: 2,
        bgColor: '#00D4AA',
        textColor: '#ffffff',
        heading: 'Key Metrics',
        headingSize: 'medium',
        stats: [
          { value: '-60%', label: 'Onboarding time' },
          { value: '+180%', label: 'Portal engagement' },
          { value: '+45', label: 'NPS score improvement' },
          { value: '70%', label: 'Fewer support tickets' },
        ],
      },
      {
        type: 'quote',
        order: 3,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        quote: 'The redesign completely transformed how our clients interact with hiring data. It went from confusing to delightful overnight.',
        quoteAuthor: 'Head of Product, Starred',
      },
      {
        type: 'text-image-right',
        order: 4,
        bgColor: '#111111',
        textColor: '#ffffff',
        label: 'OUTCOME',
        heading: 'A Platform People Love Using',
        headingSize: 'large',
        body: 'Post-launch, Starred saw feature adoption rates double as recruiters discovered tools they never knew existed. The refreshed design system now scales cleanly across 12 product modules with zero inconsistencies.',
        imageUrl: 'https://picsum.photos/seed/starred_block2/900/700',
        imageAlt: 'Starred final platform screens',
        imageFit: 'cover',
        splitRatio: '60-40',
      },
    ],
    metaTitle: 'Starred — Selected Work — Kyurex',
    metaDescription: 'How we redesigned a recruitment analytics platform to improve user onboarding by 60%.',
    year: 2023,
    order: 1
  },
  {
    name: 'Cula',
    slug: 'cula',
    type: 'case-study',
    description: 'Cula is a climate-tech startup building carbon tracking tools for enterprises. We designed their brand identity and a 3D-driven web experience that turns complex sustainability data into clear, compelling narratives.',
    tags: ['Web Design', '3D', 'Creative Development'],
    industry: 'Climate Tech',
    location: 'Berlin, Germany',
    accent: '#6366f1',
    images: [
      'https://picsum.photos/seed/cula1/800/600',
      'https://picsum.photos/seed/cula2/800/600',
      'https://picsum.photos/seed/cula3/800/600'
    ],
    visible: true,
    featured: false,
    heroHeadline: 'Track. Reduce. Report.',
    heroSubtext: 'Turning complex sustainability data into clear, compelling narratives through design and 3D.',
    services: ['Web Design', '3D Animations', 'Creative Development', 'Branding', 'Strategy'],
    sections: [
      {
        type: 'text',
        heading: 'The Vision',
        body: 'Climate data is inherently complex. Cula needed a digital experience that could distill carbon metrics, regulatory frameworks, and reduction pathways into a story that resonates with C-suite executives and sustainability officers alike.'
      },
      {
        type: 'stats',
        heading: 'Results',
        stats: [
          { label: 'Demo requests', value: '+300%' },
          { label: 'Avg. session duration', value: '4m 20s' },
          { label: 'Investor deck views', value: '2,500+' }
        ]
      },
      {
        type: 'quote',
        quote: 'Kyurex understood our mission from day one. The website doesn\'t just look beautiful — it tells the story of why carbon tracking matters.',
        author: 'Co-founder, Cula'
      }
    ],
    results: [
      { metric: 'Demo Requests', value: '+300%' },
      { metric: 'Brand Recognition', value: '+150%' },
      { metric: 'Investor Interest', value: '3x' }
    ],
    liveUrl: 'https://cula.app',
    fullBleedImages: [
      'https://picsum.photos/seed/cula_fb1/1920/1080',
      'https://picsum.photos/seed/cula_fb2/1920/1080',
      'https://picsum.photos/seed/cula_fb3/1920/1080'
    ],
    outcomeLabel: 'OUTCOME',
    outcomeDescription: 'The new digital experience transformed how enterprises perceive carbon tracking — making sustainability data feel approachable and actionable rather than overwhelming, and driving a threefold increase in investor interest.',
    outcomeLiveUrl: 'https://cula.app',
    outcomeBgColor: '#6366f1',
    outcomeImage: 'https://picsum.photos/seed/cula_outcome/800/1000',
    outcomeImageAlt: 'Cula carbon tracking platform outcome',
    contentBlocks: [
      {
        type: 'text-image-right',
        order: 0,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'THE VISION',
        heading: 'Making Carbon Data Compelling',
        headingSize: 'large',
        body: 'Climate data is inherently complex — carbon metrics, regulatory frameworks, and reduction pathways don\'t naturally lend themselves to beautiful storytelling. Our challenge was to distill this complexity into a narrative that resonates with C-suite executives and sustainability officers alike.',
        imageUrl: 'https://picsum.photos/seed/cula_block1/900/700',
        imageAlt: 'Cula carbon tracking interface concept',
        imageFit: 'cover',
        splitRatio: '50-50',
      },
      {
        type: 'image-full',
        order: 1,
        bgColor: '#0d0d0d',
        imageUrl: 'https://picsum.photos/seed/cula_block2/1920/800',
        imageAlt: 'Cula website full-width showcase',
        imageFit: 'cover',
      },
      {
        type: 'text-full',
        order: 2,
        bgColor: '#111111',
        textColor: '#ffffff',
        label: 'DESIGN PHILOSOPHY',
        heading: 'Clarity Creates Action',
        headingSize: 'medium',
        body: 'We designed every data visualization to tell a story: where your emissions come from, how they compare to benchmarks, and exactly what you can do to reduce them. Complex regulatory requirements are surfaced as actionable checklists rather than impenetrable documents.',
      },
      {
        type: 'quote',
        order: 3,
        bgColor: '#6366f1',
        textColor: '#ffffff',
        quote: 'Kyurex understood our mission from day one. The website doesn\'t just look beautiful — it tells the story of why carbon tracking matters.',
        quoteAuthor: 'Co-founder, Cula',
      },
      {
        type: 'stats',
        order: 4,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        heading: 'Results That Matter',
        headingSize: 'medium',
        stats: [
          { value: '+300%', label: 'Demo requests' },
          { value: '4m 20s', label: 'Avg. session duration' },
          { value: '2500+', label: 'Investor deck views' },
          { value: '3x', label: 'Investor interest' },
        ],
      },
      {
        type: 'image-text-right',
        order: 5,
        bgColor: '#0d0d0d',
        textColor: '#ffffff',
        label: 'TECHNOLOGY',
        heading: '3D That Performs',
        headingSize: 'large',
        body: 'The 3D globe visualization renders real-time emission data across 40+ countries with smooth 60fps performance. Built with Three.js and optimized with instanced rendering, it loads in under 2 seconds even on mid-range devices.',
        imageUrl: 'https://picsum.photos/seed/cula_block3/900/700',
        imageAlt: 'Cula 3D globe visualization',
        imageFit: 'cover',
        splitRatio: '40-60',
      },
    ],
    metaTitle: 'Cula — Selected Work — Kyurex',
    metaDescription: 'How we created a 3D-driven web experience for a climate-tech startup that increased demo requests by 300%.',
    year: 2024,
    order: 2
  },
  {
    name: 'Meridian Health',
    slug: 'meridian-health',
    type: 'case-study',
    description: 'Meridian Health is a digital-first healthcare platform connecting patients with specialists through AI-powered triage and telemedicine. We designed the brand, patient portal, and a marketing site that builds trust.',
    tags: ['Web Design', 'Branding', 'UX Research'],
    industry: 'Healthcare',
    location: 'Boston, US',
    accent: '#0ea5e9',
    images: [
      'https://picsum.photos/seed/meridian1/800/600',
      'https://picsum.photos/seed/meridian2/800/600',
      'https://picsum.photos/seed/meridian3/800/600'
    ],
    visible: true,
    featured: true,
    heroHeadline: 'Healthcare, Reimagined',
    heroSubtext: 'Building trust through intuitive design — where patients and technology meet seamlessly.',
    services: ['Web Design', 'Branding', 'UX Research', 'Creative Development', 'Strategy'],
    sections: [
      {
        type: 'text',
        heading: 'The Challenge',
        body: 'Meridian needed a digital experience that felt warm and trustworthy in an industry plagued by cold, clinical interfaces. Patients needed to feel safe before they ever spoke to a doctor.'
      },
      {
        type: 'stats',
        heading: 'Key Outcomes',
        stats: [
          { label: 'Patient onboarding', value: '+240%' },
          { label: 'Avg. wait time', value: '-75%' },
          { label: 'Patient satisfaction', value: '96%' },
          { label: 'Specialist bookings', value: '+180%' }
        ]
      },
      {
        type: 'quote',
        quote: 'They understood that in healthcare, trust isn\'t earned through flashy design — it\'s earned through clarity, empathy, and reliability.',
        author: 'Chief Medical Officer, Meridian Health'
      }
    ],
    results: [
      { metric: 'Patient Onboarding', value: '+240%' },
      { metric: 'Wait Time Reduction', value: '75%' },
      { metric: 'Patient NPS', value: '96' }
    ],
    liveUrl: 'https://meridianhealth.io',
    fullBleedImages: [
      'https://picsum.photos/seed/meridian_fb1/1920/1080',
      'https://picsum.photos/seed/meridian_fb2/1920/1080'
    ],
    outcomeLabel: 'THE RESULT',
    outcomeDescription: 'A patient-first digital platform that transformed how Meridian Health acquires, onboards, and retains patients — reducing friction at every touchpoint while maintaining the warmth and trust essential to healthcare.',
    outcomeLiveUrl: 'https://meridianhealth.io',
    outcomeBgColor: '#0ea5e9',
    outcomeImage: 'https://picsum.photos/seed/meridian_outcome/800/1000',
    outcomeImageAlt: 'Meridian Health patient portal showcase',
    contentBlocks: [
      {
        type: 'text-image-right',
        order: 0,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'THE CHALLENGE',
        heading: 'Trust Before Technology',
        headingSize: 'large',
        body: 'Healthcare interfaces often feel cold and intimidating. Meridian needed a digital presence that communicated expertise while feeling approachable — a platform where patients felt safe before they ever spoke to a doctor. Every design decision prioritized empathy over efficiency.',
        imageUrl: 'https://picsum.photos/seed/meridian_block1/900/700',
        imageAlt: 'Meridian Health patient experience wireframes',
        imageFit: 'cover',
        splitRatio: '60-40',
      },
      {
        type: 'stats',
        order: 1,
        bgColor: '#0ea5e9',
        textColor: '#ffffff',
        heading: 'Patient Outcomes',
        headingSize: 'medium',
        stats: [
          { value: '+240%', label: 'Patient onboarding' },
          { value: '-75%', label: 'Avg. wait time' },
          { value: '96%', label: 'Patient satisfaction' },
          { value: '+180%', label: 'Specialist bookings' },
        ],
      },
      {
        type: 'image-full',
        order: 2,
        bgColor: '#111111',
        imageUrl: 'https://picsum.photos/seed/meridian_block2/1920/800',
        imageAlt: 'Meridian Health full platform overview',
        imageFit: 'cover',
      },
      {
        type: 'quote',
        order: 3,
        bgColor: '#0d0d0d',
        textColor: '#ffffff',
        quote: 'They understood that in healthcare, trust isn\'t earned through flashy design — it\'s earned through clarity, empathy, and reliability.',
        quoteAuthor: 'Chief Medical Officer, Meridian Health',
      },
      {
        type: 'image-text-right',
        order: 4,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'DESIGN SYSTEM',
        heading: 'Warm, Accessible, Scalable',
        headingSize: 'large',
        body: 'We built a comprehensive design system with WCAG AAA accessibility compliance, soft color palettes inspired by natural environments, and a component library that scales across patient portal, provider dashboard, and marketing site — all sharing one cohesive visual language.',
        imageUrl: 'https://picsum.photos/seed/meridian_block3/900/700',
        imageAlt: 'Meridian Health design system components',
        imageFit: 'cover',
        splitRatio: '50-50',
      },
    ],
    metaTitle: 'Meridian Health — Selected Work — Kyurex',
    metaDescription: 'How we designed a patient-first healthcare platform that increased onboarding by 240%.',
    year: 2024,
    order: 3
  },
  {
    name: 'Vaultic',
    slug: 'vaultic',
    type: 'case-study',
    description: 'Vaultic is a next-gen cybersecurity platform for enterprise threat detection. We built their brand from zero and created a dark, immersive web experience that conveys protection without paranoia.',
    tags: ['Branding', 'Web Design', 'Creative Development'],
    industry: 'Cybersecurity',
    location: 'London, UK',
    accent: '#22d3ee',
    images: [
      'https://picsum.photos/seed/vaultic1/800/600',
      'https://picsum.photos/seed/vaultic2/800/600',
      'https://picsum.photos/seed/vaultic3/800/600'
    ],
    visible: true,
    featured: false,
    heroHeadline: 'Defend What Matters',
    heroSubtext: 'A dark, immersive brand experience for enterprise-grade cybersecurity that conveys protection without paranoia.',
    services: ['Branding', 'Web Design', 'Creative Development', '3D Animations', 'Strategy'],
    sections: [
      {
        type: 'text',
        heading: 'The Brief',
        body: 'Vaultic needed a brand that communicated strength and sophistication in a market saturated with fear-based messaging. We repositioned them as the calm, confident guardian of enterprise data.'
      },
      {
        type: 'stats',
        heading: 'Performance',
        stats: [
          { label: 'Enterprise leads', value: '+320%' },
          { label: 'Brand recall', value: '87%' },
          { label: 'Demo conversions', value: '+200%' }
        ]
      },
      {
        type: 'quote',
        quote: 'Kyurex gave us a brand that commands respect in the boardroom and captivates on every screen. We\'ve never felt more confident in our market positioning.',
        author: 'CTO, Vaultic'
      }
    ],
    results: [
      { metric: 'Enterprise Leads', value: '+320%' },
      { metric: 'Brand Recall', value: '87%' },
      { metric: 'Demo Conversions', value: '+200%' }
    ],
    liveUrl: 'https://vaultic.io',
    fullBleedImages: [
      'https://picsum.photos/seed/vaultic_fb1/1920/1080',
      'https://picsum.photos/seed/vaultic_fb2/1920/1080'
    ],
    outcomeLabel: 'OUTCOME',
    outcomeDescription: 'A brand identity and web platform that repositioned Vaultic from "another security vendor" to a premium, trusted name in enterprise cybersecurity — driving a 320% increase in qualified enterprise leads.',
    outcomeLiveUrl: 'https://vaultic.io',
    outcomeBgColor: '#22d3ee',
    outcomeImage: 'https://picsum.photos/seed/vaultic_outcome/800/1000',
    outcomeImageAlt: 'Vaultic cybersecurity platform showcase',
    contentBlocks: [
      {
        type: 'text-full',
        order: 0,
        bgColor: '#050505',
        textColor: '#ffffff',
        label: 'THE BRIEF',
        heading: 'Security Without the Scare Tactics',
        headingSize: 'large',
        body: 'The cybersecurity market is dominated by fear-based messaging — skull icons, red alerts, and doomsday language. Vaultic wanted the opposite: a brand that communicates calm confidence and quiet strength. We repositioned them as the composed guardian of enterprise data, not another vendor selling panic.',
      },
      {
        type: 'image-full',
        order: 1,
        bgColor: '#0a0a0a',
        imageUrl: 'https://picsum.photos/seed/vaultic_block1/1920/800',
        imageAlt: 'Vaultic dark immersive website hero',
        imageFit: 'cover',
      },
      {
        type: 'text-image-right',
        order: 2,
        bgColor: '#0d0d0d',
        textColor: '#ffffff',
        label: 'BRAND IDENTITY',
        heading: 'Dark Elegance, Built to Protect',
        headingSize: 'large',
        body: 'The visual system draws from deep navy and obsidian tones with cyan accents that evoke digital precision. The logomark — an abstracted shield — uses negative space to suggest both protection and openness. Typography pairs a sharp geometric sans-serif for headlines with a humanist body font for approachability.',
        imageUrl: 'https://picsum.photos/seed/vaultic_block2/900/700',
        imageAlt: 'Vaultic brand identity system',
        imageFit: 'cover',
        splitRatio: '50-50',
      },
      {
        type: 'quote',
        order: 3,
        bgColor: '#22d3ee',
        textColor: '#0a0a0a',
        quote: 'Kyurex gave us a brand that commands respect in the boardroom and captivates on every screen. We\'ve never felt more confident in our market positioning.',
        quoteAuthor: 'CTO, Vaultic',
      },
      {
        type: 'stats',
        order: 4,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        heading: 'Market Impact',
        headingSize: 'medium',
        stats: [
          { value: '+320%', label: 'Enterprise leads' },
          { value: '87%', label: 'Brand recall rate' },
          { value: '+200%', label: 'Demo conversions' },
          { value: '4.2s', label: 'Avg. time on hero' },
        ],
      },
      {
        type: 'image-text-right',
        order: 5,
        bgColor: '#111111',
        textColor: '#ffffff',
        label: 'MOTION & INTERACTION',
        heading: 'Every Pixel Reassures',
        headingSize: 'large',
        body: 'We crafted micro-interactions that reinforce the feeling of security — smooth transitions, subtle particle systems, and a WebGL shield animation that responds to cursor movement. Nothing moves aggressively; every animation says "you\'re protected."',
        imageUrl: 'https://picsum.photos/seed/vaultic_block3/900/700',
        imageAlt: 'Vaultic interaction design showcase',
        imageFit: 'cover',
        splitRatio: '40-60',
      },
    ],
    metaTitle: 'Vaultic — Selected Work — Kyurex',
    metaDescription: 'How we built a premium cybersecurity brand from zero that drove a 320% increase in enterprise leads.',
    year: 2025,
    order: 4
  },
  {
    name: 'Forma Studio',
    slug: 'forma-studio',
    type: 'case-study',
    description: 'Forma Studio is an architecture firm pushing the boundaries of sustainable design. We created a portfolio-driven website with immersive project showcases and a custom 3D model viewer for their landmark buildings.',
    tags: ['Web Design', '3D', 'Portfolio'],
    industry: 'Architecture',
    location: 'Copenhagen, Denmark',
    accent: '#f59e0b',
    images: [
      'https://picsum.photos/seed/forma1/800/600',
      'https://picsum.photos/seed/forma2/800/600',
      'https://picsum.photos/seed/forma3/800/600'
    ],
    visible: true,
    featured: true,
    heroHeadline: 'Structure Meets Story',
    heroSubtext: 'An immersive digital portfolio for architecture that lets buildings speak through interactive 3D and cinematic photography.',
    services: ['Web Design', '3D Animations', 'Creative Development', 'Photography Direction', 'Webflow Development'],
    sections: [
      {
        type: 'text',
        heading: 'The Vision',
        body: 'Forma Studio\'s buildings were winning awards, but their website looked like every other architecture firm. They wanted a digital experience as thoughtfully crafted as their structures — one that made visitors feel like they were walking through the buildings themselves.'
      },
      {
        type: 'stats',
        heading: 'Results',
        stats: [
          { label: 'Inquiry rate', value: '+190%' },
          { label: 'Avg. project page time', value: '3m 45s' },
          { label: 'Portfolio shares', value: '+400%' },
          { label: 'Awwwards recognition', value: 'SOTD' }
        ]
      },
      {
        type: 'quote',
        quote: 'Finally, a website that feels like architecture — spatial, intentional, and utterly immersive. Our clients now explore projects before they even visit the site.',
        author: 'Founding Partner, Forma Studio'
      }
    ],
    results: [
      { metric: 'Client Inquiries', value: '+190%' },
      { metric: 'Page Engagement', value: '3m 45s' },
      { metric: 'Portfolio Shares', value: '+400%' }
    ],
    liveUrl: 'https://formastudio.dk',
    fullBleedImages: [
      'https://picsum.photos/seed/forma_fb1/1920/1080',
      'https://picsum.photos/seed/forma_fb2/1920/1080',
      'https://picsum.photos/seed/forma_fb3/1920/1080'
    ],
    outcomeLabel: 'OUTCOME',
    outcomeDescription: 'A portfolio experience that elevated Forma Studio from a respected firm to a globally recognized design practice, winning Awwwards Site of the Day and driving a 190% increase in high-value client inquiries.',
    outcomeLiveUrl: 'https://formastudio.dk',
    outcomeBgColor: '#f59e0b',
    outcomeImage: 'https://picsum.photos/seed/forma_outcome/800/1000',
    outcomeImageAlt: 'Forma Studio architectural portfolio showcase',
    contentBlocks: [
      {
        type: 'text-image-right',
        order: 0,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        label: 'THE VISION',
        heading: 'Buildings Should Be Experienced',
        headingSize: 'large',
        body: 'Forma Studio\'s award-winning structures deserved more than a flat photo gallery. We set out to create a digital experience that mirrors the spatial quality of architecture itself — using parallax depth, 3D model viewers, and cinematic transitions to make visitors feel like they\'re walking through each project.',
        imageUrl: 'https://picsum.photos/seed/forma_block1/900/700',
        imageAlt: 'Forma Studio project showcase concept',
        imageFit: 'cover',
        splitRatio: '50-50',
      },
      {
        type: 'image-full',
        order: 1,
        bgColor: '#111111',
        imageUrl: 'https://picsum.photos/seed/forma_block2/1920/800',
        imageAlt: 'Forma Studio website immersive project view',
        imageFit: 'cover',
      },
      {
        type: 'image-text-right',
        order: 2,
        bgColor: '#0d0d0d',
        textColor: '#ffffff',
        label: '3D VIEWER',
        heading: 'Explore Before You Visit',
        headingSize: 'large',
        body: 'We built a custom Three.js-powered model viewer that lets clients orbit, zoom, and explore buildings in real-time 3D. Material properties, lighting conditions, and even time-of-day can be adjusted — giving clients a genuine spatial understanding before groundbreaking begins.',
        imageUrl: 'https://picsum.photos/seed/forma_block3/900/700',
        imageAlt: 'Forma Studio 3D model viewer interface',
        imageFit: 'cover',
        splitRatio: '40-60',
      },
      {
        type: 'quote',
        order: 3,
        bgColor: '#f59e0b',
        textColor: '#0a0a0a',
        quote: 'Finally, a website that feels like architecture — spatial, intentional, and utterly immersive. Our clients now explore projects before they even visit the site.',
        quoteAuthor: 'Founding Partner, Forma Studio',
      },
      {
        type: 'stats',
        order: 4,
        bgColor: '#0a0a0a',
        textColor: '#ffffff',
        heading: 'Design Impact',
        headingSize: 'medium',
        stats: [
          { value: '+190%', label: 'Client inquiries' },
          { value: '3m 45s', label: 'Avg. project page time' },
          { value: '+400%', label: 'Portfolio social shares' },
          { value: 'SOTD', label: 'Awwwards recognition' },
        ],
      },
      {
        type: 'text-full',
        order: 5,
        bgColor: '#111111',
        textColor: '#ffffff',
        label: 'PHOTOGRAPHY',
        heading: 'Cinematic Direction',
        headingSize: 'medium',
        body: 'We art-directed all architectural photography to tell a consistent visual story — shooting at golden hour, emphasizing material texture and human scale. The resulting imagery works as standalone art while serving the larger narrative of each building\'s relationship with its environment.',
      },
    ],
    metaTitle: 'Forma Studio — Selected Work — Kyurex',
    metaDescription: 'How we created an immersive 3D portfolio for a Copenhagen architecture firm that won Awwwards SOTD.',
    year: 2025,
    order: 5
  },
  // ─── REGULAR PROJECTS ───
  {
    name: 'Nexus Finance',
    slug: 'nexus-finance',
    type: 'project',
    description: 'Modern fintech dashboard with cryptocurrency integration and automated portfolio management.',
    tags: ['Dashboard', 'Fintech', 'Web App'],
    industry: 'Finance',
    location: 'New York, US',
    accent: '#a855f7',
    images: [
      'https://picsum.photos/seed/nexus1/800/600',
      'https://picsum.photos/seed/nexus2/800/600',
      'https://picsum.photos/seed/nexus3/800/600'
    ],
    visible: true,
    featured: true,
    order: 6
  },
  {
    name: 'Artisan Coffee Co.',
    slug: 'artisan-coffee-co',
    type: 'project',
    description: 'E-commerce platform for specialty coffee with subscription management and brewing guides.',
    tags: ['E-commerce', 'Website'],
    industry: 'Food & Beverage',
    location: 'Portland, US',
    accent: '#d4a574',
    images: [
      'https://picsum.photos/seed/artisan1/800/600',
      'https://picsum.photos/seed/artisan2/800/600',
      'https://picsum.photos/seed/artisan3/800/600'
    ],
    visible: true,
    order: 7
  },
  {
    name: 'Nova AI Assistant',
    slug: 'nova-ai-assistant',
    type: 'project',
    description: 'Enterprise AI assistant with natural language processing and workflow automation.',
    tags: ['AI', 'SaaS', 'Enterprise'],
    industry: 'Technology',
    location: 'Austin, US',
    accent: '#ec4899',
    images: [
      'https://picsum.photos/seed/nova1/800/600',
      'https://picsum.photos/seed/nova2/800/600',
      'https://picsum.photos/seed/nova3/800/600'
    ],
    visible: true,
    order: 7
  },
  {
    name: 'Wanderlust Travel',
    slug: 'wanderlust-travel',
    type: 'project',
    description: 'Luxury travel booking platform with personalized itinerary builder and immersive destination previews.',
    tags: ['Web App', 'E-commerce', 'UX Design'],
    industry: 'Travel & Hospitality',
    location: 'Dubai, UAE',
    accent: '#14b8a6',
    images: [
      'https://picsum.photos/seed/wanderlust1/800/600',
      'https://picsum.photos/seed/wanderlust2/800/600',
      'https://picsum.photos/seed/wanderlust3/800/600'
    ],
    visible: true,
    featured: true,
    order: 8
  },
  {
    name: 'Pulse Fitness',
    slug: 'pulse-fitness',
    type: 'project',
    description: 'Connected fitness platform with real-time workout tracking, community challenges, and AI-powered coaching.',
    tags: ['Mobile App', 'Dashboard', 'IoT'],
    industry: 'Health & Fitness',
    location: 'Los Angeles, US',
    accent: '#ef4444',
    images: [
      'https://picsum.photos/seed/pulse1/800/600',
      'https://picsum.photos/seed/pulse2/800/600',
      'https://picsum.photos/seed/pulse3/800/600'
    ],
    visible: true,
    order: 9
  },
  {
    name: 'Synapse Education',
    slug: 'synapse-education',
    type: 'project',
    description: 'Adaptive learning platform using AI to personalize curriculum paths for K-12 students and educators.',
    tags: ['EdTech', 'AI', 'Web App'],
    industry: 'Education',
    location: 'Toronto, Canada',
    accent: '#8b5cf6',
    images: [
      'https://picsum.photos/seed/synapse1/800/600',
      'https://picsum.photos/seed/synapse2/800/600',
      'https://picsum.photos/seed/synapse3/800/600'
    ],
    visible: true,
    order: 10
  }
];

const servicesData = [
  {
    slug: 'web-development',
    name: 'Web Development',
    heroDescription: 'We build high-performance web platforms that captivate, convert, and scale. Every project combines strategic thinking with technical precision to deliver products your audience remembers.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    statementText: 'We believe a website is more than just a digital presence — it is an essential tool for engagement and conversion. By blending creativity with strategy, we create digital experiences that leave a lasting impact and drive business growth.',
    statementImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=800&fit=crop',
    visionTitle: 'Our Vision on Web Development',
    visionQuote: 'At Kyurex, we believe that a website is more than just a digital presence — it\'s an essential tool for engagement and conversion.',
    visionPara1: 'Award-winning web platforms aren\'t just visually striking — they deliver measurable results. We blend creativity with strategic architecture to build sites that win attention and drive business growth.',
    visionPara2: 'From our experience building platforms across healthcare, real estate, and fintech, we understand how the right combination of design and technology transforms a static page into a dynamic, engaging experience.',
    visionImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=700&fit=crop',
    approachItems: [
      { num: '01', question: 'Human-Centered Design', answer: 'We focus on emotional engagement, creating interfaces that evoke the right feelings and foster genuine connections with your audience at every touchpoint.' },
      { num: '02', question: 'Creative Excellence', answer: 'Every pixel is intentional. We craft visual systems that are cohesive, distinctive, and built to stand out.' },
      { num: '03', question: 'Engaging Interactions', answer: 'Micro-animations and scroll-triggered interactions make your platform feel alive and satisfying.' },
      { num: '04', question: 'Strategic Architecture', answer: 'We engineer every project with SEO, speed, accessibility, and conversion in mind.' }
    ],
    serviceCards: [
      { title: '', description: '' },
      { title: 'Art Direction', description: 'Our art direction ensures every visual aspect of your platform is compelling and consistent.' },
      { title: 'Branding', description: 'We craft brand systems that leave lasting impressions.' },
      { title: '2D & 3D Animations', description: 'Engage users with dynamic Lottie animations and interactive 3D elements.' },
      { title: 'Custom Development', description: 'Bespoke web applications built on modern stacks.' },
      { title: 'Performance Engineering', description: 'Every platform we build is optimized for Core Web Vitals.' }
    ]
  },
  {
    slug: 'ai-automation',
    name: 'AI Automation',
    heroDescription: 'We design intelligent automation systems that eliminate repetitive work, accelerate workflows, and unlock hidden efficiency across your entire operation.',
    heroImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop',
    statementText: 'We believe automation is more than just efficiency — it is a competitive advantage. By combining intelligent systems with strategic thinking, we create workflows that scale your impact while reducing manual effort.',
    statementImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop',
    visionTitle: 'Our Vision on AI Automation',
    visionQuote: 'The future belongs to organizations that can harness AI to amplify human capabilities, not replace them.',
    visionPara1: 'We build AI systems that handle the repetitive so your team can focus on the creative. Our automation solutions integrate seamlessly with your existing workflows.',
    visionPara2: 'From intelligent document processing to predictive analytics, we implement AI where it creates the most impact for your bottom line.',
    visionImage: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=500&h=700&fit=crop',
    approachItems: [
      { num: '01', question: 'Workflow Analysis', answer: 'We map your existing processes to identify automation opportunities with the highest ROI.' },
      { num: '02', question: 'Intelligent Design', answer: 'Our AI solutions are designed to learn and improve over time, adapting to your evolving needs.' },
      { num: '03', question: 'Seamless Integration', answer: 'We build systems that connect with your existing tools, minimizing disruption.' },
      { num: '04', question: 'Continuous Optimization', answer: 'Post-launch monitoring ensures your automation continues to deliver value.' }
    ],
    serviceCards: [
      { title: '', description: '' },
      { title: 'Process Automation', description: 'Eliminate repetitive tasks with intelligent workflow automation.' },
      { title: 'AI Chatbots', description: 'Deploy conversational AI that handles customer inquiries 24/7.' },
      { title: 'Document Processing', description: 'Extract and process information from documents automatically.' },
      { title: 'Predictive Analytics', description: 'Leverage AI to forecast trends and inform decisions.' },
      { title: 'Custom AI Solutions', description: 'Bespoke AI systems tailored to your specific challenges.' }
    ]
  },
  {
    slug: 'full-stack',
    name: 'Full Stack Products',
    heroDescription: 'We architect and build complete digital products from concept to launch. Full-stack development that scales from MVP to enterprise.',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
    statementText: 'We believe great products are built on solid foundations. Our full-stack approach ensures every layer of your product — from database to interface — works in perfect harmony.',
    statementImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=800&fit=crop',
    visionTitle: 'Our Vision on Full Stack Development',
    visionQuote: 'A product is only as strong as its weakest layer. We ensure there are no weak layers.',
    visionPara1: 'End-to-end product development requires mastery of both frontend craft and backend architecture. Our teams excel at both.',
    visionPara2: 'From initial concept through launch and beyond, we partner with you to build products that users love and businesses depend on.',
    visionImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=700&fit=crop',
    approachItems: [
      { num: '01', question: 'Product Discovery', answer: 'We validate ideas before building, ensuring we\'re solving real problems for real users.' },
      { num: '02', question: 'Architecture Design', answer: 'Scalable, maintainable systems designed for your current needs and future growth.' },
      { num: '03', question: 'Agile Development', answer: 'Iterative development with continuous delivery keeps you in control.' },
      { num: '04', question: 'Launch & Support', answer: 'We don\'t disappear after launch. Ongoing support ensures long-term success.' }
    ],
    serviceCards: [
      { title: '', description: '' },
      { title: 'MVP Development', description: 'Get to market fast with focused, high-impact first versions.' },
      { title: 'API Development', description: 'RESTful and GraphQL APIs built for performance and scalability.' },
      { title: 'Database Architecture', description: 'Data systems designed for integrity, speed, and scale.' },
      { title: 'Cloud Infrastructure', description: 'AWS, GCP, and Azure deployments optimized for your workload.' },
      { title: 'DevOps & CI/CD', description: 'Automated pipelines that accelerate delivery and reduce risk.' }
    ]
  }
];

const faqsData = [
  {
    question: 'What is your typical project timeline?',
    answer: 'Most projects range from 6-12 weeks depending on scope and complexity. We\'ll provide a detailed timeline during our discovery phase.',
    order: 0
  },
  {
    question: 'How do you handle project pricing?',
    answer: 'We offer both fixed-price and retainer models depending on project type. All quotes include detailed breakdowns with no hidden fees.',
    order: 1
  },
  {
    question: 'Do you work with startups or only enterprises?',
    answer: 'We work with companies of all sizes. Our scalable approach means we can deliver enterprise-quality work at startup-friendly budgets.',
    order: 2
  },
  {
    question: 'What technologies do you specialize in?',
    answer: 'Our core stack includes React, Next.js, Node.js, and Python. We also work with AI/ML technologies, cloud platforms, and various databases.',
    order: 3
  },
  {
    question: 'How do we get started?',
    answer: 'Simply reach out via our contact form or email. We\'ll schedule a discovery call to understand your needs and discuss how we can help.',
    order: 4
  }
];

const logosData = [
  { name: 'OpenAI', url: 'https://openai.com', logoUrl: 'https://logo.clearbit.com/openai.com', order: 0 },
  { name: 'Vercel', url: 'https://vercel.com', logoUrl: 'https://logo.clearbit.com/vercel.com', order: 1 },
  { name: 'Figma', url: 'https://figma.com', logoUrl: 'https://logo.clearbit.com/figma.com', order: 2 },
  { name: 'Stripe', url: 'https://stripe.com', logoUrl: 'https://logo.clearbit.com/stripe.com', order: 3 },
  { name: 'Notion', url: 'https://notion.so', logoUrl: 'https://logo.clearbit.com/notion.so', order: 4 },
  { name: 'Linear', url: 'https://linear.app', logoUrl: 'https://logo.clearbit.com/linear.app', order: 5 },
  { name: 'Framer', url: 'https://framer.com', logoUrl: 'https://logo.clearbit.com/framer.com', order: 6 },
  { name: 'Webflow', url: 'https://webflow.com', logoUrl: 'https://logo.clearbit.com/webflow.com', order: 7 }
];

const testimonialsData = [
  {
    quote: 'Kyurex transformed our digital presence completely. The website they built for us has increased our conversion rate by over 300%.',
    authorName: 'Sarah Mitchell',
    authorCompany: 'TechFlow Solutions',
    authorImage: 'https://picsum.photos/seed/testimonial1/100/100',
    pages: ['home', 'portfolio', 'services'],
    visible: true,
    order: 0
  },
  {
    quote: 'Working with Kyurex was a game-changer. Their AI automation solutions saved us hundreds of hours per month.',
    authorName: 'David Park',
    authorCompany: 'Meridian Group',
    authorImage: 'https://picsum.photos/seed/testimonial2/100/100',
    pages: ['home', 'services', 'contact'],
    visible: true,
    order: 1
  },
  {
    quote: 'The attention to detail and strategic thinking sets Kyurex apart. They don\'t just build websites—they build business tools.',
    authorName: 'Emma Chen',
    authorCompany: 'Pulse Health',
    authorImage: 'https://picsum.photos/seed/testimonial3/100/100',
    pages: ['about', 'portfolio'],
    visible: true,
    order: 2
  }
];

const defaultSettings = {
  agencyName: 'Kyurex',
  contactEmail: 'hello@kyurex.com',
  responseTimeText: 'We typically respond within 24 hours.',
  cookieBannerText: 'We use cookies to deliver and improve our services, analyze site usage, and if you agree, to customize or personalize your experience and market our services to you. You can read our Cookie Policy here.',
  footerBadgeText: 'AI & Web Agency',
  socialLinks: {
    instagram: 'https://instagram.com/kyurex',
    linkedin: 'https://linkedin.com/company/kyurex',
    twitter: 'https://twitter.com/kyurex',
    youtube: 'https://youtube.com/@kyurex'
  },
  seoDefaults: {
    title: 'Kyurex | AI & Web Development Agency',
    description: 'Premium web development and AI automation agency. We build high-performance digital products that drive business growth.',
    ogImage: 'https://picsum.photos/seed/kyurex-og/1200/630'
  }
};

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Article.deleteMany({}),
      Project.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
      FAQ.deleteMany({}),
      Logo.deleteMany({}),
      Settings.deleteMany({ key: { $ne: 'adminPasswordHash' } }) // Preserve password hash
    ]);

    // Seed Articles
    console.log('Seeding articles...');
    await Article.insertMany(articlesData);
    console.log(`  ✓ ${articlesData.length} articles created`);

    // Seed Projects
    console.log('Seeding projects...');
    await Project.insertMany(projectsData);
    console.log(`  ✓ ${projectsData.length} projects created`);

    // Seed Services
    console.log('Seeding services...');
    await Service.insertMany(servicesData);
    console.log(`  ✓ ${servicesData.length} services created`);

    // Seed Testimonials
    console.log('Seeding testimonials...');
    await Testimonial.insertMany(testimonialsData);
    console.log(`  ✓ ${testimonialsData.length} testimonials created`);

    // Seed FAQs
    console.log('Seeding FAQs...');
    await FAQ.insertMany(faqsData);
    console.log(`  ✓ ${faqsData.length} FAQs created`);

    // Seed Logos
    console.log('Seeding logos...');
    await Logo.insertMany(logosData);
    console.log(`  ✓ ${logosData.length} logos created`);

    // Seed Settings
    console.log('Seeding settings...');
    for (const [key, value] of Object.entries(defaultSettings)) {
      await Settings.setSetting(key, value);
    }
    console.log(`  ✓ ${Object.keys(defaultSettings).length} settings created`);

    // Create admin password hash if it doesn't exist
    const existingHash = await Settings.getSetting('adminPasswordHash');
    if (!existingHash) {
      console.log('Creating admin password hash...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      await Settings.setSetting('adminPasswordHash', hash);
      console.log('  ✓ Admin password hash created');
    } else {
      console.log('  ℹ Admin password hash already exists');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nAdmin credentials:`);
    console.log(`  Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`  Password: [set in .env]`);

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seed();
