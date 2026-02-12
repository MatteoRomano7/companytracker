// =============================================================================
// Company Service — Search, profile, and quote operations
// Handles normalization from FMP raw types to application types
// =============================================================================

import {
  FMPSearchResponse,
  FMPCompanyProfileResponse,
  FMPQuoteResponse,
  Company,
  CompanyQuote,
  SearchResult,
} from '@/types';
import { fmpFetch, ApiSchemaError } from './fmpClient';

/**
 * Normalizes FMP search results to the application SearchResult type.
 *
 * @param fmpResults - Raw FMP search response array.
 * @returns Normalized search results.
 */
function normalizeSearchResults(fmpResults: FMPSearchResponse): SearchResult[] {
  return fmpResults.map((result) => ({
    symbol: result.symbol,
    name: result.name,
    currency: result.currency,
    exchange: result.stockExchange,
    exchangeShortName: result.exchangeShortName,
  }));
}

/**
 * Normalizes a single FMP company profile to the application Company type.
 *
 * @param fmpProfile - Raw FMP company profile.
 * @returns Normalized company profile.
 */
function normalizeCompanyProfile(
  fmpProfile: FMPCompanyProfileResponse[0]
): Company {
  return {
    symbol: fmpProfile.symbol,
    companyName: fmpProfile.companyName,
    price: fmpProfile.price,
    changes: fmpProfile.changes,
    currency: fmpProfile.currency,
    exchange: fmpProfile.exchange,
    exchangeShortName: fmpProfile.exchangeShortName,
    industry: fmpProfile.industry,
    sector: fmpProfile.sector,
    country: fmpProfile.country,
    marketCap: fmpProfile.mktCap,
    description: fmpProfile.description,
    ceo: fmpProfile.ceo,
    website: fmpProfile.website,
    image: fmpProfile.image,
    ipoDate: fmpProfile.ipoDate,
    fullTimeEmployees: fmpProfile.fullTimeEmployees,
    phone: fmpProfile.phone,
    address: fmpProfile.address,
    city: fmpProfile.city,
    state: fmpProfile.state,
    zip: fmpProfile.zip,
    beta: fmpProfile.beta,
    volumeAvg: fmpProfile.volAvg,
    lastDividend: fmpProfile.lastDiv,
    range: fmpProfile.range,
    dcf: fmpProfile.dcf,
    isEtf: fmpProfile.isEtf,
    isActivelyTrading: fmpProfile.isActivelyTrading,
    isAdr: fmpProfile.isAdr,
    isFund: fmpProfile.isFund,
  };
}

/**
 * Normalizes a single FMP quote to the application CompanyQuote type.
 *
 * @param fmpQuote - Raw FMP quote.
 * @returns Normalized company quote.
 */
function normalizeCompanyQuote(fmpQuote: FMPQuoteResponse[0]): CompanyQuote {
  return {
    symbol: fmpQuote.symbol,
    name: fmpQuote.name,
    price: fmpQuote.price,
    change: fmpQuote.change,
    changesPercentage: fmpQuote.changesPercentage,
    dayLow: fmpQuote.dayLow,
    dayHigh: fmpQuote.dayHigh,
    yearLow: fmpQuote.yearLow,
    yearHigh: fmpQuote.yearHigh,
    marketCap: fmpQuote.marketCap,
    volume: fmpQuote.volume,
    avgVolume: fmpQuote.avgVolume,
    open: fmpQuote.open,
    previousClose: fmpQuote.previousClose,
    eps: fmpQuote.eps,
    pe: fmpQuote.pe,
    priceAvg50: fmpQuote.priceAvg50,
    priceAvg200: fmpQuote.priceAvg200,
    sharesOutstanding: fmpQuote.sharesOutstanding,
    earningsAnnouncement: fmpQuote.earningsAnnouncement,
    timestamp: fmpQuote.timestamp,
  };
}

/**
 * Searches for companies by name or symbol.
 *
 * @param query - Search query string (e.g., "Apple" or "AAPL").
 * @param limit - Maximum number of results to return (default: 10).
 * @returns Promise resolving to an array of normalized search results.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const results = await searchCompanies('tesla', 5);
 * console.log(results[0].symbol); // "TSLA"
 * ```
 */
export async function searchCompanies(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const trimmedQuery = query.trim();
  const nameFirst = trimmedQuery.includes(' ');
  const primaryEndpoint = nameFirst ? '/stable/search-name' : '/stable/search-symbol';
  const fallbackEndpoint = nameFirst ? '/stable/search-symbol' : '/stable/search-name';

  const response = await fmpFetch<FMPSearchResponse>(primaryEndpoint, {
    query: trimmedQuery,
    limit: limit.toString(),
  });

  // Validate response is an array
  if (!Array.isArray(response)) {
    throw new ApiSchemaError(
      'Search response is not an array',
      response
    );
  }

  if (response.length > 0) {
    return normalizeSearchResults(response);
  }

  const fallbackResponse = await fmpFetch<FMPSearchResponse>(fallbackEndpoint, {
    query: trimmedQuery,
    limit: limit.toString(),
  });

  if (!Array.isArray(fallbackResponse)) {
    throw new ApiSchemaError(
      'Search response is not an array',
      fallbackResponse
    );
  }

  return normalizeSearchResults(fallbackResponse);
}

/**
 * Fetches detailed company profile information.
 *
 * @param symbol - Stock ticker symbol (e.g., "AAPL").
 * @returns Promise resolving to a normalized Company profile.
 *
 * @throws {ApiSchemaError} If the response structure is invalid or company not found.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const company = await getCompanyProfile('AAPL');
 * console.log(company.companyName); // "Apple Inc."
 * ```
 */
export async function getCompanyProfile(symbol: string): Promise<Company> {
  const response = await fmpFetch<FMPCompanyProfileResponse>(
    '/stable/profile',
    { symbol }
  );

  // Validate response is an array with at least one element
  if (!Array.isArray(response) || response.length === 0) {
    throw new ApiSchemaError(
      `Company profile not found for symbol: ${symbol}`,
      response
    );
  }

  return normalizeCompanyProfile(response[0]);
}

/**
 * Fetches real-time quote data for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "TSLA").
 * @returns Promise resolving to a normalized CompanyQuote.
 *
 * @throws {ApiSchemaError} If the response structure is invalid or quote not found.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const quote = await getCompanyQuote('TSLA');
 * console.log(quote.price); // 245.67
 * ```
 */
export async function getCompanyQuote(symbol: string): Promise<CompanyQuote> {
  const response = await fmpFetch<FMPQuoteResponse>(
    '/stable/quote',
    { symbol }
  );

  // Validate response is an array with at least one element
  if (!Array.isArray(response) || response.length === 0) {
    throw new ApiSchemaError(
      `Quote not found for symbol: ${symbol}`,
      response
    );
  }

  return normalizeCompanyQuote(response[0]);
}
