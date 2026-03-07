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
  IconFolder,
  IconFolderCheck,
  IconFolderOff
} from '@tabler/icons-react'
import { categoryService } from '../services/categoryService'

import CreateCategoryDialog from './CreateCategoryDialog'
import UpdateCategoryDialog from './UpdateCategoryDialog'
import DeactivateCategoryAlert from './DeactivateCategoryAlert'
import ActivateCategoryAlert from './ActivateCategoryAlert'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [categoryToDeactivate, setCategoryToDeactivate] = useState(null)
  const [categoryToActivate, setCategoryToActivate] = useState(null)

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

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredCategories = [...filteredCategories].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedFilteredCategories.length / itemsPerPage)

  const currentItems = sortedFilteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Error al cargar categorías', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return <IconSelector className="ml-1 size-4 opacity-30" />
    return sortConfig.direction === 'asc' 
      ? <IconChevronUp className="ml-1 size-4" />
      : <IconChevronDown className="ml-1 size-4" />
  }

  // KPIs
  const totalCategories = categories.length
  const activeCategories = categories.filter(c => c.isActive).length
  const inactiveCategories = totalCategories - activeCategories

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Categorías</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCategories}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <IconFolder className="size-8 text-slate-700 dark:text-slate-300" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Taxonomía global
            </div>
            <div className="text-muted-foreground">
              Todas las categorías
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Activas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
              {activeCategories}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10">
                <IconFolderCheck className="size-8 text-green-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              En uso
            </div>
            <div className="text-muted-foreground">
              Categorías activas
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactivas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
              {inactiveCategories}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10">
                <IconFolderOff className="size-8 text-red-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Dados de baja
            </div>
            <div className="text-muted-foreground">
              Fuera de uso
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="Buscar por Nombre o Descripción..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
          <IconPlus className="size-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer w-16 text-center select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center justify-center">
                  ID {renderSortIcon('id')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Nombre {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort('description')}>
                <div className="flex items-center">
                  Descripción {renderSortIcon('description')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none w-24" onClick={() => handleSort('isActive')}>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando categorías...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron categorías.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-center text-muted-foreground">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground line-clamp-1">{c.description || 'Sin descripción'}</TableCell>
                  <TableCell>
                    {c.isActive ? (
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
                        <DropdownMenuItem onClick={() => setCategoryToEdit(c)}>
                          <IconEdit className="mr-2 size-4" />
                          Modificar
                        </DropdownMenuItem>
                        {c.isActive ? (
                          <DropdownMenuItem 
                            onClick={() => setCategoryToDeactivate(c)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <IconBan className="mr-2 size-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => setCategoryToActivate(c)}
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
      <CreateCategoryDialog
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={fetchCategories} 
      />

      <UpdateCategoryDialog 
        category={categoryToEdit} 
        onOpenChange={(isOpen) => !isOpen && setCategoryToEdit(null)}
        onSuccess={fetchCategories} 
      />

      <DeactivateCategoryAlert 
        category={categoryToDeactivate} 
        onOpenChange={(isOpen) => !isOpen && setCategoryToDeactivate(null)}
        onSuccess={fetchCategories} 
      />

      <ActivateCategoryAlert 
        category={categoryToActivate} 
        onOpenChange={(isOpen) => !isOpen && setCategoryToActivate(null)}
        onSuccess={fetchCategories} 
      />
    </div>
  )
}

export default CategoriesPage
