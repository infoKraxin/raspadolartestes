"use client"

import Image from "next/image"
import { Poppins } from "next/font/google"
import Header from "@/components/header"
import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import { useRouter } from "next/router"
import Winners from "@/components/winners"
import { getAppColor, getAppGradient, getAppColorText, getAppColorBorder } from "@/lib/colors"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

interface ScratchCard {
  id: string
  name: string
  description: string
  price: string
  image_url: string
  is_active: boolean
  is_featured: boolean
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

// Mock data for scratch cards
const mockScratchCards: ScratchCard[] = [
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

// Mock data for banners
const mockBanners: string[] = ["/banner.webp", "/banner_orion1.png", "/banner_orion2.png"]

export default function Home() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = mockBanners.length
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([])
  const [banners, setBanners] = useState<string[]>([])
  const [filter, setFilter] = useState("all") // 'all', 'money', 'products'

  // Arrays de memojis por gênero (mantidos, pois são usados no Winners)
  const maleMemojis = [
    "/memojis/male-1.png",
    "/memojis/male-2.png",
    "/memojis/male-3.png",
    "/memojis/male-4.png",
    "/memojis/male-5.png",
    "/memojis/male-6.png",
  ]

  const femaleMemojis = [
    "/memojis/female-1.png",
    "/memojis/female-2.png",
    "/memojis/female-3.png",
    "/memojis/female-4.png",
  ]

  // Função para identificar gênero pelo nome e retornar memoji fixo (mantida)
  const getMemojiByName = (name: string) => {
    const cleanName = name.replace("***", "").toLowerCase()

    // Nomes femininos comuns
    const femaleNames = ["maria", "ana", "julia", "carla", "lucia", "fernanda", "patricia", "sandra"]

    // Verifica se é nome feminino
    const isFemale = femaleNames.some((femaleName) => cleanName.includes(femaleName))

    if (isFemale) {
      // Usa hash do nome para sempre retornar o mesmo memoji feminino
      const hash = cleanName.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      return femaleMemojis[Math.abs(hash) % femaleMemojis.length]
    } else {
      // Usa hash do nome para sempre retornar o mesmo memoji masculino
      const hash = cleanName.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      return maleMemojis[Math.abs(hash) % maleMemojis.length]
    }
  }

  // Função para corrigir URLs das imagens (adaptada para paths locais)
  const fixImageUrl = (url: string) => {
    if (!url) return ""
    // Se a URL já for um path local, retorna como está.
    // Caso contrário, assume que é um path de mock e retorna.
    if (url.startsWith("/")) {
      return url
    }
    // Para URLs que vêm da API original, podemos mapeá-las para os assets locais se existirem
    // Ou simplesmente retornar um placeholder se não houver um mapeamento direto.
    // Para este exemplo, vamos assumir que as URLs mockadas já são locais.
    return url
  }

  // Função para determinar o tipo de prêmio principal (mantida)
  const getCardType = (card: ScratchCard) => {
    const hasMoneyPrizes = card.prizes.some((prize) => prize.type === "MONEY")
    const hasProductPrizes = card.prizes.some((prize) => prize.type === "PRODUCT")

    if (hasMoneyPrizes && hasProductPrizes) return "Misto"
    if (hasMoneyPrizes) return "Dinheiro"
    if (hasProductPrizes) return "Produtos"
    return "Outros"
  }

  // Função para obter o maior prêmio (mantida)
  const getMaxPrize = (card: ScratchCard) => {
    if (!card.prizes.length) return "Sem prêmios"

    const maxPrize = card.prizes.reduce((max, prize) => {
      const prizeValue = Number.parseFloat(prize.value || "0")
      const maxValue = Number.parseFloat(max.value || "0")
      return prizeValue > maxValue ? prize : max
    })

    if (maxPrize.type === "MONEY") {
      return `Ganhe até R$ ${Number.parseFloat(maxPrize.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    } else {
      return maxPrize.product_name || maxPrize.name || "Prêmio especial"
    }
  }

  // Função para filtrar cards (mantida)
  const getFilteredCards = () => {
    if (filter === "all") return scratchCards

    return scratchCards.filter((card) => {
      const cardType = getCardType(card).toLowerCase()
      if (filter === "money") return cardType === "dinheiro" || cardType === "misto"
      if (filter === "products") return cardType === "produtos" || cardType === "misto"
      return true
    })
  }

  // Efeito para carregar dados mockados e controlar o carrossel
  useEffect(() => {
    setScratchCards(mockScratchCards)
    setBanners(mockBanners)

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 4000) // Troca a cada 4 segundos

    return () => clearInterval(interval)
  }, [totalSlides])

  return (
    <div className={`${poppins.className} `}>
      <Header />

      {/* Banner Carousel */}
      <div className="bg-neutral-900 mt-4 relative w-full max-w-6xl lg:max-w-7xl mx-auto h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden px-2 sm:px-4 lg:px-0">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full "
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Banners são carregados diretamente do mock */}
          {banners.map((banner, i) => (
            <div key={i} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={banner || "/placeholder.svg"}
                alt={`Banner ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? `w-6 h-1.5 ${getAppColor()} rounded-full` // Ponto ativo alongado azul
                  : "w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/70" // Pontos inativos menores
              }`}
            />
          ))}
        </div>
      </div>

      {/* Winners Slider */}
      <div className="py-8 sm:py-12 bg-neutral-900 max-w-7xl mx-auto px-4">
        <Winners />
      </div>

      {/* Raspadinhas em Destaque */}
      {scratchCards.some((card) => card.is_featured) && (
        <div className="py-8 sm:py-12 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <svg
                width="2em"
                height="2em"
                fill="currentColor"
                className={`${getAppColorText()} animate-pulse duration-700`}
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"></path>
              </svg>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Em alta!
              </h2>
            </div>

            {/* Grid de Cards em Destaque */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {scratchCards
                .filter((card) => card.is_featured)
                .map((card) => {
                  const cardType = getCardType(card)
                  const maxPrize = getMaxPrize(card)

                  // Determine badge color based on card type
                  const getBadgeColor = () => {
                    if (cardType === "Dinheiro") return "bg-green-500/90"
                    if (cardType === "Produtos") return "bg-yellow-500/90"
                    if (cardType === "Misto") return "bg-purple-500/90"
                    return "bg-yellow-500/90"
                  }

                  return (
                    <div
                      key={card.id}
                      className={`bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border ${getAppColorBorder()} shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8`}
                    >
                      <div className="relative -mt-12 sm:-mt-15">
                        <Image
                          src={fixImageUrl(card.image_url) || "/scratchs/web.webp"}
                          alt={card.name}
                          width={300}
                          height={200}
                          className="w-full h-auto object-cover rounded-t-xl"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/scratchs/web.webp"
                          }}
                        />
                        <div
                          className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${getBadgeColor()} backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg`}
                        >
                          {cardType}
                        </div>
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate" title={card.name}>
                          {card.name}
                        </h3>
                        <p
                          className="text-neutral-400 text-sm mb-3 sm:mb-4 truncate"
                          title={cardType === "Produtos" ? card.description : maxPrize}
                        >
                          {cardType === "Produtos" ? card.description : maxPrize}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 font-bold text-base sm:text-lg">
                            R$ {Number.parseFloat(card.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            onClick={() => router.push(`v1/scratch/${card.id}`)}
                            className={`${getAppGradient()} text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                          >
                            Jogar
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* Raspadinhas Section */}
      <div id="raspadinhas" className="py-8 sm:py-12 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Raspadinhas
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none ${
                  filter === "all"
                    ? `${getAppGradient()} text-white border border-neutral-400/20 hover:from-neutral-600 hover:to-neutral-700`
                    : "bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 border border-neutral-600/30 hover:from-neutral-600 hover:to-neutral-700 hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter("money")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none ${
                  filter === "money"
                    ? `${getAppGradient()}  text-white border border-neutral-400/20 hover:from-neutral-600 hover:to-neutral-700`
                    : "bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 border border-neutral-600/30 hover:from-neutral-600 hover:to-neutral-700 hover:text-white"
                }`}
              >
                Dinheiro
              </button>
              <button
                onClick={() => setFilter("products")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none ${
                  filter === "products"
                    ? `${getAppGradient()} text-white border border-neutral-400/20 hover:from-neutral-600 hover:to-neutral-700`
                    : "bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-300 border border-neutral-600/30 hover:from-neutral-600 hover:to-neutral-700 hover:text-white"
                }`}
              >
                Produtos
              </button>
            </div>
          </div>

          {/* Scratch Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Não há mais loading/error states de API, apenas renderiza os cards mockados */}
            {getFilteredCards().length === 0 ? (
              // No cards state
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-400 text-lg">Nenhuma raspadinha encontrada para este filtro.</p>
              </div>
            ) : (
              // Render cards from mock data
              getFilteredCards().map((card) => {
                const cardType = getCardType(card)
                const maxPrize = getMaxPrize(card)

                // Determine badge color based on card type
                const getBadgeColor = () => {
                  if (cardType === "Dinheiro") return "bg-green-500/90"
                  if (cardType === "Produtos") return "bg-yellow-500/90"
                  if (cardType === "Misto") return "bg-purple-500/90"
                  return "bg-yellow-500/90"
                }

                return (
                  <div
                    key={card.id}
                    className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 pt-6 sm:pt-8"
                  >
                    <div className="relative -mt-12 sm:-mt-15">
                      <Image
                        src={fixImageUrl(card.image_url) || "/scratchs/sonho.webp"}
                        alt={card.name}
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover rounded-t-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/scratchs/sonho.webp"
                        }}
                      />
                      <div
                        className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${getBadgeColor()} backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg`}
                      >
                        {cardType}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate" title={card.name}>
                        {card.name}
                      </h3>
                      <p
                        className="text-neutral-400 text-sm mb-3 sm:mb-4 truncate"
                        title={cardType === "Produtos" ? card.description : maxPrize}
                      >
                        {cardType === "Produtos" ? card.description : maxPrize}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 font-bold text-base sm:text-lg">
                          R$ {Number.parseFloat(card.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          onClick={() => router.push(`v1/scratch/${card.id}`)}
                          className={`${getAppGradient()} text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                        >
                          Jogar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Como Funciona Section */}
      <div id="como-funciona" className="py-8 sm:py-12 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">
              Como Funciona
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Siga estes 4 passos simples e comece a ganhar agora mesmo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Step 1 Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${getAppColor()} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-slate-300/40`}
                  >
                    <span className="text-white font-bold text-lg sm:text-xl">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Crie sua Conta</h3>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    Cadastre-se rapidamente e faça seu primeiro depósito para começar a jogar
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${getAppColor()} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-zinc-300/40`}
                  >
                    <span className="text-white font-bold text-lg sm:text-xl">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Selecione uma Raspadinha</h3>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    Escolha entre diversas opções de raspadinhas com prêmios incríveis
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${getAppColor()} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-stone-300/40`}
                  >
                    <span className="text-white font-bold text-lg sm:text-xl">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Raspe e Descubra</h3>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    Use o dedo ou mouse para raspar e descobrir se você ganhou
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${getAppColor()} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 border border-neutral-300/40`}
                  >
                    <span className="text-white font-bold text-lg sm:text-xl">4</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Receba seu Prêmio</h3>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    Ganhou? Receba seu prêmio instantaneamente via PIX ou retire produtos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
