"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { Poppins } from "next/font/google"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { User } from "lucide-react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

interface UserDetails {
  id: string
  email: string
  phone: string
  cpf: string
  username: string
  full_name: string
  is_admin: boolean
  total_scratchs: number
  total_wins: number
  total_losses: number
  total_deposit: string
  total_withdraw: string
  inviteCode: {
    code: string
    commission_rate: string
    total_invites: number
    total_commission: string
  } | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  invitedBy: string | null
  wallet: Array<{
    balance: string
    bonus: string
    commission: string
    rollover: string
  }>
  deposits: any[]
  withdraws: any[]
  games: any[]
  invitedUsers: any[]
  inviter: {
    id: string
    username: string
  } | null
}

export default function UserDetailsPage() {
  const router = useRouter()
  const { id } = router.query
  const { token } = useAuth()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [commissionRate, setCommissionRate] = useState("")
  const [commissionLoading, setCommissionLoading] = useState(false)
  const [commissionError, setCommissionError] = useState("")

  const fetchUserDetails = async () => {
    if (!token || !id) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://api.raspapixoficial.com/v1/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar detalhes do usuário")
      }

      setUserDetails(data.data)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUserDetails()
    }
  }, [id, token])

  const formatCurrency = (value: string) => {
    const numValue = Number.parseFloat(value)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  const formatCPF = (cpf: string) => {
    if (!cpf) return "Não informado"
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (isAdmin: boolean) => {
    return isAdmin
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-green-500/10 text-green-400 border-green-500/20"
  }

  const getStatusText = (isAdmin: boolean) => {
    return isAdmin ? "Admin" : "Usuário"
  }

  const handleContact = () => {
    toast.info("Funcionalidade de contato em desenvolvimento")
  }

  const handleManageBalance = () => {
    toast.info("Funcionalidade de gerenciar saldo em desenvolvimento")
  }

  const handleLink = () => {
    toast.info("Funcionalidade de vincular em desenvolvimento")
  }

  const handleLocateIP = () => {
    toast.info("Funcionalidade de localizar IP em desenvolvimento")
  }

  const handleOpenCommissionModal = () => {
    setCommissionRate(userDetails?.inviteCode?.commission_rate || "")
    setCommissionError("")
    setIsCommissionModalOpen(true)
  }

  const handleCloseCommissionModal = () => {
    setIsCommissionModalOpen(false)
    setCommissionRate("")
    setCommissionError("")
  }

  const handleSaveCommission = async () => {
    if (!token || !userDetails) return
    const rate = Number.parseFloat(commissionRate.replace(",", "."))
    if (isNaN(rate) || rate < 0) {
      setCommissionError("Informe uma comissão válida.")
      return
    }
    setCommissionLoading(true)
    setCommissionError("")
    try {
      const response = await fetch("https://api.raspapixoficial.com/v1/api/admin/affiliates/edit-commission", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails.id,
          commission_rate: rate,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar comissão")
      }
      toast.success("Comissão atualizada com sucesso!")
      handleCloseCommissionModal()
      // Recarregar dados do usuário
      await fetchUserDetails()
    } catch (err: any) {
      setCommissionError(err.message)
      toast.error(err.message)
    } finally {
      setCommissionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={poppins.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
              <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                      Administração
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/v2/administrator/users" className="text-neutral-400 hover:text-white">
                      Usuários
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Carregando...</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  if (error || !userDetails) {
    return (
      <div className={poppins.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
              <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                      Administração
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/v2/administrator/users" className="text-neutral-400 hover:text-white">
                      Usuários
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-neutral-600" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Erro</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center text-center">
              <User className="w-16 h-16 text-neutral-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Funcionalidade de Detalhes do Usuário Desativada</h1>
              <p className="text-neutral-400 max-w-md">
                Esta página de detalhes do usuário foi desativada, pois depende de uma API para buscar e exibir
                informações de usuários.
              </p>
              <p className="text-neutral-400 max-w-md mt-2">Este projeto está configurado para rodar sem API.</p>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  return (
    <div className={poppins.className}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-600" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-neutral-400 hover:text-white">
                    Administração
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/v2/administrator/users" className="text-neutral-400 hover:text-white">
                    Usuários
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">{userDetails.email}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Visualizar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center text-center">
            <User className="w-16 h-16 text-neutral-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Funcionalidade de Detalhes do Usuário Desativada</h1>
            <p className="text-neutral-400 max-w-md">
              Esta página de detalhes do usuário foi desativada, pois depende de uma API para buscar e exibir
              informações de usuários.
            </p>
            <p className="text-neutral-400 max-w-md mt-2">Este projeto está configurado para rodar sem API.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Modal de Alterar Comissão */}
      <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
        <DialogContent className="max-w-md bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-neutral-400" />
              Alterar Comissão
            </DialogTitle>
          </DialogHeader>

          {commissionError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{commissionError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate" className="text-neutral-300">
                Nova porcentagem (%)
              </Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white"
                placeholder="Ex: 5 para 5%"
                disabled={commissionLoading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseCommissionModal}
              className="flex-1 bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600"
              disabled={commissionLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCommission}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={commissionLoading}
            >
              {commissionLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
