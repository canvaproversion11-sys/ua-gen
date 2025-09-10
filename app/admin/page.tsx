"use client"

import AuthGuard from "@/components/AuthGuard"
import { useState, useEffect, useRef } from "react"
import { DeviceModel, IOSVersion, AppVersion, Configuration } from "@/lib/supabase"
import { Smartphone, Settings, Plus, Edit, Trash2, Save, X, Apple, Instagram, Facebook } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CustomModal } from "@/components/CustomModal"
import AdminLoading from "@/components/AdminLoading"

export default function AdminPanel() {
  const isMountedRef = useRef(true)

  const [activeTab, setActiveTab] = useState("devices")

  // Device Models State
  const [deviceModels, setDeviceModels] = useState([])
  const [editingDevice, setEditingDevice] = useState(null)
  const [newDevice, setNewDevice] = useState({
    model_name: "",
    min_ios_version: "",
    max_ios_version: "",
    resolutions: ["828x1792"],
    screen_scaling: ["2.00"],
    is_active: true,
  })

  // iOS Versions State
  const [iosVersions, setIOSVersions] = useState([])
  const [editingIOSVersion, setEditingIOSVersion] = useState(null)
  const [newIOSVersion, setNewIOSVersion] = useState({
    version: "",
    build_number: "",
    webkit_version: "605.1.15",
    usage_percentage: 10,
    is_active: true,
  })

  // App Versions State
  const [appVersions, setAppVersions] = useState([])
  const [editingAppVersion, setEditingAppVersion] = useState(null)
  const [newAppVersion, setNewAppVersion] = useState({
    app_type: "instagram",
    version: "",
    build_number: "",
    fbrv: "",
    usage_percentage: 10,
    is_active: true,
  })

  // Configuration State
  const [configurations, setConfigurations] = useState([])
  const [editingConfig, setEditingConfig] = useState(null)
  const [newConfig, setNewConfig] = useState({
    config_key: "",
    config_value: "",
    description: "",
  })

  const [loading, setLoading] = useState(true)
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
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const savedTab = localStorage.getItem("admin-active-tab")
    if (savedTab && ["devices", "ios", "apps", "config"].includes(savedTab)) {
      setActiveTab(savedTab)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem("admin-active-tab", value)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!isMountedRef.current) return

    try {
      setLoading(true)
      const [devices, versions, apps, configs] = await Promise.all([
        DeviceModel.list(),
        IOSVersion.list(),
        AppVersion.list(),
        Configuration.list(),
      ])

      if (isMountedRef.current) {
        setDeviceModels(devices)
        setIOSVersions(versions)
        setAppVersions(apps)
        setConfigurations(configs)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      if (isMountedRef.current) {
        showModal("❌ ডেটা লোড ব্যর্থ!", "ডেটা লোড করতে সমস্যা হয়েছে।", "error")
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  // Device Model Functions
  const handleSaveDevice = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingDevice) {
        await DeviceModel.update(editingDevice.id, editingDevice)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "ডিভাইস মডেল আপডেট করা হয়েছে।", "success")
        }
      } else {
        await DeviceModel.create(newDevice)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন ডিভাইস মডেল যোগ করা হয়েছে।", "success")
          setNewDevice({
            model_name: "",
            min_ios_version: "",
            max_ios_version: "",
            resolutions: ["828x1792"],
            screen_scaling: ["2.00"],
            is_active: true,
          })
        }
      }
      if (isMountedRef.current) {
        setEditingDevice(null)
        loadData()
      }
    } catch (error) {
      console.error("Error saving device:", error)
      if (isMountedRef.current) {
        showModal("❌ ব্যর্থ!", "ডিভাইস মডেল সেভ করতে সমস্যা হয়েছে।", "error")
      }
    }
  }

  const handleDeleteDevice = async (device) => {
    if (!isMountedRef.current) return

    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${device.model_name}" ডিভাইস মডেল মুছে ফেলতে চান?`,
      "warning",
      async () => {
        if (!isMountedRef.current) return

        try {
          await DeviceModel.delete(device.id)
          if (isMountedRef.current) {
            showModal("✅ সফল!", "ডিভাইস মডেল মুছে ফেলা হয়েছে।", "success")
            loadData()
          }
        } catch (error) {
          console.error("Error deleting device:", error)
          if (isMountedRef.current) {
            showModal("❌ ব্যর্থ!", "ডিভাইস মডেল মুছতে সমস্যা হয়েছে।", "error")
          }
        }
      },
      true,
    )
  }

  // iOS Version Functions
  const handleSaveIOSVersion = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingIOSVersion) {
        await IOSVersion.update(editingIOSVersion.id, editingIOSVersion)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "iOS ভার্সন আপডেট করা হয়েছে।", "success")
        }
      } else {
        await IOSVersion.create(newIOSVersion)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন iOS ভার্সন যোগ করা হয়েছে।", "success")
          setNewIOSVersion({
            version: "",
            build_number: "",
            webkit_version: "605.1.15",
            usage_percentage: 10,
            is_active: true,
          })
        }
      }
      if (isMountedRef.current) {
        setEditingIOSVersion(null)
        loadData()
      }
    } catch (error) {
      console.error("Error saving iOS version:", error)
      if (isMountedRef.current) {
        showModal("❌ ব্যর্থ!", "iOS ভার্সন সেভ করতে সমস্যা হয়েছে।", "error")
      }
    }
  }

  const handleDeleteIOSVersion = async (version) => {
    if (!isMountedRef.current) return

    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${version.version}" iOS ভার্সন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        if (!isMountedRef.current) return

        try {
          await IOSVersion.delete(version.id)
          if (isMountedRef.current) {
            showModal("✅ সফল!", "iOS ভার্সন মুছে ফেলা হয়েছে।", "success")
            loadData()
          }
        } catch (error) {
          console.error("Error deleting iOS version:", error)
          if (isMountedRef.current) {
            showModal("❌ ব্যর্থ!", "iOS ভার্সন মুছতে সমস্যা হয়েছে।", "error")
          }
        }
      },
      true,
    )
  }

  // App Version Functions
  const handleSaveAppVersion = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingAppVersion) {
        await AppVersion.update(editingAppVersion.id, editingAppVersion)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "অ্যাপ ভার্সন আপডেট করা হয়েছে।", "success")
        }
      } else {
        await AppVersion.create(newAppVersion)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন অ্যাপ ভার্সন যোগ করা হয়েছে।", "success")
          setNewAppVersion({
            app_type: "instagram",
            version: "",
            build_number: "",
            fbrv: "",
            usage_percentage: 10,
            is_active: true,
          })
        }
      }
      if (isMountedRef.current) {
        setEditingAppVersion(null)
        loadData()
      }
    } catch (error) {
      console.error("Error saving app version:", error)
      if (isMountedRef.current) {
        showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন সেভ করতে সমস্যা হয়েছে।", "error")
      }
    }
  }

  const handleDeleteAppVersion = async (app) => {
    if (!isMountedRef.current) return

    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${app.app_type} ${app.version}" অ্যাপ ভার্সন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        if (!isMountedRef.current) return

        try {
          await AppVersion.delete(app.id)
          if (isMountedRef.current) {
            showModal("✅ সফল!", "অ্যাপ ভার্সন মুছে ফেলা হয়েছে।", "success")
            loadData()
          }
        } catch (error) {
          console.error("Error deleting app version:", error)
          if (isMountedRef.current) {
            showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন মুছতে সমস্যা হয়েছে।", "error")
          }
        }
      },
      true,
    )
  }

  // Configuration Functions
  const handleSaveConfig = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingConfig) {
        await Configuration.update(editingConfig.id, editingConfig)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "কনফিগারেশন আপডেট করা হয়েছে।", "success")
        }
      } else {
        await Configuration.create(newConfig)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন কনফিগারেশন যোগ করা হয়েছে।", "success")
          setNewConfig({
            config_key: "",
            config_value: "",
            description: "",
          })
        }
      }
      if (isMountedRef.current) {
        setEditingConfig(null)
        loadData()
      }
    } catch (error) {
      console.error("Error saving config:", error)
      if (isMountedRef.current) {
        showModal("❌ ব্যর্থ!", "কনফিগারেশন সেভ করতে সমস্যা হয়েছে।", "error")
      }
    }
  }

  const handleDeleteConfig = async (config) => {
    if (!isMountedRef.current) return

    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${config.config_key}" কনফিগারেশন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        if (!isMountedRef.current) return

        try {
          await Configuration.delete(config.id)
          if (isMountedRef.current) {
            showModal("✅ সফল!", "কনফিগারেশন মুছে ফেলা হয়েছে।", "success")
            loadData()
          }
        } catch (error) {
          console.error("Error deleting config:", error)
          if (isMountedRef.current) {
            showModal("❌ ব্যর্থ!", "কনফিগারেশন মুছতে সমস্যা হয়েছে।", "error")
          }
        }
      },
      true,
    )
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {loading ? (
          <AdminLoading message="অ্যাডমিন প্যানেল লোড হচ্ছে..." />
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-4 py-2 rounded-full mb-4">
                <Apple className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">iOS ম্যানেজমেন্ট</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                iOS অ্যাডমিন প্যানেল
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                iOS ডিভাইস মডেল, ভার্সন এবং অ্যাপ কনফিগারেশন পরিচালনা করুন
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="devices">ডিভাইস মডেল</TabsTrigger>
                <TabsTrigger value="ios">iOS ভার্সন</TabsTrigger>
                <TabsTrigger value="apps">অ্যাপ ভার্সন</TabsTrigger>
                <TabsTrigger value="config">কনফিগারেশন</TabsTrigger>
              </TabsList>

              {/* Device Models Tab */}
              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      iOS ডিভাইস মডেল ({deviceModels.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New Device */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h3 className="font-semibold mb-4">নতুন ডিভাইস মডেল যোগ করুন</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>মডেল নাম</Label>
                          <Input
                            value={newDevice.model_name}
                            onChange={(e) => setNewDevice({ ...newDevice, model_name: e.target.value })}
                            placeholder="iPhone 15 Pro Max"
                          />
                        </div>
                        <div>
                          <Label>সর্বনিম্ন iOS ভার্সন</Label>
                          <Input
                            value={newDevice.min_ios_version}
                            onChange={(e) => setNewDevice({ ...newDevice, min_ios_version: e.target.value })}
                            placeholder="15.0"
                          />
                        </div>
                        <div>
                          <Label>সর্বোচ্চ iOS ভার্সন</Label>
                          <Input
                            value={newDevice.max_ios_version}
                            onChange={(e) => setNewDevice({ ...newDevice, max_ios_version: e.target.value })}
                            placeholder="17.2"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={handleSaveDevice} className="w-full md:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          যোগ করুন
                        </Button>
                      </div>
                    </div>

                    {/* Device List */}
                    <div className="space-y-2">
                      {deviceModels.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                        >
                          {editingDevice?.id === device.id ? (
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <Input
                                value={editingDevice.model_name}
                                onChange={(e) => setEditingDevice({ ...editingDevice, model_name: e.target.value })}
                              />
                              <Input
                                value={editingDevice.min_ios_version}
                                onChange={(e) =>
                                  setEditingDevice({ ...editingDevice, min_ios_version: e.target.value })
                                }
                              />
                              <Input
                                value={editingDevice.max_ios_version}
                                onChange={(e) =>
                                  setEditingDevice({ ...editingDevice, max_ios_version: e.target.value })
                                }
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{device.model_name}</span>
                                <span className="text-sm text-slate-500">
                                  iOS {device.min_ios_version} - {device.max_ios_version}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    device.is_active
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {device.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {editingDevice?.id === device.id ? (
                              <>
                                <Button size="sm" onClick={handleSaveDevice}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingDevice(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setEditingDevice(device)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteDevice(device)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* iOS Versions Tab */}
              <TabsContent value="ios">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      iOS ভার্সন ({iosVersions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New iOS Version */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h3 className="font-semibold mb-4">নতুন iOS ভার্সন যোগ করুন</h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <Label>ভার্সন</Label>
                          <Input
                            value={newIOSVersion.version}
                            onChange={(e) => setNewIOSVersion({ ...newIOSVersion, version: e.target.value })}
                            placeholder="17.2.1"
                          />
                        </div>
                        <div>
                          <Label>বিল্ড নম্বর</Label>
                          <Input
                            value={newIOSVersion.build_number}
                            onChange={(e) => setNewIOSVersion({ ...newIOSVersion, build_number: e.target.value })}
                            placeholder="21C62"
                          />
                        </div>
                        <div>
                          <Label>WebKit ভার্সন</Label>
                          <Input
                            value={newIOSVersion.webkit_version}
                            onChange={(e) => setNewIOSVersion({ ...newIOSVersion, webkit_version: e.target.value })}
                            placeholder="605.1.15"
                          />
                        </div>
                        <div>
                          <Label>ব্যবহার শতাংশ</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={newIOSVersion.usage_percentage}
                            onChange={(e) =>
                              setNewIOSVersion({ ...newIOSVersion, usage_percentage: Number(e.target.value) })
                            }
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={handleSaveIOSVersion} className="w-full md:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          যোগ করুন
                        </Button>
                      </div>
                    </div>

                    {/* iOS Version List */}
                    <div className="space-y-2">
                      {iosVersions.map((version) => (
                        <div
                          key={version.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                        >
                          {editingIOSVersion?.id === version.id ? (
                            <div className="flex-1 grid md:grid-cols-4 gap-4">
                              <Input
                                value={editingIOSVersion.version}
                                onChange={(e) => setEditingIOSVersion({ ...editingIOSVersion, version: e.target.value })}
                              />
                              <Input
                                value={editingIOSVersion.build_number}
                                onChange={(e) =>
                                  setEditingIOSVersion({ ...editingIOSVersion, build_number: e.target.value })
                                }
                              />
                              <Input
                                value={editingIOSVersion.webkit_version}
                                onChange={(e) =>
                                  setEditingIOSVersion({ ...editingIOSVersion, webkit_version: e.target.value })
                                }
                              />
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={editingIOSVersion.is_active}
                                  onCheckedChange={(checked) =>
                                    setEditingIOSVersion({ ...editingIOSVersion, is_active: checked })
                                  }
                                />
                                <span className="text-sm">সক্রিয়</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <Apple className="w-4 h-4 text-gray-600" />
                                <span className="font-medium">{version.version}</span>
                                <span className="text-sm text-slate-500">{version.build_number}</span>
                                <span className="text-sm text-slate-500">{version.webkit_version}</span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    version.is_active
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {version.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {editingIOSVersion?.id === version.id ? (
                              <>
                                <Button size="sm" onClick={handleSaveIOSVersion}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingIOSVersion(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setEditingIOSVersion(version)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteIOSVersion(version)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* App Versions Tab */}
              <TabsContent value="apps">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      অ্যাপ ভার্সন ({appVersions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New App Version */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h3 className="font-semibold mb-4">নতুন অ্যাপ ভার্সন যোগ করুন</h3>
                      <div className="grid md:grid-cols-5 gap-4">
                        <div>
                          <Label>অ্যাপ টাইপ</Label>
                          <Select
                            value={newAppVersion.app_type}
                            onValueChange={(value) => setNewAppVersion({ ...newAppVersion, app_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instagram">
                                <div className="flex items-center gap-2">
                                  <Instagram className="w-4 h-4" />
                                  Instagram
                                </div>
                              </SelectItem>
                              <SelectItem value="facebook">
                                <div className="flex items-center gap-2">
                                  <Facebook className="w-4 h-4" />
                                  Facebook
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>ভার্সন</Label>
                          <Input
                            value={newAppVersion.version}
                            onChange={(e) => setNewAppVersion({ ...newAppVersion, version: e.target.value })}
                            placeholder="317.0.0.36.111"
                          />
                        </div>
                        <div>
                          <Label>বিল্ড নম্বর</Label>
                          <Input
                            value={newAppVersion.build_number}
                            onChange={(e) => setNewAppVersion({ ...newAppVersion, build_number: e.target.value })}
                            placeholder="556052"
                          />
                        </div>
                        <div>
                          <Label>FBRV (ঐচ্ছিক)</Label>
                          <Input
                            value={newAppVersion.fbrv}
                            onChange={(e) => setNewAppVersion({ ...newAppVersion, fbrv: e.target.value })}
                            placeholder="556052"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={handleSaveAppVersion} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            যোগ করুন
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* App Version List */}
                    <div className="space-y-2">
                      {appVersions.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                        >
                          {editingAppVersion?.id === app.id ? (
                            <div className="flex-1 grid md:grid-cols-5 gap-4">
                              <Select
                                value={editingAppVersion.app_type}
                                onValueChange={(value) => setEditingAppVersion({ ...editingAppVersion, app_type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="instagram">Instagram</SelectItem>
                                  <SelectItem value="facebook">Facebook</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={editingAppVersion.version}
                                onChange={(e) => setEditingAppVersion({ ...editingAppVersion, version: e.target.value })}
                              />
                              <Input
                                value={editingAppVersion.build_number}
                                onChange={(e) =>
                                  setEditingAppVersion({ ...editingAppVersion, build_number: e.target.value })
                                }
                              />
                              <Input
                                value={editingAppVersion.fbrv}
                                onChange={(e) => setEditingAppVersion({ ...editingAppVersion, fbrv: e.target.value })}
                              />
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={editingAppVersion.is_active}
                                  onCheckedChange={(checked) =>
                                    setEditingAppVersion({ ...editingAppVersion, is_active: checked })
                                  }
                                />
                                <span className="text-sm">সক্রিয়</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                {app.app_type === "instagram" ? (
                                  <Instagram className="w-4 h-4 text-pink-600" />
                                ) : (
                                  <Facebook className="w-4 h-4 text-blue-600" />
                                )}
                                <span className="font-medium capitalize">{app.app_type}</span>
                                <span className="text-sm text-slate-500">{app.version}</span>
                                <span className="text-sm text-slate-500">Build: {app.build_number}</span>
                                {app.fbrv && <span className="text-sm text-slate-500">FBRV: {app.fbrv}</span>}
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    app.is_active
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {app.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {editingAppVersion?.id === app.id ? (
                              <>
                                <Button size="sm" onClick={handleSaveAppVersion}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingAppVersion(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setEditingAppVersion(app)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteAppVersion(app)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Configuration Tab */}
              <TabsContent value="config">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      কনফিগারেশন ({configurations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New Configuration */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h3 className="font-semibold mb-4">নতুন কনফিগারেশন যোগ করুন</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>কনফিগ কী</Label>
                          <Input
                            value={newConfig.config_key}
                            onChange={(e) => setNewConfig({ ...newConfig, config_key: e.target.value })}
                            placeholder="languages"
                          />
                        </div>
                        <div>
                          <Label>কনফিগ ভ্যালু</Label>
                          <Textarea
                            value={newConfig.config_value}
                            onChange={(e) => setNewConfig({ ...newConfig, config_value: e.target.value })}
                            placeholder='{"en_US": 90, "es_US": 10}'
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>বিবরণ</Label>
                          <Textarea
                            value={newConfig.description}
                            onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                            placeholder="Language distribution percentages"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={handleSaveConfig} className="w-full md:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          যোগ করুন
                        </Button>
                      </div>
                    </div>

                    {/* Configuration List */}
                    <div className="space-y-2">
                      {configurations.map((config) => (
                        <div
                          key={config.id}
                          className="flex items-start justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                        >
                          {editingConfig?.id === config.id ? (
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <Input
                                value={editingConfig.config_key}
                                onChange={(e) => setEditingConfig({ ...editingConfig, config_key: e.target.value })}
                              />
                              <Textarea
                                value={editingConfig.config_value}
                                onChange={(e) => setEditingConfig({ ...editingConfig, config_value: e.target.value })}
                                rows={3}
                              />
                              <Textarea
                                value={editingConfig.description}
                                onChange={(e) => setEditingConfig({ ...editingConfig, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <span className="font-medium">{config.config_key}</span>
                                </div>
                                <div className="text-sm text-slate-500 font-mono bg-slate-100 dark:bg-slate-600 p-2 rounded">
                                  {config.config_value}
                                </div>
                                {config.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{config.description}</p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {editingConfig?.id === config.id ? (
                              <>
                                <Button size="sm" onClick={handleSaveConfig}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingConfig(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setEditingConfig(config)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteConfig(config)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Custom Modal */}
            <CustomModal
              isOpen={modal.isOpen}
              onClose={() => setModal({ ...modal, isOpen: false })}
              title={modal.title}
              message={modal.message}
              type={modal.type}
              onConfirm={modal.onConfirm}
              showCancel={modal.showCancel}
            />
          </>
        )}
      </div>
    </AuthGuard>
  )
}