'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Email and password are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    // Check for uppercase, lowercase, and number
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, and numbers');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      // Redirect to signin page
      router.push('/auth/signin?message=Account created successfully. Please sign in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div>
              <h1 className="text-4xl font-semibold text-foreground">Create account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Inventory Management System</p>
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-foreground">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:border-border focus:ring-2 focus:ring-ring"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-foreground">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:border-border focus:ring-2 focus:ring-ring"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:border-border focus:ring-2 focus:ring-ring"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-foreground">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:border-border focus:ring-2 focus:ring-ring"
                  placeholder="********"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-foreground">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:border-border focus:ring-2 focus:ring-ring"
                  placeholder="********"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-semibold text-foreground hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
