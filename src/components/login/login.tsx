'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);

      if (response.error) {
        setError(response.error);
      } else if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-red-700 mb-6 shadow-lg">
            <span className="text-3xl">🎁</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gift Hub</h1>
          <p className="text-muted-foreground text-lg">HR Department Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border-2 border-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-accent/10 border border-accent rounded-lg text-sm text-accent font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border-2 border-border rounded-lg h-11"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full border-2 border-border rounded-lg h-11"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold h-11 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block animate-spin">⚙️</span>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent hover:text-red-700 font-bold transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: '👥', label: 'Manage Employees' },
            { icon: '🎉', label: 'Track Birthdays' },
            { icon: '🎁', label: 'Manage Gifts' },
          ].map((feature, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-card/50 border border-border hover:border-accent transition-colors">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="text-xs font-medium text-muted-foreground">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
