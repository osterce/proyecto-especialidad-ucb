import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authService } from '../services/authService'
import { toast } from 'sonner'

const ForceChangePasswordForm = ({ email, currentPassword, onCancel, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones basicas
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      setError('La contraseña debe contener letras y números')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      await authService.activateAccount(email, currentPassword, newPassword, confirmPassword)
      
      toast.success('Cuenta activada', {
        description: 'Tu contraseña ha sido actualizada exitosamente. Por favor inicia sesión.'
      })
      
      onSuccess()
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Cambio de Contraseña Requerido</CardTitle>
        <CardDescription>
          Por motivos de seguridad, debes actualizar tu contraseña antes de continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Cuenta</Label>
            <Input value={email} disabled />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span className="text-xs text-muted-foreground">
              Mínimo 6 caracteres, letras y números.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
              Volver al Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ForceChangePasswordForm
