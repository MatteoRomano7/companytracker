"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { CompanyHeader } from "@/features/company/components/CompanyHeader";
import { CompanyTabs } from "@/features/company/components/CompanyTabs";
import { CompanyOverview } from "@/features/company/components/CompanyOverview";
import PriceChart from "@/components/charts/PriceChart";
import VolumeChart from "@/components/charts/VolumeChart";
import FinancialChart from "@/components/charts/FinancialChart";
import { FinancialTable } from "@/features/financials/components/FinancialTable";
import { PeriodToggle } from "@/features/financials/components/PeriodToggle";
import { MetricsGrid } from "@/features/financials/components/MetricsGrid";
import { useCompanyStore, useWatchlistStore } from "@/store";
import type { ChartPeriod, HistoricalPrice } from "@/types";

export default function CompanyPage() {
  const params = useParams();
  const symbol = params.symbol as string;

  const [profile, setProfile] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("1M");
  const [financialPeriod, setFinancialPeriod] = useState<"annual" | "quarterly">("annual");
  const [incomeStatements, setIncomeStatements] = useState<any[]>([]);
  const [balanceSheets, setBalanceSheets] = useState<any[]>([]);
  const [cashFlows, setCashFlows] = useState<any[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<any[]>([]);
  const [ratios, setRatios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const watchlist = useWatchlistStore((state) => state.items);
  const addToWatchlist = useWatchlistStore((state) => state.addItem);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeItem);

  const isInWatchlist = watchlist.some((item) => item.symbol === symbol);

  // Fetch all company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);

      try {
        const [
          profileRes,
          quoteRes,
          historicalRes,
          incomeRes,
          balanceRes,
          cashFlowRes,
          metricsRes,
          ratiosRes,
        ] = await Promise.all([
          fetch(`/api/fmp/profile/${symbol}`),
          fetch(`/api/fmp/quote/${symbol}`),
          fetch(`/api/fmp/historical/${symbol}?period=${chartPeriod}`),
          fetch(`/api/fmp/income-statement/${symbol}?period=${financialPeriod}&limit=5`),
          fetch(`/api/fmp/balance-sheet/${symbol}?period=${financialPeriod}&limit=5`),
          fetch(`/api/fmp/cash-flow/${symbol}?period=${financialPeriod}&limit=5`),
          fetch(`/api/fmp/metrics/${symbol}?period=${financialPeriod}&limit=5`),
          fetch(`/api/fmp/ratios/${symbol}?period=${financialPeriod}&limit=5`),
        ]);

        const [
          profileData,
          quoteData,
          historicalDataRes,
          incomeData,
          balanceData,
          cashFlowData,
          metricsData,
          ratiosData,
        ] = await Promise.all([
          profileRes.json(),
          quoteRes.json(),
          historicalRes.json(),
          incomeRes.json(),
          balanceRes.json(),
          cashFlowRes.json(),
          metricsRes.json(),
          ratiosRes.json(),
        ]);

        setProfile(profileData || null);
        setQuote(quoteData || null);
        setHistoricalData(historicalDataRes || []);
        setIncomeStatements(incomeData || []);
        setBalanceSheets(balanceData || []);
        setCashFlows(cashFlowData || []);
        setKeyMetrics(metricsData || []);
        setRatios(ratiosData || []);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [symbol, chartPeriod, financialPeriod]);

  // Refetch historical data when period changes
  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        const response = await fetch(`/api/fmp/historical/${symbol}?period=${chartPeriod}`);
        const data = await response.json();
        setHistoricalData(data || []);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    if (!isLoading) {
      fetchHistorical();
    }
  }, [symbol, chartPeriod, isLoading]);

  const handleWatchlistToggle = async () => {
    if (isInWatchlist) {
      const item = watchlist.find((w) => w.symbol === symbol);
      if (item) {
        await removeFromWatchlist(item.id);
      }
    } else if (profile) {
      await addToWatchlist({
        symbol: profile.symbol,
        companyName: profile.companyName,
        notes: "",
      });
    }
  };

  if (isLoading || !profile || !quote) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-8">
          <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-96 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      </PageContainer>
    );
  }

  const formatBillions = (value?: number) =>
    typeof value === "number" ? `$${(value / 1e9).toFixed(2)}B` : "N/A";
  const formatNumber = (value?: number, decimals: number = 2) =>
    typeof value === "number" ? value.toFixed(decimals) : "N/A";
  const formatPercent = (value?: number, decimals: number = 2) =>
    typeof value === "number" ? `${(value * 100).toFixed(decimals)}%` : "N/A";

  const latestIncome = incomeStatements[0];
  const latestBalance = balanceSheets[0];
  const latestMetrics = keyMetrics[0];
  const latestRatios = ratios[0];
  const latestCashFlow = cashFlows[0];

  const sharesOutstanding =
    quote?.sharesOutstanding ??
    latestIncome?.weightedAverageSharesOutstanding ??
    latestIncome?.weightedAverageSharesOutstandingDiluted;
  const eps =
    latestMetrics?.netIncomePerShare ??
    quote?.eps ??
    (latestIncome?.netIncome && sharesOutstanding
      ? latestIncome.netIncome / sharesOutstanding
      : undefined);
  const peRatio =
    latestMetrics?.peRatio ??
    quote?.pe ??
    (quote?.price && eps ? quote.price / eps : undefined);
  const revenuePerShare =
    latestMetrics?.revenuePerShare ??
    (latestIncome?.revenue && sharesOutstanding
      ? latestIncome.revenue / sharesOutstanding
      : undefined);
  const bookValuePerShare =
    latestBalance?.totalStockholdersEquity && sharesOutstanding
      ? latestBalance.totalStockholdersEquity / sharesOutstanding
      : undefined;
  const pbRatio =
    latestMetrics?.pbRatio ??
    (quote?.price && bookValuePerShare
      ? quote.price / bookValuePerShare
      : undefined);
  const roe =
    latestMetrics?.roe ??
    (latestIncome?.netIncome && latestBalance?.totalStockholdersEquity
      ? latestIncome.netIncome / latestBalance.totalStockholdersEquity
      : undefined);
  const debtToEquity =
    latestRatios?.debtEquityRatio ??
    (latestBalance?.totalLiabilities && latestBalance?.totalStockholdersEquity
      ? latestBalance.totalLiabilities / latestBalance.totalStockholdersEquity
      : undefined);
  const investingCashFlow =
    latestCashFlow?.netCashUsedForInvestingActivities ??
    (latestCashFlow
      ? (latestCashFlow.investmentsInPropertyPlantAndEquipment ?? 0) +
        (latestCashFlow.acquisitionsNet ?? 0) +
        (latestCashFlow.purchasesOfInvestments ?? 0) +
        (latestCashFlow.salesMaturitiesOfInvestments ?? 0) +
        (latestCashFlow.otherInvestingActivities ?? 0)
      : undefined);

  // Transform metrics for MetricsGrid
  const metricsGridData = [
    {
      label: "P/E Ratio",
      value: formatNumber(peRatio),
    },
    {
      label: "EPS",
      value: typeof eps === "number" ? `$${eps.toFixed(2)}` : "N/A",
    },
    {
      label: "Market Cap",
      value: formatBillions(profile.marketCap ?? latestMetrics?.marketCap),
    },
    {
      label: "Revenue per Share",
      value:
        typeof revenuePerShare === "number"
          ? `$${revenuePerShare.toFixed(2)}`
          : "N/A",
    },
    {
      label: "P/B Ratio",
      value: formatNumber(pbRatio),
    },
    {
      label: "ROE",
      value: formatPercent(roe),
    },
    {
      label: "Debt to Equity",
      value: formatNumber(debtToEquity),
    },
    {
      label: "Current Ratio",
      value: formatNumber(latestRatios?.currentRatio),
    },
  ];

  // Transform financial data for charts
  const revenueChartData = incomeStatements
    .slice()
    .reverse()
    .map((stmt) => ({
      period: stmt.calendarYear || stmt.period,
      revenue: stmt.revenue,
      netIncome: stmt.netIncome,
      operatingIncome: stmt.operatingIncome,
    }));

  const revenueSeries = [
    { dataKey: "revenue", name: "Revenue", color: "#3b82f6" },
    { dataKey: "netIncome", name: "Net Income", color: "#10b981" },
    { dataKey: "operatingIncome", name: "Operating Income", color: "#f59e0b" },
  ];

  // Transform income statement for table (pivot to metrics as rows, years as columns)
  const incomeTableData = incomeStatements.length > 0
    ? [
        {
          metric: "Revenue",
          ...Object.fromEntries(
            incomeStatements.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.revenue),
            ])
          ),
        },
        {
          metric: "Cost of Revenue",
          ...Object.fromEntries(
            incomeStatements.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.costOfRevenue),
            ])
          ),
        },
        {
          metric: "Gross Profit",
          ...Object.fromEntries(
            incomeStatements.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.grossProfit),
            ])
          ),
        },
        {
          metric: "Operating Income",
          ...Object.fromEntries(
            incomeStatements.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.operatingIncome),
            ])
          ),
        },
        {
          metric: "Net Income",
          ...Object.fromEntries(
            incomeStatements.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.netIncome),
            ])
          ),
        },
        {
          metric: "EPS",
          ...Object.fromEntries(
            incomeStatements.map((s) => [s.calendarYear || s.period, `$${s.eps.toFixed(2)}`])
          ),
        },
      ]
    : [];

  const balanceTableData = balanceSheets.length > 0
    ? [
        {
          metric: "Total Assets",
          ...Object.fromEntries(
            balanceSheets.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.totalAssets),
            ])
          ),
        },
        {
          metric: "Total Liabilities",
          ...Object.fromEntries(
            balanceSheets.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.totalLiabilities),
            ])
          ),
        },
        {
          metric: "Total Equity",
          ...Object.fromEntries(
            balanceSheets.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.totalStockholdersEquity),
            ])
          ),
        },
        {
          metric: "Cash",
          ...Object.fromEntries(
            balanceSheets.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.cashAndCashEquivalents),
            ])
          ),
        },
      ]
    : [];

  const cashFlowTableData = cashFlows.length > 0
    ? [
        {
          metric: "Operating Cash Flow",
          ...Object.fromEntries(
            cashFlows.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.operatingCashFlow),
            ])
          ),
        },
        {
          metric: "Investing Cash Flow",
          ...Object.fromEntries(
            cashFlows.map((s) => [
              s.calendarYear || s.period,
              formatBillions(
                s.netCashUsedForInvestingActivities ??
                  (s.investmentsInPropertyPlantAndEquipment ?? 0) +
                    (s.acquisitionsNet ?? 0) +
                    (s.purchasesOfInvestments ?? 0) +
                    (s.salesMaturitiesOfInvestments ?? 0) +
                    (s.otherInvestingActivities ?? 0)
              ),
            ])
          ),
        },
        {
          metric: "Financing Cash Flow",
          ...Object.fromEntries(
            cashFlows.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.netCashUsedProvidedByFinancingActivities),
            ])
          ),
        },
        {
          metric: "Free Cash Flow",
          ...Object.fromEntries(
            cashFlows.map((s) => [
              s.calendarYear || s.period,
              formatBillions(s.freeCashFlow),
            ])
          ),
        },
      ]
    : [];

  return (
    <PageContainer>
      <CompanyHeader
        symbol={profile.symbol}
        companyName={profile.companyName}
        image={profile.image}
        sector={profile.sector}
        exchange={profile.exchangeShortName}
        price={quote.price}
        change={quote.change}
        changePercent={quote.changesPercentage}
        marketCap={profile.marketCap}
        yearLow={quote.yearLow}
        yearHigh={quote.yearHigh}
        isInWatchlist={isInWatchlist}
        onWatchlistToggle={handleWatchlistToggle}
      />

      <div className="mt-8">
        <CompanyTabs
          defaultTab="overview"
          overviewContent={
            <CompanyOverview
              description={profile.description}
              ceo={profile.ceo}
              fullTimeEmployees={profile.fullTimeEmployees}
              sector={profile.sector}
              industry={profile.industry}
              exchange={profile.exchangeShortName}
              website={profile.website}
              ipoDate={profile.ipoDate}
            />
          }
          chartsContent={
            <div className="space-y-8">
              <PriceChart
                data={historicalData}
                period={chartPeriod}
                onPeriodChange={setChartPeriod}
                isLoading={false}
              />
              <VolumeChart data={historicalData} isLoading={false} />
            </div>
          }
          financialsContent={
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Financial Statements
                </h3>
                <PeriodToggle period={financialPeriod} onPeriodChange={setFinancialPeriod} />
              </div>

              {revenueChartData.length > 0 && (
                <FinancialChart
                  data={revenueChartData}
                  series={revenueSeries}
                  title="Revenue & Income Trends"
                  isLoading={false}
                />
              )}

              <FinancialTable data={incomeTableData} title="Income Statement" />
              <FinancialTable data={balanceTableData} title="Balance Sheet" />
              <FinancialTable data={cashFlowTableData} title="Cash Flow Statement" />
            </div>
          }
          metricsContent={
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Metrics & Ratios
              </h3>
              <MetricsGrid metrics={metricsGridData} isLoading={false} />
            </div>
          }
        />
      </div>
    </PageContainer>
  );
}
