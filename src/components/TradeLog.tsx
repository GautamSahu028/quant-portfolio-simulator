import React, { useState, useMemo } from 'react';
import { Trade } from '../types';
import { formatCurrency } from '../utils/calculations';
import { ArrowUpRight, ArrowDownLeft, Filter, Download } from 'lucide-react';

interface TradeLogProps {
  trades: Trade[];
}

type FilterType = 'all' | 'buy' | 'sell';
type SortField = 'date' | 'ticker' | 'value';
type SortDirection = 'asc' | 'desc';

/**
 * Trade Log Table Component
 * Displays filterable and sortable trade history
 */
export function TradeLog({ trades }: TradeLogProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTicker, setSearchTicker] = useState('');

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades;

    // Apply filters
    if (filter !== 'all') {
      filtered = filtered.filter(trade => trade.action.toLowerCase() === filter);
    }

    if (searchTicker) {
      filtered = filtered.filter(trade => 
        trade.ticker.toLowerCase().includes(searchTicker.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'ticker':
          comparison = a.ticker.localeCompare(b.ticker);
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [trades, filter, sortField, sortDirection, searchTicker]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Ticker', 'Action', 'Quantity', 'Price', 'Value', 'Reason'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedTrades.map(trade => [
        trade.date,
        trade.ticker,
        trade.action,
        trade.quantity,
        trade.price,
        trade.value,
        `"${trade.reason}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (trades.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trade Log</h2>
        <div className="text-center py-8 text-gray-500">
          <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No trades executed yet</p>
          <p className="text-sm">Run a simulation to see trade history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
          Trade Log ({filteredAndSortedTrades.length} trades)
        </h2>
        
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex space-x-2">
          {(['all', 'buy', 'sell'] as FilterType[]).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search ticker..."
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Trade Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('date')}
              >
                Date {getSortIcon('date')}
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('ticker')}
              >
                Ticker {getSortIcon('ticker')}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Quantity</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('value')}
              >
                Value {getSortIcon('value')}
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">
                  {new Date(trade.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{trade.ticker}</span>
                </td>
                <td className="py-3 px-4">
                  <div className={`
                    inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                    ${trade.action === 'BUY' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {trade.action === 'BUY' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownLeft className="h-3 w-3" />
                    )}
                    <span>{trade.action}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-900">
                  {trade.quantity.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-900">
                  {formatCurrency(trade.price)}
                </td>
                <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(trade.value)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                  {trade.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedTrades.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No trades match the current filters</p>
        </div>
      )}
    </div>
  );
}