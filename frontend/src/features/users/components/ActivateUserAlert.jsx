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

export default function ActivateUserAlert({ user, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    if (!user) return

    try {
      setLoading(true)
      await userService.activateUser(user.id)
      toast.success('Usuario activado', {
        description: `El usuario ${user.name} ha sido reactivado. Ahora puede volver a iniciar sesión.`
      })
      onSuccess()
    } catch (error) {
      toast.error('Error al activar usuario', {
        description: error.message || 'Se produjo un problema de conexión.'
      })
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  // El dialog no renderiza nada si no hay usuario
  if (!user) return null

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reactivar cuenta de usuario</AlertDialogTitle>
          <AlertDialogDescription>
            Está a punto de reactivar la cuenta de <strong>{user.name}</strong> ({user.email}). 
            El usuario recuperará el acceso al sistema con los roles que tenía asignados. ¿Desea continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild bg-transparent p-0>
            <Button onClick={handleActivate} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? 'Activando...' : 'Sí, activar usuario'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
