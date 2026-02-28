# KYUREX ADMIN PANEL - COMPLETE CODEBASE SUMMARY

> **Generated:** January 2025  
> **Status:** Development / Testing Phase  
> **Backend:** Express + MongoDB  
> **Frontend:** React (Vite)

---

## Table of Contents

1. [Admin Panel Overview](#1-admin-panel-overview)
2. [Backend API Status](#2-backend-api-status)
3. [Database Models Status](#3-database-models-status)
4. [Admin Pages Status](#4-admin-pages-status)
5. [Known Bugs List](#5-known-bugs-list)
6. [Data Flow Gaps](#6-data-flow-gaps)
7. [Missing Features](#7-missing-features)
8. [Auth & Security Gaps](#8-auth--security-gaps)
9. [Component Connection Map](#9-component-connection-map)
10. [Upgrade Priority List](#10-upgrade-priority-list)
11. [File-by-File Issues](#11-file-by-file-issues)
12. [Recommended Architecture Changes](#12-recommended-architecture-changes)

---

## 1. Admin Panel Overview

### Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Backend Runtime** | Node.js | - | Server runtime |
| **Backend Framework** | Express | 4.18.2 | REST API server |
| **Database** | MongoDB | Local | Data persistence |
| **ODM** | Mongoose | 8.0.3 | MongoDB object modeling |
| **Authentication** | JWT | 9.0.2 | Token-based auth |
| **Password Hashing** | bcryptjs | 2.4.3 | Secure password storage |
| **File Upload** | Multer | 1.4.5-lts.1 | Image upload handling |
| **Frontend Framework** | React | 18.2.0 | Admin UI |
| **Build Tool** | Vite | 5.0.8 | Dev server & bundling |
| **Routing** | react-router-dom | 7.13.0 | Client-side routing |
| **Drag & Drop** | @dnd-kit | 6.1.0 | Reorderable lists |
| **Notifications** | react-hot-toast | 2.4.1 | Toast messages |
| **Icons** | react-icons | 5.5.0 | Icon library |

### Configuration

| Setting | Value | Location |
|---------|-------|----------|
| Backend Port | 5000 | `server/index.js` |
| Frontend Port | 5173 | Vite default |
| MongoDB URI | `mongodb://localhost:27017/kyurex` | `server/.env` |
| JWT Expiry | 7 days | `server/middleware/auth.js` |
| JWT Secret | `kyurex-admin-secret-key-2024...` | `server/.env` |
| Upload Limit | 10MB | `server/middleware/upload.js` |
| Allowed Types | JPEG, PNG, WebP, GIF | `server/middleware/upload.js` |

### Admin Credentials (Default)

- **Email:** `princethummar199@gmail.com`
- **Password:** `Prince2212@`

### NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start frontend dev server |
| `npm run dev:server` | `cd server && npm run dev` | Start backend with nodemon |
| `npm run dev:all` | `concurrently ...` | Run both frontend and backend |
| `npm run seed` | `cd server && npm run seed` | Seed database with sample data |
| `npm run build` | `vite build` | Production build |

---

## 2. Backend API Status

### Routes Overview

| Route File | Base Path | Endpoints | Auth Required | Status |
|------------|-----------|-----------|---------------|--------|
| `auth.js` | `/api/auth` | 4 | Partial | ✅ Working |
| `articles.js` | `/api/articles` | 7 | Partial | ✅ Working |
| `projects.js` | `/api/projects` | 7 | Partial | ✅ Working |
| `services.js` | `/api/services` | 5 | Partial | ✅ Working |
| `testimonials.js` | `/api/testimonials` | 5 | Partial | ✅ Working |
| `faqs.js` | `/api/faqs` | 5 | Partial | ✅ Working |
| `logos.js` | `/api/logos` | 5 | Partial | ✅ Working |
| `media.js` | `/api/media` | 5 | Partial | ✅ Working |
| `settings.js` | `/api/settings` | 5 | Partial | ✅ Working |

### Endpoint Details

#### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| POST | `/login` | ❌ | Admin login | ✅ Working |
| GET | `/me` | ✅ | Get current user | ✅ Working |
| POST | `/change-password` | ✅ | Change password | ✅ Working |
| POST | `/logout` | ✅ | Logout (stub) | ⚠️ No server-side invalidation |

#### Articles (`/api/articles`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get published articles | ✅ Working |
| GET | `/all` | ✅ | Get all articles (admin) | ✅ Working |
| GET | `/:identifier` | ❌ | Get by slug OR ObjectId | ✅ Working |
| POST | `/` | ✅ | Create article | ✅ Working |
| PUT | `/:id` | ✅ | Update article | ✅ Working |
| DELETE | `/:id` | ✅ | Delete article | ✅ Working |
| PUT | `/reorder` | ✅ | Reorder articles | ✅ Working |

#### Projects (`/api/projects`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get visible projects | ✅ Working |
| GET | `/all` | ✅ | Get all projects (admin) | ✅ Working |
| GET | `/:id` | ❌ | Get single project | ✅ Working |
| POST | `/` | ✅ | Create project | ✅ Working |
| PUT | `/:id` | ✅ | Update project | ✅ Working |
| DELETE | `/:id` | ✅ | Delete project | ✅ Working |
| PUT | `/:id/visibility` | ✅ | Toggle visibility | ✅ Working |
| PUT | `/reorder` | ✅ | Reorder projects | ✅ Working |

#### Services (`/api/services`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get all services | ✅ Working |
| GET | `/:slug` | ❌ | Get service by slug | ✅ Working |
| PUT | `/:slug` | ✅ | Update service | ✅ Working |
| PUT | `/:slug/approach` | ✅ | Update approach items | ⚠️ Unused |
| PUT | `/:slug/cards` | ✅ | Update service cards | ⚠️ Unused |

> **Note:** Services use fixed slugs: `web-development`, `ai-automation`, `full-stack`. Services cannot be created or deleted via API.

#### Testimonials (`/api/testimonials`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get visible testimonials | ✅ Working |
| GET | `/all` | ✅ | Get all testimonials (admin) | ⚠️ Route exists but admin uses `/` |
| GET | `/:id` | ❌ | Get single testimonial | ✅ Working |
| POST | `/` | ✅ | Create testimonial | ✅ Working |
| PUT | `/:id` | ✅ | Update testimonial | ✅ Working |
| DELETE | `/:id` | ✅ | Delete testimonial | ✅ Working |
| PUT | `/reorder` | ✅ | Reorder testimonials | ✅ Working |

#### FAQs (`/api/faqs`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get all FAQs | ✅ Working |
| GET | `/:id` | ❌ | Get single FAQ | ✅ Working |
| POST | `/` | ✅ | Create FAQ | ✅ Working |
| PUT | `/:id` | ✅ | Update FAQ | ✅ Working |
| DELETE | `/:id` | ✅ | Delete FAQ | ✅ Working |
| PUT | `/reorder` | ✅ | Reorder FAQs | ✅ Working |

#### Logos (`/api/logos`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get all logos | ✅ Working |
| GET | `/:id` | ❌ | Get single logo | ✅ Working |
| POST | `/` | ✅ | Create logo | ✅ Working |
| PUT | `/:id` | ✅ | Update logo | ✅ Working |
| DELETE | `/:id` | ✅ | Delete logo | ✅ Working |
| PUT | `/reorder` | ✅ | Reorder logos | ✅ Working |

#### Media (`/api/media`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get all media (paginated) | ✅ Working |
| GET | `/:id` | ❌ | Get single media item | ✅ Working |
| POST | `/upload` | ✅ | Upload single file | ✅ Working |
| POST | `/upload-multiple` | ✅ | Upload multiple files | ✅ Working |
| DELETE | `/:id` | ✅ | Delete media | ✅ Working |

#### Settings (`/api/settings`)

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| GET | `/` | ❌ | Get all settings | ✅ Working |
| GET | `/:key` | ❌ | Get single setting | ✅ Working |
| PUT | `/:key` | ✅ | Update single setting | ✅ Working |
| PUT | `/` | ✅ | Bulk update settings | ✅ Working |
| DELETE | `/:key` | ✅ | Delete setting | ✅ Working |

---

## 3. Database Models Status

### Models Overview

| Model | File | Fields | Indexes | Status |
|-------|------|--------|---------|--------|
| Article | `models/Article.js` | 10 | slug (unique) | ✅ Complete |
| Project | `models/Project.js` | 9 | - | ✅ Complete |
| Service | `models/Service.js` | 8 | slug (unique) | ✅ Complete |
| Testimonial | `models/Testimonial.js` | 7 | - | ✅ Complete |
| FAQ | `models/FAQ.js` | 4 | - | ✅ Complete |
| Logo | `models/Logo.js` | 5 | - | ✅ Complete |
| Media | `models/Media.js` | 9 | - | ✅ Complete |
| Settings | `models/Settings.js` | 4 | key (unique) | ✅ Complete |

### Model Schemas

#### Article Schema

```javascript
{
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Innovation' },
  heroImage: { type: String },
  content: [{ type, text, level, src, alt, caption, items, author, language, code }],
  outline: [{ id, label }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  order: { type: Number, default: 0 },
  seo: { metaTitle, metaDescription },
  timestamps: true
}
```

#### Project Schema

```javascript
{
  name: { type: String, required: true },
  description: { type: String },
  tags: [String],
  industry: { type: String },
  location: { type: String },
  accent: { type: String, default: '#6d28d9' },
  images: [String],
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  timestamps: true
}
```

#### Service Schema

```javascript
{
  slug: { type: String, required: true, unique: true, enum: ['web-development', 'ai-automation', 'full-stack'] },
  name: { type: String, required: true },
  heroDescription: { type: String },
  statementText: { type: String },
  visionTitle: { type: String },
  visionDescription: { type: String },
  approachItems: [{ number, title, description }],
  serviceCards: [{ title, description, details: [String] }],
  timestamps: true
}
```

#### Testimonial Schema

```javascript
{
  quote: { type: String, required: true },
  authorName: { type: String, required: true },
  authorCompany: { type: String },
  authorImage: { type: String },
  pages: [{ type: String, enum: ['home', 'about', 'services', 'portfolio'] }],
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  timestamps: true
}
```

#### FAQ Schema

```javascript
{
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  timestamps: true
}
```

#### Logo Schema

```javascript
{
  name: { type: String, required: true },
  url: { type: String },
  logoUrl: { type: String },
  order: { type: Number, default: 0 },
  timestamps: true
}
```

#### Media Schema

```javascript
{
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  cloudinaryId: { type: String },
  cloudinaryUrl: { type: String },
  timestamps: true
}
```

#### Settings Schema

```javascript
{
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['string', 'number', 'boolean', 'json'], default: 'string' },
  timestamps: true
}

// Static Methods:
// Settings.getSetting(key) - Get single setting value
// Settings.setSetting(key, value, type) - Set single setting
// Settings.getAllSettings() - Get all as key-value object
```

---

## 4. Admin Pages Status

### Page Overview

| Page | File | Route | API Calls | Features | Status |
|------|------|-------|-----------|----------|--------|
| Login | `AdminLogin.jsx` | `/admin` | POST `/auth/login` | Email/password login | ✅ Working |
| Dashboard | `Dashboard.jsx` | `/admin/dashboard` | 6 parallel calls | Stats, recent articles | ✅ Working |
| Articles Manager | `ArticlesManager.jsx` | `/admin/articles` | GET `/articles/all` | List, filter, reorder, CRUD | ✅ Working |
| Article Editor | `ArticleEditor.jsx` | `/admin/articles/:id` | GET/POST/PUT | Block editor, SEO | ✅ Working |
| Projects Manager | `ProjectsManager.jsx` | `/admin/projects` | GET `/projects/all` | List, reorder, visibility | ✅ Working |
| Project Editor | `ProjectEditor.jsx` | `/admin/projects/:id` | GET/POST/PUT | Tags, images, colors | ✅ Working |
| Services Manager | `ServicesManager.jsx` | `/admin/services` | GET `/services` | List (read-only) | ✅ Working |
| Service Editor | `ServiceEditor.jsx` | `/admin/services/:slug` | GET/PUT | Tabs, approach, cards | ✅ Working |
| Testimonials | `TestimonialsManager.jsx` | `/admin/testimonials` | Full CRUD | Modal editor, pages filter | ✅ Working |
| FAQ Manager | `FAQManager.jsx` | `/admin/faq` | Full CRUD | Modal editor, expandable | ✅ Working |
| Logos Manager | `LogosManager.jsx` | `/admin/logos` | Full CRUD | Grid view, reorder | ✅ Working |
| Media Library | `MediaLibrary.jsx` | `/admin/media` | GET/POST/DELETE | Upload, preview, copy URL | ✅ Working |
| Settings | `SettingsManager.jsx` | `/admin/settings` | GET/PUT `/settings` | Tabs, password change | ✅ Working |

### Component Dependencies

```
AdminApp.jsx
├── AuthProvider (Context)
│   ├── token (localStorage)
│   ├── email (localStorage)
│   ├── loading state
│   ├── apiCall() helper
│   └── logout() method
├── AdminLogin.jsx (unauthenticated)
└── AdminLayout.jsx (authenticated)
    ├── Sidebar navigation
    ├── User info display
    └── Page children
        ├── Dashboard.jsx
        ├── ArticlesManager.jsx
        ├── ArticleEditor.jsx
        ├── ProjectsManager.jsx
        ├── ProjectEditor.jsx
        ├── ServicesManager.jsx
        ├── ServiceEditor.jsx
        ├── TestimonialsManager.jsx
        ├── FAQManager.jsx
        ├── LogosManager.jsx
        ├── MediaLibrary.jsx
        └── SettingsManager.jsx
```

---

## 5. Known Bugs List

### ✅ Fixed Bugs (This Session)

| # | Bug | Location | Fix Applied |
|---|-----|----------|-------------|
| 1 | Double `/api/api/` in URLs | `AdminApp.jsx` | Changed API_URL to not include `/api` suffix |
| 2 | `data.forEach is not a function` | All admin pages | Extract `.data` from API responses |
| 3 | Cursor not showing on admin | `AdminStyles.css` | Added `cursor: auto !important` reset rules |
| 4 | `/auth/me` returns 404 | `AdminApp.jsx` | Added `/api` prefix to endpoint |
| 5 | Double JSON.stringify | `AdminApp.jsx` | Check if body is already string |
| 6 | Article 404 when fetching by ID | `routes/articles.js` | Accept both slug and ObjectId (24 hex chars) |
| 7 | `isNew` check fails for undefined | `ArticleEditor.jsx`, `ProjectEditor.jsx` | Check `!id \|\| id === 'new'` |

### ⚠️ Remaining Bugs / Issues

| # | Bug | Severity | Location | Description |
|---|-----|----------|----------|-------------|
| 1 | Logout doesn't invalidate token | Low | `routes/auth.js` | JWT not invalidated server-side |
| 2 | No image upload in editors | Medium | `ArticleEditor.jsx`, `ProjectEditor.jsx` | Only accepts URL strings, no file upload integration |
| 3 | Testimonials `/all` route unused | Low | `TestimonialsManager.jsx` | Fetches `/testimonials` instead of `/testimonials/all` |
| 4 | Static data fallback broken | Medium | `src/utils/api.js` | Imports commented out, will fail if API unavailable |
| 5 | Service cards empty slot | Low | `servicesData.js` | First serviceCard has empty title/description |
| 6 | No validation errors display | Medium | All editors | Form validation errors shown as toast only |
| 7 | Media upload hardcoded URL | Medium | `MediaLibrary.jsx` | Uses `http://localhost:5000` instead of env var |
| 8 | No image dimension tracking | Low | `models/Media.js` | Width/height not stored |
| 9 | Cloudinary not configured | Info | `server/.env` | Cloudinary credentials present but unused |
| 10 | No rate limiting | Medium | `server/index.js` | No protection against brute force |

---

## 6. Data Flow Gaps

### Frontend → Backend Flow Issues

| Component | Issue | Impact | Recommendation |
|-----------|-------|--------|----------------|
| ArticleEditor | No media library picker | Manual URL entry only | Add media selection modal |
| ProjectEditor | Images array manual URL | No upload capability | Integrate with media library |
| LogosManager | Logo URL manual entry | Inconsistent uploads | Add media picker |
| All Editors | No autosave | Data loss risk | Add debounced autosave |
| MediaLibrary | No folder organization | Flat file list | Add categories/folders |

### Backend → Frontend Flow Issues

| Endpoint | Issue | Impact | Recommendation |
|----------|-------|--------|----------------|
| GET `/testimonials` | Returns all testimonials | Admin sees same as public | Use `/testimonials/all` for admin |
| GET `/media` | No sort order | Random display | Add createdAt desc sort |
| GET `/articles/:id` | Dual ID/slug lookup | Confusion potential | Document clearly in API |
| Settings bulk update | No validation | Invalid settings possible | Add schema validation |

### Missing Data Connections

| Source | Target | Missing Link |
|--------|--------|--------------|
| Media Library | ArticleEditor content blocks | No media picker for images |
| Media Library | ProjectEditor images | No integration |
| Media Library | LogosManager | No integration |
| Settings | Frontend display | Site name not used anywhere |
| Services | ServiceDetailPage | Content comes from static data, not API |

---

## 7. Missing Features

### Critical (Blocking Production)

| Feature | Description | Affected Components |
|---------|-------------|---------------------|
| Production Build Config | No production env vars or build setup | `server/index.js` |
| File Cleanup on Delete | Uploaded files not deleted from disk | `routes/media.js` |
| Input Sanitization | XSS vulnerability in content blocks | All models |
| Email Change | Cannot change admin email | `SettingsManager.jsx` |
| Password Recovery | No forgot password flow | `AdminLogin.jsx` |

### High Priority (User Experience)

| Feature | Description | Affected Components |
|---------|-------------|---------------------|
| Media Picker Modal | Select images from library in editors | ArticleEditor, ProjectEditor |
| Drag & Drop Upload | Drop files to upload | MediaLibrary |
| Image Cropping | Crop/resize before upload | MediaLibrary |
| Preview Mode | Preview article/project before publish | ArticleEditor, ProjectEditor |
| Undo/Redo | Content editing history | ArticleEditor |
| Keyboard Shortcuts | Save, publish, navigate | All editors |
| Search | Search articles, projects, media | All managers |

### Medium Priority (Nice to Have)

| Feature | Description | Affected Components |
|---------|-------------|---------------------|
| Activity Log | Track admin actions | New component |
| Multiple Admins | User management | New routes, pages |
| User Roles | Editor, Admin, Super Admin | Auth system |
| Dark/Light Theme | Theme toggle | AdminStyles.css |
| Dashboard Charts | Visual analytics | Dashboard.jsx |
| Scheduled Publishing | Publish at future date | ArticleEditor |
| Version History | Content versioning | All editors |
| Bulk Operations | Delete multiple, change status | All managers |
| Export/Import | Backup data | Settings |

### Low Priority (Future Enhancement)

| Feature | Description | Affected Components |
|---------|-------------|---------------------|
| Rich Text Editor | WYSIWYG for paragraphs | ArticleEditor |
| Markdown Support | Parse markdown in content | ArticleEditor |
| SEO Analysis | Real-time SEO scoring | ArticleEditor |
| Analytics Integration | GA/Plausible dashboard | Dashboard |
| Webhooks | Notify on content changes | New route |
| API Rate Limiting | Protect against abuse | Middleware |
| CDN Integration | Serve images via CDN | Media routes |
| Image Optimization | WebP conversion, resizing | Upload middleware |

---

## 8. Auth & Security Gaps

### Authentication Issues

| Issue | Risk Level | Description | Recommendation |
|-------|------------|-------------|----------------|
| No Token Blacklist | Low | Logout doesn't invalidate JWT | Implement token blacklist in Redis |
| No Refresh Tokens | Low | Single token until expiry | Add refresh token flow |
| No Session Management | Low | Can't see active sessions | Track sessions in DB |
| Hardcoded JWT Secret | High | Secret in `.env` file | Use proper secrets manager |
| No 2FA | Medium | Single factor auth | Add TOTP/email 2FA |

### Authorization Issues

| Issue | Risk Level | Description | Recommendation |
|-------|------------|-------------|----------------|
| Single User | Medium | Only one admin account | Add multi-user support |
| No Role System | Low | All admins have full access | Implement RBAC |
| No Audit Trail | Medium | No action logging | Add activity logging |

### Input Security Issues

| Issue | Risk Level | Description | Recommendation |
|-------|------------|-------------|----------------|
| No XSS Sanitization | High | Raw HTML in content blocks | Sanitize with DOMPurify |
| No SQL Injection | N/A | MongoDB not vulnerable | - |
| File Type Spoofing | Medium | Extension check only | Validate magic bytes |
| No File Scanning | Medium | Malware possible | Add virus scanning |
| No Rate Limiting | High | Brute force possible | Add rate limiter middleware |
| No CSRF Protection | Medium | Cross-site requests | Add CSRF tokens |

### Dependency Vulnerabilities

Run `npm audit` in both `/` and `/server` directories for current vulnerabilities.

---

## 9. Component Connection Map

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PUBLIC FRONTEND                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│  │ SiteDataContext │───>│    api.js       │───>│  Components     │     │
│  │  (Global State) │    │ (API Wrapper)   │    │ (Display Data)  │     │
│  └────────┬────────┘    └────────┬────────┘    └─────────────────┘     │
│           │                      │                                      │
│           v                      v                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Static Data Fallback                        │   │
│  │            articlesData.js    servicesData.js                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                │ HTTP API Calls
                                v
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND API                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Express Server (Port 5000)                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │   auth     │  │  articles  │  │  projects  │  │  services  │  │  │
│  │  │   routes   │  │   routes   │  │   routes   │  │   routes   │  │  │
│  │  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  │  │
│  │         │               │               │               │         │  │
│  │  ┌──────────────────────────────────────────────────────────┐    │  │
│  │  │                    Middleware                             │    │  │
│  │  │     auth.js (JWT verify)    upload.js (Multer)           │    │  │
│  │  └──────────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                        │
│                                v                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        MongoDB                                    │  │
│  │   Article  Project  Service  Testimonial  FAQ  Logo  Media  Set  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                ^
                                │ HTTP API Calls (with JWT)
                                │
┌───────────────────────────────┴─────────────────────────────────────────┐
│                         ADMIN FRONTEND                                  │
│  ┌─────────────────┐                                                    │
│  │   AdminApp.jsx  │                                                    │
│  │  ┌───────────┐  │                                                    │
│  │  │AuthContext│  │ ─── apiCall() helper ────────────────────────────>│
│  │  │  token    │  │                                                    │
│  │  │  email    │  │                                                    │
│  │  └───────────┘  │                                                    │
│  └────────┬────────┘                                                    │
│           │                                                             │
│  ┌────────v────────┐    ┌─────────────────────────────────────────┐    │
│  │  AdminLayout    │───>│           Admin Pages                   │    │
│  │  (Sidebar Nav)  │    │  Dashboard, ArticlesManager, Editor...  │    │
│  └─────────────────┘    └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### File Dependency Map

```
src/admin/
├── AdminApp.jsx
│   ├── imports: react, react-router-dom, react-hot-toast, AdminStyles.css
│   ├── exports: useAuth (context hook)
│   └── provides: AuthProvider, apiCall, login/logout
│
├── AdminLogin.jsx
│   ├── imports: react, react-router-dom, react-hot-toast, AdminStyles.css
│   └── standalone: No context dependencies
│
├── AdminLayout.jsx
│   ├── imports: react-router-dom, react-icons/fi, AdminApp (useAuth)
│   └── provides: Sidebar navigation shell
│
└── pages/
    ├── Dashboard.jsx
    │   └── imports: useAuth, react-router-dom, react-icons
    │
    ├── ArticlesManager.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │
    ├── ArticleEditor.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │       MISSING: Media library integration
    │
    ├── ProjectsManager.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │
    ├── ProjectEditor.jsx
    │   └── imports: useAuth, react-hot-toast
    │       MISSING: Media library integration
    │
    ├── ServicesManager.jsx
    │   └── imports: useAuth, react-icons
    │
    ├── ServiceEditor.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │
    ├── TestimonialsManager.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │
    ├── FAQManager.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │
    ├── LogosManager.jsx
    │   └── imports: useAuth, @dnd-kit/*, react-hot-toast
    │       MISSING: Media library integration
    │
    ├── MediaLibrary.jsx
    │   └── imports: useAuth, react-hot-toast
    │       BUG: Hardcoded localhost URL
    │
    └── SettingsManager.jsx
        └── imports: useAuth, react-hot-toast
```

---

## 10. Upgrade Priority List

### Phase 1: Security Critical (Week 1)

| Task | Effort | Risk |
|------|--------|------|
| Add rate limiting middleware | 2 hours | Prevents brute force |
| Sanitize HTML content inputs | 4 hours | Prevents XSS |
| Validate file magic bytes | 2 hours | Prevents file spoofing |
| Remove hardcoded JWT secret | 1 hour | Use env/secrets manager |
| Add CORS origin config | 1 hour | Production ready |

### Phase 2: Bug Fixes (Week 1-2)

| Task | Effort | Files |
|------|--------|-------|
| Fix Media Library hardcoded URL | 30 min | MediaLibrary.jsx |
| Fix static data fallback imports | 30 min | api.js |
| Add file cleanup on media delete | 2 hours | routes/media.js |
| Fix testimonials admin route | 30 min | TestimonialsManager.jsx |
| Add proper error display in forms | 3 hours | All editors |

### Phase 3: UX Improvements (Week 2-3)

| Task | Effort | Files |
|------|--------|-------|
| Create MediaPicker modal component | 8 hours | New component |
| Integrate MediaPicker in ArticleEditor | 4 hours | ArticleEditor.jsx |
| Integrate MediaPicker in ProjectEditor | 2 hours | ProjectEditor.jsx |
| Add drag & drop upload | 4 hours | MediaLibrary.jsx |
| Add search functionality | 6 hours | All managers |
| Add autosave to editors | 4 hours | All editors |

### Phase 4: Feature Additions (Week 3-4)

| Task | Effort | Files |
|------|--------|-------|
| Add preview mode | 8 hours | ArticleEditor, ProjectEditor |
| Add scheduled publishing | 6 hours | Model + UI |
| Add activity logging | 8 hours | New middleware + UI |
| Add multi-admin support | 12 hours | Routes + UI |
| Add password recovery flow | 8 hours | Routes + UI |

### Phase 5: Production Prep (Week 4+)

| Task | Effort | Files |
|------|--------|-------|
| Production environment config | 4 hours | Config files |
| CDN/S3 integration for media | 8 hours | Upload middleware |
| Image optimization pipeline | 6 hours | Upload middleware |
| Error tracking (Sentry) | 4 hours | Server + Client |
| Performance monitoring | 4 hours | Server config |
| Database backups | 4 hours | DevOps |

---

## 11. File-by-File Issues

### Backend Files

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `server/index.js` | - | No rate limiting | High |
| `server/index.js` | - | No helmet security headers | Medium |
| `server/middleware/auth.js` | 22 | No token blacklist | Low |
| `server/middleware/upload.js` | - | No magic byte validation | Medium |
| `server/routes/auth.js` | 58 | Logout doesn't invalidate | Low |
| `server/routes/media.js` | - | No file cleanup on delete | Medium |
| `server/routes/services.js` | 35,52 | Orphan endpoints (approach/cards) | Low |
| `server/models/Article.js` | - | No content sanitization | High |
| `server/models/Media.js` | - | No image dimensions | Low |
| `server/.env` | - | Hardcoded secrets | High |

### Admin Frontend Files

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `AdminApp.jsx` | - | ✅ Fixed double JSON.stringify | - |
| `AdminApp.jsx` | - | ✅ Fixed /auth/me path | - |
| `AdminLogin.jsx` | - | No password recovery link | Low |
| `AdminLayout.jsx` | - | No responsive mobile menu | Medium |
| `ArticleEditor.jsx` | - | No media picker integration | Medium |
| `ArticleEditor.jsx` | - | ✅ Fixed isNew check | - |
| `ProjectEditor.jsx` | - | No media picker integration | Medium |
| `ProjectEditor.jsx` | - | ✅ Fixed isNew check | - |
| `MediaLibrary.jsx` | 56 | Hardcoded localhost:5000 | Medium |
| `MediaLibrary.jsx` | - | No drag & drop upload | Low |
| `SettingsManager.jsx` | - | No email change capability | Low |
| `TestimonialsManager.jsx` | - | Uses `/testimonials` not `/all` | Low |
| `All pages` | - | ✅ Fixed .data extraction | - |

### Utility Files

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `src/utils/api.js` | 11-12 | Fallback imports commented | Medium |
| `src/context/SiteDataContext.jsx` | - | No error recovery | Low |
| `AdminStyles.css` | - | ✅ Fixed cursor visibility | - |

---

## 12. Recommended Architecture Changes

### Short-Term (No Breaking Changes)

1. **Add Security Middleware Stack**
   ```javascript
   // server/index.js
   const helmet = require('helmet');
   const rateLimit = require('express-rate-limit');
   
   app.use(helmet());
   app.use('/api/auth', rateLimit({ windowMs: 15*60*1000, max: 50 }));
   app.use('/api', rateLimit({ windowMs: 60*1000, max: 200 }));
   ```

2. **Centralize API URL Configuration**
   ```javascript
   // src/config.js
   export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

3. **Create Reusable MediaPicker Component**
   ```jsx
   // src/admin/components/MediaPicker.jsx
   export function MediaPicker({ onSelect, onClose }) { ... }
   ```

4. **Add Error Boundary**
   ```jsx
   // src/admin/components/ErrorBoundary.jsx
   export function AdminErrorBoundary({ children }) { ... }
   ```

### Medium-Term (Minor Refactoring)

1. **Split AdminApp.jsx**
   - Extract `AuthContext.jsx` separate file
   - Extract `apiCall.js` utility function
   - Create `AdminRoutes.jsx` for route definitions

2. **Create Shared Form Components**
   - `FormField.jsx` - Label + input + error
   - `FormTextarea.jsx` - Textarea with character count
   - `FormSelect.jsx` - Styled select dropdown
   - `ImageInput.jsx` - URL input + MediaPicker button

3. **Implement Service Layer Pattern**
   ```javascript
   // src/admin/services/articleService.js
   export const articleService = {
     getAll: () => apiCall('/api/articles/all'),
     getOne: (id) => apiCall(`/api/articles/${id}`),
     create: (data) => apiCall('/api/articles', { method: 'POST', body: data }),
     update: (id, data) => apiCall(`/api/articles/${id}`, { method: 'PUT', body: data }),
     delete: (id) => apiCall(`/api/articles/${id}`, { method: 'DELETE' }),
   };
   ```

### Long-Term (Architecture Evolution)

1. **Consider Backend Framework Migration**
   - Current: Express (minimal)
   - Consider: NestJS or Fastify for better structure
   - Benefits: Built-in validation, OpenAPI docs, modular architecture

2. **Add API Documentation**
   - Swagger/OpenAPI specification
   - Auto-generated from route definitions
   - Interactive API explorer

3. **Implement CQRS Pattern**
   - Separate read/write models
   - Optimized queries for public API
   - Full models for admin operations

4. **Add Event Sourcing for Audit**
   - Track all content changes
   - Enable version history
   - Support content rollback

5. **Consider Headless CMS Migration**
   - If content management becomes complex
   - Options: Strapi, Payload, Directus
   - Maintain custom frontend

---

## Quick Reference

### Development Commands

```bash
# Start everything
npm run dev:all

# Frontend only
npm run dev

# Backend only
npm run dev:server

# Seed database
npm run seed

# Install server dependencies
npm run server:install
```

### API Testing

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"princethummar199@gmail.com","password":"Prince2212@"}'

# Get articles (with token)
curl http://localhost:5000/api/articles/all \
  -H "Authorization: Bearer <token>"

# Health check
curl http://localhost:5000/api/health
```

### Key File Locations

| Purpose | Path |
|---------|------|
| Backend entry | `server/index.js` |
| Environment vars | `server/.env` |
| Models | `server/models/*.js` |
| Routes | `server/routes/*.js` |
| Auth middleware | `server/middleware/auth.js` |
| Upload config | `server/middleware/upload.js` |
| Seed data | `server/scripts/seed.js` |
| Admin entry | `src/admin/AdminApp.jsx` |
| Admin styles | `src/admin/AdminStyles.css` |
| Admin pages | `src/admin/pages/*.jsx` |
| Public API utils | `src/utils/api.js` |
| Site data context | `src/context/SiteDataContext.jsx` |

---

*Document End - Generated by Codebase Audit*
