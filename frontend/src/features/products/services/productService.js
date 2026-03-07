import { apiFetch } from '@/lib/apiFetch'

const BASE_URL = import.meta.env.VITE_API_URL

export const productService = {
  /**
   * Obtener lista de todos los productos (aplica filtro isActive en DB opcional)
   * @param {boolean} [isActive] - Opcional para filtrar solo activos
   */
  getProducts: async (isActive) => {
    let url = `${BASE_URL}/productos`
    if (isActive !== undefined) {
      url += `?isActive=${isActive}`
    }
    return apiFetch(url)
  },

  /**
   * Obtener un producto por ID
   * @param {number|string} productId 
   */
  getProductById: async (productId) => {
    return apiFetch(`${BASE_URL}/productos/${productId}`)
  },

  /**
   * Crear un nuevo producto
   * @param {Object} productData - { name, sku, categoryId, etc. }
   */
  createProduct: async (productData) => {
    return apiFetch(`${BASE_URL}/productos`, {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  /**
   * Actualizar un producto existente
   * @param {number|string} productId
   * @param {Object} productData
   */
  updateProduct: async (productId, productData) => {
    return apiFetch(`${BASE_URL}/productos/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  /**
   * Desactivar un producto (soft delete)
   * @param {number|string} productId 
   */
  deactivateProduct: async (productId) => {
    return apiFetch(`${BASE_URL}/productos/${productId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Reactivar un producto
   * @param {number|string} productId 
   */
  activateProduct: async (productId) => {
    return apiFetch(`${BASE_URL}/productos/${productId}/activate`, {
      method: 'PUT',
    })
  }
}
