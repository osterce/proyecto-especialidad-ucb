import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical, IconPlus, IconEdit, IconBan, IconCheck } from '@tabler/icons-react'
import { productService } from '../services/productService'

import CreateProductDialog from './CreateProductDialog'
import UpdateProductDialog from './UpdateProductDialog'
import DeactivateProductAlert from './DeactivateProductAlert'
import ActivateProductAlert from './ActivateProductAlert'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [productToDeactivate, setProductToDeactivate] = useState(null)
  const [productToActivate, setProductToActivate] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data)
    } catch (error) {
      toast.error('Error al cargar productos', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <IconPlus className="size-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio (Bs.)</TableHead>
              <TableHead>Mín. Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{Number(p.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>{p.minStock}</TableCell>
                  <TableCell>
                    {p.isActive ? (
                      <Badge variant="outline" className="text-green-600 bg-green-50">Activo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 bg-red-50">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="size-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setProductToEdit(p)}>
                          <IconEdit className="mr-2 size-4" />
                          Modificar
                        </DropdownMenuItem>
                        {p.isActive ? (
                          <DropdownMenuItem 
                            onClick={() => setProductToDeactivate(p)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <IconBan className="mr-2 size-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => setProductToActivate(p)}
                            className="text-green-600 focus:bg-green-50 focus:text-green-700"
                          >
                            <IconCheck className="mr-2 size-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <CreateProductDialog
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={fetchProducts} 
      />

      <UpdateProductDialog 
        product={productToEdit} 
        onOpenChange={(isOpen) => !isOpen && setProductToEdit(null)}
        onSuccess={fetchProducts} 
      />

      <DeactivateProductAlert 
        product={productToDeactivate} 
        onOpenChange={(isOpen) => !isOpen && setProductToDeactivate(null)}
        onSuccess={fetchProducts} 
      />

      <ActivateProductAlert 
        product={productToActivate} 
        onOpenChange={(isOpen) => !isOpen && setProductToActivate(null)}
        onSuccess={fetchProducts} 
      />
    </div>
  )
}

export default ProductsPage
