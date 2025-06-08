import { HistoricalPrice, Asset } from '../types';
import { addDays, format, parseISO, isWeekend } from 'date-fns';

/**
 * Mock financial data service simulating Yahoo Finance API
 * In production, replace with actual API calls
 */

const MOCK_ASSETS: Record<string, Asset> = {
  'AAPL': { ticker: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35 },
  'MSFT': { ticker: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: -1.23, changePercent: -0.32 },
  'GOOGL': { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 0.89, changePercent: 0.63 },
  'TSLA': { ticker: 'TSLA', name: 'Tesla Inc.', price: 248.91, change: 12.45, changePercent: 5.26 },
  'NVDA': { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 15.67, changePercent: 1.82 },
  'AMZN': { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: -2.11, changePercent: -1.37 },
  'META': { ticker: 'META', name: 'Meta Platforms Inc.', price: 484.20, change: 8.93, changePercent: 1.88 },
  'BTC': { ticker: 'BTC', name: 'Bitcoin', price: 67845.32, change: 1234.56, changePercent: 1.85 },
  'ETH': { ticker: 'ETH', name: 'Ethereum', price: 3456.78, change: -123.45, changePercent: -3.44 },
};

/**
 * Generate realistic historical price data using geometric Brownian motion
 */
function generateHistoricalData(
  ticker: string, 
  startDate: string, 
  endDate: string
): HistoricalPrice[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const data: HistoricalPrice[] = [];
  
  const asset = MOCK_ASSETS[ticker];
  if (!asset) {
    throw new Error(`Unknown ticker: ${ticker}`);
  }

  let currentPrice = asset.price * 0.8; // Start at 80% of current price
  let currentDate = start;

  // Parameters for price simulation
  const volatility = ticker === 'BTC' ? 0.05 : ticker === 'TSLA' ? 0.04 : 0.02;
  const drift = 0.0003; // Small positive drift

  while (currentDate <= end) {
    if (!isWeekend(currentDate)) {
      // Generate random price movement using geometric Brownian motion
      const randomShock = (Math.random() - 0.5) * 2;
      const priceChange = currentPrice * (drift + volatility * randomShock);
      
      const open = currentPrice;
      const change = priceChange;
      const close = open + change;
      
      // Generate high/low with some randomness
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      
      const volume = Math.floor(Math.random() * 10000000) + 1000000;

      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume
      });

      currentPrice = close;
    }
    
    currentDate = addDays(currentDate, 1);
  }

  return data;
}

/**
 * Fetch historical price data for a ticker
 */
export async function fetchHistoricalData(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<HistoricalPrice[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  try {
    return generateHistoricalData(ticker, startDate, endDate);
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
}

/**
 * Get current asset information
 */
export async function fetchAssetInfo(ticker: string): Promise<Asset> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const asset = MOCK_ASSETS[ticker];
  if (!asset) {
    throw new Error(`Unknown ticker: ${ticker}`);
  }
  
  return asset;
}

/**
 * Validate if a ticker exists
 */
export function isValidTicker(ticker: string): boolean {
  return ticker in MOCK_ASSETS;
}

/**
 * Get all available tickers
 */
export function getAvailableTickers(): string[] {
  return Object.keys(MOCK_ASSETS);
}