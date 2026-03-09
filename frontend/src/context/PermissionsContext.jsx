import { createContext, useContext, useState } from 'react'
import { MENU_MODULES as defaultModules } from '@/config/menuModules'

const PermissionsContext = createContext(null)

const STORAGE_KEY = 'role_permissions'

const getInitialPermissions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // Si JSON está corrupto, usar defaults
  }
  return defaultModules
}

export const PermissionsProvider = ({ children }) => {
  const [rolePermissions, setRolePermissions] = useState(getInitialPermissions)

  /**
   * Guarda o actualiza los permisos en el estado y localStorage
   * @param {Object} newPermissions Objeto completo mapeado como { ROL: ['id1', 'id2'] }
   */
  const saveRolePermissions = (newPermissions) => {
    setRolePermissions(newPermissions)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPermissions))
  }

  return (
    <PermissionsContext.Provider value={{ rolePermissions, saveRolePermissions }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext)
  if (!ctx) throw new Error('usePermissions debe usarse dentro de PermissionsProvider')
  return ctx
}
