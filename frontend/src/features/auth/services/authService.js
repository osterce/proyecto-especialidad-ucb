const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`

export const authService = {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al iniciar sesión')
    }
    return res.json()
  },
}
