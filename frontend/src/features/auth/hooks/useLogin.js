import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authService } from '../services/authService'

export const useLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // States para Force Change Password
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false)
  const [tempCredentials, setTempCredentials] = useState(null)

  const handleSubmit = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      setRequiresPasswordChange(false)
      const data = await authService.login(email, password)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      if (err.message === 'FORCE_CHANGE_PASSWORD') {
        setRequiresPasswordChange(true)
        setTempCredentials({ email, password })
      } else {
        setError(err.message || 'Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  return { handleSubmit, loading, error, requiresPasswordChange, tempCredentials, setRequiresPasswordChange }
}
