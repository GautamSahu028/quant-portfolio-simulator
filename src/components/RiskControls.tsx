import React from 'react';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import { RiskControls as RiskControlsType } from '../types';

interface RiskControlsProps {
  riskControls: RiskControlsType;
  onRiskControlsChange: (controls: RiskControlsType) => void;
}

/**
 * Risk Controls Panel Component
 * Manages portfolio risk parameters
 */
export function RiskControls({ riskControls, onRiskControlsChange }: RiskControlsProps) {
  const updateControl = (field: keyof RiskControlsType, value: number) => {
    onRiskControlsChange({
      ...riskControls,
      [field]: value
    });
  };

  const riskItems = [
    {
      key: 'maxDrawdown' as keyof RiskControlsType,
      label: 'Max Drawdown',
      description: 'Maximum allowed portfolio decline from peak',
      icon: TrendingDown,
      min: 5,
      max: 50,
      step: 1,
      suffix: '%',
      color: 'red'
    },
    {
      key: 'volatilityCap' as keyof RiskControlsType,
      label: 'Volatility Cap',
      description: 'Maximum allowed portfolio volatility',
      icon: AlertTriangle,
      min: 10,
      max: 100,
      step: 5,
      suffix: '%',
      color: 'yellow'
    },
    {
      key: 'stopLoss' as keyof RiskControlsType,
      label: 'Stop Loss',
      description: 'Maximum loss from initial capital',
      icon: Shield,
      min: 5,
      max: 50,
      step: 1,
      suffix: '%',
      color: 'blue'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors = {
      red: {
        bg: isActive ? 'bg-red-50' : 'bg-red-25',
        border: isActive ? 'border-red-300' : 'border-red-200',
        icon: 'text-red-600',
        text: 'text-red-900',
        slider: 'accent-red-500'
      },
      yellow: {
        bg: isActive ? 'bg-yellow-50' : 'bg-yellow-25',
        border: isActive ? 'border-yellow-300' : 'border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-900',
        slider: 'accent-yellow-500'
      },
      blue: {
        bg: isActive ? 'bg-blue-50' : 'bg-blue-25',
        border: isActive ? 'border-blue-300' : 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-900',
        slider: 'accent-blue-500'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Risk Controls</h2>
      </div>

      <div className="space-y-6">
        {riskItems.map((item) => {
          const IconComponent = item.icon;
          const value = riskControls[item.key];
          const colors = getColorClasses(item.color);
          
          return (
            <div
              key={item.key}
              className={`
                border-2 rounded-lg p-4 transition-all duration-200
                ${colors.bg} ${colors.border}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${colors.text}`}>
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className={`text-right font-semibold text-lg ${colors.text}`}>
                  {value}{item.suffix}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={value}
                  onChange={(e) => updateControl(item.key, Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${colors.slider}`}
                  style={{
                    background: `linear-gradient(to right, currentColor 0%, currentColor ${((value - item.min) / (item.max - item.min)) * 100}%, #e5e7eb ${((value - item.min) / (item.max - item.min)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.min}{item.suffix}</span>
                  <span>{item.max}{item.suffix}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Risk Management Notes</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drawdown control will liquidate positions if losses exceed the threshold</li>
          <li>• Volatility capping reduces position sizes during high volatility periods</li>
          <li>• Stop loss provides final protection against catastrophic losses</li>
        </ul>
      </div>
    </div>
  );
}