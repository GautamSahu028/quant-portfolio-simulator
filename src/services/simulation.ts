import {
  SimulationConfig,
  SimulationResult,
  Trade,
  Portfolio,
  PerformanceMetrics,
  ChartDataPoint,
  HistoricalPrice,
} from "../types";
import { fetchHistoricalData } from "./yfinance";
// import { format, parseISO } from "date-fns";

/**
 * Portfolio simulation engine with strategy execution and risk controls
 */

export class PortfolioSimulator {
  private config: SimulationConfig;
  private historicalData: Record<string, HistoricalPrice[]> = {};
  private portfolio: Portfolio;
  private trades: Trade[] = [];

  constructor(config: SimulationConfig) {
    this.config = config;
    this.portfolio = {
      assets: {},
      cash: config.initialCapital,
      totalValue: config.initialCapital,
      dailyReturns: [],
      dates: [],
      values: [config.initialCapital],
    };
  }

  /**
   * Run the complete simulation
   */
  async simulate(): Promise<SimulationResult> {
    // Fetch historical data for all tickers
    await this.loadHistoricalData();

    // Get common trading dates
    const tradingDates = this.getTradingDates();

    // Run daily simulation
    for (let i = 0; i < tradingDates.length; i++) {
      const date = tradingDates[i];
      await this.simulateDay(date, i);

      // Apply risk controls
      this.applyRiskControls(date);
    }

    // Calculate performance metrics
    const metrics = this.calculateMetrics();

    // Generate chart data
    const chartData = this.generateChartData();

    return {
      portfolio: this.portfolio,
      trades: this.trades,
      metrics,
      chartData,
    };
  }

  private async loadHistoricalData(): Promise<void> {
    const promises = this.config.tickers.map(async (ticker) => {
      const data = await fetchHistoricalData(
        ticker,
        this.config.startDate,
        this.config.endDate
      );
      this.historicalData[ticker] = data;
    });

    await Promise.all(promises);
  }

  private getTradingDates(): string[] {
    const allDates = Object.values(this.historicalData)
      .flat()
      .map((d) => d.date);

    return [...new Set(allDates)].sort();
  }

  private async simulateDay(date: string, dayIndex: number): Promise<void> {
    // Get prices for all assets on this date
    const prices: Record<string, number> = {};
    for (const ticker of this.config.tickers) {
      const dayData = this.historicalData[ticker]?.find((d) => d.date === date);
      if (dayData) {
        prices[ticker] = dayData.close;
      }
    }

    // Execute strategy
    const signals = this.generateSignals(date, dayIndex, prices);

    // Execute trades based on signals
    for (const signal of signals) {
      this.executeTrade(signal, date, prices[signal.ticker]);
    }

    // Update portfolio value
    this.updatePortfolioValue(date, prices);
  }

  private generateSignals(
    date: string,
    dayIndex: number,
    prices: Record<string, number>
  ): Array<{
    ticker: string;
    action: "BUY" | "SELL";
    weight?: number;
    reason: string;
  }> {
    const signals: Array<{
      ticker: string;
      action: "BUY" | "SELL";
      weight?: number;
      reason: string;
    }> = [];

    switch (this.config.strategy) {
      case "equal-weight":
        if (dayIndex === 0) {
          // Initial equal weight allocation
          const weightPerAsset = 1 / this.config.tickers.length;
          for (const ticker of this.config.tickers) {
            signals.push({
              ticker,
              action: "BUY",
              weight: weightPerAsset,
              reason: "Initial equal weight allocation",
            });
          }
        } else if (dayIndex % 20 === 0) {
          // Rebalance every 20 days
          // Rebalancing logic
          const targetWeight = 1 / this.config.tickers.length;
          for (const ticker of this.config.tickers) {
            const currentValue =
              (this.portfolio.assets[ticker] || 0) * prices[ticker];
            const currentWeight = currentValue / this.portfolio.totalValue;

            if (Math.abs(currentWeight - targetWeight) > 0.05) {
              signals.push({
                ticker,
                action: currentWeight > targetWeight ? "SELL" : "BUY",
                weight: targetWeight,
                reason: "Rebalancing to equal weights",
              });
            }
          }
        }
        break;

      case "momentum":
        if (dayIndex >= 20) {
          // Simple momentum strategy - buy winners, sell losers
          for (const ticker of this.config.tickers) {
            const recent = this.getRecentPrices(ticker, date, 20);
            if (recent.length >= 20) {
              const momentum =
                (recent[recent.length - 1] - recent[0]) / recent[0];

              if (momentum > 0.05 && !(ticker in this.portfolio.assets)) {
                signals.push({
                  ticker,
                  action: "BUY",
                  weight: 0.2,
                  reason: `Strong momentum: ${(momentum * 100).toFixed(1)}%`,
                });
              } else if (momentum < -0.05 && ticker in this.portfolio.assets) {
                signals.push({
                  ticker,
                  action: "SELL",
                  reason: `Negative momentum: ${(momentum * 100).toFixed(1)}%`,
                });
              }
            }
          }
        }
        break;

      case "mean-reversion":
        if (dayIndex >= 20) {
          // Mean reversion strategy
          for (const ticker of this.config.tickers) {
            const recent = this.getRecentPrices(ticker, date, 20);
            if (recent.length >= 20) {
              const currentPrice = prices[ticker];
              const average = recent.reduce((a, b) => a + b, 0) / recent.length;
              const deviation = (currentPrice - average) / average;

              if (deviation < -0.1 && !(ticker in this.portfolio.assets)) {
                signals.push({
                  ticker,
                  action: "BUY",
                  weight: 0.2,
                  reason: `Oversold: ${(deviation * 100).toFixed(
                    1
                  )}% below average`,
                });
              } else if (deviation > 0.1 && ticker in this.portfolio.assets) {
                signals.push({
                  ticker,
                  action: "SELL",
                  reason: `Overbought: ${(deviation * 100).toFixed(
                    1
                  )}% above average`,
                });
              }
            }
          }
        }
        break;
    }

    return signals;
  }

  private getRecentPrices(
    ticker: string,
    currentDate: string,
    days: number
  ): number[] {
    const data = this.historicalData[ticker] || [];
    const currentIndex = data.findIndex((d) => d.date === currentDate);

    if (currentIndex < days - 1) return [];

    return data
      .slice(Math.max(0, currentIndex - days + 1), currentIndex + 1)
      .map((d) => d.close);
  }

  private executeTrade(
    signal: {
      ticker: string;
      action: "BUY" | "SELL";
      weight?: number;
      reason: string;
    },
    date: string,
    price: number
  ): void {
    let quantity = 0;
    let value = 0;

    if (signal.action === "BUY") {
      const targetValue = signal.weight
        ? this.portfolio.totalValue * signal.weight
        : Math.min(this.portfolio.cash * 0.2, 10000);
      quantity = Math.floor(targetValue / price);
      value = quantity * price;

      if (quantity > 0 && value <= this.portfolio.cash) {
        this.portfolio.assets[signal.ticker] =
          (this.portfolio.assets[signal.ticker] || 0) + quantity;
        this.portfolio.cash -= value;

        this.trades.push({
          id: `${date}-${signal.ticker}-${Date.now()}`,
          date,
          ticker: signal.ticker,
          action: "BUY",
          quantity,
          price,
          value,
          reason: signal.reason,
        });
      }
    } else if (signal.action === "SELL") {
      quantity = this.portfolio.assets[signal.ticker] || 0;
      value = quantity * price;

      if (quantity > 0) {
        delete this.portfolio.assets[signal.ticker];
        this.portfolio.cash += value;

        this.trades.push({
          id: `${date}-${signal.ticker}-${Date.now()}`,
          date,
          ticker: signal.ticker,
          action: "SELL",
          quantity,
          price,
          value,
          reason: signal.reason,
        });
      }
    }
  }

  private updatePortfolioValue(
    date: string,
    prices: Record<string, number>
  ): void {
    let totalValue = this.portfolio.cash;

    for (const [ticker, quantity] of Object.entries(this.portfolio.assets)) {
      totalValue += quantity * (prices[ticker] || 0);
    }

    const previousValue = this.portfolio.totalValue;
    this.portfolio.totalValue = totalValue;
    this.portfolio.values.push(totalValue);
    this.portfolio.dates.push(date);

    const dailyReturn = (totalValue - previousValue) / previousValue;
    this.portfolio.dailyReturns.push(dailyReturn);
  }

  private applyRiskControls(date: string): void {
    const currentDrawdown = this.calculateCurrentDrawdown();

    // Max drawdown control
    if (currentDrawdown > this.config.riskControls.maxDrawdown / 100) {
      this.liquidateAll(date, "Max drawdown exceeded");
    }

    // Stop loss control
    const initialValue = this.portfolio.values[0];
    const currentLoss =
      (initialValue - this.portfolio.totalValue) / initialValue;

    if (currentLoss > this.config.riskControls.stopLoss / 100) {
      this.liquidateAll(date, "Stop loss triggered");
    }
  }

  private calculateCurrentDrawdown(): number {
    const values = this.portfolio.values;
    if (values.length < 2) return 0;

    const peak = Math.max(...values);
    const current = values[values.length - 1];

    return (peak - current) / peak;
  }

  private liquidateAll(date: string, reason: string): void {
    console.log(`Liquidating all positions on ${date} due to ${reason}`);
    this.portfolio.assets = {};
    this.portfolio.totalValue = this.portfolio.cash;
  }

  private calculateMetrics(): PerformanceMetrics {
    const returns = this.portfolio.dailyReturns;
    const initialValue = this.portfolio.values[0];
    const finalValue = this.portfolio.totalValue;

    const totalReturn = (finalValue - initialValue) / initialValue;
    const volatility = this.calculateVolatility(returns);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const maxDrawdown = this.calculateMaxDrawdown();
    const winRate = this.calculateWinRate();

    return {
      totalReturn,
      sharpeRatio,
      maxDrawdown,
      winRate,
      volatility,
      alpha: 0.02, // Simplified
      beta: 1.1, // Simplified
    };
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((acc, ret) => acc + Math.pow(ret - mean, 2), 0) /
      returns.length;

    return Math.sqrt(variance) * Math.sqrt(252); // Annualized
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;

    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const volatility = this.calculateVolatility(returns) / Math.sqrt(252); // Daily vol
    const riskFreeRate = 0.02 / 252; // Assume 2% annual risk-free rate

    return volatility > 0 ? (meanReturn - riskFreeRate) / volatility : 0;
  }

  private calculateMaxDrawdown(): number {
    const values = this.portfolio.values;
    let maxDrawdown = 0;
    let peak = values[0];

    for (const value of values) {
      if (value > peak) {
        peak = value;
      }

      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private calculateWinRate(): number {
    if (this.trades.length === 0) return 0;

    const sellTrades = this.trades.filter((t) => t.action === "SELL");
    const winningTrades = sellTrades.filter((trade) => {
      const buyTrade = this.trades.find(
        (t) =>
          t.ticker === trade.ticker && t.action === "BUY" && t.date < trade.date
      );
      return buyTrade && trade.price > buyTrade.price;
    });

    return sellTrades.length > 0 ? winningTrades.length / sellTrades.length : 0;
  }

  private generateChartData(): ChartDataPoint[] {
    return this.portfolio.dates.map((date, index) => {
      const value = this.portfolio.values[index + 1]; // +1 because values includes initial value
      const peak = Math.max(...this.portfolio.values.slice(0, index + 2));
      const drawdown = value < peak ? (peak - value) / peak : 0;

      return {
        date,
        value,
        drawdown: drawdown * 100,
        benchmark: this.config.initialCapital * (1 + 0.0003 * index), // Simple benchmark
      };
    });
  }
}

/**
 * Run portfolio simulation with given configuration
 */
export async function runSimulation(
  config: SimulationConfig
): Promise<SimulationResult> {
  const simulator = new PortfolioSimulator(config);
  return await simulator.simulate();
}
