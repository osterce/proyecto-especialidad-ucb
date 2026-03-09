import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PermissionsProvider } from '@/context/PermissionsContext'
import { MenuConfigProvider } from '@/context/MenuConfigContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppRouter from '@/router/AppRouter'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionsProvider>
          <MenuConfigProvider>
            <TooltipProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AppRouter />
                <Toaster />
              </ThemeProvider>
            </TooltipProvider>
          </MenuConfigProvider>
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App