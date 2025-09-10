"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { memo } from "react"
import dynamic from "next/dynamic"

const Layout = dynamic(() => import("@/components/Layout"), {
  loading: () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />,
})

const AuthWrapper = dynamic(() => import("@/components/AuthWrapper").then((mod) => ({ default: mod.default })), {
  loading: () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />,
  ssr: false,
})

const ClientLayout = memo(({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"
  const isGeneratorPage = pathname === "/"
  const isAdminPath = pathname.startsWith("/admin")

  // Generator page - no auth, no layout (standalone)
  if (isGeneratorPage) {
    return <>{children}</>
  }

  // Login page - no auth, no layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Admin pages - require auth and layout
  if (isAdminPath) {
    return (
      <AuthWrapper>
        <Layout>{children}</Layout>
      </AuthWrapper>
    )
  }

  // Other pages - no auth, no layout (like 404)
  return <>{children}</>
})

ClientLayout.displayName = "ClientLayout"

export default ClientLayout
