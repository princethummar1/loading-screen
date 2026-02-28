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
    metaTitle: 'Heimdall Power Case Study — Kyurex',
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
    metaTitle: 'Starred Case Study — Kyurex',
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
    metaTitle: 'Cula Case Study — Kyurex',
    metaDescription: 'How we created a 3D-driven web experience for a climate-tech startup that increased demo requests by 300%.',
    year: 2024,
    order: 2
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
    order: 3
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
    order: 4
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
    order: 5
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
  cookieBannerText: 'This website uses cookies to enhance your browsing experience.',
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
