// =============================================================================
// Watchlist Types
// Stored in the Supabase `watchlist_items` table
// =============================================================================

/**
 * A single watchlist item representing a tracked stock.
 */
export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  companyName: string;
  notes: string | null;
  addedAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new watchlist item.
 */
export interface CreateWatchlistItemDTO {
  symbol: string;
  companyName: string;
  notes?: string;
}

/**
 * Payload for updating an existing watchlist item.
 */
export interface UpdateWatchlistItemDTO {
  notes?: string;
}

/**
 * Watchlist state managed by Zustand.
 */
export interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Watchlist store actions exposed by the Zustand watchlist slice.
 */
export interface WatchlistActions {
  fetchWatchlist: () => Promise<void>;
  addItem: (item: CreateWatchlistItemDTO) => Promise<void>;
  updateItem: (id: string, updates: UpdateWatchlistItemDTO) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isSymbolInWatchlist: (symbol: string) => boolean;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Combined watchlist store type (state + actions).
 */
export type WatchlistStore = WatchlistState & WatchlistActions;
