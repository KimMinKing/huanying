import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getSession as getAdminSession } from '../lib/adminAuth'
import { getSession as getCustomerSession } from '../lib/customerAuth'

export function RequireCustomerAuth() {
  const location = useLocation()
  const session = getCustomerSession()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function RedirectCustomerAuth() {
  const session = getCustomerSession()

  if (session) {
    return <Navigate to="/my" replace />
  }

  return <Outlet />
}

export function RequireAdminAuth() {
  const location = useLocation()
  const session = getAdminSession()

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function RedirectAdminAuth() {
  const session = getAdminSession()

  if (session) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
