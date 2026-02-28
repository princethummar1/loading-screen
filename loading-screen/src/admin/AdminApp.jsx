import { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import ArticlesManager from './pages/ArticlesManager';
import ArticleEditor from './pages/ArticleEditor';
import ProjectsManager from './pages/ProjectsManager';
import ProjectEditor from './pages/ProjectEditor';
import ServicesManager from './pages/ServicesManager';
import ServiceEditor from './pages/ServiceEditor';
import TestimonialsManager from './pages/TestimonialsManager';
import FAQManager from './pages/FAQManager';
import LogosManager from './pages/LogosManager';
import MediaLibrary from './pages/MediaLibrary';
import SettingsManager from './pages/SettingsManager';
import './AdminStyles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider
function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('kyurex_admin_token'));
  const [email, setEmail] = useState(localStorage.getItem('kyurex_admin_email'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token on mount
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token invalid');
        }

        setLoading(false);
      } catch (err) {
        // Token invalid, clear and redirect
        logout();
      }
    };

    verifyToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('kyurex_admin_token');
    localStorage.removeItem('kyurex_admin_email');
    setToken(null);
    setEmail(null);
    navigate('/admin');
  };

  // API call helper with auth
  const apiCall = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Determine the body - don't double-stringify
    let body = options.body;
    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      // If body is not already a string, stringify it
      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        logout();
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  const value = {
    token,
    email,
    loading,
    logout,
    apiCall,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #2a2a2a',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
      <Routes>
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="articles" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ArticlesManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="articles/new" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ArticleEditor />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="articles/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ArticleEditor />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="projects" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectsManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="projects/new" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectEditor />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="projects/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectEditor />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="services" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ServicesManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="services/:slug" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ServiceEditor />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="testimonials" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <TestimonialsManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="faq" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <FAQManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="logos" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <LogosManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="media" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <MediaLibrary />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <SettingsManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
