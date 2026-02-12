// =============================================================================
// FMP Historical Prices API Route — Proxy for historical price data
// GET /api/fmp/historical/{symbol}?period={period}
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalPrices, FMPError, ApiSchemaError, NetworkError, RateLimitedError } from '@/services/api';
import { ChartPeriod } from '@/types';

const VALID_PERIODS: ChartPeriod[] = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'MAX'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const searchParams = request.nextUrl.searchParams;
    const periodParam = searchParams.get('period');

    // Validate symbol parameter
    if (!symbol || symbol.trim() === '') {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Validate and parse period
    let period: ChartPeriod = '1Y';
    if (periodParam) {
      if (!VALID_PERIODS.includes(periodParam as ChartPeriod)) {
        return NextResponse.json(
          { error: `Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}` },
          { status: 400 }
        );
      }
      period = periodParam as ChartPeriod;
    }

    // Call the service
    const prices = await getHistoricalPrices(symbol.toUpperCase(), period);

    return NextResponse.json(prices, { status: 200 });
  } catch (error) {
    // Handle known error types
    if (error instanceof FMPError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    if (error instanceof ApiSchemaError) {
      return NextResponse.json(
        { error: 'Invalid response from FMP API', details: error.message },
        { status: 502 }
      );
    }

    if (error instanceof RateLimitedError) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: error.retryAfter },
        { status: 429 }
      );
    }

    if (error instanceof NetworkError) {
      return NextResponse.json(
        { error: 'Network error', details: error.message },
        { status: 503 }
      );
    }

    // Generic error handler
    console.error('[FMP Historical Route] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
