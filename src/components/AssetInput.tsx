import React, { useState, useCallback } from "react";
import { Plus, X, Search, AlertCircle, DollarSign } from "lucide-react";

interface AssetInputProps {
  tickers: string[];
  onTickersChange: (tickers: string[]) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  initialCapital: number;
  onInitialCapitalChange: (capital: number) => void;
}

// Mock ticker validation and suggestions for demo
const isValidTicker = (ticker: string) => {
  const commonTickers = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "META",
    "NVDA",
    "NFLX",
    "BRK.B",
    "JNJ",
    "V",
    "WMT",
    "PG",
    "DIS",
    "HD",
    "BAC",
    "UNH",
    "MA",
    "XOM",
    "CVX",
  ];
  return commonTickers.includes(ticker.toUpperCase());
};

const getAvailableTickers = () => {
  return [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "META",
    "NVDA",
    "NFLX",
    "BRK.B",
    "JNJ",
    "V",
    "WMT",
    "PG",
    "DIS",
    "HD",
    "BAC",
    "UNH",
    "MA",
    "XOM",
    "CVX",
  ];
};

/**
 * Asset Input Form Component (Dark Theme)
 * Handles ticker input, date selection, and initial capital
 */
export function AssetInput({
  tickers,
  onTickersChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  initialCapital,
  onInitialCapitalChange,
}: AssetInputProps) {
  const [newTicker, setNewTicker] = useState("");
  const [tickerError, setTickerError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableTickers = getAvailableTickers();
  const suggestions = availableTickers.filter(
    (ticker) =>
      ticker.toLowerCase().includes(newTicker.toLowerCase()) &&
      !tickers.includes(ticker)
  );

  const handleAddTicker = useCallback(() => {
    const ticker = newTicker.toUpperCase().trim();

    if (!ticker) {
      setTickerError("Please enter a ticker symbol");
      return;
    }

    if (tickers.includes(ticker)) {
      setTickerError("Ticker already added");
      return;
    }

    if (!isValidTicker(ticker)) {
      setTickerError("Invalid ticker symbol");
      return;
    }

    onTickersChange([...tickers, ticker]);
    setNewTicker("");
    setTickerError("");
    setShowSuggestions(false);
  }, [newTicker, tickers, onTickersChange]);

  const handleRemoveTicker = useCallback(
    (tickerToRemove: string) => {
      onTickersChange(tickers.filter((ticker) => ticker !== tickerToRemove));
    },
    [tickers, onTickersChange]
  );

  const handleTickerInputChange = (value: string) => {
    setNewTicker(value);
    setTickerError("");
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (ticker: string) => {
    setNewTicker(ticker);
    setShowSuggestions(false);
    // Auto-add the ticker
    onTickersChange([...tickers, ticker]);
    setNewTicker("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTicker();
    }
  };

  // Get today's date for max date constraints
  const today = new Date().toISOString().split("T")[0];
  const minDate = "1980-01-01";

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-slate-100">
          Portfolio Configuration
        </h2>
      </div>

      {/* Ticker Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Asset Tickers
          </label>

          <div className="relative">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTicker}
                  onChange={(e) => handleTickerInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter ticker (e.g., AAPL, MSFT)"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-100 placeholder-slate-400"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.slice(0, 6).map((ticker) => (
                      <button
                        key={ticker}
                        type="button"
                        onClick={() => handleSuggestionClick(ticker)}
                        className="w-full px-4 py-2 text-left text-slate-100 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none transition-colors"
                      >
                        {ticker}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddTicker}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            {tickerError && (
              <div className="flex items-center space-x-1 mt-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{tickerError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Tickers */}
        {tickers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Selected Assets ({tickers.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker) => (
                <div
                  key={ticker}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span>{ticker}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTicker(ticker)}
                    className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date Range Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={minDate}
            max={endDate || today}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || minDate}
            max={today}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-100"
          />
        </div>
      </div>

      {/* Initial Capital Section */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Initial Capital
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="number"
            value={initialCapital}
            onChange={(e) => onInitialCapitalChange(Number(e.target.value))}
            min="1000"
            max="10000000"
            step="1000"
            placeholder="100000"
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-100 placeholder-slate-400"
          />
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Minimum: $1,000 | Maximum: $10,000,000
        </p>
      </div>
    </div>
  );
}
