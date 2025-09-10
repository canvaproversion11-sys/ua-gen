"use client"

export {
  User,
  Settings,
  Home,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  Eye,
  EyeOff,
  Copy,
  Download,
  Refresh,
  Trash2,
  Edit,
  Plus,
  Minus,
} from "lucide-react"

export function Icon({
  icon: IconComponent,
  size = 16,
  className = "",
}: {
  icon: any
  size?: number
  className?: string
}) {
  return <IconComponent size={size} className={className} />
}
