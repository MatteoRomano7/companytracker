// =============================================================================
// Financial Service — Income statement, balance sheet, and cash flow operations
// Handles normalization from FMP raw types to application financial statement types
// =============================================================================

import {
  FMPIncomeStatementResponse,
  FMPBalanceSheetResponse,
  FMPCashFlowStatementResponse,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialPeriod,
} from '@/types';
import { fmpFetch, ApiSchemaError } from './fmpClient';

/**
 * Normalizes FMP income statement to application IncomeStatement type.
 *
 * @param fmpIncome - Raw FMP income statement.
 * @returns Normalized income statement.
 */
function normalizeIncomeStatement(
  fmpIncome: FMPIncomeStatementResponse[0]
): IncomeStatement {
  return {
    date: fmpIncome.date,
    symbol: fmpIncome.symbol,
    reportedCurrency: fmpIncome.reportedCurrency,
    calendarYear: fmpIncome.calendarYear,
    period: fmpIncome.period,
    revenue: fmpIncome.revenue,
    costOfRevenue: fmpIncome.costOfRevenue,
    grossProfit: fmpIncome.grossProfit,
    grossProfitRatio: fmpIncome.grossProfitRatio,
    researchAndDevelopmentExpenses: fmpIncome.researchAndDevelopmentExpenses,
    sellingGeneralAndAdministrativeExpenses: fmpIncome.sellingGeneralAndAdministrativeExpenses,
    operatingExpenses: fmpIncome.operatingExpenses,
    operatingIncome: fmpIncome.operatingIncome,
    operatingIncomeRatio: fmpIncome.operatingIncomeRatio,
    interestIncome: fmpIncome.interestIncome,
    interestExpense: fmpIncome.interestExpense,
    depreciationAndAmortization: fmpIncome.depreciationAndAmortization,
    ebitda: fmpIncome.ebitda,
    ebitdaRatio: fmpIncome.ebitdaratio, // Note: FMP uses lowercase 'ratio'
    totalOtherIncomeExpensesNet: fmpIncome.totalOtherIncomeExpensesNet,
    incomeBeforeTax: fmpIncome.incomeBeforeTax,
    incomeBeforeTaxRatio: fmpIncome.incomeBeforeTaxRatio,
    incomeTaxExpense: fmpIncome.incomeTaxExpense,
    netIncome: fmpIncome.netIncome,
    netIncomeRatio: fmpIncome.netIncomeRatio,
    eps: fmpIncome.eps,
    epsDiluted: fmpIncome.epsdiluted, // Note: FMP uses lowercase 'diluted'
    weightedAverageSharesOutstanding: fmpIncome.weightedAverageShsOut,
    weightedAverageSharesOutstandingDiluted: fmpIncome.weightedAverageShsOutDil,
  };
}

/**
 * Normalizes FMP balance sheet to application BalanceSheet type.
 *
 * @param fmpBalance - Raw FMP balance sheet.
 * @returns Normalized balance sheet.
 */
function normalizeBalanceSheet(
  fmpBalance: FMPBalanceSheetResponse[0]
): BalanceSheet {
  return {
    date: fmpBalance.date,
    symbol: fmpBalance.symbol,
    reportedCurrency: fmpBalance.reportedCurrency,
    calendarYear: fmpBalance.calendarYear,
    period: fmpBalance.period,
    // Assets
    cashAndCashEquivalents: fmpBalance.cashAndCashEquivalents,
    shortTermInvestments: fmpBalance.shortTermInvestments,
    cashAndShortTermInvestments: fmpBalance.cashAndShortTermInvestments,
    netReceivables: fmpBalance.netReceivables,
    inventory: fmpBalance.inventory,
    otherCurrentAssets: fmpBalance.otherCurrentAssets,
    totalCurrentAssets: fmpBalance.totalCurrentAssets,
    propertyPlantEquipmentNet: fmpBalance.propertyPlantEquipmentNet,
    goodwill: fmpBalance.goodwill,
    intangibleAssets: fmpBalance.intangibleAssets,
    goodwillAndIntangibleAssets: fmpBalance.goodwillAndIntangibleAssets,
    longTermInvestments: fmpBalance.longTermInvestments,
    taxAssets: fmpBalance.taxAssets,
    otherNonCurrentAssets: fmpBalance.otherNonCurrentAssets,
    totalNonCurrentAssets: fmpBalance.totalNonCurrentAssets,
    totalAssets: fmpBalance.totalAssets,
    // Liabilities
    accountPayables: fmpBalance.accountPayables,
    shortTermDebt: fmpBalance.shortTermDebt,
    taxPayables: fmpBalance.taxPayables,
    deferredRevenue: fmpBalance.deferredRevenue,
    otherCurrentLiabilities: fmpBalance.otherCurrentLiabilities,
    totalCurrentLiabilities: fmpBalance.totalCurrentLiabilities,
    longTermDebt: fmpBalance.longTermDebt,
    deferredRevenueNonCurrent: fmpBalance.deferredRevenueNonCurrent,
    deferredTaxLiabilitiesNonCurrent: fmpBalance.deferredTaxLiabilitiesNonCurrent,
    otherNonCurrentLiabilities: fmpBalance.otherNonCurrentLiabilities,
    totalNonCurrentLiabilities: fmpBalance.totalNonCurrentLiabilities,
    totalLiabilities: fmpBalance.totalLiabilities,
    // Equity
    commonStock: fmpBalance.commonStock,
    retainedEarnings: fmpBalance.retainedEarnings,
    accumulatedOtherComprehensiveIncomeLoss: fmpBalance.accumulatedOtherComprehensiveIncomeLoss,
    totalStockholdersEquity: fmpBalance.totalStockholdersEquity,
    totalEquity: fmpBalance.totalEquity,
    totalLiabilitiesAndStockholdersEquity: fmpBalance.totalLiabilitiesAndStockholdersEquity,
    minorityInterest: fmpBalance.minorityInterest,
    // Computed aggregates
    totalInvestments: fmpBalance.totalInvestments,
    totalDebt: fmpBalance.totalDebt,
    netDebt: fmpBalance.netDebt,
  };
}

/**
 * Normalizes FMP cash flow statement to application CashFlowStatement type.
 *
 * @param fmpCashFlow - Raw FMP cash flow statement.
 * @returns Normalized cash flow statement.
 */
function normalizeCashFlowStatement(
  fmpCashFlow: FMPCashFlowStatementResponse[0]
): CashFlowStatement {
  const pickNumber = (...values: Array<number | null | undefined>) =>
    values.find((value) => typeof value === 'number');

  return {
    date: fmpCashFlow.date,
    symbol: fmpCashFlow.symbol,
    reportedCurrency: fmpCashFlow.reportedCurrency,
    calendarYear: fmpCashFlow.calendarYear,
    period: fmpCashFlow.period,
    // Operating activities
    netIncome: fmpCashFlow.netIncome,
    depreciationAndAmortization: fmpCashFlow.depreciationAndAmortization,
    deferredIncomeTax: fmpCashFlow.deferredIncomeTax,
    stockBasedCompensation: fmpCashFlow.stockBasedCompensation,
    changeInWorkingCapital: fmpCashFlow.changeInWorkingCapital,
    accountsReceivables: fmpCashFlow.accountsReceivables,
    inventory: fmpCashFlow.inventory,
    accountsPayables: fmpCashFlow.accountsPayables,
    otherWorkingCapital: fmpCashFlow.otherWorkingCapital,
    otherNonCashItems: fmpCashFlow.otherNonCashItems,
    netCashProvidedByOperatingActivities: fmpCashFlow.netCashProvidedByOperatingActivities,
    // Investing activities
    investmentsInPropertyPlantAndEquipment: fmpCashFlow.investmentsInPropertyPlantAndEquipment,
    acquisitionsNet: fmpCashFlow.acquisitionsNet,
    purchasesOfInvestments: fmpCashFlow.purchasesOfInvestments,
    salesMaturitiesOfInvestments: fmpCashFlow.salesMaturitiesOfInvestments,
    otherInvestingActivities: pickNumber(
      fmpCashFlow.otherInvestingActivities,
      fmpCashFlow.otherInvestingActivites
    ), // Note: FMP typo 'Activites'
    netCashUsedForInvestingActivities: pickNumber(
      fmpCashFlow.netCashUsedForInvestingActivities,
      fmpCashFlow.netCashUsedForInvestingActivites
    ), // Note: FMP typo 'Activites'
    // Financing activities
    debtRepayment: fmpCashFlow.debtRepayment,
    commonStockIssued: fmpCashFlow.commonStockIssued,
    commonStockRepurchased: fmpCashFlow.commonStockRepurchased,
    dividendsPaid: fmpCashFlow.dividendsPaid,
    otherFinancingActivities: pickNumber(
      fmpCashFlow.otherFinancingActivities,
      fmpCashFlow.otherFinancingActivites
    ), // Note: FMP typo 'Activites'
    netCashUsedProvidedByFinancingActivities: pickNumber(
      fmpCashFlow.netCashUsedProvidedByFinancingActivities,
      fmpCashFlow.netCashProvidedByFinancingActivities
    ),
    // Summary
    effectOfForexChangesOnCash: fmpCashFlow.effectOfForexChangesOnCash,
    netChangeInCash: fmpCashFlow.netChangeInCash,
    cashAtEndOfPeriod: fmpCashFlow.cashAtEndOfPeriod,
    cashAtBeginningOfPeriod: fmpCashFlow.cashAtBeginningOfPeriod,
    operatingCashFlow: fmpCashFlow.operatingCashFlow,
    capitalExpenditure: fmpCashFlow.capitalExpenditure,
    freeCashFlow: fmpCashFlow.freeCashFlow,
  };
}

/**
 * Fetches income statements for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "AAPL").
 * @param period - Reporting period (annual or quarterly), defaults to 'annual'.
 * @param limit - Number of periods to fetch, defaults to 10.
 * @returns Promise resolving to an array of normalized income statements.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const statements = await getIncomeStatement('AAPL', 'quarterly', 4);
 * console.log(statements[0].revenue);
 * ```
 */
export async function getIncomeStatement(
  symbol: string,
  period: FinancialPeriod = 'annual',
  limit: number = 10
): Promise<IncomeStatement[]> {
  const response = await fmpFetch<FMPIncomeStatementResponse>(
    '/stable/income-statement',
    {
      symbol,
      period,
      limit: limit.toString(),
    }
  );

  // Validate response is an array
  if (!Array.isArray(response)) {
    throw new ApiSchemaError(
      `Income statement response is not an array for symbol: ${symbol}`,
      response
    );
  }

  return response.map(normalizeIncomeStatement);
}

/**
 * Fetches balance sheets for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "MSFT").
 * @param period - Reporting period (annual or quarterly), defaults to 'annual'.
 * @param limit - Number of periods to fetch, defaults to 10.
 * @returns Promise resolving to an array of normalized balance sheets.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const sheets = await getBalanceSheet('MSFT', 'annual', 5);
 * console.log(sheets[0].totalAssets);
 * ```
 */
export async function getBalanceSheet(
  symbol: string,
  period: FinancialPeriod = 'annual',
  limit: number = 10
): Promise<BalanceSheet[]> {
  const response = await fmpFetch<FMPBalanceSheetResponse>(
    '/stable/balance-sheet-statement',
    {
      symbol,
      period,
      limit: limit.toString(),
    }
  );

  // Validate response is an array
  if (!Array.isArray(response)) {
    throw new ApiSchemaError(
      `Balance sheet response is not an array for symbol: ${symbol}`,
      response
    );
  }

  return response.map(normalizeBalanceSheet);
}

/**
 * Fetches cash flow statements for a company.
 *
 * @param symbol - Stock ticker symbol (e.g., "GOOGL").
 * @param period - Reporting period (annual or quarterly), defaults to 'annual'.
 * @param limit - Number of periods to fetch, defaults to 10.
 * @returns Promise resolving to an array of normalized cash flow statements.
 *
 * @throws {ApiSchemaError} If the response structure is invalid.
 * @throws {FMPError} On API errors.
 *
 * @example
 * ```ts
 * const cashFlows = await getCashFlow('GOOGL', 'quarterly', 8);
 * console.log(cashFlows[0].freeCashFlow);
 * ```
 */
export async function getCashFlow(
  symbol: string,
  period: FinancialPeriod = 'annual',
  limit: number = 10
): Promise<CashFlowStatement[]> {
  const response = await fmpFetch<FMPCashFlowStatementResponse>(
    '/stable/cash-flow-statement',
    {
      symbol,
      period,
      limit: limit.toString(),
    }
  );

  // Validate response is an array
  if (!Array.isArray(response)) {
    throw new ApiSchemaError(
      `Cash flow statement response is not an array for symbol: ${symbol}`,
      response
    );
  }

  return response.map(normalizeCashFlowStatement);
}
