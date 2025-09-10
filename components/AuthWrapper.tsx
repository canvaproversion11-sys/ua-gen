"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AccessKey } from "@/lib/supabase"
import AdminLoading from "@/components/AdminLoading"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"
  const isGeneratorPage = pathname === "/"

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoginPage || isGeneratorPage) {
        setLoading(false)
        return
      }

      const currentUser = AccessKey.getCurrentUser()

      if (!currentUser) {
        window.location.href = "/login"
        return
      }

      try {
        const validatedUser = await AccessKey.authenticate(currentUser.access_key)

        // Update localStorage with fresh data from database
        AccessKey.setCurrentUser(validatedUser)
        setUser(validatedUser)
        setLoading(false)
      } catch (error) {
        console.error("Authentication validation failed:", error)
        // Key is invalid, deleted, or expired - logout user
        AccessKey.logout()
        return
      }
    }

    checkAuth()
  }, [isLoginPage])

  if (loading && !isLoginPage && !isGeneratorPage) {
    return <AdminLoading message="Verifying access..." />
  }

  return <>{children}</>
}
