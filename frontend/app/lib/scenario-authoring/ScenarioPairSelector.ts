import type { ScenarioDraft, ScenarioDraftChange } from "./scenarioAuthoringContract.ts";
import {
  buildScenarioComparisonRequest,
  type ScenarioComparisonMode,
  type ScenarioComparisonSubject,
} from "./ScenarioComparisonContract.ts";
import type { ExecutiveSimulationSummary } from "./simulationResultAggregatorContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  SIMULATION_RESULT_AGGREGATOR_VERSION,
} from "./simulationResultAggregatorContract.ts";
import {
  EMPTY_SCENARIO_PAIR_SELECTOR_RESULT,
  SCENARIO_PAIR_SELECTOR_DIAGNOSTICS,
  SCENARIO_PAIR_SELECTOR_VERSION,
  type ScenarioPairSelectionCandidate,
  type ScenarioPairSelectionMode,
  type ScenarioPairSelectorInput,
  type ScenarioPairSelectorResult,
} from "./scenarioPairSelectorContract.ts";

let latestScenarioPairSelectorResult: ScenarioPairSelectorResult =
  EMPTY_SCENARIO_PAIR_SELECTOR_RESULT;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function freezeDraftChange(change: ScenarioDraftChange): ScenarioDraftChange {
  return Object.freeze({ ...change });
}

function freezeDraft(draft: ScenarioDraft): ScenarioDraft {
  return Object.freeze({
    ...draft,
    assumptions: Object.freeze([...draft.assumptions]),
    focusObjectIds: Object.freeze([...draft.focusObjectIds]),
    validationMessages: Object.freeze([...draft.validationMessages]),
    metadata: Object.freeze({ ...draft.metadata }),
    changes: Object.freeze(draft.changes.map(freezeDraftChange)),
  });
}

function freezeSummary(summary: ExecutiveSimulationSummary): ExecutiveSimulationSummary {
  return Object.freeze({
    ...summary,
    request: Object.freeze({
      ...summary.request,
      baselineReference: summary.request.baselineReference
        ? Object.freeze({ ...summary.request.baselineReference })
        : undefined,
    }),
    keyPositiveEffects: Object.freeze([...summary.keyPositiveEffects]),
    keyNegativeEffects: Object.freeze([...summary.keyNegativeEffects]),
    riskMovement: Object.freeze({ ...summary.riskMovement }),
    kpiMovement: Object.freeze({ ...summary.kpiMovement }),
    diagnostics: Object.freeze([...summary.diagnostics]) as ExecutiveSimulationSummary["diagnostics"],
  });
}

function draftToSummary(draft: ScenarioDraft): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    version: SIMULATION_RESULT_AGGREGATOR_VERSION,
    request: Object.freeze({
      draftId: draft.draftId,
      dryRun: true as const,
      sceneMutation: false as const,
      dsMutation: false as const,
      routingMutation: false as const,
    }),
    overallScenarioImpact: draft.scenarioType === "baseline" ? 50 : 55,
    keyPositiveEffects: Object.freeze(draft.assumptions.slice(0, 2)),
    keyNegativeEffects: Object.freeze(draft.validationMessages.slice(0, 2)),
    confidence: draft.validationState === "valid" ? 70 : 0,
    objectCount: draft.focusObjectIds.length,
    readOnly: true as const,
    routingMutation: false as const,
  });
}

function isArchived(candidate: ScenarioPairSelectionCandidate): boolean {
  const source = candidate.draft ?? candidate.simulation;
  const record = source as Record<string, unknown> | null | undefined;
  return record?.registryStatus === "archived" || readString(record?.archivedAt).length > 0;
}

function isValidDraft(candidate: ScenarioPairSelectionCandidate): candidate is ScenarioPairSelectionCandidate & { draft: ScenarioDraft } {
  const draft = candidate.draft;
  return (
    candidate.kind === "draft" &&
    draft != null &&
    readString(draft.draftId).length > 0 &&
    draft.validationState === "valid" &&
    draft.readOnlyIntelligence === true &&
    draft.simulationActive === false &&
    draft.sceneMutation === false &&
    draft.routingMutation === false &&
    draft.topologyMutation === false &&
    !isArchived(candidate)
  );
}

function isValidSimulation(
  candidate: ScenarioPairSelectionCandidate
): candidate is ScenarioPairSelectionCandidate & { simulation: ExecutiveSimulationSummary } {
  const simulation = candidate.simulation;
  return (
    candidate.kind === "simulation" &&
    simulation != null &&
    readString(simulation.request.draftId).length > 0 &&
    simulation.readOnly === true &&
    simulation.uiRendering === false &&
    simulation.routingMutation === false &&
    !isArchived(candidate)
  );
}

function candidateId(candidate: ScenarioPairSelectionCandidate): string {
  if (candidate.kind === "draft") return readString(candidate.draft?.draftId);
  return readString(candidate.simulation?.request.draftId);
}

function validateMode(input: ScenarioPairSelectorInput): string | null {
  if (!readString(input.comparisonId)) return "Scenario pair comparisonId is required.";
  if (input.mode === "draft_vs_draft") {
    if (!isValidDraft(input.scenarioA) || !isValidDraft(input.scenarioB)) {
      return "Draft A vs Draft B requires two valid active drafts.";
    }
  } else if (input.mode === "simulation_vs_simulation") {
    if (!isValidSimulation(input.scenarioA) || !isValidSimulation(input.scenarioB)) {
      return "Simulation A vs Simulation B requires two valid simulation summaries.";
    }
  } else if (input.mode === "baseline_vs_simulation") {
    const baselineValid =
      (isValidDraft(input.scenarioA) && input.scenarioA.baseline === true) ||
      (isValidSimulation(input.scenarioA) && input.scenarioA.baseline === true);
    if (!baselineValid || !isValidSimulation(input.scenarioB)) {
      return "Baseline vs Simulation requires baseline candidate A and simulation candidate B.";
    }
  } else {
    return "Unsupported scenario pair selection mode.";
  }

  const leftId = candidateId(input.scenarioA);
  const rightId = candidateId(input.scenarioB);
  if (!leftId || !rightId || leftId === rightId) {
    return "Scenario pair requires two distinct scenario identifiers.";
  }
  return null;
}

function toSubject(candidate: ScenarioPairSelectionCandidate): ScenarioComparisonSubject {
  if (candidate.kind === "draft" && candidate.draft) {
    const draft = freezeDraft(candidate.draft);
    return Object.freeze({
      scenarioId: draft.draftId,
      label: draft.name || draft.draftId,
      summary: draftToSummary(draft),
      baseline: candidate.baseline === true || draft.scenarioType === "baseline",
    });
  }
  const simulation = freezeSummary(candidate.simulation as ExecutiveSimulationSummary);
  return Object.freeze({
    scenarioId: simulation.request.draftId,
    label: simulation.request.draftId,
    summary: simulation,
    baseline: candidate.baseline === true,
  });
}

function comparisonMode(mode: ScenarioPairSelectionMode): ScenarioComparisonMode {
  return mode === "baseline_vs_simulation" ? "scenario_vs_baseline" : "scenario_vs_scenario";
}

function result(
  accepted: boolean,
  mode: ScenarioPairSelectionMode,
  reason: string,
  comparisonRequest: ScenarioPairSelectorResult["comparisonRequest"]
): ScenarioPairSelectorResult {
  return Object.freeze({
    version: SCENARIO_PAIR_SELECTOR_VERSION,
    accepted,
    reason,
    mode,
    comparisonRequest,
    simulationExecution: false as const,
    readOnly: true as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
    diagnostics: SCENARIO_PAIR_SELECTOR_DIAGNOSTICS,
  });
}

export function selectScenarioPair(input: ScenarioPairSelectorInput): ScenarioPairSelectorResult {
  const rejectionReason = validateMode(input);
  if (rejectionReason) {
    latestScenarioPairSelectorResult = result(false, input.mode, rejectionReason, null);
    return latestScenarioPairSelectorResult;
  }

  const comparisonRequest = buildScenarioComparisonRequest({
    comparisonId: input.comparisonId,
    mode: comparisonMode(input.mode),
    scenarioA: toSubject(input.scenarioA),
    scenarioB: toSubject(input.scenarioB),
  });

  latestScenarioPairSelectorResult = result(
    true,
    input.mode,
    "Scenario pair accepted for comparison.",
    comparisonRequest
  );
  return latestScenarioPairSelectorResult;
}

export function getScenarioPairSelectorResult(): ScenarioPairSelectorResult {
  return latestScenarioPairSelectorResult;
}

export function resetScenarioPairSelectorForTests(): void {
  latestScenarioPairSelectorResult = EMPTY_SCENARIO_PAIR_SELECTOR_RESULT;
}

export const ScenarioPairSelector = Object.freeze({
  selectScenarioPair,
  getScenarioPairSelectorResult,
  resetScenarioPairSelectorForTests,
  diagnostics: SCENARIO_PAIR_SELECTOR_DIAGNOSTICS,
  emptyResult: EMPTY_SCENARIO_PAIR_SELECTOR_RESULT,
});
