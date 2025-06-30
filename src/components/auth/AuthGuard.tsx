
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from './LoginForm'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    console.log('AuthGuard: Current state', { 
      user: user?.id, 
      userProfile: userProfile?.role, 
      loading,
      path: location.pathname 
    })
  }, [user, userProfile, loading, location])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chhapai-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('AuthGuard: No user, showing login form')
    return <LoginForm />
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chhapai-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Check role-based access
  if (requiredRole && requiredRole.length > 0) {
    const hasRequiredRole = requiredRole.includes(userProfile.role)
    console.log('AuthGuard: Role check', { 
      userRole: userProfile.role, 
      requiredRole, 
      hasAccess: hasRequiredRole 
    })
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-2">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500">
              Required role: {requiredRole.join(' or ')} | Your role: {userProfile.role}
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 px-4 py-2 bg-chhapai-gold text-chhapai-black rounded hover:bg-chhapai-gold-dark transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )
    }
  }

  console.log('AuthGuard: Access granted, rendering children')
  return <>{children}</>
}
