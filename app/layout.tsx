import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseAuthProvider } from "@/components/firebase-auth-provider"
import { CartProvider } from "@/contexts/cart-context"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PetHelp",
  description: "Sistema de gestión para servicios de mascotas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/pethelp_logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/pethelp_logo.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/pethelp_logo.png" sizes="180x180" />
        <link rel="shortcut icon" href="/pethelp_logo.png" type="image/png" />
      </Head>
      <body className={inter.className}>
        <FirebaseAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <CartProvider>
              {children}
            </CartProvider>
          </ThemeProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}
