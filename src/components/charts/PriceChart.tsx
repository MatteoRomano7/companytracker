"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Local type definitions
interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  change: number;
  changePercent: number;
}

type ChartPeriod = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y" | "MAX";

interface PriceChartProps {
  data: HistoricalPrice[];
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  isLoading?: boolean;
}

const PERIODS: ChartPeriod[] = ["1D", "1W", "1M", "3M", "1Y", "5Y", "MAX"];

const formatXAxis = (date: string, period: ChartPeriod): string => {
  try {
    const parsedDate = parseISO(date);
    switch (period) {
      case "1D":
        return format(parsedDate, "HH:mm");
      case "1W":
      case "1M":
        return format(parsedDate, "MMM dd");
      case "3M":
      case "1Y":
        return format(parsedDate, "MMM dd");
      case "5Y":
      case "MAX":
        return format(parsedDate, "MMM yyyy");
      default:
        return format(parsedDate, "MMM dd");
    }
  } catch {
    return date;
  }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toFixed(0);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as HistoricalPrice;

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground mb-2">
        {format(parseISO(data.date), "MMM dd, yyyy HH:mm")}
      </p>
      <div className="space-y-1 text-muted-foreground">
        <p>Open: <span className="text-foreground font-medium">{formatCurrency(data.open)}</span></p>
        <p>High: <span className="text-foreground font-medium">{formatCurrency(data.high)}</span></p>
        <p>Low: <span className="text-foreground font-medium">{formatCurrency(data.low)}</span></p>
        <p>Close: <span className="text-foreground font-medium">{formatCurrency(data.close)}</span></p>
        <p>Volume: <span className="text-foreground font-medium">{formatVolume(data.volume)}</span></p>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg animate-pulse">
    <div className="text-muted-foreground">Loading chart data...</div>
  </div>
);

const EmptyState = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-muted-foreground/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="mt-2 text-sm text-muted-foreground">No price data available</p>
    </div>
  </div>
);

const PriceChart: React.FC<PriceChartProps> = React.memo(
  ({ data, period, onPeriodChange, isLoading = false }) => {
    const isPriceUp = useMemo(() => {
      if (data.length < 2) return true;
      return data[data.length - 1].close >= data[0].close;
    }, [data]);

    const gradientColor = isPriceUp ? "#22c55e" : "#ef4444";
    const strokeColor = isPriceUp ? "#22c55e" : "#ef4444";

    const chartData = useMemo(() => data, [data]);

    if (isLoading) {
      return (
        <div className="w-full space-y-4">
          <div className="flex justify-end gap-2">
            {PERIODS.map((p) => (
              <div
                key={p}
                className="h-8 w-12 bg-muted/20 rounded animate-pulse"
              />
            ))}
          </div>
          <div className="w-full h-[400px]">
            <LoadingSkeleton />
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="w-full space-y-4">
          <div className="flex justify-end gap-2">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="w-full h-[400px]">
            <EmptyState />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        <div className="flex justify-end gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => formatXAxis(date, period)}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.period === nextProps.period &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

PriceChart.displayName = "PriceChart";

export default PriceChart;
