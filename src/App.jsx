import { Routes, Route, Navigate } from 'react-router-dom'
import TraceabilityPage from './pages/TraceabilityPage'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      {/* Public QR scan result page — simulates a diseased tree scan */}
      <Route path="/"               element={<TraceabilityPage treeStatus="healthy" />} />
      <Route path="/trace/:treeId"  element={<TraceabilityPage treeStatus="healthy" />} />
      <Route path="/flagged"        element={<TraceabilityPage treeStatus="diseased" />} />

      {/* Admin dashboard routes */}
      <Route path="/admin/*"        element={<AdminDashboard />} />

      {/* Fallback */}
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}
