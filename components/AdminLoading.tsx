"use client"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLoadingProps {
  message?: string
  className?: string
}

export default function AdminLoading({ message = "ডেটা লোড হচ্ছে...", className }: AdminLoadingProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden",
        className,
      )}
    >
      {/* Floating Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-violet-200/25 to-pink-200/25 rounded-full blur-2xl animate-pulse delay-500 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main Loading Container */}
      <div className="text-center relative z-10">
        {/* Glassmorphism Container */}
        <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-2xl">
          {/* Liquid Glass Spinner Container */}
          <div className="relative mb-6">
            {/* Outer Ring - Liquid Effect */}
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 animate-spin blur-sm"></div>
            
            {/* Middle Ring - Glass Effect */}
            <div className="absolute inset-1 w-18 h-18 mx-auto rounded-full bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm border border-white/30 animate-spin animation-delay-200"></div>
            
            {/* Inner Spinner */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 drop-shadow-lg" />
            </div>
            
            {/* Liquid Drops */}
            <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 bg-gradient-to-b from-blue-400 to-transparent rounded-full animate-bounce opacity-60"></div>
            <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-gradient-to-b from-purple-400 to-transparent rounded-full animate-bounce delay-300 opacity-40"></div>
            <div className="absolute top-1/4 right-0 w-1 h-1 bg-gradient-to-b from-cyan-400 to-transparent rounded-full animate-bounce delay-700 opacity-50"></div>
          </div>

          {/* Loading Text with Liquid Effect */}
          <div className="relative">
            <p className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2 animate-pulse">
              {message}
            </p>
            
            {/* Animated Dots */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-10 -left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-float blur-sm"></div>
        <div className="absolute -top-8 -right-8 w-3 h-3 bg-purple-400/40 rounded-full animate-float delay-1000 blur-sm"></div>
        <div className="absolute -bottom-6 -left-6 w-2 h-2 bg-cyan-400/50 rounded-full animate-float delay-500 blur-sm"></div>
        <div className="absolute -bottom-8 -right-12 w-5 h-5 bg-indigo-400/25 rounded-full animate-float delay-1500 blur-sm"></div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-10px) rotate(90deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.6;
          }
          75% { 
            transform: translateY(-10px) rotate(270deg); 
            opacity: 0.9;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  )
}

export { AdminLoading }
