/**
 * INT:3 — Risk Explanation Engine contract.
 *
 * Template-driven read-only executive risk explanations from certified
 * DS-6 risk intelligence. No AI generation, mutations, or routing changes.
 */

import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import { EMPTY_EXECUTIVE_RISK_SUMMARY } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { ExecutiveRiskNodeKind } from "../risk-intelligence/executiveRiskSummaryContract.ts";

export const RISK_EXPLANATION_ENGINE_DIAGNOSTIC = "[RISK_EXPLANATION_ENGINE]" as const;

export const RISK_EXPLANATION_READY_DIAGNOSTIC = "[RISK_EXPLANATION_READY]" as const;

export const INT3_RISK_EXPLANATION_COMPLETE_TAG = "[INT3_RISK_EXPLANATION_COMPLETE]" as const;

export const RISK_EXPLANATION_ENGINE_VERSION = "3.4.0" as const;

export type ExecutiveRiskExplanation = Readonly<{
  nodeId: string;
  nodeKind: ExecutiveRiskNodeKind;
  label: string;
  riskScoreExplanation: string;
  riskChainExplanation: string | null;
  propagationExplanation: string;
  vulnerabilityExplanation: string | null;
  whatIsRisky: string;
  whyItIsRisky: string;
  whereRiskPropagates: string | null;
  executiveSummary: string;
}>;

export type RiskExplanationRegistry = Readonly<{
  version: typeof RISK_EXPLANATION_ENGINE_VERSION;
  explanationCount: number;
  explanations: readonly ExecutiveRiskExplanation[];
  executiveSummary: string;
  riskIntelligence: ExecutiveRiskSummary;
  explanationReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof RISK_EXPLANATION_ENGINE_DIAGNOSTIC,
    typeof RISK_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export type RiskExplanationEngineBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  riskIntelligence?: ExecutiveRiskSummary;
}>;

export const RISK_EXPLANATION_ENGINE_DIAGNOSTICS = Object.freeze([
  RISK_EXPLANATION_ENGINE_DIAGNOSTIC,
  RISK_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_EXPLANATION_REGISTRY: RiskExplanationRegistry = Object.freeze({
  version: RISK_EXPLANATION_ENGINE_VERSION,
  explanationCount: 0,
  explanations: Object.freeze([]),
  executiveSummary: "No risk explanations are available.",
  riskIntelligence: EMPTY_EXECUTIVE_RISK_SUMMARY,
  explanationReady: true,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  diagnostics: RISK_EXPLANATION_ENGINE_DIAGNOSTICS,
});
