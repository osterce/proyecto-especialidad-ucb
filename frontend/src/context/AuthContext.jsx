import { createContext, useContext, useState } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext(null)

const COOKIE_KEY = 'auth_token'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => Cookies.get(COOKIE_KEY) || null)
  const [user, setUser] = useState(null)

  const isAuthenticated = !!token

  const login = (data) => {
    Cookies.set(COOKIE_KEY, data.token, { expires: 7, sameSite: 'Strict' })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    Cookies.remove(COOKIE_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
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
