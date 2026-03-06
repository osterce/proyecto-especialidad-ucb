import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { userService } from '../services/userService'

const AVAILABLE_ROLES = [
  { id: 'ADMIN_ROLE', label: 'Administrador' },
  { id: 'WAREHOUSE_ROLE', label: 'Personal de Almacén' },
  { id: 'USER_ROLE', label: 'Usuario Estándar' },
]

export default function CreateUserDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: ['USER_ROLE'], // Default role
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRoleToggle = (roleId) => {
    setFormData(prev => {
      const roles = prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
      return { ...prev, roles }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.roles.length === 0) {
      toast.error('Debe seleccionar al menos un rol')
      return
    }

    try {
      setLoading(true)
      await userService.createUser(formData)
      toast.success('Usuario creado', {
        description: `El usuario ${formData.name} fue registrado con éxito.`
      })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setFormData({ name: '', email: '', password: '', roles: ['USER_ROLE'] })
    } catch (error) {
      toast.error('Error al crear usuario', {
        description: error.message || 'Verifica los datos y vuelve a intentar.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Crea una cuenta nueva y asígnale los roles correspondientes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña temporal</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Label>Roles Asignados</Label>
              <div className="grid gap-2 border rounded-md p-3">
                {AVAILABLE_ROLES.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formData.roles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <Label htmlFor={`role-${role.id}`} className="font-normal cursor-pointer">
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
              {loading ? 'Guardando...' : 'Guardar Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
