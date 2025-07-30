"use client"
import { useState, useEffect, type ChangeEvent } from "react"
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
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { Poppins } from "next/font/google"
import { Upload } from "lucide-react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

const imageFields = [
  { key: "plataform_logo", label: "Logo da Plataforma", uploadKey: "logo" },
  { key: "plataform_banner", label: "Banner Principal", uploadKey: "banner" },
  { key: "plataform_banner_2", label: "Banner Secundário", uploadKey: "banner_2" },
  { key: "plataform_banner_3", label: "Banner Terciário", uploadKey: "banner_3" },
  { key: "register_banner", label: "Banner de Cadastro", uploadKey: "register_banner" },
  { key: "login_banner", label: "Banner de Login", uploadKey: "login_banner" },
  { key: "deposit_banner", label: "Banner de Depósito", uploadKey: "deposit_banner" },
]

export default function AdminUploadPage() {
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [settings, setSettings] = useState<any>({}) // /** rest of code here **/
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({}) // /** rest of code here **/
  const [files, setFiles] = useState<{ [key: string]: File | null }>({}) // /** rest of code here **/

  // Verificar se o usuário é administrador
  useEffect(() => {
    if (user && !user.is_admin) {
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.")
      window.location.href = "/"
      return
    }
  }, [user])

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch("https://api.raspapixoficial.com/v1/api/setting", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || "Erro ao buscar configurações")
        setSettings(data.data[0] || {})
        // Preencher previews com as imagens atuais
        const previewsObj: { [key: string]: string | null } = {}
        imageFields.forEach((f) => {
          previewsObj[f.key] = data.data[0]?.[f.key] || null
        })
        setPreviews(previewsObj)
      } catch (err: any) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [token])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0] || null
    setFiles((prev) => ({ ...prev, [fieldKey]: file })) // /** rest of code here **/
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviews((prev) => ({ ...prev, [fieldKey]: ev.target?.result as string })) // /** rest of code here **/
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async (uploadKey: string, fieldKey: string) => {
    if (!files[fieldKey]) {
      toast.error("Selecione um arquivo para enviar.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append(uploadKey, files[fieldKey]!)
      const response = await fetch("https://api.raspapixoficial.com/v1/api/setting/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Erro ao enviar imagem")
      toast.success("Imagem enviada com sucesso!")
      // Atualizar preview após upload
      setSettings((prev: any) => ({ ...prev, [fieldKey]: data.data?.[fieldKey] || prev[fieldKey] })) // /** rest of code here **/
      setFiles((prev) => ({ ...prev, [fieldKey]: null })) // /** rest of code here **/
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
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
                  <BreadcrumbLink href="/v2/administrator/settings" className="text-neutral-400 hover:text-white">
                    Configurações
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Upload</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {loading || !user?.is_admin ? (
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </Card>
          ) : (
            <div className="flex flex-1 flex-col gap-6 p-6 bg-neutral-900 items-center justify-center text-center">
              <Upload className="w-16 h-16 text-neutral-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Funcionalidade de Upload Desativada</h1>
              <p className="text-neutral-400 max-w-md">
                Esta página de upload de arquivos foi desativada, pois depende de uma API para gerenciar o armazenamento
                de mídia.
              </p>
              <p className="text-neutral-400 max-w-md mt-2">Este projeto está configurado para rodar sem API.</p>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
