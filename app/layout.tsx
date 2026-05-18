
import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import ReactQueryProvider from "@/src/component/provider/QueryProvider";
// import { Toaster } from "sonner";
// import { SessionProvider } from "next-auth/react";
import ClientProviders from "@/src/component/provider/QueryProvider";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "wheelspin Dashboard",
    template: "%s | wheelspin Dashboard",
  },
  description: "Admin dashboard for managing wheelspin gifts and users",
  keywords: ["wheelspin", "dashboard", "admin", "gifts", "employees"],
  authors: [{ name: "Zetatech" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wheelspin.zetatech.com.pk",
    title: "wheelspin Dashboard",
    description: "Admin dashboard for managing wheelspin gifts and users",
    siteName: "wheelspin Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "wheelspin Dashboard",
    description: "Admin dashboard for managing wheelspin gifts and users",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// const queryClient = new QueryClient(); // ← Create an instance
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body
      
       suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans` }
      >
        {/* <SessionProvider>
        <ReactQueryProvider>
          {children}

          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
       </SessionProvider> */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
