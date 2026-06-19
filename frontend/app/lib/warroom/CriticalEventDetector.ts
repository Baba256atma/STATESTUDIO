/**
 * W:1 — Critical Event Detector.
 *
 * Detects critical executive conditions from an immutable War Room signal set
 * and emits WarRoomAlert records. Read-only only; no source, DS, routing, scene,
 * topology, object, or simulation mutation authority.
 */

import {
  buildWarRoomAlert,
  type WarRoomAlert,
  type WarRoomSignal,
} from "./WarRoomContract.ts";
import type { WarRoomSignalSet } from "./WarRoomSignalAggregator.ts";

export const CRITICAL_EVENT_DETECTOR_DIAGNOSTIC = "[CRITICAL_EVENT_DETECTOR]" as const;

export const CRITICAL_EVENT_READY_DIAGNOSTIC = "[CRITICAL_EVENT_READY]" as const;

export const W1_CRITICAL_EVENT_COMPLETE_TAG = "[W1_CRITICAL_EVENT_COMPLETE]" as const;

export const CRITICAL_EVENT_DETECTOR_VERSION = "1.0.0" as const;

export type CriticalEventKind =
  | "critical_kpi_decline"
  | "critical_risk_increase"
  | "critical_scenario_degradation"
  | "critical_dependency_exposure";

export type CriticalEventDetectionInput = Readonly<{
  signalSet: WarRoomSignalSet;
  detectedAt: string;
}>;

export type CriticalEventDetectionResult = Readonly<{
  version: typeof CRITICAL_EVENT_DETECTOR_VERSION;
  detectedAt: string;
  alerts: readonly WarRoomAlert[];
  alertCount: number;
  criticalKpiDeclineCount: number;
  criticalRiskIncreaseCount: number;
  criticalScenarioDegradationCount: number;
  criticalDependencyExposureCount: number;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof CRITICAL_EVENT_DETECTOR_DIAGNOSTIC,
    typeof CRITICAL_EVENT_READY_DIAGNOSTIC,
  ];
}>;

export const CRITICAL_EVENT_DETECTOR_DIAGNOSTICS = Object.freeze([
  CRITICAL_EVENT_DETECTOR_DIAGNOSTIC,
  CRITICAL_EVENT_READY_DIAGNOSTIC,
] as const);

export const EMPTY_CRITICAL_EVENT_DETECTION_RESULT: CriticalEventDetectionResult = Object.freeze({
  version: CRITICAL_EVENT_DETECTOR_VERSION,
  detectedAt: "",
  alerts: Object.freeze([]),
  alertCount: 0,
  criticalKpiDeclineCount: 0,
  criticalRiskIncreaseCount: 0,
  criticalScenarioDegradationCount: 0,
  criticalDependencyExposureCount: 0,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: CRITICAL_EVENT_DETECTOR_DIAGNOSTICS,
});

let latestCriticalEventDetectionResult: CriticalEventDetectionResult =
  EMPTY_CRITICAL_EVENT_DETECTION_RESULT;

function isCritical(signal: WarRoomSignal): boolean {
  return signal.severity === "critical";
}

function eventKind(signal: WarRoomSignal): CriticalEventKind | null {
  if (!isCritical(signal)) return null;
  const text = `${signal.title} ${signal.detail}`.toLowerCase();

  if (signal.source === "kpi" && text.includes("down")) return "critical_kpi_decline";
  if (signal.source === "risk" && (text.includes("worsening") || text.includes("severity") || text.includes("exposure"))) {
    return "critical_risk_increase";
  }
  if (signal.source === "scenario" && (text.includes("risk") || text.includes("degradation") || text.includes("impact"))) {
    return "critical_scenario_degradation";
  }
  if (signal.source === "relationship" && (text.includes("dependency") || text.includes("risk exposure"))) {
    return "critical_dependency_exposure";
  }

  return null;
}

function alertTitle(kind: CriticalEventKind): string {
  if (kind === "critical_kpi_decline") return "Critical KPI Decline";
  if (kind === "critical_risk_increase") return "Critical Risk Increase";
  if (kind === "critical_scenario_degradation") return "Critical Scenario Degradation";
  return "Critical Dependency Exposure";
}

function buildAlert(kind: CriticalEventKind, signal: WarRoomSignal, detectedAt: string): WarRoomAlert {
  return buildWarRoomAlert({
    alertId: `critical-event:${kind}:${signal.signalId}`,
    signalIds: [signal.signalId],
    status: "open",
    severity: "critical",
    title: alertTitle(kind),
    detail: signal.detail,
    createdAt: detectedAt,
  });
}

export function detectCriticalEvents(input: CriticalEventDetectionInput): CriticalEventDetectionResult {
  const detected = input.signalSet.signals
    .map((signal) => {
      const kind = eventKind(signal);
      return kind ? Object.freeze({ kind, alert: buildAlert(kind, signal, input.detectedAt) }) : null;
    })
    .filter((entry): entry is Readonly<{ kind: CriticalEventKind; alert: WarRoomAlert }> => entry !== null);
  const alerts = Object.freeze(detected.map((entry) => entry.alert));

  latestCriticalEventDetectionResult = Object.freeze({
    version: CRITICAL_EVENT_DETECTOR_VERSION,
    detectedAt: input.detectedAt,
    alerts,
    alertCount: alerts.length,
    criticalKpiDeclineCount: detected.filter((entry) => entry.kind === "critical_kpi_decline").length,
    criticalRiskIncreaseCount: detected.filter((entry) => entry.kind === "critical_risk_increase").length,
    criticalScenarioDegradationCount: detected.filter((entry) => entry.kind === "critical_scenario_degradation").length,
    criticalDependencyExposureCount: detected.filter((entry) => entry.kind === "critical_dependency_exposure").length,
    readOnly: true as const,
    mutation: false as const,
    sourceMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    simulationMutation: false as const,
    diagnostics: CRITICAL_EVENT_DETECTOR_DIAGNOSTICS,
  });

  return latestCriticalEventDetectionResult;
}

export function getCriticalEventDetectionResult(): CriticalEventDetectionResult {
  return latestCriticalEventDetectionResult;
}

export function resetCriticalEventDetectorForTests(): void {
  latestCriticalEventDetectionResult = EMPTY_CRITICAL_EVENT_DETECTION_RESULT;
}

export const CriticalEventDetector = Object.freeze({
  detectCriticalEvents,
  getCriticalEventDetectionResult,
  resetCriticalEventDetectorForTests,
  diagnostics: CRITICAL_EVENT_DETECTOR_DIAGNOSTICS,
  emptyResult: EMPTY_CRITICAL_EVENT_DETECTION_RESULT,
});
