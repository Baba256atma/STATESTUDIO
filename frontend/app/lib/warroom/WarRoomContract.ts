/**
 * W:1 — Canonical War Room contract.
 *
 * Immutable, read-only contracts for executive monitoring, signal aggregation,
 * and priority tracking. This contract does not execute workflows, render UI,
 * route, mutate DS state, mutate scene state, or alter topology.
 */

export const WAR_ROOM_CONTRACT_DIAGNOSTIC = "[WAR_ROOM_CONTRACT]" as const;

export const WAR_ROOM_READY_DIAGNOSTIC = "[WAR_ROOM_READY]" as const;

export const W1_CONTRACT_COMPLETE_TAG = "[W1_CONTRACT_COMPLETE]" as const;

export const WAR_ROOM_CONTRACT_VERSION = "1.0.0" as const;

export type WarRoomSignalSeverity = "info" | "watch" | "warning" | "critical";

export type WarRoomSignalSource = "object" | "relationship" | "kpi" | "risk" | "scenario" | "executive";

export type WarRoomAlertStatus = "open" | "acknowledged" | "resolved";

export type WarRoomPriorityLevel = "low" | "medium" | "high" | "critical";

export type WarRoomSignal = Readonly<{
  signalId: string;
  source: WarRoomSignalSource;
  sourceId: string;
  severity: WarRoomSignalSeverity;
  title: string;
  detail: string;
  confidence: number;
  timestamp: string;
  readOnly: true;
  mutation: false;
}>;

export type WarRoomAlert = Readonly<{
  alertId: string;
  signalIds: readonly string[];
  status: WarRoomAlertStatus;
  severity: WarRoomSignalSeverity;
  title: string;
  detail: string;
  createdAt: string;
  readOnly: true;
  mutation: false;
}>;

export type WarRoomPriority = Readonly<{
  priorityId: string;
  level: WarRoomPriorityLevel;
  rank: number;
  title: string;
  rationale: string;
  relatedSignalIds: readonly string[];
  relatedAlertIds: readonly string[];
  readOnly: true;
  mutation: false;
}>;

export type WarRoomSnapshot = Readonly<{
  version: typeof WAR_ROOM_CONTRACT_VERSION;
  snapshotId: string;
  generatedAt: string;
  signals: readonly WarRoomSignal[];
  alerts: readonly WarRoomAlert[];
  priorities: readonly WarRoomPriority[];
  signalCount: number;
  alertCount: number;
  priorityCount: number;
  criticalSignalCount: number;
  openAlertCount: number;
  highestPriority: WarRoomPriority | null;
  executiveMonitoring: true;
  signalAggregation: true;
  priorityTracking: true;
  readOnly: true;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  diagnostics: readonly [
    typeof WAR_ROOM_CONTRACT_DIAGNOSTIC,
    typeof WAR_ROOM_READY_DIAGNOSTIC,
  ];
}>;

export type WarRoomContract = Readonly<{
  version: typeof WAR_ROOM_CONTRACT_VERSION;
  signalContract: "WarRoomSignal";
  alertContract: "WarRoomAlert";
  priorityContract: "WarRoomPriority";
  snapshotContract: "WarRoomSnapshot";
  executiveMonitoring: true;
  signalAggregation: true;
  priorityTracking: true;
  readOnly: true;
  mutation: false;
  diagnostics: readonly [
    typeof WAR_ROOM_CONTRACT_DIAGNOSTIC,
    typeof WAR_ROOM_READY_DIAGNOSTIC,
  ];
}>;

export const WAR_ROOM_DIAGNOSTICS = Object.freeze([
  WAR_ROOM_CONTRACT_DIAGNOSTIC,
  WAR_ROOM_READY_DIAGNOSTIC,
] as const);

export const WAR_ROOM_CONTRACT: WarRoomContract = Object.freeze({
  version: WAR_ROOM_CONTRACT_VERSION,
  signalContract: "WarRoomSignal",
  alertContract: "WarRoomAlert",
  priorityContract: "WarRoomPriority",
  snapshotContract: "WarRoomSnapshot",
  executiveMonitoring: true,
  signalAggregation: true,
  priorityTracking: true,
  readOnly: true,
  mutation: false,
  diagnostics: WAR_ROOM_DIAGNOSTICS,
});

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function priorityWeight(priority: WarRoomPriority): number {
  if (priority.level === "critical") return 4;
  if (priority.level === "high") return 3;
  if (priority.level === "medium") return 2;
  return 1;
}

export function buildWarRoomSignal(
  input: Omit<WarRoomSignal, "readOnly" | "mutation">
): WarRoomSignal {
  return Object.freeze({
    ...input,
    confidence: clampConfidence(input.confidence),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildWarRoomAlert(
  input: Omit<WarRoomAlert, "signalIds" | "readOnly" | "mutation"> & {
    signalIds: readonly string[];
  }
): WarRoomAlert {
  return Object.freeze({
    ...input,
    signalIds: Object.freeze([...input.signalIds]),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildWarRoomPriority(
  input: Omit<WarRoomPriority, "relatedSignalIds" | "relatedAlertIds" | "readOnly" | "mutation"> & {
    relatedSignalIds: readonly string[];
    relatedAlertIds: readonly string[];
  }
): WarRoomPriority {
  return Object.freeze({
    ...input,
    relatedSignalIds: Object.freeze([...input.relatedSignalIds]),
    relatedAlertIds: Object.freeze([...input.relatedAlertIds]),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildWarRoomSnapshot(input: {
  snapshotId: string;
  generatedAt: string;
  signals: readonly WarRoomSignal[];
  alerts: readonly WarRoomAlert[];
  priorities: readonly WarRoomPriority[];
}): WarRoomSnapshot {
  const signals = Object.freeze(input.signals.map((signal) => buildWarRoomSignal(signal)));
  const alerts = Object.freeze(input.alerts.map((alert) => buildWarRoomAlert(alert)));
  const priorities = Object.freeze(
    input.priorities
      .map((priority) => buildWarRoomPriority(priority))
      .sort((a, b) => priorityWeight(b) - priorityWeight(a) || a.rank - b.rank)
  );
  const highestPriority = priorities[0] ?? null;

  return Object.freeze({
    version: WAR_ROOM_CONTRACT_VERSION,
    snapshotId: input.snapshotId,
    generatedAt: input.generatedAt,
    signals,
    alerts,
    priorities,
    signalCount: signals.length,
    alertCount: alerts.length,
    priorityCount: priorities.length,
    criticalSignalCount: signals.filter((signal) => signal.severity === "critical").length,
    openAlertCount: alerts.filter((alert) => alert.status === "open").length,
    highestPriority,
    executiveMonitoring: true as const,
    signalAggregation: true as const,
    priorityTracking: true as const,
    readOnly: true as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    diagnostics: WAR_ROOM_DIAGNOSTICS,
  });
}

export const EMPTY_WAR_ROOM_SNAPSHOT: WarRoomSnapshot = buildWarRoomSnapshot({
  snapshotId: "",
  generatedAt: "",
  signals: Object.freeze([]),
  alerts: Object.freeze([]),
  priorities: Object.freeze([]),
});
