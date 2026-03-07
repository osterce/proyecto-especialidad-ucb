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
import { productService } from '../services/productService'

export default function DeactivateProductAlert({ product, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    if (!product) return

    try {
      setLoading(true)
      await productService.deactivateProduct(product.id)
      toast.success('Producto desactivado', {
        description: `El producto ${product.name} ha sido dado de baja correctamente.`
      })
      onSuccess()
    } catch (error) {
      toast.error('Error al desactivar', {
        description: error.message || 'Se produjo un problema de conexión.'
      })
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  // El dialog no renderiza nada si no hay producto seleccionado
  if (!product) return null

  return (
    <AlertDialog open={!!product} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción desactivará el producto <strong>{product.name}</strong> ({product.sku}).
            Dejará de estar disponible para nuevas transacciones y movimientos de inventario hasta que se vuelva a activar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild bg-transparent p-0>
            <Button onClick={handleDeactivate} variant="destructive" disabled={loading}>
              {loading ? 'Desactivando...' : 'Sí, desactivar producto'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
