import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Anonymous Dark Secrets",
  description: "Share your darkest secrets anonymously in a safe space without judgment",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 w-full">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
            <Analytics />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

