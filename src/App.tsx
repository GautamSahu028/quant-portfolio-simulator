import React, { useState } from 'react';
import { AssetInput } from './components/AssetInput';
import { StrategySelector } from './components/StrategySelector';
import { RiskControls } from './components/RiskControls';
import { PortfolioChart } from './components/PortfolioChart';
import { TradeLog } from './components/TradeLog';
import { MetricsDashboard } from './components/MetricsDashboard';
import { useSimulation } from './hooks/useSimulation';
import { SimulationConfig, RiskControls as RiskControlsType } from './types';
import { Play, RotateCcw, Loader2, AlertCircle, TrendingUp } from 'lucide-react';

/**
 * Main Application Component
 * Quant Portfolio Simulator with Risk Controls
 */
function App() {
  // Form state
  const [tickers, setTickers] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL']);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCapital, setInitialCapital] = useState(100000);
  const [selectedStrategy, setSelectedStrategy] = useState('equal-weight');
  const [riskControls, setRiskControls] = useState<RiskControlsType>({
    maxDrawdown: 20,
    volatilityCap: 25,
    stopLoss: 15
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
      riskControls
    };

    await runSimulation(config);
  };

  const canRunSimulation = tickers.length > 0 && startDate && endDate && initialCapital > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quant Portfolio Simulator
                </h1>
                <p className="text-sm text-gray-600">
                  Advanced backtesting with risk controls
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {result && (
                <button
                  onClick={reset}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              )}
              
              <button
                onClick={handleRunSimulation}
                disabled={!canRunSimulation || isRunning}
                className={`
                  flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all
                  ${canRunSimulation && !isRunning
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }
                `}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Configuration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
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
            
            <div className="space-y-6">
              <StrategySelector
                selectedStrategy={selectedStrategy}
                onStrategyChange={setSelectedStrategy}
              />
              
              <RiskControls
                riskControls={riskControls}
                onRiskControlsChange={setRiskControls}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-900">Simulation Error</h3>
              </div>
              <p className="mt-2 text-red-700">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Metrics Dashboard */}
              <MetricsDashboard
                metrics={result.metrics}
                initialCapital={initialCapital}
                finalValue={result.portfolio.totalValue}
              />

              {/* Portfolio Chart */}
              <PortfolioChart
                data={result.chartData}
                initialCapital={initialCapital}
              />

              {/* Trade Log */}
              <TradeLog trades={result.trades} />
            </div>
          )}

          {/* Loading State */}
          {isRunning && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Running Simulation...
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Fetching historical data, executing strategy, and calculating performance metrics. 
                  This may take a few moments.
                </p>
              </div>
            </div>
          )}

          {/* Welcome State */}
          {!result && !isRunning && !error && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center space-y-4">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Ready to Start
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Configure your portfolio parameters above and click "Run Simulation" to backtest 
                  your trading strategy with advanced risk controls. The simulator will fetch historical 
                  data, execute trades based on your chosen strategy, and provide comprehensive performance analytics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">1. Configure Assets</h4>
                    <p className="text-gray-600">Select tickers, date range, and initial capital</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">2. Choose Strategy</h4>
                    <p className="text-gray-600">Pick from Equal Weight, Momentum, or Mean Reversion</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">3. Set Risk Controls</h4>
                    <p className="text-gray-600">Configure drawdown limits and stop-loss levels</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;