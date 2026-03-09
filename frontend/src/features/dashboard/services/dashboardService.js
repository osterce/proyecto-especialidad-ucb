import { apiFetch } from '@/lib/apiFetch'

const BASE_API_URL = import.meta.env.VITE_API_URL

export const dashboardService = {
  /**
   * Obtener los datos generales del panel de control
   */
  getDashboardData: async () => {
    return apiFetch(`${BASE_API_URL}/dashboard`)
  }
}
