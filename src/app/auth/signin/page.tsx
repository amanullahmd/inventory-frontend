'use client';

import { useState } from 'react';
import LoginForm from "@/components/auth/LoginForm"
import Image from "next/image"
import { Shield, Lock, Building2, MapPin, School, Crown, User } from "lucide-react"

const DEMO_CREDENTIALS = [
  { 
    email: 'admin@example.com', 
    password: 'Admin@123456', 
    role: 'Admin', 
    level: 'Demo Account',
    icon: Shield,
    description: 'Demo admin account'
  },
  { 
    email: 'user@example.com', 
    password: 'User@123456', 
    role: 'User', 
    level: 'Demo Account',
    icon: User,
    description: 'Demo user account'
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
    role: 'Division Admin', 
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

  const handleCredentialClick = (email: string, password: string) => {
    setSelectedEmail(email);
    setSelectedPassword(password);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Government Branding */}
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

        {/* Content */}
        <div className="relative z-10 px-8 pt-12 space-y-8 flex-1 flex flex-col items-center justify-center">
          {/* Government Logo and Text */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white rounded-full p-5 shadow-2xl flex-shrink-0 border-4 border-blue-100">
              <Image
                src="/government-bangladesh-logo.avif"
                alt="Government of Bangladesh"
                width={96}
                height={96}
                className="rounded-full"
                quality={95}
                priority
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-700 text-lg font-semibold tracking-wide">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
              <p className="text-slate-800 text-xl font-bold">প্রাথমিক শিক্ষা অধিদপ্তর</p>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="relative w-72 h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
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
          <p className="text-slate-500">© 2026 প্রাথমিক শিক্ষা অধিদপ্তর</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Government Logo and Text - Mobile */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
            <div className="bg-blue-50 rounded-full p-3 border-2 border-blue-200">
              <Image
                src="/government-bangladesh-logo.avif"
                alt="Government of Bangladesh"
                width={64}
                height={64}
                className="rounded-full"
                quality={95}
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-slate-700 text-sm font-semibold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
              <p className="text-slate-800 text-base font-bold">প্রাথমিক শিক্ষা অধিদপ্তর</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <LoginForm initialEmail={selectedEmail} initialPassword={selectedPassword} />
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Demo Credentials (Click to Auto-fill)</h3>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {DEMO_CREDENTIALS.map((cred, idx) => {
                const Icon = cred.icon
                const isSelected = selectedEmail === cred.email;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCredentialClick(cred.email, cred.password)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-blue-100 border-blue-400 shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{cred.role}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{cred.level}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{cred.description}</p>
                      <div className="mt-1 space-y-0.5">
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
            <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
              💡 Main Branch can see all branches. Hierarchical users see their subordinate branches only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
