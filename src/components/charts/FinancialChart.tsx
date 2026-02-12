"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FinancialDataPoint {
  period: string;
  [key: string]: number | string;
}

interface SeriesConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface FinancialChartProps {
  data: FinancialDataPoint[];
  series: SeriesConfig[];
  title?: string;
  isLoading?: boolean;
}

const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatFullCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="text-foreground font-medium">
              {formatFullCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg animate-pulse">
    <div className="text-muted-foreground">Loading financial data...</div>
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
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <p className="mt-2 text-sm text-muted-foreground">No financial data available</p>
    </div>
  </div>
);

const FinancialChart: React.FC<FinancialChartProps> = React.memo(
  ({ data, series, title, isLoading = false }) => {
    const chartData = useMemo(() => data, [data]);
    const chartSeries = useMemo(() => series, [series]);

    if (isLoading) {
      return (
        <div className="w-full space-y-4">
          {title && (
            <div className="h-6 w-48 bg-muted/20 rounded animate-pulse" />
          )}
          <div className="w-full h-[400px]">
            <LoadingSkeleton />
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="w-full space-y-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          <div className="w-full h-[400px]">
            <EmptyState />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {title && (
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {chartSeries.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.series === nextProps.series &&
      prevProps.title === nextProps.title &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

FinancialChart.displayName = "FinancialChart";

export default FinancialChart;
