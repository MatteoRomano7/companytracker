import { create } from 'zustand';

interface SearchResult {
  symbol: string;
  name: string;
  currency: string;
  exchangeShortName: string;
  [key: string]: unknown;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
}

interface SearchActions {
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
}

type SearchStoreType = SearchState & SearchActions;

const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
  error: null,
};

export const useSearchStore = create<SearchStoreType>((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  setResults: (results) => set({ results }),

  setIsSearching: (isSearching) => set({ isSearching }),

  setLoading: (isLoading) => set({ isSearching: isLoading }),

  setError: (error) => set({ error }),

  clearSearch: () => set(initialState),
}));

export const selectHasResults = (state: SearchState): boolean =>
  state.results.length > 0;

export const selectResultCount = (state: SearchState): number =>
  state.results.length;
