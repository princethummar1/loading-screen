# Kyurex Agency Website

## Section 1 — Project Overview

Kyurex is a modern, high-performance digital agency website built with React and Vite. The site showcases web development, AI automation, and full-stack product services through an immersive, animation-rich experience. It features a loading screen with percentage counter, smooth scroll navigation, scroll-triggered animations, 3D interactive elements, and a comprehensive page transition system. The website serves as both a portfolio showcase and lead generation platform for the agency.

---

## Section 2 — Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | Core UI framework for building component-based interfaces |
| react-dom | ^18.2.0 | React DOM renderer for web applications |
| react-router-dom | ^7.13.0 | Client-side routing with dynamic route matching and page transitions |
| gsap | ^3.14.2 | GreenSock Animation Platform - handles all scroll-triggered animations, curtain reveals, text effects, and complex timeline sequences |
| @studio-freight/lenis | ^1.0.42 | Smooth scroll library providing buttery-smooth scroll experience and integration with ScrollTrigger |
| framer-motion | ^12.34.3 | Animation library for React - used for menu panel animations, cookie banner, and component mount/unmount transitions |
| @react-three/fiber | ^8.18.0 | React renderer for Three.js - powers the 3D interactive letterK hero element |
| @react-three/drei | ^9.122.0 | Helper components for React Three Fiber - provides utilities for 3D scene setup |
| three | ^0.183.1 | 3D graphics library - renders the interactive deconstructed "K" letter with mouse-reactive rotation |
| react-icons | ^5.5.0 | Icon library providing Feather Icons (FiInstagram, FiLinkedin, etc.) and Font Awesome icons |
| vite | ^5.0.8 | Build tool and dev server with hot module replacement |
| @vitejs/plugin-react | ^4.2.1 | Vite plugin enabling React Fast Refresh and JSX support |
| @types/react | ^18.2.43 | TypeScript type definitions for React (dev dependency) |
| @types/react-dom | ^18.2.17 | TypeScript type definitions for React DOM (dev dependency) |

---

## Section 3 — Project Structure

```
loading-screen/
├── index.html                    # HTML entry point with Google Fonts (Inter) preconnect
├── package.json                  # NPM dependencies and scripts
├── vite.config.js               # Vite configuration with React plugin
├── src/
│   ├── main.jsx                 # React entry point with BrowserRouter and route definitions
│   ├── App.jsx                  # Home page wrapper with loading screen, sections, and states
│   ├── index.css                # Global styles, cursor settings, transparent background for footer reveal
│   │
│   ├── components/
│   │   ├── LoadingScreen.jsx    # Percentage counter (0-100%) with GSAP slide-up exit
│   │   ├── LoadingScreen.css
│   │   ├── Navbar.jsx           # Fixed top navbar with MENU/CONTACT pills, scroll-aware theme switching
│   │   ├── Navbar.css
│   │   ├── MenuPanel.jsx        # Full-screen slide-in navigation with Framer Motion, expandable Services submenu
│   │   ├── MenuPanel.css
│   │   ├── HeroBackground.jsx   # Vertical lines background container for hero section
│   │   ├── HeroBackground.css
│   │   ├── HeroText.jsx         # Animated hero tagline with Framer Motion entrance
│   │   ├── HeroText.css
│   │   ├── LetterK.jsx          # 3D interactive "K" logo using React Three Fiber with mouse-reactive rotation
│   │   ├── LetterK.css
│   │   ├── CustomCursor.jsx     # Custom cursor with hover states, light/dark themes, lerp-based movement
│   │   ├── CustomCursor.css
│   │   ├── CookieBanner.jsx     # Cookie consent banner with accept/reject/preferences buttons
│   │   ├── CookieBanner.css
│   │   ├── AboutSection.jsx     # Homepage about section with image curtain reveal and word-by-word text opacity
│   │   ├── AboutSection.css
│   │   ├── ServicesSection.jsx  # Homepage services with blur headline reveal and word-opacity body paragraphs
│   │   ├── ServicesSection.css
│   │   ├── PortfolioSection.jsx # Project list with hover-expandable image panels and staggered animations
│   │   ├── PortfolioSection.css
│   │   ├── PartnershipSection.jsx # Kyurex Model section with horizontal pin-scroll steps, typewriter effect, testimonial
│   │   ├── PartnershipSection.css
│   │   ├── FooterCTA.jsx        # Fixed footer with social icons, nav links, two-panel layout, magnetic buttons
│   │   ├── FooterCTA.css
│   │   ├── LogoMarquee.jsx      # Infinite scrolling logo strip with partner/tool logos (Clearbit API)
│   │   ├── LogoMarquee.css
│   │   ├── MagneticIcon.jsx     # Reusable magnetic pull effect wrapper for any element
│   │   ├── PageTransition.jsx   # Curtain page transition system with KYUREX logo, global Lenis management
│   │   ├── PageTransition.css
│   │   ├── ContactPage.jsx      # Contact form with FAQ accordion, testimonial card, social icons
│   │   ├── ContactPage.css
│   │   ├── PortfolioPage.jsx    # Full portfolio page with filter tags and expandable project rows
│   │   ├── PortfolioPage.css
│   │   ├── AboutPage.jsx        # About page with hero, accordion, fan gallery with video modal, articles
│   │   ├── AboutPage.css
│   │   ├── ServiceDetailPage.jsx # Dynamic service pages loaded from servicesData, accordion, services grid
│   │   ├── ServiceDetailPage.css
│   │   ├── NewsInsightsPage.jsx # News hub with horizontal scroll cards, stacked deck, archive list, CTA
│   │   ├── NewsInsightsPage.css
│   │   ├── ArticleDetailPage.jsx # Article reader with sticky outline, content blocks, related articles
│   │   └── ArticleDetailPage.css
│   │
│   ├── data/
│   │   ├── articlesData.js      # Full article content with slugs, outline, content blocks, metadata
│   │   └── servicesData.js      # Service page content keyed by slug (web-development, ai-automation, full-stack)
│   │
│   ├── hooks/
│   │   └── useSmoothScroll.js   # Custom hook initializing Lenis smooth scroll with ScrollTrigger sync
│   │
│   └── utils/
│       └── animateSection.js    # Reusable GSAP animation helpers for section entrances
```

---

## Section 4 — Pages Documentation

### Home Page (`/`)
- **Route**: `/`
- **Purpose**: Main landing page showcasing agency capabilities and portfolio highlights
- **Sections**:
  1. **Hero** - 3D interactive K letter, animated tagline, vertical lines background
  2. **About Section** - Portrait with curtain reveal, word-by-word paragraph animation
  3. **Services Section** - Blur-scrub headline, service rows with images, logo marquee
  4. **Portfolio Section** - Project list with hover-expandable panels
  5. **Partnership Section** - Horizontal scroll process steps, testimonial with scramble text effect
- **Key Animations**: 
  - Loading screen percentage counter → slide-up exit
  - Word opacity scroll reveal
  - Image curtain reveals
  - Horizontal pin-scroll for process steps
  - Typewriter title effect
- **Data**: Static content embedded in components
- **Components**: LoadingScreen, HeroBackground, LetterK, HeroText, CookieBanner, AboutSection, ServicesSection, PortfolioSection, PartnershipSection, FooterCTA

### Contact Page (`/contact`)
- **Route**: `/contact`
- **Purpose**: Lead capture with contact form and FAQ
- **Sections**:
  1. **Header** - Two-line animated heading
  2. **Testimonial Card** - Client quote with photo
  3. **FAQ Accordion** - 5 expandable questions
  4. **Social Icons** - Magnetic icon row
  5. **Contact Form** - Name, company, email, budget, message fields
- **Key Animations**:
  - Staggered heading lines entrance
  - FAQ accordion expand/collapse with GSAP
  - Submit button arrow slide on hover
- **Data**: FAQ data embedded in component
- **Components**: Navbar, MenuPanel, CustomCursor, MagneticIcon

### Portfolio Page (`/portfolio`)
- **Route**: `/portfolio`
- **Purpose**: Complete case study showcase with filtering
- **Sections**:
  1. **Hero** - Title with slam-up animation, filter tags
  2. **Case Studies List** - Filterable project rows with hover panels
  3. **Working with Kyurex** - Service links, team photo, testimonial
- **Key Animations**:
  - Hero heading slam entrance
  - Filter tags fade-in stagger
  - Project rows entrance on scroll
  - Photo curtain reveal on scroll
- **Data**: Projects array embedded in component
- **Components**: Navbar, MenuPanel, CustomCursor, FooterCTA

### About Page (`/about`)
- **Route**: `/about`
- **Purpose**: Agency story, team, and philosophy
- **Sections**:
  1. **Hero Header** - Tiled background with parallax, heading slam
  2. **About Statement** - Two-column with word opacity effect
  3. **Logo Marquee** - Partner logos infinite scroll
  4. **Accordion** - "The Kyurex Approach" - 6 expandable items
  5. **Fan Gallery** - 5-image parallax fan that expands to showreel
  6. **Values Statement** - Three statement lines with photo reveal
  7. **Articles** - 3-card horizontal grid
- **Key Animations**:
  - Background parallax on scroll
  - Word opacity scroll
  - Fan gallery pin-scroll expand
  - Glowing orb and showreel button fade-in
- **Data**: Accordion items, articles preview embedded in component
- **Components**: Navbar, MenuPanel, CustomCursor, FooterCTA, LogoMarquee

### Service Detail Pages (`/services/:slug`)
- **Routes**: 
  - `/services/web-development`
  - `/services/ai-automation`
  - `/services/full-stack`
- **Purpose**: Detailed service offering page with approach and capabilities
- **Sections**:
  1. **Hero** - Character-by-character slam entrance, description
  2. **Statement** - Two-tone curtain reveal image, word opacity text
  3. **Vision** - Blur/scale title reveal, image with rotation parallax
  4. **Our Approach Accordion** - 4 items with number scramble effect
  5. **Services Grid** - Sticky title, alternating card entrances
  6. **Working with Kyurex** - Service links, team photo, testimonial
- **Key Animations**:
  - Per-character slam entrance
  - Two-phase curtain reveal (purple → dark)
  - Vision image rotation parallax
  - Number scramble effect
  - Auto-open first accordion on scroll
- **Data**: `servicesData.js` - content keyed by slug
- **Components**: Navbar, MenuPanel, CustomCursor, FooterCTA

### News & Insights Page (`/news`)
- **Route**: `/news`
- **Purpose**: Article hub with multiple browsing modes
- **Sections**:
  1. **Hero** - Letter assembly animation with mouse repel effect
  2. **Horizontal Scroll Cards** - 3 featured articles with parallax
  3. **Ignite Section** - Animated text reveal
  4. **Stacked Deck** - 3 cards with deck-style scroll
  5. **Other Articles** - 3-card grid
  6. **Archive** - Category filters, article rows
  7. **Newsletter CTA** - Email signup
- **Key Animations**:
  - Hero letters scatter → assemble
  - Mouse repel on hero letters
  - Horizontal scroll with progress dots
  - Card curtain reveals
  - Archive row stagger entrance
- **Data**: horizontalArticles, deckArticles, otherArticles, archiveArticles embedded
- **Components**: Navbar, MenuPanel, CustomCursor, FooterCTA, MagneticIcon

### Article Detail Page (`/news/:slug`)
- **Route**: `/news/:slug`
- **Purpose**: Full article reader
- **Sections**:
  1. **Header** - Back button, multi-line title
  2. **Hero Image** - Full-width with curtain reveal and parallax
  3. **Sidebar** - Author info, meta, share icons
  4. **Sticky Outline** - Section navigation with active tracking
  5. **Content Body** - Paragraphs, headings, lists, quotes, images
  6. **Other Articles** - Related article cards
  7. **Newsletter CTA** - Email signup with scatter letters
- **Key Animations**:
  - Title lines stagger entrance
  - Hero image curtain top-down reveal
  - Image parallax on scroll
  - Content blocks fade-up
  - Active outline tracking with IntersectionObserver
- **Data**: `articlesData.js` - accessed via `getArticleBySlug(slug)`
- **Components**: Navbar, MenuPanel, CustomCursor, FooterCTA, MagneticIcon

---

## Section 5 — Components Documentation

### LoadingScreen.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onComplete | function | undefined | Callback fired when loading animation completes |
| ref | React.Ref | undefined | Forwarded ref to container element |

**Renders**: Full-screen dark overlay with large percentage number (0-100%)
**Animations**: 
- Percentage counts from 0 to 100 over ~2.5 seconds
- GSAP slide-up exit (`y: -100%`) on completion
**Dependencies**: gsap

---

### Navbar.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onMenuClick | function | undefined | Callback when MENU button clicked |
| isContactPage | boolean | false | Forces light theme |

**Renders**: Fixed navbar with MENU pill, K logo, dots, CONTACT link
**Animations**: Theme switches to light when over services section
**Dependencies**: react-router-dom

---

### MenuPanel.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | false | Controls panel visibility |
| onClose | function | undefined | Callback to close panel |

**Renders**: Full-width slide-in panel with navigation links, expandable Services submenu, footer links
**Animations**: Framer Motion slide from left, submenu accordion expand
**Dependencies**: framer-motion, react-router-dom, PageTransition (getGlobalLenis)

---

### HeroBackground.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | undefined | Content to render on top of grid |

**Renders**: Dark background with animated vertical lines at 50px intervals
**Animations**: Lines have staggered animation delays

---

### HeroText.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isVisible | boolean | false | Triggers entrance animation |

**Renders**: Hero tagline H1
**Animations**: Framer Motion fade-up with eased timing
**Dependencies**: framer-motion

---

### LetterK.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained component |

**Renders**: 3D deconstructed "K" letter using Three.js with purple metallic material
**Animations**: Mouse-reactive rotation via useFrame, segments lerp to follow cursor
**Dependencies**: @react-three/fiber, three

---

### CustomCursor.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained global component |

**Renders**: Custom circular cursor with hover expansion, optional text label
**Animations**: Lerp-based position following, scale on hover, theme switching
**Dependencies**: None (vanilla JS event listeners)

---

### CookieBanner.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isVisible | boolean | false | Controls banner visibility |

**Renders**: Bottom banner with cookie text and PREFERENCES/REJECT/ACCEPT buttons
**Animations**: Framer Motion fade-up entrance, dismissed on user action
**Dependencies**: framer-motion

---

### AboutSection.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained section |

**Renders**: Two-column layout with portrait image and split-word paragraph
**Animations**: 
- Image curtain reveal (scaleY: 1→0)
- Word-by-word opacity (0.15→1) on scroll scrub
**Dependencies**: gsap, ScrollTrigger

---

### ServicesSection.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained section |

**Renders**: Headline, 3 service rows with title/body/image, logo marquee
**Animations**:
- Headline blur-scrub (blur: 12px→0, stagger)
- Row fade-up entrances
- Image slide-in from right
- Paragraph word opacity
**Dependencies**: gsap, ScrollTrigger, LogoMarquee

---

### PortfolioSection.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained section |

**Renders**: Section header, 6 project rows with hover-expandable image panels
**Animations**:
- Header/rows stagger entrance
- Divider line scaleX draw
- Hover panel height expansion
- Project name color/position shift
**Dependencies**: gsap, ScrollTrigger

---

### PartnershipSection.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained section |

**Renders**: The Kyurex Model section with statement, stats, horizontal scroll steps, testimonial, CTA
**Animations**:
- Statement lines stagger entrance
- Stats count-up with slam effect
- Horizontal pin-scroll for process steps (desktop)
- Typewriter title effect
- Testimonial scramble text reveal
- Magnetic CTA button
**Dependencies**: gsap, ScrollTrigger

---

### FooterCTA.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (none) | - | - | Self-contained fixed footer |

**Renders**: Fixed footer with social icons, nav links, two-panel split (Portfolio/Start a Project)
**Animations**:
- Panel slide entrances
- Start a Project text slam
- Social icons stagger
- Right panel color shift on hover
**Dependencies**: gsap, react-icons, MagneticIcon

---

### LogoMarquee.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logos | array | defaultLogos | Array of {name, url, logoUrl} |
| showLabel | boolean | true | Show "Trusted tools & partners" label |

**Renders**: Infinite horizontal scrolling logo strip
**Animations**: CSS infinite translate animation
**Dependencies**: None

---

### MagneticIcon.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Element to apply effect to |
| strength | number | 0.4 | Pull strength (0.2 subtle – 0.5 strong) |
| padding | number | 20 | Detection zone size in px |
| className | string | '' | Additional CSS class |
| onHoverStart | function | undefined | Callback when hover begins |
| onHoverEnd | function | undefined | Callback when hover ends |

**Renders**: Wrapper that adds magnetic pull effect to children
**Animations**: GSAP tween following mouse position, elastic snap-back
**Dependencies**: gsap

---

### PageTransition.jsx
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Page content to render |

**Renders**: Curtain overlay that covers/reveals during page navigation
**Animations**: 
- Curtain slides from right to cover
- KYUREX logo fades in
- Content swaps at peak coverage
- Curtain exits to left
**Dependencies**: gsap, react-router-dom (useLocation)

---

### ContactPage.jsx
Full page component - no props
**Sections**: Header, testimonial card, FAQ accordion, social icons, contact form
**Animations**: All entrance animations coordinated via GSAP timeline
**Dependencies**: gsap, ScrollTrigger, react-icons, MagneticIcon

---

### PortfolioPage.jsx
Full page component - no props
**Features**: Filter tags for project types, hover-expandable rows
**Dependencies**: gsap, ScrollTrigger, useSmoothScroll

---

### AboutPage.jsx
Full page component - no props
**Features**: Fan gallery with video modal, accordion, logo marquee
**Dependencies**: gsap, ScrollTrigger, useSmoothScroll, LogoMarquee

---

### ServiceDetailPage.jsx
Full page component - reads slug from URL params
**Features**: Dynamic content from servicesData, auto-open first accordion
**Dependencies**: gsap, ScrollTrigger, Lenis, servicesData

---

### NewsInsightsPage.jsx
Full page component - no props
**Features**: Multiple article display modes, category filtering
**Dependencies**: gsap, ScrollTrigger, Lenis, MagneticIcon

---

### ArticleDetailPage.jsx
Full page component - reads slug from URL params
**Features**: Sticky outline, active section tracking, rich content blocks
**Dependencies**: gsap, ScrollTrigger, Lenis, articlesData, MagneticIcon

---

## Section 6 — Data Layer

### articlesData.js

```typescript
interface OutlineItem {
  id: string              // Anchor ID for scroll-to
  label: string           // Display text in outline sidebar
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'subheading' | 'quote' | 'list' | 'image'
  text?: string           // For paragraph, heading, subheading
  id?: string             // For heading (anchor link)
  items?: string[]        // For list type
  author?: string         // For quote type
  src?: string            // For image type
  alt?: string            // For image type
  caption?: string        // For image type
}

interface Article {
  slug: string            // URL: /news/[slug]
  title: string           // ArticleDetailPage h1, NewsPage cards
  category: string        // Filter tags, pill badges (INSIGHTS, AI, NEWS, WEB DESIGN, RESOURCES)
  date: string            // Card meta row, article sidebar
  readTime: string        // Card meta, article sidebar
  author: string          // Article sidebar "By [name]"
  authorImage: string     // Circular photo in sidebar
  heroImage: string       // Full-width image on article page
  excerpt: string         // Archive section description
  outline: OutlineItem[]  // Sticky left column outline links
  content: ContentBlock[] // Article body
}
```

**Current Count**: 8 articles
**Consumed By**:
- `NewsInsightsPage.jsx` - horizontalArticles, deckArticles, otherArticles, archiveArticles
- `ArticleDetailPage.jsx` - getArticleBySlug(slug), getRelatedArticles(slug, 3)
- `AboutPage.jsx` - articles preview array

**Field Display Locations**:
| Field | Display Location |
|-------|------------------|
| slug | URL path parameter |
| title | Article page H1, card titles, archive rows |
| category | Pill badges on cards, archive filter matching |
| date | Card meta row, sidebar meta |
| readTime | Card meta row, sidebar meta, archive rows |
| author | Sidebar "By [name]" |
| authorImage | Circular photo in sidebar |
| heroImage | Full-width hero section on article page |
| excerpt | Archive row description |
| outline | Sticky sidebar navigation |
| content | Main article body renderer |

---

### servicesData.js

```typescript
interface ApproachItem {
  num: string             // Display number (01, 02, etc.)
  question: string        // Accordion title
  answer: string          // Accordion expanded content
}

interface ServiceCard {
  title: string           // Card heading (empty string for spacer)
  description: string     // Card body text
}

interface Service {
  slug: string            // URL: /services/[slug]
  name: string            // Hero heading, page title
  heroDescription: string // Hero section body text
  statementText: string   // Statement section paragraph
  statementImage: string  // Statement section image URL
  visionTitle: string     // Vision section H2
  visionQuote: string     // Vision quote paragraph
  visionPara1: string     // Vision first paragraph
  visionPara2: string     // Vision second paragraph
  visionImage: string     // Vision section image URL
  approachItems: ApproachItem[]  // Accordion items (4 per service)
  serviceCards: ServiceCard[]    // Grid cards (6 per service, first empty)
  heroImage: string       // Hero background image
}
```

**Current Count**: 3 services (web-development, ai-automation, full-stack)
**Consumed By**: `ServiceDetailPage.jsx` - accessed via `servicesData[slug]`

**Field Display Locations**:
| Field | Display Location |
|-------|------------------|
| name | Hero H1 with character animation |
| heroDescription | Hero body paragraph |
| statementText | Word-opacity animated paragraph |
| statementImage | Two-tone curtain reveal image |
| visionTitle | Blur/scale animated heading |
| visionQuote | Word-opacity paragraph |
| visionPara1, visionPara2 | Clip-path wipe-up paragraphs |
| visionImage | Rotation parallax image |
| approachItems | 4-item accordion with scramble numbers |
| serviceCards | 2-column service grid |

---

## Section 7 — Animation System

### GSAP ScrollTrigger Patterns

| Pattern | Usage | Example Components |
|---------|-------|-------------------|
| **Curtain Reveal** | scaleY: 1→0 or x: 0→-100% to reveal images | AboutSection, ServiceDetailPage, ArticleDetailPage |
| **Word Opacity** | Each word animated from opacity 0.15→1 on scroll scrub | AboutSection, ServicesSection, PartnershipSection |
| **Blur Scrub** | filter: blur(12px)→0 with stagger | ServicesSection headline |
| **Horizontal Pin-Scroll** | Section pinned while content scrolls horizontally | PartnershipSection steps, NewsInsightsPage cards |
| **Clip-Path Wipe** | clipPath: inset(0 0 100% 0)→inset(0 0 0% 0) | ServiceDetailPage vision paragraphs |
| **Stagger Entrance** | Multiple elements fade/slide with delay | All page sections, accordion items |
| **Parallax** | Background moves at different scroll speed | AboutPage hero, ServiceDetailPage vision image |
| **Rotation Parallax** | Image rotates slightly based on scroll position | ServiceDetailPage vision image |

### Lenis Smooth Scroll Configuration

```javascript
{
  duration: 1.0,                    // Scroll animation duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // Expo easing
  smoothWheel: true,                // Enable smooth wheel
  wheelMultiplier: 0.8,             // Reduce wheel sensitivity
  touchMultiplier: 1.5,             // Increase touch sensitivity
  syncTouch: true,                  // Sync touch with scroll
  syncTouchLerp: 0.075,             // Touch lerp factor
}
```

### Page Transition System

1. **Trigger**: Route change detected via `useLocation()`
2. **Phase 1 - Cover**: Curtain slides from right to left (`x: 100%→0%`)
3. **Logo Reveal**: KYUREX text fades in and scales during coverage
4. **Content Swap**: Children components replace at peak coverage
5. **Phase 2 - Uncover**: Curtain exits to left (`x: 0%→-100%`)
6. **Scroll Management**: Lenis paused during transition, resumed after

### Reusable Animation Components

| Component | Purpose |
|-----------|---------|
| `MagneticIcon` | Wraps any element with magnetic cursor-following effect |
| `PageTransition` | Handles all route-change curtain animations |
| `TypewriterTitle` | Character-by-character reveal with blinking cursor |

### Animation Triggers

| Type | Description | Examples |
|------|-------------|----------|
| **On Mount** | Plays immediately when component mounts | LoadingScreen percentage, Hero letter assembly |
| **Scroll-Triggered** | Fires when element enters viewport | Section entrances, curtain reveals |
| **Scrub** | Animation progress tied to scroll position | Word opacity, horizontal scroll |
| **Interaction** | User action triggers animation | Hover panels, accordion expand, magnetic icons |
| **Pin** | Element fixed while scroll continues | Horizontal scroll sections, fan gallery |

---

## Section 8 — Routing

| Path | Component | Transition | Description |
|------|-----------|------------|-------------|
| `/` | App | none (entry) | Home page with loading screen |
| `/about` | AboutPage | curtain R→L | Agency story and team |
| `/contact` | ContactPage | curtain R→L | Contact form and FAQ |
| `/portfolio` | PortfolioPage | curtain R→L | Full case study showcase |
| `/news` | NewsInsightsPage | curtain R→L | Article hub |
| `/news/:slug` | ArticleDetailPage | curtain R→L | Full article reader |
| `/services/web-development` | ServiceDetailPage | curtain R→L | Web Development service |
| `/services/ai-automation` | ServiceDetailPage | curtain R→L | AI Automation service |
| `/services/full-stack` | ServiceDetailPage | curtain R→L | Full Stack Products service |

---

## Section 9 — Admin Panel Requirements (Future)

### ARTICLES & NEWS
- ✦ Create new article (all fields from Article interface)
- ✦ Edit existing article content (paragraphs, headings, lists, quotes, images)
- ✦ Delete article
- ✦ Reorder articles (affects News page display order)
- ✦ Toggle article published/draft status
- ✦ Upload hero image and content images
- ✦ Set article SEO (meta title, meta description, og:image)
- ✦ Manage outline sections (add/remove/reorder)
- ✦ Preview article before publishing

### PORTFOLIO PROJECTS
- ✦ Add new case study
- ✦ Edit project name, description, tags, industry, location
- ✦ Upload project screenshots (3 per project)
- ✦ Set project accent color (hex picker)
- ✦ Toggle project visibility
- ✦ Reorder projects
- ✦ Assign project to filter categories

### SERVICES
- ✦ Edit service page content (name, heroDescription, statementText)
- ✦ Edit vision section (visionTitle, visionQuote, visionPara1, visionPara2)
- ✦ Upload service images (statement, vision, hero)
- ✦ Edit approach accordion items (question, answer)
- ✦ Edit service cards grid (title, description)
- ✦ Reorder accordion items and service cards

### TESTIMONIALS
- ✦ Add/edit/delete testimonials
- ✦ Fields: quote, author name, company, author photo
- ✦ Assign testimonials to pages (Contact, Portfolio, Services)

### TEAM MEMBERS (Future)
- ✦ Add/edit/delete team member profiles
- ✦ Fields: name, role, bio, photo, social links
- ✦ Toggle visibility

### FAQ MANAGEMENT
- ✦ Add/edit/delete FAQ items
- ✦ Reorder FAQ items
- ✦ Fields: question, answer

### LOGO MARQUEE
- ✦ Add/edit/delete partner logos
- ✦ Fields: company name, website URL, logo URL
- ✦ Reorder logos

### GLOBAL SETTINGS
- ✦ Agency name, tagline, contact email
- ✦ Social media links (Instagram, LinkedIn, X, YouTube)
- ✦ Footer content (cookie preference text, badge text)
- ✦ SEO defaults (site title, description, og:image)
- ✦ Cookie banner text
- ✦ Newsletter CTA text
- ✦ Default response time text ("We typically respond within 24 hours")

### MEDIA LIBRARY
- ✦ Upload images with automatic optimization
- ✦ Browse/search uploaded images
- ✦ Delete unused images
- ✦ Generate multiple sizes (thumbnail, medium, large)
- ✦ Copy CDN URL for use in content

---

## Section 10 — MongoDB Schema Plan (Future)

### Collections Overview
```
├── articles        — blog posts and news content
├── projects        — portfolio case studies
├── services        — service page content
├── testimonials    — client quotes
├── team            — team member profiles (future)
├── faqs            — FAQ items for contact page
├── logos           — logo marquee partner logos
├── settings        — global site configuration
└── media           — uploaded image metadata
```

### Detailed Schemas

#### articles
```javascript
const ArticleSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['INSIGHTS', 'AI', 'NEWS', 'WEB DESIGN', 'RESOURCES'] },
  date: { type: Date, required: true, default: Date.now },
  readTime: { type: String, required: true },
  author: { type: String, required: true },
  authorImage: { type: String, required: true },
  heroImage: { type: String, required: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  outline: [{
    id: { type: String, required: true },
    label: { type: String, required: true }
  }],
  content: [{
    type: { type: String, required: true, enum: ['paragraph', 'heading', 'subheading', 'quote', 'list', 'image'] },
    text: String,
    id: String,
    items: [String],
    author: String,
    src: String,
    alt: String,
    caption: String
  }],
  status: { type: String, default: 'draft', enum: ['draft', 'published'] },
  order: { type: Number, default: 0 },
  seo: {
    metaTitle: String,
    metaDescription: String,
    ogImage: String
  }
}, { timestamps: true });
```

#### projects
```javascript
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  industry: { type: String, required: true },
  location: { type: String, required: true },
  accent: { type: String, required: true }, // Hex color
  images: [{ type: String, required: true }], // Array of 3 image URLs
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });
```

#### services
```javascript
const ServiceSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  heroDescription: { type: String, required: true },
  heroImage: { type: String, required: true },
  statementText: { type: String, required: true },
  statementImage: { type: String, required: true },
  visionTitle: { type: String, required: true },
  visionQuote: { type: String, required: true },
  visionPara1: { type: String, required: true },
  visionPara2: { type: String, required: true },
  visionImage: { type: String, required: true },
  approachItems: [{
    num: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  serviceCards: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }]
}, { timestamps: true });
```

#### testimonials
```javascript
const TestimonialSchema = new Schema({
  quote: { type: String, required: true },
  authorName: { type: String, required: true },
  authorCompany: { type: String, required: true },
  authorImage: { type: String, required: true },
  pages: [{ type: String, enum: ['contact', 'portfolio', 'services', 'about', 'home'] }],
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });
```

#### team
```javascript
const TeamSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  photo: { type: String, required: true },
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String
  },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });
```

#### faqs
```javascript
const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });
```

#### logos
```javascript
const LogoSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  logoUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });
```

#### settings
```javascript
const SettingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

// Example settings documents:
// { key: 'agencyName', value: 'Kyurex' }
// { key: 'contactEmail', value: 'hello@kyurex.com' }
// { key: 'socialLinks', value: { instagram: '...', linkedin: '...', twitter: '...', youtube: '...' } }
// { key: 'seoDefaults', value: { title: '...', description: '...', ogImage: '...' } }
// { key: 'cookieBannerText', value: 'This website use Cookies.' }
// { key: 'footerBadgeText', value: 'AI & Web Agency' }
// { key: 'responseTimeText', value: 'We typically respond within 24 hours.' }
```

#### media
```javascript
const MediaSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  thumbnailUrl: String,
  mediumUrl: String,
  largeUrl: String,
  width: Number,
  height: Number,
  cloudinaryId: String
}, { timestamps: true });
```

---

## Section 11 — Environment Variables Needed

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kyurex

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Image Hosting (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Defaults
ADMIN_EMAIL=admin@kyurex.com
ADMIN_PASSWORD_HASH=bcrypt-hashed-password

# API Configuration
VITE_API_URL=http://localhost:5000/api
API_PORT=5000

# Optional: Email Service (for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
CONTACT_EMAIL=hello@kyurex.com

# Optional: Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Section 12 — Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Running the Frontend (Current)

```bash
# 1. Clone the repository
git clone <repository-url>
cd loading-screen

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to /dist |
| `npm run preview` | Preview production build locally |

---

## Additional Notes

### Browser Support
- Modern browsers with ES6+ support
- Custom cursor hidden on touch devices
- Smooth scroll falls back gracefully

### Performance Considerations
- Images loaded lazily where possible
- GSAP animations use GPU-accelerated transforms
- Lenis provides 60fps smooth scrolling
- Code splitting via React Router

### Fonts
- **Inter** (weight 300) - loaded via Google Fonts
- System font fallback stack for resilience

### Custom Cursor Behavior
- `data-cursor-hover` attribute triggers hover state expansion
- `data-cursor-text` attribute shows custom text label
- Dark theme on light sections (services, partnership, contact)

### Footer Reveal Pattern
- Footer is fixed at z-index 1
- Main content has z-index 2 with transparent background
- 100vh spacer at content end allows scroll past to reveal footer

---

*This README serves as the complete specification for the Kyurex agency website and provides the foundation for building the MongoDB backend and admin panel system.*
