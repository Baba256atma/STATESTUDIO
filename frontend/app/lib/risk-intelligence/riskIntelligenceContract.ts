/**
 * DS:6:1 — Risk Intelligence foundation contract.
 *
 * Immutable risk intelligence metadata for Nexora subjects. Read-only layer with
 * no UI, scene mutation, routing, or simulation authority.
 */

export const RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC = "[RISK_INTELLIGENCE_RUNTIME]" as const;

export const RISK_INTELLIGENCE_READY_DIAGNOSTIC = "[RISK_INTELLIGENCE_READY]" as const;

export const DS6_CERTIFIED_TAG = "[DS6_CERTIFIED]" as const;

export const RISK_INTELLIGENCE_COMPLETE_TAG = "[RISK_INTELLIGENCE_COMPLETE]" as const;

export const RISK_INTELLIGENCE_RUNTIME_VERSION = "6.1.0" as const;

export type RiskIntelligenceCategory =
  | "operational"
  | "financial"
  | "schedule"
  | "dependency"
  | "supply"
  | "strategic";

export type RiskIntelligenceCategoryLabel =
  | "Operational Risk"
  | "Financial Risk"
  | "Schedule Risk"
  | "Dependency Risk"
  | "Supply Risk"
  | "Strategic Risk";

export type RiskIntelligenceMomentum = "improving" | "stable" | "worsening" | "unknown";

export type RiskIntelligenceCategoryScores = Readonly<{
  operationalRisk: number;
  financialRisk: number;
  scheduleRisk: number;
  dependencyRisk: number;
  supplyRisk: number;
  strategicRisk: number;
}>;

export type RiskIntelligenceProfile = Readonly<{
  riskId: string;
  subjectId: string;
  label: string;
  primaryCategory: RiskIntelligenceCategory;
  primaryCategoryLabel: RiskIntelligenceCategoryLabel;
  severity: number;
  exposure: number;
  confidence: number;
  momentum: RiskIntelligenceMomentum;
  categories: RiskIntelligenceCategoryScores;
}>;

export type RiskIntelligenceRegistry = Readonly<{
  version: typeof RISK_INTELLIGENCE_RUNTIME_VERSION;
  profiles: readonly RiskIntelligenceProfile[];
  profileByRiskId: Readonly<Record<string, RiskIntelligenceProfile>>;
  profileBySubjectId: Readonly<Record<string, RiskIntelligenceProfile>>;
  riskCount: number;
  sceneMutation: false;
  routingMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
    typeof RISK_INTELLIGENCE_READY_DIAGNOSTIC,
  ];
}>;

export type RiskIntelligenceBuildInput = Readonly<{
  sceneJson?: unknown;
  risks?: readonly unknown[];
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
}>;

export const RISK_INTELLIGENCE_CATEGORY_LABELS: Readonly<
  Record<RiskIntelligenceCategory, RiskIntelligenceCategoryLabel>
> = Object.freeze({
  operational: "Operational Risk",
  financial: "Financial Risk",
  schedule: "Schedule Risk",
  dependency: "Dependency Risk",
  supply: "Supply Risk",
  strategic: "Strategic Risk",
});

export const RISK_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  RISK_INTELLIGENCE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RISK_INTELLIGENCE_REGISTRY: RiskIntelligenceRegistry = Object.freeze({
  version: RISK_INTELLIGENCE_RUNTIME_VERSION,
  profiles: Object.freeze([]),
  profileByRiskId: Object.freeze({}),
  profileBySubjectId: Object.freeze({}),
  riskCount: 0,
  sceneMutation: false,
  routingMutation: false,
  simulation: false,
  diagnostics: RISK_INTELLIGENCE_DIAGNOSTICS,
});
