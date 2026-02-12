// =============================================================================
// Store Barrel File — Re-exports all Zustand stores and selectors
// Usage: import { useAuthStore, useWatchlistStore } from '@/store';
// =============================================================================

// Auth Store
export { useAuthStore } from './authStore';
export {
  selectIsAuthenticated,
  selectDisplayName,
  selectUserEmail,
} from './authStore';

// Search Store
export { useSearchStore } from './searchStore';
export { selectHasResults, selectResultCount } from './searchStore';

// Watchlist Store
export { useWatchlistStore } from './watchlistStore';
export {
  selectIsSymbolInWatchlist,
  selectWatchlistCount,
  selectIsWatchlistEmpty,
} from './watchlistStore';

// Company Store
export { useCompanyStore } from './companyStore';
export {
  selectHasCompanyData,
  selectCompanySymbol,
  selectCompanyName,
  selectHasFinancialData,
  selectHasHistoricalData,
  selectLatestIncomeStatement,
  selectLatestBalanceSheet,
  selectLatestCashFlow,
} from './companyStore';
