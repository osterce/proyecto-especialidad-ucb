import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
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
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { 
  IconChevronUp, 
  IconChevronDown, 
  IconSelector,
  IconArrowDownRight,
  IconArrowUpRight,
  IconFilter
} from '@tabler/icons-react'

import { inventoryService } from '../services/inventoryService'

const MovementsHistoryPage = () => {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })
  const itemsPerPage = 8

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (typeFilter !== 'ALL') filters.type = typeFilter
      if (fromDate) filters.from = fromDate
      if (toDate) filters.to = toDate

      const data = await inventoryService.getMovements(filters)
      setMovements(data)
    } catch (error) {
      toast.error('Error al cargar movimientos', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovements()
  }, [typeFilter, fromDate, toDate]) // Refetch when API filters change

  const filteredMovements = movements.filter(m => 
    m.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredMovements = [...filteredMovements].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedFilteredMovements.length / itemsPerPage)

  const currentItems = sortedFilteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return <IconSelector className="ml-1 size-4 opacity-30" />
    return sortConfig.direction === 'asc' 
      ? <IconChevronUp className="ml-1 size-4" />
      : <IconChevronDown className="ml-1 size-4" />
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Historial de Movimientos</h1>
        <p className="text-muted-foreground">Consulta el registro detallado de entradas y salidas de inventario.</p>
      </div>

      <div className="flex flex-col lg:flex-row items-end justify-between gap-4 p-4 border rounded-md bg-slate-50/50 dark:bg-slate-900/50">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full lg:w-auto gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium px-1">Tipo de Movimiento</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los tipos</SelectItem>
                <SelectItem value="ENTRADA">Entradas</SelectItem>
                <SelectItem value="SALIDA">Salidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium px-1">Desde</label>
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium px-1">Hasta</label>
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full lg:w-auto mt-4 lg:mt-0 lg:ml-auto">
          <Input 
            placeholder="Buscar en resultados..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background min-w-[250px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Tipo</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center">
                  Fecha {renderSortIcon('createdAt')}
                </div>
              </TableHead>
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
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="hidden lg:table-cell">Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Cargando historial...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron movimientos registrados en este periodo.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((m) => {
                const isEntrada = m.type === 'ENTRADA'
                
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      {isEntrada ? (
                        <div className="flex items-center text-green-600 font-medium">
                          <IconArrowDownRight className="mr-1 size-4" />
                          Entrada
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 font-medium">
                          <IconArrowUpRight className="mr-1 size-4" />
                          Salida
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(m.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="font-medium">{m.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{m.warehouseName}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {isEntrada ? '+' : '-'}{m.quantity}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground truncate max-w-[200px]">
                      {m.notes}
                      {m.reference && <span className="block text-xs mt-0.5 opacity-70">Doc: {m.reference}</span>}
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
    </div>
  )
}

export default MovementsHistoryPage
