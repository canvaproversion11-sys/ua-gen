"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"
import { AccessKey } from "@/lib/supabase"

export default function UserHeader() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = AccessKey.getCurrentUser()
    setUser(currentUser)
  }, [])

  if (!user) return null

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">{user.user_name}</span>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => AccessKey.logout()} className="flex items-center space-x-2">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  )
}
