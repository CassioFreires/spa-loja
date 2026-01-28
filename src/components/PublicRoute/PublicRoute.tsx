import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

type PrivateRouteProps = {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isLoggedIn = localStorage.getItem('token')

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}
