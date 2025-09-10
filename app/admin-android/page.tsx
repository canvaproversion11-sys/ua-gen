"use client"

import AuthGuard from "@/components/AuthGuard"
import { useState, useEffect, useRef } from "react"
import { AndroidDeviceModel, AndroidBuildNumber, AndroidAppVersion } from "@/lib/supabase"
import { Smartphone, Settings, Plus, Edit, Trash2, Save, X, Facebook, Chrome } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CustomModal } from "@/components/CustomModal"
import AdminLoading from "@/components/AdminLoading"

export default function AndroidAdminPanel() {
  const isMountedRef = useRef(true)

  const [activeTab, setActiveTab] = useState("devices")
  const [activeAppTab, setActiveAppTab] = useState("facebook")

  // Device Models State
  const [deviceModels, setDeviceModels] = useState([])
  const [editingDevice, setEditingDevice] = useState(null)
  const [newDevice, setNewDevice] = useState({ model_name: "", android_version: "", is_active: true })

  // Build Numbers State
  const [buildNumbers, setBuildNumbers] = useState([])
  const [editingBuild, setEditingBuild] = useState(null)
  const [newBuild, setNewBuild] = useState({ android_version: "", build_number: "", is_active: true })

  // App Versions State
  const [appVersions, setAppVersions] = useState([])
  const [editingApp, setEditingApp] = useState(null)
  const [newApp, setNewApp] = useState({ app_type: "facebook", version: "", iabmv: "1", is_active: true })

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
    const savedTab = localStorage.getItem("android-admin-active-tab")
    if (savedTab && ["devices", "builds", "apps"].includes(savedTab)) {
      setActiveTab(savedTab)
    }

    const savedAppTab = localStorage.getItem("android-admin-app-tab")
    if (savedAppTab && ["facebook", "chrome"].includes(savedAppTab)) {
      setActiveAppTab(savedAppTab)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem("android-admin-active-tab", value)
  }

  const handleAppTabChange = (value: string) => {
    setActiveAppTab(value)
    localStorage.setItem("android-admin-app-tab", value)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!isMountedRef.current) return

    try {
      setLoading(true)
      const [devices, builds, apps] = await Promise.all([
        AndroidDeviceModel.list(),
        AndroidBuildNumber.list(),
        AndroidAppVersion.list(),
      ])

      if (isMountedRef.current) {
        setDeviceModels(devices)
        setBuildNumbers(builds)
        setAppVersions(apps)
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

  // ... existing code for all handlers ...

  // Device Model Functions
  const handleSaveDevice = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingDevice) {
        await AndroidDeviceModel.update(editingDevice.id, editingDevice)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "ডিভাইস মডেল আপডেট করা হয়েছে।", "success")
        }
      } else {
        await AndroidDeviceModel.create(newDevice)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন ডিভাইস মডেল যোগ করা হয়েছে।", "success")
          setNewDevice({ model_name: "", android_version: "", is_active: true })
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
          await AndroidDeviceModel.delete(device.id)
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

  // Build Number Functions
  const handleSaveBuild = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingBuild) {
        await AndroidBuildNumber.update(editingBuild.id, editingBuild)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "বিল্ড নম্বর আপডেট করা হয়েছে।", "success")
        }
      } else {
        await AndroidBuildNumber.create(newBuild)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন বিল্ড নম্বর যোগ করা হয়েছে।", "success")
          setNewBuild({ android_version: "", build_number: "", is_active: true })
        }
      }
      if (isMountedRef.current) {
        setEditingBuild(null)
        loadData()
      }
    } catch (error) {
      console.error("Error saving build:", error)
      if (isMountedRef.current) {
        showModal("❌ ব্যর্থ!", "বিল্ড নম্বর সেভ করতে সমস্যা হয়েছে।", "error")
      }
    }
  }

  const handleDeleteBuild = async (build) => {
    if (!isMountedRef.current) return

    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${build.android_version}" বিল্ড নম্বর মুছে ফেলতে চান?`,
      "warning",
      async () => {
        if (!isMountedRef.current) return

        try {
          await AndroidBuildNumber.delete(build.id)
          if (isMountedRef.current) {
            showModal("✅ সফল!", "বিল্ড নম্বর মুছে ফেলা হয়েছে।", "success")
            loadData()
          }
        } catch (error) {
          console.error("Error deleting build:", error)
          if (isMountedRef.current) {
            showModal("❌ ব্যর্থ!", "বিল্ড নম্বর মুছতে সমস্যা হয়েছে।", "error")
          }
        }
      },
      true,
    )
  }

  // App Version Functions
  const handleSaveApp = async () => {
    if (!isMountedRef.current) return

    try {
      if (editingApp) {
        await AndroidAppVersion.update(editingApp.id, editingApp)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "অ্যাপ ভার্সন আপডেট করা হয়েছে।", "success")
        }
      } else {
        await AndroidAppVersion.create(newApp)
        if (isMountedRef.current) {
          showModal("✅ সফল!", "নতুন অ্যাপ ভার্সন যোগ করা হয়েছে।", "success")
          setNewApp({ app_type: "facebook", version: "", iabmv: "1", is_active: true })
        }
      }
      if (isMountedRef.current) {
        setEditingApp(null)
        loadData()
      }
    } catch (error) {
      console.error("Error saving app:", error)
      if (isMountedRef.current) {
        showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন সেভ করতে সমস্যা হয়েছে।", "error")
      }
    }
  }

  const handleDeleteApp = async (app) => {
    if (!isMountedRef.current) return

    showModal(
      "⚠️ নিশ্চিতকরণ",
      `আপনি কি "${app.app_type} ${app.version}" অ্যাপ ভার্সন মুছে ফেলতে চান?`,
      "warning",
      async () => {
        if (!isMountedRef.current) return

        try {
          await AndroidAppVersion.delete(app.id)
          if (isMountedRef.current) {
            showModal("✅ সফল!", "অ্যাপ ভার্সন মুছে ফেলা হয়েছে।", "success")
            loadData()
          }
        } catch (error) {
          console.error("Error deleting app:", error)
          if (isMountedRef.current) {
            showModal("❌ ব্যর্থ!", "অ্যাপ ভার্সন মুছতে সমস্যা হয়েছে।", "error")
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
          <AdminLoading message="ডেটা লোড হচ্ছে..." />
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 rounded-full mb-4">
                <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Android ম্যানেজমেন্ট</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Android অ্যাডমিন প্যানেল
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Android ডিভাইস মডেল, বিল্ড নম্বর এবং অ্যাপ ভার্সন পরিচালনা করুন
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="devices">ডিভাইস মডেল</TabsTrigger>
                <TabsTrigger value="builds">বিল্ড নম্বর</TabsTrigger>
                <TabsTrigger value="apps">অ্যাপ ভার্সন</TabsTrigger>
              </TabsList>

              {/* Device Models Tab */}
              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Android ডিভাইস মডেল ({deviceModels.length})
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
                            placeholder="SM-G991U"
                          />
                        </div>
                        <div>
                          <Label>Android ভার্সন</Label>
                          <Select
                            value={newDevice.android_version}
                            onValueChange={(value) => setNewDevice({ ...newDevice, android_version: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="ভার্সন নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Android 15">Android 15</SelectItem>
                              <SelectItem value="Android 14">Android 14</SelectItem>
                              <SelectItem value="Android 13">Android 13</SelectItem>
                              <SelectItem value="Android 12">Android 12</SelectItem>
                              <SelectItem value="Android 11">Android 11</SelectItem>
                              <SelectItem value="Android 10">Android 10</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button onClick={handleSaveDevice} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            যোগ করুন
                          </Button>
                        </div>
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
                              <Select
                                value={editingDevice.android_version}
                                onValueChange={(value) =>
                                  setEditingDevice({ ...editingDevice, android_version: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Android 15">Android 15</SelectItem>
                                  <SelectItem value="Android 14">Android 14</SelectItem>
                                  <SelectItem value="Android 13">Android 13</SelectItem>
                                  <SelectItem value="Android 12">Android 12</SelectItem>
                                  <SelectItem value="Android 11">Android 11</SelectItem>
                                  <SelectItem value="Android 10">Android 10</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={editingDevice.is_active}
                                  onCheckedChange={(checked) =>
                                    setEditingDevice({ ...editingDevice, is_active: checked })
                                  }
                                />
                                <span className="text-sm">সক্রিয়</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{device.model_name}</span>
                                <span className="text-sm text-slate-500">{device.android_version}</span>
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

              {/* Build Numbers Tab */}
              <TabsContent value="builds">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Android বিল্ড নম্বর ({buildNumbers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add New Build */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <h3 className="font-semibold mb-4">নতুন বিল্ড নম্বর যোগ করুন</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>Android ভার্সন</Label>
                          <Select
                            value={newBuild.android_version}
                            onValueChange={(value) => setNewBuild({ ...newBuild, android_version: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="ভার্সন নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Android 15">Android 15</SelectItem>
                              <SelectItem value="Android 14">Android 14</SelectItem>
                              <SelectItem value="Android 13">Android 13</SelectItem>
                              <SelectItem value="Android 12">Android 12</SelectItem>
                              <SelectItem value="Android 11">Android 11</SelectItem>
                              <SelectItem value="Android 10">Android 10</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>বিল্ড নম্বর</Label>
                          <Input
                            value={newBuild.build_number}
                            onChange={(e) => setNewBuild({ ...newBuild, build_number: e.target.value })}
                            placeholder="UP1A.231005.007; wv"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={handleSaveBuild} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            যোগ করুন
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Build List */}
                    <div className="space-y-2">
                      {buildNumbers.map((build) => (
                        <div
                          key={build.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                        >
                          {editingBuild?.id === build.id ? (
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <Select
                                value={editingBuild.android_version}
                                onValueChange={(value) => setEditingBuild({ ...editingBuild, android_version: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Android 15">Android 15</SelectItem>
                                  <SelectItem value="Android 14">Android 14</SelectItem>
                                  <SelectItem value="Android 13">Android 13</SelectItem>
                                  <SelectItem value="Android 12">Android 12</SelectItem>
                                  <SelectItem value="Android 11">Android 11</SelectItem>
                                  <SelectItem value="Android 10">Android 10</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={editingBuild.build_number}
                                onChange={(e) => setEditingBuild({ ...editingBuild, build_number: e.target.value })}
                              />
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={editingBuild.is_active}
                                  onCheckedChange={(checked) =>
                                    setEditingBuild({ ...editingBuild, is_active: checked })
                                  }
                                />
                                <span className="text-sm">সক্রিয়</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{build.android_version}</span>
                                <span className="text-sm text-slate-500 font-mono">{build.build_number}</span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    build.is_active
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {build.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {editingBuild?.id === build.id ? (
                              <>
                                <Button size="sm" onClick={handleSaveBuild}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingBuild(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setEditingBuild(build)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteBuild(build)}>
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
                    <Tabs value={activeAppTab} onValueChange={handleAppTabChange} className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="facebook">
                          <Facebook className="w-4 h-4 mr-2" />
                          Facebook
                        </TabsTrigger>
                        <TabsTrigger value="chrome">
                          <Chrome className="w-4 h-4 mr-2" />
                          Chrome
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="facebook">
                        {/* Add New Facebook Version */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h3 className="font-semibold mb-4">নতুন Facebook ভার্সন যোগ করুন</h3>
                          <div className="grid md:grid-cols-4 gap-4">
                            <div>
                              <Label>ভার্সন</Label>
                              <Input
                                value={newApp.app_type === "facebook" ? newApp.version : ""}
                                onChange={(e) =>
                                  setNewApp({ ...newApp, app_type: "facebook", version: e.target.value })
                                }
                                placeholder="523.0.0.39.61"
                              />
                            </div>
                            <div>
                              <Label>IABMV</Label>
                              <Input
                                value={newApp.app_type === "facebook" ? newApp.iabmv : "1"}
                                onChange={(e) => setNewApp({ ...newApp, iabmv: e.target.value })}
                                placeholder="1"
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                              <Switch
                                checked={newApp.is_active}
                                onCheckedChange={(checked) => setNewApp({ ...newApp, is_active: checked })}
                              />
                              <span className="text-sm">সক্রিয়</span>
                            </div>
                            <div className="flex items-end">
                              <Button onClick={handleSaveApp} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                যোগ করুন
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Facebook Versions List */}
                        <div className="space-y-2">
                          {appVersions
                            .filter((app) => app.app_type === "facebook")
                            .map((app) => (
                              <div
                                key={app.id}
                                className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                              >
                                {editingApp?.id === app.id ? (
                                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                                    <Input
                                      value={editingApp.version}
                                      onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                                    />
                                    <Input
                                      value={editingApp.iabmv}
                                      onChange={(e) => setEditingApp({ ...editingApp, iabmv: e.target.value })}
                                    />
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={editingApp.is_active}
                                        onCheckedChange={(checked) =>
                                          setEditingApp({ ...editingApp, is_active: checked })
                                        }
                                      />
                                      <span className="text-sm">সক্রিয়</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                      <Facebook className="w-4 h-4 text-blue-600" />
                                      <span className="font-medium">{app.version}</span>
                                      <span className="text-sm text-slate-500">IABMV: {app.iabmv}</span>
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
                                  {editingApp?.id === app.id ? (
                                    <>
                                      <Button size="sm" onClick={handleSaveApp}>
                                        <Save className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingApp(null)}>
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" variant="outline" onClick={() => setEditingApp(app)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="destructive" onClick={() => handleDeleteApp(app)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="chrome">
                        {/* Add New Chrome Version */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <h3 className="font-semibold mb-4">নতুন Chrome ভার্সন যোগ করুন</h3>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label>ভার্সন</Label>
                              <Input
                                value={newApp.app_type === "chrome" ? newApp.version : ""}
                                onChange={(e) =>
                                  setNewApp({ ...newApp, app_type: "chrome", version: e.target.value, iabmv: "" })
                                }
                                placeholder="138.0.7204.157"
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                              <Switch
                                checked={newApp.is_active}
                                onCheckedChange={(checked) => setNewApp({ ...newApp, is_active: checked })}
                              />
                              <span className="text-sm">সক্রিয়</span>
                            </div>
                            <div className="flex items-end">
                              <Button onClick={handleSaveApp} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                যোগ করুন
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Chrome Versions List */}
                        <div className="space-y-2">
                          {appVersions
                            .filter((app) => app.app_type === "chrome")
                            .map((app) => (
                              <div
                                key={app.id}
                                className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                              >
                                {editingApp?.id === app.id ? (
                                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                                    <Input
                                      value={editingApp.version}
                                      onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                                    />
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={editingApp.is_active}
                                        onCheckedChange={(checked) =>
                                          setEditingApp({ ...editingApp, is_active: checked })
                                        }
                                      />
                                      <span className="text-sm">সক্রিয়</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                      <Chrome className="w-4 h-4 text-orange-600" />
                                      <span className="font-medium">{app.version}</span>
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
                                  {editingApp?.id === app.id ? (
                                    <>
                                      <Button size="sm" onClick={handleSaveApp}>
                                        <Save className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingApp(null)}>
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" variant="outline" onClick={() => setEditingApp(app)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="destructive" onClick={() => handleDeleteApp(app)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                    </Tabs>
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
