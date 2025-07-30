"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Interfaces simplificadas para o contexto de autenticação sem API
interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  wallet: {
    id: string
    userId: string
    balance: number
    created_at: string
    updated_at: string
  }[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula o carregamento do usuário (sempre um usuário mockado)
    const mockUser: User = {
      id: "mock-user-123",
      name: "Usuário Teste",
      email: "teste@example.com",
      role: "ADMIN", // Ou 'USER' para testar diferentes roles
      wallet: [
        {
          id: "mock-wallet-456",
          userId: "mock-user-123",
          balance: 1500.75, // Saldo de exemplo
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    }
    setUser(mockUser)
    setToken("mock-token-abc") // Token de exemplo
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Não faz nada, pois a autenticação via API foi removida
    console.log("Login simulado para:", email)
  }

  const logout = () => {
    // Não faz nada, pois a autenticação via API foi removida
    console.log("Logout simulado")
  }

  const register = async (name: string, email: string, password: string) => {
    // Não faz nada, pois a autenticação via API foi removida
    console.log("Registro simulado para:", name, email)
  }

  const updateUser = (userData: Partial<User>) => {
    // Atualiza o usuário mockado localmente
    setUser((prevUser) => {
      if (!prevUser) return null
      return {
        ...prevUser,
        ...userData,
        wallet: userData.wallet || prevUser.wallet, // Garante que a carteira seja atualizada se fornecida
      }
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
