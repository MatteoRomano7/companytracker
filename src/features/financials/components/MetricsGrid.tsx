"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricItem {
  /** Display label for the metric */
  label: string;
  /** Formatted value to show */
  value: string | number;
  /** Optional trend direction */
  trend?: "up" | "down";
}

interface MetricsGridProps {
  /** Array of metric items to display */
  metrics: MetricItem[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function MetricSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="mb-2 h-3 w-24" />
        <Skeleton className="h-7 w-20" />
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({
  metrics,
  isLoading = false,
  className,
}: MetricsGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No metrics available.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="transition-colors hover:border-primary/20"
        >
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-bold tabular-nums">
                {metric.value}
              </span>
              {metric.trend === "up" && (
                <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
              )}
              {metric.trend === "down" && (
                <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
