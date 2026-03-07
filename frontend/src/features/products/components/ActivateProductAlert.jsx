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

export default function ActivateProductAlert({ product, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    if (!product) return

    try {
      setLoading(true)
      await productService.activateProduct(product.id)
      toast.success('Producto activado', {
        description: `El producto ${product.name} ha sido reactivado correctamente.`
      })
      onSuccess()
    } catch (error) {
      toast.error('Error al activar', {
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
          <AlertDialogTitle>¿Reactivar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción volverá a activar el producto <strong>{product.name}</strong> ({product.sku}).
            Estará disponible nuevamente para asignarlo a categorías, inventarios y otras transacciones del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild bg-transparent p-0>
            <Button onClick={handleActivate} className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? 'Activando...' : 'Sí, activar producto'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
