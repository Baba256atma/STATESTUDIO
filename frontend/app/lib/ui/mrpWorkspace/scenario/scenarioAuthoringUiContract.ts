/**
 * S:1 — Scenario authoring UI binding contract.
 *
 * Read-only draft display for the certified Scenario MRP workspace.
 * No simulation execution, routing changes, or intelligence mutations.
 */

import type { ScenarioDraftValidationState } from "../../../scenario-authoring/scenarioAuthoringContract.ts";

export const SCENARIO_AUTHORING_UI_DIAGNOSTIC = "[SCENARIO_AUTHORING_UI]" as const;

export const SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC = "[SCENARIO_AUTHORING_UI_READY]" as const;

export const S1_UI_BINDING_COMPLETE_TAG = "[S1_UI_BINDING_COMPLETE]" as const;

export const SCENARIO_AUTHORING_UI_VERSION = "1.0.0" as const;

export type ScenarioAuthoringUiPhase = "loading" | "ready" | "empty";

export type ScenarioAuthoringDraftView = Readonly<{
  draftId: string;
  draftName: string;
  draftType: string;
  draftSummary: string;
  validationState: ScenarioDraftValidationState;
  validationLabel: string;
  hasDraft: boolean;
  activeDraftCount: number;
}>;

export type ScenarioAuthoringUiView = Readonly<{
  version: typeof SCENARIO_AUTHORING_UI_VERSION;
  phase: ScenarioAuthoringUiPhase;
  draft: ScenarioAuthoringDraftView;
  bindingSummary: string;
  draftsOnly: true;
  simulationActive: false;
  simulationResultsStored: false;
  dsMutation: false;
  intelligenceMutation: false;
  sceneMutation: false;
  routingMutation: false;
  topologyMutation: false;
  revision: number;
  diagnostics: readonly [
    typeof SCENARIO_AUTHORING_UI_DIAGNOSTIC,
    typeof SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioAuthoringUiSyncInput = Readonly<{
  selectedObjectId?: string | null;
}>;

export const SCENARIO_AUTHORING_UI_DIAGNOSTICS = Object.freeze([
  SCENARIO_AUTHORING_UI_DIAGNOSTIC,
  SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC,
] as const);

export const SCENARIO_AUTHORING_UI_FIELD_LABELS = Object.freeze({
  draftName: "Draft Name",
  draftType: "Draft Type",
  draftSummary: "Draft Summary",
  validationState: "Validation State",
} as const);

export const EMPTY_SCENARIO_AUTHORING_DRAFT_VIEW: ScenarioAuthoringDraftView = Object.freeze({
  draftId: "",
  draftName: "No draft persisted",
  draftType: "—",
  draftSummary: "Create a scenario draft to see authoring fields here.",
  validationState: "incomplete",
  validationLabel: "Incomplete",
  hasDraft: false,
  activeDraftCount: 0,
});

export const EMPTY_SCENARIO_AUTHORING_UI_VIEW: ScenarioAuthoringUiView = Object.freeze({
  version: SCENARIO_AUTHORING_UI_VERSION,
  phase: "empty",
  draft: EMPTY_SCENARIO_AUTHORING_DRAFT_VIEW,
  bindingSummary: "Scenario authoring UI is waiting for a persisted draft.",
  draftsOnly: true,
  simulationActive: false,
  simulationResultsStored: false,
  dsMutation: false,
  intelligenceMutation: false,
  sceneMutation: false,
  routingMutation: false,
  topologyMutation: false,
  revision: 0,
  diagnostics: SCENARIO_AUTHORING_UI_DIAGNOSTICS,
});
