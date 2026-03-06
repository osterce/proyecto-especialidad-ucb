import Cookies from 'js-cookie'

const COOKIE_KEY = 'auth_token'
const TIMEOUT_MS = 10000

/**
 * Error específico para respuestas 401 del servidor.
 * Permite distinguirlo de otros errores en los componentes.
 */
export class UnauthorizedError extends Error {
  constructor() {
    super('Sesión inválida o expirada')
    this.name = 'UnauthorizedError'
    this.status = 401
  }
}

/**
 * Wrapper centralizado de fetch que:
 * - Agrega automáticamente el header Authorization con el JWT de la cookie
 * - Aplica un timeout de 10 segundos
 * - Lanza UnauthorizedError en 401 y dispara el evento global auth:unauthorized
 * - Lanza Error con el mensaje del backend para otros errores
 */
export const apiFetch = async (url, options = {}) => {
  const token = Cookies.get(COOKIE_KEY)

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (res.status === 401) {
      // Notificar globalmente para que AuthContext haga logout automático
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      throw new UnauthorizedError()
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Error ${res.status}: solicitud fallida`)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeoutId)

    if (err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.')
    }

    throw err
  }
}
