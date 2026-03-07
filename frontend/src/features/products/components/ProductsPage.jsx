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
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  IconDotsVertical, 
  IconPlus, 
  IconEdit, 
  IconBan, 
  IconCheck, 
  IconChevronUp, 
  IconChevronDown, 
  IconSelector,
  IconBox,
  IconFolderCheck,
  IconBoxOff
} from '@tabler/icons-react'
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

  // Filter, Sort & Pagination States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' })
  const itemsPerPage = 7

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0
    const key = sortConfig.key

    let aValue = a[key]
    let bValue = b[key]

    // Convert strings to lowercase for case-insensitive comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedFilteredProducts.length / itemsPerPage)

  const currentItems = sortedFilteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return <IconSelector className="ml-1 size-4 opacity-30" />
    return sortConfig.direction === 'asc' 
      ? <IconChevronUp className="ml-1 size-4" />
      : <IconChevronDown className="ml-1 size-4" />
  }

  // KPIs
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.isActive).length
  const inactiveProducts = totalProducts - activeProducts

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Productos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalProducts}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <IconBox className="size-8 text-slate-700 dark:text-slate-300" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Inventario global
            </div>
            <div className="text-muted-foreground">
              Todos los productos registrados
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Activos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
              {activeProducts}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10">
                <IconFolderCheck className="size-8 text-green-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Disponibles para venta
            </div>
            <div className="text-muted-foreground">
              Productos activos y listados
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactivos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
              {inactiveProducts}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10">
                <IconBoxOff className="size-8 text-red-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Dados de baja
            </div>
            <div className="text-muted-foreground">
              Fuera de disponibilidad
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="Buscar por Nombre o SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
          <IconPlus className="size-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('sku')}>
                <div className="flex items-center">
                  SKU {renderSortIcon('sku')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Nombre {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('unitPrice')}>
                <div className="flex items-center">
                  Precio (Bs.) {renderSortIcon('unitPrice')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('minStock')}>
                <div className="flex items-center">
                  Mín. Stock {renderSortIcon('minStock')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('isActive')}>
                <div className="flex items-center">
                  Estado {renderSortIcon('isActive')}
                </div>
              </TableHead>
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
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((p) => (
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

      {totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }} 
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(i + 1)
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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
