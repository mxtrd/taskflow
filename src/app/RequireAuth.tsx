import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

const RequireAuth = () => {
  const { isAuth, isCheckingAuth } = useAuth()
  const location = useLocation()

  if (isCheckingAuth) {
    return <div>Checking session...</div>
  }

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
