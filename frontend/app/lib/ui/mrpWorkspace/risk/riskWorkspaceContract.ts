/**
 * MRP:4C:1–4C:6 — Risk workspace contract.
 *
 * Certified read-only intelligence panel — structural runtime only in MRP:4C scope.
 */

import type { RiskObjectContext } from "./riskObjectContextContract.ts";
import type { RiskSceneCoverage } from "./riskSceneAwarenessContract.ts";
import type { RiskVisualSurface } from "./riskVisualSurfaceContract.ts";

export const RISK_FOUNDATION_TAG = "[MRP_RISK_FOUNDATION]" as const;
export const RISK_CERTIFIED_TAG = "[MRP_RISK_CERTIFIED]" as const;
export const MRP_PHASE4C_COMPLETE_TAG = "[MRP_PHASE4C_COMPLETE]" as const;

export const RISK_WORKSPACE_VERSION = "4C.6.0";

export const CANONICAL_RISK_WORKSPACE_OWNER = "RiskWorkspace" as const;

export type RiskWorkspaceSectionId =
  | "risk_summary"
  | "top_risks"
  | "risk_drivers"
  | "recommended_monitoring";

export type RiskWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type RiskWorkspaceCardView = Readonly<{
  id: RiskWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: RiskWorkspaceCardTone;
}>;

export type RiskWorkspaceView = Readonly<{
  workspaceId: "risk";
  cards: readonly RiskWorkspaceCardView[];
  objectContext: RiskObjectContext;
  visualSurface: RiskVisualSurface;
  sceneCoverage: RiskSceneCoverage;
  sceneAwarenessReadOnly: true;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "risk_workspace_foundation" | "risk_workspace_runtime_state";
}>;

export const RISK_WORKSPACE_SECTION_ORDER: readonly RiskWorkspaceSectionId[] = Object.freeze([
  "risk_summary",
  "top_risks",
  "risk_drivers",
  "recommended_monitoring",
]);
