import { PerformanceMetrics } from "../types";
import { formatPercent, formatCurrency } from "../utils/calculations";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Zap,
  BarChart3,
  DollarSign,
  Percent,
} from "lucide-react";

interface MetricsDashboardProps {
  metrics: PerformanceMetrics;
  initialCapital: number;
  finalValue: number;
}

/**
 * Performance Metrics Dashboard Component
 * Displays key portfolio performance indicators
 */
export function MetricsDashboard({
  metrics,
  initialCapital,
  finalValue,
}: MetricsDashboardProps) {
  const totalPnL = finalValue - initialCapital;
  const totalPnLPercent = (totalPnL / initialCapital) * 100;

  const metricItems = [
    {
      label: "Total Return",
      value: formatPercent(metrics.totalReturn),
      rawValue: metrics.totalReturn,
      icon: TrendingUp,
      description: "Overall portfolio performance",
      type: "return",
    },
    {
      label: "Total P&L",
      value: formatCurrency(totalPnL),
      rawValue: totalPnL,
      icon: DollarSign,
      description: "Absolute profit/loss",
      type: "currency",
    },
    {
      label: "Sharpe Ratio",
      value: metrics.sharpeRatio.toFixed(2),
      rawValue: metrics.sharpeRatio,
      icon: Target,
      description: "Risk-adjusted returns",
      type: "ratio",
    },
    {
      label: "Max Drawdown",
      value: formatPercent(metrics.maxDrawdown),
      rawValue: metrics.maxDrawdown,
      icon: TrendingDown,
      description: "Largest peak-to-trough decline",
      type: "drawdown",
    },
    {
      label: "Volatility",
      value: formatPercent(metrics.volatility),
      rawValue: metrics.volatility,
      icon: Activity,
      description: "Annualized price volatility",
      type: "volatility",
    },
    {
      label: "Win Rate",
      value: formatPercent(metrics.winRate),
      rawValue: metrics.winRate,
      icon: Percent,
      description: "Percentage of profitable trades",
      type: "winrate",
    },
    {
      label: "Alpha",
      value: formatPercent(metrics.alpha),
      rawValue: metrics.alpha,
      icon: Zap,
      description: "Excess return vs benchmark",
      type: "alpha",
    },
    {
      label: "Beta",
      value: metrics.beta.toFixed(2),
      rawValue: metrics.beta,
      icon: BarChart3,
      description: "Correlation with market",
      type: "beta",
    },
  ];

  const getMetricColor = (type: string, value: number) => {
    switch (type) {
      case "return":
      case "currency":
        return value >= 0 ? "green" : "red";
      case "drawdown":
        return value <= 0.1 ? "green" : value <= 0.2 ? "yellow" : "red";
      case "ratio":
        return value >= 1 ? "green" : value >= 0.5 ? "yellow" : "red";
      case "volatility":
        return value <= 0.15 ? "green" : value <= 0.25 ? "yellow" : "red";
      case "winrate":
        return value >= 0.6 ? "green" : value >= 0.4 ? "yellow" : "red";
      case "alpha":
        return value >= 0 ? "green" : "red";
      case "beta":
        return Math.abs(value - 1) <= 0.2 ? "green" : "yellow";
      default:
        return "gray";
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: "bg-green-900/20",
        border: "border-green-700/50",
        icon: "text-green-400 bg-green-900/30",
        value: "text-green-300",
        label: "text-green-200",
      },
      red: {
        bg: "bg-red-900/20",
        border: "border-red-700/50",
        icon: "text-red-400 bg-red-900/30",
        value: "text-red-300",
        label: "text-red-200",
      },
      yellow: {
        bg: "bg-yellow-900/20",
        border: "border-yellow-700/50",
        icon: "text-yellow-400 bg-yellow-900/30",
        value: "text-yellow-300",
        label: "text-yellow-200",
      },
      gray: {
        bg: "bg-slate-800/50",
        border: "border-slate-700/50",
        icon: "text-slate-400 bg-slate-700/30",
        value: "text-slate-300",
        label: "text-slate-200",
      },
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricItems.map((metric) => {
          const IconComponent = metric.icon;
          const color = getMetricColor(metric.type, metric.rawValue);
          const colorClasses = getColorClasses(color);

          return (
            <div
              key={metric.label}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                ${colorClasses.bg} ${colorClasses.border}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className={`inline-flex p-2 rounded-lg mb-3 ${colorClasses.icon}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <h3
                    className={`text-sm font-medium mb-1 ${colorClasses.label}`}
                  >
                    {metric.label}
                  </h3>

                  <p
                    className={`text-2xl font-bold mb-2 ${colorClasses.value}`}
                  >
                    {metric.value}
                  </p>

                  <p className="text-xs text-slate-400">{metric.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <h3 className="font-medium text-slate-200 mb-3">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Initial Capital:</span>
            <span className="ml-2 font-medium text-slate-200">
              {formatCurrency(initialCapital)}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Final Value:</span>
            <span className="ml-2 font-medium text-slate-200">
              {formatCurrency(finalValue)}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Return:</span>
            <span
              className={`ml-2 font-medium ${
                totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {totalPnL >= 0 ? "+" : ""}
              {formatPercent(totalPnLPercent / 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
