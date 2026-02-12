"use client";

import { SearchIcon } from "lucide-react";
import { CompanyCard } from "./CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SearchResultItem {
  symbol: string;
  name: string;
  sector?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

interface SearchResultsProps {
  /** Array of company result objects */
  results: SearchResultItem[];
  /** Whether results are currently loading */
  isLoading: boolean;
  /** Additional CSS classes for the grid container */
  className?: string;
}

function ResultSkeleton() {
  return (
    <Card className="flex flex-col gap-6 py-6">
      <div className="px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="px-6">
        <div className="flex items-end justify-between gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </Card>
  );
}

export function SearchResults({
  results,
  isLoading,
  className,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <SearchIcon className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No results found</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We could not find any companies matching your search. Try a different
          name or ticker symbol.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {results.map((result) => (
        <CompanyCard key={result.symbol} {...result} />
      ))}
    </div>
  );
}
