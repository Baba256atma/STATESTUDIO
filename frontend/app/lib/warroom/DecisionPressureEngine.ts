/**
 * W:1 — Decision Pressure Engine.
 *
 * Measures executive urgency from read-only War Room signals, alerts, risk
 * changes, and scenario changes. No source mutation, routing, scene, topology,
 * DS, object, or simulation mutation authority.
 */

import type { WarRoomAlert, WarRoomSignal, WarRoomSignalSeverity } from "./WarRoomContract.ts";

export const DECISION_PRESSURE_ENGINE_DIAGNOSTIC = "[DECISION_PRESSURE_ENGINE]" as const;

export const DECISION_PRESSURE_READY_DIAGNOSTIC = "[DECISION_PRESSURE_READY]" as const;

export const W1_DECISION_PRESSURE_COMPLETE_TAG = "[W1_DECISION_PRESSURE_COMPLETE]" as const;

export const DECISION_PRESSURE_ENGINE_VERSION = "1.0.0" as const;

export type DecisionPressureLevel = "low" | "medium" | "high" | "critical";

export type DecisionPressureRiskChange = Readonly<{
  changeId: string;
  riskId: string;
  exposureDelta: number;
  severityDelta: number;
  confidence: number;
  readOnly: true;
  mutation: false;
}>;

export type DecisionPressureScenarioChange = Readonly<{
  changeId: string;
  scenarioId: string;
  degradationDelta: number;
  confidence: number;
  readOnly: true;
  mutation: false;
}>;

export type DecisionPressureInput = Readonly<{
  evaluatedAt: string;
  signals: readonly WarRoomSignal[];
  alerts: readonly WarRoomAlert[];
  riskChanges: readonly DecisionPressureRiskChange[];
  scenarioChanges: readonly DecisionPressureScenarioChange[];
}>;

export type DecisionPressureResult = Readonly<{
  version: typeof DECISION_PRESSURE_ENGINE_VERSION;
  evaluatedAt: string;
  pressureScore: number;
  pressureLevel: DecisionPressureLevel;
  signalPressure: number;
  alertPressure: number;
  riskChangePressure: number;
  scenarioChangePressure: number;
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
    typeof DECISION_PRESSURE_ENGINE_DIAGNOSTIC,
    typeof DECISION_PRESSURE_READY_DIAGNOSTIC,
  ];
}>;

export const DECISION_PRESSURE_ENGINE_DIAGNOSTICS = Object.freeze([
  DECISION_PRESSURE_ENGINE_DIAGNOSTIC,
  DECISION_PRESSURE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_DECISION_PRESSURE_RESULT: DecisionPressureResult = Object.freeze({
  version: DECISION_PRESSURE_ENGINE_VERSION,
  evaluatedAt: "",
  pressureScore: 0,
  pressureLevel: "low",
  signalPressure: 0,
  alertPressure: 0,
  riskChangePressure: 0,
  scenarioChangePressure: 0,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  objectMutation: false,
  simulationMutation: false,
  diagnostics: DECISION_PRESSURE_ENGINE_DIAGNOSTICS,
});

let latestDecisionPressureResult: DecisionPressureResult = EMPTY_DECISION_PRESSURE_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function severityWeight(severity: WarRoomSignalSeverity): number {
  if (severity === "critical") return 100;
  if (severity === "warning") return 72;
  if (severity === "watch") return 42;
  return 16;
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pressureLevel(score: number): DecisionPressureLevel {
  if (score >= 85) return "critical";
  if (score >= 55) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function buildDecisionPressureRiskChange(
  input: Omit<DecisionPressureRiskChange, "readOnly" | "mutation">
): DecisionPressureRiskChange {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionPressureScenarioChange(
  input: Omit<DecisionPressureScenarioChange, "readOnly" | "mutation">
): DecisionPressureScenarioChange {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

function signalPressure(signals: readonly WarRoomSignal[]): number {
  return clampScore(average(signals.map((signal) => severityWeight(signal.severity))));
}

function alertPressure(alerts: readonly WarRoomAlert[]): number {
  return clampScore(
    average(alerts.map((alert) => severityWeight(alert.severity) + (alert.status === "open" ? 10 : 0)))
  );
}

function riskChangePressure(changes: readonly DecisionPressureRiskChange[]): number {
  return clampScore(
    average(
      changes.map((change) =>
        Math.max(0, change.exposureDelta) + Math.max(0, change.severityDelta) + change.confidence * 0.2
      )
    )
  );
}

function scenarioChangePressure(changes: readonly DecisionPressureScenarioChange[]): number {
  return clampScore(
    average(changes.map((change) => Math.max(0, change.degradationDelta) + change.confidence * 0.2))
  );
}

export function measureDecisionPressure(input: DecisionPressureInput): DecisionPressureResult {
  const signalScore = signalPressure(input.signals);
  const alertScore = alertPressure(input.alerts);
  const riskScore = riskChangePressure(input.riskChanges);
  const scenarioScore = scenarioChangePressure(input.scenarioChanges);
  const pressureScore = clampScore(
    signalScore * 0.25 +
    alertScore * 0.35 +
    riskScore * 0.2 +
    scenarioScore * 0.2
  );

  latestDecisionPressureResult = Object.freeze({
    version: DECISION_PRESSURE_ENGINE_VERSION,
    evaluatedAt: input.evaluatedAt,
    pressureScore,
    pressureLevel: pressureLevel(pressureScore),
    signalPressure: signalScore,
    alertPressure: alertScore,
    riskChangePressure: riskScore,
    scenarioChangePressure: scenarioScore,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    objectMutation: false as const,
    simulationMutation: false as const,
    diagnostics: DECISION_PRESSURE_ENGINE_DIAGNOSTICS,
  });

  return latestDecisionPressureResult;
}

export function getDecisionPressureResult(): DecisionPressureResult {
  return latestDecisionPressureResult;
}

export function resetDecisionPressureEngineForTests(): void {
  latestDecisionPressureResult = EMPTY_DECISION_PRESSURE_RESULT;
}

export const DecisionPressureEngine = Object.freeze({
  buildDecisionPressureRiskChange,
  buildDecisionPressureScenarioChange,
  measureDecisionPressure,
  getDecisionPressureResult,
  resetDecisionPressureEngineForTests,
  diagnostics: DECISION_PRESSURE_ENGINE_DIAGNOSTICS,
  emptyResult: EMPTY_DECISION_PRESSURE_RESULT,
});
