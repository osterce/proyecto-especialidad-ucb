import { createContext, useContext, useState } from 'react'
import { ALL_NAV_ITEMS } from '@/config/navItems'

const MenuConfigContext = createContext(null)

const STORAGE_KEY = 'menu_config'

const getInitialConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // si JSON está corrupto, usar defaults
  }
  return ALL_NAV_ITEMS.map(({ id, defaultVisible }) => ({
    id,
    visible: defaultVisible,
  }))
}

export const MenuConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(getInitialConfig)

  const toggleItem = (id) => {
    setConfig((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  /** Ítems del menú actualmente visibles, en el orden definido en navItems.js */
  const visibleItems = ALL_NAV_ITEMS.filter((navItem) => {
    const c = config.find((c) => c.id === navItem.id)
    return c ? c.visible : navItem.defaultVisible
  })

  return (
    <MenuConfigContext.Provider value={{ config, toggleItem, visibleItems }}>
      {children}
    </MenuConfigContext.Provider>
  )
}

export const useMenuConfig = () => {
  const ctx = useContext(MenuConfigContext)
  if (!ctx) throw new Error('useMenuConfig debe usarse dentro de MenuConfigProvider')
  return ctx
}
