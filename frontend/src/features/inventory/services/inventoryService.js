import { apiFetch } from '@/lib/apiFetch'

const BASE_API_URL = import.meta.env.VITE_API_URL

export const inventoryService = {
  /**
   * Obtener el stock actual de inventario
   * @param {Object} filters - Filtros opcionales { productId, warehouseId }
   */
  getInventory: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    if (filters.productId) queryParams.append('productId', filters.productId)
    if (filters.warehouseId) queryParams.append('warehouseId', filters.warehouseId)

    const queryString = queryParams.toString()
    const url = `${BASE_API_URL}/inventario${queryString ? `?${queryString}` : ''}`

    return apiFetch(url)
  },

  /**
   * Obtener alertas de stock bajo
   */
  getLowStockAlerts: async () => {
    return apiFetch(`${BASE_API_URL}/inventario/alertas`)
  },

  /**
   * Obtener el historial de movimientos
   * @param {Object} filters - { productId, warehouseId, type, from, to }
   */
  getMovements: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    if (filters.productId) queryParams.append('productId', filters.productId)
    if (filters.warehouseId) queryParams.append('warehouseId', filters.warehouseId)
    if (filters.type) queryParams.append('type', filters.type)
    if (filters.from) queryParams.append('from', filters.from)
    if (filters.to) queryParams.append('to', filters.to)

    const queryString = queryParams.toString()
    const url = `${BASE_API_URL}/movimientos${queryString ? `?${queryString}` : ''}`

    return apiFetch(url)
  },

  /**
   * Registrar una Entrada de stock
   * @param {Object} data - { product_id, warehouse_id, quantity, motive, document }
   */
  registerEntrada: async (data) => {
    const payload = {
      productId: data.product_id,
      warehouseId: data.warehouse_id,
      quantity: data.quantity,
      unitPrice: data.unitPrice || 0,
      notes: data.motive,
      reference: data.document
    }

    return apiFetch(`${BASE_API_URL}/movimientos/entradas`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Registrar una Salida de stock
   * @param {Object} data - { product_id, warehouse_id, quantity, motive, document }
   */
  registerSalida: async (data) => {
    const payload = {
      productId: data.product_id,
      warehouseId: data.warehouse_id,
      quantity: data.quantity,
      unitPrice: data.unitPrice || 0,
      notes: data.motive,
      reference: data.document
    }

    return apiFetch(`${BASE_API_URL}/movimientos/salidas`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Movimiento compuesto: Traslado entre almacenes (Salida + Entrada)
   */
  transferStock: async (productId, fromWarehouseId, toWarehouseId, quantity, motive) => {
    // PASO A: Disminuir del almacén origen (Salida)
    await inventoryService.registerSalida({
      product_id: parseInt(productId, 10),
      warehouse_id: parseInt(fromWarehouseId, 10),
      quantity: parseInt(quantity, 10),
      motive: `Traslado a Almacén ID ${toWarehouseId}: ${motive}`,
    })

    // PASO B: Incremento en el destino (Entrada) - solo se ejecuta si la salida no arrojó error
    await inventoryService.registerEntrada({
      product_id: parseInt(productId, 10),
      warehouse_id: parseInt(toWarehouseId, 10),
      quantity: parseInt(quantity, 10),
      motive: `Traslado recibido desde Almacén ID ${fromWarehouseId}: ${motive}`,
    })

    return true
  }
}
