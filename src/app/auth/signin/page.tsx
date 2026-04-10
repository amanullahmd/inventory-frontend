'use client';

import { useState, useEffect } from 'react';
import LoginForm from "@/components/auth/LoginForm"
import AuthSlider from "@/components/auth/AuthSlider"
import { Shield, Lock, Building2, MapPin, School, Crown, User } from "lucide-react"

const DEMO_CREDENTIALS = [
  {
    email: 'admin@example.com',
    password: 'Admin@123456',
    role: 'Superior Admin',
    level: 'System Admin',
    icon: Crown,
    description: 'Manage everything superior'
  },
  {
    email: 'central@example.com',
    password: 'Central@123456',
    role: 'Central Manager',
    level: 'Central Office',
    icon: Shield,
    description: 'Can do everything except user create'
  },
  {
    email: 'divadmin@example.com',
    password: 'Division@123456',
    role: 'Division Admin',
    level: 'Division Level',
    icon: Building2,
    description: 'Manage division operations'
  },
  {
    email: 'divuser@example.com',
    password: 'User@123456',
    role: 'Division User',
    level: 'Can create demand',
    icon: User,
    description: 'Daily stock operations'
  },
  {
    email: 'user@example.com',
    password: 'User@123456',
    role: 'Demo User',
    level: 'Demo Account',
    icon: User,
    description: 'Legacy demo account'
  },
  {
    email: 'main@dpe.gov.bd',
    password: 'main123',
    role: 'Main Branch Admin',
    level: 'প্রাথমিক শিক্ষা অধিদপ্তর (Main)',
    icon: Crown,
    description: 'Can see all branches and manage entire system'
  },
  {
    email: 'admin@dpe.gov.bd',
    password: 'admin123',
    role: 'Division Admin (DPE)',
    level: 'ঢাকা বিভাগ',
    icon: Shield,
    description: 'Can see all lower branches'
  },
  {
    email: 'district.dhaka@dpe.gov.bd',
    password: 'district123',
    role: 'District Manager',
    level: 'ঢাকা জেলা',
    icon: Building2,
    description: 'Can see upazilas and schools'
  },
  {
    email: 'upazila.dhanmondi@dpe.gov.bd',
    password: 'upazila123',
    role: 'Upazila Manager',
    level: 'ধানমন্ডি উপজেলা',
    icon: MapPin,
    description: 'Can see schools in this upazila'
  },
  {
    email: 'school.dhanmondi@dpe.gov.bd',
    password: 'school123',
    role: 'School Principal',
    level: 'ধানমন্ডি প্রাথমিক বিদ্যালয়',
    icon: School,
    description: 'Can request supplies only'
  },
]

export default function SignIn() {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedPassword, setSelectedPassword] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    setIsLargeScreen(window.innerWidth >= 1024);
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCredentialClick = (email: string, password: string) => {
    setSelectedEmail(email);
    setSelectedPassword(password);
  };

  return (
    <div className="min-h-screen bg-neutral flex">
      {/* Left Panel - Government Branding */}
      {isLargeScreen && (
        <div className="w-1/2 relative overflow-hidden flex-col justify-between bg-primary flex">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="1200" height="800" fill="url(#dots)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 pt-12 md:pt-20 flex-1 flex flex-col items-center justify-start">
            {/* Government Text */}
            <div className="text-center space-y-4 mb-10 w-full">
              <p className="text-white text-2xl md:text-3xl font-bold tracking-wide">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
              <p className="text-primary-foreground text-xl md:text-2xl font-semibold opacity-90">প্রাথমিক শিক্ষা অধিদপ্তর</p>
              <div className="h-1 w-24 bg-white/30 mx-auto rounded-full mt-4"></div>
            </div>

            {/* Cover Photo / Slider */}
            <div className="w-full max-w-3xl px-4 flex-1 flex items-start justify-center">
              <AuthSlider />
            </div>
          </div>

          <div className="relative z-10 px-8 pb-8 text-white/70 text-xs text-center">
            <p>© 2026 প্রাথমিক শিক্ষা অধিদপ্তর</p>
          </div>
        </div>
      )}

      {/* Right Panel - Login Form */}
      <div className={`flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto ${isLargeScreen ? 'flex-1' : 'w-full'}`}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
            <p className="text-gray-600 text-lg">Sign in to your account</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <LoginForm initialEmail={selectedEmail} initialPassword={selectedPassword} />
          </div>

          {/* Demo Credentials Section */}
          <div className="rounded-2xl border border-border bg-accent/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock size={18} className="text-primary-foreground" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Demo Credentials</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">Click any account to auto-fill credentials</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {DEMO_CREDENTIALS.map((cred, idx) => {
                const Icon = cred.icon
                const isSelected = selectedEmail === cred.email;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCredentialClick(cred.email, cred.password)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected
                      ? 'border-primary shadow-md bg-white'
                      : 'bg-white border-border hover:border-primary'
                      }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary/80'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{cred.role}</span>
                        <span className="text-xs bg-primary/10 text-accent px-2 py-0.5 rounded-full whitespace-nowrap">{cred.level}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{cred.description}</p>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs text-gray-600">
                          <span className="font-mono text-gray-800 text-xs">{cred.email}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-mono text-gray-800 text-xs">{cred.password}</span>
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-200">
              💡 Main Branch can see all branches. Hierarchical users see their subordinate branches only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
