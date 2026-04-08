import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthRedux } from '@/shared/hooks/useAuthRedux'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'

const RequireAuth = () => {
  const { isAuth, isCheckingAuth } = useAuthRedux()
  const location = useLocation()

  if (isCheckingAuth) {
    return (
      <BaseLayout title='Taskflow' description='Taskflow - Checking session page'>
        <section>
          <div className={baseStyles.container}>
            <div className={baseStyles.content}>
              <h1>Checking session...</h1>
            </div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
