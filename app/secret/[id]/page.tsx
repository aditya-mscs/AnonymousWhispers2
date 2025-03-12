import { Suspense } from "react"
import { SecretDetailPage } from "@/components/secret-detail-page"
import { Skeleton } from "@/components/ui/skeleton"

interface SecretPageProps {
  params: {
    id: string
  }
}

export default function SecretPage({ params }: SecretPageProps) {
  return (
    <div className="w-full px-4 py-8">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <SecretDetailPage id={params.id} />
      </Suspense>
    </div>
  )
}

