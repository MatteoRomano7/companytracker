"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  /** Controls the height and text size of the search bar */
  size?: "default" | "large";
  /** Additional CSS classes */
  className?: string;
  /** Optional initial query value */
  defaultValue?: string;
}

export function SearchBar({
  size = "default",
  className,
  defaultValue = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <div className="relative">
        <Search
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
            size === "large" ? "size-5 left-4" : "size-4"
          )}
        />
        <Input
          type="text"
          placeholder="Search by company name or ticker..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            size === "large"
              ? "h-14 pl-12 pr-28 text-lg rounded-xl shadow-lg border-2 focus-visible:border-primary"
              : "h-9 pl-9 pr-20"
          )}
        />
        <Button
          type="submit"
          size={size === "large" ? "lg" : "default"}
          className={cn(
            "absolute right-1.5 top-1/2 -translate-y-1/2",
            size === "large" ? "right-2 rounded-lg" : ""
          )}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
