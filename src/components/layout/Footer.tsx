import { BarChart3 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 className="size-4" />
          <span className="text-sm font-medium">NASDAQ Insights</span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} NASDAQ Insights. All rights reserved. Market data
          provided for informational purposes only.
        </p>
      </div>
    </footer>
  );
}
