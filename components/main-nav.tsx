import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Anonymous Dark Secrets</span>
      </Link>
      <nav className={cn("flex items-center space-x-6 text-sm font-medium", className)} {...props}>
        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
          Home
        </Link>
        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
          About
        </Link>
      </nav>
    </div>
  )
}

