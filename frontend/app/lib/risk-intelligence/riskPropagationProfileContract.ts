/**
 * DS:6:5 — Risk Propagation Engine contract.
 *
 * Read-only business graph risk propagation profiles. No UI, scene mutation,
 * routing, or simulation authority.
 */

export const RISK_PROPAGATION_ENGINE_DIAGNOSTIC = "[RISK_PROPAGATION_ENGINE]" as const;

export const RISK_PROPAGATION_UPDATED_DIAGNOSTIC = "[RISK_PROPAGATION_UPDATED]" as const;

export const RISK_PROPAGATION_ENGINE_VERSION = "6.5.0" as const;

export type RiskPropagationNodeKind = "object" | "relationship" | "kpi";

export type RiskPropagationChainStep = Readonly<{
  nodeId: string;
  nodeKind: RiskPropagationNodeKind;
  label: string;
  riskScore: number;
}>;

export type RiskPropagationChain = Readonly<{
  chainId: string;
  sourceId: string;
  sourceKind: RiskPropagationNodeKind;
  targetId: string;
  targetKind: RiskPropagationNodeKind;
  steps: readonly RiskPropagationChainStep[];
  propagationScore: number;
}>;

export type RiskPropagationProfile = Readonly<{
  propagationId: string;
  riskSources: readonly string[];
  riskTargets: readonly string[];
  riskChains: readonly RiskPropagationChain[];
  propagationScore: number;
  objectCount: number;
  relationshipCount: number;
  kpiCount: number;
  chainCount: number;
  propagationReasoning: readonly string[];
}>;

export type RiskPropagationRegistry = Readonly<{
  version: typeof RISK_PROPAGATION_ENGINE_VERSION;
  profile: RiskPropagationProfile;
  readOnly: true;
  sceneMutation: false;
  mrpMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof RISK_PROPAGATION_ENGINE_DIAGNOSTIC,
    typeof RISK_PROPAGATION_UPDATED_DIAGNOSTIC,
  ];
}>;

export type RiskPropagationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
}>;

export const RISK_PROPAGATION_DIAGNOSTICS = Object.freeze([
  RISK_PROPAGATION_ENGINE_DIAGNOSTIC,
  RISK_PROPAGATION_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_PROPAGATION_PROFILE: RiskPropagationProfile = Object.freeze({
  propagationId: "business-graph-propagation",
  riskSources: Object.freeze([]),
  riskTargets: Object.freeze([]),
  riskChains: Object.freeze([]),
  propagationScore: 0,
  objectCount: 0,
  relationshipCount: 0,
  kpiCount: 0,
  chainCount: 0,
  propagationReasoning: Object.freeze(["No business graph risk propagation detected."]),
});

export const EMPTY_RISK_PROPAGATION_REGISTRY: RiskPropagationRegistry = Object.freeze({
  version: RISK_PROPAGATION_ENGINE_VERSION,
  profile: EMPTY_RISK_PROPAGATION_PROFILE,
  readOnly: true,
  sceneMutation: false,
  mrpMutation: false,
  simulation: false,
  diagnostics: RISK_PROPAGATION_DIAGNOSTICS,
});
