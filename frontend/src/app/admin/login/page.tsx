'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? 'Could not sign in');

      const destination = searchParams.get('from') || '/admin';
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ivory via-cream to-rose-50 px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <Link href="/" className="font-serif text-3xl tracking-[0.3em] text-charcoal-900">
            Zyra
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.42em] text-gold-500">
            Store Administration
          </p>
        </div>

        <form onSubmit={submit} className="card mt-8 p-7 sm:p-8">
          <h1 className="font-serif text-2xl text-charcoal-900">Welcome back</h1>
          <p className="mt-1 text-sm text-charcoal-400">
            Sign in to manage products, categories and orders.
          </p>

          <div className="mt-7 space-y-5">
            <div>
              <label className="label" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input px-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 transition hover:text-charcoal-900"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600"
            >
              {error}
            </motion.p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary mt-7 w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-charcoal-400">
          <Link href="/" className="transition hover:text-charcoal-900">
            ← Back to the storefront
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
