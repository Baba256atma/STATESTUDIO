/**
 * W:1 — Action Priority Engine.
 *
 * Ranks executive attention priorities from War Room signals, alerts, and
 * pressure scores. Read-only only; no mutation, routing, rendering, scene,
 * topology, DS, object, or simulation authority.
 */

import {
  buildWarRoomPriority,
  type WarRoomAlert,
  type WarRoomPriority,
  type WarRoomPriorityLevel,
  type WarRoomSignal,
  type WarRoomSignalSeverity,
} from "./WarRoomContract.ts";
import type { DecisionPressureResult } from "./DecisionPressureEngine.ts";

export const ACTION_PRIORITY_ENGINE_DIAGNOSTIC = "[ACTION_PRIORITY_ENGINE]" as const;

export const ACTION_PRIORITY_READY_DIAGNOSTIC = "[ACTION_PRIORITY_READY]" as const;

export const W1_ACTION_PRIORITY_COMPLETE_TAG = "[W1_ACTION_PRIORITY_COMPLETE]" as const;

export const ACTION_PRIORITY_ENGINE_VERSION = "1.0.0" as const;

export type ExecutiveActionItem = Readonly<{
  actionId: string;
  priorityId: string;
  label: string;
  level: WarRoomPriorityLevel;
  readOnly: true;
  mutation: false;
}>;

export type ExecutiveConcernItem = Readonly<{
  concernId: string;
  priorityId: string;
  label: string;
  level: WarRoomPriorityLevel;
  readOnly: true;
  mutation: false;
}>;

export type ActionPriorityEngineInput = Readonly<{
  rankedAt: string;
  signals: readonly WarRoomSignal[];
  alerts: readonly WarRoomAlert[];
  pressure: DecisionPressureResult;
}>;

export type ActionPriorityEngineResult = Readonly<{
  version: typeof ACTION_PRIORITY_ENGINE_VERSION;
  rankedAt: string;
  priorityQueue: readonly WarRoomPriority[];
  topActions: readonly ExecutiveActionItem[];
  topConcerns: readonly ExecutiveConcernItem[];
  priorityCount: number;
  topActionCount: number;
  topConcernCount: number;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  objectMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof ACTION_PRIORITY_ENGINE_DIAGNOSTIC,
    typeof ACTION_PRIORITY_READY_DIAGNOSTIC,
  ];
}>;

type PriorityCandidate = Readonly<{
  priority: WarRoomPriority;
  score: number;
}>;

export const ACTION_PRIORITY_ENGINE_DIAGNOSTICS = Object.freeze([
  ACTION_PRIORITY_ENGINE_DIAGNOSTIC,
  ACTION_PRIORITY_READY_DIAGNOSTIC,
] as const);

export const EMPTY_ACTION_PRIORITY_ENGINE_RESULT: ActionPriorityEngineResult = Object.freeze({
  version: ACTION_PRIORITY_ENGINE_VERSION,
  rankedAt: "",
  priorityQueue: Object.freeze([]),
  topActions: Object.freeze([]),
  topConcerns: Object.freeze([]),
  priorityCount: 0,
  topActionCount: 0,
  topConcernCount: 0,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  objectMutation: false,
  simulationMutation: false,
  diagnostics: ACTION_PRIORITY_ENGINE_DIAGNOSTICS,
});

let latestActionPriorityEngineResult: ActionPriorityEngineResult =
  EMPTY_ACTION_PRIORITY_ENGINE_RESULT;

function severityScore(severity: WarRoomSignalSeverity): number {
  if (severity === "critical") return 100;
  if (severity === "warning") return 72;
  if (severity === "watch") return 42;
  return 16;
}

function levelFromScore(score: number): WarRoomPriorityLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function levelWeight(level: WarRoomPriorityLevel): number {
  if (level === "critical") return 4;
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}

function signalCandidate(signal: WarRoomSignal, pressure: DecisionPressureResult, index: number): PriorityCandidate {
  const score = Math.min(100, Math.round(severityScore(signal.severity) * 0.7 + pressure.pressureScore * 0.3));
  const level = levelFromScore(score);
  return Object.freeze({
    score,
    priority: buildWarRoomPriority({
      priorityId: `action-priority:signal:${signal.signalId}`,
      level,
      rank: index + 1,
      title: signal.title,
      rationale: `${signal.detail} Pressure score ${pressure.pressureScore}.`,
      relatedSignalIds: [signal.signalId],
      relatedAlertIds: [],
    }),
  });
}

function alertCandidate(alert: WarRoomAlert, pressure: DecisionPressureResult, index: number): PriorityCandidate {
  const openBoost = alert.status === "open" ? 10 : 0;
  const score = Math.min(100, Math.round(severityScore(alert.severity) * 0.75 + pressure.pressureScore * 0.25 + openBoost));
  const level = levelFromScore(score);
  return Object.freeze({
    score,
    priority: buildWarRoomPriority({
      priorityId: `action-priority:alert:${alert.alertId}`,
      level,
      rank: index + 1,
      title: alert.title,
      rationale: `${alert.detail} Pressure score ${pressure.pressureScore}.`,
      relatedSignalIds: alert.signalIds,
      relatedAlertIds: [alert.alertId],
    }),
  });
}

function rankedCandidates(input: ActionPriorityEngineInput): readonly PriorityCandidate[] {
  const signalCandidates = input.signals.map((signal, index) => signalCandidate(signal, input.pressure, index));
  const alertCandidates = input.alerts.map((alert, index) => alertCandidate(alert, input.pressure, index));

  return Object.freeze(
    [...signalCandidates, ...alertCandidates].sort(
      (a, b) =>
        b.score - a.score ||
        levelWeight(b.priority.level) - levelWeight(a.priority.level) ||
        a.priority.priorityId.localeCompare(b.priority.priorityId)
    )
  );
}

function rerank(priorities: readonly WarRoomPriority[]): readonly WarRoomPriority[] {
  return Object.freeze(
    priorities.map((priority, index) =>
      buildWarRoomPriority({
        ...priority,
        rank: index + 1,
      })
    )
  );
}

function buildTopActions(priorityQueue: readonly WarRoomPriority[]): readonly ExecutiveActionItem[] {
  return Object.freeze(
    priorityQueue.slice(0, 3).map((priority, index) =>
      Object.freeze({
        actionId: `top-action:${priority.priorityId}`,
        priorityId: priority.priorityId,
        label: `Act on ${priority.title}`,
        level: priority.level,
        readOnly: true as const,
        mutation: false as const,
      })
    )
  );
}

function buildTopConcerns(priorityQueue: readonly WarRoomPriority[]): readonly ExecutiveConcernItem[] {
  return Object.freeze(
    priorityQueue.slice(0, 3).map((priority) =>
      Object.freeze({
        concernId: `top-concern:${priority.priorityId}`,
        priorityId: priority.priorityId,
        label: priority.rationale,
        level: priority.level,
        readOnly: true as const,
        mutation: false as const,
      })
    )
  );
}

export function rankActionPriorities(input: ActionPriorityEngineInput): ActionPriorityEngineResult {
  const priorityQueue = rerank(rankedCandidates(input).map((candidate) => candidate.priority));
  const topActions = buildTopActions(priorityQueue);
  const topConcerns = buildTopConcerns(priorityQueue);

  latestActionPriorityEngineResult = Object.freeze({
    version: ACTION_PRIORITY_ENGINE_VERSION,
    rankedAt: input.rankedAt,
    priorityQueue,
    topActions,
    topConcerns,
    priorityCount: priorityQueue.length,
    topActionCount: topActions.length,
    topConcernCount: topConcerns.length,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
    simulationMutation: false as const,
    diagnostics: ACTION_PRIORITY_ENGINE_DIAGNOSTICS,
  });

  return latestActionPriorityEngineResult;
}

export function getActionPriorityEngineResult(): ActionPriorityEngineResult {
  return latestActionPriorityEngineResult;
}

export function resetActionPriorityEngineForTests(): void {
  latestActionPriorityEngineResult = EMPTY_ACTION_PRIORITY_ENGINE_RESULT;
}

export const ActionPriorityEngine = Object.freeze({
  rankActionPriorities,
  getActionPriorityEngineResult,
  resetActionPriorityEngineForTests,
  diagnostics: ACTION_PRIORITY_ENGINE_DIAGNOSTICS,
  emptyResult: EMPTY_ACTION_PRIORITY_ENGINE_RESULT,
});
