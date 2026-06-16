/**
 * MRP:4C:2 / 4C:4 — Sync Risk workspace metrics from read-only workspace data.
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import {
  getRiskWorkspaceState,
  publishRiskWorkspaceState,
} from "./riskWorkspaceStateRuntime.ts";
import {
  MRP_RISK_STATE_TAG,
  type RiskWorkspaceDataInput,
  type RiskWorkspaceMetrics,
} from "./riskWorkspaceMetricsContract.ts";
import {
  buildRiskWorkspaceMetricsSignature,
  deriveRiskWorkspaceMetrics,
} from "./riskWorkspaceMetricsResolver.ts";
import {
  buildRiskTopRiskRowsSignature,
  deriveRiskTopRiskRows,
} from "./riskTopRisksResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRiskStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_RISK_STATE_TAG, detail);
}

function buildRiskWorkspaceDataSignature(input: RiskWorkspaceDataInput): string {
  const derived = deriveRiskWorkspaceMetrics(input);
  const topRiskRows = deriveRiskTopRiskRows(input);
  return `${buildRiskWorkspaceMetricsSignature(derived)}|${buildRiskTopRiskRowsSignature(topRiskRows)}`;
}

export function buildRiskWorkspaceDataInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: RiskWorkspaceDataInput
): RiskWorkspaceDataInput {
  return Object.freeze({
    selectedObjectId: extended?.selectedObjectId ?? snapshot.selectedObjectId,
    selectedObjectLabel:
      extended?.selectedObjectLabel ?? snapshot.header.selectedObject,
    selectedObjectType: extended?.selectedObjectType ?? null,
    selectedObjectStatus: extended?.selectedObjectStatus ?? null,
    routeObjectId: extended?.routeObjectId ?? null,
    routeObjectName: extended?.routeObjectName ?? null,
    sceneJson: extended?.sceneJson ?? null,
  });
}

export function syncRiskWorkspaceData(input: RiskWorkspaceDataInput): RiskWorkspaceMetrics {
  const derived = deriveRiskWorkspaceMetrics(input);
  const topRiskRows = deriveRiskTopRiskRows(input);
  const signature = buildRiskWorkspaceDataSignature(input);
  const current = getRiskWorkspaceState();
  const currentSignature = `${buildRiskWorkspaceMetricsSignature(current)}|${buildRiskTopRiskRowsSignature(current.topRiskRows)}`;

  if (signature === currentSignature) {
    return Object.freeze({
      selectedObjectId: current.selectedObjectId,
      riskCount: current.riskCount,
      elevatedRiskCount: current.elevatedRiskCount,
      criticalRiskCount: current.criticalRiskCount,
      dominantRiskCategory: current.dominantRiskCategory,
      lastUpdatedAt: current.lastUpdatedAt,
    });
  }

  const metrics = Object.freeze({
    ...derived,
    lastUpdatedAt: Date.now(),
  });

  const result = publishRiskWorkspaceState({
    phase: "ready",
    selectedObjectId: metrics.selectedObjectId,
    riskCount: metrics.riskCount,
    elevatedRiskCount: metrics.elevatedRiskCount,
    criticalRiskCount: metrics.criticalRiskCount,
    dominantRiskCategory: metrics.dominantRiskCategory,
    lastUpdatedAt: metrics.lastUpdatedAt,
    topRiskRows,
  });

  logRiskStateOnce(signature, {
    action: "risk_metrics_synced",
    changed: result.changed,
    revision: result.revision,
    riskCount: metrics.riskCount,
    selectedObjectId: metrics.selectedObjectId,
    topRiskCount: topRiskRows.length,
  });

  return metrics;
}

export function syncRiskWorkspaceDataFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: RiskWorkspaceDataInput
): RiskWorkspaceMetrics {
  return syncRiskWorkspaceData(buildRiskWorkspaceDataInputFromMrpSnapshot(snapshot, extended));
}

export function resetRiskWorkspaceDataRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
