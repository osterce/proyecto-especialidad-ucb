import { apiFetch } from '@/lib/apiFetch'

const BASE_URL = import.meta.env.VITE_API_URL

export const userService = {
  /**
   * Obtener lista de todos los usuarios
   */
  getUsers: async () => {
    return apiFetch(`${BASE_URL}/auth/`)
  },

  /**
   * Crear un nuevo usuario
   * @param {Object} userData - { name, email, password, roles }
   */
  createUser: async (userData) => {
    return apiFetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  /**
   * Actualizar nombre e email de un usuario (Admin)
   * @param {number|string} userId 
   * @param {Object} userData - { name, email }
   */
  updateUser: async (userId, userData) => {
    return apiFetch(`${BASE_URL}/auth/update/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  /**
   * Actualizar roles de un usuario existente
   * @param {number|string} userId
   * @param {string[]} roles
   */
  updateUserRoles: async (userId, roles) => {
    return apiFetch(`${BASE_URL}/auth/admin/users/${userId}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roles }),
    })
  },

  /**
   * Desactivar un usuario (soft delete)
   * @param {number|string} userId 
   */
  deactivateUser: async (userId) => {
    return apiFetch(`${BASE_URL}/auth/deactivate/${userId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Reactivar un usuario desactivado
   * @param {number|string} userId 
   */
  activateUser: async (userId) => {
    return apiFetch(`${BASE_URL}/auth/activate/${userId}`, {
      method: 'PUT',
    })
  },

  /**
   * Resetear contraseña de un usuario a default (123456)
   * @param {number|string} userId 
   */
  resetPassword: async (userId) => {
    return apiFetch(`${BASE_URL}/auth/admin/users/${userId}/reset-password`, {
      method: 'PUT',
    })
  }
}
