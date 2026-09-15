import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import TraceabilityPage from './pages/TraceabilityPage'
import AdminDashboard from './pages/AdminDashboard'
import ChatbotWidget from './components/ChatbotWidget'
import { getAuthToken } from './services/treeService'

// ── Protected Route Wrapper for Admin Dashboard ────────────────
function ProtectedRoute({ children }) {
  const token = getAuthToken()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Landing Page with Portal Buttons & Search */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page (Admin & Farmer Auth) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public QR scan result pages (No auth needed for buyers/public) */}
        <Route path="/public" element={<TraceabilityPage treeStatus="healthy" />} />
        <Route path="/trace/:treeId" element={<TraceabilityPage treeStatus="healthy" />} />
        <Route path="/flagged" element={<TraceabilityPage treeStatus="diseased" />} />

        {/* Protected Admin dashboard routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget />
    </>
  )
}
