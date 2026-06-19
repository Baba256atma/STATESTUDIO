import type { ScenarioDraft, ScenarioDraftChange } from "./scenarioAuthoringContract.ts";
import {
  readScenarioDraftRegistryEntry,
} from "./ScenarioDraftRegistry.ts";
import {
  EMPTY_SCENARIO_SIMULATION_RESULT,
  SCENARIO_SIMULATION_RUNTIME_DIAGNOSTICS,
  SCENARIO_SIMULATION_RUNTIME_VERSION,
  type ScenarioSimulationMetadata,
  type ScenarioSimulationRequest,
  type ScenarioSimulationResult,
} from "./scenarioSimulationRuntimeContract.ts";

let latestScenarioSimulationResult: ScenarioSimulationResult =
  EMPTY_SCENARIO_SIMULATION_RESULT;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nowIso(): string {
  return new Date().toISOString();
}

function createSimulationId(draftId: string): string {
  const normalized = draftId.replace(/[^a-z0-9:-]+/gi, "-").toLowerCase();
  return `scenario-simulation:${normalized}:${Date.now().toString(36)}`;
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

function buildBlockedResult(message: string): ScenarioSimulationResult {
  return Object.freeze({
    ...EMPTY_SCENARIO_SIMULATION_RESULT,
    validationMessages: Object.freeze([message]),
  });
}

function isSimulationReadyDraft(draft: ScenarioDraft): boolean {
  return (
    draft.validationState === "valid" &&
    draft.readOnlyIntelligence === true &&
    draft.simulationActive === false &&
    draft.sceneMutation === false &&
    draft.routingMutation === false &&
    draft.topologyMutation === false
  );
}

function calculateReadinessScore(draft: ScenarioDraft): number {
  if (!isSimulationReadyDraft(draft)) return 0;
  const assumptionScore = Math.min(draft.assumptions.length, 4) * 10;
  const focusScore = Math.min(draft.focusObjectIds.length, 4) * 10;
  const changeScore = Math.min(draft.changes.length, 6) * 5;
  return Math.min(100, 40 + assumptionScore + focusScore + changeScore);
}

function buildSimulationMetadata(input: {
  draft: ScenarioDraft;
  registryStatus: ScenarioSimulationMetadata["registryStatus"];
}): ScenarioSimulationMetadata {
  const simulatedAt = nowIso();
  return Object.freeze({
    simulationId: createSimulationId(input.draft.draftId),
    draftId: input.draft.draftId,
    draftName: input.draft.name,
    scenarioType: input.draft.scenarioType,
    sourceDraftUpdatedAt: input.draft.metadata.updatedAt,
    simulatedAt,
    savedDraftConsumed: true as const,
    registryStatus: input.registryStatus,
    immutable: true as const,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
  });
}

function buildSimulationSummary(draft: ScenarioDraft, readinessScore: number): string {
  return [
    `Scenario simulation runtime consumed saved draft ${draft.draftId}.`,
    `Draft type ${draft.scenarioType} is ${draft.validationState}.`,
    `Readiness score ${readinessScore}.`,
    "No scene, DS, draft, topology, or routing mutation performed.",
  ].join(" ");
}

export function runScenarioSimulation(
  request: ScenarioSimulationRequest
): ScenarioSimulationResult {
  const draftId = readString(request.draftId);
  if (!draftId) {
    latestScenarioSimulationResult = buildBlockedResult("ScenarioSimulationRequest.draftId is required.");
    return latestScenarioSimulationResult;
  }

  if (request.sceneMutation !== false || request.dsMutation !== false || request.routingMutation !== false) {
    latestScenarioSimulationResult = buildBlockedResult("ScenarioSimulationRequest must disable mutation authority.");
    return latestScenarioSimulationResult;
  }

  const entry = readScenarioDraftRegistryEntry({
    draftId,
    includeArchived: request.includeArchived === true,
  });
  if (!entry) {
    latestScenarioSimulationResult = buildBlockedResult("Saved ScenarioDraft was not found in the S:1 registry.");
    return latestScenarioSimulationResult;
  }

  const draft = freezeScenarioDraft(entry.draft);
  if (!isSimulationReadyDraft(draft)) {
    latestScenarioSimulationResult = Object.freeze({
      ...EMPTY_SCENARIO_SIMULATION_RESULT,
      draft,
      summary: `Saved draft ${draft.draftId} is not simulation ready.`,
      validationMessages: Object.freeze([...draft.validationMessages]),
    });
    return latestScenarioSimulationResult;
  }

  const readinessScore = calculateReadinessScore(draft);
  const metadata = buildSimulationMetadata({ draft, registryStatus: entry.registryStatus });

  latestScenarioSimulationResult = Object.freeze({
    version: SCENARIO_SIMULATION_RUNTIME_VERSION,
    status: "ready" as const,
    draft,
    metadata,
    summary: buildSimulationSummary(draft, readinessScore),
    focusObjectIds: Object.freeze([...draft.focusObjectIds]),
    assumptions: Object.freeze([...draft.assumptions]),
    changeCount: draft.changes.length,
    validationMessages: Object.freeze([]),
    readinessScore,
    savedDraftConsumed: true,
    sceneMutation: false as const,
    dsMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    draftMutation: false as const,
    diagnostics: SCENARIO_SIMULATION_RUNTIME_DIAGNOSTICS,
  });

  return latestScenarioSimulationResult;
}

export function getScenarioSimulationResult(): ScenarioSimulationResult {
  return latestScenarioSimulationResult;
}

export function resetScenarioSimulationRuntimeForTests(): void {
  latestScenarioSimulationResult = EMPTY_SCENARIO_SIMULATION_RESULT;
}

export const ScenarioSimulationRuntime = Object.freeze({
  runScenarioSimulation,
  getScenarioSimulationResult,
  resetScenarioSimulationRuntimeForTests,
  diagnostics: SCENARIO_SIMULATION_RUNTIME_DIAGNOSTICS,
  emptyResult: EMPTY_SCENARIO_SIMULATION_RESULT,
});
