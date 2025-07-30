"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

function PaymentModal({
  isOpen,
  onClose,
  paymentData,
  token,
}: { isOpen: boolean; onClose: () => void; paymentData: any; token: string | null }) {
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutos
  const prevIsOpenRef = useRef(false)
  const [isPaymentPaid, setIsPaymentPaid] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    let statusCheckTimer: NodeJS.Timeout | null = null

    // Só reinicia o timer se o modal foi fechado e agora está aberto
    if (isOpen && !prevIsOpenRef.current) {
      setTimeLeft(900)
      setIsPaymentPaid(false)
    }
    prevIsOpenRef.current = isOpen

    if (isOpen) {
      // Timer para contagem regressiva
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer)
            toast.error("Tempo para pagamento expirado")
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Verificação imediata do status
      const checkStatus = async () => {
        try {
          // Tentar diferentes possíveis localizações do ID
          const paymentId = paymentData.payment?.id || paymentData.id || paymentData.deposit?.id
          const response = await fetch(`https://api.raspapixoficial.com/v1/api/deposits/${paymentId}/status`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          const data = await response.json()

          if (response.ok && data.success && data.data.status === "PAID" && !isPaymentPaid) {
            setIsPaymentPaid(true)
            toast.success("Pagamento aprovado! Seu saldo foi creditado com sucesso.")

            // Fecha o modal após 5 segundos
            setTimeout(() => {
              onClose()
            }, 5000)
          }
        } catch (error) {
          console.error("Erro ao verificar status do pagamento:", error)
        }
      }

      // Verificação imediata
      checkStatus()

      // Timer para verificar status do pagamento a cada 5 segundos
      statusCheckTimer = setInterval(checkStatus, 5000)
    }

    return () => {
      if (timer) clearInterval(timer)
      if (statusCheckTimer) clearInterval(statusCheckTimer)
    }
  }, [isOpen, onClose, paymentData, token, isPaymentPaid])

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.payment.qrCode)
      toast.success("Código PIX copiado!")
    } catch (error) {
      toast.error("Erro ao copiar código")
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-neutral-800 border-neutral-700 text-white p-6 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Funcionalidade de Depósito Removida</h2>
          <p className="text-neutral-400">
            Para rodar o projeto sem API, a funcionalidade de depósito foi desativada. O saldo do usuário é um valor
            fixo de exemplo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  // Este modal agora é apenas um placeholder, pois a funcionalidade de depósito via API foi removida.
  // Você pode adicionar conteúdo estático aqui se desejar.
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-neutral-800 border-neutral-700 text-white p-6 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Funcionalidade de Depósito Removida</h2>
          <p className="text-neutral-400">
            Para rodar o projeto sem API, a funcionalidade de depósito foi desativada. O saldo do usuário é um valor
            fixo de exemplo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
