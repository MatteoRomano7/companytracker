"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  /** The ticker symbol */
  symbol: string;
  /** Whether this stock is currently in the watchlist */
  isInWatchlist?: boolean;
  /** Callback when toggled */
  onToggle?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function WatchlistButton({
  symbol,
  isInWatchlist = false,
  onToggle,
  className,
}: WatchlistButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isInWatchlist ? "default" : "outline"}
            size="sm"
            className={cn("gap-1.5", className)}
            onClick={onToggle}
            aria-label={
              isInWatchlist
                ? `Remove ${symbol} from watchlist`
                : `Add ${symbol} to watchlist`
            }
          >
            <Star
              className={cn(
                "size-4",
                isInWatchlist && "fill-current"
              )}
            />
            {isInWatchlist ? "Saved" : "Watch"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isInWatchlist
            ? `Remove ${symbol} from your watchlist`
            : `Add ${symbol} to your watchlist`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
