"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SearchForm } from "./search-form"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "./auth-modal"
import DepositModal from "./deposit-modal"
import { useState } from "react"
import { useRouter } from "next/router"
import { getAppGradient } from "@/lib/colors"
import { Menu, X, User, Wallet, LogOut, Home, Package, Settings, DollarSign, Users, BarChart, Gift } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  const handleLoginClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleDepositClick = () => {
    setIsDepositModalOpen(true)
  }

  const handleLogoutClick = () => {
    logout()
    router.push("/")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <header className="bg-neutral-900 py-3 sm:py-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo_rs.png" alt="Logo" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="text-white text-lg sm:text-xl font-bold">RASPAPAI</span>
        </div>

        {/* Desktop Navigation & Actions */}
        <nav className="hidden lg:flex items-center gap-6">
          <a href="/" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
            Início
          </a>
          <a href="#raspadinhas" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
            Raspadinhas
          </a>
          <a href="#como-funciona" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">
            Como Funciona
          </a>
          <SearchForm />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* User Balance */}
              <div className="hidden sm:flex items-center bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1.5 text-sm font-medium text-white">
                <Wallet className="w-4 h-4 mr-2 text-green-400" />
                <span>{formatCurrency(user.wallet?.[0]?.balance || 0)}</span>
              </div>

              {/* Deposit Button */}
              <Button
                onClick={handleDepositClick}
                className={`${getAppGradient()} text-white px-4 py-2 rounded-full text-sm font-semibold hidden sm:block`}
              >
                Depositar
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9 sm:w-10 sm:h-10 border border-neutral-700"
                  >
                    <User className="w-5 h-5 text-neutral-300" />
                    <span className="sr-only">Menu do Usuário</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-white">
                  <DropdownMenuLabel className="text-neutral-300">Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/v1/profile")}
                    className="hover:bg-neutral-700 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/v1/profile/inventory")}
                    className="hover:bg-neutral-700 cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Inventário
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/v1/profile/deposit")}
                    className="hover:bg-neutral-700 cursor-pointer"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Depósito
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator className="bg-neutral-700" />
                      <DropdownMenuLabel className="text-neutral-300">Administração</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/v2/administrator")}
                        className="hover:bg-neutral-700 cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/v2/administrator/scratchs")}
                        className="hover:bg-neutral-700 cursor-pointer"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Raspadinhas
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/v2/administrator/users")}
                        className="hover:bg-neutral-700 cursor-pointer"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Usuários
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/v2/administrator/deposits")}
                        className="hover:bg-neutral-700 cursor-pointer"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Depósitos
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/v2/administrator/withdrawals")}
                        className="hover:bg-neutral-700 cursor-pointer"
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        Saques
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="hover:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={handleLoginClick}
              className={`${getAppGradient()} text-white px-4 py-2 rounded-full text-sm font-semibold`}
            >
              Entrar
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 border border-neutral-700"
              >
                <Menu className="w-5 h-5 text-neutral-300" />
                <span className="sr-only">Abrir Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-neutral-900 border-neutral-800 text-white w-64 sm:w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Image src="/logo_rs.png" alt="Logo" width={32} height={32} className="h-8 w-8" />
                    <span className="text-white text-lg font-bold">RASPAPAI</span>
                  </div>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                      <X className="w-5 h-5 text-neutral-300" />
                      <span className="sr-only">Fechar Menu</span>
                    </Button>
                  </SheetTrigger>
                </div>

                <nav className="flex flex-col gap-4 text-base font-medium flex-grow">
                  <a href="/" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors">
                    <Home className="w-5 h-5" /> Início
                  </a>
                  <a
                    href="#raspadinhas"
                    className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Gift className="w-5 h-5" /> Raspadinhas
                  </a>
                  <a
                    href="#como-funciona"
                    className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" /> Como Funciona
                  </a>
                  <Separator className="bg-neutral-800 my-2" />
                  {user ? (
                    <>
                      <span className="text-neutral-400 text-sm font-semibold mb-2">Minha Conta</span>
                      <div className="flex items-center gap-3 text-neutral-300">
                        <Wallet className="w-5 h-5 text-green-400" />
                        <span className="font-bold">{formatCurrency(user.wallet?.[0]?.balance || 0)}</span>
                      </div>
                      <Button
                        onClick={handleDepositClick}
                        className={`${getAppGradient()} text-white w-full py-2 rounded-lg text-sm font-semibold mt-2`}
                      >
                        Depositar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation("/v1/profile")}
                        className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                      >
                        <User className="w-5 h-5" /> Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation("/v1/profile/inventory")}
                        className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                      >
                        <Package className="w-5 h-5" /> Inventário
                      </Button>
                      {user.role === "ADMIN" && (
                        <>
                          <Separator className="bg-neutral-800 my-2" />
                          <span className="text-neutral-400 text-sm font-semibold mb-2">Administração</span>
                          <Button
                            variant="ghost"
                            onClick={() => handleNavigation("/v2/administrator")}
                            className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                          >
                            <Settings className="w-5 h-5" /> Dashboard
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleNavigation("/v2/administrator/scratchs")}
                            className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                          >
                            <Gift className="w-5 h-5" /> Raspadinhas
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleNavigation("/v2/administrator/users")}
                            className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                          >
                            <Users className="w-5 h-5" /> Usuários
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleNavigation("/v2/administrator/deposits")}
                            className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                          >
                            <DollarSign className="w-5 h-5" /> Depósitos
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleNavigation("/v2/administrator/withdrawals")}
                            className="flex items-center gap-3 text-neutral-300 hover:text-white w-full justify-start"
                          >
                            <BarChart className="w-5 h-5" /> Saques
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 w-full justify-start mt-auto"
                        variant="ghost"
                      >
                        <LogOut className="w-5 h-5" /> Sair
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleLoginClick}
                      className={`${getAppGradient()} text-white w-full py-2 rounded-lg text-sm font-semibold mt-auto`}
                    >
                      Entrar
                    </Button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    </header>
  )
}
