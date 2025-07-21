import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  TooltipProps,
} from "recharts";
import { ChartDataPoint } from "../types";
import { formatCurrency, formatPercent } from "../utils/calculations";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface PortfolioChartProps {
  data: ChartDataPoint[];
  initialCapital: number;
}

type ChartView = "value" | "returns" | "drawdown";

interface ExtendedChartDataPoint extends ChartDataPoint {
  returns: number;
  benchmarkReturns: number;
  drawdown: number;
  date: string;
}

/**
 * Interactive Portfolio Performance Chart with Dark Theme
 */
export function PortfolioChart({ data, initialCapital }: PortfolioChartProps) {
  const [activeView, setActiveView] = useState<ChartView>("value");

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-300">No data available</p>
          <p className="text-sm text-slate-400">
            Run a simulation to see portfolio performance
          </p>
        </div>
      </div>
    );
  }

  const chartData: ExtendedChartDataPoint[] = data.map((point) => ({
    ...point,
    returns: ((point.value - initialCapital) / initialCapital) * 100,
    benchmarkReturns: point.benchmark
      ? ((point.benchmark - initialCapital) / initialCapital) * 100
      : 0,
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ExtendedChartDataPoint;

      return (
        <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-lg">
          <p className="font-medium text-slate-100 mb-2">{label}</p>

          {activeView === "value" && (
            <>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-sm text-slate-200">
                  Portfolio: {formatCurrency(data.value)}
                </span>
              </div>
              {data.benchmark && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-slate-400 rounded" />
                  <span className="text-sm text-slate-200">
                    Benchmark: {formatCurrency(data.benchmark)}
                  </span>
                </div>
              )}
            </>
          )}

          {activeView === "returns" && (
            <>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-emerald-500 rounded" />
                <span className="text-sm text-slate-200">
                  Portfolio: {formatPercent(data.returns / 100, 2)}
                </span>
              </div>
              {data.benchmarkReturns && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-slate-400 rounded" />
                  <span className="text-sm text-slate-200">
                    Benchmark: {formatPercent(data.benchmarkReturns / 100, 2)}
                  </span>
                </div>
              )}
            </>
          )}

          {activeView === "drawdown" && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-sm text-slate-200">
                Drawdown: {formatPercent((data.drawdown ?? 0) / 100, 2)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const viewConfig = {
    value: {
      title: "Portfolio Value",
      icon: TrendingUp,
      color: "#3b82f6",
      yAxisFormatter: (value: number) => formatCurrency(value, 0),
    },
    returns: {
      title: "Cumulative Returns",
      icon: BarChart3,
      color: "#10b981",
      yAxisFormatter: (value: number) => `${value.toFixed(1)}%`,
    },
    drawdown: {
      title: "Drawdown",
      icon: TrendingDown,
      color: "#ef4444",
      yAxisFormatter: (value: number) => `${value.toFixed(1)}%`,
    },
  };

  const currentConfig = viewConfig[activeView];
  const IconComponent = currentConfig.icon;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with view switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <IconComponent className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-medium text-slate-100">
            {currentConfig.title}
          </h3>
        </div>

        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
          {Object.entries(viewConfig).map(([key, config]) => {
            const ViewIcon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveView(key as ChartView)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${
                    activeView === key
                      ? "bg-slate-700 text-blue-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }
                `}
              >
                <ViewIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {config.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart container */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === "drawdown" ? (
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={currentConfig.yAxisFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke={currentConfig.color}
                fill={currentConfig.color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </ComposedChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={currentConfig.yAxisFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#94a3b8" }} />

              <Line
                type="monotone"
                dataKey={activeView === "value" ? "value" : "returns"}
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={false}
                name="Portfolio"
                activeDot={{ r: 6, fill: currentConfig.color }}
              />

              {activeView === "value" && chartData[0]?.benchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Benchmark"
                />
              )}

              {activeView === "returns" && chartData[0]?.benchmarkReturns && (
                <Line
                  type="monotone"
                  dataKey="benchmarkReturns"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Benchmark"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
