"use client"

import { useState, useEffect } from "react"
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
import { Coins, CreditCard, DollarSign, Percent, BadgeCheck, AlertTriangle, BarChart } from "lucide-react"
import { Poppins } from "next/font/google"
import { useAuth } from "@/contexts/AuthContext"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

interface LicenseData {
  id: string
  credits: number
  credits_used: number
  credits_value: string
  ggr_percentage: string
  total_earnings: string
  is_active: boolean
}

interface LicenseUsage {
  id: string
  userId: string
  licenseId: string
  scratchCardId: string
  credits_used: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    full_name: string
    email: string
  }
  license: {
    id: string
    credits: number
    credits_used: number
    credits_value: string
    ggr_percentage: string
  }
  scratchCard: {
    id: string
    name: string
    price: string
  }
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function GGRPage() {
  const { token } = useAuth()
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null)
  const [usageData, setUsageData] = useState<LicenseUsage[]>([])
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [usageLoading, setUsageLoading] = useState(true)
  const [error, setError] = useState("")
  const [usageError, setUsageError] = useState("")

  // Estados para os modais
  const [creditsAmount, setCreditsAmount] = useState("")
  const [earningsAmount, setEarningsAmount] = useState("")
  const [isAddingCredits, setIsAddingCredits] = useState(false)
  const [isAddingEarnings, setIsAddingEarnings] = useState(false)
  const [modalSuccess, setModalSuccess] = useState("")
  const [modalError, setModalError] = useState("")

  useEffect(() => {
    const fetchLicenseData = async () => {
      if (!token) return

      try {
        const response = await fetch("https://api.raspapixoficial.com/v1/api/license/current", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar dados da licença")
        }

        setLicenseData(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchUsageData = async () => {
      if (!token) return

      try {
        setUsageLoading(true)
        const response = await fetch("https://api.raspapixoficial.com/v1/api/license/usage", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar dados de uso da licença")
        }

        setUsageData(data.data)
        setPagination(data.pagination)
      } catch (err: any) {
        setUsageError(err.message)
      } finally {
        setUsageLoading(false)
      }
    }

    fetchLicenseData()
    fetchUsageData()
  }, [token])

  // Função para adicionar créditos
  const handleAddCredits = async () => {
    if (!token || !creditsAmount) return

    try {
      setIsAddingCredits(true)
      setModalError("")
      setModalSuccess("")

      const response = await fetch("https://api.raspapixoficial.com/v1/api/license/credits", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credits: Number.parseInt(creditsAmount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar créditos")
      }

      // Atualizar os dados da licença
      const licenseResponse = await fetch("https://api.raspapixoficial.com/v1/api/license/current", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const licenseData = await licenseResponse.json()

      if (licenseResponse.ok) {
        setLicenseData(licenseData.data)
      }

      setModalSuccess("Créditos adicionados com sucesso!")
      setCreditsAmount("")
    } catch (err: any) {
      setModalError(err.message)
    } finally {
      setIsAddingCredits(false)
    }
  }

  // Função para adicionar arrecadação
  const handleAddEarnings = async () => {
    if (!token || !earningsAmount) return

    try {
      setIsAddingEarnings(true)
      setModalError("")
      setModalSuccess("")

      const response = await fetch("https://api.raspapixoficial.com/v1/api/license/earnings", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(earningsAmount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar arrecadação")
      }

      // Atualizar os dados da licença
      const licenseResponse = await fetch("https://api.raspapixoficial.com/v1/api/license/current", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const licenseData = await licenseResponse.json()

      if (licenseResponse.ok) {
        setLicenseData(licenseData.data)
      }

      setModalSuccess("Arrecadação adicionada com sucesso!")
      setEarningsAmount("")
    } catch (err: any) {
      setModalError(err.message)
    } finally {
      setIsAddingEarnings(false)
    }
  }

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  const getGGRCards = () => {
    if (!licenseData) return []

    return [
      {
        title: "Créditos Disponíveis",
        value: licenseData.credits.toString(),
        icon: Coins,
        description: "Total de créditos",
        color: "text-green-400",
      },
      {
        title: "Créditos Utilizados",
        value: licenseData.credits_used.toString(),
        icon: CreditCard,
        description: "Créditos consumidos",
        color: "text-yellow-400",
      },
      {
        title: "Valor do Crédito",
        value: formatCurrency(licenseData.credits_value),
        icon: DollarSign,
        description: "Valor unitário",
        color: "text-yellow-400",
      },
      {
        title: "Porcentagem GGR",
        value: `${licenseData.ggr_percentage}%`,
        icon: Percent,
        description: "Taxa aplicada",
        color: "text-purple-400",
      },
      {
        title: "Total Arrecadado GGR",
        value: formatCurrency(licenseData.total_earnings),
        icon: DollarSign,
        description: "Valor total",
        color: "text-cyan-400",
      },
      {
        title: "Status da Licença",
        value: licenseData.is_active ? "Ativa" : "Inativa",
        icon: licenseData.is_active ? BadgeCheck : AlertTriangle,
        description: licenseData.is_active ? "Licença válida" : "Licença expirada",
        color: licenseData.is_active ? "text-green-400" : "text-red-400",
      },
    ]
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
                  <BreadcrumbPage className="text-white font-medium">GGR</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center text-center">
            <BarChart className="w-16 h-16 text-neutral-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Funcionalidade de GGR Desativada</h1>
            <p className="text-neutral-400 max-w-md">
              Esta página de GGR (Gross Gaming Revenue) foi desativada, pois depende de uma API para coletar e analisar
              dados financeiros.
            </p>
            <p className="text-neutral-400 max-w-md mt-2">Este projeto está configurado para rodar sem API.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
