"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";

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

interface VolumeChartProps {
  data: HistoricalPrice[];
  isLoading?: boolean;
}

const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  }
  return volume.toFixed(0);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as HistoricalPrice;

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">
        {format(parseISO(data.date), "MMM dd, yyyy")}
      </p>
      <p className="text-muted-foreground">
        Volume: <span className="text-foreground font-medium">{formatVolume(data.volume)}</span>
      </p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg animate-pulse">
    <div className="text-muted-foreground text-sm">Loading volume data...</div>
  </div>
);

const EmptyState = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
    <p className="text-sm text-muted-foreground">No volume data available</p>
  </div>
);

const VolumeChart: React.FC<VolumeChartProps> = React.memo(
  ({ data, isLoading = false }) => {
    const chartData = useMemo(() => {
      return data.map((item) => ({
        ...item,
        color: item.change >= 0 ? "#22c55e" : "#ef4444",
      }));
    }, [data]);

    if (isLoading) {
      return (
        <div className="w-full h-[150px]">
          <LoadingSkeleton />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="w-full h-[150px]">
          <EmptyState />
        </div>
      );
    }

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                try {
                  return format(parseISO(date), "MMM dd");
                } catch {
                  return date;
                }
              }}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 11 }}
            />
            <YAxis
              tickFormatter={formatVolume}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

VolumeChart.displayName = "VolumeChart";

export default VolumeChart;
