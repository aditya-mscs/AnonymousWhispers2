"use client"

import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecretList } from "@/components/secret-list"
import { fetchSecrets } from "@/lib/api/secrets"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function SecretTabs() {
  const [activeTab, setActiveTab] = useState("recent")

  const recentQuery = useInfiniteQuery({
    queryKey: ["secrets", "recent"],
    queryFn: ({ pageParam }) =>
      fetchSecrets({
        sort: "recent",
        cursor: pageParam,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: activeTab === "recent",
  })

  const darkQuery = useInfiniteQuery({
    queryKey: ["secrets", "dark"],
    queryFn: ({ pageParam }) =>
      fetchSecrets({
        sort: "darkness",
        cursor: pageParam,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: activeTab === "dark",
  })

  const trendingQuery = useInfiniteQuery({
    queryKey: ["secrets", "trending"],
    queryFn: ({ pageParam }) =>
      fetchSecrets({
        sort: "trending",
        cursor: pageParam,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: activeTab === "trending",
  })

  const getActiveQuery = () => {
    switch (activeTab) {
      case "recent":
        return recentQuery
      case "dark":
        return darkQuery
      case "trending":
        return trendingQuery
      default:
        return recentQuery
    }
  }

  const activeQuery = getActiveQuery()

  const handleLoadMore = () => {
    activeQuery.fetchNextPage()
  }

  const renderEmptyState = () => (
    <div className="text-center py-12 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">No secrets found</h3>
      <p className="text-muted-foreground mb-6">Be the first to share your secret!</p>
      <Button onClick={() => document.getElementById("secret-input")?.focus()}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Share a Secret
      </Button>
    </div>
  )

  const renderContent = (query: typeof recentQuery) => {
    if (query.isLoading) {
      return <SecretListSkeleton />
    }

    if (query.error) {
      return <div className="text-center py-8 text-muted-foreground">Failed to load secrets. Please try again.</div>
    }

    if (!query.data || query.data.pages.length === 0 || query.data.pages[0].secrets.length === 0) {
      return renderEmptyState()
    }

    return (
      <>
        <SecretList secrets={query.data.pages.flatMap((page) => page.secrets)} />
        {query.hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleLoadMore} disabled={query.isFetchingNextPage}>
              {query.isFetchingNextPage ? "Loading more..." : "Load more secrets"}
            </Button>
          </div>
        )}
      </>
    )
  }

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

      <TabsContent value="recent">{renderContent(recentQuery)}</TabsContent>

      <TabsContent value="dark">{renderContent(darkQuery)}</TabsContent>

      <TabsContent value="trending">{renderContent(trendingQuery)}</TabsContent>
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

