import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

interface User {
  id: string
  username: string
  email: string
  cpf: string
  full_name: string
  is_admin: boolean
  is_active: boolean
  is_influencer: boolean
  created_at: string
  updated_at: string
  wallet: Array<{
    balance: string
  }>
}

// ** rest of code here **
