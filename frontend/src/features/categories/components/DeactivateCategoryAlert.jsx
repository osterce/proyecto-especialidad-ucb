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

export default function DeactivateCategoryAlert({ category, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    if (!category) return

    try {
      setLoading(true)
      await categoryService.deactivateCategory(category.id)
      toast.success('Categoría desactivada', {
        description: `La categoría ${category.name} ha sido desactivada.`
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al desactivar', {
        description: error.message || 'Hubo un problema desactivando la categoría.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={!!category} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desactivar Categoría?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de desactivar la categoría <strong>{category?.name}</strong>.
            Esto ocultará la categoría de los listados activos. Podrás reactivarla más tarde.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDeactivate} 
            disabled={loading}
          >
            {loading ? 'Desactivando...' : 'Desactivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
