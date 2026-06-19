import type { ScenarioDraft, ScenarioDraftChange } from "./scenarioAuthoringContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
  type ScenarioDraftBaselineReference,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";
import {
  DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTICS,
  DRAFT_TO_SIMULATION_ADAPTER_VERSION,
  EMPTY_DRAFT_TO_SIMULATION_ADAPTER_RESULT,
  type DraftToSimulationAdapterResult,
} from "./draftToSimulationAdapterContract.ts";

let latestDraftToSimulationAdapterResult: DraftToSimulationAdapterResult =
  EMPTY_DRAFT_TO_SIMULATION_ADAPTER_RESULT;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function freezeDraftChange(change: ScenarioDraftChange): ScenarioDraftChange {
  return Object.freeze({ ...change });
}

function freezeScenarioDraft(draft: ScenarioDraft): ScenarioDraft {
  return Object.freeze({
    ...draft,
    assumptions: Object.freeze([...draft.assumptions]),
    focusObjectIds: Object.freeze([...draft.focusObjectIds]),
    validationMessages: Object.freeze([...draft.validationMessages]),
    metadata: Object.freeze({ ...draft.metadata }),
    changes: Object.freeze(draft.changes.map(freezeDraftChange)),
  });
}

function hasArchivedSignal(draft: ScenarioDraft): boolean {
  const record = draft as ScenarioDraft & {
    registryStatus?: unknown;
    archivedAt?: unknown;
  };
  return record.registryStatus === "archived" || readString(record.archivedAt).length > 0;
}

function isValidActiveDraft(draft: ScenarioDraft): boolean {
  return (
    draft.validationState === "valid" &&
    !hasArchivedSignal(draft) &&
    draft.readOnlyIntelligence === true &&
    draft.simulationActive === false &&
    draft.sceneMutation === false &&
    draft.routingMutation === false &&
    draft.topologyMutation === false
  );
}

function buildBaselineReference(draft: ScenarioDraft): ScenarioDraftBaselineReference {
  return Object.freeze({
    baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
    baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
    baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
    inputModelId: draft.draftId,
    preserved: true as const,
  });
}

function rejectedResult(draft: ScenarioDraft | null, reason: string): DraftToSimulationAdapterResult {
  return Object.freeze({
    ...EMPTY_DRAFT_TO_SIMULATION_ADAPTER_RESULT,
    draft: draft ? freezeScenarioDraft(draft) : null,
    reason,
  });
}

export function adaptDraftToSimulationRequest(draft: ScenarioDraft): DraftToSimulationAdapterResult {
  if (!draft || !readString(draft.draftId)) {
    latestDraftToSimulationAdapterResult = rejectedResult(null, "ScenarioDraft.draftId is required.");
    return latestDraftToSimulationAdapterResult;
  }

  if (hasArchivedSignal(draft)) {
    latestDraftToSimulationAdapterResult = rejectedResult(draft, "Archived ScenarioDraft cannot be converted.");
    return latestDraftToSimulationAdapterResult;
  }

  if (!isValidActiveDraft(draft)) {
    latestDraftToSimulationAdapterResult = rejectedResult(draft, "Invalid ScenarioDraft cannot be converted.");
    return latestDraftToSimulationAdapterResult;
  }

  const frozenDraft = freezeScenarioDraft(draft);
  const baselineReference = buildBaselineReference(frozenDraft);
  const request: ScenarioSimulationRequest = Object.freeze({
    draftId: frozenDraft.draftId,
    baselineReference,
    requestedBy: "draft-to-simulation-adapter",
    requestReason: `Convert saved draft ${frozenDraft.draftId} to simulation request.`,
    dryRun: true as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
  });

  latestDraftToSimulationAdapterResult = Object.freeze({
    version: DRAFT_TO_SIMULATION_ADAPTER_VERSION,
    status: "ready" as const,
    draft: frozenDraft,
    request,
    baselineReference,
    reason: "ScenarioDraft converted to ScenarioSimulationRequest.",
    simulationExecution: false as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    draftMutation: false as const,
    diagnostics: DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTICS,
  });

  return latestDraftToSimulationAdapterResult;
}

export function getDraftToSimulationAdapterResult(): DraftToSimulationAdapterResult {
  return latestDraftToSimulationAdapterResult;
}

export function resetDraftToSimulationAdapterForTests(): void {
  latestDraftToSimulationAdapterResult = EMPTY_DRAFT_TO_SIMULATION_ADAPTER_RESULT;
}

export const DraftToSimulationAdapter = Object.freeze({
  adaptDraftToSimulationRequest,
  getDraftToSimulationAdapterResult,
  resetDraftToSimulationAdapterForTests,
  diagnostics: DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTICS,
  emptyResult: EMPTY_DRAFT_TO_SIMULATION_ADAPTER_RESULT,
});
