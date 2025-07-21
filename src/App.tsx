import { useState } from "react";
import { AssetInput } from "./components/AssetInput";
import { StrategySelector } from "./components/StrategySelector";
import { RiskControls } from "./components/RiskControls";
import { PortfolioChart } from "./components/PortfolioChart";
import { TradeLog } from "./components/TradeLog";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { useSimulation } from "./hooks/useSimulation";
import { SimulationConfig, RiskControls as RiskControlsType } from "./types";
import {
  Play,
  RotateCcw,
  Loader2,
  AlertTriangle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

/**
 * Main Application Component
 * Professional Quant Portfolio Simulator
 */
function App() {
  // Form state
  const [tickers, setTickers] = useState<string[]>(["AAPL", "MSFT", "GOOGL"]);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");
  const [initialCapital, setInitialCapital] = useState(100000);
  const [selectedStrategy, setSelectedStrategy] = useState("equal-weight");
  const [riskControls, setRiskControls] = useState<RiskControlsType>({
    maxDrawdown: 20,
    volatilityCap: 25,
    stopLoss: 15,
  });

  // Simulation hook
  const { isRunning, result, error, runSimulation, reset } = useSimulation();

  const handleRunSimulation = async () => {
    if (tickers.length === 0) {
      return;
    }

    const config: SimulationConfig = {
      tickers,
      startDate,
      endDate,
      initialCapital,
      strategy: selectedStrategy,
      riskControls,
    };

    await runSimulation(config);
  };

  const canRunSimulation =
    tickers.length > 0 && startDate && endDate && initialCapital > 0;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-100">
              Portfolio Simulator
            </h1>
            <p className="text-xs text-slate-400">
              Quantitative Backtesting Platform
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {result && (
            <button
              onClick={reset}
              className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 rounded transition-colors"
            >
              <RotateCcw className="h-4 w-4 inline mr-2" />
              Reset
            </button>
          )}

          <button
            onClick={handleRunSimulation}
            disabled={!canRunSimulation || isRunning}
            className={`px-6 py-2 text-sm font-medium rounded transition-all ${
              canRunSimulation && !isRunning
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                Running Backtest...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 inline mr-2" />
                Run Backtest
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Increased width from w-80 to w-96 */}
        <aside className="w-1/4 bg-slate-900 border-r border-slate-800 overflow-y-auto shrink-0">
          <div className="p-6 space-y-6">
            {/* Asset Input Component */}
            <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
              <AssetInput
                tickers={tickers}
                onTickersChange={setTickers}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                initialCapital={initialCapital}
                onInitialCapitalChange={setInitialCapital}
              />
            </div>

            {/* Strategy Selector Component */}
            <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
              <StrategySelector
                selectedStrategy={selectedStrategy}
                onStrategyChange={setSelectedStrategy}
              />
            </div>

            {/* Risk Controls Component */}
            <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
              <RiskControls
                riskControls={riskControls}
                onRiskControlsChange={setRiskControls}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-6 bg-red-900/20 border border-red-800/50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-300">
                    Simulation Error
                  </h3>
                  <p className="text-xs text-red-200 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {result ? (
            <div className="h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Performance Metrics */}
                <div className="bg-slate-900 rounded-lg border border-slate-800">
                  <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-100">
                      Performance Overview
                    </h2>
                  </div>
                  <div className="p-6">
                    <MetricsDashboard
                      metrics={result.metrics}
                      initialCapital={initialCapital}
                      finalValue={result.portfolio.totalValue}
                    />
                  </div>
                </div>

                {/* Portfolio Chart */}
                <div className="bg-slate-900 rounded-lg border border-slate-800">
                  <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-100">
                      Portfolio Performance
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="h-96">
                      <PortfolioChart
                        data={result.chartData}
                        initialCapital={initialCapital}
                      />
                    </div>
                  </div>
                </div>

                {/* Trade History */}
                <div className="bg-slate-900 rounded-lg border border-slate-800">
                  <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-100">
                      Trade History
                    </h2>
                  </div>
                  <div className="p-6">
                    <TradeLog trades={result.trades} />
                  </div>
                </div>
              </div>
            </div>
          ) : isRunning ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <h3 className="text-lg font-medium text-slate-200">
                  Running Backtest
                </h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Fetching historical data and executing trading strategy...
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-6 max-w-lg">
                <div className="bg-slate-800 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    Ready to Backtest
                  </h3>
                  <p className="text-slate-400">
                    Configure your portfolio parameters and click "Run Backtest"
                    to analyze performance with advanced risk controls.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-left">
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-blue-400 text-sm font-medium mb-2">
                      1. Assets
                    </div>
                    <div className="text-slate-300 text-sm">
                      Configure tickers, dates, and capital
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-blue-400 text-sm font-medium mb-2">
                      2. Strategy
                    </div>
                    <div className="text-slate-300 text-sm">
                      Select trading strategy and risk controls
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-blue-400 text-sm font-medium mb-2">
                      3. Execute
                    </div>
                    <div className="text-slate-300 text-sm">
                      Run simulation and analyze results
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
