/**
 * DS:7:1 — Scenario Generation Foundation contract.
 *
 * Immutable scenario intelligence metadata. Read-only layer with no UI,
 * scene mutation, routing, or simulation authority.
 */

export const SCENARIO_RUNTIME_DIAGNOSTIC = "[SCENARIO_RUNTIME]" as const;

export const SCENARIO_RUNTIME_READY_DIAGNOSTIC = "[SCENARIO_RUNTIME_READY]" as const;

export const SCENARIO_GENERATION_RUNTIME_VERSION = "7.1.0" as const;

export const DS7_CERTIFIED_TAG = "[DS7_CERTIFIED]" as const;

export const SCENARIO_GENERATION_COMPLETE_TAG = "[SCENARIO_GENERATION_COMPLETE]" as const;

export type ScenarioType = "baseline" | "alternative" | "risk" | "opportunity";

export type ScenarioImpactArea =
  | "objects"
  | "relationships"
  | "kpis"
  | "risk"
  | "operations";

export type ScenarioDefinition = Readonly<{
  scenarioId: string;
  label: string;
  scenarioType: ScenarioType;
  description: string;
  assumptions: Readonly<Record<string, unknown>>;
  focusObjectIds: readonly string[];
  foundationOnly: true;
  generationActive: false;
}>;

export type ScenarioImpact = Readonly<{
  scenarioId: string;
  scenarioType: ScenarioType;
  impactedObjectIds: readonly string[];
  impactedKpiIds: readonly string[];
  impactAreas: readonly ScenarioImpactArea[];
  baselineScore: number;
  projectedScore: null;
  severity: number;
  confidence: number;
  impactReady: true;
}>;

export type ScenarioResult = Readonly<{
  scenarioId: string;
  scenarioType: ScenarioType;
  label: string;
  summary: string;
  outcomeScore: null;
  definition: ScenarioDefinition;
  impact: ScenarioImpact;
  evaluationReady: true;
  simulationActive: false;
}>;

export type ScenarioRegistry = Readonly<{
  version: typeof SCENARIO_GENERATION_RUNTIME_VERSION;
  definitions: readonly ScenarioDefinition[];
  impacts: readonly ScenarioImpact[];
  results: readonly ScenarioResult[];
  definitionById: Readonly<Record<string, ScenarioDefinition>>;
  resultById: Readonly<Record<string, ScenarioResult>>;
  scenarioCount: number;
  supportedScenarioTypes: readonly ScenarioType[];
  readOnly: true;
  sceneMutation: false;
  visualRendering: false;
  mrpMutation: false;
  generationActive: false;
  diagnostics: readonly [
    typeof SCENARIO_RUNTIME_DIAGNOSTIC,
    typeof SCENARIO_RUNTIME_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioGenerationBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  selectedObjectId?: string | null;
  scenarioDefinitions?: readonly ScenarioDefinition[];
}>;

export const SCENARIO_TYPE_LABELS: Readonly<Record<ScenarioType, string>> = Object.freeze({
  baseline: "Baseline Scenario",
  alternative: "Alternative Scenario",
  risk: "Risk Scenario",
  opportunity: "Opportunity Scenario",
});

export const SCENARIO_SUPPORTED_TYPES = Object.freeze([
  "baseline",
  "alternative",
  "risk",
  "opportunity",
] as const);

export const SCENARIO_GENERATION_DIAGNOSTICS = Object.freeze([
  SCENARIO_RUNTIME_DIAGNOSTIC,
  SCENARIO_RUNTIME_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_REGISTRY: ScenarioRegistry = Object.freeze({
  version: SCENARIO_GENERATION_RUNTIME_VERSION,
  definitions: Object.freeze([]),
  impacts: Object.freeze([]),
  results: Object.freeze([]),
  definitionById: Object.freeze({}),
  resultById: Object.freeze({}),
  scenarioCount: 0,
  supportedScenarioTypes: SCENARIO_SUPPORTED_TYPES,
  readOnly: true,
  sceneMutation: false,
  visualRendering: false,
  mrpMutation: false,
  generationActive: false,
  diagnostics: SCENARIO_GENERATION_DIAGNOSTICS,
});
