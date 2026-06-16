/**
 * MRP:4C:2 — Derive Risk workspace metrics from read-only workspace/scene data.
 */

import type { RiskWorkspaceDataInput, RiskWorkspaceMetrics } from "./riskWorkspaceMetricsContract.ts";
import { DEFAULT_RISK_WORKSPACE_METRICS } from "./riskWorkspaceMetricsContract.ts";
import { scanSceneRiskObjects } from "./riskSceneScanResolver.ts";

function resolveSelectedObjectId(input: RiskWorkspaceDataInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveDominantCategory(categoryCounts: Map<string, number>): string {
  let dominant = "None";
  let max = 0;
  for (const [category, count] of categoryCounts.entries()) {
    if (count > max) {
      dominant = category;
      max = count;
    }
  }
  return dominant;
}

export function buildRiskWorkspaceMetricsSignature(metrics: RiskWorkspaceMetrics): string {
  return JSON.stringify({
    selectedObjectId: metrics.selectedObjectId,
    riskCount: metrics.riskCount,
    elevatedRiskCount: metrics.elevatedRiskCount,
    criticalRiskCount: metrics.criticalRiskCount,
    dominantRiskCategory: metrics.dominantRiskCategory,
  });
}

export function deriveRiskWorkspaceMetrics(
  input: RiskWorkspaceDataInput
): Omit<RiskWorkspaceMetrics, "lastUpdatedAt"> & Readonly<{ lastUpdatedAt: 0 }> {
  const selectedObjectId = resolveSelectedObjectId(input);
  const objects = input.sceneJson?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) {
    return Object.freeze({
      ...DEFAULT_RISK_WORKSPACE_METRICS,
      selectedObjectId,
      lastUpdatedAt: 0,
    });
  }

  const scanned = scanSceneRiskObjects(objects);
  let elevatedRiskCount = 0;
  let criticalRiskCount = 0;
  const categoryCounts = new Map<string, number>();

  for (const row of scanned) {
    if (row.band === "elevated") elevatedRiskCount += 1;
    if (row.band === "critical") criticalRiskCount += 1;
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
  }

  return Object.freeze({
    selectedObjectId,
    riskCount: scanned.length,
    elevatedRiskCount,
    criticalRiskCount,
    dominantRiskCategory: resolveDominantCategory(categoryCounts),
    lastUpdatedAt: 0,
  });
}
