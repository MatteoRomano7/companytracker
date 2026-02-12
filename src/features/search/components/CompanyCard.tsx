"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  /** Ticker symbol, e.g. "AAPL" */
  symbol: string;
  /** Full company name */
  name: string;
  /** Business sector */
  sector?: string;
  /** Current share price */
  price?: number;
  /** Absolute price change */
  change?: number;
  /** Percentage price change */
  changePercent?: number;
}

export function CompanyCard({
  symbol,
  name,
  sector,
  price,
  change,
  changePercent,
}: CompanyCardProps) {
  const isPositive = (change ?? 0) >= 0;

  function formatPrice(value: number | undefined) {
    if (value == null) return "--";
    return `$${value.toFixed(2)}`;
  }

  function formatPercent(value: number | undefined) {
    if (value == null) return "--";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  function formatChange(value: number | undefined) {
    if (value == null) return "--";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}`;
  }

  return (
    <Link href={`/company/${encodeURIComponent(symbol)}`} className="block">
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/20">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-xl font-bold tracking-wide">
                {symbol}
              </CardTitle>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {name}
              </p>
            </div>
            {sector && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {sector}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2">
            <span className="text-2xl font-semibold tabular-nums">
              {formatPrice(price)}
            </span>
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium tabular-nums",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              <span>{formatChange(change)}</span>
              <span className="text-xs">({formatPercent(changePercent)})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
