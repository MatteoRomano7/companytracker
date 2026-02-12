// =============================================================================
// FMP Search API Route — Proxy for company search
// GET /api/fmp/search?q={query}&limit={limit}
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { searchCompanies, FMPError, ApiSchemaError, NetworkError, RateLimitedError } from '@/services/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');

    // Validate required parameters
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Validate limit is a positive number
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be a positive number' },
        { status: 400 }
      );
    }

    // Call the service
    const results = await searchCompanies(query, limit);

    return NextResponse.json(results, { status: 200 });
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
    console.error('[FMP Search Route] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
