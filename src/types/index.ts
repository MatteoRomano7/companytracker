// =============================================================================
// Barrel file — re-exports all types from a single entry point
// Usage: import { Company, IncomeStatement, ChartPeriod } from '@/types';
// =============================================================================

// FMP API raw response types
export type {
  FMPSearchResult,
  FMPSearchResponse,
  FMPCompanyProfile,
  FMPCompanyProfileResponse,
  FMPQuote,
  FMPQuoteResponse,
  FMPHistoricalDailyPrice,
  FMPHistoricalPriceFullResponse,
  FMPHistoricalEodRecord,
  FMPHistoricalEodResponse,
  FMPIncomeStatement,
  FMPIncomeStatementResponse,
  FMPBalanceSheet,
  FMPBalanceSheetResponse,
  FMPCashFlowStatement,
  FMPCashFlowStatementResponse,
  FMPKeyMetrics,
  FMPKeyMetricsResponse,
  FMPFinancialRatios,
  FMPFinancialRatiosResponse,
  FMPApiError,
} from './api.types';

// Normalized company types
export type {
  Company,
  CompanyQuote,
  SearchResult,
  CompanySearchResponse,
} from './company.types';

// Financial statement types
export type {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  KeyMetrics,
  FinancialRatios,
  CompanyFinancials,
} from './financial.types';
export type { FinancialPeriod } from './financial.types';

// Chart & historical price types
export type {
  HistoricalPrice,
  ChartDataPoint,
  OHLCDataPoint,
  VolumeDataPoint,
  ChartSeriesConfig,
  StockChartProps,
  FinancialChartProps,
  ChartPeriodDaysMap,
} from './chart.types';
export type { ChartPeriod } from './chart.types';

// Auth & user types
export type {
  UserProfile,
  AuthState,
  AuthActions,
  AuthStore,
} from './auth.types';

// Watchlist types
export type {
  WatchlistItem,
  CreateWatchlistItemDTO,
  UpdateWatchlistItemDTO,
  WatchlistState,
  WatchlistActions,
  WatchlistStore,
} from './watchlist.types';
