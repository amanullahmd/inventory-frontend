import LoginForm from "@/components/auth/LoginForm"
import Image from "next/image"
import { Package, Shield, User, Lock, Boxes, Warehouse, TrendingUp } from "lucide-react"

const DEMO_CREDENTIALS = [
  { email: 'admin@example.com', password: 'Admin@123456', role: 'Admin', icon: Shield },
  { email: 'user@example.com', password: 'User@123456', role: 'User', icon: User },
]

export default function SignIn() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding with Cover Photo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        {/* Water Wave Background Effect */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#e0f2fe', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#bae6fd', stopOpacity: 0.1 }} />
              </linearGradient>
            </defs>
            <path d="M0,400 Q300,350 600,400 T1200,400 L1200,800 L0,800 Z" fill="url(#waterGradient)" />
            <path d="M0,500 Q300,450 600,500 T1200,500 L1200,800 L0,800 Z" fill="#bae6fd" opacity="0.2" />
          </svg>
        </div>

        {/* Floating Icons - Top Right */}
        <div className="absolute top-20 right-10 opacity-20">
          <Boxes size={60} className="text-blue-400" />
        </div>

        {/* Floating Icons - Bottom Left */}
        <div className="absolute bottom-32 left-8 opacity-15">
          <Warehouse size={80} className="text-blue-300" />
        </div>

        {/* Floating Icons - Middle Right */}
        <div className="absolute top-1/2 right-16 opacity-10">
          <TrendingUp size={70} className="text-blue-400" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 pt-12 space-y-6 flex-1 flex flex-col items-center justify-start">
          {/* 1. DPE Inventory */}
          <div className="flex items-center gap-4 justify-center">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package size={40} className="text-blue-600" />
            </div>
            <span className="text-4xl font-bold text-slate-800">DPE Inventory</span>
          </div>

          {/* 2. Government Logo and Text */}
          <div className="flex items-center gap-6">
            <div className="bg-white rounded-full p-4 shadow-lg flex-shrink-0">
              <Image
                src="/government-bangladesh-logo.avif"
                alt="Government of Bangladesh"
                width={90}
                height={90}
                className="rounded-full"
                quality={90}
              />
            </div>
            <div className="text-left">
              <p className="text-slate-700 text-base font-semibold tracking-wide">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
              <p className="text-slate-800 text-lg font-bold">প্রাথমিক শিক্ষা অধিদপ্তর</p>
            </div>
          </div>

          {/* 3. Empty line space */}
          <div className="h-4"></div>

          {/* Cover Photo - After 3 lines */}
          <div className="relative w-64 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src="/DPE_cover.webp"
              alt="DPE Cover"
              fill
              className="object-cover object-center"
              quality={90}
            />
          </div>
        </div>
        
        <div className="relative z-10 px-8 pb-8 text-slate-600 text-xs text-center">
          <p className="mb-2">© 2026 DPE Inventory Management System</p>
          <p className="text-slate-500">Developed by FinkOps</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Government Logo and Text - Mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-blue-50 rounded-full p-2">
              <Image
                src="/government-bangladesh-logo.avif"
                alt="Government of Bangladesh"
                width={50}
                height={50}
                className="rounded-full"
                quality={90}
              />
            </div>
            <div className="text-left">
              <p className="text-slate-700 text-xs font-semibold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
              <p className="text-slate-800 text-xs font-bold">প্রাথমিক শিক্ষা অধিদপ্তর</p>
            </div>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package size={22} className="text-blue-600" />
            </div>
            <span className="text-xl font-bold text-slate-800">DPE Inventory</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <LoginForm />
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Demo Credentials</h3>
            </div>
            <div className="space-y-3">
              {DEMO_CREDENTIALS.map((cred, idx) => {
                const Icon = cred.icon
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{cred.role}</span>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-gray-600">
                          <span className="font-mono text-gray-800">{cred.email}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-mono text-gray-800">{cred.password}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
