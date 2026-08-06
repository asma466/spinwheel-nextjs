"use client"

import { LoginForm } from '@/src/component/login';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';




const page = () => {
   const { data: session , status} = useSession();
  const router = useRouter();

  useEffect(() => {
    // if (session?.user?.role === 'ADMIN') {
    //   router.replace("/dashboard");
    // } 
       if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.replace("/dashboard");
    }
  }, [session, router, status]);
  return (
    <LoginForm/>
  )
}

export default page