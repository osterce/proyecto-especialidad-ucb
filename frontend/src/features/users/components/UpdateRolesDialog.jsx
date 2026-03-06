import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { userService } from '../services/userService'

const AVAILABLE_ROLES = [
  { id: 'ADMIN_ROLE', label: 'Administrador' },
  { id: 'WAREHOUSE_ROLE', label: 'Personal de Almacén' },
  { id: 'USER_ROLE', label: 'Usuario Estándar' },
]

export default function UpdateRolesDialog({ user, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState([])

  // Load user roles when dialog opens
  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles || [])
    }
  }, [user])

  const handleRoleToggle = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(r => r !== roleId)
      } else {
        return [...prev, roleId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedRoles.length === 0) {
      toast.error('El usuario debe tener al menos un rol asignado')
      return
    }

    try {
      setLoading(true)
      await userService.updateUserRoles(user.id, selectedRoles)
      toast.success('Roles actualizados', {
        description: `Los roles de ${user.name} se han actualizado correctamente.`
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar roles', {
        description: error.message || 'Intente nuevamente más tarde.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Si no hay usuario seleccionado, el modal está cerrado, pero evitamos crasheos
  if (!user) return null

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modificar Roles</DialogTitle>
            <DialogDescription>
              Asigna o revoca los permisos para <strong>{user.name}</strong> ({user.email}).
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label>Roles Asignados</Label>
              <div className="grid gap-2 border rounded-md p-3">
                {AVAILABLE_ROLES.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-role-${role.id}`}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <Label htmlFor={`edit-role-${role.id}`} className="font-normal cursor-pointer">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
