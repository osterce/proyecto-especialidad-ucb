import { apiFetch } from '@/lib/apiFetch'

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`

export const authService = {
  /**
   * Login público: no requiere token, usa fetch directo con timeout propio.
   */
  async login(email, password) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Credenciales inválidas')
      }
      return res.json()
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Intenta de nuevo.')
      }
      throw err
    }
  },

  /**
   * Valida el token activo contra el backend.
   * apiFetch inyecta el JWT desde la cookie y lanza UnauthorizedError si recibe 401.
   */
  async validateToken() {
    await apiFetch(`${BASE_URL}/`)
  },
}
