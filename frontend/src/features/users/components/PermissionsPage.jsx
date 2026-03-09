import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { usePermissions } from '@/context/PermissionsContext'
import { ALL_NAV_ITEMS } from '@/config/navItems'

const roleOptions = [
  { value: 'ADMIN_ROLE', label: 'Administrador' },
  { value: 'WAREHOUSE_ROLE', label: 'Almacén' },
  { value: 'USER_ROLE', label: 'Usuario estándar' },
]

export default function PermissionsPage() {
  const { rolePermissions, saveRolePermissions } = usePermissions()
  const [selectedRole, setSelectedRole] = useState(roleOptions[0].value)
  const [currentSelection, setCurrentSelection] = useState([])

  // Cuando cambia el rol seleccionado, cargamos sus permisos actuales
  useEffect(() => {
    setCurrentSelection(rolePermissions[selectedRole] || [])
  }, [selectedRole, rolePermissions])

  const handleToggle = (moduleId, checked) => {
    setCurrentSelection((prev) => {
      if (checked) {
        return [...prev, moduleId]
      } else {
        return prev.filter((id) => id !== moduleId)
      }
    })
  }

  const handleSave = () => {
    const updatedPermissions = {
      ...rolePermissions,
      [selectedRole]: currentSelection,
    }
    saveRolePermissions(updatedPermissions)
    toast.success('Permisos actualizados', {
      description: `Se han guardado los permisos para el rol seleccionado.`,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Permisos de Acceso</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Rol de Usuario</CardTitle>
            <CardDescription>
              Selecciona el rol para configurar su acceso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label>Rol</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibilidad del menú</CardTitle>
            <CardDescription>
              Activa o desactiva los módulos que deseas mostrar en la barra lateral.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {ALL_NAV_ITEMS.map((module) => {
                const Icon = module.icon
                const isEnabled = currentSelection.includes(module.id)

                return (
                  <div
                    key={module.id}
                    className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">
                          {module.title}
                        </Label>
                        {module.items && (
                          <p className="text-sm text-muted-foreground">
                            Incluye {module.items.length} sub-secciones
                          </p>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggle(module.id, checked)}
                    />
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSave}>Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
