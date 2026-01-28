import { createContext } from "react"

export type User = {
  id: number
  name: string
  email: string
  role: 'cliente' | 'admin' | 'suporte'
}

export type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, userData: User) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)