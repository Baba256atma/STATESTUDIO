/**
 * MRP:4:7 / MRP:4:8 / MRP:4:9 / MRP:4:10 / MRP:4:11 / MRP:4:12 — Operational workspace contract.
 *
 * Placeholder runtime only — no charts, tables, simulations, or business intelligence.
 */

import type { OperationalObjectContext } from "./operationalObjectContextContract.ts";

export const OPERATIONAL_FOUNDATION_TAG = "[OPERATIONAL_FOUNDATION]" as const;
export const OPERATIONAL_CERTIFIED_TAG = "[OPERATIONAL_CERTIFIED]" as const;
export const MRP_PHASE4B_COMPLETE_TAG = "[MRP_PHASE4B_COMPLETE]" as const;

export const OPERATIONAL_WORKSPACE_VERSION = "4.12.0";

export const CANONICAL_OPERATIONAL_WORKSPACE_OWNER = "OperationalWorkspace" as const;

export type OperationalStatus = "healthy" | "warning" | "critical";

export type OperationalActivityLevel = "low" | "medium" | "high";

export type OperationalWorkspaceSectionId =
  | "operational_status"
  | "activity_level"
  | "operational_focus"
  | "operational_notes";

export type OperationalWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type OperationalWorkspaceCardView = Readonly<{
  id: OperationalWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: OperationalWorkspaceCardTone;
}>;

export type OperationalWorkspaceView = Readonly<{
  workspaceId: "operational";
  operationalStatus: OperationalStatus;
  statusOptions: readonly OperationalStatus[];
  activityLevel: OperationalActivityLevel;
  activityOptions: readonly OperationalActivityLevel[];
  cards: readonly OperationalWorkspaceCardView[];
  objectContext: OperationalObjectContext;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "operational_workspace_foundation" | "operational_workspace_runtime_state";
}>;

export const OPERATIONAL_STATUS_LABELS: Readonly<Record<OperationalStatus, string>> =
  Object.freeze({
    healthy: "Healthy",
    warning: "Warning",
    critical: "Critical",
  });

export const OPERATIONAL_ACTIVITY_LABELS: Readonly<Record<OperationalActivityLevel, string>> =
  Object.freeze({
    low: "Low",
    medium: "Medium",
    high: "High",
  });

export const OPERATIONAL_WORKSPACE_SECTION_ORDER: readonly OperationalWorkspaceSectionId[] =
  Object.freeze([
    "operational_status",
    "activity_level",
    "operational_focus",
    "operational_notes",
  ]);
