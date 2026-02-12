"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NavbarProps {
  /** Whether the user is currently logged in */
  isLoggedIn?: boolean;
  /** User display name (shown when logged in) */
  displayName?: string;
  /** User email (shown when logged in) */
  email?: string;
  /** Callback when logout is clicked */
  onLogout?: () => void;
}

export function Navbar({
  isLoggedIn = false,
  displayName,
  email,
  onLogout,
}: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Left: Logo */}
        <div className="flex shrink-0 items-center gap-2 text-foreground">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:text-foreground/80"
          >
            <BarChart3 className="size-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              Nadsaq Insight by
            </span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/matteoromano7/"
            className="text-lg font-bold italic tracking-tight underline-offset-4 transition-colors hover:underline"
          >
            Voidworks
          </Link>
        </div>

        {/* Center: Search (desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 items-center justify-center md:flex"
        >
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by company name or ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </form>

        {/* Right: User area (desktop) */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/watchlist">
                <Button variant="ghost" size="sm">
                  Watchlist
                </Button>
              </Link>
              {/* UserMenu will be composed here later */}
              <span className="text-sm text-muted-foreground">
                {displayName || email}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-lg transition-all duration-200 md:hidden",
          mobileMenuOpen ? "max-h-64 py-4" : "max-h-0 py-0"
        )}
      >
        <div className="mx-auto max-w-7xl space-y-3 px-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by company name or ticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/watchlist"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    Watchlist
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
