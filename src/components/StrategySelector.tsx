import { TrendingUp, RotateCcw, BarChart3 } from "lucide-react";

interface StrategySelectorProps {
  selectedStrategy: string;
  onStrategyChange: (strategyId: string) => void;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
}

const STRATEGIES: Strategy[] = [
  {
    id: "equal-weight",
    name: "Equal Weight",
    description:
      "Allocates equal weight to all assets and rebalances periodically to maintain target allocations.",
  },
  {
    id: "momentum",
    name: "Momentum",
    description:
      "Buys assets showing strong positive price momentum and sells those with negative momentum.",
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description:
      "Buys assets that are significantly below their recent average price and sells those above.",
  },
];

const STRATEGY_ICONS = {
  "equal-weight": BarChart3,
  momentum: TrendingUp,
  "mean-reversion": RotateCcw,
};

/**
 * Strategy Selector Component (Dark Theme)
 * Allows users to choose between different trading strategies
 */
export function StrategySelector({
  selectedStrategy,
  onStrategyChange,
}: StrategySelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Trading Strategy
      </h2>

      <div className="space-y-3">
        {STRATEGIES.map((strategy) => {
          const IconComponent =
            STRATEGY_ICONS[strategy.id as keyof typeof STRATEGY_ICONS];
          const isSelected = selectedStrategy === strategy.id;

          return (
            <div
              key={strategy.id}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 shadow-md"
                    : "border-slate-600 bg-slate-700 hover:border-slate-500 hover:bg-slate-600/50"
                }
              `}
              onClick={() => onStrategyChange(strategy.id)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`
                  p-2 rounded-lg flex-shrink-0
                  ${
                    isSelected
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-slate-600 text-slate-300"
                  }
                `}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3
                      className={`
                      font-medium text-base
                      ${isSelected ? "text-blue-300" : "text-slate-100"}
                    `}
                    >
                      {strategy.name}
                    </h3>

                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <p
                    className={`
                    mt-1 text-sm leading-5
                    ${isSelected ? "text-blue-200" : "text-slate-400"}
                  `}
                  >
                    {strategy.description}
                  </p>
                </div>
              </div>

              {/* Radio button indicator */}
              <div
                className={`
                absolute top-4 right-4 h-4 w-4 rounded-full border-2 flex items-center justify-center
                ${
                  isSelected
                    ? "border-blue-400 bg-blue-400"
                    : "border-slate-500 bg-slate-700"
                }
              `}
              >
                {isSelected && (
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
        <p className="text-xs text-slate-300">
          <strong className="text-slate-200">Note:</strong> All strategies
          include basic risk management. Performance will vary based on market
          conditions and selected risk controls.
        </p>
      </div>
    </div>
  );
}
