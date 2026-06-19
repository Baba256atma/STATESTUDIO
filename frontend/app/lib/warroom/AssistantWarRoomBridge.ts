/**
 * W:1 — Assistant War Room Bridge.
 *
 * Generates read-only explanations for War Room alerts, pressure, and priority
 * ranking. The bridge does not execute actions, simulations, routing, scene
 * mutations, topology changes, DS changes, or object mutations.
 */

import type { ActionPriorityEngineResult } from "./ActionPriorityEngine.ts";
import type { DecisionPressureResult } from "./DecisionPressureEngine.ts";
import type { WarRoomAlert, WarRoomPriority } from "./WarRoomContract.ts";

export const ASSISTANT_WAR_ROOM_DIAGNOSTIC = "[ASSISTANT_WAR_ROOM]" as const;

export const ASSISTANT_WAR_ROOM_READY_DIAGNOSTIC = "[ASSISTANT_WAR_ROOM_READY]" as const;

export const W1_ASSISTANT_BRIDGE_COMPLETE_TAG = "[W1_ASSISTANT_BRIDGE_COMPLETE]" as const;

export const ASSISTANT_WAR_ROOM_BRIDGE_VERSION = "1.0.0" as const;

export type AssistantWarRoomExplanationKind = "alert" | "pressure" | "priority";

export type AssistantWarRoomExplanation = Readonly<{
  explanationId: string;
  kind: AssistantWarRoomExplanationKind;
  subjectId: string;
  title: string;
  explanation: string;
  readOnly: true;
  mutation: false;
}>;

export type AssistantWarRoomBridgeInput = Readonly<{
  explainedAt: string;
  alerts: readonly WarRoomAlert[];
  pressure: DecisionPressureResult;
  priorities: ActionPriorityEngineResult;
}>;

export type AssistantWarRoomBridgeResult = Readonly<{
  version: typeof ASSISTANT_WAR_ROOM_BRIDGE_VERSION;
  explainedAt: string;
  explanations: readonly AssistantWarRoomExplanation[];
  alertExplanations: readonly AssistantWarRoomExplanation[];
  pressureExplanation: AssistantWarRoomExplanation;
  priorityExplanation: AssistantWarRoomExplanation | null;
  explanationCount: number;
  readOnly: true;
  mutation: false;
  actionExecution: false;
  simulationExecution: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  objectMutation: false;
  diagnostics: readonly [
    typeof ASSISTANT_WAR_ROOM_DIAGNOSTIC,
    typeof ASSISTANT_WAR_ROOM_READY_DIAGNOSTIC,
  ];
}>;

export const ASSISTANT_WAR_ROOM_DIAGNOSTICS = Object.freeze([
  ASSISTANT_WAR_ROOM_DIAGNOSTIC,
  ASSISTANT_WAR_ROOM_READY_DIAGNOSTIC,
] as const);

function freezeExplanation(
  input: Omit<AssistantWarRoomExplanation, "readOnly" | "mutation">
): AssistantWarRoomExplanation {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

export const EMPTY_ASSISTANT_WAR_ROOM_PRESSURE_EXPLANATION: AssistantWarRoomExplanation =
  freezeExplanation({
    explanationId: "assistant-war-room:pressure:none",
    kind: "pressure",
    subjectId: "",
    title: "No decision pressure",
    explanation: "No War Room decision pressure has been measured.",
  });

export const EMPTY_ASSISTANT_WAR_ROOM_RESULT: AssistantWarRoomBridgeResult = Object.freeze({
  version: ASSISTANT_WAR_ROOM_BRIDGE_VERSION,
  explainedAt: "",
  explanations: Object.freeze([EMPTY_ASSISTANT_WAR_ROOM_PRESSURE_EXPLANATION]),
  alertExplanations: Object.freeze([]),
  pressureExplanation: EMPTY_ASSISTANT_WAR_ROOM_PRESSURE_EXPLANATION,
  priorityExplanation: null,
  explanationCount: 1,
  readOnly: true,
  mutation: false,
  actionExecution: false,
  simulationExecution: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  objectMutation: false,
  diagnostics: ASSISTANT_WAR_ROOM_DIAGNOSTICS,
});

let latestAssistantWarRoomBridgeResult: AssistantWarRoomBridgeResult =
  EMPTY_ASSISTANT_WAR_ROOM_RESULT;

function alertExplanation(alert: WarRoomAlert): AssistantWarRoomExplanation {
  return freezeExplanation({
    explanationId: `assistant-war-room:alert:${alert.alertId}`,
    kind: "alert",
    subjectId: alert.alertId,
    title: `Why ${alert.title} exists`,
    explanation: `${alert.title} exists because ${alert.signalIds.length} related signal(s) are ${alert.severity} and the alert is ${alert.status}. ${alert.detail}`,
  });
}

function pressureExplanation(pressure: DecisionPressureResult): AssistantWarRoomExplanation {
  return freezeExplanation({
    explanationId: `assistant-war-room:pressure:${pressure.evaluatedAt || "current"}`,
    kind: "pressure",
    subjectId: pressure.evaluatedAt,
    title: `Why pressure is ${pressure.pressureLevel}`,
    explanation: `Pressure is ${pressure.pressureLevel} because the pressure score is ${pressure.pressureScore}, with signal pressure ${pressure.signalPressure}, alert pressure ${pressure.alertPressure}, risk-change pressure ${pressure.riskChangePressure}, and scenario-change pressure ${pressure.scenarioChangePressure}.`,
  });
}

function topPriorityExplanation(priority: WarRoomPriority | undefined): AssistantWarRoomExplanation | null {
  if (!priority) return null;
  return freezeExplanation({
    explanationId: `assistant-war-room:priority:${priority.priorityId}`,
    kind: "priority",
    subjectId: priority.priorityId,
    title: `Why ${priority.title} is ranked first`,
    explanation: `${priority.title} is ranked first because it is ${priority.level} priority at rank ${priority.rank}. ${priority.rationale}`,
  });
}

export function explainWarRoomState(input: AssistantWarRoomBridgeInput): AssistantWarRoomBridgeResult {
  const alertExplanations = Object.freeze(input.alerts.map((alert) => alertExplanation(alert)));
  const pressure = pressureExplanation(input.pressure);
  const priority = topPriorityExplanation(input.priorities.priorityQueue[0]);
  const explanations = Object.freeze([
    ...alertExplanations,
    pressure,
    ...(priority ? [priority] : []),
  ]);

  latestAssistantWarRoomBridgeResult = Object.freeze({
    version: ASSISTANT_WAR_ROOM_BRIDGE_VERSION,
    explainedAt: input.explainedAt,
    explanations,
    alertExplanations,
    pressureExplanation: pressure,
    priorityExplanation: priority,
    explanationCount: explanations.length,
    readOnly: true as const,
    mutation: false as const,
    actionExecution: false as const,
    simulationExecution: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
    diagnostics: ASSISTANT_WAR_ROOM_DIAGNOSTICS,
  });

  return latestAssistantWarRoomBridgeResult;
}

export function getAssistantWarRoomBridgeResult(): AssistantWarRoomBridgeResult {
  return latestAssistantWarRoomBridgeResult;
}

export function resetAssistantWarRoomBridgeForTests(): void {
  latestAssistantWarRoomBridgeResult = EMPTY_ASSISTANT_WAR_ROOM_RESULT;
}

export const AssistantWarRoomBridge = Object.freeze({
  explainWarRoomState,
  getAssistantWarRoomBridgeResult,
  resetAssistantWarRoomBridgeForTests,
  diagnostics: ASSISTANT_WAR_ROOM_DIAGNOSTICS,
  emptyResult: EMPTY_ASSISTANT_WAR_ROOM_RESULT,
});
