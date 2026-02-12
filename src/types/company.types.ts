// =============================================================================
// Normalized Company Types
// Used throughout the application after API data normalization
// =============================================================================

/**
 * Normalized company profile derived from FMPCompanyProfile.
 * This is the canonical representation used across the app.
 */
export interface Company {
  symbol: string;
  companyName: string;
  price: number;
  changes: number;
  currency: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  sector: string;
  country: string;
  marketCap: number;
  description: string;
  ceo: string;
  website: string;
  image: string;
  ipoDate: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beta: number;
  volumeAvg: number;
  lastDividend: number;
  range: string;
  dcf: number;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

/**
 * Real-time price and quote data for a company.
 * Derived from FMPQuote.
 */
export interface CompanyQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  priceAvg50: number;
  priceAvg200: number;
  sharesOutstanding: number;
  earningsAnnouncement: string | null;
  timestamp: number;
}

/**
 * A single search result item from the FMP search endpoint.
 */
export interface SearchResult {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  exchangeShortName: string;
}

/**
 * Collection type for paginated or batched company data.
 */
export interface CompanySearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
}
