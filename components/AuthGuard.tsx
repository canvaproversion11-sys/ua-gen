"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AccessKey } from "@/lib/supabase"
import AdminLoading from "@/components/AdminLoading"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = AccessKey.getCurrentUser()

      if (!currentUser) {
        window.location.href = "/login"
        return
      }

      try {
        // Validate user key in database
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
  }, [])

  if (loading) {
    return <AdminLoading message="Verifying access..." />
  }

  return <>{children}</>
}
