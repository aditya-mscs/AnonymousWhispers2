"use client"

import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecretList } from "@/components/secret-list"
import { fetchSecrets } from "@/lib/api/secrets"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

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
          <>
            <SecretList secrets={recentQuery.data.pages.flatMap((page) => page.secrets)} />
            {recentQuery.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} disabled={recentQuery.isFetchingNextPage}>
                  {recentQuery.isFetchingNextPage ? "Loading more..." : "Load more secrets"}
                </Button>
              </div>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="dark">
        {darkQuery.isLoading ? (
          <SecretListSkeleton />
        ) : darkQuery.error ? (
          <div className="text-center py-8 text-muted-foreground">Failed to load secrets. Please try again.</div>
        ) : (
          <>
            <SecretList secrets={darkQuery?.data?.pages?.flatMap((page) => page.secrets)} />
            {darkQuery.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} disabled={darkQuery.isFetchingNextPage}>
                  {darkQuery.isFetchingNextPage ? "Loading more..." : "Load more secrets"}
                </Button>
              </div>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="trending">
        {trendingQuery.isLoading ? (
          <SecretListSkeleton />
        ) : trendingQuery.error ? (
          <div className="text-center py-8 text-muted-foreground">Failed to load secrets. Please try again.</div>
        ) : (
          <>
            <SecretList secrets={trendingQuery?.data?.pages?.flatMap((page) => page.secrets)} />
            {trendingQuery.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} disabled={trendingQuery.isFetchingNextPage}>
                  {trendingQuery.isFetchingNextPage ? "Loading more..." : "Load more secrets"}
                </Button>
              </div>
            )}
          </>
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

