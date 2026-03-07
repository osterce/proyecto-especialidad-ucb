import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { productService } from '../services/productService'

export default function CreateProductDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unitPrice: '',
    description: '',
    categoryId: '',
    minStock: '0'
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic formatting
    const payload = {
      ...formData,
      sku: formData.sku.toUpperCase(),
      unitPrice: Number(formData.unitPrice),
      minStock: Number(formData.minStock),
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined
    }

    if (payload.unitPrice < 0 || payload.minStock < 0) {
      toast.error('Error de validación', { description: 'El precio y stock no pueden ser negativos' })
      return
    }

    try {
      setLoading(true)
      await productService.createProduct(payload)
      toast.success('Producto creado', {
        description: `El producto ${payload.name} ha sido registrado exitosamente.`
      })
      
      // Limpiar y cerrar
      setFormData({
        name: '',
        sku: '',
        unitPrice: '',
        description: '',
        categoryId: '',
        minStock: '0'
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al crear producto', {
        description: error.message || 'Se produjo un problema al guardar.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo producto del inventario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input 
              id="name" 
              placeholder="Ej. Tela de Algodón" 
              value={formData.name}
              onChange={handleChange}
              required 
              minLength={2}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input 
              id="sku" 
              placeholder="Ej. TEL-ALG-001" 
              value={formData.sku}
              onChange={handleChange}
              required 
              minLength={2}
              className="uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="unitPrice">Precio Unitario (Bs.) *</Label>
              <Input 
                id="unitPrice" 
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minStock">Min Stock</Label>
              <Input 
                id="minStock" 
                type="number"
                min="0"
                value={formData.minStock}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryId">ID Categoría (Opcional)</Label>
            <Input 
              id="categoryId" 
              type="number"
              min="1"
              value={formData.categoryId}
              onChange={handleChange}
              placeholder="ID de categoría"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Input 
              id="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Breve descripción del producto"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
