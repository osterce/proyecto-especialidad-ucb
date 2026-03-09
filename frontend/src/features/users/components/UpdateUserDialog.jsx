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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { userService } from '../services/userService'

const AVAILABLE_ROLES = [
  { id: 'ADMIN_ROLE', label: 'Administrador' },
  { id: 'WAREHOUSE_ROLE', label: 'Personal de Almacén' },
  { id: 'USER_ROLE', label: 'Usuario Estándar' },
]

export default function UpdateUserDialog({ user, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showResetAlert, setShowResetAlert] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: []
  })

  // Load user data when dialog opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        roles: user.roles || []
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleToggle = (roleId) => {
    setFormData(prev => {
      const roles = prev.roles
      if (roles.includes(roleId)) {
        return { ...prev, roles: roles.filter(r => r !== roleId) }
      } else {
        return { ...prev, roles: [...roles, roleId] }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || formData.name.length < 2) {
      toast.error('Nombre inválido', { description: 'El nombre debe tener al menos 2 caracteres.' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido', { description: 'Por favor, ingrese un email válido.' })
      return
    }

    if (formData.roles.length === 0) {
      toast.error('Roles requeridos', { description: 'El usuario debe tener al menos un rol asignado.' })
      return
    }

    try {
      setLoading(true)
      
      const updateDataPromises = []
      
      // Update Name & Email
      if (formData.name !== user.name || formData.email !== user.email) {
        updateDataPromises.push(userService.updateUser(user.id, { name: formData.name, email: formData.email }))
      }

      // Update Roles
      // Se podria optimizar comparando los arrays pero por seguridad lo enviamos
      updateDataPromises.push(userService.updateUserRoles(user.id, formData.roles))

      await Promise.all(updateDataPromises)

      toast.success('Usuario actualizado', {
        description: `La información de ${formData.name} se ha actualizado correctamente.`
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar usuario', {
        description: error.message || 'Intente nuevamente más tarde.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    try {
      setResetLoading(true)
      await userService.resetPassword(user.id)
      toast.success('Contraseña restablecida', {
        description: `La contraseña se ha establecido a 123456. El usuario deberá cambiarla al iniciar sesión.`
      })
      
      // Update local state without closing the dialog or refresh main view to reflect status inactive
      setShowResetAlert(false)
      onSuccess() 
      onOpenChange(false)
    } catch (error) {
       toast.error('Error al restablecer contraseña', {
        description: error.message || 'No se pudo restablecer la contraseña.'
      })
    } finally {
      setResetLoading(false)
    }
  }

  // Si no hay usuario seleccionado, el modal está cerrado, pero evitamos crasheos
  if (!user) return null

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza los datos personales y roles para <strong>{user.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del empleado"
                disabled={loading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Roles Asignados</Label>
              <div className="grid gap-2 border rounded-md p-3">
                {AVAILABLE_ROLES.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-role-${role.id}`}
                      checked={formData.roles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                      disabled={loading}
                    />
                    <Label htmlFor={`edit-role-${role.id}`} className="font-normal cursor-pointer">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
            <Button 
               type="button" 
               variant="destructive" 
               onClick={() => setShowResetAlert(true)} 
               disabled={loading || resetLoading}
               className="mr-auto text-xs"
            >
               {resetLoading ? 'Restableciendo...' : 'Reset Password'}
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Alert Dialog for Reset Password */}
      <AlertDialog open={showResetAlert} onOpenChange={setShowResetAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar contraseña?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Desea restaurar la clave de este usuario a 123456? El usuario será desactivado temporalmente y deberá configurar una nueva clave al intentar loguearse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleResetPassword()
              }}
              disabled={resetLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {resetLoading ? 'Restaurando...' : 'Sí, restaurar clave'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
