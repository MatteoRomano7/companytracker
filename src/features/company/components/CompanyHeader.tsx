"use client";

import * as React from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WatchlistButton } from "./WatchlistButton";

interface CompanyHeaderProps {
  /** Ticker symbol */
  symbol: string;
  /** Full company name */
  companyName: string;
  /** URL of the company logo */
  image?: string;
  /** Sector the company belongs to */
  sector?: string;
  /** Stock exchange name */
  exchange?: string;
  /** Current share price */
  price?: number;
  /** Absolute price change */
  change?: number;
  /** Percentage price change */
  changePercent?: number;
  /** Market capitalization */
  marketCap?: number;
  /** 52-week low price */
  yearLow?: number;
  /** 52-week high price */
  yearHigh?: number;
  /** Whether the stock is in the user's watchlist */
  isInWatchlist?: boolean;
  /** Callback when the watchlist button is toggled */
  onWatchlistToggle?: () => void;
}

function formatMarketCap(value: number | undefined): string {
  if (value == null) return "--";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function formatPrice(value: number | undefined): string {
  if (value == null) return "--";
  return `$${value.toFixed(2)}`;
}

export function CompanyHeader({
  symbol,
  companyName,
  image,
  sector,
  exchange,
  price,
  change,
  changePercent,
  marketCap,
  yearLow,
  yearHigh,
  isInWatchlist = false,
  onWatchlistToggle,
}: CompanyHeaderProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Top row: logo, name, badges, watchlist */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          {image && (
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5 shadow-sm dark:bg-muted">
              <Image
                src={image}
                alt={`${companyName} logo`}
                width={48}
                height={48}
                className="size-full object-contain"
                unoptimized
              />
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {companyName}
              </h1>
              <Badge variant="outline" className="text-xs font-mono">
                {symbol}
              </Badge>
              {sector && (
                <Badge variant="secondary" className="text-xs">
                  {sector}
                </Badge>
              )}
            </div>
            {exchange && (
              <p className="mt-1 text-sm text-muted-foreground">{exchange}</p>
            )}
          </div>
        </div>

        <WatchlistButton
          symbol={symbol}
          isInWatchlist={isInWatchlist}
          onToggle={onWatchlistToggle}
        />
      </div>

      {/* Price section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Price</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold tabular-nums">
              {formatPrice(price)}
            </span>
            <div
              className={cn(
                "flex items-center gap-1 text-base font-medium tabular-nums",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="size-5" />
              ) : (
                <TrendingDown className="size-5" />
              )}
              <span>
                {change != null
                  ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}`
                  : "--"}
              </span>
              <span className="text-sm">
                (
                {changePercent != null
                  ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`
                  : "--"}
                )
              </span>
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-semibold">{formatMarketCap(marketCap)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">52-Week Range</p>
            <p className="text-sm font-semibold tabular-nums">
              {formatPrice(yearLow)} &ndash; {formatPrice(yearHigh)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
