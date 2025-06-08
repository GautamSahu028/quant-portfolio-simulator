import React from 'react';
import { Strategy } from '../types';
import { TrendingUp, RotateCcw, BarChart3 } from 'lucide-react';

interface StrategySelectorProps {
  selectedStrategy: string;
  onStrategyChange: (strategyId: string) => void;
}

const STRATEGIES: Strategy[] = [
  {
    id: 'equal-weight',
    name: 'Equal Weight',
    description: 'Allocates equal weight to all assets and rebalances periodically to maintain target allocations.'
  },
  {
    id: 'momentum',
    name: 'Momentum',
    description: 'Buys assets showing strong positive price momentum and sells those with negative momentum.'
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Buys assets that are significantly below their recent average price and sells those above.'
  }
];

const STRATEGY_ICONS = {
  'equal-weight': BarChart3,
  'momentum': TrendingUp,
  'mean-reversion': RotateCcw
};

/**
 * Strategy Selector Component
 * Allows users to choose between different trading strategies
 */
export function StrategySelector({ selectedStrategy, onStrategyChange }: StrategySelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Trading Strategy</h2>
      
      <div className="space-y-3">
        {STRATEGIES.map((strategy) => {
          const IconComponent = STRATEGY_ICONS[strategy.id as keyof typeof STRATEGY_ICONS];
          const isSelected = selectedStrategy === strategy.id;
          
          return (
            <div
              key={strategy.id}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
              onClick={() => onStrategyChange(strategy.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg flex-shrink-0
                  ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`
                      font-medium text-base
                      ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                    `}>
                      {strategy.name}
                    </h3>
                    
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <p className={`
                    mt-1 text-sm leading-5
                    ${isSelected ? 'text-blue-700' : 'text-gray-500'}
                  `}>
                    {strategy.description}
                  </p>
                </div>
              </div>
              
              {/* Radio button indicator */}
              <div className={`
                absolute top-4 right-4 h-4 w-4 rounded-full border-2 flex items-center justify-center
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 bg-white'
                }
              `}>
                {isSelected && (
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> All strategies include basic risk management. 
          Performance will vary based on market conditions and selected risk controls.
        </p>
      </div>
    </div>
  );
}