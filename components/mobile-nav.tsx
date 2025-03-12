"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">Anonymous Dark Secrets</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 mt-8">
          <Link href="/" className="px-7 py-2 text-lg font-medium" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="px-7 py-2 text-lg font-medium" onClick={() => setOpen(false)}>
            About
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

