export interface Asset {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Portfolio {
  assets: Record<string, number>; // ticker -> quantity
  cash: number;
  totalValue: number;
  dailyReturns: number[];
  dates: string[];
  values: number[];
}

export interface Trade {
  id: string;
  date: string;
  ticker: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  value: number;
  reason: string;
}

export interface RiskControls {
  maxDrawdown: number; // percentage
  volatilityCap: number; // percentage
  stopLoss: number; // percentage
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
}

export interface SimulationConfig {
  tickers: string[];
  startDate: string;
  endDate: string;
  initialCapital: number;
  strategy: string;
  riskControls: RiskControls;
}

export interface PerformanceMetrics {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  volatility: number;
  alpha: number;
  beta: number;
}

export interface SimulationResult {
  portfolio: Portfolio;
  trades: Trade[];
  metrics: PerformanceMetrics;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  drawdown: number;
  benchmark?: number;
}