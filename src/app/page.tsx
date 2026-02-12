import { SearchBar } from "@/features/search/components/SearchBar";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Hero section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            NASDAQ Insights
          </h1>
          <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
            Real-time financial analytics and comprehensive data for NASDAQ-listed companies
          </p>

          {/* Large search bar */}
          <div className="mx-auto max-w-2xl">
            <SearchBar size="large" />
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Financial Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access comprehensive financial statements and key metrics
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-3 text-3xl">📈</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Interactive Charts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Visualize price movements and trading volumes
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-3 text-3xl">⭐</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Watchlist
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track your favorite companies with personalized notes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
