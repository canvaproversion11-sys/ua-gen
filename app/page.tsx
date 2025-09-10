"use client"

import { useState, useEffect, memo, useCallback, startTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Download, Copy, TrendingUp, Loader2, Smartphone, Shield } from "lucide-react"
import dynamic from "next/dynamic"
import { GenerationHistory } from "@/lib/supabase" // Declared the variable here

const CustomModal = dynamic(() => import("@/components/CustomModal"), {
  loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />,
  ssr: false,
})

const ProgressModal = dynamic(() => import("@/components/ProgressModal"), {
  loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />,
  ssr: false,
})

const GeneratorControls = dynamic(() => import("@/components/GeneratorControls"), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
})

let supabaseModulesCache = null
const loadSupabaseModules = async () => {
  if (supabaseModulesCache) return supabaseModulesCache

  try {
    const module = await import("@/lib/supabase")
    supabaseModulesCache = {
      DeviceModel: module.DeviceModel,
      IOSVersion: module.IOSVersion,
      AppVersion: module.AppVersion,
      Configuration: module.Configuration,
      GenerationHistory: module.GenerationHistory,
      BlacklistedUserAgent: module.BlacklistedUserAgent,
      AndroidDeviceModel: module.AndroidDeviceModel,
      AndroidBuildNumber: module.AndroidBuildNumber,
      AndroidAppVersion: module.AndroidAppVersion,
      InstagramDeviceModel: module.InstagramDeviceModel,
      InstagramVersion: module.InstagramVersion,
      ChromeVersion: module.ChromeVersion,
      ResolutionDpi: module.ResolutionDpi,
    }
    return supabaseModulesCache
  } catch (error) {
    console.error("Supabase modules load error:", error)
    throw new Error("Database connection failed. Please refresh the page.")
  }
}

const LoadingSkeleton = memo(() => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-muted rounded w-3/4"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
    <div className="h-10 bg-muted rounded"></div>
  </div>
))

const AppHeader = memo(() => (
  <div className="text-center space-y-4 mb-8">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
        <Smartphone className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        User Agent Generator
      </h1>
    </div>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      Generate unique, realistic user agents for iOS, Android, Instagram, and Facebook applications
    </p>
  </div>
))

AppHeader.displayName = "AppHeader"

export default function UserAgentGenerator() {
  const [platform, setPlatform] = useState("")
  const [appType, setAppType] = useState("")
  const [quantity, setQuantity] = useState(100)
  const [userAgents, setUserAgents] = useState([])
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [history, setHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [activeTab, setActiveTab] = useState("generator")
  const [connectionError, setConnectionError] = useState(null)
  const [accessKey, setAccessKey] = useState(null) // Added accessKey state

  const [supabaseModules, setSupabaseModules] = useState(null)

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
    showCancel: false,
  })

  // Progress Modal state
  const [progressModal, setProgressModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    progress: 0,
    type: "info",
    showCancel: false,
  })

  const [dataState, setDataState] = useState({
    deviceModels: [],
    iosVersions: [],
    appVersions: [],
    configurations: {},
    blacklistedUAs: new Set(),
    androidDeviceModels: [],
    androidBuildNumbers: [],
    androidAppVersions: [],
    instagramDeviceModels: [],
    instagramVersions: [],
    chromeVersions: [],
    resolutionDpis: [],
  })

  const [allCopied, setAllCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const {
    deviceModels,
    iosVersions,
    appVersions,
    configurations,
    blacklistedUAs,
    androidDeviceModels,
    androidBuildNumbers,
    androidAppVersions,
    instagramDeviceModels,
    instagramVersions,
    chromeVersions,
    resolutionDpis,
  } = dataState

  useEffect(() => {
    let mounted = true

    const initializeSupabase = async () => {
      try {
        const modules = await loadSupabaseModules()
        if (mounted) {
          setSupabaseModules(modules)
          setConnectionError(null)
        }
      } catch (error) {
        if (mounted) {
          setConnectionError(error.message)
          console.error("Failed to initialize Supabase:", error)
        }
      }
    }

    startTransition(() => {
      initializeSupabase()
    })

    return () => {
      mounted = false
    }
  }, [])

  const showModal = useCallback((title, message, type = "info", onConfirm = () => {}, showCancel = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel,
    })
  }, [])

  const showProgressModal = useCallback((title, message, progress = 0, type = "info", showCancel = false) => {
    setProgressModal({
      isOpen: true,
      title,
      message,
      progress,
      type,
      showCancel,
    })
  }, [])

  const hideProgressModal = useCallback(() => {
    setProgressModal((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const loadData = useCallback(async () => {
    if (!supabaseModules) return

    try {
      setConnectionError(null)

      const {
        DeviceModel,
        IOSVersion,
        AppVersion,
        Configuration,
        BlacklistedUserAgent,
        AndroidDeviceModel,
        AndroidBuildNumber,
        AndroidAppVersion,
        InstagramDeviceModel,
        InstagramVersion,
        ChromeVersion,
        ResolutionDpi,
      } = supabaseModules

      const loadBatch1 = Promise.all([DeviceModel.list(), IOSVersion.list(), AppVersion.list(), Configuration.list()])

      const loadBatch2 = Promise.all([
        BlacklistedUserAgent.list(),
        AndroidDeviceModel.list(),
        AndroidBuildNumber.list(),
        AndroidAppVersion.list(),
      ])

      const loadBatch3 = Promise.all([
        InstagramDeviceModel.list(),
        InstagramVersion.list(),
        ChromeVersion.list(),
        ResolutionDpi.list(),
      ])

      const [batch1, batch2, batch3] = await Promise.all([loadBatch1, loadBatch2, loadBatch3])

      const [devices, ios, apps, configs] = batch1
      const [blacklisted, androidDevices, androidBuilds, androidApps] = batch2
      const [instagramDevices, instagramVers, chromeVers, resDpis] = batch3

      startTransition(() => {
        const configsObj = {}
        configs.forEach((config) => {
          try {
            configsObj[config.config_key] = JSON.parse(config.config_value)
          } catch (e) {
            configsObj[config.config_key] = config.config_value
          }
        })

        const blacklistSet = new Set(blacklisted.map((b) => b.user_agent))

        setDataState({
          deviceModels: devices.filter((d) => d.is_active),
          iosVersions: ios.filter((v) => v.is_active),
          appVersions: apps.filter((a) => a.is_active),
          androidDeviceModels: androidDevices.filter((d) => d.is_active),
          androidBuildNumbers: androidBuilds.filter((b) => b.is_active),
          androidAppVersions: androidApps.filter((a) => a.is_active),
          instagramDeviceModels: instagramDevices.filter((d) => d.is_active),
          instagramVersions: instagramVers.filter((v) => v.is_active),
          chromeVersions: chromeVers.filter((v) => v.is_active),
          resolutionDpis: resDpis.filter((r) => r.is_active),
          configurations: configsObj,
          blacklistedUAs: blacklistSet,
        })
      })
    } catch (error) {
      console.error("Error loading data:", error)
      setConnectionError("Failed to load data. Please check your connection and try again.")
    }
  }, [supabaseModules])

  const loadHistory = useCallback(async () => {
    if (!supabaseModules) return

    try {
      setIsLoadingHistory(true)
      
      // Get current user's access key for filtering history
      const currentUser = AccessKey.getCurrentUser()
      if (!currentUser) return
      
      // Get only the current user's history
      const historyData = await GenerationHistory.filter({ 
        created_by: currentUser.access_key 
      }, '-generated_at')

      const userHistory = historyData
        .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
        .slice(0, 20)

      setHistory(userHistory)
    } catch (error) {
      console.error("Error loading history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [supabaseModules])

  useEffect(() => {
    if (supabaseModules) {
      loadData()
      loadHistory()
    }
  }, [supabaseModules, loadData, loadHistory])

  const handleHistoryDownload = useCallback(
    async (historyItem) => {
      if (!historyItem.user_agents || historyItem.user_agents.length === 0) {
        showModal("❌ ডেটা নেই!", "এই হিস্ট্রিতে কোন ইউজার এজেন্ট নেই।", "error")
        return
      }

      showModal(
        "📥 হিস্ট্রি ডাউনলোড",
        `আপনি কি ${historyItem.user_agents.length}টি ইউজার এজেন্ট আবার ডাউনলোড করতে চান?`,
        "info",
        async () => {
          setModal((prev) => ({ ...prev, isOpen: false }))

          try {
            const content = historyItem.user_agents.join("\n")
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url

            const appTypeDisplay = historyItem.app_type.replace("android_", "android-")
            const timestamp = new Date(historyItem.generated_at).toISOString().slice(0, 19).replace(/:/g, "-")
            a.download = `${appTypeDisplay}_user_agents_${timestamp}.txt`

            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            showModal(
              "✅ ডাউনলোড সফল!",
              `${historyItem.user_agents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড করা হয়েছে।`,
              "success",
            )
          } catch (error) {
            console.error("Error downloading from history:", error)
            showModal("❌ ডাউনলোড ব্যর্থ!", "ডাউনলোড করতে সমস্যা হয়েছে!", "error")
          }
        },
        true,
      )
    },
    [showModal],
  )

  const handleHistoryCopy = useCallback(
    async (historyItem) => {
      if (!historyItem.user_agents || historyItem.user_agents.length === 0) {
        showModal("❌ ডেটা নেই!", "এই হিস্ট্রিতে কোন ইউজার এজেন্ট নেই।", "error")
        return
      }

      try {
        const content = historyItem.user_agents.join("\n")
        await navigator.clipboard.writeText(content)

        showModal("✅ কপি সফল!", `${historyItem.user_agents.length}টি ইউজার এজেন্ট সফলভাবে কপি করা হয়েছে।`, "success")
      } catch (error) {
        console.error("Error copying from history:", error)
        showModal("❌ কপি ব্যর্থ!", "কপি করতে সমস্যা হয়েছে!", "error")
      }
    },
    [showModal],
  )

  const parseIOSVersion = (version) => {
    return version.split(".").map(Number)
  }

  const compareVersions = (v1, v2) => {
    const version1 = parseIOSVersion(v1)
    const version2 = parseIOSVersion(v2)

    for (let i = 0; i < Math.max(version1.length, version2.length); i++) {
      const a = version1[i] || 0
      const b = version2[i] || 0
      if (a < b) return -1
      if (a > b) return 1
    }
    return 0
  }

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const extractModelIdentifier = (modelName) => {
    if (!modelName) return modelName
    const match = modelName.match(/^([^\s(]+)/)
    return match ? match[1] : modelName
  }

  const generateAndroidInstagramUserAgent = async () => {
    try {
      if (!instagramDeviceModels.length || !instagramVersions.length || !chromeVersions.length) {
        console.error("Missing Instagram configuration data")
        return null
      }

      const versionPairs = {
        "11": "30/11",
        "12": "31/12",
        "13": "33/13",
        "14": "34/14",
        "15": "35/15",
      }

      const buildNumbers = {
        "11": "RP1A.200720.012",
        "12": "SP1A.210812.016",
        "13": "TP1A.220624.014",
        "14": "UP1A.231005.007",
        "15": "AP3A.240905.015.A2",
      }

      const languageConfig = configurations.languages
      if (!languageConfig) {
        throw new Error("Language configuration not found in database. Please configure languages in admin panel.")
      }

      let languagePercentages: { [key: string]: number }
      try {
        languagePercentages = typeof languageConfig === "string" ? JSON.parse(languageConfig) : languageConfig
      } catch (error) {
        throw new Error("Invalid language configuration format in database")
      }

      const device = instagramDeviceModels[Math.floor(Math.random() * instagramDeviceModels.length)]
      const androidVersion = device.android_version.toString()
      const versionPair = versionPairs[androidVersion]
      const buildNumber = buildNumbers[androidVersion]

      const resolutions = Array.isArray(device.resolutions)
        ? device.resolutions
        : device.resolutions.split(",").map((r) => r.trim())
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)]

      const matchingDpis = resolutionDpis.filter((rd) => rd.resolution === resolution)
      const dpiOptions = matchingDpis.length > 0 ? matchingDpis[0].dpis.map((d) => `${d}dpi`) : ["420dpi"]
      const dpi = dpiOptions[Math.floor(Math.random() * dpiOptions.length)]

      const language = getWeightedRandomLanguage(languagePercentages)

      const instagramVersion = instagramVersions[Math.floor(Math.random() * instagramVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const userAgent =
        `Mozilla/5.0 (Linux; Android ${androidVersion}; ${device.model} Build/${buildNumber}; wv) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `Instagram ${instagramVersion.version} Android (${versionPair}; ${dpi}; ${resolution}; ${device.manufacturer}; ` +
        `${device.model}; ${device.code}; ${device.chipset}; ${language}; ${instagramVersion.unique_id}; IABMV/1)`

      return userAgent
    } catch (error) {
      console.error("Error generating Instagram Android user agent:", error)
      return null
    }
  }

  const generateAndroidUserAgent = async () => {
    try {
      if (appType === "instagram") {
        return await generateAndroidInstagramUserAgent()
      }

      const device = androidDeviceModels[Math.floor(Math.random() * androidDeviceModels.length)]
      if (!device) throw new Error("No Android device models available")

      const buildNumber = androidBuildNumbers.find((b) => b.android_version === device.android_version)
      if (!buildNumber) throw new Error(`No build number found for ${device.android_version}`)

      const fbVersions = androidAppVersions.filter((a) => a.app_type === "facebook")
      const chromeVersions = androidAppVersions.filter((a) => a.app_type === "chrome")

      if (fbVersions.length === 0 || chromeVersions.length === 0) {
        throw new Error("No Facebook or Chrome versions available")
      }

      const fbVersion = fbVersions[Math.floor(Math.random() * fbVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      const modelIdentifier = extractModelIdentifier(device.model_name)

      const userAgent =
        `Mozilla/5.0 (Linux; ${device.android_version}; ${modelIdentifier} Build/${buildNumber.build_number}) ` +
        `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 ` +
        `Chrome/${chromeVersion.version} Mobile Safari/537.36 ` +
        `[FB_IAB/FB4A;FBAV/${fbVersion.version};IABMV/${fbVersion.iabmv};]`

      return userAgent
    } catch (error) {
      console.error("Error generating Android user agent:", error)
      return null
    }
  }

  const getWeightedRandomLanguage = (percentages) => {
    const random = Math.random() * 100
    let cumulative = 0

    for (const [lang, percentage] of Object.entries(percentages)) {
      cumulative += percentage
      if (random <= cumulative) {
        return lang
      }
    }

    // Fallback to first language if something goes wrong
    return Object.keys(percentages)[0]
  }

  const generateUserAgent = (
    platform,
    appType,
    deviceModels,
    iosVersions,
    appVersions,
    configurations,
    blacklistedUAs,
    androidDeviceModels,
    androidBuildNumbers,
    androidAppVersions,
    instagramDeviceModels,
    instagramVersions,
    chromeVersions,
    resolutionDpis,
  ) => {
    if (platform === "android") {
      return generateAndroidUserAgent()
    } else {
      try {
        const device = getRandomElement(deviceModels)
        if (!device) throw new Error("No device models available")

        const validIOSVersions = iosVersions.filter((ios) => {
          const versionCompareMin = compareVersions(ios.version, device.min_ios_version)
          const versionCompareMax = compareVersions(ios.version, device.max_ios_version)
          return versionCompareMin >= 0 && versionCompareMax <= 0
        })

        if (validIOSVersions.length === 0) {
          return generateUserAgent(
            platform,
            appType,
            deviceModels,
            iosVersions,
            appVersions,
            configurations,
            blacklistedUAs,
            androidDeviceModels,
            androidBuildNumbers,
            androidAppVersions,
            instagramDeviceModels,
            instagramVersions,
            chromeVersions,
            resolutionDpis,
          )
        }

        const iosVersion = getRandomElement(validIOSVersions)
        const appVersionsForType = appVersions.filter((app) => app.app_type === appType)

        if (appVersionsForType.length === 0) {
          throw new Error(`No app versions available for ${appType}`)
        }

        const appVersion = getRandomElement(appVersionsForType)

        const languageConfig = configurations.languages
        if (!languageConfig) {
          throw new Error("Language configuration not found in database. Please configure languages in admin panel.")
        }

        let languagePercentages: { [key: string]: number }
        try {
          languagePercentages = typeof languageConfig === "string" ? JSON.parse(languageConfig) : languageConfig
        } catch (error) {
          throw new Error("Invalid language configuration format in database")
        }

        const language = getWeightedRandomLanguage(languagePercentages)

        const deviceResolutions =
          device.resolutions && device.resolutions.length > 0 ? device.resolutions : ["828x1792", "1170x2532"]
        const deviceScaling =
          device.screen_scaling && device.screen_scaling.length > 0 ? device.screen_scaling : ["2.00", "3.00"]

        let userAgent

        const modelIdentifier = extractModelIdentifier(device.model_name)

        if (appType === "instagram") {
          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersion.version.replace(/\./g, "_")} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `Instagram ${appVersion.version} (${modelIdentifier}; iOS ${iosVersion.version.replace(/\./g, "_")}; ${language}; ` +
            `scale=${getRandomElement(deviceScaling)}; ${getRandomElement(deviceResolutions)}; ${appVersion.build_number})`
        } else {
          const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
          const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

          let fbrv = appVersion.fbrv
          if (fbrv) {
            fbrv = fbrv.toString()
          } else {
            fbrv = (Math.floor(Math.random() * 999999) + 700000000).toString()
          }

          const fbrv_part = extra ? "" : `;FBOP/5;FBRV/${fbrv}`
          const iabmv = Math.random() < 0.9 ? ";IABMV/1" : ""

          userAgent =
            `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersion.version.replace(/\./g, "_")} like Mac OS X) ` +
            `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
            `[FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${modelIdentifier};FBMD/iPhone;FBSN/iOS;` +
            `FBSV/${iosVersion.version};FBSS/${fbss};FBID/phone;FBLC/${language}${extra}${fbrv_part}${iabmv}]`
        }

        return userAgent
      } catch (error) {
        console.error("Error generating user agent:", error)
        return null
      }
    }
  }

  const handleGenerate = useCallback(async () => {
    if (!platform || !appType) {
      showModal("⚠️ নির্বাচন প্রয়োজন!", "অনুগ্রহ করে প্ল্যাটফর্ম এবং অ্যাপ টাইপ নির্বাচন করুন।", "warning")
      return
    }

    if (quantity < 1 || quantity > 10000) {
      showModal("⚠️ সংখ্যা সীমা!", "অনুগ্রহ করে ১ থেকে ১০,০০০ এর মধ্যে সংখ্যা দিন।", "warning")
      return
    }

    if (!supabaseModules) {
      showModal("⚠️ লোডিং!", "ডেটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।", "warning")
      return
    }

    if (connectionError) {
      showModal("⚠️ সংযোগ সমস্যা!", connectionError, "error")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setUserAgents([])

    showProgressModal("🚀 ইউজার এজেন্ট তৈরি হচ্ছে", "আপনার ইউনিক ইউজার এজেন্ট তৈরি করা হচ্ছে...", 0)

    try {
      const newUserAgents = []
      const usedUserAgents = new Set() // Track duplicates within this generation
      const maxAttempts = Math.max(quantity * 50, 10000) // Much higher attempt limit
      let attempts = 0
      let consecutiveFailures = 0
      const maxConsecutiveFailures = 100 // Stop if too many consecutive failures

      while (
        newUserAgents.length < quantity &&
        attempts < maxAttempts &&
        consecutiveFailures < maxConsecutiveFailures
      ) {
        const remaining = quantity - newUserAgents.length
        const successRate = attempts > 0 ? newUserAgents.length / attempts : 0.5
        const dynamicBatchSize = Math.min(
          Math.max(remaining, 100), // At least 100 per batch for efficiency
          Math.min(500, remaining * 2), // Up to 500 per batch, or 2x remaining
          maxAttempts - attempts,
        )

        const batchPromises = []

        for (let i = 0; i < dynamicBatchSize; i++) {
          batchPromises.push(
            generateUserAgent(
              platform,
              appType,
              deviceModels,
              iosVersions,
              appVersions,
              configurations,
              blacklistedUAs,
              androidDeviceModels,
              androidBuildNumbers,
              androidAppVersions,
              instagramDeviceModels,
              instagramVersions,
              chromeVersions,
              resolutionDpis,
            ),
          )
        }

        const batchResults = await Promise.all(batchPromises)
        let batchSuccessCount = 0

        for (const ua of batchResults) {
          if (ua && !blacklistedUAs.has(ua) && !usedUserAgents.has(ua)) {
            newUserAgents.push(ua)
            usedUserAgents.add(ua)
            batchSuccessCount++

            if (newUserAgents.length >= quantity) {
              break
            }
          }
        }

        if (batchSuccessCount === 0) {
          consecutiveFailures++
        } else {
          consecutiveFailures = 0
        }

        attempts += dynamicBatchSize

        const progress = Math.min(Math.round((newUserAgents.length / quantity) * 100), 100)

        startTransition(() => {
          setGenerationProgress(progress)
          setProgressModal((prev) => ({
            ...prev,
            progress,
            message: `✨ ${newUserAgents.length}/${quantity} ইউজার এজেন্ট তৈরি হয়েছে... (চেষ্টা: ${attempts}/${maxAttempts})`,
          }))
        })

        if (newUserAgents.length < quantity && attempts < maxAttempts && consecutiveFailures < maxConsecutiveFailures) {
          // Only delay if we haven't reached target and still have attempts left
          if (consecutiveFailures > 10) {
            await new Promise((resolve) => setTimeout(resolve, 100)) // Longer delay if struggling
          } else {
            await new Promise((resolve) => setTimeout(resolve, 10)) // Much shorter delay
          }
        }
      }

      const finalUserAgents = newUserAgents.slice(0, quantity)

      startTransition(() => {
        setUserAgents(finalUserAgents)
      })

      hideProgressModal()

      if (finalUserAgents.length === quantity) {
        showModal(
          "🎉 জেনারেশন সম্পন্ন!",
          `সফলভাবে ${finalUserAgents.length}টি ইউনিক ইউজার এজেন্ট তৈরি হয়েছে।`,
          "success",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      } else if (finalUserAgents.length >= quantity * 0.9) {
        // If we got at least 90% of requested amount
        showModal(
          "✅ জেনারেশন প্রায় সম্পন্ন!",
          `অনুরোধ: ${quantity}টি ইউজার এজেন্ট\n` +
            `জেনারেট হয়েছে: ${finalUserAgents.length}টি (${Math.round((finalUserAgents.length / quantity) * 100)}%)\n` +
            `এটি একটি চমৎকার ফলাফল! ${attempts} চেষ্টায় সর্বোচ্চ সংখ্যক ইউনিক ইউজার এজেন্ট তৈরি হয়েছে।`,
          "success",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      } else if (finalUserAgents.length >= quantity * 0.7) {
        // If we got at least 70% of requested amount
        showModal(
          "✅ জেনারেশন ভাল সম্পন্ন!",
          `অনুরোধ: ${quantity}টি ইউজার এজেন্ট\n` +
            `জেনারেট হয়েছে: ${finalUserAgents.length}টি (${Math.round((finalUserAgents.length / quantity) * 100)}%)\n` +
            `${attempts} চেষ্টার পর ভাল পরিমাণ ইউনিক ইউজার এজেন্ট তৈরি হয়েছে।`,
          "success",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      } else {
        showModal(
          "⚠️ জেনারেশন আংশিক সম্পন্ন!",
          `অনুরোধ: ${quantity}টি ইউজার এজেন্ট\n` +
            `জেনারেট হয়েছে: ${finalUserAgents.length}টি (${Math.round((finalUserAgents.length / quantity) * 100)}%)\n` +
            `${attempts} চেষ্টার পর সীমিত ডিভাইস মডেল/কনফিগারেশনের কারণে এটিই সর্বোচ্চ সম্ভব।\n\n` +
            `আরো ভ্যারিয়েশনের জন্য ভিন্ন প্ল্যাটফর্ম/অ্যাপ চেষ্টা করুন।`,
          "warning",
          () => setModal((prev) => ({ ...prev, isOpen: false })),
        )
      }
    } catch (error) {
      console.error("Error generating user agents:", error)
      hideProgressModal()
      showModal("❌ জেনারেশন ব্যর্থ!", "ইউজার এজেন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error")
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }, [
    platform,
    appType,
    quantity,
    supabaseModules,
    connectionError,
    deviceModels,
    iosVersions,
    appVersions,
    configurations,
    blacklistedUAs,
    androidDeviceModels,
    androidBuildNumbers,
    androidAppVersions,
    instagramDeviceModels,
    instagramVersions,
    chromeVersions,
    resolutionDpis,
  ])

  const addToBlacklist = async () => {
    if (!userAgents.length) return false

    try {
      console.log(`Adding ${userAgents.length} user agents to blacklist...`)

      showProgressModal("⚙️ প্রসেসিং চলছে", "ইউজার এজেন্টগুলো ব্ল্যাকলিস্ট করা হচ্ছে...", 0, "info", false)

      const finalAppType = platform === "android" ? `android_${appType}` : appType
      const { BlacklistedUserAgent } = supabaseModules

      const batchSize = 10
      const totalBatches = Math.ceil(userAgents.length / batchSize)

      for (let batch = 0; batch < totalBatches; batch++) {
        const batchStart = batch * batchSize
        const batchEnd = Math.min(batchStart + batchSize, userAgents.length)
        const batchUAs = userAgents.slice(batchStart, batchEnd)

        const batchPromises = batchUAs.map(async (ua, localIndex) => {
          const globalIndex = batchStart + localIndex
          try {
            const hash = btoa(ua)
              .replace(/[^a-zA-Z0-9]/g, "")
              .substring(0, 32)

            const result = await BlacklistedUserAgent.create({
              user_agent: ua,
              hash,
              downloaded_by: "anonymous@example.com",
              app_type: finalAppType,
            })

            return result
          } catch (error) {
            console.error(`Error blacklisting UA ${globalIndex + 1}:`, error)
            throw error
          }
        })

        await Promise.all(batchPromises)

        const progress = Math.round(((batch + 1) / totalBatches) * 100)
        startTransition(() => {
          setProgressModal((prev) => ({
            ...prev,
            progress,
            message: `🔒 ${batchEnd}/${userAgents.length} ইউজার এজেন্ট প্রসেস করা হয়েছে...`,
          }))
        })

        if (batch < totalBatches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      console.log(`Successfully blacklisted ${userAgents.length} user agents`)

      await loadData()

      hideProgressModal()
      return true
    } catch (error) {
      console.error("Error during blacklisting process:", error)
      hideProgressModal()
      return false
    }
  }

  const handleDownload = useCallback(async () => {
    if (!userAgents.length) return

    try {
      const currentUser = AccessKey.getCurrentUser()
      if (!currentUser) {
        showModal("❌ অথেন্টিকেশন ত্রুটি!", "ব্যবহারকারী তথ্য পাওয়া যায়নি।", "error")
        return
      }

      const historyId = await GenerationHistory.create({
        app_type: appType,
        quantity: userAgents.length,
        user_agents: userAgents,
        is_downloaded: true,
        created_by: currentUser.access_key,
      })

      const text = userAgents.join("\n")
      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `user-agents-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showModal("✅ ডাউনলোড সফল!", `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে ডাউনলোড করা হয়েছে।`, "success", async () => {
        setModal({ ...modal, isOpen: false })
        await addToBlacklist()
        setUserAgents([])
        setCurrentHistoryId(null)
        loadHistory()
      })
    } catch (error) {
      console.error("Error downloading file:", error)
      showModal("❌ এরর!", "ডাউনলোড করতে সমস্যা হয়েছে।", "error")
    }
  }, [userAgents, appType, showModal, loadHistory])

  const handleCopyAll = useCallback(async () => {
    if (userAgents.length === 0) return

    try {
      const text = userAgents.join("\n")
      await navigator.clipboard.writeText(text)

      const currentUser = AccessKey.getCurrentUser()
      if (!currentUser) {
        showModal("❌ অথেন্টিকেশন ত্রুটি!", "ব্যবহারকারী তথ্য পাওয়া যায়নি।", "error")
        return
      }

      const historyId = await GenerationHistory.create({
        app_type: appType,
        quantity: userAgents.length,
        user_agents: userAgents,
        is_downloaded: false,
        created_by: currentUser.access_key,
      })

      showModal("✅ কপি সফল!", `${userAgents.length}টি ইউজার এজেন্ট সফলভাবে কপি করা হয়েছে।`, "success", async () => {
        setModal({ ...modal, isOpen: false })
        await addToBlacklist()
        setUserAgents([])
        setCurrentHistoryId(null)
        loadHistory()
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      showModal("❌ এরর!", "কপি করতে সমস্যা হয়েছে।", "error")
    }
  }, [userAgents, appType, showModal, loadHistory])

  const copyToClipboard = useCallback((text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      <AppHeader />

      <main>
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardContent className="p-0">
            <nav className="flex border-b border-slate-200 dark:border-slate-600" role="tablist">
              <button
                onClick={() => setActiveTab("generator")}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === "generator"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
                role="tab"
                aria-selected={activeTab === "generator"}
                aria-controls="generator-panel"
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" aria-hidden="true" />
                  Generator
                </div>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" aria-hidden="true" />
                  History ({history.length})
                </div>
              </button>
            </nav>
          </CardContent>
        </Card>

        {activeTab === "generator" && (
          <section id="generator-panel" role="tabpanel" aria-labelledby="generator-tab">
            {!supabaseModules ? (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-300">ডেটা লোড হচ্ছে...</p>
                </CardContent>
              </Card>
            ) : (
              <GeneratorControls
                platform={platform}
                setPlatform={setPlatform}
                appType={appType}
                setAppType={setAppType}
                quantity={quantity}
                setQuantity={setQuantity}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
            )}

            {/* Results */}
            {userAgents.length > 0 && (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl mt-8">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      তৈরিকৃত ইউজার এজেন্ট ({userAgents.length} টি)
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleCopyAll}
                        variant="outline"
                        className="shadow-md bg-transparent dark:bg-slate-700 dark:border-slate-600"
                        disabled={isGenerating}
                        aria-label="Copy all user agents"
                      >
                        <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                        সবগুলো কপি
                      </Button>
                      <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-indigo-600 dark:from-indigo-600 dark:to-blue-500 dark:hover:from-indigo-700 dark:hover:to-indigo-700 shadow-lg"
                        disabled={isGenerating}
                        aria-label="Download all user agents"
                      >
                        <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                        সবগুলো ডাউনলোড
                      </Button>
                    </div>
                  </div>

                  <div
                    className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                    role="alert"
                  >
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                      <Shield className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">
                        ⚠️ গুরুত্বপূর্ণ: কপি বা ডাউনলোড করলে এই ইউজার এজেন্টগুলো স্থায়ীভাবে ব্ল্যাকলিস্ট হয়ে যাবে এবং পরবর্তীতে আর জেনারেট
                        হবে না।
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userAgents.slice(0, 10).map((ua, index) => (
                    <div
                      key={index}
                      className="group relative p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed break-all">
                            {ua}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(ua, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-600"
                          aria-label={`Copy user agent ${index + 1}`}
                        >
                          <Copy className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {userAgents.length > 10 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        এবং আরও {userAgents.length - 10} টি... সবগুলো দেখতে ডাউনলোড করুন
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {activeTab === "history" && (
          <section id="history-panel" role="tabpanel" aria-labelledby="history-tab">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  জেনারেশন হিস্ট্রি ({history.length} টি)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8" role="status" aria-label="Loading history">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    <span className="ml-2 text-slate-600 dark:text-slate-300">হিস্ট্রি লোড হচ্ছে...</span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">
                      এখনো কোন হিস্ট্রি নেই। প্রথমে কিছু ইউজার এজেন্ট জেনারেট করুন।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <article
                        key={item.id}
                        className="group relative p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {item.app_type.includes("android") ? (
                                <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                              ) : (
                                <span className="text-lg" aria-hidden="true">
                                  📱
                                </span>
                              )}
                              <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                                {item.app_type.replace("android_", "Android ").replace("_", " ")}
                              </span>
                              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                                {item.quantity} টি
                              </span>
                              {item.is_downloaded && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                  ডাউনলোড হয়েছে
                                </span>
                              )}
                            </div>
                            <time className="text-sm text-slate-500 dark:text-slate-400" dateTime={item.generated_at}>
                              {new Date(item.generated_at).toLocaleString("bn-BD", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleHistoryCopy(item)}
                              className="hover:bg-slate-100 dark:hover:bg-slate-600"
                              aria-label={`Copy ${item.quantity} user agents from history`}
                            >
                              <Copy className="w-4 h-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleHistoryDownload(item)}
                              className="hover:bg-slate-100 dark:hover:bg-slate-600"
                              aria-label={`Download ${item.quantity} user agents from history`}
                            >
                              <Download className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Enhanced Progress Modal */}
      <ProgressModal
        isOpen={progressModal.isOpen}
        title={progressModal.title}
        message={progressModal.message}
        progress={progressModal.progress}
        type={progressModal.type}
        showCancel={progressModal.showCancel}
        onCancel={() => hideProgressModal()}
      />

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
    </div>
  )
}
