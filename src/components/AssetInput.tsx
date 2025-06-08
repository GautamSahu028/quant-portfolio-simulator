import React, { useState, useCallback } from 'react';
import { Plus, X, Search, AlertCircle } from 'lucide-react';
import { isValidTicker, getAvailableTickers } from '../services/yfinance';

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

/**
 * Asset Input Form Component
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
  onInitialCapitalChange
}: AssetInputProps) {
  const [newTicker, setNewTicker] = useState('');
  const [tickerError, setTickerError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const availableTickers = getAvailableTickers();
  const suggestions = availableTickers.filter(ticker => 
    ticker.toLowerCase().includes(newTicker.toLowerCase()) && 
    !tickers.includes(ticker)
  );

  const handleAddTicker = useCallback(() => {
    const ticker = newTicker.toUpperCase().trim();
    
    if (!ticker) {
      setTickerError('Please enter a ticker symbol');
      return;
    }

    if (tickers.includes(ticker)) {
      setTickerError('Ticker already added');
      return;
    }

    if (!isValidTicker(ticker)) {
      setTickerError('Invalid ticker symbol');
      return;
    }

    onTickersChange([...tickers, ticker]);
    setNewTicker('');
    setTickerError('');
    setShowSuggestions(false);
  }, [newTicker, tickers, onTickersChange]);

  const handleRemoveTicker = useCallback((tickerToRemove: string) => {
    onTickersChange(tickers.filter(ticker => ticker !== tickerToRemove));
  }, [tickers, onTickersChange]);

  const handleTickerInputChange = (value: string) => {
    setNewTicker(value);
    setTickerError('');
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (ticker: string) => {
    setNewTicker(ticker);
    setShowSuggestions(false);
    // Auto-add the ticker
    onTickersChange([...tickers, ticker]);
    setNewTicker('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTicker();
    }
  };

  // Get today's date for max date constraints
  const today = new Date().toISOString().split('T')[0];
  const minDate = '2020-01-01';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Portfolio Configuration</h2>
      </div>

      {/* Ticker Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  placeholder="Enter ticker (e.g., AAPL, MSFT, BTC)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.slice(0, 6).map((ticker) => (
                      <button
                        key={ticker}
                        type="button"
                        onClick={() => handleSuggestionClick(ticker)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
            
            {tickerError && (
              <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{tickerError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Tickers */}
        {tickers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Assets ({tickers.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker) => (
                <div
                  key={ticker}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span>{ticker}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTicker(ticker)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={minDate}
            max={endDate || today}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || minDate}
            max={today}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Initial Capital Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initial Capital
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={initialCapital}
            onChange={(e) => onInitialCapitalChange(Number(e.target.value))}
            min="1000"
            max="10000000"
            step="1000"
            placeholder="100000"
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Minimum: $1,000 | Maximum: $10,000,000
        </p>
      </div>
    </div>
  );
}