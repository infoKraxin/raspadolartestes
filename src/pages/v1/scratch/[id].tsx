"use client"

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Poppins } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Lock, Loader2 } from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import ScratchCard from "react-scratchcard-v4"
import Winners from "@/components/winners"
import { toast } from "sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

// Interfaces para o jogo
interface Prize {
  id: string
  scratchCardId: string
  name: string
  description: string
  type: string
  value: string
  product_name: string | null
  redemption_value: string | null
  image_url: string
  probability: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ScratchCardData {
  id: string
  name: string
  description: string
  price: string
  image_url: string
  is_active: boolean
  target_rtp: string
  current_rtp: string
  total_revenue: string
  total_payouts: string
  total_games_played: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  prizes: Prize[]
}

interface GamePrize {
  id: string
  name: string
  type: string
  value: string
  product_name: string | null
  redemption_value: string | null
  image_url: string
}

interface GameResult {
  isWinner: boolean
  amountWon: string
  prize: GamePrize | null
  scratchCard: {
    id: string
    name: string
    price: string
    image_url: string
  }
}

// Tipos para os itens da raspadinha
interface ScratchItem {
  id: number
  type:
    | "coin"
    | "gem"
    | "star"
    | "crown"
    | "heart"
    | "diamond"
    | "trophy"
    | "medal"
    | "gift"
    | "ticket"
    | "chest"
    | "fail" // Adicionado 'fail' para símbolos de perda
  value: number
  icon: string
  name?: string
  image?: string
  isWin?: boolean
}

// Estados do jogo
type GameState = "idle" | "loading" | "playing" | "completed"

// Mock data for scratch cards (simplified for client-side logic)
const mockScratchCards: ScratchCardData[] = [
  {
    id: "scratch-1",
    name: "Raspadinha da Fortuna",
    description: "Ganhe até R$ 5.000,00 em dinheiro!",
    price: "10.00",
    image_url: "/scratchs/pix_conta.webp",
    is_active: true,
    is_featured: true,
    target_rtp: "90.0",
    current_rtp: "88.5",
    total_revenue: "15000.00",
    total_payouts: "13000.00",
    total_games_played: 1500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    prizes: [
      {
        id: "prize-1-1",
        scratchCardId: "scratch-1",
        name: "R$ 5.000",
        description: "Prêmio máximo em dinheiro",
        type: "MONEY",
        value: "5000.00",
        product_name: null,
        redemption_value: null,
        image_url: "/200_money.webp",
        probability: "0.1",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "prize-1-2",
        scratchCardId: "scratch-1",
        name: "R$ 500",
        description: "Prêmio em dinheiro",
        type: "MONEY",
        value: "500.00",
        product_name: null,
        redemption_value: null,
        image_url: "/100_money.webp",
        probability: "1.0",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "prize-1-3",
        scratchCardId: "scratch-1",
        name: "R$ 50",
        description: "Prêmio em dinheiro",
        type: "MONEY",
        value: "50.00",
        product_name: null,
        redemption_value: null,
        image_url: "/50_money.webp",
        probability: "5.0",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "scratch-2",
    name: "Sonho de Consumo",
    description: "Concorra a um iPhone 15 ou Air Fryer!",
    price: "25.00",
    image_url: "/scratchs/sonho.webp",
    is_active: true,
    is_featured: true,
    target_rtp: "85.0",
    current_rtp: "86.2",
    total_revenue: "20000.00",
    total_payouts: "17000.00",
    total_games_played: 800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    prizes: [
      {
        id: "prize-2-1",
        scratchCardId: "scratch-2",
        name: "iPhone 15",
        description: "Smartphone de última geração",
        type: "PRODUCT",
        value: "0",
        product_name: "iPhone 15",
        redemption_value: "7000.00",
        image_url: "/item_iphone_12.png",
        probability: "0.05",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "prize-2-2",
        scratchCardId: "scratch-2",
        name: "Air Fryer",
        description: "Fritadeira sem óleo",
        type: "PRODUCT",
        value: "0",
        product_name: "Air Fryer",
        redemption_value: "850.00",
        image_url: "/item_air_fryer.png",
        probability: "0.5",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "scratch-3",
    name: "Motorizado",
    description: "Ganhe uma moto 0km ou R$ 10.000,00!",
    price: "50.00",
    image_url: "/scratchs/motorizado.webp",
    is_active: true,
    is_featured: false,
    target_rtp: "92.0",
    current_rtp: "91.8",
    total_revenue: "30000.00",
    total_payouts: "28000.00",
    total_games_played: 300,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    prizes: [
      {
        id: "prize-3-1",
        scratchCardId: "scratch-3",
        name: "Moto 0km",
        description: "Moto Honda Pop 110i",
        type: "PRODUCT",
        value: "0",
        product_name: "Moto Honda Pop 110i",
        redemption_value: "12000.00",
        image_url: "/1752261367.webp",
        probability: "0.01",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "prize-3-2",
        scratchCardId: "scratch-3",
        name: "R$ 10.000",
        description: "Prêmio em dinheiro",
        type: "MONEY",
        value: "10000.00",
        product_name: null,
        redemption_value: null,
        image_url: "/1752261353.webp",
        probability: "0.02",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "scratch-4",
    name: "Shopee Mania",
    description: "Gift Card Shopee de R$ 500,00!",
    price: "5.00",
    image_url: "/scratchs/shopee.webp",
    is_active: true,
    is_featured: false,
    target_rtp: "80.0",
    current_rtp: "79.5",
    total_revenue: "8000.00",
    total_payouts: "6000.00",
    total_games_played: 2000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    prizes: [
      {
        id: "prize-4-1",
        scratchCardId: "scratch-4",
        name: "Gift Card Shopee",
        description: "Cartão presente Shopee",
        type: "PRODUCT",
        value: "0",
        product_name: "Gift Card Shopee",
        redemption_value: "500.00",
        image_url: "/1752261024.webp",
        probability: "1.5",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "scratch-5",
    name: "Relógio de Luxo",
    description: "Ganhe um Apple Watch!",
    price: "30.00",
    image_url: "/apple_watch.webp",
    is_active: true,
    is_featured: false,
    target_rtp: "87.0",
    current_rtp: "87.1",
    total_revenue: "12000.00",
    total_payouts: "10500.00",
    total_games_played: 400,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    prizes: [
      {
        id: "prize-5-1",
        scratchCardId: "scratch-5",
        name: "Apple Watch",
        description: "Smartwatch Apple",
        type: "PRODUCT",
        value: "0",
        product_name: "Apple Watch",
        redemption_value: "3200.00",
        image_url: "/apple_watch.webp",
        probability: "0.2",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "scratch-6",
    name: "Bolsa de Grife",
    description: "Concorra a uma Bolsa Dior!",
    price: "40.00",
    image_url: "/1752261038.webp",
    is_active: true,
    is_featured: false,
    target_rtp: "89.0",
    current_rtp: "88.8",
    total_revenue: "18000.00",
    total_payouts: "16000.00",
    total_games_played: 350,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    prizes: [
      {
        id: "prize-6-1",
        scratchCardId: "scratch-6",
        name: "Bolsa Dior",
        description: "Bolsa de luxo",
        type: "PRODUCT",
        value: "0",
        product_name: "Bolsa Dior",
        redemption_value: "11500.00",
        image_url: "/1752261038.webp",
        probability: "0.08",
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
]

const ScratchCardPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { user, updateUser } = useAuth() // Usar user e updateUser do contexto mockado
  const isAuthenticated = !!user
  const { width, height } = useWindowSize()
  const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 640)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Estados da API (agora mockados)
  const [scratchCardData, setScratchCardData] = useState<ScratchCardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados do jogo
  const [gameState, setGameState] = useState<GameState>("idle")
  const [scratchItems, setScratchItems] = useState<ScratchItem[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [scratchComplete, setScratchComplete] = useState(false)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)

  const [playingGame, setPlayingGame] = useState(false)

  // Função para corrigir URLs das imagens (adaptada para paths locais)
  const fixImageUrl = (url: string) => {
    if (!url) return ""
    // Se a URL já for um path local, retorna como está.
    // Caso contrário, assume que é um path de mock e retorna.
    if (url.startsWith("/")) {
      return url
    }
    return url // Fallback, embora com mocks, deve ser sempre local
  }

  // Função para buscar dados da raspadinha (agora do mock)
  const fetchScratchCardData = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    // Simula um atraso de rede
    setTimeout(() => {
      const foundCard = mockScratchCards.find((card) => card.id === id)
      if (foundCard) {
        setScratchCardData(foundCard)
      } else {
        setError("Raspadinha não encontrada (mock)")
      }
      setLoading(false)
    }, 500)
  }

  const handleBackClick = () => {
    router.push("/")
  }

  // Buscar dados da raspadinha quando o ID estiver disponível
  useEffect(() => {
    if (id) {
      fetchScratchCardData()
    }
  }, [id])

  // Função para gerar itens da raspadinha baseada no resultado simulado
  const generateScratchItems = (result: GameResult): ScratchItem[] => {
    if (!scratchCardData?.prizes?.length) {
      return []
    }

    const items: ScratchItem[] = []
    const allPossibleIcons = scratchCardData.prizes.map((p) => ({
      icon: fixImageUrl(p.image_url) || "/50_money.webp",
      value: Number.parseFloat(p.value || p.redemption_value || "0"),
      type: p.type === "MONEY" ? "coin" : "product", // Simplificado para tipos de ícone
    }))

    // Adicionar um ícone de "perda" para maior variedade
    allPossibleIcons.push({ icon: "/raspe_aqui.webp", value: 0, type: "fail" })

    if (result.isWinner && result.prize) {
      // Encontrar o ícone do prêmio vencedor
      const winningIconData =
        allPossibleIcons.find(
          (icon) =>
            icon.icon === fixImageUrl(result.prize?.image_url) ||
            (icon.type === "coin" && Number.parseFloat(result.prize?.value || "0") === icon.value),
        ) || allPossibleIcons[0] // Fallback

      // Adicionar 3 itens do tipo vencedor
      for (let i = 0; i < 3; i++) {
        items.push({
          id: i,
          type: winningIconData.type as ScratchItem["type"],
          value: Number.parseFloat(result.prize.value || result.prize.redemption_value || "0"),
          icon: winningIconData.icon,
        })
      }

      // Preencher o restante com itens aleatórios, garantindo que não haja 3 iguais de outro tipo
      const nonWinningIcons = allPossibleIcons.filter((icon) => icon.icon !== winningIconData.icon)
      for (let i = 3; i < 9; i++) {
        let selectedIcon = nonWinningIcons[Math.floor(Math.random() * nonWinningIcons.length)]
        // Garantir que não criamos 3 de um tipo perdedor acidentalmente
        let count = items.filter((item) => item.icon === selectedIcon.icon).length
        while (count >= 2 && nonWinningIcons.length > 1) {
          selectedIcon = nonWinningIcons[Math.floor(Math.random() * nonWinningIcons.length)]
          count = items.filter((item) => item.icon === selectedIcon.icon).length
        }
        items.push({
          id: i,
          type: selectedIcon.type as ScratchItem["type"],
          value: selectedIcon.value,
          icon: selectedIcon.icon,
        })
      }
    } else {
      // Raspadinha perdedora - garantir que NUNCA há 3 iguais
      const tempItems: ScratchItem[] = []
      const iconCounts: { [key: string]: number } = {}

      for (let i = 0; i < 9; i++) {
        let selectedIcon
        let attempts = 0
        do {
          selectedIcon = allPossibleIcons[Math.floor(Math.random() * allPossibleIcons.length)]
          attempts++
          // Evitar 3 do mesmo tipo
          if ((iconCounts[selectedIcon.icon] || 0) >= 2 && attempts < 20) {
            // Se estiver difícil encontrar, tente um ícone de "perda"
            if (Math.random() < 0.5 && allPossibleIcons.some((icon) => icon.type === "fail")) {
              selectedIcon = allPossibleIcons.find((icon) => icon.type === "fail") || selectedIcon
            }
          }
        } while ((iconCounts[selectedIcon.icon] || 0) >= 2 && attempts < 50) // Limite de tentativas

        tempItems.push({
          id: i,
          type: selectedIcon.type as ScratchItem["type"],
          value: selectedIcon.value,
          icon: selectedIcon.icon,
        })
        iconCounts[selectedIcon.icon] = (iconCounts[selectedIcon.icon] || 0) + 1
      }
      // Uma última verificação para garantir que não há 3 iguais
      const finalItems: ScratchItem[] = []
      const finalIconCounts: { [key: string]: number } = {}
      for (const item of tempItems) {
        if ((finalIconCounts[item.icon] || 0) < 2) {
          finalItems.push(item)
          finalIconCounts[item.icon] = (finalIconCounts[item.icon] || 0) + 1
        } else {
          // Se já tiver 2, substitua por um ícone diferente
          let replacementIcon = allPossibleIcons[Math.floor(Math.random() * allPossibleIcons.length)]
          let attempts = 0
          while ((finalIconCounts[replacementIcon.icon] || 0) >= 2 && attempts < 50) {
            replacementIcon = allPossibleIcons[Math.floor(Math.random() * allPossibleIcons.length)]
            attempts++
          }
          finalItems.push({
            id: item.id,
            type: replacementIcon.type as ScratchItem["type"],
            value: replacementIcon.value,
            icon: replacementIcon.icon,
          })
          finalIconCounts[replacementIcon.icon] = (finalIconCounts[replacementIcon.icon] || 0) + 1
        }
      }
      items.push(...finalItems)
    }

    // Embaralhar os itens
    return items.sort(() => Math.random() - 0.5)
  }

  // Função para simular o jogo (substitui a chamada de API)
  const simulatePlayGame = async (): Promise<{ result: GameResult | null; errorMessage?: string }> => {
    if (!scratchCardData) return { result: null, errorMessage: "Dados da raspadinha não carregados." }

    // Simula um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const winChance = 0.3 // 30% de chance de ganhar
    const isWinner = Math.random() < winChance

    let amountWon = "0.00"
    let prize: GamePrize | null = null

    if (isWinner && scratchCardData.prizes.length > 0) {
      // Seleciona um prêmio aleatoriamente dos prêmios da raspadinha
      const winningPrizeData = scratchCardData.prizes[Math.floor(Math.random() * scratchCardData.prizes.length)]
      amountWon =
        winningPrizeData.type === "MONEY" ? winningPrizeData.value : winningPrizeData.redemption_value || "0.00"
      prize = {
        id: winningPrizeData.id,
        name: winningPrizeData.name,
        type: winningPrizeData.type,
        value: winningPrizeData.value,
        product_name: winningPrizeData.product_name,
        redemption_value: winningPrizeData.redemption_value,
        image_url: winningPrizeData.image_url,
      }
      toast.success(`Parabéns! Você ganhou R$ ${Number.parseFloat(amountWon).toFixed(2).replace(".", ",")}!`)
    } else {
      toast.info("Não foi dessa vez. Tente novamente!")
    }

    const result: GameResult = {
      isWinner,
      amountWon,
      prize,
      scratchCard: {
        id: scratchCardData.id,
        name: scratchCardData.name,
        price: scratchCardData.price,
        image_url: scratchCardData.image_url,
      },
    }

    return { result }
  }

  // Função para atualizar saldos do usuário (mockada)
  const refreshUserBalance = async (winnings: number) => {
    if (!user) return

    // Simula a atualização do saldo
    const newBalance = (user.wallet?.[0]?.balance || 0) - Number.parseFloat(scratchCardData?.price || "0") + winnings
    updateUser({
      wallet: [
        {
          ...user.wallet[0],
          balance: newBalance,
        },
      ],
    })
  }

  // Função para iniciar o jogo
  const handleBuyAndScratch = async () => {
    if (!isAuthenticated || playingGame || !scratchCardData) return

    // Verifica se o usuário tem saldo suficiente (simulado)
    if ((user?.wallet?.[0]?.balance || 0) < Number.parseFloat(scratchCardData.price)) {
      toast.error("Saldo insuficiente para jogar!")
      return
    }

    setGameState("loading")
    setScratchComplete(false)
    setShowConfetti(false)
    setHasWon(false)
    setTotalWinnings(0)
    setGameResult(null)
    setPlayingGame(true)

    // Simular o jogo
    const { result, errorMessage } = await simulatePlayGame()

    if (result) {
      setGameResult(result)
      const items = generateScratchItems(result)
      setScratchItems(items)
      setGameState("playing")
      // Atualizar saldo após a "compra" da raspadinha e o "ganho"
      await refreshUserBalance(Number.parseFloat(result.amountWon))
    } else {
      setGameState("idle")
      toast.error(errorMessage || "Erro ao iniciar o jogo. Tente novamente.")
    }
    setPlayingGame(false)
  }

  // Função chamada quando a raspadinha é completada
  const handleScratchComplete = async () => {
    if (scratchComplete || !gameResult) return

    setScratchComplete(true)

    setHasWon(gameResult.isWinner)
    setTotalWinnings(Number.parseFloat(gameResult.amountWon))

    if (gameResult.isWinner) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }

    setGameState("completed")
  }

  // Função para jogar novamente
  const handlePlayAgain = async () => {
    if (!isAuthenticated || playingGame || !scratchCardData) return

    // Verifica se o usuário tem saldo suficiente (simulado)
    if ((user?.wallet?.[0]?.balance || 0) < Number.parseFloat(scratchCardData.price)) {
      toast.error("Saldo insuficiente para jogar novamente!")
      return
    }

    // Resetar estados
    setScratchItems([])
    setScratchComplete(false)
    setShowConfetti(false)
    setHasWon(false)
    setTotalWinnings(0)
    setGameResult(null)

    // Iniciar novo jogo diretamente
    setGameState("loading")
    setPlayingGame(true)

    // Simular o jogo
    const { result, errorMessage } = await simulatePlayGame()

    if (result) {
      setGameResult(result)
      const items = generateScratchItems(result)
      setScratchItems(items)
      setGameState("playing")
      // Atualizar saldo após a "compra" da raspadinha e o "ganho"
      await refreshUserBalance(Number.parseFloat(result.amountWon))
    } else {
      setGameState("idle")
      toast.error(errorMessage || "Erro ao iniciar o jogo. Tente novamente.")
    }
    setPlayingGame(false)
  }

  if (loading) {
    return (
      <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-neutral-400">Carregando raspadinha...</p>
        </div>
      </div>
    )
  }

  if (error || !scratchCardData) {
    return (
      <div className={`${poppins.className} min-h-screen bg-neutral-900 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Raspadinha não encontrada."}</p>
          <Button onClick={handleBackClick} className="bg-yellow-600 hover:bg-yellow-700">
            Voltar para o Início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-neutral-900`}>
      <Header />

      {/* Confetti */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} gravity={0.3} />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Winners */}
        <Winners />

        {/* Game Area - Full Width */}
        <div
          className="mt-4 bg-neutral-800 rounded-xl border border-neutral-700 p-4 sm:p-6 mb-6 sm:mb-8"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              {scratchCardData.name}
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm px-2">{scratchCardData.description}</p>
          </div>

          {/* Game States */}
          {gameState === "idle" && (
            <div className="bg-neutral-700 rounded-lg p-3 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
              <div className="relative w-64 h-64 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] rounded-lg overflow-hidden mx-auto">
                <Image src="/raspe_aqui.webp" alt="Raspe Aqui" fill className="object-contain opacity-40" />

                {!isAuthenticated && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br rounded-xl from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                        <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-white font-bold text-base sm:text-lg mb-2">Faça login para jogar</h3>
                      <p className="text-neutral-400 text-xs sm:text-sm mb-4">Conecte-se para raspar</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mt-3 sm:mt-4">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                  Reúna 3 imagens iguais e conquiste seu prêmio!
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
                  O valor correspondente será creditado automaticamente na sua conta.
                  <br />
                  Se preferir receber o produto físico, basta entrar em contato com o nosso suporte.
                </p>
                <Button
                  onClick={handleBuyAndScratch}
                  disabled={!isAuthenticated || playingGame}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl w-full lg:w-1/2 transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/20 disabled:border-neutral-600/20 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {!isAuthenticated
                    ? "Faça login para jogar"
                    : `Comprar e Raspar (R$ ${Number.parseFloat(scratchCardData.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`}
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {gameState === "loading" && (
            <div className="bg-neutral-700 rounded-lg p-6 sm:p-8 border border-neutral-600 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
                </div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Preparando sua raspadinha...</h3>
                <p className="text-neutral-400 text-sm">Aguarde enquanto geramos seus prêmios</p>
              </div>
            </div>
          )}

          {/* Playing State - Scratch Card */}
          {(gameState === "playing" || gameState === "completed") && (
            <div className="bg-neutral-700 rounded-lg p-4 sm:p-6 border border-neutral-600 mb-4 sm:mb-6">
              {gameState === "playing" && (
                <div className="text-center mb-4">
                  <p className="text-white font-semibold text-sm sm:text-base mb-2">
                    🎯 Raspe a superfície para descobrir os prêmios!
                  </p>
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    💡 Você precisa de 3 símbolos iguais para ganhar!
                  </p>
                </div>
              )}

              {gameState === "playing" && (
                <div className="flex justify-center mb-4 touch-none overflow-hidden" style={{ touchAction: "none" }}>
                  <div className="w-full flex justify-center" style={{ touchAction: "none", userSelect: "none" }}>
                    <ScratchCard
                      width={screenWidth < 640 ? Math.min(280, screenWidth - 60) : screenWidth < 1024 ? 450 : 500}
                      height={screenWidth < 640 ? Math.min(280, screenWidth - 60) : screenWidth < 1024 ? 450 : 500}
                      image="/raspe_aqui.webp"
                      finishPercent={85}
                      brushSize={screenWidth < 640 ? 12 : screenWidth < 1024 ? 20 : 25}
                      onComplete={handleScratchComplete}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 p-4">
                        <div className="grid grid-cols-3 gap-2 h-full">
                          {scratchItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex flex-col items-center justify-center p-2 border border-neutral-600"
                            >
                              <div className="w-8 h-8 mb-1 relative">
                                <Image
                                  src={item.icon || "/placeholder.svg"}
                                  alt={`Prêmio ${item.value}`}
                                  fill
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/50_money.webp"
                                  }}
                                />
                              </div>
                              <p className="text-white text-xs font-bold text-center">
                                {item.value > 0 ? `R$ ${item.value.toFixed(2).replace(".", ",")}` : "Ops! Hoje não"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScratchCard>
                  </div>
                </div>
              )}

              {gameState === "completed" && (
                <div className="text-center mb-4">
                  {hasWon ? (
                    <div>
                      <h3 className="text-green-400 font-bold text-lg sm:text-xl mb-2">🎉 Parabéns! Você ganhou!</h3>
                      {gameResult?.prize?.type === "PRODUCT" ? (
                        <p className="text-white font-semibold text-base sm:text-lg">
                          {gameResult.prize.product_name || gameResult.prize.name}
                        </p>
                      ) : (
                        <p className="text-white font-semibold text-base sm:text-lg">
                          Total: R$ {totalWinnings.toFixed(2).replace(".", ",")}
                        </p>
                      )}
                      <p className="text-neutral-400 text-xs sm:text-sm mt-1">Você conseguiu 3 símbolos iguais!</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-2">😔 Ops! Não foi dessa vez!</h3>
                      <p className="text-neutral-400 text-sm">Você precisa de 3 símbolos iguais para ganhar</p>
                    </div>
                  )}
                </div>
              )}

              {/* Results Grid for Completed State */}
              {gameState === "completed" && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
                  {scratchItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg border border-neutral-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-neutral-600/20 to-neutral-700/20">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 relative mx-auto">
                          <Image
                            src={item.icon || "/placeholder.svg"}
                            alt={`Prêmio ${item.value}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-center text-white">
                          {item.value > 0 ? `R$ ${item.value.toFixed(2).replace(".", ",")}` : "Ops! Hoje não"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {gameState === "completed" && (
                <div className="text-center mt-4">
                  {hasWon && gameResult?.prize?.type === "PRODUCT" ? (
                    <Button
                      onClick={() => router.push("/v1/profile/inventory")}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg w-full transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-400/20 text-sm"
                    >
                      Ir para Inventário
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePlayAgain}
                      disabled={!isAuthenticated || playingGame}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      {`Jogar Novamente (R$ ${Number.parseFloat(scratchCardData.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Prize Section */}
        <div className="rounded-xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-start">Prêmios Disponíveis</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {scratchCardData?.prizes && scratchCardData.prizes.length > 0 ? (
              scratchCardData.prizes.slice(0, 17).map((prize, index) => (
                <div key={prize.id} className="flex-shrink-0 w-38 xl:w-auto">
                  <div className="flex flex-col border-2 border-yellow-500/30 p-3 rounded-lg bg-gradient-to-t from-yellow-500/17 from-[0%] to-[35%] to-yellow-400/10 cursor-pointer aspect-square hover:scale-105 transition-all duration-300">
                    <Image
                      src={fixImageUrl(prize.image_url) || "/50_money.webp"}
                      alt={
                        prize.type === "MONEY"
                          ? `${Number.parseFloat(prize.value || "0").toFixed(0)} Reais`
                          : prize.name
                      }
                      width={80}
                      height={80}
                      className="size-full p-3 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/50_money.webp"
                      }}
                    />
                    <h3 className="text-sm font-semibold mb-3 overflow-hidden text-ellipsis text-nowrap w-30 text-white">
                      {prize.type === "MONEY"
                        ? `${Number.parseFloat(prize.value || "0").toFixed(0)} Reais`
                        : prize.name}
                    </h3>
                    <div className="px-1.5 py-1 bg-white text-neutral-900 rounded-sm text-sm font-semibold self-start">
                      R${" "}
                      {prize.type === "MONEY"
                        ? Number.parseFloat(prize.value || "0")
                            .toFixed(2)
                            .replace(".", ",")
                        : Number.parseFloat(prize.redemption_value || "0")
                            .toFixed(2)
                            .replace(".", ",")}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-neutral-400 text-sm">Nenhum prêmio disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ScratchCardPage
