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
  IconBuildingWarehouse,
  IconBuilding,
  IconBuildingOff
} from '@tabler/icons-react'
import { warehouseService } from '../services/warehouseService'

import CreateWarehouseDialog from './CreateWarehouseDialog'
import UpdateWarehouseDialog from './UpdateWarehouseDialog'
import DeactivateWarehouseAlert from './DeactivateWarehouseAlert'
import ActivateWarehouseAlert from './ActivateWarehouseAlert'

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [warehouseToEdit, setWarehouseToEdit] = useState(null)
  const [warehouseToDeactivate, setWarehouseToDeactivate] = useState(null)
  const [warehouseToActivate, setWarehouseToActivate] = useState(null)

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

  const filteredWarehouses = warehouses.filter(w => 
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredWarehouses = [...filteredWarehouses].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedFilteredWarehouses.length / itemsPerPage)

  const currentItems = sortedFilteredWarehouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const data = await warehouseService.getWarehouses()
      setWarehouses(data)
    } catch (error) {
      toast.error('Error al cargar almacenes', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return <IconSelector className="ml-1 size-4 opacity-30" />
    return sortConfig.direction === 'asc' 
      ? <IconChevronUp className="ml-1 size-4" />
      : <IconChevronDown className="ml-1 size-4" />
  }

  // KPIs
  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter(w => w.isActive).length
  const inactiveWarehouses = totalWarehouses - activeWarehouses

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Almacenes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalWarehouses}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <IconBuildingWarehouse className="size-8 text-slate-700 dark:text-slate-300" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Almacenamiento global
            </div>
            <div className="text-muted-foreground">
              Todos los almacenes registrados
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Activos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
              {activeWarehouses}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10">
                <IconBuilding className="size-8 text-green-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Operativos
            </div>
            <div className="text-muted-foreground">
              Disponibles para transacciones
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactivos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
              {inactiveWarehouses}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10">
                <IconBuildingOff className="size-8 text-red-600" stroke={2} />
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
            placeholder="Buscar por nombre o ubicación..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
          <IconPlus className="size-4" />
          Nuevo Almacén
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center">
                  ID {renderSortIcon('id')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Nombre {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort('location')}>
                <div className="flex items-center">
                  Ubicación {renderSortIcon('location')}
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Descripción</TableHead>
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
                  Cargando almacenes...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron almacenes.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-xs">{w.id}</TableCell>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {w.location || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {w.description || '-'}
                  </TableCell>
                  <TableCell>
                    {w.isActive ? (
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
                        <DropdownMenuItem onClick={() => setWarehouseToEdit(w)}>
                          <IconEdit className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        {w.isActive ? (
                          <DropdownMenuItem 
                            onClick={() => setWarehouseToDeactivate(w)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <IconBan className="mr-2 size-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => setWarehouseToActivate(w)}
                            className="text-green-600 focus:bg-green-100 focus:text-green-700"
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

      {/* Dialogs placeholders - implementation incoming */}
      {isCreateOpen && (
        <CreateWarehouseDialog
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen} 
          onSuccess={fetchWarehouses} 
        />
      )}

      {warehouseToEdit && (
        <UpdateWarehouseDialog 
          warehouse={warehouseToEdit} 
          onOpenChange={(isOpen) => !isOpen && setWarehouseToEdit(null)}
          onSuccess={fetchWarehouses} 
        />
      )}

      {warehouseToDeactivate && (
        <DeactivateWarehouseAlert 
          warehouse={warehouseToDeactivate} 
          onOpenChange={(isOpen) => !isOpen && setWarehouseToDeactivate(null)}
          onSuccess={fetchWarehouses} 
        />
      )}

      {warehouseToActivate && (
        <ActivateWarehouseAlert 
          warehouse={warehouseToActivate} 
          onOpenChange={(isOpen) => !isOpen && setWarehouseToActivate(null)}
          onSuccess={fetchWarehouses} 
        />
      )}
    </div>
  )
}

export default WarehousesPage
