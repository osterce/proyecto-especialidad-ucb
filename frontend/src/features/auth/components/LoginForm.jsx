import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  email: z.string().email('Por favor ingrese un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const LoginForm = ({ onSubmit, loading, error: serverError }) => {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-[26px] font-bold text-gray-900 mb-2 tracking-tight">Bienvenido</h2>
        <p className="text-sm text-gray-500 font-medium">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data.email, data.password))} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="email" className="text-sm font-semibold text-gray-800">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-[18px] w-[18px] text-gray-500" strokeWidth={2} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              {...register('email')}
              className={`flex h-11 w-full rounded-md border bg-white px-3 py-2 pl-10 text-[15px] font-medium text-gray-800 outline-none ring-offset-white placeholder:text-gray-400 placeholder:font-normal focus:border-[#008080] focus:ring-1 focus:ring-[#008080] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
            />
          </div>
          {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2 relative">
          <label htmlFor="password" className="text-sm font-semibold text-gray-800">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-[18px] w-[18px] text-gray-500" strokeWidth={2} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register('password')}
              className={`flex h-11 w-full rounded-md border bg-white px-3 py-2 pl-10 pr-10 text-[15px] font-medium text-gray-800 outline-none ring-offset-white placeholder:text-gray-400 placeholder:font-normal focus:border-[#008080] focus:ring-1 focus:ring-[#008080] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
              )}
            </button>
          </div>
          {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password.message}</span>}
        </div>

        {serverError && (
          <p className="text-[13px] text-red-600 bg-red-50 p-2.5 rounded border border-red-100 font-medium text-center">{serverError}</p>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#008080] hover:bg-[#006666] text-white font-medium h-11 text-[15px] mt-3 transition-colors rounded-md shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
