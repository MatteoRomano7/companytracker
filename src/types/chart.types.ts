// =============================================================================
// Chart & Historical Price Types
// Used with Recharts and the historical price API
// =============================================================================

/**
 * A single historical price data point from the API.
 */
export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  change: number;
  changePercent: number;
  vwap: number;
}

/**
 * Selectable time periods for chart display.
 */
export type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | 'MAX';

/**
 * Generic data point shape consumed by Recharts components.
 * The `date` field is used as the X-axis category/time value.
 */
export interface ChartDataPoint {
  date: string;
  value: number;
  /** Optional secondary value for dual-axis or comparison charts. */
  secondaryValue?: number;
  /** Optional label for tooltip display. */
  label?: string;
}

/**
 * OHLC (candlestick) data point for Recharts.
 */
export interface OHLCDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Volume bar data point for Recharts volume overlay.
 */
export interface VolumeDataPoint {
  date: string;
  volume: number;
  /** Whether the close was higher than the open (green bar). */
  isPositive: boolean;
}

/**
 * Configuration for a chart series line or area.
 */
export interface ChartSeriesConfig {
  dataKey: string;
  name: string;
  color: string;
  type?: 'line' | 'area' | 'bar';
  strokeWidth?: number;
  fillOpacity?: number;
  hidden?: boolean;
}

/**
 * Props for the main stock price chart component.
 */
export interface StockChartProps {
  symbol: string;
  data: OHLCDataPoint[];
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Props for a generic financial metric chart.
 */
export interface FinancialChartProps {
  title: string;
  data: ChartDataPoint[];
  series: ChartSeriesConfig[];
  xAxisKey?: string;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Map of chart period to the corresponding number of calendar days
 * to request from the historical API.
 */
export type ChartPeriodDaysMap = Record<ChartPeriod, number | null>;
