import { apiFetch } from '@/lib/apiFetch'

const BASE_URL = import.meta.env.VITE_API_URL

export const warehouseService = {
  /**
   * Obtiene la lista de todos los almacenes.
   * @returns {Promise<Array>} Lista de almacenes
   */
  async getWarehouses() {
    return apiFetch(`${BASE_URL}/almacenes/`)
  },

  /**
   * Crea un nuevo almacén.
   * @param {Object} data Datos del almacén (name, location, description)
   * @returns {Promise<Object>} Almacén creado
   */
  async createWarehouse(data) {
    return apiFetch(`${BASE_URL}/almacenes/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Actualiza los datos de un almacén existente.
   * @param {number|string} id ID del almacén
   * @param {Object} data Datos a actualizar
   * @returns {Promise<Object>} Almacén actualizado
   */
  async updateWarehouse(id, data) {
    return apiFetch(`${BASE_URL}/almacenes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Desactiva (soft delete) un almacén.
   * @param {number|string} id ID del almacén
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  async deactivateWarehouse(id) {
    return apiFetch(`${BASE_URL}/almacenes/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Reactiva un almacén.
   * @param {number|string} id ID del almacén
   * @returns {Promise<Object>} Almacén actualizado
   */
  async activateWarehouse(id) {
    return apiFetch(`${BASE_URL}/almacenes/${id}/activate`, {
      method: 'PUT',
    })
  },
}
