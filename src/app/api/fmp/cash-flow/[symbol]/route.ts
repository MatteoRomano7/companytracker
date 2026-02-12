// =============================================================================
// FMP Cash Flow API Route — Proxy for cash flow statement data
// GET /api/fmp/cash-flow/{symbol}?period={period}&limit={limit}
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCashFlow, FMPError, ApiSchemaError, NetworkError, RateLimitedError } from '@/services/api';
import { FinancialPeriod } from '@/types';

const VALID_PERIODS: FinancialPeriod[] = ['annual', 'quarterly'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const searchParams = request.nextUrl.searchParams;
    const periodParam = searchParams.get('period');
    const limitParam = searchParams.get('limit');

    // Validate symbol parameter
    if (!symbol || symbol.trim() === '') {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Validate and parse period
    let period: FinancialPeriod = 'annual';
    if (periodParam) {
      if (!VALID_PERIODS.includes(periodParam as FinancialPeriod)) {
        return NextResponse.json(
          { error: `Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}` },
          { status: 400 }
        );
      }
      period = periodParam as FinancialPeriod;
    }

    // Validate and parse limit
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be a positive number' },
        { status: 400 }
      );
    }

    // Call the service
    const cashFlows = await getCashFlow(symbol.toUpperCase(), period, limit);

    return NextResponse.json(cashFlows, { status: 200 });
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
    console.error('[FMP Cash Flow Route] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
