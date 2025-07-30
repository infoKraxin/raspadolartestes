"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess?: (user: any, token: string) => void
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    cpf: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        document.body.style.overflow = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "phone") {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, "")

      // Aplica a máscara visual (XX) XXXXX-XXXX
      let formattedValue = numericValue
      if (numericValue.length > 0) {
        formattedValue = numericValue.replace(/^(\d{2})(\d)/g, "($1) $2")
      }
      if (numericValue.length > 6) {
        formattedValue = formattedValue.replace(/^($$\d{2}$$\s)(\d{5})(\d)/g, "$1$2-$3")
      }

      setFormData({
        ...formData,
        [name]: formattedValue,
      })
    } else if (name === "cpf") {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, "")

      // Aplica a máscara visual XXX.XXX.XXX-XX
      let formattedValue = numericValue
      if (numericValue.length > 3) {
        formattedValue = numericValue.replace(/^(\d{3})(\d)/g, "$1.$2")
      }
      if (numericValue.length > 6) {
        formattedValue = formattedValue.replace(/^(\d{3}\.\d{3})(\d)/g, "$1.$2")
      }
      if (numericValue.length > 9) {
        formattedValue = formattedValue.replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/g, "$1-$2")
      }

      setFormData({
        ...formData,
        [name]: formattedValue,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (activeTab === "login") {
        // Placeholder for login logic
      } else {
        // Placeholder for register logic
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    // Placeholder for login logic
  }

  const handleRegister = async () => {
    // Placeholder for register logic
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-neutral-800 border-neutral-700 text-white p-6 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Funcionalidade de Autenticação Removida</h2>
          <p className="text-neutral-400">
            Para rodar o projeto sem API, a autenticação foi desativada. O usuário está sempre "logado" com dados de
            exemplo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
