import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/components/LoginPage'
import DashboardPage from '@/features/dashboard/components/DashboardPage'
import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta raíz → redirige a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
