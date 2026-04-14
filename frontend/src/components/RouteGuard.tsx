import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../types'

interface Props {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function RouteGuard({ children, allowedRoles }: Props) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <div className="text-gray-700 font-medium">Access Denied</div>
          <div className="text-gray-400 text-sm mt-1">
            You do not have permission to view this page.
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
