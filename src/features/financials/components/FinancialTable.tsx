"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinancialTableProps {
  /** Array of row objects. Each object should have a "metric" key and year keys with numeric values. */
  data: Array<Record<string, unknown>>;
  /** Table / section title */
  title: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats a numeric value into a human-readable financial string.
 * Values in billions, millions, or thousands are abbreviated accordingly.
 */
function formatFinancialValue(value: unknown): string {
  if (value == null || value === "") return "--";
  const num = Number(value);
  if (isNaN(num)) return String(value);

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1e9) return `${sign}$${(absNum / 1e9).toFixed(2)}B`;
  if (absNum >= 1e6) return `${sign}$${(absNum / 1e6).toFixed(2)}M`;
  if (absNum >= 1e3) return `${sign}$${(absNum / 1e3).toFixed(2)}K`;
  return `${sign}$${absNum.toFixed(2)}`;
}

export function FinancialTable({
  data,
  title,
  className,
}: FinancialTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No financial data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract year columns (all keys except "metric")
  const firstRow = data[0];
  const yearColumns = Object.keys(firstRow).filter(
    (key) => key !== "metric"
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:px-6 sm:pb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[180px] bg-card">
                  Metric
                </TableHead>
                {yearColumns.map((year) => (
                  <TableHead key={year} className="text-right min-w-[120px]">
                    {year}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="sticky left-0 z-10 bg-card font-medium">
                    {String(row.metric ?? "")}
                  </TableCell>
                  {yearColumns.map((year) => (
                    <TableCell key={year} className="text-right tabular-nums">
                      {formatFinancialValue(row[year])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
