
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from './LoginForm'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-chhapai-gold"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (requiredRole && userProfile && !requiredRole.includes(userProfile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
