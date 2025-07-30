"use client"
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
import { Poppins } from "next/font/google"
import { Settings } from "lucide-react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export default function AdminHomePage() {
  const router = useRouter()

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
                  <BreadcrumbPage className="text-white font-medium">Início</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center text-center">
            <Settings className="w-16 h-16 text-neutral-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Funcionalidades de Administração Desativadas</h1>
            <p className="text-neutral-400 max-w-md">
              As páginas de administração foram desativadas, pois dependem de uma API para gerenciar dados. Este projeto
              está configurado para rodar sem API.
            </p>
            <p className="text-neutral-400 max-w-md mt-2">
              Para habilitar as funcionalidades de administração, você precisaria integrar um backend.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
