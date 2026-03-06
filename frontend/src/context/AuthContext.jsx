import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext(null)

const COOKIE_KEY = 'auth_token'

export const AuthProvider = ({ children }) => {
  // token vive solo en estado interno; NO se expone en el contexto público
  const [token, setToken] = useState(() => Cookies.get(COOKIE_KEY) || null)
  const [user, setUser] = useState(null)

  const isAuthenticated = !!token

  const login = (data) => {
    Cookies.set(COOKIE_KEY, data.token, {
      expires: 7,
      sameSite: 'Strict',
      // Solo transmitir la cookie por HTTPS en producción
      secure: import.meta.env.PROD,
    })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    Cookies.remove(COOKIE_KEY)
    setToken(null)
    setUser(null)
  }

  // Escuchar el evento global 'auth:unauthorized' disparado por apiFetch
  // ante cualquier respuesta 401 del backend → logout automático desde cualquier lugar
  useEffect(() => {
    const handleUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  return (
    // 'token' ya NO forma parte del value público del contexto
    // Los servicios leen la cookie directamente vía apiFetch
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
