/**
 * MRP:4C:4 — Derive top risk rows from read-only scene data.
 */

import type { RiskWorkspaceDataInput } from "./riskWorkspaceMetricsContract.ts";
import type { RiskTopRiskRow } from "./riskVisualSurfaceContract.ts";
import { scanSceneRiskObjects } from "./riskSceneScanResolver.ts";

export const RISK_TOP_RISKS_LIMIT = 8;

export function deriveRiskTopRiskRows(input: RiskWorkspaceDataInput): readonly RiskTopRiskRow[] {
  const objects = input.sceneJson?.scene?.objects;
  if (!Array.isArray(objects) || !objects.length) {
    return Object.freeze([]);
  }

  const scanned = scanSceneRiskObjects(objects);
  return Object.freeze(
    scanned.slice(0, RISK_TOP_RISKS_LIMIT).map((row) =>
      Object.freeze({
        risk: row.label,
        severity: row.severityLabel,
        impact: row.impact,
      })
    )
  );
}

export function buildRiskTopRiskRowsSignature(rows: readonly RiskTopRiskRow[]): string {
  return JSON.stringify(rows);
}
