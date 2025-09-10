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

  return <AuthWrapper>{isLoginPage ? children : <Layout>{children}</Layout>}</AuthWrapper>
})

ClientLayout.displayName = "ClientLayout"

export default ClientLayout
