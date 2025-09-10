"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Smartphone, Settings, Zap, Shield, Instagram } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useEffect, useState } from "react"
import { AccessKey } from "@/lib/supabase"
import UserHeader from "@/components/UserHeader"

const navigationItems = [
  {
    title: "Generator",
    url: "/",
    icon: Zap,
    description: "Generate user agents",
  },
  {
    title: "iOS Admin Panel",
    url: "/admin",
    icon: Settings,
    description: "Manage iOS configurations",
  },
  {
    title: "Android Admin Panel",
    url: "/admin-android",
    icon: Smartphone,
    description: "Manage Android configurations",
  },
  {
    title: "Android insta Admin Panel",
    url: "/admin-instagram",
    icon: Instagram,
    description: "Manage Instagram Android configurations",
  },
]

function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = AccessKey.getCurrentUser()
    setUser(currentUser)
  }, [])

  return (
    <Sidebar className="border-r border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <SidebarHeader className="border-b border-slate-200/60 dark:border-slate-700/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"></div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">UAGen Pro</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">User Agent Generator</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      pathname === item.url
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                      <item.icon
                        className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                          pathname === item.url ? "text-white" : "text-slate-600 dark:text-slate-400"
                        }`}
                      />
                      <div className="flex-1">
                        <span
                          className={`font-semibold text-sm ${
                            pathname === item.url ? "text-white" : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {item.title}
                        </span>
                        <p
                          className={`text-xs ${
                            pathname === item.url ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
            Security
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-emerald-800 dark:text-emerald-200">Secure Generation</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                All user agents are unique and valid
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AppSidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">UAGen Pro</h1>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <UserHeader />

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
