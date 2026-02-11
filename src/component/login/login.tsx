 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export function LoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || 'Login failed');
//         return;
//       }

//       router.push('/dashboard');
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
//       <div className="w-full max-w-md px-4">
//         <Card className="shadow-xl border border-slate-200">
//           <CardHeader className="space-y-3 text-center pb-6">
//             <div className="flex justify-center mb-2">
//               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
//                 <span className="text-2xl">🎂</span>
//               </div>
//             </div>
//             <CardTitle className="text-3xl font-bold text-slate-900">
//               Birthday Dashboard
//             </CardTitle>
//             <CardDescription className="text-base text-slate-600">
//               Welcome back! Sign in to your account
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {error && (
//                 <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
//                   <AlertDescription className="text-sm">{error}</AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2.5">
//                 <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
//                   Email Address
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="john@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={loading}
//                   className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
//                   required
//                 />
//               </div>

//               <div className="space-y-2.5">
//                 <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
//                   Password
//                 </Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={loading}
//                   className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200"
//               >
//                 {loading ? (
//                   <div className="flex items-center gap-2">
//                     <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Signing in...
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>
//             </form>

//             <div className="pt-4 border-t border-slate-200">
//               <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Demo Credentials</p>
//               <div className="space-y-2.5 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
//                 <div>
//                   <p className="text-slate-600">
//                     <span className="font-semibold text-slate-900">Email:</span> john@company.com
//                   </p>
//                   <p className="text-slate-600">
//                     <span className="font-semibold text-slate-900">Password:</span> password123
//                   </p>
//                 </div>
//                 <div className="pt-2 border-t border-slate-300">
//                   <p className="text-slate-600">
//                     <span className="font-semibold text-slate-900">Email:</span> jane@company.com
//                   </p>
//                   <p className="text-slate-600">
//                     <span className="font-semibold text-slate-900">Password:</span> password123
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <p className="text-center text-sm text-slate-600 mt-6">
//           This is a secure employee portal. Please do not share your credentials.
//         </p>
//       </div>
//     </div>
//   );
// }





import React from "react"

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
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
            </div>

            <Button
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
            </Button>
          </form>

          <div className="mt-6 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
