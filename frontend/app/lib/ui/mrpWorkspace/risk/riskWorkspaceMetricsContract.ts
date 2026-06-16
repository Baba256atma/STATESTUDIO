/**
 * MRP:4C:2 — Risk workspace canonical metrics contract.
 *
 * Read-only derived state — no backend, no scene writes.
 */

import type { SceneJson } from "../../../sceneTypes.ts";

export const MRP_RISK_STATE_TAG = "[MRP_RISK_STATE]" as const;

export const RISK_WORKSPACE_METRICS_VERSION = "4C.2.0";

export type RiskWorkspaceMetrics = Readonly<{
  selectedObjectId: string | null;
  riskCount: number;
  elevatedRiskCount: number;
  criticalRiskCount: number;
  dominantRiskCategory: string;
  lastUpdatedAt: number;
}>;

export type RiskWorkspaceDataInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  sceneJson?: SceneJson | null;
}>;

export const DEFAULT_RISK_WORKSPACE_METRICS: RiskWorkspaceMetrics = Object.freeze({
  selectedObjectId: null,
  riskCount: 0,
  elevatedRiskCount: 0,
  criticalRiskCount: 0,
  dominantRiskCategory: "None",
  lastUpdatedAt: 0,
});
