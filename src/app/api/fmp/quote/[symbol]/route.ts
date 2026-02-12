// =============================================================================
// FMP Quote API Route — Proxy for real-time quote data
// GET /api/fmp/quote/{symbol}
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCompanyQuote, FMPError, ApiSchemaError, NetworkError, RateLimitedError } from '@/services/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    // Validate symbol parameter
    if (!symbol || symbol.trim() === '') {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Call the service
    const quote = await getCompanyQuote(symbol.toUpperCase());

    return NextResponse.json(quote, { status: 200 });
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
    console.error('[FMP Quote Route] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
