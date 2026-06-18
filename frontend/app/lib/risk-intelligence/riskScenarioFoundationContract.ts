/**
 * DS:6:7 — Risk Scenario Foundation contract.
 *
 * Scenario-ready risk structures for future what-if evaluation and simulation.
 * Foundation only — no simulation execution authority.
 */

import type { ExecutiveRiskSummary } from "./executiveRiskSummaryContract.ts";
import { EMPTY_EXECUTIVE_RISK_SUMMARY } from "./executiveRiskSummaryContract.ts";
import type {
  RiskPropagationChain,
  RiskPropagationChainStep,
  RiskPropagationNodeKind,
} from "./riskPropagationProfileContract.ts";

export const RISK_SCENARIO_FOUNDATION_DIAGNOSTIC = "[RISK_SCENARIO_FOUNDATION]" as const;

export const RISK_SCENARIO_READY_DIAGNOSTIC = "[RISK_SCENARIO_READY]" as const;

export const RISK_SCENARIO_FOUNDATION_VERSION = "6.7.0" as const;

export type RiskScenarioInput = Readonly<{
  scenarioId: string;
  label: string;
  description?: string;
  assumptions: Readonly<Record<string, unknown>>;
  focusNodeIds?: readonly string[];
  focusChainIds?: readonly string[];
}>;

export type RiskWhatIfEvaluationSlot = Readonly<{
  scenarioId: string;
  nodeId: string;
  nodeKind: RiskPropagationNodeKind;
  label: string;
  baselineRiskScore: number;
  projectedRiskScore: null;
  evaluationReady: true;
}>;

export type RiskAlternativePath = Readonly<{
  pathId: string;
  scenarioId: string;
  chainId: string;
  sourceId: string;
  targetId: string;
  sourceKind: RiskPropagationNodeKind;
  targetKind: RiskPropagationNodeKind;
  baselinePropagationScore: number;
  alternativePropagationScore: null;
  pathReady: true;
  steps: readonly RiskPropagationChainStep[];
}>;

export type RiskScenarioFoundationProfile = Readonly<{
  scenarioId: string;
  label: string;
  description: string;
  assumptions: Readonly<Record<string, unknown>>;
  whatIfEvaluations: readonly RiskWhatIfEvaluationSlot[];
  alternativePaths: readonly RiskAlternativePath[];
  scenarioInputs: readonly RiskScenarioInput[];
  foundationOnly: true;
  simulationActive: false;
}>;

export type RiskScenarioFoundationRegistry = Readonly<{
  version: typeof RISK_SCENARIO_FOUNDATION_VERSION;
  scenarios: readonly RiskScenarioFoundationProfile[];
  scenarioById: Readonly<Record<string, RiskScenarioFoundationProfile>>;
  scenarioCount: number;
  baselineExecutiveSummary: ExecutiveRiskSummary;
  foundationOnly: true;
  simulationActive: false;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof RISK_SCENARIO_FOUNDATION_DIAGNOSTIC,
    typeof RISK_SCENARIO_READY_DIAGNOSTIC,
  ];
}>;

export type RiskScenarioFoundationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  scenarioInputs?: readonly RiskScenarioInput[];
  executiveSummary?: ExecutiveRiskSummary;
}>;

export const RISK_SCENARIO_FOUNDATION_DIAGNOSTICS = Object.freeze([
  RISK_SCENARIO_FOUNDATION_DIAGNOSTIC,
  RISK_SCENARIO_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_SCENARIO_FOUNDATION_REGISTRY: RiskScenarioFoundationRegistry = Object.freeze({
  version: RISK_SCENARIO_FOUNDATION_VERSION,
  scenarios: Object.freeze([]),
  scenarioById: Object.freeze({}),
  scenarioCount: 0,
  baselineExecutiveSummary: EMPTY_EXECUTIVE_RISK_SUMMARY,
  foundationOnly: true,
  simulationActive: false,
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  diagnostics: RISK_SCENARIO_FOUNDATION_DIAGNOSTICS,
});
