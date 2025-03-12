"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecretList } from "@/components/secret-list"
import { fetchSecrets } from "@/lib/api/secrets"
import { Skeleton } from "@/components/ui/skeleton"

export function SecretTabs() {
  const [activeTab, setActiveTab] = useState("recent")

  const recentQuery = useQuery({
    queryKey: ["secrets", "recent"],
    queryFn: () => fetchSecrets({ sort: "recent" }),
    enabled: activeTab === "recent",
  })

  const darkQuery = useQuery({
    queryKey: ["secrets", "dark"],
    queryFn: () => fetchSecrets({ sort: "darkness" }),
    enabled: activeTab === "dark",
  })

  const trendingQuery = useQuery({
    queryKey: ["secrets", "trending"],
    queryFn: () => fetchSecrets({ sort: "trending" }),
    enabled: activeTab === "trending",
  })

  return (
    <Tabs defaultValue="recent" onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">People's Secrets</h2>
        <TabsList>
          <TabsTrigger value="recent">Most Recent</TabsTrigger>
          <TabsTrigger value="dark">Most Dark</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="recent">
        {recentQuery.isLoading ? (
          <SecretListSkeleton />
        ) : recentQuery.error ? (
          <div className="text-center py-8 text-muted-foreground">Failed to load secrets. Please try again.</div>
        ) : (
          <SecretList secrets={recentQuery.data || []} />
        )}
      </TabsContent>

      <TabsContent value="dark">
        {darkQuery.isLoading ? (
          <SecretListSkeleton />
        ) : darkQuery.error ? (
          <div className="text-center py-8 text-muted-foreground">Failed to load secrets. Please try again.</div>
        ) : (
          <SecretList secrets={darkQuery.data || []} />
        )}
      </TabsContent>

      <TabsContent value="trending">
        {trendingQuery.isLoading ? (
          <SecretListSkeleton />
        ) : trendingQuery.error ? (
          <div className="text-center py-8 text-muted-foreground">Failed to load secrets. Please try again.</div>
        ) : (
          <SecretList secrets={trendingQuery.data || []} />
        )}
      </TabsContent>
    </Tabs>
  )
}

function SecretListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  )
}

