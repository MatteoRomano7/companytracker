"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchBar } from "@/features/search/components/SearchBar";
import { SearchResults } from "@/features/search/components/SearchResults";
import { useSearchStore } from "@/store";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = useSearchStore((state) => state.results);
  const setResults = useSearchStore((state) => state.setResults);
  const setLoading = useSearchStore((state) => state.setLoading);
  const setError = useSearchStore((state) => state.setError);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/fmp/search?q=${encodeURIComponent(query)}&limit=20`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setError(err instanceof Error ? err.message : "Failed to search");
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, setResults, setLoading, setError]);

  return (
    <PageContainer>
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {!query ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">
            Enter a company name or ticker symbol to search
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search Results
              {results.length > 0 && (
                <span className="ml-2 text-base font-normal text-gray-500">
                  ({results.length} {results.length === 1 ? "result" : "results"})
                </span>
              )}
            </h2>
          </div>

          <SearchResults results={results} isLoading={isLoading} />
        </>
      )}
    </PageContainer>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </PageContainer>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
