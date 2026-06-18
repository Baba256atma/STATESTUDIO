/**
 * DS:7:2 — Scenario Builder Engine contract.
 *
 * Executable scenario blueprints with preserved baseline snapshots.
 * Blueprint-only layer — no scene mutation or execution authority.
 */

import type { ScenarioDefinition, ScenarioRegistry, ScenarioType } from "./scenarioGenerationContract.ts";

export const SCENARIO_BUILDER_DIAGNOSTIC = "[SCENARIO_BUILDER]" as const;

export const SCENARIO_BUILDER_READY_DIAGNOSTIC = "[SCENARIO_BUILDER_READY]" as const;

export const SCENARIO_BUILDER_ENGINE_VERSION = "7.2.0" as const;

export type ScenarioChangeKind = "object" | "relationship" | "kpi" | "risk";

export type ScenarioObjectChange = Readonly<{
  changeId: string;
  changeKind: "object";
  objectId: string;
  label: string;
  baselineState: Readonly<Record<string, unknown>>;
  proposedState: Readonly<Record<string, unknown>>;
  executable: true;
  applied: false;
}>;

export type ScenarioRelationshipChange = Readonly<{
  changeId: string;
  changeKind: "relationship";
  relationshipId: string;
  sourceId: string;
  targetId: string;
  baselineState: Readonly<Record<string, unknown>>;
  proposedState: Readonly<Record<string, unknown>>;
  executable: true;
  applied: false;
}>;

export type ScenarioKpiChange = Readonly<{
  changeId: string;
  changeKind: "kpi";
  kpiId: string;
  label: string;
  baselineState: Readonly<Record<string, unknown>>;
  proposedState: Readonly<Record<string, unknown>>;
  executable: true;
  applied: false;
}>;

export type ScenarioRiskChange = Readonly<{
  changeId: string;
  changeKind: "risk";
  riskId: string;
  label: string;
  baselineState: Readonly<Record<string, unknown>>;
  proposedState: Readonly<Record<string, unknown>>;
  executable: true;
  applied: false;
}>;

export type ScenarioChange =
  | ScenarioObjectChange
  | ScenarioRelationshipChange
  | ScenarioKpiChange
  | ScenarioRiskChange;

export type ScenarioBaselineState = Readonly<{
  objectSnapshots: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  relationshipSnapshots: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  kpiSnapshots: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  riskSnapshots: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  objectCount: number;
  relationshipCount: number;
  kpiCount: number;
  riskCount: number;
  preserved: true;
}>;

export type ScenarioBlueprint = Readonly<{
  blueprintId: string;
  scenarioId: string;
  scenarioType: ScenarioType;
  label: string;
  definition: ScenarioDefinition;
  baselineState: ScenarioBaselineState;
  objectChanges: readonly ScenarioObjectChange[];
  relationshipChanges: readonly ScenarioRelationshipChange[];
  kpiChanges: readonly ScenarioKpiChange[];
  riskChanges: readonly ScenarioRiskChange[];
  changeCount: number;
  executable: true;
  executionActive: false;
  sceneMutation: false;
}>;

export type ScenarioBlueprintRegistry = Readonly<{
  version: typeof SCENARIO_BUILDER_ENGINE_VERSION;
  blueprints: readonly ScenarioBlueprint[];
  blueprintById: Readonly<Record<string, ScenarioBlueprint>>;
  blueprintByScenarioId: Readonly<Record<string, ScenarioBlueprint>>;
  blueprintCount: number;
  readOnly: true;
  sceneMutation: false;
  executionActive: false;
  diagnostics: readonly [
    typeof SCENARIO_BUILDER_DIAGNOSTIC,
    typeof SCENARIO_BUILDER_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioBuilderBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  selectedObjectId?: string | null;
  scenarioRegistry?: ScenarioRegistry;
  scenarioIds?: readonly string[];
}>;

export const SCENARIO_BUILDER_DIAGNOSTICS = Object.freeze([
  SCENARIO_BUILDER_DIAGNOSTIC,
  SCENARIO_BUILDER_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_BLUEPRINT_REGISTRY: ScenarioBlueprintRegistry = Object.freeze({
  version: SCENARIO_BUILDER_ENGINE_VERSION,
  blueprints: Object.freeze([]),
  blueprintById: Object.freeze({}),
  blueprintByScenarioId: Object.freeze({}),
  blueprintCount: 0,
  readOnly: true,
  sceneMutation: false,
  executionActive: false,
  diagnostics: SCENARIO_BUILDER_DIAGNOSTICS,
});
