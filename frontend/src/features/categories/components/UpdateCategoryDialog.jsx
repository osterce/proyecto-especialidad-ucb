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
import { categoryService } from '../services/categoryService'

export default function UpdateCategoryDialog({ category, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  // Prellenar al abrir si hay categoría seleccionada
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      })
    }
  }, [category])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = { ...formData }

    if (payload.name.length < 2) {
      toast.error('Error de validación', { description: 'El nombre debe tener al menos 2 caracteres' })
      return
    }

    try {
      setLoading(true)
      await categoryService.updateCategory(category.id, payload)
      toast.success('Categoría actualizada', {
        description: `La categoría ha sido modificada correctamente.`
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar', {
        description: error.message || 'Se produjo un error durante la actualización.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!category} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificar Categoría</DialogTitle>
          <DialogDescription>
            Actualiza los datos de esta categoría.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input 
              id="name" 
              placeholder="Ej. Telas" 
              value={formData.name}
              onChange={handleChange}
              required 
              minLength={2}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Input 
              id="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Breve descripción"
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
