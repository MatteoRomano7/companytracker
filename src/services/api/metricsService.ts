// =============================================================================
// Metrics Service — Key metrics and financial ratios operations
// Handles normalization from FMP raw types to application metrics types
// =============================================================================

import {
  FMPKeyMetricsResponse,
  FMPFinancialRatiosResponse,
  KeyMetrics,
  FinancialRatios,
  FinancialPeriod,
} from '@/types';
import { fmpFetch, ApiSchemaError } from './fmpClient';

/**
 * Normalizes FMP key metrics to application KeyMetrics type.
 *
 * @param fmpMetrics - Raw FMP key metrics.
 * @returns Normalized key metrics.
 */
function normalizeKeyMetrics(
  fmpMetrics: FMPKeyMetricsResponse[0]
): KeyMetrics {
  const pickNumber = (...values: Array<number | null | undefined>) =>
    values.find((value) => typeof value === 'number');

  return {
    symbol: fmpMetrics.symbol,
    date: fmpMetrics.date,
    calendarYear: fmpMetrics.calendarYear,
    period: fmpMetrics.period,
    // Per-share metrics
    revenuePerShare: pickNumber(
      fmpMetrics.revenuePerShare,
      fmpMetrics.revenuePerShareTTM
    ),
    netIncomePerShare: pickNumber(
      fmpMetrics.netIncomePerShare,
      fmpMetrics.earningsPerShare,
      fmpMetrics.eps
    ),
    operatingCashFlowPerShare: fmpMetrics.operatingCashFlowPerShare,
    freeCashFlowPerShare: fmpMetrics.freeCashFlowPerShare,
    cashPerShare: fmpMetrics.cashPerShare,
    bookValuePerShare: fmpMetrics.bookValuePerShare,
    tangibleBookValuePerShare: fmpMetrics.tangibleBookValuePerShare,
    // Valuation
    marketCap: pickNumber(
      fmpMetrics.marketCap,
      fmpMetrics.marketCapitalization
    ),
    enterpriseValue: fmpMetrics.enterpriseValue,
    peRatio: pickNumber(
      fmpMetrics.peRatio,
      fmpMetrics.priceEarningsRatio,
      fmpMetrics.priceToEarningsRatio,
      fmpMetrics.pe,
      fmpMetrics.peRatioTTM
    ),
    priceToSalesRatio: fmpMetrics.priceToSalesRatio,
    pfcfRatio: fmpMetrics.pfcfRatio,
    pbRatio: pickNumber(
      fmpMetrics.pbRatio,
      fmpMetrics.priceToBookRatio,
      fmpMetrics.priceBookValueRatio,
      fmpMetrics.priceToBook,
      fmpMetrics.pbRatioTTM
    ),
    evToSales: fmpMetrics.evToSales,
    evToEbitda: fmpMetrics.enterpriseValueOverEBITDA,
    evToOperatingCashFlow: fmpMetrics.evToOperatingCashFlow,
    evToFreeCashFlow: fmpMetrics.evToFreeCashFlow,
    earningsYield: fmpMetrics.earningsYield,
    freeCashFlowYield: fmpMetrics.freeCashFlowYield,
    // Leverage and liquidity
    debtToEquity: fmpMetrics.debtToEquity,
    debtToAssets: fmpMetrics.debtToAssets,
    netDebtToEbitda: fmpMetrics.netDebtToEBITDA,
    currentRatio: fmpMetrics.currentRatio,
    interestCoverage: fmpMetrics.interestCoverage,
    // Profitability
    roe: pickNumber(
      fmpMetrics.roe,
      fmpMetrics.returnOnEquity,
      fmpMetrics.roeTTM,
      fmpMetrics.returnOnEquityTTM
    ),
    roic: fmpMetrics.roic,
    returnOnTangibleAssets: fmpMetrics.returnOnTangibleAssets,
    incomeQuality: fmpMetrics.incomeQuality,
    // Dividends
    dividendYield: fmpMetrics.dividendYield,
    payoutRatio: fmpMetrics.payoutRatio,
    // Efficiency
    daysSalesOutstanding: fmpMetrics.daysSalesOutstanding,
    daysPayablesOutstanding: fmpMetrics.daysPayablesOutstanding,
    daysOfInventoryOnHand: fmpMetrics.daysOfInventoryOnHand,
    receivablesTurnover: fmpMetrics.receivablesTurnover,
    payablesTurnover: fmpMetrics.payablesTurnover,
    inventoryTurnover: fmpMetrics.inventoryTurnover,
  };
}

/**
 * Normalizes FMP financial ratios to application FinancialRatios type.
 *
 * @param fmpRatios - Raw FMP financial ratios.
 * @returns Normalized financial ratios.
 */
function normalizeFinancialRatios(
  fmpRatios: FMPFinancialRatiosResponse[0]
): FinancialRatios {
  const pickNumber = (...values: Array<number | null | undefined>) =>
    values.find((value) => typeof value === 'number');

  return {
    symbol: fmpRatios.symbol,
    date: fmpRatios.date,
    calendarYear: fmpRatios.calendarYear,
    period: fmpRatios.period,
    // Liquidity
    currentRatio: fmpRatios.currentRatio,
    quickRatio: fmpRatios.quickRatio,
    cashRatio: fmpRatios.cashRatio,
    // Profitability margins
    grossProfitMargin: fmpRatios.grossProfitMargin,
    operatingProfitMargin: fmpRatios.operatingProfitMargin,
    pretaxProfitMargin: fmpRatios.pretaxProfitMargin,
    netProfitMargin: fmpRatios.netProfitMargin,
    effectiveTaxRate: fmpRatios.effectiveTaxRate,
    // Returns
    returnOnAssets: fmpRatios.returnOnAssets,
    returnOnEquity: fmpRatios.returnOnEquity,
    returnOnCapitalEmployed: fmpRatios.returnOnCapitalEmployed,
    // Leverage
    debtRatio: fmpRatios.debtRatio,
    debtEquityRatio: pickNumber(
      fmpRatios.debtEquityRatio,
      fmpRatios.debtToEquity
    ),
    longTermDebtToCapitalization: fmpRatios.longTermDebtToCapitalization,
    totalDebtToCapitalization: fmpRatios.totalDebtToCapitalization,
    interestCoverage: fmpRatios.interestCoverage,
    cashFlowToDebtRatio: fmpRatios.cashFlowToDebtRatio,
    companyEquityMultiplier: fmpRatios.companyEquityMultiplier,
    // Activity / Efficiency
    receivablesTurnover: fmpRatios.receivablesTurnover,
    payablesTurnover: fmpRatios.payablesTurnover,
    inventoryTurnover: fmpRatios.inventoryTurnover,
    fixedAssetTurnover: fmpRatios.fixedAssetTurnover,
    assetTurnover: fmpRatios.assetTurnover,
    operatingCycle: fmpRatios.operatingCycle,
    cashConversionCycle: fmpRatios.cashConversionCycle,
    // Per-share
    operatingCashFlowPerShare: fmpRatios.operatingCashFlowPerShare,
    freeCashFlowPerShare: fmpRatios.freeCashFlowPerShare,
    cashPerShare: fmpRatios.cashPerShare,
    // Valuation
    priceBookValueRatio: fmpRatios.priceBookValueRatio,
    priceToSalesRatio: fmpRatios.priceToSalesRatio,
    priceEarningsRatio: fmpRatios.priceEarningsRatio,
    priceToFreeCashFlowsRatio: fmpRatios.priceToFreeCashFlowsRatio,
    priceToOperatingCashFlowsRatio: fmpRatios.priceToOperatingCashFlowsRatio,
    priceEarningsToGrowthRatio: fmpRatios.priceEarningsToGrowthRatio,
    dividendYield: fmpRatios.dividendYield,
    enterpriseValueMultiple: fmpRatios.enterpriseValueMultiple,
    priceFairValue: fmpRatios.priceFairValue,
    // Dividends
    dividendPayoutRatio: fmpRatios.dividendPayoutRatio,
  };
}

/**
 * Fetches key metrics for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "AAPL").
 * @param period - Reporting period (annual or quarterly), defaults to 'annual'.
 * @param limit - Number of periods to fetch, defaults to 10.
 * @returns Promise resolving to an array of normalized key metrics.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const metrics = await getKeyMetrics('AAPL', 'quarterly', 4);
 * console.log(metrics[0].peRatio);
 * ```
 */
export async function getKeyMetrics(
  symbol: string,
  period: FinancialPeriod = 'annual',
  limit: number = 10
): Promise<KeyMetrics[]> {
  const response = await fmpFetch<FMPKeyMetricsResponse>(
    '/stable/key-metrics',
    {
      symbol,
      period,
      limit: limit.toString(),
    }
  );

  // Validate response is an array
  if (!Array.isArray(response)) {
    throw new ApiSchemaError(
      `Key metrics response is not an array for symbol: ${symbol}`,
      response
    );
  }

  return response.map(normalizeKeyMetrics);
}

/**
 * Fetches financial ratios for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "MSFT").
 * @param period - Reporting period (annual or quarterly), defaults to 'annual'.
 * @param limit - Number of periods to fetch, defaults to 10.
 * @returns Promise resolving to an array of normalized financial ratios.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const ratios = await getFinancialRatios('MSFT', 'annual', 5);
 * console.log(ratios[0].returnOnEquity);
 * ```
 */
export async function getFinancialRatios(
  symbol: string,
  period: FinancialPeriod = 'annual',
  limit: number = 10
): Promise<FinancialRatios[]> {
  const response = await fmpFetch<FMPFinancialRatiosResponse>(
    '/stable/ratios',
    {
      symbol,
      period,
      limit: limit.toString(),
    }
  );

  // Validate response is an array
  if (!Array.isArray(response)) {
    throw new ApiSchemaError(
      `Financial ratios response is not an array for symbol: ${symbol}`,
      response
    );
  }

  return response.map(normalizeFinancialRatios);
}
