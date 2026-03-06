import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { MenuConfigProvider } from '@/context/MenuConfigContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppRouter from '@/router/AppRouter'
import { Toaster } from '@/components/ui/sonner'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuConfigProvider>
          <TooltipProvider>
            <AppRouter />
            <Toaster />
          </TooltipProvider>
        </MenuConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App