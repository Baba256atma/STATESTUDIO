/**
 * EXS-7 — Mock Executive Monitoring dataset.
 * Visual awareness only. No runtime / KPI engine / business calculations.
 */

import type { Exs1ObjectId } from "../exs1Types";

export type ExecutiveHealthState =
  | "Excellent"
  | "Healthy"
  | "Warning"
  | "Critical";

export type AlertSeverity = "Information" | "Warning" | "Critical";

export type MonitoringFilter =
  | "All"
  | "Healthy"
  | "Warning"
  | "Critical"
  | "Alerts";

export type MonitoringKpi = {
  readonly id: string;
  readonly name: string;
  readonly expected: string;
  readonly actual: string;
  readonly variance: string;
  readonly health: ExecutiveHealthState;
  readonly objectId: Exs1ObjectId;
};

export type MonitoringAlert = {
  readonly id: string;
  readonly title: string;
  readonly severity: AlertSeverity;
  readonly summary: string;
  readonly objectId: Exs1ObjectId;
};

export type MonitoringObjectHealth = {
  readonly objectId: Exs1ObjectId;
  readonly health: ExecutiveHealthState;
  readonly expected: string;
  readonly actual: string;
  readonly variance: string;
  readonly alert: string | null;
  readonly needsAttention: boolean;
};

export type MonitoringSnapshotRecord = {
  readonly id: string;
  readonly createdDate: string;
  readonly executiveHealth: ExecutiveHealthState;
  readonly summary: string;
  readonly alertCount: number;
  readonly observedStatus: string;
};

export type MonitoringJournalEntry = {
  readonly id: string;
  readonly snapshotId: string;
  readonly executiveHealth: ExecutiveHealthState;
  readonly alerts: string;
  readonly summary: string;
  readonly observedStatus: string;
  readonly createdDate: string;
};

export type MonitoringTimelinePack = {
  readonly id: string;
  readonly title: string;
  readonly snapshotId: string;
  readonly risk: "warning" | "risk" | "success";
};

export const MONITORING_TRANSITION_MS = 250;

export const HEALTH_COLOR: Record<ExecutiveHealthState, string> = {
  Excellent: "#32D583",
  Healthy: "#12B76A",
  Warning: "#FDB022",
  Critical: "#F04438",
};

export const ALERT_COLOR: Record<AlertSeverity, string> = {
  Information: "#53B1FD",
  Warning: "#FDB022",
  Critical: "#F04438",
};

export const INITIAL_EXECUTIVE_HEALTH: ExecutiveHealthState = "Warning";

export const INITIAL_MONITORING_SUMMARY =
  "Capacity Expansion is partially working — Delivery and Inventory require executive attention.";

const initialKpis = [
  {
    id: "kpi-revenue",
    name: "Revenue",
    expected: "120",
    actual: "112",
    variance: "−8",
    health: "Healthy",
    objectId: "revenue",
  },
  {
    id: "kpi-delivery",
    name: "Delivery",
    expected: "98%",
    actual: "91%",
    variance: "−7pp",
    health: "Warning",
    objectId: "customer",
  },
  {
    id: "kpi-inventory",
    name: "Inventory",
    expected: "85%",
    actual: "74%",
    variance: "−11pp",
    health: "Critical",
    objectId: "inventory",
  },
] as const satisfies readonly MonitoringKpi[];

export const INITIAL_MONITORING_KPIS = Object.freeze(initialKpis);

const initialAlerts = [
  {
    id: "alert-supplier-delay",
    title: "Supplier Delay",
    severity: "Warning",
    summary: "Inbound reliability remains below the executive recovery band.",
    objectId: "supplier",
  },
  {
    id: "alert-inventory-target",
    title: "Inventory Below Target",
    severity: "Critical",
    summary: "Cover days trail the Capacity Expansion target path.",
    objectId: "inventory",
  },
  {
    id: "alert-delivery-gap",
    title: "Delivery Gap",
    severity: "Warning",
    summary: "OTIF trails expected recovery after Production Start.",
    objectId: "customer",
  },
  {
    id: "alert-revenue-note",
    title: "Revenue Tracking",
    severity: "Information",
    summary: "Revenue is near expected; watch Inventory drag into next week.",
    objectId: "revenue",
  },
] as const satisfies readonly MonitoringAlert[];

export const INITIAL_MONITORING_ALERTS = Object.freeze(initialAlerts);

const initialObjectHealth = [
  {
    objectId: "supplier",
    health: "Warning",
    expected: "On-time 95%",
    actual: "On-time 88%",
    variance: "−7pp",
    alert: "Supplier Delay",
    needsAttention: true,
  },
  {
    objectId: "factory",
    health: "Healthy",
    expected: "Throughput 100%",
    actual: "Throughput 96%",
    variance: "−4pp",
    alert: null,
    needsAttention: false,
  },
  {
    objectId: "inventory",
    health: "Critical",
    expected: "85%",
    actual: "74%",
    variance: "−11pp",
    alert: "Inventory Below Target",
    needsAttention: true,
  },
  {
    objectId: "customer",
    health: "Warning",
    expected: "98%",
    actual: "91%",
    variance: "−7pp",
    alert: "Delivery Gap",
    needsAttention: true,
  },
  {
    objectId: "revenue",
    health: "Healthy",
    expected: "120",
    actual: "112",
    variance: "−8",
    alert: null,
    needsAttention: false,
  },
  {
    objectId: "decision",
    health: "Excellent",
    expected: "Committed",
    actual: "Committed",
    variance: "0",
    alert: null,
    needsAttention: false,
  },
] as const satisfies readonly MonitoringObjectHealth[];

export const INITIAL_OBJECT_HEALTH = Object.freeze(initialObjectHealth);

export function filterObjectHealth(
  items: readonly MonitoringObjectHealth[],
  filter: MonitoringFilter,
  alerts: readonly MonitoringAlert[],
): MonitoringObjectHealth[] {
  switch (filter) {
    case "Healthy":
      return items.filter(
        (i) => i.health === "Healthy" || i.health === "Excellent",
      );
    case "Warning":
      return items.filter((i) => i.health === "Warning");
    case "Critical":
      return items.filter((i) => i.health === "Critical");
    case "Alerts": {
      const alertIds = new Set(alerts.map((a) => a.objectId));
      return items.filter((i) => alertIds.has(i.objectId) || i.alert != null);
    }
    default:
      return [...items];
  }
}

export function toMonitoringJournalEntry(
  snapshot: MonitoringSnapshotRecord,
): MonitoringJournalEntry {
  return {
    id: `journal-monitoring-${snapshot.id}`,
    snapshotId: snapshot.id,
    executiveHealth: snapshot.executiveHealth,
    alerts: `${snapshot.alertCount} alerts observed`,
    summary: snapshot.summary,
    observedStatus: snapshot.observedStatus,
    createdDate: snapshot.createdDate,
  };
}

export function toMonitoringTimelinePack(
  snapshot: MonitoringSnapshotRecord,
): MonitoringTimelinePack {
  return {
    id: `pack-monitoring-${snapshot.id}`,
    title: "Monitoring · Snapshot",
    snapshotId: snapshot.id,
    risk:
      snapshot.executiveHealth === "Critical"
        ? "risk"
        : snapshot.executiveHealth === "Warning"
          ? "warning"
          : "success",
  };
}

export function createMonitoringSnapshot(input: {
  readonly executiveHealth: ExecutiveHealthState;
  readonly summary: string;
  readonly alertCount: number;
}): MonitoringSnapshotRecord {
  const createdDate = new Date().toISOString().slice(0, 10);
  return {
    id: `snapshot-${Date.now().toString(36)}`,
    createdDate,
    executiveHealth: input.executiveHealth,
    summary: input.summary,
    alertCount: input.alertCount,
    observedStatus: `Observed · ${input.executiveHealth} · ${createdDate}`,
  };
}
