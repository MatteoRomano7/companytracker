// =============================================================================
// Chart Service — Historical price data operations
// Handles normalization from FMP historical data to application chart types
// =============================================================================

import {
  FMPHistoricalEodResponse,
  FMPHistoricalEodRecord,
  FMPHistoricalPriceFullResponse,
  HistoricalPrice,
  ChartPeriod,
} from '@/types';
import { fmpFetch, ApiSchemaError } from './fmpClient';

/**
 * Normalizes FMP historical price data to application HistoricalPrice type.
 *
 * @param fmpPrice - Raw FMP historical daily price.
 * @returns Normalized historical price.
 */
function normalizeHistoricalPrice(
  fmpPrice: FMPHistoricalPriceFullResponse['historical'][0]
): HistoricalPrice {
  return {
    date: fmpPrice.date,
    open: fmpPrice.open,
    high: fmpPrice.high,
    low: fmpPrice.low,
    close: fmpPrice.close,
    adjClose: fmpPrice.adjClose,
    volume: fmpPrice.volume,
    change: fmpPrice.change,
    changePercent: fmpPrice.changePercent,
    vwap: fmpPrice.vwap,
  };
}

/**
 * Normalizes stable EOD record to application HistoricalPrice type.
 *
 * @param fmpRecord - Raw FMP stable historical EOD record.
 * @returns Normalized historical price.
 */
function normalizeHistoricalEodRecord(
  fmpRecord: FMPHistoricalEodRecord
): HistoricalPrice {
  return {
    date: fmpRecord.date,
    open: fmpRecord.open,
    high: fmpRecord.high,
    low: fmpRecord.low,
    close: fmpRecord.close,
    adjClose: fmpRecord.close,
    volume: fmpRecord.volume,
    change: fmpRecord.change,
    changePercent: fmpRecord.changePercent,
    vwap: fmpRecord.vwap,
  };
}

/**
 * Calculates the date range for a given chart period.
 *
 * @param period - Chart period (e.g., '1M', '1Y').
 * @returns Object with 'from' and 'to' date strings in YYYY-MM-DD format, or null for 'MAX'.
 */
function calculateDateRange(
  period: ChartPeriod
): { from: string; to: string } | null {
  const today = new Date();
  const to = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // For 'MAX', we don't specify date range (FMP will return all available data)
  if (period === 'MAX') {
    return null;
  }

  let daysBack: number;
  switch (period) {
    case '1D':
      daysBack = 1;
      break;
    case '1W':
      daysBack = 7;
      break;
    case '1M':
      daysBack = 30;
      break;
    case '3M':
      daysBack = 90;
      break;
    case '1Y':
      daysBack = 365;
      break;
    case '5Y':
      daysBack = 365 * 5;
      break;
    default:
      // Exhaustive check: if TypeScript complains here, a new period was added
      const exhaustiveCheck: never = period;
      throw new Error(`Unknown chart period: ${exhaustiveCheck}`);
  }

  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - daysBack);
  const from = fromDate.toISOString().split('T')[0];

  return { from, to };
}

/**
 * Fetches historical price data for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "AAPL").
 * @param period - Chart period to fetch (defaults to '1Y').
 * @returns Promise resolving to an array of normalized historical prices.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const prices = await getHistoricalPrices('AAPL', '3M');
 * console.log(prices[0].close); // Latest closing price
 * ```
 */
export async function getHistoricalPrices(
  symbol: string,
  period: ChartPeriod = '1Y'
): Promise<HistoricalPrice[]> {
  const dateRange = calculateDateRange(period);

  const params: Record<string, string> = {};
  if (dateRange) {
    params.from = dateRange.from;
    params.to = dateRange.to;
  }

  const response = await fmpFetch<FMPHistoricalEodResponse | FMPHistoricalPriceFullResponse>(
    '/stable/historical-price-eod/full',
    {
      ...params,
      symbol,
    }
  );

  if (Array.isArray(response)) {
    const normalized = response.map(normalizeHistoricalEodRecord);
    return normalized.reverse();
  }

  if (
    typeof response === 'object' &&
    response !== null &&
    'historical' in response &&
    Array.isArray(response.historical)
  ) {
    const normalized = response.historical.map(normalizeHistoricalPrice);
    return normalized.reverse();
  }

  throw new ApiSchemaError(
    `Historical price response is invalid for symbol: ${symbol}`,
    response
  );
}
