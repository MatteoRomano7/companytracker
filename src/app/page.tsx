import { SearchBar } from "@/features/search/components/SearchBar";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Hero section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            NASDAQ Insights
          </h1>
          <p className="mb-12 text-xl text-muted-foreground">
            Real-time financial analytics and comprehensive data for NASDAQ-listed companies
          </p>

          {/* Large search bar */}
          <div className="mx-auto max-w-2xl">
            <SearchBar size="large" />
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-lg border border-border/40 bg-card p-6">
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="mb-2 font-semibold text-card-foreground">
                Financial Data
              </h3>
              <p className="text-sm text-muted-foreground">
                Access comprehensive financial statements and key metrics
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-6">
              <div className="mb-3 text-3xl">📈</div>
              <h3 className="mb-2 font-semibold text-card-foreground">
                Interactive Charts
              </h3>
              <p className="text-sm text-muted-foreground">
                Visualize price movements and trading volumes
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-6">
              <div className="mb-3 text-3xl">⭐</div>
              <h3 className="mb-2 font-semibold text-card-foreground">
                Watchlist
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your favorite companies with personalized notes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
