import { Shield, AlertTriangle, TrendingDown } from "lucide-react";

interface RiskControlsType {
  maxDrawdown: number;
  volatilityCap: number;
  stopLoss: number;
}

interface RiskControlsProps {
  riskControls: RiskControlsType;
  onRiskControlsChange: (controls: RiskControlsType) => void;
}

/**
 * Risk Controls Panel Component (Dark Theme)
 * Manages portfolio risk parameters
 */
export function RiskControls({
  riskControls,
  onRiskControlsChange,
}: RiskControlsProps) {
  const updateControl = (field: keyof RiskControlsType, value: number) => {
    onRiskControlsChange({
      ...riskControls,
      [field]: value,
    });
  };

  const riskItems = [
    {
      key: "maxDrawdown" as keyof RiskControlsType,
      label: "Max Drawdown",
      description: "Maximum allowed portfolio decline from peak",
      icon: TrendingDown,
      min: 5,
      max: 50,
      step: 1,
      suffix: "%",
      color: "red",
    },
    {
      key: "volatilityCap" as keyof RiskControlsType,
      label: "Volatility Cap",
      description: "Maximum allowed portfolio volatility",
      icon: AlertTriangle,
      min: 10,
      max: 100,
      step: 5,
      suffix: "%",
      color: "yellow",
    },
    {
      key: "stopLoss" as keyof RiskControlsType,
      label: "Stop Loss",
      description: "Maximum loss from initial capital",
      icon: Shield,
      min: 5,
      max: 50,
      step: 1,
      suffix: "%",
      color: "blue",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        icon: "text-red-400",
        text: "text-red-300",
        value: "text-red-200",
      },
      yellow: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        icon: "text-yellow-400",
        text: "text-yellow-300",
        value: "text-yellow-200",
      },
      blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        icon: "text-blue-400",
        text: "text-blue-300",
        value: "text-blue-200",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-5 w-5 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          Risk Management
        </h2>
      </div>

      <div className="space-y-4">
        {riskItems.map((item) => {
          const Icon = item.icon;
          const colorClasses = getColorClasses(item.color);
          const currentValue = riskControls[item.key];

          return (
            <div
              key={item.key}
              className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border} transition-all duration-200 hover:border-opacity-50`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${colorClasses.icon}`} />
                  <span className={`text-sm font-medium ${colorClasses.text}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-sm font-bold ${colorClasses.value}`}>
                  {currentValue}
                  {item.suffix}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-3">{item.description}</p>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={currentValue}
                  onChange={(e) =>
                    updateControl(item.key, Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${
                      item.color === "red"
                        ? "#ef4444"
                        : item.color === "yellow"
                        ? "#eab308"
                        : "#3b82f6"
                    } 0%, ${
                      item.color === "red"
                        ? "#ef4444"
                        : item.color === "yellow"
                        ? "#eab308"
                        : "#3b82f6"
                    } ${
                      ((currentValue - item.min) / (item.max - item.min)) * 100
                    }%, #1e293b ${
                      ((currentValue - item.min) / (item.max - item.min)) * 100
                    }%, #1e293b 100%)`,
                  }}
                />

                {/* Min/Max Labels */}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    {item.min}
                    {item.suffix}
                  </span>
                  <span>
                    {item.max}
                    {item.suffix}
                  </span>
                </div>
              </div>

              {/* Risk Level Indicator */}
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs text-slate-500">Risk Level:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const riskLevel = Math.ceil(
                      ((currentValue - item.min) / (item.max - item.min)) * 5
                    );
                    const isActive = level <= riskLevel;
                    return (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          isActive
                            ? item.color === "red"
                              ? "bg-red-400"
                              : item.color === "yellow"
                              ? "bg-yellow-400"
                              : "bg-blue-400"
                            : "bg-slate-700"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className={`text-xs font-medium ${colorClasses.text}`}>
                  {Math.ceil(
                    ((currentValue - item.min) / (item.max - item.min)) * 5
                  )}
                  /5
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Summary */}
      <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-200">
            Risk Summary
          </span>
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <div>
            Portfolio will halt trading if drawdown exceeds{" "}
            {riskControls.maxDrawdown}%
          </div>
          <div>
            Position sizing adjusted if volatility exceeds{" "}
            {riskControls.volatilityCap}%
          </div>
          <div>
            Stop loss triggered at {riskControls.stopLoss}% loss from entry
          </div>
        </div>
      </div>
    </div>
  );
}
