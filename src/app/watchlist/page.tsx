"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { WatchlistList } from "@/features/watchlist/components/WatchlistList";
import { useWatchlistStore } from "@/store";

export default function WatchlistPage() {
  const items = useWatchlistStore((state) => state.items);
  const fetchWatchlist = useWatchlistStore((state) => state.fetchWatchlist);
  const updateNotes = useWatchlistStore((state) => state.updateNotes);
  const removeItem = useWatchlistStore((state) => state.removeItem);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      await fetchWatchlist();
      setIsLoading(false);
    };

    loadWatchlist();
  }, [fetchWatchlist]);

  const handleNotesUpdate = async (id: string, notes: string) => {
    await updateNotes(id, notes);
  };

  const handleRemove = async (id: string) => {
    await removeItem(id);
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          My Watchlist
        </h1>
        <p className="text-muted-foreground">
          Track and manage your favorite companies
        </p>
      </div>

      {!isLoading && items.length === 0 ? (
        <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
          <p className="mb-4 text-muted-foreground">
            Your watchlist is empty
          </p>
          <p className="text-sm text-muted-foreground/70">
            Search for companies and add them to your watchlist to get started
          </p>
        </div>
      ) : (
        <WatchlistList
          items={items.map((item) => ({
            id: item.id,
            symbol: item.symbol,
            companyName: item.company_name,
            notes: item.notes ?? undefined,
          }))}
          isLoading={isLoading}
          onNotesUpdate={handleNotesUpdate}
          onRemove={handleRemove}
        />
      )}
    </PageContainer>
  );
}
