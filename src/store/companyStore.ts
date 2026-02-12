// =============================================================================
// Company Store — Zustand store for company data
// Manages company profile, quote, financials, and historical data
// =============================================================================

import { create } from 'zustand';
import type {
  Company,
  CompanyQuote,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  KeyMetrics,
  FinancialRatios,
  HistoricalPrice,
  ChartPeriod,
  FinancialPeriod,
} from '@/types';

// -----------------------------------------------------------------------------
// State Type
// -----------------------------------------------------------------------------

interface CompanyState {
  profile: Company | null;
  quote: CompanyQuote | null;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlowStatement[];
  keyMetrics: KeyMetrics[];
  financialRatios: FinancialRatios[];
  historicalPrices: HistoricalPrice[];
  selectedPeriod: ChartPeriod;
  financialPeriod: FinancialPeriod;
  isLoading: boolean;
}

// -----------------------------------------------------------------------------
// Actions Type
// -----------------------------------------------------------------------------

interface CompanyActions {
  setProfile: (profile: Company | null) => void;
  setQuote: (quote: CompanyQuote | null) => void;
  setIncomeStatements: (data: IncomeStatement[]) => void;
  setBalanceSheets: (data: BalanceSheet[]) => void;
  setCashFlows: (data: CashFlowStatement[]) => void;
  setKeyMetrics: (data: KeyMetrics[]) => void;
  setFinancialRatios: (data: FinancialRatios[]) => void;
  setHistoricalPrices: (data: HistoricalPrice[]) => void;
  setSelectedPeriod: (period: ChartPeriod) => void;
  setFinancialPeriod: (period: FinancialPeriod) => void;
  setLoading: (isLoading: boolean) => void;
  clearCompany: () => void;
}

// -----------------------------------------------------------------------------
// Combined Store Type
// -----------------------------------------------------------------------------

type CompanyStoreType = CompanyState & CompanyActions;

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialState: CompanyState = {
  profile: null,
  quote: null,
  incomeStatements: [],
  balanceSheets: [],
  cashFlows: [],
  keyMetrics: [],
  financialRatios: [],
  historicalPrices: [],
  selectedPeriod: '1Y',
  financialPeriod: 'annual',
  isLoading: false,
};

// -----------------------------------------------------------------------------
// Zustand Store
// -----------------------------------------------------------------------------

export const useCompanyStore = create<CompanyStoreType>((set) => ({
  ...initialState,

  setProfile: (profile) => set({ profile }),

  setQuote: (quote) => set({ quote }),

  setIncomeStatements: (data) => set({ incomeStatements: data }),

  setBalanceSheets: (data) => set({ balanceSheets: data }),

  setCashFlows: (data) => set({ cashFlows: data }),

  setKeyMetrics: (data) => set({ keyMetrics: data }),

  setFinancialRatios: (data) => set({ financialRatios: data }),

  setHistoricalPrices: (data) => set({ historicalPrices: data }),

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  setFinancialPeriod: (period) => set({ financialPeriod: period }),

  setLoading: (isLoading) => set({ isLoading }),

  clearCompany: () => set(initialState),
}));

// -----------------------------------------------------------------------------
// Selectors (Derived Values)
// -----------------------------------------------------------------------------

/**
 * Selector: Check if company data is loaded.
 */
export const selectHasCompanyData = (state: CompanyState): boolean =>
  state.profile !== null;

/**
 * Selector: Get the current company symbol.
 */
export const selectCompanySymbol = (state: CompanyState): string | null =>
  state.profile?.symbol || null;

/**
 * Selector: Get the current company name.
 */
export const selectCompanyName = (state: CompanyState): string | null =>
  state.profile?.companyName || null;

/**
 * Selector: Check if financial data is available.
 */
export const selectHasFinancialData = (state: CompanyState): boolean =>
  state.incomeStatements.length > 0 ||
  state.balanceSheets.length > 0 ||
  state.cashFlows.length > 0;

/**
 * Selector: Check if historical price data is available.
 */
export const selectHasHistoricalData = (state: CompanyState): boolean =>
  state.historicalPrices.length > 0;

/**
 * Selector: Get the latest income statement.
 */
export const selectLatestIncomeStatement = (
  state: CompanyState
): IncomeStatement | null =>
  state.incomeStatements.length > 0 ? state.incomeStatements[0] : null;

/**
 * Selector: Get the latest balance sheet.
 */
export const selectLatestBalanceSheet = (
  state: CompanyState
): BalanceSheet | null =>
  state.balanceSheets.length > 0 ? state.balanceSheets[0] : null;

/**
 * Selector: Get the latest cash flow statement.
 */
export const selectLatestCashFlow = (
  state: CompanyState
): CashFlowStatement | null =>
  state.cashFlows.length > 0 ? state.cashFlows[0] : null;
