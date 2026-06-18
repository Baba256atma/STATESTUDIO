/**
 * S:1 — Scenario Draft Builder contract.
 *
 * Converts ScenarioInputModel into immutable ScenarioDraft records. Preserves
 * baseline references without simulation execution or DS mutation.
 */

import type { ScenarioAuthoringType, ScenarioDraft, ScenarioDraftMetadata } from "./scenarioAuthoringContract.ts";
import type { ScenarioInputModel } from "./scenarioInputModelContract.ts";
import { EMPTY_SCENARIO_INPUT_MODEL } from "./scenarioInputModelContract.ts";
import { SCENARIO_TYPE_LABELS } from "../scenario-intelligence/scenarioGenerationContract.ts";

export const SCENARIO_DRAFT_BUILDER_DIAGNOSTIC = "[SCENARIO_DRAFT_BUILDER]" as const;

export const SCENARIO_DRAFT_READY_DIAGNOSTIC = "[SCENARIO_DRAFT_READY]" as const;

export const S1_DRAFT_BUILDER_COMPLETE_TAG = "[S1_DRAFT_BUILDER_COMPLETE]" as const;

export const SCENARIO_DRAFT_BUILDER_VERSION = "1.0.0" as const;

export const SCENARIO_DRAFT_BASELINE_SCENARIO_ID = "scenario:baseline" as const;

export const SCENARIO_DRAFT_BASELINE_DRAFT_ID = "baseline" as const;

export const SCENARIO_DRAFT_BASELINE_LABEL = "Baseline Scenario" as const;

export type ScenarioDraftBaselineReference = Readonly<{
  baselineScenarioId: typeof SCENARIO_DRAFT_BASELINE_SCENARIO_ID;
  baselineDraftId: typeof SCENARIO_DRAFT_BASELINE_DRAFT_ID;
  baselineLabel: typeof SCENARIO_DRAFT_BASELINE_LABEL;
  inputModelId: string;
  preserved: true;
}>;

export type ScenarioDraftBuilderResult = Readonly<{
  version: typeof SCENARIO_DRAFT_BUILDER_VERSION;
  draft: ScenarioDraft;
  draftId: string;
  draftName: string;
  draftSummary: string;
  draftMetadata: ScenarioDraftMetadata;
  baselineReference: ScenarioDraftBaselineReference;
  inputModel: ScenarioInputModel;
  builderSummary: string;
  simulationActive: false;
  executionActive: false;
  dsMutation: false;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  topologyMutation: false;
  diagnostics: readonly [
    typeof SCENARIO_DRAFT_BUILDER_DIAGNOSTIC,
    typeof SCENARIO_DRAFT_READY_DIAGNOSTIC,
  ];
}>;

export type ScenarioDraftBuilderBuildInput = Readonly<{
  inputModel: ScenarioInputModel;
  draftId?: string;
  name?: string;
  scenarioType?: ScenarioAuthoringType;
  summary?: string;
  description?: string;
  author?: string;
  source?: ScenarioDraftMetadata["source"];
}>;

export const SCENARIO_DRAFT_BUILDER_DIAGNOSTICS = Object.freeze([
  SCENARIO_DRAFT_BUILDER_DIAGNOSTIC,
  SCENARIO_DRAFT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_DRAFT_BUILDER_RESULT: ScenarioDraftBuilderResult = Object.freeze({
  version: SCENARIO_DRAFT_BUILDER_VERSION,
  draft: Object.freeze({
    draftId: "",
    name: "",
    scenarioType: "baseline",
    summary: "",
    description: "",
    assumptions: Object.freeze([]),
    focusObjectIds: Object.freeze([]),
    validationState: "invalid",
    validationMessages: Object.freeze(["No scenario input model is available."]),
    metadata: Object.freeze({
      draftId: "",
      createdAt: "",
      updatedAt: "",
      author: "system",
      source: "system",
      intelligenceReadOnly: true,
    }),
    changes: Object.freeze([]),
    readOnlyIntelligence: true,
    simulationActive: false,
    sceneMutation: false,
    routingMutation: false,
    topologyMutation: false,
  }),
  draftId: "",
  draftName: "",
  draftSummary: "",
  draftMetadata: Object.freeze({
    draftId: "",
    createdAt: "",
    updatedAt: "",
    author: "system",
    source: "system",
    intelligenceReadOnly: true,
  }),
  baselineReference: Object.freeze({
    baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
    baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
    baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
    inputModelId: "",
    preserved: true,
  }),
  inputModel: EMPTY_SCENARIO_INPUT_MODEL,
  builderSummary: "No scenario draft builder result is available.",
  simulationActive: false,
  executionActive: false,
  dsMutation: false,
  sceneMutation: false,
  objectMutation: false,
  routingMutation: false,
  topologyMutation: false,
  diagnostics: SCENARIO_DRAFT_BUILDER_DIAGNOSTICS,
});

export const SCENARIO_DRAFT_BASELINE_REFERENCE_LABEL =
  SCENARIO_TYPE_LABELS.baseline;
