import { useLogin } from '../hooks/useLogin'
import LoginForm from './LoginForm'
import ForceChangePasswordForm from './ForceChangePasswordForm'

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
    <div className="min-h-screen flex items-center justify-center">
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
    </div>
  )
}

export default LoginPage
