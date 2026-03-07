import { apiFetch } from '@/lib/apiFetch'

const BASE_URL = import.meta.env.VITE_API_URL

export const categoryService = {
  /**
   * Obtener lista de todas las categorías
   * @param {boolean} [isActive] - Opcional para filtrar solo activos
   */
  getCategories: async (isActive) => {
    let url = `${BASE_URL}/categorias`
    if (isActive !== undefined) {
      url += `?isActive=${isActive}`
    }
    return apiFetch(url)
  },

  /**
   * Crear una nueva categoría
   * @param {Object} categoryData - { name, description }
   */
  createCategory: async (categoryData) => {
    return apiFetch(`${BASE_URL}/categorias`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  },

  /**
   * Actualizar una categoría existente
   * @param {number|string} categoryId
   * @param {Object} categoryData - { name, description }
   */
  updateCategory: async (categoryId, categoryData) => {
    return apiFetch(`${BASE_URL}/categorias/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  },

  /**
   * Desactivar una categoría (soft delete)
   * @param {number|string} categoryId 
   */
  deactivateCategory: async (categoryId) => {
    return apiFetch(`${BASE_URL}/categorias/${categoryId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Reactivar una categoría
   * @param {number|string} categoryId 
   */
  activateCategory: async (categoryId) => {
    return apiFetch(`${BASE_URL}/categorias/${categoryId}/activate`, {
      method: 'PUT',
    })
  }
}
