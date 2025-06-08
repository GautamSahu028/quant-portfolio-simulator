import { useState, useCallback } from 'react';
import { SimulationConfig, SimulationResult } from '../types';
import { runSimulation } from '../services/simulation';

export interface UseSimulationReturn {
  isRunning: boolean;
  result: SimulationResult | null;
  error: string | null;
  runSimulation: (config: SimulationConfig) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for managing portfolio simulation state
 */
export function useSimulation(): UseSimulationReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunSimulation = useCallback(async (config: SimulationConfig) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const simulationResult = await runSimulation(config);
      setResult(simulationResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsRunning(false);
  }, []);

  return {
    isRunning,
    result,
    error,
    runSimulation: handleRunSimulation,
    reset
  };
}