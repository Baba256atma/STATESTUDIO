/**
 * DS:6:4 — KPI Risk Intelligence Engine contract.
 *
 * Read-only KPI risk profiles derived from KPI intelligence signals.
 */

import type { KpiHealthState, KpiHealthThresholds } from "../kpi-intelligence/kpiHealthContract.ts";
import type { KpiHistoricalSnapshot } from "../kpi-intelligence/kpiTrendContract.ts";
import type { KpiTrendDirection } from "../kpi-intelligence/kpiTrendContract.ts";
import type { KpiIntelligenceProfile } from "../kpi-intelligence/kpiIntelligenceContract.ts";

export const KPI_RISK_ENGINE_DIAGNOSTIC = "[KPI_RISK_ENGINE]" as const;

export const KPI_RISK_UPDATED_DIAGNOSTIC = "[KPI_RISK_UPDATED]" as const;

export const KPI_RISK_INTELLIGENCE_ENGINE_VERSION = "6.4.0" as const;

export type KpiRiskFactors = Readonly<{
  healthScore: number;
  healthState: KpiHealthState;
  trendDirection: KpiTrendDirection;
  trendStrength: number;
  impactScore: number;
}>;

export type KpiRiskProfile = Readonly<{
  kpiId: string;
  label: string;
  kpiRiskScore: number;
  decliningKpi: boolean;
  criticalKpi: boolean;
  volatileKpi: boolean;
  riskFactors: KpiRiskFactors;
  riskReasoning: readonly string[];
}>;

export type KpiRiskRegistry = Readonly<{
  version: typeof KPI_RISK_INTELLIGENCE_ENGINE_VERSION;
  profiles: readonly KpiRiskProfile[];
  riskByKpiId: Readonly<Record<string, KpiRiskProfile>>;
  kpiCount: number;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof KPI_RISK_ENGINE_DIAGNOSTIC,
    typeof KPI_RISK_UPDATED_DIAGNOSTIC,
  ];
}>;

export type KpiRiskBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  profiles?: readonly KpiIntelligenceProfile[];
  historicalSnapshots?: readonly KpiHistoricalSnapshot[];
  thresholds?: Partial<KpiHealthThresholds>;
}>;

export const KPI_RISK_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  KPI_RISK_ENGINE_DIAGNOSTIC,
  KPI_RISK_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_RISK_REGISTRY: KpiRiskRegistry = Object.freeze({
  version: KPI_RISK_INTELLIGENCE_ENGINE_VERSION,
  profiles: Object.freeze([]),
  riskByKpiId: Object.freeze({}),
  kpiCount: 0,
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  simulation: false,
  diagnostics: KPI_RISK_INTELLIGENCE_DIAGNOSTICS,
});
