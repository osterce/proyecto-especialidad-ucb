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
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardFooter } from '@/components/ui/card'
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
  IconShield, 
  IconBan, 
  IconUserCheck,
  IconChevronUp, 
  IconChevronDown, 
  IconSelector,
  IconUsers,
  IconUserShield,
  IconUserOff
} from '@tabler/icons-react'
import { userService } from '../services/userService'

import CreateUserDialog from './CreateUserDialog'
import UpdateRolesDialog from './UpdateRolesDialog'
import DeactivateUserAlert from './DeactivateUserAlert'
import ActivateUserAlert from './ActivateUserAlert'

const ROLE_LABELS = {
  'ADMIN_ROLE': 'Administrador',
  'USER_ROLE': 'Usuario Std',
  'WAREHOUSE_ROLE': 'Almacén',
}

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [userToEditRoles, setUserToEditRoles] = useState(null)
  const [userToDeactivate, setUserToDeactivate] = useState(null)
  const [userToActivate, setUserToActivate] = useState(null)

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

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0
    let key = sortConfig.key

    let aValue = a[key]
    let bValue = b[key]

    // Convert strings to lowercase for case-insensitive comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedFilteredUsers.length / itemsPerPage)

  const currentItems = sortedFilteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Error al cargar usuarios', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return <IconSelector className="ml-1 size-4 opacity-30" />
    return sortConfig.direction === 'asc' 
      ? <IconChevronUp className="ml-1 size-4" />
      : <IconChevronDown className="ml-1 size-4" />
  }

  // KPIs
  const totalUsers = users.length
  const inactiveUsers = users.filter(u => !u.isActive).length
  const adminUsers = users.filter(u => u.isActive && u.roles?.includes('ADMIN_ROLE')).length

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Usuarios</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <IconUsers className="size-8 text-slate-700 dark:text-slate-300" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Gestión global
            </div>
            <div className="text-muted-foreground">
              Todos los usuarios registrados
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Administradores</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-indigo-600">
              {adminUsers}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <IconUserShield className="size-8 text-indigo-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Control total
            </div>
            <div className="text-muted-foreground">
              Usuarios con rol de administrador
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactivos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
              {inactiveUsers}
            </CardTitle>
            <CardAction>
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10">
                <IconUserOff className="size-8 text-red-600" stroke={2} />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Dados de baja
            </div>
            <div className="text-muted-foreground">
              Cuentas sin acceso al sistema
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="Buscar por Nombre o Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
          <IconPlus className="size-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center">
                  ID {renderSortIcon('id')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Nombre {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('email')}>
                <div className="flex items-center">
                  Email {renderSortIcon('email')}
                </div>
              </TableHead>
              <TableHead>Roles</TableHead>
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
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {u.roles?.map(role => (
                        <Badge key={role} variant="secondary">
                          {ROLE_LABELS[role] || role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.isActive ? (
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
                        <DropdownMenuItem onClick={() => setUserToEditRoles(u)}>
                          <IconShield className="mr-2 size-4" />
                          Modificar Roles
                        </DropdownMenuItem>
                        {u.isActive ? (
                          <DropdownMenuItem 
                            onClick={() => setUserToDeactivate(u)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <IconBan className="mr-2 size-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => setUserToActivate(u)}
                            className="text-green-600 focus:bg-green-50 focus:text-green-700"
                          >
                            <IconUserCheck className="mr-2 size-4" />
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
      <CreateUserDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={fetchUsers} 
      />

      <UpdateRolesDialog 
        user={userToEditRoles} 
        onOpenChange={(isOpen) => !isOpen && setUserToEditRoles(null)}
        onSuccess={fetchUsers} 
      />

      <DeactivateUserAlert 
        user={userToDeactivate} 
        onOpenChange={(isOpen) => !isOpen && setUserToDeactivate(null)}
        onSuccess={fetchUsers} 
      />

      <ActivateUserAlert 
        user={userToActivate} 
        onOpenChange={(isOpen) => !isOpen && setUserToActivate(null)}
        onSuccess={fetchUsers} 
      />
    </div>
  )
}

export default UsersPage
