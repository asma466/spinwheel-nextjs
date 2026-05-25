"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, Loader2, EyeOff, Eye, PartyPopper } from 'lucide-react';
import { AppButton } from "../common/AppButton";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(prev => !prev);
  const { data: session } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        router.push('/dashboard');
      } else {
        toast.error("Access denied: Admins only");
      }
    }
  }, [session, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success("Logged in successfully!");
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans">

      {/* 🌟 Background Atmospheric Effects 🌟 */}
      {/* Glow Orbs */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-[#CE1B22]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-slate-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 mix-blend-multiply"></div>

      {/* 🎡 Huge Background Spinning Wheels (Dashed Rings) */}
      <div className="absolute w-[900px] h-[900px] border-[40px] border-dashed border-[#CE1B22]/5 rounded-full animate-[spin_80s_linear_infinite] pointer-events-none"></div>
      <div className="absolute w-[600px] h-[600px] border-[20px] border-dashed border-slate-500/15 rounded-full animate-[spin_50s_linear_infinite_reverse] pointer-events-none"></div>

      {/* 🎯 Premium Login Card */}
      <Card className="relative w-full max-w-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">

        {/* Festive Gradient Trim at the top */}
        <div className="h-2 w-full bg-gradient-to-r from-[#CE1B22] via-slate-500 to-[#CE1B22]"></div>

        <CardHeader className="space-y-4 pt-8 pb-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Logo */}
            <div className="relative w-40 h-16 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Zeta Technologies Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Badge Indicator */}
            <div className="px-4 py-1.5 bg-gradient-to-r from-[#CE1B22]/10 to-slate-500/10 border border-[#CE1B22]/20 text-[#CE1B22] rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <PartyPopper className="w-4 h-4 text-slate-500" />
              Birthday Wheel System
            </div>
          </div>

          <div className="text-center space-y-1.5 mt-2">
            <CardTitle className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-slate-500 font-medium text-sm">
              Sign in to manage employee birthdays 🎡
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CE1B22] transition-colors">
                  <Mail className="w-full h-full" />
                </div>
                <Input
                  id="email"
                  type="email"
                  // placeholder="admin@zetatech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 h-12 bg-white/50 border-slate-200 focus:border-[#CE1B22] focus:ring-[#CE1B22]/20 rounded-xl transition-all shadow-sm"
                  required={true}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CE1B22] transition-colors">
                  <Lock className="w-full h-full" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  // placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 pr-11 h-12 bg-white/50 border-slate-200 focus:border-[#CE1B22] focus:ring-[#CE1B22]/20 rounded-xl transition-all shadow-sm tracking-widest"
                  required={true}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <AppButton
                type="submit"
                loading={isLoading}
                className="w-full h-12 rounded-xl bg-[#CE1B22] hover:bg-[#AC141B] text-white font-bold text-base shadow-lg shadow-[#CE1B22]/25 transition-all active:scale-[0.98]"
                icon={!isLoading ? null : <Loader2 className="w-5 h-5 animate-spin" />}
              >
                {isLoading ? "Spinning..." : "Sign In"}
              </AppButton>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Decorative Bottom Graphic */}
      {/* <div className="absolute bottom-6 text-slate-400 text-sm font-medium tracking-wide flex items-center gap-2">
        Powered by <span className="font-bold text-slate-500">Zeta Technologies</span>
      </div> */}
    </div>
  );
}
