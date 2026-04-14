"use client"
import { LoginForm } from '@/src/component/login/login'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';




const page = () => {
   const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, router]);
  return (
    <LoginForm/>
  )
}

export default page