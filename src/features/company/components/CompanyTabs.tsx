"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CompanyTabsProps {
  /** Default active tab value */
  defaultTab?: string;
  /** Content for the Overview tab */
  overviewContent?: React.ReactNode;
  /** Content for the Charts tab */
  chartsContent?: React.ReactNode;
  /** Content for the Financials tab */
  financialsContent?: React.ReactNode;
  /** Content for the Metrics tab */
  metricsContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function CompanyTabs({
  defaultTab = "overview",
  overviewContent,
  chartsContent,
  financialsContent,
  metricsContent,
  className,
}: CompanyTabsProps) {
  return (
    <Tabs
      defaultValue={defaultTab}
      className={cn("w-full", className)}
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        {overviewContent ?? (
          <p className="text-muted-foreground">No overview data available.</p>
        )}
      </TabsContent>

      <TabsContent value="charts" className="mt-6">
        {chartsContent ?? (
          <p className="text-muted-foreground">No chart data available.</p>
        )}
      </TabsContent>

      <TabsContent value="financials" className="mt-6">
        {financialsContent ?? (
          <p className="text-muted-foreground">
            No financial data available.
          </p>
        )}
      </TabsContent>

      <TabsContent value="metrics" className="mt-6">
        {metricsContent ?? (
          <p className="text-muted-foreground">No metrics data available.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
