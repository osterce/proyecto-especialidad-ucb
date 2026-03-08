import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { productService } from '../services/productService'
import { categoryService } from '@/features/categories/services/categoryService'

export default function UpdateProductDialog({ product, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unitPrice: '',
    description: '',
    categoryId: '',
    minStock: '0'
  })

  // Prellenar datos al abrir
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        unitPrice: product.unitPrice?.toString() || '0',
        description: product.description || '',
        categoryId: product.categoryId?.toString() || '',
        minStock: product.minStock?.toString() || '0'
      })
    }
  }, [product])

  const [categories, setCategories] = useState([])

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories(true)
        setCategories(data)
      } catch (error) {
        toast.error('Error cargando categorías', { description: error.message })
      }
    }
    if (product) fetchCats()
  }, [product])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Formatting
    const payload = {
      name: formData.name,
      sku: formData.sku.toUpperCase(),
      unitPrice: Number(formData.unitPrice),
      minStock: Number(formData.minStock),
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      description: formData.description
    }

    if (payload.unitPrice < 0 || payload.minStock < 0) {
      toast.error('Error', { description: 'Los valores numéricos no pueden ser negativos' })
      return
    }

    try {
      setLoading(true)
      await productService.updateProduct(product.id, payload)
      toast.success('Producto actualizado', {
        description: `Los datos de ${payload.name} han sido actualizados exitosamente.`
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar', {
        description: error.message || 'Hubo un problema de conexión.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Producto</DialogTitle>
          <DialogDescription>
            Modificando los datos del producto: <strong>{product?.name}</strong>.
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
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryId">Categoría (Opcional)</Label>
            <Select 
              value={formData.categoryId || ""} 
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
