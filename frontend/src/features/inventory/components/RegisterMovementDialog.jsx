import React, { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

import { inventoryService } from '../services/inventoryService'
import { productService } from '../../products/services/productService'
import { warehouseService } from '../../warehouses/services/warehouseService'

// Base schema without dynamic refinements
const baseMovementSchema = z.object({
  type: z.enum(['ENTRADA', 'SALIDA']),
  product_id: z.string().min(1, 'Debe seleccionar un producto'),
  warehouse_id: z.string().min(1, 'Debe seleccionar un almacén'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser mayor a 0'),
  motive: z.string().min(3, 'El motivo debe tener al menos 3 caracteres'),
  document: z.string().optional(),
})

const RegisterMovementDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [allWarehouses, setAllWarehouses] = useState([])
  const [currentInventory, setCurrentInventory] = useState([])

  // Dynamic schema that validates max stock based on current inventory
  const movementSchema = useMemo(() => {
    return baseMovementSchema.superRefine((data, ctx) => {
      if (data.type === 'SALIDA') {
        const prodIdNum = parseInt(data.product_id, 10);
        const warehouseIdNum = parseInt(data.warehouse_id, 10);
        
        if (!isNaN(prodIdNum) && !isNaN(warehouseIdNum)) {
          const inventoryItem = currentInventory.find(
            inv => inv.productId === prodIdNum && inv.warehouseId === warehouseIdNum
          );
          const maxAvailableStock = inventoryItem ? Number(inventoryItem.stockQuantity) : 0;

          if (data.quantity > maxAvailableStock) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `No puedes retirar más del stock disponible (${maxAvailableStock})`,
              path: ['quantity'],
            });
          }
        }
      }
    });
  }, [currentInventory]);

  const form = useForm({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: 'ENTRADA',
      product_id: '',
      warehouse_id: '',
      quantity: 1,
      motive: '',
      document: '',
    },
  })

  // Watch for changes to type and product_id to filter warehouses dynamically
  const typeWatch = form.watch('type')
  const productIdWatch = form.watch('product_id')

  useEffect(() => {
    if (open) {
      // Fetch core catalogs and all inventory
      Promise.all([
        productService.getProducts(),
        warehouseService.getWarehouses(),
        inventoryService.getInventory()
      ]).then(([productsData, warehousesData, inventoryData]) => {
        setProducts(productsData.filter(p => p.isActive))
        setAllWarehouses(warehousesData.filter(w => w.isActive))
        setCurrentInventory(inventoryData)
      }).catch((err) => {
        toast.error('Error al cargar catálogos', { description: err.message })
      })
    }
  }, [open])

  // Derive which warehouses are available to select
  const availableWarehouses = useMemo(() => {
    if (typeWatch === 'ENTRADA' || !productIdWatch) {
      // Si es entrada o no hay producto, permite elegir cualquier almacén activo
      return allWarehouses
    }

    // Si es salida y hay producto, filtra almacenes donde exista stock de ese producto
    const prodIdNum = parseInt(productIdWatch, 10)
    const validWarehouseIds = currentInventory
      .filter(inv => inv.productId === prodIdNum && Number(inv.stockQuantity) > 0)
      .map(inv => inv.warehouseId)

    return allWarehouses.filter(w => validWarehouseIds.includes(w.id))
  }, [allWarehouses, currentInventory, typeWatch, productIdWatch])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        type: 'ENTRADA',
        product_id: '',
        warehouse_id: '',
        quantity: 1,
        motive: '',
        document: '',
      })
    }
  }, [open, form])

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      
      const payload = {
        product_id: parseInt(values.product_id, 10),
        warehouse_id: parseInt(values.warehouse_id, 10),
        quantity: parseInt(values.quantity, 10),
        motive: values.motive,
      }
      if (values.document) {
        payload.document = values.document
      }

      if (values.type === 'ENTRADA') {
        await inventoryService.registerEntrada(payload)
        toast.success('Entrada registrada', { description: 'El inventario ha sido actualizado (sumado).' })
      } else {
        await inventoryService.registerSalida(payload)
        toast.success('Salida registrada', { description: 'El inventario ha sido actualizado (restado).' })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      // Mostrar alerta especial si es saldo insuficiente
      if (error.message?.toLowerCase().includes('insufficient stock') || error.message?.toLowerCase().includes('stock insuficiente')) {
        toast.error('Inventario insuficiente', {
          description: 'Estás intentando sacar más stock del que existe en ese almacén.'
        })
      } else {
        toast.error('Error al registrar movimiento', {
          description: error.message
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Movimiento</DialogTitle>
          <DialogDescription>
            Registra una entrada para aumentar inventario o una salida para disminuirlo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimiento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione Entrada o Salida" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ENTRADA">🟢 Entrada (Ingreso)</SelectItem>
                      <SelectItem value="SALIDA">🔴 Salida (Despacho)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Producto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouse_id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Almacén</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableWarehouses.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No hay almacenes con stock
                          </div>
                        ) : (
                          availableWarehouses.map(w => (
                            <SelectItem key={w.id} value={w.id.toString()}>
                              {w.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => {
                // Calculate max available stock for selected product and origin warehouse if it's a SALIDA
                const maxAvailableStock = useMemo(() => {
                  if (typeWatch !== 'SALIDA' || !productIdWatch || !form.watch('warehouse_id')) return null;
                  const prodIdNum = parseInt(productIdWatch, 10);
                  const warehouseIdNum = parseInt(form.watch('warehouse_id'), 10);
                  const inventoryItem = currentInventory.find(
                    inv => inv.productId === prodIdNum && inv.warehouseId === warehouseIdNum
                  );
                  return inventoryItem ? Number(inventoryItem.stockQuantity) : 0;
                }, [typeWatch, productIdWatch, form.watch('warehouse_id'), currentInventory]);

                return (
                  <FormItem>
                    <div className="flex justify-between items-center mb-1">
                      <FormLabel>Cantidad</FormLabel>
                      {maxAvailableStock !== null && (
                        <span className="text-xs text-muted-foreground font-medium">
                          Disponible: <span className="text-primary">{maxAvailableStock}</span>
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input type="number" placeholder="Ej. 100" {...field} />
                        {maxAvailableStock !== null && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            tabIndex={-1}
                            onClick={() => form.setValue('quantity', maxAvailableStock)}
                          >
                            Máx
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="motive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej. Ingreso por compra a proveedor" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento / Comprobante (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. FAC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Movimiento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterMovementDialog
