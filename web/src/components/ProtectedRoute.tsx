import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@shared/providers/AuthProvider'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

export default ProtectedRoute
