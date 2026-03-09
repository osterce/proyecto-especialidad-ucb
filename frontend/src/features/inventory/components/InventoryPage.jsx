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
import { Card, CardFooter, CardHeader, CardTitle, CardAction, CardDescription } from '@/components/ui/card'
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
  IconPlus, 
  IconExchange, 
  IconChevronUp, 
  IconChevronDown, 
  IconSelector,
  IconPackages,
  IconAlertTriangle
} from '@tabler/icons-react'
import { inventoryService } from '../services/inventoryService'

import RegisterMovementDialog from './RegisterMovementDialog'
import TransferStockDialog from './TransferStockDialog'

const InventoryPage = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  // Filter, Sort & Pagination States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'productName', direction: 'asc' })
  const itemsPerPage = 7

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredInventory = inventory.filter(item => 
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredInventory = [...filteredInventory].sort((a, b) => {
    if (!sortConfig.key) return 0
    const key = sortConfig.key

    let aValue = a[key]
    let bValue = b[key]

    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedFilteredInventory.length / itemsPerPage)

  const currentItems = sortedFilteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getInventory()
      setInventory(data)
    } catch (error) {
      toast.error('Error al cargar inventario', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return <IconSelector className="ml-1 size-4 opacity-30" />
    return sortConfig.direction === 'asc' 
      ? <IconChevronUp className="ml-1 size-4" />
      : <IconChevronDown className="ml-1 size-4" />
  }

  // KPIs
  const totalStock = inventory.reduce((acc, item) => acc + Number(item.stockQuantity), 0)
  const lowStockItems = inventory.filter(item => Number(item.stockQuantity) <= Number(item.minStock)).length

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Stock Físico Total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-600">
              {totalStock.toLocaleString()}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-800/20">
                <IconPackages className="size-8 text-blue-600 dark:text-blue-400" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Volumen global
            </div>
            <div className="text-muted-foreground">
              Unidades físicas disponibles
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Alertas de Stock</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {lowStockItems}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10">
                <IconAlertTriangle className="size-8 text-orange-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Bajo mínimo
            </div>
            <div className="text-muted-foreground">
              Productos que requieren reabastecimiento
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="Buscar por producto o almacén..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsRegisterOpen(true)} className="gap-2 flex-1 sm:flex-none">
            <IconPlus className="size-4" />
            Movimiento
          </Button>
          <Button onClick={() => setIsTransferOpen(true)} variant="secondary" className="gap-2 flex-1 sm:flex-none">
            <IconExchange className="size-4" />
            Trasladar Stock
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('productName')}>
                <div className="flex items-center">
                  Producto {renderSortIcon('productName')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('warehouseName')}>
                <div className="flex items-center">
                  Almacén {renderSortIcon('warehouseName')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('stockQuantity')}>
                <div className="flex items-center justify-end">
                  Cantidad {renderSortIcon('stockQuantity')}
                </div>
              </TableHead>
              <TableHead className="text-right">Stock Mínimo</TableHead>
              <TableHead className="w-[120px] text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando inventario...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay inventario registrado.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((item) => {
                const isLowStock = Number(item.stockQuantity) <= Number(item.minStock)
                return (
                  <TableRow key={`${item.productId}-${item.warehouseId}`}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.warehouseName}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">{item.stockQuantity}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">{item.minStock}</TableCell>
                    <TableCell className="text-center">
                      {isLowStock ? (
                        <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                          Bajo Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
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
      {isRegisterOpen && (
        <RegisterMovementDialog
          open={isRegisterOpen} 
          onOpenChange={setIsRegisterOpen} 
          onSuccess={fetchInventory} 
        />
      )}

      {isTransferOpen && (
        <TransferStockDialog 
          open={isTransferOpen}
          onOpenChange={setIsTransferOpen}
          onSuccess={fetchInventory} 
        />
      )}
    </div>
  )
}

export default InventoryPage
