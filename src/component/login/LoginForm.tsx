"use client";

import { Card, CardContent } from "@/components/ui/card";

import LoginBackground from "./LoginBackground";
import LoginHeader from "./LoginHeader";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";

import { useLogin } from "@/src/hooks/useLogin";

export function LoginForm() {
  const {
    email,
    password,
    showPassword,
    isLoading,
    setEmail,
    setPassword,
    togglePassword,
    onSubmit,
  } = useLogin();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans">

      <LoginBackground />

      <Card className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl">

        <div className="h-2 w-full bg-linear-to-r from-[#CE1B22] via-slate-500 to-[#CE1B22]" />

        <LoginHeader />

        <CardContent className="px-8 pb-8">
          <form onSubmit={onSubmit} className="space-y-5">

            <EmailInput
              value={email}
              disabled={isLoading}
              onChange={setEmail}
            />

            <PasswordInput
              value={password}
              disabled={isLoading}
              showPassword={showPassword}
              togglePassword={togglePassword}
              onChange={setPassword}
            />

            <LoginButton loading={isLoading} />

          </form>
        </CardContent>

      </Card>

    </div>
  );
}