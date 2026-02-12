// =============================================================================
// API Services Barrel File — Central export point for all FMP services
// Usage: import { searchCompanies, getHistoricalPrices } from '@/services/api';
// =============================================================================

// Re-export all service functions
export {
  searchCompanies,
  getCompanyProfile,
  getCompanyQuote,
} from './companyService';

export {
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
} from './financialService';

export {
  getHistoricalPrices,
} from './chartService';

export {
  getKeyMetrics,
  getFinancialRatios,
} from './metricsService';

// Re-export custom error types for consumers
export {
  FMPError,
  ApiSchemaError,
  NetworkError,
  RateLimitedError,
} from './fmpClient';
