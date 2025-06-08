# Quant Portfolio Simulator with Risk Controls

A comprehensive React-based portfolio backtesting application with advanced risk management features. Built with TypeScript, Tailwind CSS, and Recharts for professional-grade financial analysis.

## 🚀 Features

### Portfolio Management

- **Multi-Asset Support**: Configure portfolios with stocks (AAPL, MSFT, GOOGL, etc.) and cryptocurrencies (BTC, ETH)
- **Date Range Selection**: Backtest strategies across custom time periods
- **Capital Management**: Set initial capital with flexible position sizing

### Trading Strategies

- **Equal Weight**: Maintains balanced allocations with periodic rebalancing
- **Momentum**: Buys assets with strong positive momentum, sells underperformers
- **Mean Reversion**: Contrarian strategy buying oversold assets and selling overbought ones

### Risk Controls

- **Maximum Drawdown**: Automatic position liquidation when losses exceed threshold
- **Volatility Capping**: Dynamic position sizing during high volatility periods
- **Stop Loss**: Final protection against catastrophic portfolio losses

### Analytics & Visualization

- **Interactive Charts**: Portfolio value, returns, and drawdown visualization
- **Performance Metrics**: Sharpe ratio, max drawdown, win rate, alpha, beta
- **Trade History**: Detailed log with filtering, sorting, and CSV export
- **Real-time Updates**: Live performance tracking during simulation

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for interactive financial visualizations
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and building
- **Date Handling**: date-fns for robust date operations

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AssetInput.tsx      # Ticker input and portfolio configuration
│   ├── StrategySelector.tsx # Trading strategy selection
│   ├── RiskControls.tsx    # Risk management parameters
│   ├── PortfolioChart.tsx  # Interactive performance charts
│   ├── TradeLog.tsx        # Trade history table
│   └── MetricsDashboard.tsx # Performance metrics display
├── hooks/               # Custom React hooks
│   └── useSimulation.ts    # Simulation state management
├── services/            # Data and business logic
│   ├── yfinance.ts         # Mock financial data service
│   └── simulation.ts       # Portfolio simulation engine
├── types/               # TypeScript interfaces
│   └── index.ts            # Core type definitions
├── utils/               # Helper functions
│   └── calculations.ts     # Financial calculations
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quant-portfolio-simulator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📊 Usage Guide

### 1. Portfolio Configuration

- **Add Assets**: Enter ticker symbols (AAPL, MSFT, BTC, etc.)
- **Set Timeframe**: Choose start and end dates for backtesting
- **Initial Capital**: Set starting portfolio value ($1,000 - $10,000,000)

### 2. Strategy Selection

- **Equal Weight**: Best for diversified, low-maintenance portfolios
- **Momentum**: Suitable for trending markets and growth-focused strategies
- **Mean Reversion**: Effective in ranging markets with high volatility

### 3. Risk Management

- **Max Drawdown (5-50%)**: Portfolio liquidation trigger
- **Volatility Cap (10-100%)**: Position sizing adjustment threshold
- **Stop Loss (5-50%)**: Absolute loss limit from initial capital

### 4. Running Simulations

- Click "Run Simulation" to start backtesting
- Monitor real-time progress and results
- Export trade history as CSV for external analysis

## 🔧 Customization

### Adding New Assets

Update `src/services/yfinance.ts`:

```typescript
const MOCK_ASSETS: Record<string, Asset> = {
  YOUR_TICKER: {
    ticker: "YOUR_TICKER",
    name: "Your Asset Name",
    price: 100.0,
    change: 1.5,
    changePercent: 1.52,
  },
  // ... existing assets
};
```

### Creating Custom Strategies

Extend `src/services/simulation.ts`:

```typescript
case 'your-strategy':
  // Implement your trading logic
  for (const ticker of this.config.tickers) {
    // Generate buy/sell signals
    signals.push({
      ticker,
      action: 'BUY' | 'SELL',
      weight: 0.2,
      reason: 'Your strategy reason'
    });
  }
  break;
```

### Integrating Real Data

Replace mock service in `src/services/yfinance.ts` with actual API calls:

```typescript
export async function fetchHistoricalData(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<HistoricalPrice[]> {
  // Replace with real API integration
  const response = await fetch(`your-api-endpoint/${ticker}`);
  return await response.json();
}
```

## 📈 Performance Metrics

- **Total Return**: Overall portfolio performance percentage
- **Sharpe Ratio**: Risk-adjusted returns measurement
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Win Rate**: Percentage of profitable trades
- **Volatility**: Annualized price volatility
- **Alpha**: Excess return versus benchmark
- **Beta**: Portfolio correlation with market

## 🔒 Risk Management

The simulator implements multiple layers of risk control:

1. **Position Sizing**: Automatic adjustment based on volatility
2. **Drawdown Protection**: Portfolio liquidation triggers
3. **Stop Loss Orders**: Individual position protection
4. **Correlation Analysis**: Portfolio diversification monitoring

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository
2. Deploy with default settings
3. Environment variables (if needed): None for mock data

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy from GitHub or drag-and-drop

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This simulator is for educational and research purposes only. Past performance does not guarantee future results. Always consult with financial professionals before making investment decisions.

## 🔮 Future Enhancements

- [ ] Real-time data integration
- [ ] Machine learning strategy optimization
- [ ] Options and derivatives support
- [ ] Portfolio optimization algorithms
- [ ] Advanced risk metrics (VaR, CVaR)
- [ ] Multi-timeframe analysis
- [ ] Backtesting API for external integration

---
