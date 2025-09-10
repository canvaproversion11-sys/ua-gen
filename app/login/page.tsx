"use client"

import type React from "react"

import { useState } from "react"
import { AccessKey } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, Shield, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [accessKey, setAccessKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessKey.trim()) {
      setError("অ্যাকসেস কী প্রয়োজন")
      return
    }

    setLoading(true)
    setError("")

    try {
      const user = await AccessKey.authenticate(accessKey.trim())

      console.log("[v0] Authentication successful, user:", user)

      try {
        // Ensure we're on client side
        if (typeof window !== "undefined") {
          // Try to clear any existing data first to avoid quota issues
          try {
            localStorage.removeItem("authenticated_user")
          } catch (clearError) {
            console.log("[v0] Could not clear localStorage:", clearError)
          }

          let storageSuccess = false
          let storageMethod = ""

          // Try localStorage first
          try {
            localStorage.setItem("authenticated_user", JSON.stringify(user))
            const testRetrieve = localStorage.getItem("authenticated_user")
            if (testRetrieve && JSON.parse(testRetrieve)) {
              storageSuccess = true
              storageMethod = "localStorage"
              console.log("[v0] Successfully stored user in localStorage")
            }
          } catch (localStorageError) {
            console.log("[v0] localStorage failed:", localStorageError)

            // Fallback to sessionStorage
            try {
              sessionStorage.setItem("authenticated_user", JSON.stringify(user))
              const testRetrieve = sessionStorage.getItem("authenticated_user")
              if (testRetrieve && JSON.parse(testRetrieve)) {
                storageSuccess = true
                storageMethod = "sessionStorage"
                console.log("[v0] Successfully stored user in sessionStorage as fallback")
              }
            } catch (sessionStorageError) {
              console.log("[v0] sessionStorage also failed:", sessionStorageError)
            }
          }

          if (!storageSuccess) {
            throw new Error("Both localStorage and sessionStorage failed")
          }

          // Verify the storage worked with AccessKey.getCurrentUser()
          const verifiedUser = AccessKey.getCurrentUser()
          console.log("[v0] Verified user via AccessKey.getCurrentUser():", verifiedUser)

          if (!verifiedUser) {
            throw new Error(`Failed to verify user storage using ${storageMethod}`)
          }

          console.log("[v0] User successfully stored and verified using:", storageMethod)
        } else {
          throw new Error("Window object not available")
        }
      } catch (storageError) {
        console.error("[v0] Storage error:", storageError)
        setError("লগইন সংরক্ষণে সমস্যা হয়েছে। ব্রাউজার সেটিংস চেক করুন অথবা আবার চেষ্টা করুন।")
        return
      }

      // Add delay to ensure everything is properly set
      await new Promise((resolve) => setTimeout(resolve, 200))

      console.log("[v0] Redirecting to /admin")
      window.location.href = "/admin"
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "লগইন ব্যর্থ হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes liquidFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(20px, -15px) rotate(1deg) scale(1.02); }
          50% { transform: translate(-15px, 10px) rotate(-0.5deg) scale(0.98); }
          75% { transform: translate(10px, 5px) rotate(0.8deg) scale(1.01); }
        }

        @keyframes liquidPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .liquid-glass {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          overflow: visible !important;
        }

        .liquid-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 200%;
          animation: shimmer 3s infinite;
          pointer-events: none;
        }

        .liquid-glass::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 50%
          );
          animation: liquidFloat 8s infinite ease-in-out;
          pointer-events: none;
        }

        .glass-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.3),
            rgba(59, 130, 246, 0.1),
            transparent
          );
          filter: blur(1px);
          animation: liquidFloat 6s infinite ease-in-out;
        }

        .glass-orb:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: -1s;
        }

        .glass-orb:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 20%;
          animation-delay: -3s;
        }

        .glass-orb:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 60%;
          animation-delay: -5s;
        }

        .input-glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .input-glass:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .button-glass {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.8),
            rgba(59, 130, 246, 0.6)
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .button-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .button-glass:hover::before {
          left: 100%;
        }

        .password-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .password-toggle:active {
          transform: scale(0.95);
        }

        .cat-container {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 20px rgba(255, 69, 58, 0.3);
        }

        .cat-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200% 200%;
          animation: shimmer 3s infinite;
          border-radius: 50%;
          pointer-events: none;
        }

        .cat {
          width: 90px;
          height: 90px;
          position: relative;
          cursor: pointer;
          z-index: 35;
        }

        .cat-body {
          width: 55px;
          height: 40px;
          background: linear-gradient(145deg, #ff7b54, #ff6347);
          border-radius: 45% 45% 35% 35%;
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 
            0 4px 15px rgba(255, 99, 71, 0.4),
            inset -2px -2px 8px rgba(255, 69, 58, 0.3),
            inset 2px 2px 8px rgba(255, 160, 122, 0.3);
        }

        .cat-head {
          width: 45px;
          height: 45px;
          background: linear-gradient(145deg, #ff8c69, #ff7b54);
          border-radius: 48%;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 
            0 4px 20px rgba(255, 123, 84, 0.5),
            inset -2px -2px 8px rgba(255, 99, 71, 0.4),
            inset 2px 2px 8px rgba(255, 160, 122, 0.4);
        }

        .cat-head::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 8px;
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          filter: blur(3px);
        }

        .cat-ears {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cat-ear {
          width: 14px;
          height: 18px;
          background: linear-gradient(145deg, #ff7b54, #ff6347);
          border-radius: 45% 45% 5% 5%;
          position: absolute;
          box-shadow: 
            0 2px 10px rgba(255, 99, 71, 0.4),
            inset -1px -1px 4px rgba(255, 69, 58, 0.3),
            inset 1px 1px 4px rgba(255, 160, 122, 0.3);
        }

        .cat-ear:first-child {
          left: -18px;
          transform: rotate(-25deg);
        }

        .cat-ear:last-child {
          right: -18px;
          transform: rotate(25deg);
        }

        .cat-ear-inner {
          width: 7px;
          height: 10px;
          background: linear-gradient(145deg, #ffc0cb, #ffb6c1);
          border-radius: 45% 45% 0 0;
          position: absolute;
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: inset 0 1px 3px rgba(255, 182, 193, 0.5);
        }

        .cat-eyes {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 40;
        }

        .cat-eye {
          width: 9px;
          height: 11px;
          background: linear-gradient(145deg, #2d3748, #1a202c);
          border-radius: 50% 50% 45% 45%;
          position: absolute;
          box-shadow: 
            0 0 12px rgba(45, 55, 72, 0.6),
            inset 0 1px 2px rgba(255, 255, 255, 0.2);
        }

        .cat-eye::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
        }

        .cat-eye:first-child {
          left: -10px;
        }

        .cat-eye:last-child {
          right: -10px;
        }

        .cat-nose {
          width: 5px;
          height: 4px;
          background: linear-gradient(145deg, #ff1744, #dc143c);
          border-radius: 50% 50% 45% 45%;
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 
            0 1px 4px rgba(255, 23, 68, 0.6),
            inset 0 0.5px 1px rgba(255, 105, 180, 0.4);
        }

        .cat-nose::before {
          content: '';
          position: absolute;
          top: 1px;
          left: 1px;
          width: 2px;
          height: 1px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
        }

        .cat-mouth {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cat-mouth::before,
        .cat-mouth::after {
          content: '';
          width: 8px;
          height: 4px;
          border: 1.5px solid #2d3748;
          border-top: none;
          border-radius: 0 0 50px 50px;
          position: absolute;
          opacity: 0.8;
        }

        .cat-mouth::before {
          left: -4px;
          transform: rotate(-15deg);
        }

        .cat-mouth::after {
          right: -4px;
          transform: rotate(15deg);
        }

        .cat-paws {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          transform: translateX(-50%) translateY(10px) scale(0.8);
          z-index: 45;
        }

        .cat-paws.covering {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        .cat-paw {
          width: 14px;
          height: 18px;
          background: linear-gradient(145deg, #ff8c69, #ff7b54);
          border-radius: 35% 35% 50% 50%;
          position: absolute;
          box-shadow: 
            0 2px 10px rgba(255, 123, 84, 0.5),
            inset -1px -1px 4px rgba(255, 99, 71, 0.3),
            inset 1px 1px 4px rgba(255, 160, 122, 0.3);
        }

        .cat-paw:first-child {
          left: -14px;
          transform: rotate(-15deg);
        }

        .cat-paw:last-child {
          right: -14px;
          transform: rotate(15deg);
        }

        .cat-paw-pads {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cat-paw-pad {
          background: linear-gradient(145deg, #ff1744, #dc143c);
          border-radius: 50%;
          position: absolute;
          box-shadow: 
            0 1px 2px rgba(255, 23, 68, 0.3),
            inset 0 0.5px 1px rgba(255, 105, 180, 0.3);
        }

        .cat-paw-pad:nth-child(1) { 
          width: 3px; height: 3px; 
          top: -2px; left: -2px; 
        }
        .cat-paw-pad:nth-child(2) { 
          width: 3px; height: 3px; 
          top: -2px; right: -2px; 
        }
        .cat-paw-pad:nth-child(3) { 
          width: 5px; height: 3px; 
          top: 1px; left: 50%; 
          transform: translateX(-50%); 
          border-radius: 50%; 
        }

        .cat-tail {
          width: 8px;
          height: 32px;
          background: linear-gradient(to bottom, #ff7b54, #ff6347, #ff4500);
          border-radius: 50px;
          position: absolute;
          bottom: 12px;
          right: -12px;
          transform: rotate(25deg);
          animation: tailWag 2.5s ease-in-out infinite;
          box-shadow: 
            0 2px 10px rgba(255, 99, 71, 0.4),
            inset -1px 0 4px rgba(255, 69, 0, 0.3),
            inset 1px 0 4px rgba(255, 160, 122, 0.3);
        }

        .cat-tail::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 1px;
          width: 2px;
          height: 15px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          filter: blur(1px);
        }

        @keyframes tailWag {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(35deg); }
        }

        .cat:hover .cat-tail {
          animation-duration: 0.5s;
        }

        .cat-whiskers {
          position: absolute;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cat-whisker {
          width: 20px;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(45, 55, 72, 0.9), rgba(45, 55, 72, 0.3));
          position: absolute;
          border-radius: 2px;
          box-shadow: 0 0.5px 2px rgba(0, 0, 0, 0.2);
        }

        .cat-whisker:nth-child(1) { 
          top: -3px; left: -25px; 
          transform: rotate(-12deg); 
          width: 22px;
        }
        .cat-whisker:nth-child(2) { 
          top: 3px; left: -25px; 
          transform: rotate(12deg); 
          width: 18px;
        }
        .cat-whisker:nth-child(3) { 
          top: -3px; right: -25px; 
          transform: rotate(12deg); 
          width: 22px;
          background: linear-gradient(270deg, rgba(45, 55, 72, 0.9), rgba(45, 55, 72, 0.3));
        }
        .cat-whisker:nth-child(4) { 
          top: 3px; right: -25px; 
          transform: rotate(-12deg); 
          width: 18px;
          background: linear-gradient(270deg, rgba(45, 55, 72, 0.9), rgba(45, 55, 72, 0.3));
        }

        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .floating-bubble {
          position: absolute;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.2),
            rgba(59, 130, 246, 0.05),
            transparent
          );
          border-radius: 50%;
          animation: liquidPulse 4s infinite ease-in-out;
        }

        .floating-bubble:nth-child(1) {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .floating-bubble:nth-child(2) {
          width: 40px;
          height: 40px;
          top: 70%;
          right: 25%;
          animation-delay: -2s;
        }

        .floating-bubble:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 70%;
          animation-delay: -4s;
        }

        .main-content {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="glass-orb"></div>
          <div className="glass-orb"></div>
          <div className="glass-orb"></div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-bubble"></div>
          <div className="floating-bubble"></div>
          <div className="floating-bubble"></div>
        </div>

        <div className="main-content w-full max-w-md space-y-8 p-6 relative" style={{ paddingTop: "40px" }}>
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 liquid-glass flex items-center justify-center shadow-2xl">
              <Shield className="w-8 h-8 text-blue-300" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">UAGen Pro</h1>
              <p className="text-blue-200 text-lg"></p>
            </div>
          </div>

          <div className="liquid-glass shadow-2xl p-8 relative overflow-visible" style={{ marginTop: "120px" }}>
            {/* Animated Cat */}
            <div className="cat-container">
              <div className="cat">
                <div className="cat-body"></div>
                <div className="cat-head">
                  <div className="cat-ears">
                    <div className="cat-ear">
                      <div className="cat-ear-inner"></div>
                    </div>
                    <div className="cat-ear">
                      <div className="cat-ear-inner"></div>
                    </div>
                  </div>
                  <div className="cat-eyes">
                    <div className="cat-eye"></div>
                    <div className="cat-eye"></div>
                  </div>
                  <div className={`cat-paws ${isInputFocused ? "covering" : ""}`}>
                    <div className="cat-paw">
                      <div className="cat-paw-pads">
                        <div className="cat-paw-pad"></div>
                        <div className="cat-paw-pad"></div>
                        <div className="cat-paw-pad"></div>
                      </div>
                    </div>
                    <div className="cat-paw">
                      <div className="cat-paw-pads">
                        <div className="cat-paw-pad"></div>
                        <div className="cat-paw-pad"></div>
                        <div className="cat-paw-pad"></div>
                      </div>
                    </div>
                  </div>
                  <div className="cat-nose"></div>
                  <div className="cat-mouth"></div>
                  <div className="cat-whiskers">
                    <div className="cat-whisker"></div>
                    <div className="cat-whisker"></div>
                    <div className="cat-whisker"></div>
                    <div className="cat-whisker"></div>
                  </div>
                </div>
                <div className="cat-tail"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5 text-blue-300" />
                  <h2 className="text-xl font-semibold text-white">UAgen Pro</h2>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="accessKey" className="text-sm font-medium text-blue-100 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    অ্যাকসেস কী
                  </Label>
                  <div className="relative group">
                    <Input
                      id="accessKey"
                      type={showPassword ? "text" : "password"}
                      placeholder="আপনার গোপনীয় অ্যাকসেস কী লিখুন"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      className="h-12 pl-4 pr-12 text-base input-glass text-white placeholder:text-blue-300/70 transition-all duration-300"
                      disabled={loading}
                      autoComplete="off"
                      aria-describedby={error ? "error-message" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg password-toggle flex items-center justify-center text-blue-300 hover:text-blue-200 transition-all duration-200"
                      disabled={loading}
                      aria-label={showPassword ? "অ্যাকসেস কী লুকান" : "অ্যাকসেস কী দেখান"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="liquid-glass border-red-500/50 bg-red-500/10">
                    <AlertDescription id="error-message" className="text-sm text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium button-glass text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
                  disabled={loading || !accessKey.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      প্রবেশ করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      নিরাপদ প্রবেশ
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-6 border-t border-white/10">
                <div className="text-center space-y-2">
                  <p className="text-sm text-blue-200">সাহায্যের প্রয়োজন?</p>
                  <p className="text-xs text-blue-300/80">অ্যাডমিনের সাথে যোগাযোগ করুন</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-blue-300/60 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              আপনার তথ্য সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
