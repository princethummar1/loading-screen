import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ContactPage from './components/ContactPage.jsx'
import PortfolioPage from './components/PortfolioPage.jsx'
import AboutPage from './components/AboutPage.jsx'
import ServiceDetailPage from './components/ServiceDetailPage.jsx'
import NewsInsightsPage from './components/NewsInsightsPage.jsx'
import ArticleDetailPage from './components/ArticleDetailPage.jsx'
import CaseStudy from './components/CaseStudy.jsx'
import PageTransition from './components/PageTransition.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminApp from './admin/AdminApp.jsx'
import { SiteDataProvider } from './context/SiteDataContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteDataProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminApp />} />
          
          {/* Public Routes */}
          <Route path="/*" element={
            <PageTransition>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services/:slug" element={<ServiceDetailPage />} />
                <Route path="/news" element={<NewsInsightsPage />} />
                <Route path="/news/:slug" element={<ArticleDetailPage />} />
                <Route path="/case-study/:slug" element={<CaseStudy />} />
              </Routes>
            </PageTransition>
          } />
        </Routes>
      </SiteDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
