"use client"

import AuthGuard from "@/components/AuthGuard"
import { useState, useEffect, useRef } from "react"
import { Instagram, Plus, Edit, Trash2, Save, X, Smartphone, Chrome } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CustomModal } from "@/components/CustomModal"
import AdminLoading from "@/components/AdminLoading"
import { InstagramDeviceModel, InstagramVersion, ChromeVersion, ResolutionDpi } from "@/lib/supabase"

export default function AndroidInstaAdminPanel() {
  const isMountedRef = useRef(true)

  const [activeTab, setActiveTab] = useState("devices")
  const [activeAppTab, setActiveAppTab] = useState("instagram")

  // Device Models State
  const [deviceModels, setDeviceModels] = useState([])
  const [editingDevice, setEditingDevice] = useState(null)
  const [newDevice, setNewDevice] = useState({
    manufacturer: "samsung",
    model: "",
    code: "",
    resolutions: "1080x2340",
    chipset: "",
    android_version: 14,
    is_active: true,
  })

  // Instagram Versions State
  const [instagramVersions, setInstagramVersions] = useState([])
  const [editingVersion, setEditingVersion] = useState(null)
  const [newVersion, setNewVersion] = useState({ version: "", unique_id: "", is_active: true })

  const [chromeVersions, setChromeVersions] = useState([])
  const [editingChromeVersion, setEditingChromeVersion] = useState(null)
  const [newChromeVersion, setNewChromeVersion] = useState({ version: "", is_active: true })

  const [resolutionDpis, setResolutionDpis] = useState([])
  const [editingResolutionDpi, setEditingResolutionDpi] = useState(null)
  const [newResolutionDpi, setNewResolutionDpi] = useState({ resolution: "", dpis: "", is_active: true })

  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: () => {},
    onCancel: () => {},
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const [devices, versions, chrome, resolutions] = await Promise.all([
        InstagramDeviceModel.list(),
        InstagramVersion.list(),
        ChromeVersion.list(),
        ResolutionDpi.list(),
      ])

      if (isMountedRef.current) {
        setDeviceModels(devices)
        setInstagramVersions(versions)
        setChromeVersions(chrome)
        setResolutionDpis(resolutions)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      showModal("Error", "Failed to load data. Please try again.", "error")
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadData()
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const showModal = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
      onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
    })
  }

  // ... existing code for all handlers ...

  const handleAddDevice = async () => {
    try {
      const result = await InstagramDeviceModel.create(newDevice)
      setDeviceModels((prev) => [result, ...prev])
      setNewDevice({
        manufacturer: "samsung",
        model: "",
        code: "",
        resolutions: "1080x2340",
        chipset: "",
        android_version: 14,
        is_active: true,
      })
      showModal("Success", "Device model added successfully!", "success")
    } catch (error) {
      console.error("Error adding device:", error)
      showModal("Error", "Failed to add device model. Please try again.", "error")
    }
  }

  const handleUpdateDevice = async (id: string, data: any) => {
    try {
      const result = await InstagramDeviceModel.update(id, data)
      setDeviceModels((prev) => prev.map((item) => (item.id === id ? result : item)))
      setEditingDevice(null)
      showModal("Success", "Device model updated successfully!", "success")
    } catch (error) {
      console.error("Error updating device:", error)
      showModal("Error", "Failed to update device model. Please try again.", "error")
    }
  }

  const handleDeleteDevice = async (id: string) => {
    try {
      await InstagramDeviceModel.delete(id)
      setDeviceModels((prev) => prev.filter((item) => item.id !== id))
      showModal("Success", "Device model deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting device:", error)
      showModal("Error", "Failed to delete device model. Please try again.", "error")
    }
  }

  const handleAddVersion = async () => {
    try {
      const result = await InstagramVersion.create(newVersion)
      setInstagramVersions((prev) => [result, ...prev])
      setNewVersion({ version: "", unique_id: "", is_active: true })
      showModal("Success", "Instagram version added successfully!", "success")
    } catch (error) {
      console.error("Error adding version:", error)
      showModal("Error", "Failed to add Instagram version. Please try again.", "error")
    }
  }

  const handleUpdateVersion = async (id: string, data: any) => {
    try {
      const result = await InstagramVersion.update(id, data)
      setInstagramVersions((prev) => prev.map((item) => (item.id === id ? result : item)))
      setEditingVersion(null)
      showModal("Success", "Instagram version updated successfully!", "success")
    } catch (error) {
      console.error("Error updating version:", error)
      showModal("Error", "Failed to update Instagram version. Please try again.", "error")
    }
  }

  const handleDeleteVersion = async (id: string) => {
    try {
      await InstagramVersion.delete(id)
      setInstagramVersions((prev) => prev.filter((item) => item.id !== id))
      showModal("Success", "Instagram version deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting version:", error)
      showModal("Error", "Failed to delete Instagram version. Please try again.", "error")
    }
  }

  const handleAddChromeVersion = async () => {
    try {
      const result = await ChromeVersion.create(newChromeVersion)
      setChromeVersions((prev) => [result, ...prev])
      setNewChromeVersion({ version: "", is_active: true })
      showModal("Success", "Chrome version added successfully!", "success")
    } catch (error) {
      console.error("Error adding Chrome version:", error)
      showModal("Error", "Failed to add Chrome version. Please try again.", "error")
    }
  }

  const handleUpdateChromeVersion = async (id: string, data: any) => {
    try {
      const result = await ChromeVersion.update(id, data)
      setChromeVersions((prev) => prev.map((item) => (item.id === id ? result : item)))
      setEditingChromeVersion(null)
      showModal("Success", "Chrome version updated successfully!", "success")
    } catch (error) {
      console.error("Error updating Chrome version:", error)
      showModal("Error", "Failed to update Chrome version. Please try again.", "error")
    }
  }

  const handleDeleteChromeVersion = async (id: string) => {
    try {
      await ChromeVersion.delete(id)
      setChromeVersions((prev) => prev.filter((item) => item.id !== id))
      showModal("Success", "Chrome version deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting Chrome version:", error)
      showModal("Error", "Failed to delete Chrome version. Please try again.", "error")
    }
  }

  const handleAddResolutionDpi = async () => {
    try {
      const dpisArray = newResolutionDpi.dpis
        .split(",")
        .map((dpi) => Number.parseInt(dpi.trim()))
        .filter((dpi) => !isNaN(dpi))

      const result = await ResolutionDpi.create({
        ...newResolutionDpi,
        dpis: dpisArray,
      })
      setResolutionDpis((prev) => [result, ...prev])
      setNewResolutionDpi({ resolution: "", dpis: "", is_active: true })
      showModal("Success", "Resolution DPI added successfully!", "success")
    } catch (error) {
      console.error("Error adding resolution DPI:", error)
      showModal("Error", "Failed to add resolution DPI. Please try again.", "error")
    }
  }

  const handleUpdateResolutionDpi = async (id: string, data: any) => {
    try {
      const updateData = { ...data }
      if (typeof data.dpis === "string") {
        updateData.dpis = data.dpis
          .split(",")
          .map((dpi) => Number.parseInt(dpi.trim()))
          .filter((dpi) => !isNaN(dpi))
      }

      const result = await ResolutionDpi.update(id, updateData)
      setResolutionDpis((prev) => prev.map((item) => (item.id === id ? result : item)))
      setEditingResolutionDpi(null)
      showModal("Success", "Resolution DPI updated successfully!", "success")
    } catch (error) {
      console.error("Error updating resolution DPI:", error)
      showModal("Error", "Failed to update resolution DPI. Please try again.", "error")
    }
  }

  const handleDeleteResolutionDpi = async (id: string) => {
    try {
      await ResolutionDpi.delete(id)
      setResolutionDpis((prev) => prev.filter((item) => item.id !== id))
      showModal("Success", "Resolution DPI deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting resolution DPI:", error)
      showModal("Error", "Failed to delete resolution DPI. Please try again.", "error")
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleAppTabChange = (value: string) => {
    setActiveAppTab(value)
  }

  // Hardcoded dropdown options (as per user requirement)
  const manufacturerOptions = [
    "samsung",
    "google",
    "oneplus",
    "xiaomi",
    "oppo",
    "vivo",
    "huawei",
    "lg",
    "sony",
    "motorola",
  ]
  const resolutionOptions = ["720x1600", "1080x2280", "1080x2340", "1080x2400", "1440x3040", "1440x3200", "1440x3216"]
  const androidVersionOptions = [15, 14, 13, 12, 11, 10, 9, 8]

  if (loading) {
    return <AdminLoading message="Instagram Admin Panel লোড হচ্ছে..." />
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-4">
            <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Instagram Android ম্যানেজমেন্ট</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Android insta Admin Panel
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Android Instagram ডিভাইস মডেল এবং অ্যাপ ভার্সন পরিচালনা করুন
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="devices">Instagram ডিভাইস মডেল</TabsTrigger>
            <TabsTrigger value="app-versions">app ভার্সন</TabsTrigger>
            <TabsTrigger value="resolution-dpi">Resolution DPI</TabsTrigger>
          </TabsList>

          {/* Instagram Device Models Tab */}
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Instagram Android ডিভাইস মডেল ({deviceModels.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Device */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h3 className="font-semibold mb-4">নতুন Instagram ডিভাইস মডেল যোগ করুন</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>মডেল নাম</Label>
                      <Input
                        value={newDevice.model}
                        onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                        placeholder="SM-S721U"
                      />
                    </div>
                    <div>
                      <Label>কোড</Label>
                      <Input
                        value={newDevice.code}
                        onChange={(e) => setNewDevice({ ...newDevice, code: e.target.value })}
                        placeholder="r11s"
                      />
                    </div>
                    <div>
                      <Label>চিপসেট</Label>
                      <Input
                        value={newDevice.chipset}
                        onChange={(e) => setNewDevice({ ...newDevice, chipset: e.target.value })}
                        placeholder="Snapdragon 7 Gen 1"
                      />
                    </div>
                    <div>
                      <Label>রেজোলিউশন</Label>
                      <Select
                        value={newDevice.resolutions}
                        onValueChange={(value) => setNewDevice({ ...newDevice, resolutions: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {resolutionOptions.map((resolution) => (
                            <SelectItem key={resolution} value={resolution}>
                              {resolution}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Android ভার্সন</Label>
                      <Select
                        value={newDevice.android_version.toString()}
                        onValueChange={(value) =>
                          setNewDevice({ ...newDevice, android_version: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {androidVersionOptions.map((version) => (
                            <SelectItem key={version} value={version.toString()}>
                              Android {version}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddDevice} className="w-full">
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
                        <div className="flex-1 grid md:grid-cols-4 gap-4">
                          <Input
                            value={editingDevice.model}
                            onChange={(e) => setEditingDevice({ ...editingDevice, model: e.target.value })}
                          />
                          <Input
                            value={editingDevice.code}
                            onChange={(e) => setEditingDevice({ ...editingDevice, code: e.target.value })}
                          />
                          <Input
                            value={editingDevice.chipset}
                            onChange={(e) => setEditingDevice({ ...editingDevice, chipset: e.target.value })}
                          />
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={editingDevice.is_active}
                              onCheckedChange={(checked) => setEditingDevice({ ...editingDevice, is_active: checked })}
                            />
                            <span className="text-sm">সক্রিয়</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Instagram className="w-4 h-4 text-pink-600" />
                            <span className="font-medium">{device.model}</span>
                            <span className="text-sm text-slate-500">{device.code}</span>
                            <span className="text-sm text-slate-500">{device.chipset}</span>
                            <span className="text-sm text-slate-500">Android {device.android_version}</span>
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
                            <Button size="sm" onClick={() => handleUpdateDevice(device.id, editingDevice)}>
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
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteDevice(device.id)}>
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

          {/* Instagram Versions Tab */}
          <TabsContent value="app-versions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  অ্যাপ ভার্সন ম্যানেজমেন্ট
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeAppTab} onValueChange={handleAppTabChange} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="instagram">Instagram ভার্সন</TabsTrigger>
                    <TabsTrigger value="chrome">ক্রোম ভার্সন</TabsTrigger>
                  </TabsList>

                  {/* Instagram Versions Sub-tab */}
                  <TabsContent value="instagram">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <h3 className="text-lg font-semibold">Instagram ভার্সন ({instagramVersions.length})</h3>
                      </div>

                      {/* Add New Instagram Version */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-semibold mb-4">নতুন Instagram ভার্সন যোগ করুন</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label>ভার্সন</Label>
                            <Input
                              value={newVersion.version}
                              onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })}
                              placeholder="389.0.0.49.87"
                            />
                          </div>
                          <div>
                            <Label>Unique ID</Label>
                            <Input
                              value={newVersion.unique_id}
                              onChange={(e) => setNewVersion({ ...newVersion, unique_id: e.target.value })}
                              placeholder="379506944"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button onClick={handleAddVersion} className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              যোগ করুন
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Instagram Version List */}
                      <div className="space-y-2">
                        {instagramVersions.map((version) => (
                          <div
                            key={version.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                          >
                            {editingVersion?.id === version.id ? (
                              <div className="flex-1 grid md:grid-cols-3 gap-4">
                                <Input
                                  value={editingVersion.version}
                                  onChange={(e) => setEditingVersion({ ...editingVersion, version: e.target.value })}
                                />
                                <Input
                                  value={editingVersion.unique_id}
                                  onChange={(e) => setEditingVersion({ ...editingVersion, unique_id: e.target.value })}
                                />
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={editingVersion.is_active}
                                    onCheckedChange={(checked) =>
                                      setEditingVersion({ ...editingVersion, is_active: checked })
                                    }
                                  />
                                  <span className="text-sm">সক্রিয়</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <div className="flex items-center gap-4">
                                  <Instagram className="w-4 h-4 text-pink-600" />
                                  <span className="font-medium">{version.version}</span>
                                  <span className="text-sm text-slate-500 font-mono">ID: {version.unique_id}</span>
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
                              {editingVersion?.id === version.id ? (
                                <>
                                  <Button size="sm" onClick={() => handleUpdateVersion(version.id, editingVersion)}>
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingVersion(null)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => setEditingVersion(version)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteVersion(version.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Chrome Versions Sub-tab */}
                  <TabsContent value="chrome">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Chrome className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">ক্রোম ভার্সন ({chromeVersions.length})</h3>
                      </div>

                      {/* Add New Chrome Version */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-semibold mb-4">নতুন ক্রোম ভার্সন যোগ করুন</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>ভার্সন</Label>
                            <Input
                              value={newChromeVersion.version}
                              onChange={(e) => setNewChromeVersion({ ...newChromeVersion, version: e.target.value })}
                              placeholder="120.0.6099.210"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button onClick={handleAddChromeVersion} className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              যোগ করুন
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Chrome Version List */}
                      <div className="space-y-2">
                        {chromeVersions.map((version) => (
                          <div
                            key={version.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                          >
                            {editingChromeVersion?.id === version.id ? (
                              <div className="flex-1 grid md:grid-cols-2 gap-4">
                                <Input
                                  value={editingChromeVersion.version}
                                  onChange={(e) =>
                                    setEditingChromeVersion({ ...editingChromeVersion, version: e.target.value })
                                  }
                                />
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={editingChromeVersion.is_active}
                                    onCheckedChange={(checked) =>
                                      setEditingChromeVersion({ ...editingChromeVersion, is_active: checked })
                                    }
                                  />
                                  <span className="text-sm">সক্রিয়</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <div className="flex items-center gap-4">
                                  <Chrome className="w-5 h-5 text-blue-600" />
                                  <span className="font-medium">{version.version}</span>
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
                              {editingChromeVersion?.id === version.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateChromeVersion(version.id, editingChromeVersion)}
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingChromeVersion(null)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => setEditingChromeVersion(version)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteChromeVersion(version.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolution-dpi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Resolution DPI ম্যানেজমেন্ট ({resolutionDpis.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Resolution DPI */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h3 className="font-semibold mb-4">নতুন Resolution DPI যোগ করুন</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>রেজোলিউশন</Label>
                      <Select
                        value={newResolutionDpi.resolution}
                        onChange={(value) => setNewResolutionDpi({ ...newResolutionDpi, resolution: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="রেজোলিউশন নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {resolutionOptions.map((resolution) => (
                            <SelectItem key={resolution} value={resolution}>
                              {resolution}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>DPI মান (কমা দিয়ে আলাদা করুন)</Label>
                      <Input
                        type="text"
                        value={newResolutionDpi.dpis}
                        onChange={(e) => setNewResolutionDpi({ ...newResolutionDpi, dpis: e.target.value })}
                        placeholder="320, 280, 300"
                      />
                      <p className="text-xs text-slate-500 mt-1">উদাহরণ: 320, 280, 300</p>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddResolutionDpi} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        যোগ করুন
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Resolution DPI List */}
                <div className="space-y-2">
                  {resolutionDpis.map((resolutionDpi) => (
                    <div
                      key={resolutionDpi.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border"
                    >
                      {editingResolutionDpi?.id === resolutionDpi.id ? (
                        <div className="flex-1 grid md:grid-cols-3 gap-4">
                          <Select
                            value={editingResolutionDpi.resolution}
                            onValueChange={(value) =>
                              setEditingResolutionDpi({ ...editingResolutionDpi, resolution: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {resolutionOptions.map((resolution) => (
                                <SelectItem key={resolution} value={resolution}>
                                  {resolution}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="text"
                            value={editingResolutionDpi.dpis?.join(", ") || ""}
                            onChange={(e) => {
                              const dpiArray = e.target.value
                                .split(",")
                                .map((dpi) => Number.parseInt(dpi.trim()))
                                .filter((dpi) => !isNaN(dpi))
                              setEditingResolutionDpi({ ...editingResolutionDpi, dpis: dpiArray })
                            }}
                            placeholder="320, 280, 300"
                          />
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={editingResolutionDpi.is_active}
                              onCheckedChange={(checked) =>
                                setEditingResolutionDpi({ ...editingResolutionDpi, is_active: checked })
                              }
                            />
                            <span className="text-sm">সক্রিয়</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Smartphone className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{resolutionDpi.resolution}</span>
                            <span className="text-sm text-slate-500">
                              DPI:{" "}
                              {Array.isArray(resolutionDpi.dpis) ? resolutionDpi.dpis.join(", ") : resolutionDpi.dpis}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                resolutionDpi.is_active
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {resolutionDpi.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {editingResolutionDpi?.id === resolutionDpi.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateResolutionDpi(resolutionDpi.id, editingResolutionDpi)}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingResolutionDpi(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setEditingResolutionDpi(resolutionDpi)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteResolutionDpi(resolutionDpi.id)}
                            >
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
          onCancel={modal.onCancel}
        />
      </div>
    </AuthGuard>
  )
}
