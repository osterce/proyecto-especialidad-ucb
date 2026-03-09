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
import { Loader2 } from 'lucide-react'
import { warehouseService } from '../services/warehouseService'

export default function ActivateWarehouseAlert({ warehouse, onOpenChange, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleActivate = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      await warehouseService.activateWarehouse(warehouse.id)
      
      toast.success('Almacén activado', {
        description: `El almacén "${warehouse.name}" ha sido activado exitosamente.`
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al activar', {
        description: error.message || 'No se pudo activar el almacén.'
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={!!warehouse} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Activar este almacén?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción habilitará el almacén <strong>{warehouse?.name}</strong>.
            Estará disponible nuevamente para operaciones y transacciones.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleActivate}
            disabled={isSubmitting}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sí, Activar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
