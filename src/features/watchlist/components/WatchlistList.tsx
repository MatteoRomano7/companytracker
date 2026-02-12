"use client";

import { Star } from "lucide-react";
import { WatchlistItem } from "./WatchlistItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WatchlistItemData {
  id: string;
  symbol: string;
  companyName: string;
  notes?: string;
}

interface WatchlistListProps {
  /** Array of watchlist items */
  items: WatchlistItemData[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Callback when notes are updated */
  onNotesUpdate?: (id: string, notes: string) => void;
  /** Callback when an item is removed */
  onRemove?: (id: string) => void;
  /** Additional CSS classes */
  className?: string;
}

function WatchlistSkeleton() {
  return (
    <Card className="flex flex-col gap-6 py-6">
      <div className="px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="size-6 rounded-md" />
          </div>
        </div>
      </div>
      <div className="px-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
      </div>
    </Card>
  );
}

export function WatchlistList({
  items,
  isLoading,
  onNotesUpdate,
  onRemove,
  className,
}: WatchlistListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <WatchlistSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Star className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No companies saved yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Start searching for companies and add them to your watchlist to track
          them here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => (
        <WatchlistItem
          key={item.id}
          item={item}
          onNotesUpdate={onNotesUpdate}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
