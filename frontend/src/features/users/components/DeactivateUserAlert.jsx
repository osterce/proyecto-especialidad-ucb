import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { userService } from '../services/userService'

export default function DeactivateUserAlert({ user, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    if (!user) return

    try {
      setLoading(true)
      await userService.deactivateUser(user.id)
      toast.success('Usuario desactivado', {
        description: `El usuario ${user.name} ha sido dado de baja. Ya no podrá iniciar sesión.`
      })
      onSuccess()
    } catch (error) {
      toast.error('Error al desactivar usuario', {
        description: error.message || 'Se produjo un problema de conexión.'
      })
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  // El dialog no renderiza nada si no hay usuario (abierto/cerrado se maneja en el padre prop open={!!user})
  if (!user) return null

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción desactivará la cuenta de <strong>{user.name}</strong> ({user.email}). 
            El usuario será desconectado y <strong>no podrá volver a iniciar sesión</strong> en el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          {/* Usamos asChild dentro de Action para evitar que intercepte onClicks nativos raro,
              y aplicamos estilos destructivos usando el componente Button interno */}
          <AlertDialogAction asChild bg-transparent p-0>
            <Button variant="destructive" onClick={handleDeactivate} disabled={loading}>
              {loading ? 'Desactivando...' : 'Sí, desactivar usuario'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
