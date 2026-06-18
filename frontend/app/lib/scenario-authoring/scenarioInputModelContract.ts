/**
 * S:1 — Scenario Input Model contract.
 *
 * Immutable proposed-change input model for scenario authoring. Stores draft
 * inputs only — no execution, simulation, or DS mutation authority.
 */

export const SCENARIO_INPUT_MODEL_DIAGNOSTIC = "[SCENARIO_INPUT_MODEL]" as const;

export const SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC = "[SCENARIO_INPUT_MODEL_READY]" as const;

export const S1_INPUT_MODEL_COMPLETE_TAG = "[S1_INPUT_MODEL_COMPLETE]" as const;

export const SCENARIO_INPUT_MODEL_VERSION = "1.0.0" as const;

export type ScenarioInputChangeKind = "object" | "relationship" | "kpi" | "risk";

export type ScenarioProposedChangeBase = Readonly<{
  changeId: string;
  kind: ScenarioInputChangeKind;
  targetId: string;
  label: string;
  field: string;
  proposedValue: string;
  rationale: string;
  recordedAt: string;
}>;

export type ScenarioObjectChange = ScenarioProposedChangeBase &
  Readonly<{ kind: "object" }>;

export type ScenarioRelationshipChange = ScenarioProposedChangeBase &
  Readonly<{ kind: "relationship" }>;

export type ScenarioKpiChange = ScenarioProposedChangeBase & Readonly<{ kind: "kpi" }>;

export type ScenarioRiskChange = ScenarioProposedChangeBase & Readonly<{ kind: "risk" }>;

export type ScenarioProposedChange =
  | ScenarioObjectChange
  | ScenarioRelationshipChange
  | ScenarioKpiChange
  | ScenarioRiskChange;

export type ScenarioInputModel = Readonly<{
  version: typeof SCENARIO_INPUT_MODEL_VERSION;
  inputModelId: string;
  draftId: string;
  objectChanges: readonly ScenarioObjectChange[];
  relationshipChanges: readonly ScenarioRelationshipChange[];
  kpiChanges: readonly ScenarioKpiChange[];
  riskChanges: readonly ScenarioRiskChange[];
  proposedChanges: readonly ScenarioProposedChange[];
  changeCount: number;
  draftOnly: true;
  executionActive: false;
  simulationActive: false;
  dsMutation: false;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  topologyMutation: false;
  diagnostics: readonly [
    typeof SCENARIO_INPUT_MODEL_DIAGNOSTIC,
    typeof SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioProposedChangeInput = Readonly<{
  changeId?: string;
  targetId: string;
  label?: string;
  field: string;
  proposedValue: string;
  rationale?: string;
  recordedAt?: string;
}>;

export type ScenarioInputModelBuildInput = Readonly<{
  inputModelId?: string;
  draftId?: string;
  objectChanges?: readonly ScenarioProposedChangeInput[];
  relationshipChanges?: readonly ScenarioProposedChangeInput[];
  kpiChanges?: readonly ScenarioProposedChangeInput[];
  riskChanges?: readonly ScenarioProposedChangeInput[];
}>;

export const SCENARIO_INPUT_MODEL_DIAGNOSTICS = Object.freeze([
  SCENARIO_INPUT_MODEL_DIAGNOSTIC,
  SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_INPUT_MODEL: ScenarioInputModel = Object.freeze({
  version: SCENARIO_INPUT_MODEL_VERSION,
  inputModelId: "scenario-input:none",
  draftId: "",
  objectChanges: Object.freeze([]),
  relationshipChanges: Object.freeze([]),
  kpiChanges: Object.freeze([]),
  riskChanges: Object.freeze([]),
  proposedChanges: Object.freeze([]),
  changeCount: 0,
  draftOnly: true,
  executionActive: false,
  simulationActive: false,
  dsMutation: false,
  sceneMutation: false,
  objectMutation: false,
  routingMutation: false,
  topologyMutation: false,
  diagnostics: SCENARIO_INPUT_MODEL_DIAGNOSTICS,
});
