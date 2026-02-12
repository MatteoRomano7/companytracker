// =============================================================================
// Normalized Financial Statement Types
// Used throughout the application after API data normalization
// =============================================================================

/**
 * Reporting period type for financial statements.
 */
export type FinancialPeriod = 'annual' | 'quarterly';

// -----------------------------------------------------------------------------
// Income Statement
// -----------------------------------------------------------------------------

export interface IncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaRatio: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsDiluted: number;
  weightedAverageSharesOutstanding: number;
  weightedAverageSharesOutstandingDiluted: number;
}

// -----------------------------------------------------------------------------
// Balance Sheet
// -----------------------------------------------------------------------------

export interface BalanceSheet {
  date: string;
  symbol: string;
  reportedCurrency: string;
  calendarYear: string;
  period: string;
  // Assets
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  goodwillAndIntangibleAssets: number;
  longTermInvestments: number;
  taxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  totalAssets: number;
  // Liabilities
  accountPayables: number;
  shortTermDebt: number;
  taxPayables: number;
  deferredRevenue: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;
  // Equity
  commonStock: number;
  retainedEarnings: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  totalLiabilitiesAndStockholdersEquity: number;
  minorityInterest: number;
  // Computed aggregates
  totalInvestments: number;
  totalDebt: number;
  netDebt: number;
}

// -----------------------------------------------------------------------------
// Cash Flow Statement
// -----------------------------------------------------------------------------

export interface CashFlowStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  calendarYear: string;
  period: string;
  // Operating activities
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  // Investing activities
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivities: number;
  netCashUsedForInvestingActivities: number;
  // Financing activities
  debtRepayment: number;
  commonStockIssued: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  otherFinancingActivities: number;
  netCashUsedProvidedByFinancingActivities: number;
  // Summary
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
}

// -----------------------------------------------------------------------------
// Key Metrics (normalized)
// -----------------------------------------------------------------------------

export interface KeyMetrics {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  // Per-share metrics
  revenuePerShare: number;
  netIncomePerShare: number;
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  tangibleBookValuePerShare: number;
  // Valuation
  marketCap: number;
  enterpriseValue: number;
  peRatio: number;
  priceToSalesRatio: number;
  pfcfRatio: number;
  pbRatio: number;
  evToSales: number;
  evToEbitda: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  earningsYield: number;
  freeCashFlowYield: number;
  // Leverage and liquidity
  debtToEquity: number;
  debtToAssets: number;
  netDebtToEbitda: number;
  currentRatio: number;
  interestCoverage: number;
  // Profitability
  roe: number;
  roic: number;
  returnOnTangibleAssets: number;
  incomeQuality: number;
  // Dividends
  dividendYield: number;
  payoutRatio: number;
  // Efficiency
  daysSalesOutstanding: number;
  daysPayablesOutstanding: number;
  daysOfInventoryOnHand: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
}

// -----------------------------------------------------------------------------
// Financial Ratios (normalized)
// -----------------------------------------------------------------------------

export interface FinancialRatios {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  // Liquidity
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  // Profitability margins
  grossProfitMargin: number;
  operatingProfitMargin: number;
  pretaxProfitMargin: number;
  netProfitMargin: number;
  effectiveTaxRate: number;
  // Returns
  returnOnAssets: number;
  returnOnEquity: number;
  returnOnCapitalEmployed: number;
  // Leverage
  debtRatio: number;
  debtEquityRatio: number;
  longTermDebtToCapitalization: number;
  totalDebtToCapitalization: number;
  interestCoverage: number;
  cashFlowToDebtRatio: number;
  companyEquityMultiplier: number;
  // Activity / Efficiency
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  fixedAssetTurnover: number;
  assetTurnover: number;
  operatingCycle: number;
  cashConversionCycle: number;
  // Per-share
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  // Valuation
  priceBookValueRatio: number;
  priceToSalesRatio: number;
  priceEarningsRatio: number;
  priceToFreeCashFlowsRatio: number;
  priceToOperatingCashFlowsRatio: number;
  priceEarningsToGrowthRatio: number;
  dividendYield: number;
  enterpriseValueMultiple: number;
  priceFairValue: number;
  // Dividends
  dividendPayoutRatio: number;
}

// -----------------------------------------------------------------------------
// Aggregated financial data for a company
// -----------------------------------------------------------------------------

export interface CompanyFinancials {
  symbol: string;
  period: FinancialPeriod;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlowStatements: CashFlowStatement[];
  keyMetrics: KeyMetrics[];
  ratios: FinancialRatios[];
}
