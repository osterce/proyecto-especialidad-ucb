import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

/**
 * Layout compartido para todas las páginas protegidas.
 * Provee el sidebar y el header; el contenido específico de cada
 * página se inyecta a través de <Outlet />.
 */
const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarUser = {
    name: user?.name ?? 'Usuario',
    email: user?.email ?? '',
    avatar: '',
    onLogout: handleLogout,
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={sidebarUser} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout
