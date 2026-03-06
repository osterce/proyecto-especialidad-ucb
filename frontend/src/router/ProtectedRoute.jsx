import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/features/auth/services/authService'
import { UnauthorizedError } from '@/lib/apiFetch'

/**
 * Guard de rutas protegidas con validación real contra el backend.
 *
 * Flujo:
 * 1. Si no hay token en cookie → redirige a /login inmediatamente
 * 2. Si hay token → llama validateToken() para verificar con el backend
 *    - Éxito (200) → renderiza la ruta solicitada
 *    - 401 / error → el evento auth:unauthorized limpia la sesión y redirige
 */
const ProtectedRoute = () => {
  const { isAuthenticated, logout } = useAuth()
  const [validating, setValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Sin token local: no tiene sentido llamar al backend
    if (!isAuthenticated) {
      setValidating(false)
      return
    }

    authService
      .validateToken()
      .then(() => {
        setIsValid(true)
      })
      .catch((err) => {
        // UnauthorizedError ya fue manejado por apiFetch (evento global → logout)
        // Para otros errores (red caída, timeout) también denegamos acceso
        if (!(err instanceof UnauthorizedError)) {
          logout()
        }
        setIsValid(false)
      })
      .finally(() => {
        setValidating(false)
      })
  }, []) // Solo al montar; el evento global maneja 401 posteriores

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    )
  }

  if (!isAuthenticated || !isValid) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
