// KPI Engine (React/Next friendly)
// This file should NOT import itself or depend on Svelte.

export type KpiDirection = "up" | "down";

export type KpiValue = {
  id: string;
  label: string;
  value: number; // 0..1
  direction: KpiDirection;
  target?: number; // optional 0..1
  trend?: number; // optional -1..+1
  score?: number; // optional 0..1
  note?: string;
};

export type KpiComputeInput = {
  sceneJson?: any;
  // Optional signals your project already uses
  stateVector?: {
    intensity?: number;
    volatility?: number;
    [k: string]: unknown;
  };
  loops?: any[];
  lastKpis?: KpiValue[];
};

// Utilities
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Minimal, safe KPI computation placeholder.
 * If you already have a richer KPI engine elsewhere, keep that file and import from it.
 */
export function computeKpis(input: KpiComputeInput): KpiValue[] {
  const intensity = clamp01(Number(input.stateVector?.intensity ?? 0));
  const volatility = clamp01(Number(input.stateVector?.volatility ?? 0));

  // Example KPIs (replace with your real registry-driven KPIs)
  const kpis: KpiValue[] = [
    {
      id: "kpi_intensity",
      label: "Intensity",
      value: intensity,
      direction: "up",
    },
    {
      id: "kpi_volatility",
      label: "Volatility",
      value: volatility,
      direction: "down",
    },
  ];

  return kpis;
}
