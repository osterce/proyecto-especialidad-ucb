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
import { IconDotsVertical, IconPlus, IconShield, IconBan, IconUserCheck } from '@tabler/icons-react'
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

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <IconPlus className="size-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
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
