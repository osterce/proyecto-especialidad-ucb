import {
  IconLayoutDashboard,
  IconPackage,
  IconTag,
  IconCategory,
  IconBuildingWarehouse,
  IconUsers,
  IconChartBar,
} from '@tabler/icons-react'

/**
 * Lista completa de ítems de navegación disponibles.
 * Cada ítem tiene un id único usado para persistir su visibilidad.
 */
export const ALL_NAV_ITEMS = [
  {
    id: 'panel-control',
    title: 'Panel de Control',
    url: '/dashboard',
    icon: IconLayoutDashboard,
    defaultVisible: true,
  },
  {
    id: 'inventarios',
    title: 'Inventarios',
    url: '/inventory',
    icon: IconPackage,
    defaultVisible: true,
    items: [
      {
        title: 'Stock Actual',
        url: '/inventory',
      },
      {
        title: 'Movimientos',
        url: '/inventory/movements',
      },
    ],
  },
  {
    id: 'productos',
    title: 'Productos',
    url: '/products',
    icon: IconTag,
    defaultVisible: true,
  },
  {
    id: 'categorias',
    title: 'Categorías',
    url: '/categories',
    icon: IconCategory,
    defaultVisible: true,
  },
  {
    id: 'almacenes',
    title: 'Almacenes',
    url: '/warehouses',
    icon: IconBuildingWarehouse,
    defaultVisible: true,
  },
  {
    id: 'usuarios',
    title: 'Administración de usuarios',
    url: '/users',
    icon: IconUsers,
    defaultVisible: true,
    items: [
      {
        title: 'Usuarios',
        url: '/users/list',
      },
      {
        title: 'Permisos',
        url: '/users/permissions',
      },
    ],
  },
  {
    id: 'reportes',
    title: 'Reportes',
    url: '/reports',
    icon: IconChartBar,
    defaultVisible: true,
  },
]
