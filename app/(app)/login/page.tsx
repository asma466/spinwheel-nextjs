'use client';
import { LoginForm } from '@/src/component/login/login';
// import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// export const metadata = {
//   title: 'Login | Dashboard',
//   description: 'Sign in to your dashboard account',
// };

export default async function LoginPage() {
  // const session = await auth();

  // if (session) {
  //   redirect('/dashboard');
  // }

  return <LoginForm />;
}
