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

export default function DeactivateWarehouseAlert({ warehouse, onOpenChange, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeactivate = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      await warehouseService.deactivateWarehouse(warehouse.id)
      
      toast.success('Almacén desactivado', {
        description: `El almacén "${warehouse.name}" ha sido desactivado exitosamente.`
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al desactivar', {
        description: error.message || 'No se pudo desactivar el almacén.'
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
          <AlertDialogTitle>¿Desactivar este almacén?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción deshabilitará el almacén <strong>{warehouse?.name}</strong>.
            Cualquier operación posterior que dependa de este almacén activo podría verse interrumpida.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeactivate}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sí, Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
