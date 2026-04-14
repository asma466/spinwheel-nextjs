"use client";
import React, { useEffect } from "react"

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, Loader2, EyeOff, Eye } from 'lucide-react';
import { AppButton } from "../common/AppButton";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
 const togglePassword = () => setShowPassword(prev => !prev);
const { data: session } = useSession();
console.log(session?.user?.role);


  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        toast.success("Logged in successfully!");
        router.push('/dashboard');
      } else {
        toast.error("Access denied: Admins only");
      }
    }
  }, [session, router]);
  // async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const result = await signIn('credentials', {
  //       email,
  //       password,
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       toast.error(result.error);
  //     }
  //     //  else if (result?.ok) {
  //     //   toast.success('Logged in successfully!');
  //     //   router.push('/dashboard');
  //     // }
  //     if (result?.ok) {
  //       // 🔥 Get session AFTER login
   

  //       if (session?.user?.role === "ADMIN") {
  //         toast.success("Logged in successfully!");
  //         router.push("/dashboard");
  //       } else {
  //         toast.error("Access denied: Admins only");
  //       }
  //     }
  //   } catch (error) {
  //     toast.error('An error occurred. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

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
      } 
      // No need to fetch session manually — useSession will react
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-[#CE1B22] font-heading text-center"> Zeta Technologies</CardTitle>
          
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-heading font-bold text-gray-700 ">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 font-heading"
                  required={true}
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
            </div> */}

 {/* Password with eye toggle */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold font-heading text-gray-700 ">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 pr-10 font-heading"
                  required={true}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button> */}

            <AppButton
              type="submit"
              loading={isLoading}
              className="w-full"
              icon={!isLoading ? null : <Loader2 className="w-4 h-4 animate-spin" />}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </AppButton>
          </form>

          {/* <div className="mt-6 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>



    // <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-pink-500 via-yellow-400 to-purple-600 p-4">

    //   {/* 🎡 Spinning Wheel Background */}
    //   <div className="absolute w-[600px] h-[600px] border-[40px] border-dashed border-white/20 rounded-full animate-spin-slow"></div>

    //   {/* ✨ Glow Effects */}
    //   <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-40"></div>
    //   <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink-400 rounded-full blur-3xl opacity-40"></div>
    //   <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-400 rounded-full blur-2xl opacity-30"></div>

    //   {/* 🎯 Login Card */}
    //   <Card className="relative w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-xl border-0 rounded-2xl animate-in fade-in zoom-in-95 duration-300">

    //     <CardHeader className="space-y-2">
    //       <CardTitle className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-600">
    //         🎉 Welcome Back!
    //       </CardTitle>

    //       <CardDescription className="text-center text-gray-600">
    //         Spin into your account and continue the fun 🎡
    //       </CardDescription>
    //     </CardHeader>

    //     <CardContent>
    //       <form onSubmit={onSubmit} className="space-y-4">

    //         {/* Email */}
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">Email Address</label>
    //           <div className="relative">
    //             <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    //             <Input
    //               type="email"
    //               placeholder="Enter your email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               disabled={isLoading}
    //               required
    //               className="pl-10 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-300"
    //             />
    //           </div>
    //         </div>

    //         {/* Password */}
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">Password</label>
    //           <div className="relative">
    //             <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    //             <Input
    //               type="password"
    //               placeholder="Enter your password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               disabled={isLoading}
    //               required
    //               className="pl-10 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-300"
    //             />
    //           </div>
    //         </div>

    //         {/* Button */}
    //         <AppButton
    //           type="submit"
    //           loading={isLoading}
    //           className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-600 hover:opacity-90 text-white font-semibold"
    //         >
    //           {isLoading ? "Spinning..." : "Spin & Sign In 🎡"}
    //         </AppButton>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>



    // <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">

    //   {/* 🎡 Subtle Spinning Ring */}
    //   <div className="absolute w-[500px] h-[500px] border-[30px] border-dashed border-[#CE1B22]/20 rounded-full animate-spin-slow"></div>

    //   {/* ✨ Soft Glow Effects */}
    //   <div className="absolute top-10 left-10 w-40 h-40 bg-[#CE1B22]/30 rounded-full blur-3xl"></div>
    //   <div className="absolute bottom-10 right-10 w-52 h-52 bg-[#7A7A7A]/20 rounded-full blur-3xl"></div>

    //   {/* 🎯 Login Card */}
    //   <Card className="relative w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl animate-in fade-in zoom-in-95 duration-300">

    //     <CardHeader className="space-y-2">
    //       <CardTitle className="text-3xl font-extrabold text-center text-[#CE1B22]">
    //         Welcome Back
    //       </CardTitle>

    //       <CardDescription className="text-center text-[#7A7A7A]">
    //         Sign in to continue to your dashboard
    //       </CardDescription>
    //     </CardHeader>

    //     <CardContent>
    //       <form onSubmit={onSubmit} className="space-y-4">

    //         {/* Email */}
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium text-black">
    //             Email Address
    //           </label>
    //           <div className="relative">
    //             <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A7A]" />
    //             <Input
    //               type="email"
    //               placeholder="Enter your email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               disabled={isLoading}
    //               required
    //               className="pl-10 rounded-xl border border-gray-300 focus:border-[#CE1B22] focus:ring-[#CE1B22]"
    //             />
    //           </div>
    //         </div>

    //         {/* Password */}
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium text-black">
    //             Password
    //           </label>
    //           <div className="relative">
    //             <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A7A]" />
    //             <Input
    //               type="password"
    //               placeholder="Enter your password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               disabled={isLoading}
    //               required
    //               className="pl-10 rounded-xl border border-gray-300 focus:border-[#CE1B22] focus:ring-[#CE1B22]"
    //             />
    //           </div>
    //         </div>

    //         {/* Button */}
    //         <AppButton
    //           type="submit"
    //           loading={isLoading}
    //           className="w-full rounded-xl bg-[#CE1B22] hover:bg-[#b1191d] text-white font-semibold"
    //         >
    //           {isLoading ? "Signing in..." : "Sign In"}
    //         </AppButton>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}

