import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { warehouseService } from '../services/warehouseService'

const formSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),
  location: z.string().max(255, 'La ubicación es demasiado larga').optional(),
  description: z.string().max(500, 'La descripción es demasiado larga').optional(),
})

export default function UpdateWarehouseDialog({ warehouse, onOpenChange, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
    },
  })

  useEffect(() => {
    if (warehouse) {
      form.reset({
        name: warehouse.name || '',
        location: warehouse.location || '',
        description: warehouse.description || '',
      })
    }
  }, [warehouse, form])

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      
      const payload = {
        name: values.name.trim(),
        location: values.location?.trim() || null,
        description: values.description?.trim() || null,
      }

      await warehouseService.updateWarehouse(warehouse.id, payload)
      
      toast.success('Almacén actualizado', {
        description: `Los datos del almacén han sido guardados.`
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar', {
        description: error.message || 'Ocurrió un error inesperado al modificar el almacén.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={!!warehouse} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Almacén</DialogTitle>
          <DialogDescription>
            Modifica la información del almacén {warehouse?.id && `(#${warehouse.id})`}.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Almacén Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Planta Baja, Sector A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Información adicional sobre el almacén..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
