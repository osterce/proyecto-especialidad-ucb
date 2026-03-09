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

const TransferStockDialog = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [allWarehouses, setAllWarehouses] = useState([])
  const [currentInventory, setCurrentInventory] = useState([])

  const transferSchema = useMemo(() => {
    return z.object({
      product_id: z.string().min(1, 'Debe seleccionar un producto'),
      from_warehouse_id: z.string().min(1, 'Debe seleccionar el almacén de origen'),
      to_warehouse_id: z.string().min(1, 'Debe seleccionar el almacén de destino'),
      quantity: z.coerce.number().min(1, 'La cantidad no debe ser menor a 1'),
      motive: z.string().min(3, 'El motivo debe tener al menos 3 caracteres'),
    }).refine(data => data.from_warehouse_id !== data.to_warehouse_id, {
      message: "El almacén de origen y destino no pueden ser el mismo",
      path: ["to_warehouse_id"],
    }).superRefine((data, ctx) => {
      if (data.product_id && data.from_warehouse_id) {
        const prodIdNum = parseInt(data.product_id, 10)
        const warehouseIdNum = parseInt(data.from_warehouse_id, 10)
        const inventoryItem = currentInventory.find(
          inv => inv.productId === prodIdNum && inv.warehouseId === warehouseIdNum
        )
        const maxAvailableStock = inventoryItem ? Number(inventoryItem.stockQuantity) : 0
        
        if (data.quantity > maxAvailableStock) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `No se debe incrementar a un número mayor al disponible (${maxAvailableStock})`,
            path: ["quantity"]
          })
        }
      }
    })
  }, [currentInventory])

  const form = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      product_id: '',
      from_warehouse_id: '',
      to_warehouse_id: '',
      quantity: 1,
      motive: '',
    },
  })

  const productIdWatch = form.watch('product_id')
  const fromWarehouseWatch = form.watch('from_warehouse_id')

  useEffect(() => {
    if (open) {
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

  // Origin warehouses are strictly those holding the selected product
  const availableOriginWarehouses = useMemo(() => {
    if (!productIdWatch) return allWarehouses

    const prodIdNum = parseInt(productIdWatch, 10)
    const validWarehouseIds = currentInventory
      .filter(inv => inv.productId === prodIdNum && Number(inv.stockQuantity) > 0)
      .map(inv => inv.warehouseId)

    return allWarehouses.filter(w => validWarehouseIds.includes(w.id))
  }, [allWarehouses, currentInventory, productIdWatch])

  // Destination warehouses should exclude the currently selected origin warehouse
  const availableDestinationWarehouses = useMemo(() => {
    if (!fromWarehouseWatch) return allWarehouses
    return allWarehouses.filter(w => w.id.toString() !== fromWarehouseWatch)
  }, [allWarehouses, fromWarehouseWatch])

  useEffect(() => {
    if (open) {
      form.reset({
        product_id: '',
        from_warehouse_id: '',
        to_warehouse_id: '',
        quantity: 1,
        motive: '',
      })
    }
  }, [open, form])

  const onSubmit = async (values) => {
    try {
      setLoading(true)

      await inventoryService.transferStock(
        values.product_id,
        values.from_warehouse_id,
        values.to_warehouse_id,
        values.quantity,
        values.motive
      )

      toast.success('Traslado completado', { 
        description: 'La mercancía se ha enviado correctamente al almacén destino.' 
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      // Mostrar alerta especial si es saldo insuficiente en el primer paso (origen)
      if (error.message?.toLowerCase().includes('insufficient stock') || error.message?.toLowerCase().includes('stock insuficiente')) {
        toast.error('Inventario insuficiente en origen', {
          description: 'No hay suficiente cantidad en el almacén de origen para realizar este traslado.'
        })
      } else {
        toast.error('Error al registrar traslado', {
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
          <DialogTitle>Trasladar Stock</DialogTitle>
          <DialogDescription>
            Mueve mercancía de un almacén a otro. Esto registrará automáticamente una salida en el origen y una entrada en el destino.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto a Trasladar</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from_warehouse_id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Almacén Origen</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableOriginWarehouses.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No hay stock disponible
                          </div>
                        ) : (
                          availableOriginWarehouses.map(w => (
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

              <FormField
                control={form.control}
                name="to_warehouse_id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Almacén Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDestinationWarehouses.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No hay destinos disponibles
                          </div>
                        ) : (
                          availableDestinationWarehouses.map(w => (
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
                // Calculate max available stock for selected product and origin warehouse
                const maxAvailableStock = useMemo(() => {
                  if (!productIdWatch || !fromWarehouseWatch) return null;
                  const prodIdNum = parseInt(productIdWatch, 10);
                  const warehouseIdNum = parseInt(fromWarehouseWatch, 10);
                  const inventoryItem = currentInventory.find(
                    inv => inv.productId === prodIdNum && inv.warehouseId === warehouseIdNum
                  );
                  return inventoryItem ? Number(inventoryItem.stockQuantity) : 0;
                }, [productIdWatch, fromWarehouseWatch, currentInventory]);

                return (
                  <FormItem>
                    <div className="flex justify-between items-center mb-1">
                      <FormLabel>Cantidad a Mover</FormLabel>
                      {maxAvailableStock !== null && (
                        <span className="text-xs text-muted-foreground font-medium">
                          Disponible: <span className="text-primary">{maxAvailableStock}</span>
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input type="number" placeholder="Ej. 50" {...field} />
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
                  <FormLabel>Motivo u Observaciones</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej. Reubicación estratégica" 
                      className="resize-none" 
                      {...field} 
                    />
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
                Completar Traslado
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default TransferStockDialog
