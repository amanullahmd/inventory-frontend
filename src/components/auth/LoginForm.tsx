'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle, Loader2, Mail, Lock, ArrowRight, WifiOff } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
    initialEmail?: string;
    initialPassword?: string;
}

export default function LoginForm({ initialEmail = '', initialPassword = '' }: LoginFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    // Update form when props change
    useEffect(() => {
        setEmail(initialEmail);
        setPassword(initialPassword);
    }, [initialEmail, initialPassword]);

    // Track online/offline status
    useEffect(() => {
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isOffline) {
            setError('You are offline. Please check your internet connection.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid username or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {isOffline && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 animate-slide-down">
                    <WifiOff className="h-5 w-5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium">You&apos;re offline</p>
                        <p className="text-xs text-amber-600 mt-0.5">Sign in requires an internet connection</p>
                    </div>
                </div>
            )}

            {error && !isOffline && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 animate-slide-down">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email or Username
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all disabled:opacity-50"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all disabled:opacity-50"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || isOffline}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-900 text-white font-semibold shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <>
                        <span>Sign in</span>
                        <ArrowRight className="h-5 w-5" />
                    </>
                )}
            </button>

            <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-emerald-600 font-semibold hover:underline">
                    Sign up
                </Link>
            </p>
        </form >
    );
}
