"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Zap, Loader2, Instagram, Facebook, Smartphone } from "lucide-react"

interface GeneratorControlsProps {
  platform: string
  setPlatform: (value: string) => void
  appType: string
  setAppType: (value: string) => void
  quantity: number
  setQuantity: (value: number) => void
  isGenerating: boolean
  onGenerate: () => void
}

export default function GeneratorControls({
  platform,
  setPlatform,
  appType,
  setAppType,
  quantity,
  setQuantity,
  isGenerating,
  onGenerate,
}: GeneratorControlsProps) {
  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          Generation settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              প্ল্যাটফর্ম
            </Label>
            <Select value={platform} onValueChange={setPlatform} disabled={isGenerating}>
              <SelectTrigger
                id="platform"
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                aria-label="Select platform"
              >
                <SelectValue placeholder="প্ল্যাটফর্ম নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ios">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">
                      📱
                    </span>
                    iOS
                  </div>
                </SelectItem>
                <SelectItem value="android">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" aria-hidden="true" />
                    Android
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appType" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              অ্যাপ টাইপ
            </Label>
            <Select value={appType} onValueChange={setAppType} disabled={isGenerating || !platform}>
              <SelectTrigger
                id="appType"
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                aria-label="Select app type"
              >
                <SelectValue placeholder={!platform ? "প্রথমে প্ল্যাটফর্ম নির্বাচন করুন" : "অ্যাপ নির্বাচন করুন"} />
              </SelectTrigger>
              <SelectContent>
                {platform === "android" && (
                  <>
                    <SelectItem value="instagram">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" aria-hidden="true" />
                        Instagram
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" aria-hidden="true" />
                        Facebook
                      </div>
                    </SelectItem>
                  </>
                )}
                {platform === "ios" && (
                  <>
                    <SelectItem value="instagram">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" aria-hidden="true" />
                        Instagram
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" aria-hidden="true" />
                        Facebook
                      </div>
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              পরিমাণ
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="10000"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              placeholder="পরিমাণ লিখুন (১-১০,০০০)"
              disabled={isGenerating}
              aria-describedby="quantity-help"
            />
            <p id="quantity-help" className="sr-only">
              Enter quantity between 1 and 10,000
            </p>
          </div>
        </div>

        <Button
          onClick={onGenerate}
          disabled={isGenerating || !platform || !appType}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 shadow-lg h-12 text-base font-semibold"
          aria-describedby="generate-help"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              {quantity} টি ইউজার এজেন্ট তৈরি করা হচ্ছে...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
              {quantity} Generate {platform === "android" ? "Android" : "iOS"} UA
            </>
          )}
        </Button>
        <p id="generate-help" className="sr-only">
          Generate unique user agents for the selected platform and app
        </p>
      </CardContent>
    </Card>
  )
}
