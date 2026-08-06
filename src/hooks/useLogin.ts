  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const response = await login(email, password);

  //     if (response.error) {
  //       setError(response.error);
  //     } else if (response.data?.token) {
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
  //       router.push('/dashboard');
  //     }
  //   } catch (err) {
  //     setError('Login failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  "use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoginActivity } from "@/src/hooks/useLogs";

export function useLogin() {
  const router = useRouter();
  const loginMutation = useLoginActivity();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoading(true);

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        if (result?.ok) {
          try {
            await loginMutation.mutateAsync();
          } catch (err) {
            console.error(err);
          }

          toast.success("Logged in successfully!");

          router.replace("/dashboard");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, loginMutation, router]
  );

  return {
    email,
    password,
    showPassword,
    isLoading,
    setEmail,
    setPassword,
    togglePassword,
    onSubmit,
  };
}