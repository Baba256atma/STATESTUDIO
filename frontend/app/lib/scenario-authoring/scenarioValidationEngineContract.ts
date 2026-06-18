/**
 * S:1 — Scenario Validation Engine contract.
 *
 * Validates scenario drafts before storage. Read-only relative to DS
 * intelligence. No simulation execution or mutation authority.
 */

import type { ScenarioDraft, ScenarioDraftValidationState } from "./scenarioAuthoringContract.ts";
import { SCENARIO_AUTHORING_REQUIRED_FIELDS } from "./scenarioAuthoringContract.ts";
import type { ScenarioInputModel } from "./scenarioInputModelContract.ts";

export const SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC = "[SCENARIO_VALIDATION_ENGINE]" as const;

export const SCENARIO_VALIDATION_READY_DIAGNOSTIC = "[SCENARIO_VALIDATION_READY]" as const;

export const S1_VALIDATION_COMPLETE_TAG = "[S1_VALIDATION_COMPLETE]" as const;

export const SCENARIO_VALIDATION_ENGINE_VERSION = "1.0.0" as const;

export type ScenarioValidationIssueLevel = "error" | "warning";

export type ScenarioValidationIssueKind =
  | "required_field"
  | "object_reference"
  | "relationship_reference"
  | "kpi_reference"
  | "risk_reference";

export type ScenarioValidationIssue = Readonly<{
  level: ScenarioValidationIssueLevel;
  kind: ScenarioValidationIssueKind;
  field: string;
  targetId: string;
  message: string;
}>;

export type ScenarioValidationReferenceCatalog = Readonly<{
  objectIds: readonly string[];
  relationshipIds: readonly string[];
  kpiIds: readonly string[];
  riskIds: readonly string[];
  catalogAvailable: boolean;
}>;

export type ScenarioValidationResult = Readonly<{
  version: typeof SCENARIO_VALIDATION_ENGINE_VERSION;
  draftId: string;
  valid: boolean;
  accepted: boolean;
  rejected: boolean;
  validationState: ScenarioDraftValidationState;
  errors: readonly ScenarioValidationIssue[];
  warnings: readonly ScenarioValidationIssue[];
  errorCount: number;
  warningCount: number;
  validationSummary: string;
  referenceCatalog: ScenarioValidationReferenceCatalog;
  simulationActive: false;
  executionActive: false;
  dsMutation: false;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  topologyMutation: false;
  diagnostics: readonly [
    typeof SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC,
    typeof SCENARIO_VALIDATION_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioValidationEngineBuildInput = Readonly<{
  draft: ScenarioDraft;
  inputModel?: ScenarioInputModel;
  sceneJson?: unknown;
  referenceCatalog?: Partial<
    Readonly<{
      objectIds: readonly string[];
      relationshipIds: readonly string[];
      kpiIds: readonly string[];
      riskIds: readonly string[];
    }>
  >;
}>;

export const SCENARIO_VALIDATION_ENGINE_DIAGNOSTICS = Object.freeze([
  SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC,
  SCENARIO_VALIDATION_READY_DIAGNOSTIC,
] as const);

export const SCENARIO_VALIDATION_REQUIRED_FIELDS = SCENARIO_AUTHORING_REQUIRED_FIELDS;

export const EMPTY_SCENARIO_VALIDATION_REFERENCE_CATALOG: ScenarioValidationReferenceCatalog =
  Object.freeze({
    objectIds: Object.freeze([]),
    relationshipIds: Object.freeze([]),
    kpiIds: Object.freeze([]),
    riskIds: Object.freeze([]),
    catalogAvailable: false,
  });

export const EMPTY_SCENARIO_VALIDATION_RESULT: ScenarioValidationResult = Object.freeze({
  version: SCENARIO_VALIDATION_ENGINE_VERSION,
  draftId: "",
  valid: false,
  accepted: false,
  rejected: true,
  validationState: "invalid",
  errors: Object.freeze([
    Object.freeze({
      level: "error" as const,
      kind: "required_field" as const,
      field: "draft",
      targetId: "",
      message: "No scenario draft is available for validation.",
    }),
  ]),
  warnings: Object.freeze([]),
  errorCount: 1,
  warningCount: 0,
  validationSummary: "No scenario draft is available for validation.",
  referenceCatalog: EMPTY_SCENARIO_VALIDATION_REFERENCE_CATALOG,
  simulationActive: false,
  executionActive: false,
  dsMutation: false,
  sceneMutation: false,
  objectMutation: false,
  routingMutation: false,
  topologyMutation: false,
  diagnostics: SCENARIO_VALIDATION_ENGINE_DIAGNOSTICS,
});
