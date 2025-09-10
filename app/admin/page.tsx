"use client"

import AuthGuard from "@/components/AuthGuard"

import { useState, useEffect, createContext, useContext } from "react"
import { DeviceModel, IOSVersion, AppVersion, Configuration } from "@/lib/supabase"
import {
  Smartphone,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  Layers,
  Instagram,
  Facebook,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CustomModal } from "@/components/CustomModal"
import AdminLoading from "@/components/AdminLoading"

// Predefined options for dropdowns
const DEVICE_MODELS = [
  "iPhone17,1 (iPhone 16 Pro)",
  "iPhone17,2 (iPhone 16 Pro Max)",
  "iPhone16,2 (iPhone 16 Plus)",
  "iPhone16,1 (iPhone 16)",
  "iPhone15,5 (iPhone 15 Pro Max)",
  "iPhone15,4 (iPhone 15 Pro)",
  "iPhone15,3 (iPhone 15 Plus)",
  "iPhone15,2 (iPhone 15)",
  "iPhone14,8 (iPhone 14 Plus)",
  "iPhone14,7 (iPhone 14)",
  "iPhone14,6 (iPhone SE 3rd gen)",
  "iPhone14,5 (iPhone 13)",
  "iPhone14,4 (iPhone 13 mini)",
  "iPhone14,3 (iPhone 13 Pro Max)",
  "iPhone14,2 (iPhone 13 Pro)",
  "iPhone13,4 (iPhone 12 Pro Max)",
  "iPhone13,3 (iPhone 12 Pro)",
  "iPhone13,2 (iPhone 12)",
  "iPhone13,1 (iPhone 12 mini)",
  "iPhone12,8 (iPhone SE 3rd gen)",
  "iPhone12,5 (iPhone 11 Pro Max)",
  "iPhone12,3 (iPhone 11 Pro)",
  "iPhone12,1 (iPhone 11)",
]

const IOS_VERSIONS = [
  "18.6.2",
  "18.6.1",
  "18.6",
  "18.5",
  "18.4.1",
  "18.4",
  "18.3.2",
  "18.3.1",
  "18.3",
  "18.2.1",
  "18.1.1",
  "18.0",
  "17.7.2",
  "17.6.1",
  "17.5.1",
  "17.4.1",
  "17.3.1",
  "17.2.1",
  "17.1.1",
  "17.0.1",
  "16.7.10",
  "16.6.1",
  "16.5.1",
  "16.4.1",
  "16.3.1",
  "16.2",
  "16.1.1",
  "16.0",
]

const BUILD_NUMBERS = {
  "18.6.2": "22G100",
  "18.6.1": "22G90",
  "18.6": "22G86",
  "18.5": "22F76",
  "18.4.1": "22E252",
  "18.4": "22E240",
  "18.3.2": "22D82",
  "18.3.1": "22D72",
  "18.3": "22D63",
  "18.2.1": "22C161",
  "18.1.1": "22B91",
  "18.0": "22A3354",
  "17.7.2": "21H221",
  "17.6.1": "21G93",
  "17.5.1": "21F90",
  "17.4.1": "21E236",
  "17.3.1": "21D61",
  "17.2.1": "21C62",
  "17.1.1": "21B91",
  "17.0.1": "21A340",
  "16.7.10": "20H350",
  "16.6.1": "20G81",
  "16.5.1": "20F75",
  "16.4.1": "20E252",
  "16.3.1": "20D67",
  "16.2": "20C65",
  "16.1.1": "20B101",
  "16.0": "20A362",
}

const WEBKIT_VERSIONS = ["605.1.15"]

const RESOLUTIONS_BY_MODEL = {
  "iPhone1,1": ["320x480"], // iPhone (1st Gen)
  "iPhone1,2": ["320x480"], // iPhone 3G
  "iPhone2,1": ["320x480"], // iPhone 3GS

  "iPhone3,1": ["640x960"], // iPhone 4 (GSM)
  "iPhone3,2": ["640x960"], // iPhone 4 (GSM Rev A)
  "iPhone3,3": ["640x960"], // iPhone 4 (CDMA)
  "iPhone4,1": ["640x960"], // iPhone 4S

  "iPhone5,1": ["640x1136"], // iPhone 5 (GSM)
  "iPhone5,2": ["640x1136"], // iPhone 5 (Global)
  "iPhone5,3": ["640x1136"], // iPhone 5c (GSM)
  "iPhone5,4": ["640x1136"], // iPhone 5c (Global)
  "iPhone6,1": ["640x1136"], // iPhone 5s (GSM)
  "iPhone6,2": ["640x1136"], // iPhone 5s (Global)

  "iPhone7,2": ["750x1334"], // iPhone 6
  "iPhone7,1": ["1080x1920"], // iPhone 6 Plus
  "iPhone8,1": ["750x1334"], // iPhone 6s
  "iPhone8,2": ["1080x1920"], // iPhone 6s Plus
  "iPhone8,4": ["640x1136"], // iPhone SE (1st Gen)

  "iPhone9,1": ["750x1334"], // iPhone 7
  "iPhone9,3": ["750x1334"], // iPhone 7
  "iPhone9,2": ["1080x1920"], // iPhone 7 Plus
  "iPhone9,4": ["1080x1920"], // iPhone 7 Plus

  "iPhone10,1": ["750x1334"], // iPhone 8
  "iPhone10,4": ["750x1334"], // iPhone 8
  "iPhone10,2": ["1080x1920"], // iPhone 8 Plus
  "iPhone10,5": ["1080x1920"], // iPhone 8 Plus
  "iPhone10,3": ["1125x2436"], // iPhone X (Global)
  "iPhone10,6": ["1125x2436"], // iPhone X (GSM)

  "iPhone11,2": ["1125x2436"], // iPhone XS
  "iPhone11,4": ["1242x2688"], // iPhone XS Max
  "iPhone11,6": ["1242x2688"], // iPhone XS Max (China)
  "iPhone11,8": ["828x1792"],  // iPhone XR

  "iPhone12,1": ["828x1792"],  // iPhone 11
  "iPhone12,3": ["1125x2436"], // iPhone 11 Pro
  "iPhone12,5": ["1242x2688"], // iPhone 11 Pro Max
  "iPhone12,8": ["750x1334"],  // iPhone SE (2nd Gen)

  "iPhone13,1": ["1080x2340"], // iPhone 12 mini
  "iPhone13,2": ["1170x2532"], // iPhone 12
  "iPhone13,3": ["1170x2532"], // iPhone 12 Pro
  "iPhone13,4": ["1284x2778"], // iPhone 12 Pro Max

  "iPhone14,4": ["1080x2340"], // iPhone 13 mini
  "iPhone14,5": ["1170x2532"], // iPhone 13
  "iPhone14,2": ["1170x2532"], // iPhone 13 Pro
  "iPhone14,3": ["1284x2778"], // iPhone 13 Pro Max

  "iPhone14,6": ["750x1334"],  // iPhone SE (3rd Gen)

  "iPhone14,7": ["1170x2532"], // iPhone 14
  "iPhone14,8": ["1284x2778"], // iPhone 14 Plus
  "iPhone15,2": ["1179x2556"], // iPhone 14 Pro
  "iPhone15,3": ["1290x2796"], // iPhone 14 Pro Max

  "iPhone15,4": ["1179x2556"], // iPhone 15
  "iPhone15,5": ["1290x2796"], // iPhone 15 Plus
  "iPhone16,1": ["1179x2556"], // iPhone 15 Pro
  "iPhone16,2": ["1290x2796"], // iPhone 15 Pro Max

  "iPhone17,3": ["1179x2556"], // iPhone 16
  "iPhone17,4": ["1290x2796"], // iPhone 16 Plus
  "iPhone17,1": ["1206x2622"], // iPhone 16 Pro
  "iPhone17,2": ["1320x2868"]  // iPhone 16 Pro Max
}


const SCREEN_SCALING_BY_MODEL = {
  "iPhone17,4": ["3.00"], // iPhone 16 Plus
  "iPhone17,3": ["3.00"], // iPhone 16
  "iPhone17,2": ["3.00"], // iPhone 16 Pro Max
  "iPhone17,1": ["3.00"], // iPhone 16 Pro
  "iPhone16,2": ["3.00"], // iPhone 15 Pro Max
  "iPhone16,1": ["3.00"], // iPhone 15 Plus
  "iPhone15,5": ["3.00"], // iPhone 15 Pro
  "iPhone15,4": ["3.00"], // iPhone 15 Plus
  "iPhone15,3": ["3.00"], // iPhone 15
  "iPhone15,2": ["3.00"], // iPhone 15 Pro Max
  "iPhone15,1": ["3.00"], // iPhone 15 Plus
  "iPhone14,5": ["3.00"],
  "iPhone14,4": ["3.00"],
  "iPhone14,3": ["3.00"],
  "iPhone14,2": ["3.00"],
  "iPhone13,4": ["3.00"],
  "iPhone13,3": ["3.00"],
  "iPhone13,2": ["3.00"],
  "iPhone13,1": ["3.00"],
  "iPhone12,8": ["3.00"],
  "iPhone12,5": ["3.00"],
  "iPhone12,3": ["3.00"],
  "iPhone12,1": ["2.00"],
  "iPhone11,8": ["2.00"], // iPhone XR
  "iPhone11,6": ["3.00"], // iPhone XS Max
  "iPhone11,4": ["3.00"], // iPhone XS Max
  "iPhone11,2": ["3.00"], // iPhone XS
  "iPhone10,6": ["2.00"], // iPhone X
  "iPhone10,3": ["3.00"], // iPhone X
}

const IOSVersionsContext = createContext()

const useIOSVersions = () => {
  return useContext(IOSVersionsContext)
}

const getModelIdFromName = (modelName) => {
  console.log("[v0] Original model name:", modelName)

  if (!modelName) return null

  // If the model name already contains the identifier (e.g., "iPhone14,5 (iPhone 14 Plus)")
  if (modelName.includes("iPhone") && modelName.includes(",")) {
    const match = modelName.match(/iPhone\d+,\d+/)
    if (match) {
      console.log("[v0] Extracted model ID:", match[0])
      return match[0]
    }
  }

  // If it's just the model name, try to map it to identifier
  const modelMapping = {
    "iPhone 14 Plus": "iPhone14,5",
    "iPhone 14": "iPhone14,4",
    "iPhone 14 Pro Max": "iPhone14,3",
    "iPhone 14 Pro": "iPhone14,2",
    "iPhone 12 Pro Max": "iPhone13,4",
    "iPhone 12 Pro": "iPhone13,3",
    "iPhone 12": "iPhone13,2",
    "iPhone 12 mini": "iPhone13,1",
    "iPhone SE 3rd gen": "iPhone12,8",
    "iPhone 11 Pro Max": "iPhone12,5",
    "iPhone 11 Pro": "iPhone12,3",
    "iPhone 11": "iPhone12,1",
    "iPhone XR": "iPhone11,8",
    "iPhone XS Max": "iPhone11,6",
    "iPhone XS": "iPhone11,2",
    "iPhone X": "iPhone10,6",
  }

  const mappedId = modelMapping[modelName]
  console.log("[v0] Mapped model ID:", mappedId)
  return mappedId
}

export default function IOSAdminPanel() {
  const [deviceModels, setDeviceModels] = useState([])
  const [iosVersions, setIosVersions] = useState([])
  const [appVersions, setAppVersions] = useState([])
  const [configurations, setConfigurations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("devices")
  const [activeAppTab, setActiveAppTab] = useState("instagram")

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: () => {},
    showCancel: false,
  })

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    onConfirm?: () => void,
    showCancel = false,
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => setModal((prev) => ({ ...prev, isOpen: false }))),
      showCancel,
    })
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Loading all data...")

      const [devices, ios, apps, configs] = await Promise.all([
        DeviceModel.list("-created_date"),
        IOSVersion.list("-created_date"),
        AppVersion.list("-created_date"),
        Configuration.list("-created_date"),
      ])

      console.log("Loaded devices:", devices)
      console.log("Loaded iOS versions:", ios)
      console.log("Loaded app versions:", apps)
      console.log("Loaded configurations:", configs)

      setDeviceModels(devices)
      setIosVersions(ios)
      setAppVersions(apps)
      setConfigurations(configs)

      if (devices.length === 0 && ios.length === 0 && apps.length === 0) {
        setError("কোন ডেটা পাওয়া যায়নি। দয়া করে sample data insert করুন।")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      showModal("❌ ডেটা লোড ব্যর্থ!", "ডেটা লোড করতে সমস্যা হয়েছে: " + error.message, "error")
      setError("ডেটা লোড করতে সমস্যা হয়েছে: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate usage percentages
  const calculateIOSUsage = () => {
    const activeVersions = iosVersions.filter((v) => v.is_active)
    const total = activeVersions.reduce((sum, v) => sum + (v.usage_percentage || 0), 0)
    return { total: Math.round(total * 100) / 100, count: activeVersions.length }
  }

  const calculateAppUsage = (appType) => {
    const activeVersions = appVersions.filter((v) => v.is_active && v.app_type === appType)
    const total = activeVersions.reduce((sum, v) => sum + (v.usage_percentage || 0), 0)
    return { total: Math.round(total * 100) / 100, count: activeVersions.length }
  }

  const iosUsage = calculateIOSUsage()
  const instagramUsage = calculateAppUsage("instagram")
  const facebookUsage = calculateAppUsage("facebook")

  // Device Model Functions
  const handleDeviceAdd = async (data) => {
    try {
      await DeviceModel.create(data)
      loadAllData()
      setShowAddDialog(false)
      showModal("✅ সফল!", "নতুন ডিভাইস মডেল যোগ করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "ডিভাইস মডেল যোগ করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleDeviceUpdate = async (id, data) => {
    try {
      await DeviceModel.update(id, data)
      loadAllData()
      setEditingItem(null)
      showModal("✅ সফল!", "ডিভাইস মডেল আপডেট করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "ডিভাইস মডেল আপডেট করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleDeviceDelete = async (id, deviceName) => {
    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${deviceName}" ডিভাইস মডেল মুছে ফেলতে চান?`,
      "warning",
      async () => {
        try {
          await DeviceModel.delete(id)
          loadAllData()
          showModal("✅ সফল!", "ডিভাইস মডেল মুছে ফেলা হয়েছে।", "success")
        } catch (error) {
          showModal("❌ ব্যর্থ!", "ডিভাইস মডেল মুছতে সমস্যা হয়েছে: " + error.message, "error")
        }
      },
      true,
    )
  }

  // iOS Version Functions
  const handleIOSAdd = async (data) => {
    try {
      await IOSVersion.create(data)
      loadAllData()
      setShowAddDialog(false)
      showModal("✅ সফল!", "নতুন iOS ভার্সন যোগ করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "iOS ভার্সন যোগ করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleIOSUpdate = async (id, data) => {
    try {
      await IOSVersion.update(id, data)
      loadAllData()
      setEditingItem(null)
      showModal("✅ সফল!", "iOS ভার্সন আপডেট করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "iOS ভার্সন আপডেট করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleIOSDelete = async (id, versionName) => {
    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${versionName}" iOS ভার্সন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        try {
          await IOSVersion.delete(id)
          loadAllData()
          showModal("✅ সফল!", "iOS ভার্সন মুছে ফেলা হয়েছে।", "success")
        } catch (error) {
          showModal("❌ ব্যর্থ!", "iOS ভার্সন মুছতে সমস্যা হয়েছে: " + error.message, "error")
        }
      },
      true,
    )
  }

  // App Version Functions
  const handleAppAdd = async (data) => {
    try {
      await AppVersion.create(data)
      loadAllData()
      setShowAddDialog(false)
      showModal("✅ সফল!", "নতুন অ্যাপ ভার্সন যোগ করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন যোগ করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleAppUpdate = async (id, data) => {
    try {
      await AppVersion.update(id, data)
      loadAllData()
      setEditingItem(null)
      showModal("✅ সফল!", "অ্যাপ ভার্সন আপডেট করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন আপডেট করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleAppDelete = async (id, appName, version) => {
    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${appName} ${version}" অ্যাপ ভার্সন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        try {
          await AppVersion.delete(id)
          loadAllData()
          showModal("✅ সফল!", "অ্যাপ ভার্সন মুছে ফেলা হয়েছে।", "success")
        } catch (error) {
          showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন মুছতে সমস্যা হয়েছে: " + error.message, "error")
        }
      },
      true,
    )
  }

  // Configuration Functions
  const handleConfigAdd = async (data) => {
    try {
      await Configuration.create(data)
      loadAllData()
      setShowAddDialog(false)
      showModal("✅ সফল!", "নতুন কনফিগারেশন যোগ করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "কনফিগারেশন যোগ করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleConfigUpdate = async (id, data) => {
    try {
      await Configuration.update(id, data)
      loadAllData()
      setEditingItem(null)
      showModal("✅ সফল!", "কনফিগারেশন আপডেট করা হয়েছে।", "success")
    } catch (error) {
      showModal("❌ ব্যর্থ!", "কনফিগারেশন আপডেট করতে সমস্যা হয়েছে: " + error.message, "error")
    }
  }

  const handleConfigDelete = async (id, configName) => {
    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${configName}" কনফিগারেশন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        try {
          await Configuration.delete(id)
          loadAllData()
          showModal("✅ সফল!", "কনফিগারেশন মুছে ফেলা হয়েছে।", "success")
        } catch (error) {
          showModal("❌ ব্যর্থ!", "কনফিগারেশন মুছতে সমস্যা হয়েছে: " + error.message, "error")
        }
      },
      true,
    )
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {loading ? (
          <AdminLoading message="অ্যাডমিন প্যানেল লোড হচ্ছে..." />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <IOSVersionsContext.Provider value={{ iosVersions }}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">অ্যাডমিন প্যানেল</h1>
                    <Button
                      onClick={loadAllData}
                      variant="outline"
                      size="sm"
                      className="bg-white/80 dark:bg-slate-800/80"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      রিফ্রেশ
                    </Button>
                  </div>
                  <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    ইউজার এজেন্ট জেনারেটরের সমস্ত কনফিগারেশন ডেটা পরিচালনা করুন
                  </p>

                  {/* Debug Info */}
                  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                    <p>
                      Debug: Devices: {deviceModels.length}, iOS: {iosVersions.length}, Apps: {appVersions.length}
                    </p>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto md:h-12 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <TabsTrigger
                      value="devices"
                      className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      ডিভাইস মডেল ({deviceModels.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="ios"
                      className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      iOS ভার্সন ({iosVersions.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="apps"
                      className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      অ্যাপ ভার্সন ({appVersions.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="configs"
                      className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      কনফিগারেশন ({configurations.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="devices" className="mt-6">
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                            <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            ডিভাইস মডেল
                          </CardTitle>
                          <Dialog open={showAddDialog && activeTab === "devices"} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                                <Plus className="w-4 h-4 mr-2" />
                                নতুন যোগ করুন
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-slate-800">
                              <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-slate-100">
                                  নতুন ডিভাইস মডেল যোগ করুন
                                </DialogTitle>
                              </DialogHeader>
                              <DeviceForm
                                onSubmit={handleDeviceAdd}
                                onCancel={() => setShowAddDialog(false)}
                                deviceModels={deviceModels}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {deviceModels.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-slate-500 dark:text-slate-400 mb-4">কোন ডিভাইস মডেল পাওয়া যায়নি</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                Supabase SQL Editor এ sample data script চালান
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {deviceModels.map((device) => (
                                <Card
                                  key={device.id}
                                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg"
                                >
                                  <CardContent className="p-4">
                                    {editingItem?.id === device.id ? (
                                      <DeviceEditForm
                                        device={device}
                                        onSave={(data) => handleDeviceUpdate(device.id, data)}
                                        onCancel={() => setEditingItem(null)}
                                        deviceModels={deviceModels} // deviceModels প্রপ পাস করা হয়েছে
                                      />
                                    ) : (
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                            {device.model_name}
                                          </h3>
                                          <p className="text-sm text-slate-600 dark:text-slate-300">
                                            iOS {device.min_ios_version} - {device.max_ios_version}
                                          </p>
                                          {device.resolutions && device.resolutions.length > 0 && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                              Resolutions: {device.resolutions.join(", ")}
                                            </p>
                                          )}
                                          {device.screen_scaling && device.screen_scaling.length > 0 && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                              Scaling: {device.screen_scaling.join(", ")}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant={device.is_active ? "default" : "secondary"}>
                                            {device.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                          </Badge>
                                          {editingItem?.id === device.id ? (
                                            <>
                                              <Button
                                                size="sm"
                                                onClick={() => handleDeviceUpdate(device.id, editingItem)}
                                              >
                                                <Save className="w-4 h-4" />
                                              </Button>
                                              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                                <X className="w-4 h-4" />
                                              </Button>
                                            </>
                                          ) : (
                                            <>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingItem(device)}
                                              >
                                                <Edit className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeviceDelete(device.id, device.model_name)}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ios" className="mt-6">
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            iOS ভার্সন
                          </CardTitle>
                          <Dialog open={showAddDialog && activeTab === "ios"} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                                <Plus className="w-4 h-4 mr-2" />
                                নতুন যোগ করুন
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-slate-800">
                              <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-slate-100">
                                  নতুন iOS ভার্সন যোগ করুন
                                </DialogTitle>
                              </DialogHeader>
                              <IOSForm
                                onSubmit={handleIOSAdd}
                                onCancel={() => setShowAddDialog(false)}
                                iosVersions={iosVersions}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>

                      {/* Usage Percentage Summary */}
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${iosUsage.total === 100 ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}
                            >
                              {iosUsage.total === 100 ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                মোট Usage: {iosUsage.total}%
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {iosUsage.count} টি সক্রিয় ভার্সন
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Progress value={Math.min(iosUsage.total, 100)} className="w-32 h-2 mb-1" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {iosUsage.total === 100 ? "✅ সঠিক" : `⚠️ ${100 - iosUsage.total}% বাকি`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {iosVersions.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-slate-500 dark:text-slate-400 mb-4">কোন iOS ভার্সন পাওয়া যায়নি</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                Supabase SQL Editor এ sample data script চালান
                              </p>
                            </div>
                          ) : (
                            iosVersions.map((ios) => (
                              <div
                                key={ios.id}
                                className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                              >
                                {editingItem?.id === ios.id ? (
                                  <IOSEditForm
                                    ios={ios}
                                    onSave={(data) => handleIOSUpdate(ios.id, data)}
                                    onCancel={() => setEditingItem(null)}
                                    iosVersions={iosVersions}
                                  />
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                        iOS {ios.version}
                                      </h3>
                                      <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Build: {ios.build_number} | WebKit: {ios.webkit_version}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Progress value={ios.usage_percentage || 0} className="flex-1 h-2" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem]">
                                          {ios.usage_percentage}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <Badge variant={ios.is_active ? "default" : "secondary"}>
                                        {ios.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                      </Badge>
                                      <Button variant="ghost" size="sm" onClick={() => setEditingItem(ios)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleIOSDelete(ios.id, ios.version)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="apps" className="mt-6">
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          অ্যাপ ভার্সন ম্যানেজমেন্ট
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-6">
                        <Tabs value={activeAppTab} onValueChange={setActiveAppTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                            <TabsTrigger
                              value="instagram"
                              className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                              <Instagram className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                              Instagram ({appVersions.filter((v) => v.app_type === "instagram").length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="facebook"
                              className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                              <Facebook className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Facebook ({appVersions.filter((v) => v.app_type === "facebook").length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="instagram" className="mt-0">
                            {/* Instagram Usage Summary */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border border-pink-200 dark:border-pink-800">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full ${instagramUsage.total === 100 ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}
                                  >
                                    {instagramUsage.total === 100 ? (
                                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                      Instagram মোট Usage: {instagramUsage.total}%
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                      {instagramUsage.count} টি সক্রিয় ভার্সন
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <Progress value={Math.min(instagramUsage.total, 100)} className="w-32 h-2 mb-1" />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {instagramUsage.total === 100
                                        ? "✅ সঠিক"
                                        : `⚠️ ${100 - instagramUsage.total}% বাকি`}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Instagram যোগ করুন
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white dark:bg-slate-800">
                                      <DialogHeader>
                                        <DialogTitle className="text-slate-900 dark:text-slate-100">
                                          নতুন Instagram ভার্সন যোগ করুন
                                        </DialogTitle>
                                      </DialogHeader>
                                      <AppForm
                                        appType="instagram"
                                        onSubmit={handleAppAdd}
                                        onCancel={() => setShowAddDialog(false)}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>

                            <AppVersionList
                              appVersions={appVersions.filter((v) => v.app_type === "instagram")}
                              onEdit={setEditingItem}
                              onDelete={handleAppDelete}
                              onUpdate={handleAppUpdate}
                              editingItem={editingItem}
                            />
                          </TabsContent>

                          <TabsContent value="facebook" className="mt-0">
                            {/* Facebook Usage Summary */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full ${facebookUsage.total === 100 ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}
                                  >
                                    {facebookUsage.total === 100 ? (
                                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                      Facebook মোট Usage: {facebookUsage.total}%
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                      {facebookUsage.count} টি সক্রিয় ভার্সন
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <Progress value={Math.min(facebookUsage.total, 100)} className="w-32 h-2 mb-1" />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {facebookUsage.total === 100 ? "✅ সঠিক" : `⚠️ ${100 - facebookUsage.total}% বাকি`}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Facebook যোগ করুন
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white dark:bg-slate-800">
                                      <DialogHeader>
                                        <DialogTitle className="text-slate-900 dark:text-slate-100">
                                          নতুন Facebook ভার্সন যোগ করুন
                                        </DialogTitle>
                                      </DialogHeader>
                                      <AppForm
                                        appType="facebook"
                                        onSubmit={handleAppAdd}
                                        onCancel={() => setShowAddDialog(false)}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>

                            <AppVersionList
                              appVersions={appVersions.filter((v) => v.app_type === "facebook")}
                              onEdit={setEditingItem}
                              onDelete={handleAppDelete}
                              onUpdate={handleAppUpdate}
                              editingItem={editingItem}
                            />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="configs" className="mt-6">
                    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            কনফিগারেশন ম্যানেজমেন্ট
                          </CardTitle>
                          <Dialog open={showAddDialog && activeTab === "configs"} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                                <Plus className="w-4 h-4 mr-2" />
                                নতুন কনফিগ যোগ করুন
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-slate-800">
                              <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-slate-100">
                                  নতুন কনফিগারেশন যোগ করুন
                                </DialogTitle>
                              </DialogHeader>
                              <ConfigForm onSubmit={handleConfigAdd} onCancel={() => setShowAddDialog(false)} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {configurations.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-slate-500 dark:text-slate-400 mb-4">কোন কনফিগারেশন পাওয়া যায়নি</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                Supabase SQL Editor এ sample data script চালান
                              </p>
                            </div>
                          ) : (
                            configurations.map((config) => (
                              <div
                                key={config.id}
                                className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                              >
                                {editingItem?.id === config.id ? (
                                  <ConfigEditForm
                                    config={config}
                                    onSave={(data) => handleConfigUpdate(config.id, data)}
                                    onCancel={() => setEditingItem(null)}
                                  />
                                ) : (
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                        {config.config_key}
                                      </h3>
                                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                        {config.description}
                                      </p>
                                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                                        <code className="text-xs text-slate-700 dark:text-slate-300 break-all">
                                          {config.config_value}
                                        </code>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <Button variant="ghost" size="sm" onClick={() => setEditingItem(config)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleConfigDelete(config.id, config.config_key)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <CustomModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                showCancel={modal.showCancel}
              />
            </IOSVersionsContext.Provider>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

// Enhanced Form Components with Dropdowns
function DeviceForm({ onSubmit, onCancel, deviceModels }) {
  const [formData, setFormData] = useState({
    model_name: "",
    min_ios_version: "",
    max_ios_version: "",
    usage_percentage: 10,
    is_active: true,
  })

  const availableModels = DEVICE_MODELS.filter(
    (model) => !deviceModels.some((existing) => existing.model_name === model),
  )

  const getAvailableMaxVersions = () => {
    if (!formData.min_ios_version) {
      return IOS_VERSIONS
    }

    const minVersionIndex = IOS_VERSIONS.indexOf(formData.min_ios_version)
    if (minVersionIndex === -1) {
      return IOS_VERSIONS
    }

    // Return versions from selected min version onwards (including the min version)
    return IOS_VERSIONS.slice(0, minVersionIndex + 1)
  }

  const handleMinVersionChange = (value) => {
    const newFormData = { ...formData, min_ios_version: value }

    // If max version is selected and it's lower than new min version, reset it
    if (formData.max_ios_version) {
      const minIndex = IOS_VERSIONS.indexOf(value)
      const maxIndex = IOS_VERSIONS.indexOf(formData.max_ios_version)

      if (maxIndex > minIndex) {
        newFormData.max_ios_version = ""
      }
    }

    setFormData(newFormData)
  }

  const handleModelChange = (modelName) => {
    console.log("[v0] Model changed to:", modelName)

    const modelId = getModelIdFromName(modelName)
    console.log("[v0] Extracted model ID:", modelId)

    // Get resolutions and screen scaling for this model
    const resolutions = RESOLUTIONS_BY_MODEL[modelId] || []
    const screenScaling = SCREEN_SCALING_BY_MODEL[modelId] || []

    console.log("[v0] Found resolutions:", resolutions)
    console.log("[v0] Found screen scaling:", screenScaling)

    setFormData({
      ...formData,
      model_name: modelName,
      resolutions: resolutions,
      screen_scaling: screenScaling,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getCurrentModelResolutions = () => {
    if (!formData.model_name) return []
    const modelId = getModelIdFromName(formData.model_name)
    const resolutions = RESOLUTIONS_BY_MODEL[modelId] || []
    console.log("[v0] Getting current resolutions for:", modelId, "->", resolutions)
    return resolutions
  }

  const getCurrentModelScaling = () => {
    if (!formData.model_name) return []
    const modelId = getModelIdFromName(formData.model_name)
    const scaling = SCREEN_SCALING_BY_MODEL[modelId] || []
    console.log("[v0] Getting current scaling for:", modelId, "->", scaling)
    return scaling
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="model_name">মডেল নাম</Label>
        <Select value={formData.model_name || undefined} onValueChange={(modelName) => handleModelChange(modelName)}>
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="মডেল নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {availableModels.length === 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">সব ডিভাইস মডেল ইতিমধ্যে যোগ করা হয়েছে</p>
        )}

        {formData.model_name && (
          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">রেজোলিউশন তথ্য:</p>
            {getCurrentModelResolutions().length > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium">রেজোলিউশন:</span> {getCurrentModelResolutions().join(", ")}
              </p>
            )}
            {getCurrentModelScaling().length > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium">স্কেলিং:</span> {getCurrentModelScaling().join(", ")}
              </p>
            )}
            {getCurrentModelResolutions().length === 0 && getCurrentModelScaling().length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">রেজোলিউশন তথ্য পাওয়া যায়নি</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_ios_version">সর্বনিম্ন iOS ভার্সন</Label>
          <Select value={formData.min_ios_version || undefined} onValueChange={handleMinVersionChange}>
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue placeholder="নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  iOS {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="max_ios_version">সর্বোচ্চ iOS ভার্সন</Label>
          <Select
            value={formData.max_ios_version || undefined}
            onValueChange={(value) => setFormData({ ...formData, max_ios_version: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue placeholder="নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableMaxVersions().map((version) => (
                <SelectItem key={version} value={version}>
                  iOS {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.min_ios_version && formData.max_ios_version && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            এই ডিভাইসটি iOS {formData.min_ios_version} থেকে iOS {formData.max_ios_version} পর্যন্ত সাপোর্ট করবে
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="usage_percentage">ব্যবহারের শতাংশ</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="1"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseInt(e.target.value) || 10 })}
          className="bg-white dark:bg-slate-700"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function DeviceEditForm({ device, onSave, onCancel, deviceModels }) {
  const [formData, setFormData] = useState({
    model_name: device.model_name,
    min_ios_version: device.min_ios_version,
    max_ios_version: device.max_ios_version,
    usage_percentage: device.usage_percentage || 10,
    is_active: device.is_active,
  })

  const availableModels = DEVICE_MODELS.filter(
    (model) => model === device.model_name || !deviceModels.some((existing) => existing.model_name === model),
  )

  const getAvailableMaxVersions = () => {
    if (!formData.min_ios_version) {
      return IOS_VERSIONS
    }

    const minVersionIndex = IOS_VERSIONS.indexOf(formData.min_ios_version)
    if (minVersionIndex === -1) {
      return IOS_VERSIONS
    }

    // Return versions from selected min version onwards (including the min version)
    return IOS_VERSIONS.slice(0, minVersionIndex + 1)
  }

  const handleMinVersionChange = (value) => {
    const newFormData = { ...formData, min_ios_version: value }

    // If max version is selected and it's lower than new min version, reset it
    if (formData.max_ios_version) {
      const minIndex = IOS_VERSIONS.indexOf(value)
      const maxIndex = IOS_VERSIONS.indexOf(formData.max_ios_version)

      if (maxIndex > minIndex) {
        newFormData.max_ios_version = ""
      }
    }

    setFormData(newFormData)
  }

  const handleModelChange = (modelName) => {
    console.log("[v0] Edit form - Model changed to:", modelName)

    const modelId = getModelIdFromName(modelName)
    console.log("[v0] Edit form - Extracted model ID:", modelId)

    // Get resolutions and screen scaling for this model
    const resolutions = RESOLUTIONS_BY_MODEL[modelId] || []
    const screenScaling = SCREEN_SCALING_BY_MODEL[modelId] || []

    console.log("[v0] Edit form - Found resolutions:", resolutions)
    console.log("[v0] Edit form - Found screen scaling:", screenScaling)

    setFormData({
      ...formData,
      model_name: modelName,
      resolutions: resolutions,
      screen_scaling: screenScaling,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const getCurrentModelResolutions = () => {
    const modelId = getModelIdFromName(formData.model_name)
    const resolutions = RESOLUTIONS_BY_MODEL[modelId] || []
    console.log("[v0] Edit form - Getting current resolutions for:", modelId, "->", resolutions)
    return resolutions
  }

  const getCurrentModelScaling = () => {
    const modelId = getModelIdFromName(formData.model_name)
    const scaling = SCREEN_SCALING_BY_MODEL[modelId] || []
    console.log("[v0] Edit form - Getting current scaling for:", modelId, "->", scaling)
    return scaling
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="model_name">মডেল নাম</Label>
          <Select value={formData.model_name || undefined} onValueChange={(modelName) => handleModelChange(modelName)}>
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">সক্রিয়</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="usage_percentage">ব্যবহারের শতাংশ</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="1"
          max="100"
          step="0.1"
          value={formData.usage_percentage || 10}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseInt(e.target.value) || 10 })}
          className="bg-white dark:bg-slate-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_ios_version">সর্বনিম্ন iOS</Label>
          <Select value={formData.min_ios_version || undefined} onValueChange={handleMinVersionChange}>
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  iOS {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="max_ios_version">সর্বোচ্চ iOS</Label>
          <Select
            value={formData.max_ios_version || undefined}
            onValueChange={(value) => setFormData({ ...formData, max_ios_version: value })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IOS_VERSIONS.map((version) => (
                <SelectItem key={version} value={version}>
                  iOS {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">রেজোলিউশন & স্ক্রিন স্কেলিং:</h4>
        {getCurrentModelResolutions().length > 0 && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">রেজোলিউশন:</span> {getCurrentModelResolutions().join(", ")}
          </p>
        )}
        {getCurrentModelScaling().length > 0 && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">স্ক্রিন স্কেলিং:</span> {getCurrentModelScaling().join(", ")}
          </p>
        )}
        {getCurrentModelResolutions().length === 0 && getCurrentModelScaling().length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">এই মডেলের জন্য রেজোলিউশন তথ্য পাওয়া যায়নি</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          সংরক্ষণ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          বাতিল
        </Button>
      </div>
    </form>
  )
}

function IOSForm({ onSubmit, onCancel, iosVersions }) {
  const [formData, setFormData] = useState({
    version: "",
    build_number: "",
    webkit_version: "605.1.15",
    usage_percentage: 10,
    is_active: true,
  })

  const availableVersions = IOS_VERSIONS.filter((version) => !iosVersions.some((ios) => ios.version === version))

  const handleVersionChange = (version) => {
    const buildNumber = BUILD_NUMBERS[version] || ""
    setFormData({
      ...formData,
      version,
      build_number: buildNumber,
    })
  }

  const availableBuildNumber = formData.version ? BUILD_NUMBERS[formData.version] : null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="version">ভার্সন</Label>
        <Select value={formData.version || undefined} onValueChange={(version) => handleVersionChange(version)}>
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="iOS ভার্সন নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {availableVersions.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
            {availableVersions.length === 0 && (
              <div className="px-2 py-1 text-sm text-muted-foreground">সব ভার্সন ইতিমধ্যে যোগ করা হয়েছে</div>
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="build_number">বিল্ড নম্বর</Label>
        <Input
          value={formData.build_number}
          readOnly
          className="bg-gray-50 dark:bg-slate-600"
          placeholder={formData.version ? availableBuildNumber || "বিল্ড নম্বর পাওয়া যায়নি" : "প্রথমে ভার্সন নির্বাচন করুন"}
        />
      </div>
      <div>
        <Label htmlFor="webkit_version">WebKit ভার্সন</Label>
        <Input
          type="text"
          value="605.1.15"
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <Label htmlFor="usage_percentage">ব্যবহারের শতাংশ</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function IOSEditForm({ ios, onSave, onCancel, iosVersions }) {
  const [formData, setFormData] = useState({
    version: ios.version,
    build_number: ios.build_number,
    webkit_version: ios.webkit_version,
    usage_percentage: ios.usage_percentage,
    is_active: ios.is_active,
  })

  const availableVersions = IOS_VERSIONS.filter(
    (version) => version === ios.version || !iosVersions.some((existing) => existing.version === version),
  )

  const handleVersionChange = (version) => {
    const buildNumber = BUILD_NUMBERS[version] || ""
    setFormData({
      ...formData,
      version,
      build_number: buildNumber,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="version">ভার্সন</Label>
        <Select value={formData.version || undefined} onValueChange={(version) => handleVersionChange(version)}>
          <SelectTrigger className="bg-white dark:bg-slate-700">
            <SelectValue placeholder="iOS ভার্সন নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            {availableVersions.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="build_number">বিল্ড নম্বর</Label>
        <Input
          value={formData.build_number}
          readOnly
          className="bg-gray-50 dark:bg-slate-600"
          placeholder="বিল্ড নম্বর"
        />
      </div>
      <div>
        <Label htmlFor="webkit_version">WebKit ভার্সন</Label>
        <Input
          type="text"
          value="605.1.15"
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <Label htmlFor="usage_percentage">ব্যবহার %</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">সক্রিয়</Label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            সংরক্ষণ
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            বাতিল
          </Button>
        </div>
      </div>
    </form>
  )
}

function AppForm({ appType, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    app_type: appType,
    version: "",
    build_number: "",
    fbrv: null,
    usage_percentage: 10,
    is_active: true,
  })

  const handleFbrvChange = (value) => {
    setFormData({ ...formData, fbrv: value || null })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="version">ভার্সন</Label>
        <Input
          id="version"
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          placeholder={appType === "instagram" ? "389.0.0.49.87" : "518.0.0.52.100"}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div>
        <Label htmlFor="build_number">বিল্ড নম্বর</Label>
        <Input
          id="build_number"
          value={formData.build_number}
          onChange={(e) => setFormData({ ...formData, build_number: e.target.value })}
          placeholder={appType === "instagram" ? "379506944" : "518052100"}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      {appType === "facebook" && (
        <div>
          <Label htmlFor="fbrv">FBRV (ঐচ্ছিক)</Label>
          <Input
            id="fbrv"
            value={formData.fbrv || ""}
            onChange={(e) => handleFbrvChange(e.target.value)}
            placeholder="752257486 বা আংশিক যেমন 75, 752, 75225"
            className="bg-white dark:bg-slate-700"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            পূর্ণ FBRV দিলে সেটি ব্যবহার হবে, আংশিক দিলে বাকি অংশ র‍্যান্ডম হবে
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="usage_percentage">ব্যবহারের শতাংশ</Label>
        <Input
          id="usage_percentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.usage_percentage}
          onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function AppVersionList({ appVersions, onEdit, onDelete, onUpdate, editingItem }) {
  return (
    <div className="space-y-4">
      {appVersions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400 mb-4">কোন অ্যাপ ভার্সন পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Supabase SQL Editor এ sample data script চালান</p>
        </div>
      ) : (
        appVersions.map((app) => (
          <div
            key={app.id}
            className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
          >
            {editingItem?.id === app.id ? (
              <AppEditForm app={app} onSave={(data) => onUpdate(app.id, data)} onCancel={() => onEdit(null)} />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{app.version}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Build: {app.build_number}
                    {app.app_type === "facebook" && app.fbrv && <> | FBRV: {app.fbrv}</>}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={app.usage_percentage || 0} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem]">
                      {app.usage_percentage}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={app.is_active ? "default" : "secondary"}>{app.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(app)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(app.id, app.app_type, app.version)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function AppEditForm({ app, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    app_type: app.app_type,
    version: app.version,
    build_number: app.build_number,
    fbrv: app.fbrv,
    usage_percentage: app.usage_percentage,
    is_active: app.is_active,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleFbrvChange = (value) => {
    setFormData({ ...formData, fbrv: value || null })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="version">ভার্সন</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
        <div>
          <Label htmlFor="build_number">বিল্ড</Label>
          <Input
            id="build_number"
            value={formData.build_number}
            onChange={(e) => setFormData({ ...formData, build_number: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
      </div>

      {formData.app_type === "facebook" && (
        <div>
          <Label htmlFor="fbrv">FBRV</Label>
          <Input
            id="fbrv"
            value={formData.fbrv || ""}
            onChange={(e) => handleFbrvChange(e.target.value)}
            placeholder="752257486 বা আংশিক"
            className="bg-white dark:bg-slate-700"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usage_percentage">ব্যবহার %</Label>
          <Input
            id="usage_percentage"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.usage_percentage}
            onChange={(e) => setFormData({ ...formData, usage_percentage: Number.parseFloat(e.target.value) })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">সক্রিয়</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          সংরক্ষণ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          বাতিল
        </Button>
      </div>
    </form>
  )
}

function ConfigForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    config_key: "",
    config_value: "",
    description: "",
  })

  const [arrayItems, setArrayItems] = useState([])
  const [currentItem, setCurrentItem] = useState("")
  const [isArrayType, setIsArrayType] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalValue = isArrayType ? JSON.stringify(arrayItems) : formData.config_value
    onSubmit({
      ...formData,
      config_value: finalValue,
    })
  }

  const addArrayItem = () => {
    if (currentItem.trim()) {
      setArrayItems([...arrayItems, currentItem.trim()])
      setCurrentItem("")
    }
  }

  const removeArrayItem = (index) => {
    setArrayItems(arrayItems.filter((_, i) => i !== index))
  }

  const handleArrayTypeChange = (checked) => {
    setIsArrayType(checked)
    if (checked) {
      setFormData({ ...formData, config_value: "" })
      setArrayItems([])
    } else {
      setArrayItems([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="config_key">কনফিগ কী</Label>
        <Input
          id="config_key"
          value={formData.config_key}
          onChange={(e) => setFormData({ ...formData, config_key: e.target.value })}
          placeholder="যেমন: FBLC_VALUES"
          className="bg-white dark:bg-slate-700"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="array_type" checked={isArrayType} onCheckedChange={handleArrayTypeChange} />
        <Label htmlFor="array_type">অ্যারে টাইপ</Label>
      </div>

      {isArrayType ? (
        <div>
          <Label>কনফিগ ভ্যালু (অ্যারে)</Label>
          <div className="flex gap-2">
            <Input
              value={currentItem}
              onChange={(e) => setCurrentItem(e.target.value)}
              placeholder="আইটেম যোগ করুন"
              className="bg-white dark:bg-slate-700"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem())}
            />
            <Button type="button" onClick={addArrayItem} size="sm">
              যোগ করুন
            </Button>
          </div>

          <div className="mt-2 space-y-1">
            {arrayItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded">
                <span className="text-sm">{item}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem(index)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {arrayItems.length > 0 && (
            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Label className="text-xs text-slate-500 dark:text-slate-400">JSON প্রিভিউ:</Label>
              <code className="text-xs text-slate-700 dark:text-slate-300 block mt-1 break-all">
                {JSON.stringify(arrayItems)}
              </code>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Label htmlFor="config_value">কনফিগ ভ্যালু</Label>
          <Input
            id="config_value"
            value={formData.config_value}
            onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
            placeholder='যেমন: {"en_US": 90, "es_US": 10}'
            className="bg-white dark:bg-slate-700"
            required
          />
          {formData.config_key === "languages" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ভাষার শতাংশ ফরম্যাট: {`{"en_US": 90, "es_US": 10}`} (মোট ১০০% হতে হবে)
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="এই কনফিগারেশনের বিবরণ"
          className="bg-white dark:bg-slate-700"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button type="submit">সংরক্ষণ করুন</Button>
      </DialogFooter>
    </form>
  )
}

function ConfigEditForm({ config, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    config_key: config.config_key,
    config_value: config.config_value,
    description: config.description || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="config_key">কনফিগ কী</Label>
          <Input
            id="config_key"
            value={formData.config_key}
            onChange={(e) => setFormData({ ...formData, config_key: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
        <div>
          <Label htmlFor="config_value">কনফিগ ভ্যালু</Label>
          <Input
            id="config_value"
            value={formData.config_value}
            onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
            className="bg-white dark:bg-slate-700"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">বিবরণ</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white dark:bg-slate-700"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          সংরক্ষণ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          বাতিল
        </Button>
      </div>
    </form>
  )
}
