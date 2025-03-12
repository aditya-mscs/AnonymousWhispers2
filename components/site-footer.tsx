import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0 w-full">
      <div className="w-full px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Anonymous Dark Secrets. All rights reserved. We do not store your personal
          information.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-medium underline underline-offset-4">
            About
          </Link>
          <Link href="/privacy" className="text-sm font-medium underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm font-medium underline underline-offset-4">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}

