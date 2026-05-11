import type { TypeCExecutionState } from "./typeCExecutionState.ts";

export type TypeCAlert = {
  id: string;
  level: "info" | "warning" | "critical";
  message: string;
  relatedObjectIds: string[];
  timestamp: number;
  acknowledged: boolean;
};

const MAX_ACTIVE_ALERTS = 5;
const PERSISTENT_RISK_MS = 30_000;

function sanitizeId(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function alertId(scenarioId: string, kind: string): string {
  const scenarioKey = sanitizeId(scenarioId) || "execution";
  return `typec_alert_${scenarioKey}_${kind}`;
}

function relatedObjectIdsFromSignals(signals: string[]): string[] {
  const ids = signals
    .map((signal) =>
      signal
        .replace(/\b(delay risk|instability|disruption)\b/gi, "")
        .trim()
    )
    .map(sanitizeId)
    .filter(Boolean);
  return [...new Set(ids)].slice(0, 5);
}

function createAlert(input: {
  executionState: TypeCExecutionState;
  kind: string;
  level: TypeCAlert["level"];
  message: string;
  relatedObjectIds?: string[];
}): TypeCAlert {
  return {
    id: alertId(input.executionState.scenarioId, input.kind),
    level: input.level,
    message: input.message,
    relatedObjectIds: input.relatedObjectIds ?? [],
    timestamp: Date.now(),
    acknowledged: false,
  };
}

function isActiveExecution(state: TypeCExecutionState): boolean {
  return state.status === "running" || state.status === "paused";
}

export function buildTypeCAlerts(input: {
  executionState: TypeCExecutionState;
}): TypeCAlert[] {
  try {
    const { executionState } = input;
    if (!executionState || !isActiveExecution(executionState)) return [];

    const alerts: TypeCAlert[] = [];
    const relatedObjectIds = relatedObjectIdsFromSignals(executionState.monitoredSignals);

    if (executionState.riskLevel === "high") {
      alerts.push(
        createAlert({
          executionState,
          kind: "high_risk",
          level: "critical",
          message: "System risk level is high — potential cascade failure",
          relatedObjectIds,
        })
      );
    }

    if (executionState.monitoredSignals.length >= 4) {
      alerts.push(
        createAlert({
          executionState,
          kind: "multi_node_propagation",
          level: executionState.riskLevel === "high" ? "critical" : "warning",
          message: "Multiple nodes affected — propagation expanding",
          relatedObjectIds,
        })
      );
    }

    const runningForMs = executionState.startedAt ? Date.now() - executionState.startedAt : 0;
    if (
      runningForMs >= PERSISTENT_RISK_MS &&
      (executionState.riskLevel === "medium" || executionState.riskLevel === "high")
    ) {
      alerts.push(
        createAlert({
          executionState,
          kind: "persistent_risk",
          level: executionState.riskLevel === "high" ? "critical" : "warning",
          message: "Risk not stabilizing — monitor closely",
          relatedObjectIds,
        })
      );
    }

    if (executionState.monitoredSignals.length === 0) {
      alerts.push(
        createAlert({
          executionState,
          kind: "idle_monitoring",
          level: "info",
          message: "No significant signals detected yet",
        })
      );
    }

    return alerts.slice(0, MAX_ACTIVE_ALERTS);
  } catch {
    return [];
  }
}

export function mergeTypeCAlerts(
  currentAlerts: TypeCAlert[],
  nextAlerts: TypeCAlert[],
  maxAlerts = MAX_ACTIVE_ALERTS
): TypeCAlert[] {
  const byId = new Map<string, TypeCAlert>();

  for (const alert of currentAlerts) {
    byId.set(alert.id, { ...alert });
  }

  for (const alert of nextAlerts) {
    const existing = byId.get(alert.id);
    if (existing) {
      byId.set(alert.id, {
        ...alert,
        timestamp: existing.timestamp,
        acknowledged: existing.acknowledged,
      });
    } else {
      byId.set(alert.id, { ...alert });
    }
  }

  return [...byId.values()]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, Math.max(0, maxAlerts));
}

export function acknowledgeTypeCAlert(alerts: TypeCAlert[], alertId: string): TypeCAlert[] {
  return alerts.filter((alert) => alert.id !== alertId);
}

export function clearTypeCAlerts(): TypeCAlert[] {
  return [];
}
