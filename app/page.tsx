import { Suspense } from "react"
import { SecretInput } from "@/components/secret-input"
import { SecretTabs } from "@/components/secret-tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="w-full px-4 py-8 space-y-8">
      <section className="text-center w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Share your darkest secrets anonymously</h1>
        <p className="text-xl text-muted-foreground">
          A safe space to vent without judgment. We don&apos;t store your personal information.
        </p>
      </section>

      <section className="w-full">
        <SecretInput />
      </section>

      <section className="w-full">
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <SecretTabs />
        </Suspense>
      </section>
    </div>
  )
}

