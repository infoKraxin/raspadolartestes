"use client"

import type React from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { Poppins } from "next/font/google"
import { ArrowLeft, Mail, Wallet, Package, LogOut, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/AuthContext"
import { getAppGradient } from "@/lib/colors"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const { user, logout } = useAuth() // Usar o user do contexto mockado

  const handleBackClick = () => {
    router.push("/")
  }

  const handleLogoutClick = () => {
    logout()
    router.push("/")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Se o usuário não estiver "logado" (mesmo que mockado), redireciona
  if (!user) {
    return (
      <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-neutral-400">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <Button
          onClick={handleBackClick}
          variant="outline"
          className="mb-4 sm:mb-6 bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
            Meu Perfil
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">Gerencie suas informações e saldo</p>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-lg">
              <Image
                src="/memojis/male-1.png" // Imagem de perfil mockada
                alt="Avatar do Usuário"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-neutral-400 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="w-3 h-3" /> Membro desde: {formatDate(user.created_at || new Date().toISOString())}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Wallet Balance */}
            <div className="bg-neutral-700/50 rounded-lg p-4 flex items-center gap-4 border border-neutral-600">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Saldo Atual</p>
                <p className="text-white text-lg font-bold">{formatCurrency(user.wallet?.[0]?.balance || 0)}</p>
              </div>
            </div>

            {/* Inventory Link */}
            <div className="bg-neutral-700/50 rounded-lg p-4 flex items-center gap-4 border border-neutral-600">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Meus Prêmios</p>
                <Button
                  variant="link"
                  onClick={() => router.push("/v1/profile/inventory")}
                  className="p-0 h-auto text-yellow-400 hover:text-yellow-300 text-base font-bold"
                >
                  Ver Inventário
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => router.push("/v1/profile/deposit")}
              className={`${getAppGradient()} text-white flex-1 py-2.5 sm:py-3 rounded-lg text-base font-semibold`}
            >
              Depositar
            </Button>
            <Button
              onClick={handleLogoutClick}
              variant="outline"
              className="flex-1 bg-neutral-700 border-neutral-600 text-red-400 hover:bg-red-500/20 hover:text-red-300 py-2.5 sm:py-3 rounded-lg text-base font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePage
