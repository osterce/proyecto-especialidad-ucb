import { useLogin } from '../hooks/useLogin'
import LoginForm from './LoginForm'
import ForceChangePasswordForm from './ForceChangePasswordForm'
import logo from '@/assets/logo.png'

const LoginPage = () => {
  const { 
    handleSubmit, 
    loading, 
    error, 
    requiresPasswordChange, 
    tempCredentials, 
    setRequiresPasswordChange 
  } = useLogin()

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center mb-6">
        <div className="flex flex-row items-center justify-center mb-4 gap-4 pr-6">
          <img src={logo} alt="Logo UCB" className="h-[70px] object-contain" />
          <span className="text-[75px] leading-none text-gray-900 font-inspiration translate-y-3">Textiles</span>
        </div>
        <span className="text-sm font-semibold text-gray-500 tracking-wide">
          Sistema de Gestión de Inventarios - Postgrado UCB
        </span>
      </div>

      {!requiresPasswordChange ? (
        <LoginForm 
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <ForceChangePasswordForm 
          email={tempCredentials?.email}
          currentPassword={tempCredentials?.password}
          onCancel={() => setRequiresPasswordChange(false)}
          onSuccess={() => {
            // Upon successful activation they can login right away with new password
            setRequiresPasswordChange(false)
          }}
        />
      )}

      <div className="mt-8 text-center text-xs font-medium text-gray-500 uppercase tracking-widest max-w-md">
        © 2026 Universidad Católica Boliviana - La Paz.<br className="hidden sm:block" /> Todos los derechos reservados.
      </div>
    </div>
  )
}

export default LoginPage
