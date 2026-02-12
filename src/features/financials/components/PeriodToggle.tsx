"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PeriodToggleProps {
  /** Currently selected period */
  period: "annual" | "quarterly";
  /** Callback when the period changes */
  onPeriodChange: (period: "annual" | "quarterly") => void;
  /** Additional CSS classes */
  className?: string;
}

export function PeriodToggle({
  period,
  onPeriodChange,
  className,
}: PeriodToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border bg-muted p-1",
        className
      )}
    >
      <Button
        variant={period === "annual" ? "default" : "ghost"}
        size="sm"
        onClick={() => onPeriodChange("annual")}
        className={cn(
          "rounded-md px-4 text-sm",
          period !== "annual" && "text-muted-foreground hover:text-foreground"
        )}
      >
        Annual
      </Button>
      <Button
        variant={period === "quarterly" ? "default" : "ghost"}
        size="sm"
        onClick={() => onPeriodChange("quarterly")}
        className={cn(
          "rounded-md px-4 text-sm",
          period !== "quarterly" &&
            "text-muted-foreground hover:text-foreground"
        )}
      >
        Quarterly
      </Button>
    </div>
  );
}
