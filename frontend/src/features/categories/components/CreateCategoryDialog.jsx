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
import { categoryService } from '../services/categoryService'

export default function CreateCategoryDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic formatting
    const payload = { ...formData }

    if (payload.name.length < 2) {
      toast.error('Error de validación', { description: 'El nombre debe tener al menos 2 caracteres' })
      return
    }

    try {
      setLoading(true)
      await categoryService.createCategory(payload)
      toast.success('Categoría creada', {
        description: `La categoría ${payload.name} ha sido registrada exitosamente.`
      })
      
      // Limpiar y cerrar
      setFormData({
        name: '',
        description: ''
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al crear categoría', {
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
          <DialogTitle>Nueva Categoría</DialogTitle>
          <DialogDescription>
            Ingresa los datos de la nueva categoría para organizar el inventario.
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
              {loading ? 'Guardando...' : 'Guardar Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
