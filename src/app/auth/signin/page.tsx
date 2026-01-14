import LoginForm from "@/components/auth/LoginForm"
import { Package, Shield, User, Lock } from "lucide-react"

const DEMO_CREDENTIALS = [
  { email: 'admin@example.com', password: 'Admin@123456', role: 'Admin', icon: Shield },
  { email: 'user@example.com', password: 'User@123456', role: 'User', icon: User },
]

export default function SignIn() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Package size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Inventory</span>
          </div>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Manage your inventory with confidence
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Track stock levels, manage suppliers, and streamline your operations with our powerful inventory management system.
          </p>
          
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Real-time tracking</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Secure access</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Inventory Management System
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Package size={22} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Inventory</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            <LoginForm />
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-2xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Demo Credentials</h3>
            </div>
            <div className="space-y-3">
              {DEMO_CREDENTIALS.map((cred, idx) => {
                const Icon = cred.icon
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{cred.role}</span>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono text-foreground/80">{cred.email}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono text-foreground/80">{cred.password}</span>
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
