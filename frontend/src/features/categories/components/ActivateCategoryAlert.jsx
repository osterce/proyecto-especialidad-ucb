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
import { categoryService } from '../services/categoryService'

export default function ActivateCategoryAlert({ category, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    if (!category) return

    try {
      setLoading(true)
      await categoryService.activateCategory(category.id)
      toast.success('Categoría reactivada', {
        description: `La categoría ${category.name} ha sido activada nuevamente.`
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al reactivar', {
        description: error.message || 'Hubo un problema activando la categoría.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={!!category} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Reactivar Categoría?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a reactivar la categoría <strong>{category?.name}</strong>.
            Volverá a estar disponible para su uso en los listados activos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={handleActivate} 
            disabled={loading}
          >
            {loading ? 'Activando...' : 'Activar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
