import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/components/LoginPage'
import DashboardPage from '@/features/dashboard/components/DashboardPage'
import SettingsPage from '@/features/settings/components/SettingsPage'
import InventoryPage from '@/features/inventory/components/InventoryPage'
import MovementsHistoryPage from '@/features/inventory/components/MovementsHistoryPage'
import ProductsPage from '@/features/products/components/ProductsPage'
import CategoriesPage from '@/features/categories/components/CategoriesPage'
import WarehousesPage from '@/features/warehouses/components/WarehousesPage'
import ReportsPage from '@/features/reports/components/ReportsPage'
import UsersPage from '@/features/users/components/UsersPage'
import PermissionsPage from '@/features/users/components/PermissionsPage'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '@/layouts/AppLayout'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"   element={<DashboardPage />} />
          <Route path="/inventory"   element={<InventoryPage />} />
          <Route path="/inventory/movements" element={<MovementsHistoryPage />} />
          <Route path="/products"    element={<ProductsPage />} />
          <Route path="/categories"  element={<CategoriesPage />} />
          <Route path="/warehouses"  element={<WarehousesPage />} />
          <Route path="/reports"     element={<ReportsPage />} />
          <Route path="/users/list"  element={<UsersPage />} />
          <Route path="/users/permissions" element={<PermissionsPage />} />
          <Route path="/ajustes"     element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
