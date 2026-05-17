/**
 * D7:1:8 — Executive war-room simulation orchestration engine.
 */

import type { ScenarioComparisonPanelContract } from "../comparison/scenarioComparisonTypes.ts";
import type {
  CreateWarRoomSessionInput,
  OrchestrateWarRoomSimulationInput,
  WarRoomOrchestrationResult,
  WarRoomOrchestrationSnapshot,
  WarRoomOrchestrationState,
  WarRoomPanelOrchestrationContract,
  WarRoomSimulationSession,
} from "./warRoomTypes.ts";
import {
  buildOrchestrationRequestFingerprint,
  guardOrchestrateWarRoomSimulation,
} from "./warRoomGuards.ts";
import {
  appendComparisonHistory,
  appendInterventionHistory,
  appendSyncHistory,
  createEmptyWarRoomSessionHistory,
  freezeWarRoomSessionHistory,
  recordWarRoomEvent,
} from "./warRoomSessionHistory.ts";
import { applyWarRoomInterventionSequence } from "./interventionSequencing.ts";
import {
  runCoordinatedScenarioComparison,
  scenarioRiskLevelForSlot,
  synchronizeWarRoomTimelines,
} from "./multiScenarioCoordination.ts";
import { buildExecutiveWarRoomSessionNarrative } from "./executiveWarRoomNarratives.ts";
import { logWarRoomDev } from "./warRoomDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function sessionCreatedAt(): string {
  return new Date(Date.UTC(2026, 0, 1)).toISOString();
}

export function createWarRoomSimulationSession(
  input: CreateWarRoomSessionInput
): {
  session: WarRoomSimulationSession;
  state: WarRoomOrchestrationState;
  history: ReturnType<typeof createEmptyWarRoomSessionHistory>;
} {
  const sessionId = String(input.sessionId).trim();
  const baselineScenarioId = input.baselineScenarioId ?? "baseline";
  const scenarioIds = Object.freeze(
    [...(input.scenarioIds ?? [baselineScenarioId])].sort()
  );

  const session: WarRoomSimulationSession = Object.freeze({
    sessionId,
    title: String(input.title ?? "Executive war-room session").trim() || "Executive war-room session",
    createdAt: sessionCreatedAt(),
    activeScenarioIds: scenarioIds,
    status: "prepared",
    baselineScenarioId,
  });

  const state: WarRoomOrchestrationState = Object.freeze({
    activeTimelineIds: Object.freeze([]),
    comparisonIds: Object.freeze([]),
    interventionQueueIds: Object.freeze([]),
    focusedScenarioId: baselineScenarioId,
  });

  let history = createEmptyWarRoomSessionHistory(sessionId);
  history = recordWarRoomEvent(
    history,
    "session_created",
    `War-room session "${session.title}" prepared with ${scenarioIds.length} scenario(s).`
  );

  logWarRoomDev("SimulationSession", { sessionId, scenarioCount: scenarioIds.length });

  return { session, state, history };
}

export function buildWarRoomPanelContract(input: {
  session: WarRoomSimulationSession;
  state: WarRoomOrchestrationState;
  scenarioSlots: WarRoomOrchestrationSnapshot["scenarioSlots"];
  timelinesByScenarioId: Readonly<Record<string, import("../timeline/timelineTypes.ts").OperationalTimeline>>;
  syncTick: number;
  narrativeHeadline: string;
  interventionSteps: readonly { stepIndex: number; decisionId: string; decisionType: string; targetScenarioId: string; applied: boolean }[];
  comparisonPanel?: ScenarioComparisonPanelContract;
}): WarRoomPanelOrchestrationContract {
  const scenarioRows = input.scenarioSlots
    .map((slot) => ({
      scenarioId: slot.scenarioId,
      label: slot.label,
      timelineId: input.timelinesByScenarioId[slot.scenarioId]?.timelineId ?? slot.timelineId,
      currentTick: input.timelinesByScenarioId[slot.scenarioId]?.currentTick ?? 0,
      role: slot.role,
      riskLevel: scenarioRiskLevelForSlot(slot, input.timelinesByScenarioId, input.syncTick),
    }))
    .sort((a, b) => a.scenarioId.localeCompare(b.scenarioId));

  return Object.freeze({
    sessionId: input.session.sessionId,
    title: input.session.title,
    status: input.session.status,
    focusedScenarioId: input.state.focusedScenarioId,
    scenarioRows: Object.freeze(scenarioRows),
    interventionQueue: Object.freeze(
      input.interventionSteps.map((s) =>
        Object.freeze({
          stepIndex: s.stepIndex,
          decisionId: s.decisionId,
          decisionType: s.decisionType,
          targetScenarioId: s.targetScenarioId,
          status: s.applied ? ("applied" as const) : ("queued" as const),
        })
      )
    ),
    comparisonPanel: input.comparisonPanel,
    narrativeHeadline: input.narrativeHeadline,
    viewHint:
      input.comparisonPanel && input.scenarioSlots.length > 2
        ? "comparison_ranking"
        : input.interventionSteps.length > 0
          ? "intervention_queue"
          : "scenario_matrix",
  });
}

/**
 * Coordinate multi-scenario exploration, intervention sequencing, and comparisons.
 * Never mutates the branch forest or source timelines in `timelinesByScenarioId` inputs.
 */
export function orchestrateWarRoomSimulation(
  input: OrchestrateWarRoomSimulationInput
): WarRoomOrchestrationResult {
  const guard = guardOrchestrateWarRoomSimulation(input);
  if (!guard.ok) return { ok: false, guard };

  const requestFingerprint = buildOrchestrationRequestFingerprint(input);

  logWarRoomDev("WarRoom", {
    sessionId: input.session.sessionId,
    scenarios: input.scenarioSlots.length,
    interventions: input.interventions?.length ?? 0,
  });

  let history = recordWarRoomEvent(
    input.history,
    "orchestration_started",
    `Orchestration started for session ${input.session.sessionId}.`
  );

  let workingTimelines: Readonly<Record<string, import("../timeline/timelineTypes.ts").OperationalTimeline>> = {
    ...input.timelinesByScenarioId,
  };

  let interventionOutcomes: WarRoomOrchestrationSnapshot["interventionOutcomes"] = [];

  if (input.interventions && input.interventions.length > 0) {
    const sequence = applyWarRoomInterventionSequence({
      interventions: input.interventions,
      timelinesByScenarioId: workingTimelines,
      resourceAvailability: input.resourceAvailability,
    });

    if (!("timelinesByScenarioId" in sequence)) {
      return {
        ok: false,
        guard: {
          ok: false,
          code: "conflicting_interventions",
          message: sequence.message,
        },
      };
    }

    workingTimelines = sequence.timelinesByScenarioId;
    interventionOutcomes = sequence.outcomes;

    for (const entry of sequence.historyEntries) {
      history = appendInterventionHistory(history, entry);
      history = recordWarRoomEvent(
        history,
        "intervention_applied",
        `Intervention ${entry.decisionId} applied to ${entry.targetScenarioId}.`,
        { scenarioId: entry.targetScenarioId }
      );
    }
  }

  const syncRecord = synchronizeWarRoomTimelines({
    scenarioSlots: input.scenarioSlots,
    timelinesByScenarioId: workingTimelines,
    syncAtTick: input.syncAtTick,
  });
  history = appendSyncHistory(history, syncRecord);
  history = recordWarRoomEvent(
    history,
    "timelines_synchronized",
    `Timelines synchronized at tick ${syncRecord.syncTick}.`,
    { tick: syncRecord.syncTick }
  );

  let comparisonSnapshots: WarRoomOrchestrationSnapshot["comparisonSnapshots"] = [];
  let comparisonPanel: ScenarioComparisonPanelContract | undefined;

  if (input.runComparisons !== false && input.scenarioSlots.length > 1) {
    const comparison = runCoordinatedScenarioComparison({
      baselineScenarioId: input.session.baselineScenarioId,
      scenarioSlots: input.scenarioSlots,
      timelinesByScenarioId: workingTimelines,
      forest: input.forest,
      syncTick: syncRecord.syncTick,
    });

    if (comparison.ok) {
      comparisonSnapshots = comparison.snapshots;
      comparisonPanel = comparison.result.panelContract;
      for (const snap of comparison.snapshots) {
        history = appendComparisonHistory(history, {
          comparisonId: snap.comparison.comparisonId,
          compareAtTick: snap.compareAtTick,
          comparedScenarioIds: [...snap.comparison.comparedScenarioIds],
          fingerprint: snap.fingerprint,
        });
      }
      history = recordWarRoomEvent(
        history,
        "comparison_completed",
        `Completed ${comparison.snapshots.length} scenario comparison(s) at tick ${syncRecord.syncTick}.`,
        { tick: syncRecord.syncTick }
      );
    }
  }

  const narrative = buildExecutiveWarRoomSessionNarrative({
    sessionTitle: input.session.title,
    scenarioSlots: input.scenarioSlots,
    syncRecord,
    comparisonSnapshots,
    interventionCount: interventionOutcomes.length,
  });

  history = recordWarRoomEvent(
    history,
    "orchestration_completed",
    narrative.summary
  );
  history = freezeWarRoomSessionHistory(history);

  const updatedSession: WarRoomSimulationSession = Object.freeze({
    ...input.session,
    status: "completed",
    activeScenarioIds: Object.freeze(
      input.scenarioSlots.map((s) => s.scenarioId).sort()
    ),
  });

  const updatedState: WarRoomOrchestrationState = Object.freeze({
    activeTimelineIds: Object.freeze(
      input.scenarioSlots
        .map((s) => workingTimelines[s.scenarioId]?.timelineId ?? s.timelineId)
        .sort()
    ),
    comparisonIds: Object.freeze(
      comparisonSnapshots.map((s) => s.comparison.comparisonId).sort()
    ),
    interventionQueueIds: Object.freeze(
      (input.interventions ?? []).map((i) => i.decision.decisionId).sort()
    ),
    focusedScenarioId: input.state.focusedScenarioId ?? input.session.baselineScenarioId,
    lastSyncTick: syncRecord.syncTick,
  });

  const fingerprint = stableStringify({
    requestFingerprint,
    history: history.fingerprint,
    syncTick: syncRecord.syncTick,
    interventionCount: interventionOutcomes.length,
    comparisonCount: comparisonSnapshots.length,
  });

  const snapshot: WarRoomOrchestrationSnapshot = Object.freeze({
    session: updatedSession,
    state: updatedState,
    history,
    narrative: Object.freeze({
      ...narrative,
      scenarioSummaries: Object.freeze([...narrative.scenarioSummaries]),
      bullets: Object.freeze([...narrative.bullets]),
    }),
    scenarioSlots: Object.freeze(input.scenarioSlots.map((s) => Object.freeze({ ...s }))),
    workingTimelinesByScenarioId: Object.freeze(workingTimelines),
    interventionOutcomes: Object.freeze([...interventionOutcomes]),
    comparisonSnapshots: Object.freeze([...comparisonSnapshots]),
    syncRecord,
    fingerprint,
  });

  const panelContract = buildWarRoomPanelContract({
    session: updatedSession,
    state: updatedState,
    scenarioSlots: snapshot.scenarioSlots,
    timelinesByScenarioId: workingTimelines,
    syncTick: syncRecord.syncTick,
    narrativeHeadline: narrative.headline,
    interventionSteps: (input.interventions ?? []).map((step) => ({
      stepIndex: step.stepIndex,
      decisionId: step.decision.decisionId,
      decisionType: step.decision.type,
      targetScenarioId: step.targetScenarioId,
      applied: interventionOutcomes.some((o) => o.decisionId === step.decision.decisionId),
    })),
    comparisonPanel,
  });

  logWarRoomDev("Orchestration", {
    sessionId: input.session.sessionId,
    fingerprint,
    syncTick: syncRecord.syncTick,
  });

  return { ok: true, snapshot, panelContract };
}

export function focusWarRoomScenario(
  session: WarRoomSimulationSession,
  state: WarRoomOrchestrationState,
  scenarioId: string
): WarRoomOrchestrationState | null {
  if (!session.activeScenarioIds.includes(scenarioId)) return null;
  return Object.freeze({
    ...state,
    focusedScenarioId: scenarioId,
  });
}

export function freezeWarRoomOrchestrationSnapshot(
  snapshot: WarRoomOrchestrationSnapshot
): WarRoomOrchestrationSnapshot {
  return Object.freeze({
    ...snapshot,
    session: Object.freeze({ ...snapshot.session }),
    state: Object.freeze({ ...snapshot.state }),
    history: freezeWarRoomSessionHistory(snapshot.history),
    narrative: Object.freeze({ ...snapshot.narrative }),
    scenarioSlots: Object.freeze(snapshot.scenarioSlots.map((s) => Object.freeze({ ...s }))),
    workingTimelinesByScenarioId: Object.freeze({ ...snapshot.workingTimelinesByScenarioId }),
    interventionOutcomes: Object.freeze([...snapshot.interventionOutcomes]),
    comparisonSnapshots: Object.freeze([...snapshot.comparisonSnapshots]),
  });
}
