/**
 * DS:6:6 — Executive Risk Intelligence Aggregator contract.
 *
 * Read-only executive summary across object, relationship, KPI, and
 * propagation risk intelligence.
 */

import type { KpiRiskProfile } from "./kpiRiskProfileContract.ts";
import type { ObjectRiskProfile } from "./objectRiskContract.ts";
import type { RelationshipRiskProfile } from "./relationshipRiskProfileContract.ts";
import type { RiskPropagationChain, RiskPropagationProfile } from "./riskPropagationProfileContract.ts";

export const EXEC_RISK_SUMMARY_DIAGNOSTIC = "[EXEC_RISK_SUMMARY]" as const;

export const EXEC_RISK_SUMMARY_READY_DIAGNOSTIC = "[EXEC_RISK_SUMMARY_READY]" as const;

export const EXEC_RISK_SUMMARY_VERSION = "6.6.0" as const;

export type ExecutiveRiskNodeKind = "object" | "relationship" | "kpi" | "chain";

export type ExecutiveRiskAttentionLevel = "monitor" | "review" | "prioritize" | "immediate";

export type ExecutiveRiskAttention = Readonly<{
  nodeId: string;
  nodeKind: ExecutiveRiskNodeKind;
  attentionLevel: ExecutiveRiskAttentionLevel;
  reason: string;
}>;

export type ExecutiveRiskSummaryProfile = Readonly<{
  nodeId: string;
  nodeKind: Exclude<ExecutiveRiskNodeKind, "chain">;
  label: string;
  riskScore: number;
  objectRisk?: ObjectRiskProfile;
  relationshipRisk?: RelationshipRiskProfile;
  kpiRisk?: KpiRiskProfile;
}>;

export type ExecutiveRiskSummary = Readonly<{
  version: typeof EXEC_RISK_SUMMARY_VERSION;
  executiveSummary: string;
  objectRiskCount: number;
  relationshipRiskCount: number;
  kpiRiskCount: number;
  propagationScore: number;
  averageObjectRiskScore: number;
  averageRelationshipRiskScore: number;
  averageKpiRiskScore: number;
  topRisks: readonly string[];
  topRiskChains: readonly string[];
  topVulnerabilities: readonly string[];
  recommendedAttention: readonly ExecutiveRiskAttention[];
  propagation: RiskPropagationProfile;
  profiles: readonly ExecutiveRiskSummaryProfile[];
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof EXEC_RISK_SUMMARY_DIAGNOSTIC,
    typeof EXEC_RISK_SUMMARY_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveRiskSummaryBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  objectRiskProfiles?: readonly ObjectRiskProfile[];
  relationshipRiskProfiles?: readonly RelationshipRiskProfile[];
  kpiRiskProfiles?: readonly KpiRiskProfile[];
  propagationProfile?: RiskPropagationProfile;
}>;

export const EXEC_RISK_SUMMARY_DIAGNOSTICS = Object.freeze([
  EXEC_RISK_SUMMARY_DIAGNOSTIC,
  EXEC_RISK_SUMMARY_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_PROPAGATION_PROFILE_FOR_SUMMARY: RiskPropagationProfile = Object.freeze({
  propagationId: "business-graph-propagation",
  riskSources: Object.freeze([]),
  riskTargets: Object.freeze([]),
  riskChains: Object.freeze([]),
  propagationScore: 0,
  objectCount: 0,
  relationshipCount: 0,
  kpiCount: 0,
  chainCount: 0,
  propagationReasoning: Object.freeze(["No propagation profile available."]),
});

export const EMPTY_EXECUTIVE_RISK_SUMMARY: ExecutiveRiskSummary = Object.freeze({
  version: EXEC_RISK_SUMMARY_VERSION,
  executiveSummary: "No executive risk intelligence is available.",
  objectRiskCount: 0,
  relationshipRiskCount: 0,
  kpiRiskCount: 0,
  propagationScore: 0,
  averageObjectRiskScore: 0,
  averageRelationshipRiskScore: 0,
  averageKpiRiskScore: 0,
  topRisks: Object.freeze([]),
  topRiskChains: Object.freeze([]),
  topVulnerabilities: Object.freeze([]),
  recommendedAttention: Object.freeze([]),
  propagation: EMPTY_RISK_PROPAGATION_PROFILE_FOR_SUMMARY,
  profiles: Object.freeze([]),
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  simulation: false,
  diagnostics: EXEC_RISK_SUMMARY_DIAGNOSTICS,
});
