/**
 * D7:1:8 — War-room orchestration guard rails.
 */

import type { StrategicDecisionType } from "../decision/strategicDecisionTypes.ts";
import type {
  OrchestrateWarRoomSimulationInput,
  WarRoomInterventionStep,
  WarRoomSimulationSession,
} from "./warRoomTypes.ts";
import { logWarRoomDev } from "./warRoomDevLog.ts";

export type WarRoomGuardCode =
  | "empty_session_id"
  | "stale_session"
  | "orchestration_loop"
  | "invalid_scenario_reference"
  | "too_many_scenarios"
  | "too_many_interventions"
  | "duplicate_intervention"
  | "conflicting_interventions"
  | "invalid_sync_tick"
  | "duplicate_orchestration"
  | "missing_baseline_scenario"
  | "scenario_isolation_violation";

export type WarRoomGuardResult =
  | { ok: true }
  | { ok: false; code: WarRoomGuardCode; message: string };

export const DEFAULT_MAX_WAR_ROOM_SCENARIOS = 8;
export const DEFAULT_MAX_INTERVENTION_STEPS = 12;

const CONFLICTING_DECISION_PAIRS: ReadonlyArray<readonly [StrategicDecisionType, StrategicDecisionType]> = [
  ["operational_pause", "expansion"],
  ["operational_pause", "capacity_increase"],
  ["cost_reduction", "expansion"],
];

function reject(code: WarRoomGuardCode, message: string): WarRoomGuardResult {
  const result = { ok: false as const, code, message };
  logWarRoomDev("WarRoomGuard", { code, message });
  return result;
}

export function interventionsConflict(
  a: StrategicDecisionType,
  b: StrategicDecisionType
): boolean {
  return CONFLICTING_DECISION_PAIRS.some(
    ([left, right]) =>
      (left === a && right === b) || (left === b && right === a)
  );
}

export function guardWarRoomSession(session: WarRoomSimulationSession): WarRoomGuardResult {
  if (!String(session.sessionId ?? "").trim()) {
    return reject("empty_session_id", "War-room session id is required");
  }
  if (session.status === "completed") {
    return reject("stale_session", "Cannot orchestrate a completed war-room session");
  }
  return { ok: true };
}

export function guardOrchestrateWarRoomSimulation(
  input: OrchestrateWarRoomSimulationInput
): WarRoomGuardResult {
  const sessionGuard = guardWarRoomSession(input.session);
  if (!sessionGuard.ok) return sessionGuard;

  if (input.session.status === "running") {
    return reject("orchestration_loop", "Session orchestration is already in progress");
  }

  if (input.scenarioSlots.length > DEFAULT_MAX_WAR_ROOM_SCENARIOS) {
    return reject(
      "too_many_scenarios",
      `War-room supports at most ${DEFAULT_MAX_WAR_ROOM_SCENARIOS} scenarios`
    );
  }

  const interventions = [...(input.interventions ?? [])].sort(
    (a, b) => a.stepIndex - b.stepIndex
  );
  if (interventions.length > DEFAULT_MAX_INTERVENTION_STEPS) {
    return reject(
      "too_many_interventions",
      `At most ${DEFAULT_MAX_INTERVENTION_STEPS} interventions per orchestration`
    );
  }

  const slotIds = new Set(input.scenarioSlots.map((s) => s.scenarioId));
  if (!slotIds.has(input.session.baselineScenarioId)) {
    return reject("missing_baseline_scenario", "Baseline scenario must be registered in the session");
  }

  for (const slot of input.scenarioSlots) {
    if (!input.timelinesByScenarioId[slot.scenarioId]) {
      return reject(
        "invalid_scenario_reference",
        `Missing timeline for scenario ${slot.scenarioId}`
      );
    }
    const forestTimeline = input.forest.timelinesById[slot.timelineId];
    if (!forestTimeline && !input.timelinesByScenarioId[slot.scenarioId]) {
      return reject(
        "scenario_isolation_violation",
        `Scenario ${slot.scenarioId} is not registered in the branch forest`
      );
    }
  }

  const seenDecisionIds = new Set<string>();
  const perScenarioSteps = new Map<string, WarRoomInterventionStep[]>();

  for (const step of interventions) {
    if (!slotIds.has(step.targetScenarioId)) {
      return reject(
        "invalid_scenario_reference",
        `Intervention targets unknown scenario ${step.targetScenarioId}`
      );
    }
    if (seenDecisionIds.has(step.decision.decisionId)) {
      return reject("duplicate_intervention", `Duplicate intervention id ${step.decision.decisionId}`);
    }
    seenDecisionIds.add(step.decision.decisionId);

    const bucket = perScenarioSteps.get(step.targetScenarioId) ?? [];
    for (const prev of bucket) {
      if (prev.stepIndex === step.stepIndex) {
        if (interventionsConflict(prev.decision.type, step.decision.type)) {
          return reject(
            "conflicting_interventions",
            `Conflicting interventions at step ${step.stepIndex} on ${step.targetScenarioId}`
          );
        }
      }
    }
    bucket.push(step);
    perScenarioSteps.set(step.targetScenarioId, bucket);
  }

  if (input.syncAtTick != null) {
    const syncTick = Math.floor(Number(input.syncAtTick));
    const ticks = input.scenarioSlots.map(
      (s) => input.timelinesByScenarioId[s.scenarioId]?.currentTick ?? 0
    );
    const maxTick = Math.max(...ticks, 0);
    if (syncTick > maxTick) {
      return reject("invalid_sync_tick", `Sync tick ${syncTick} exceeds scenario bounds`);
    }
  }

  const pendingFingerprint = buildOrchestrationRequestFingerprint(input);
  if (
    pendingFingerprint &&
    (input.priorOrchestrationFingerprints ?? []).includes(pendingFingerprint)
  ) {
    return reject("duplicate_orchestration", "Identical orchestration was already executed");
  }

  return { ok: true };
}

export function buildOrchestrationRequestFingerprint(
  input: OrchestrateWarRoomSimulationInput
): string {
  const interventions = [...(input.interventions ?? [])]
    .sort((a, b) => a.stepIndex - b.stepIndex)
    .map((s) => ({
      stepIndex: s.stepIndex,
      decisionId: s.decision.decisionId,
      type: s.decision.type,
      target: s.targetScenarioId,
    }));
  const scenarios = input.scenarioSlots
    .map((s) => `${s.scenarioId}:${s.timelineId}`)
    .sort()
    .join("|");
  return JSON.stringify({
    sessionId: input.session.sessionId,
    scenarios,
    interventions,
    syncAtTick: input.syncAtTick ?? null,
    runComparisons: Boolean(input.runComparisons),
  });
}
