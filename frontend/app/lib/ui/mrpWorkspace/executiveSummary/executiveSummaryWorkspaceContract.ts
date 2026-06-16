/**
 * MRP:4:1 / MRP:4:2 / MRP:4:3 / MRP:4:4 / MRP:4:6 — Executive Summary workspace contract.
 *
 * Placeholder runtime only — no charts, tables, or business intelligence logic.
 */

export const EXEC_SUMMARY_FOUNDATION_TAG = "[EXEC_SUMMARY_FOUNDATION]" as const;
export const EXEC_SUMMARY_CERTIFIED_TAG = "[EXEC_SUMMARY_CERTIFIED]" as const;
export const MRP_PHASE4A_COMPLETE_TAG = "[MRP_PHASE4A_COMPLETE]" as const;

export const EXECUTIVE_SUMMARY_WORKSPACE_VERSION = "4.4.0";

export const CANONICAL_EXECUTIVE_SUMMARY_WORKSPACE_OWNER =
  "ExecutiveSummaryWorkspace" as const;

export type ExecutiveSummarySystemStatus = "healthy" | "warning" | "critical";

export type ExecutiveSummaryWorkspaceSectionId =
  | "system_status"
  | "top_risk"
  | "top_opportunity"
  | "recommended_attention";

export type ExecutiveSummaryWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type ExecutiveSummaryWorkspaceCardView = Readonly<{
  id: ExecutiveSummaryWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: ExecutiveSummaryWorkspaceCardTone;
}>;

import type { ExecutiveSummaryObjectContext } from "./executiveSummaryObjectContextContract.ts";

export type ExecutiveSummaryWorkspaceView = Readonly<{
  workspaceId: "executive_summary";
  systemStatus: ExecutiveSummarySystemStatus;
  statusOptions: readonly ExecutiveSummarySystemStatus[];
  cards: readonly ExecutiveSummaryWorkspaceCardView[];
  objectContext: ExecutiveSummaryObjectContext;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "executive_summary_workspace_foundation" | "executive_summary_runtime_state";
}>;

export const EXECUTIVE_SUMMARY_SYSTEM_STATUS_LABELS: Readonly<
  Record<ExecutiveSummarySystemStatus, string>
> = Object.freeze({
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
});

export const EXECUTIVE_SUMMARY_WORKSPACE_SECTION_ORDER: readonly ExecutiveSummaryWorkspaceSectionId[] =
  Object.freeze([
    "system_status",
    "top_risk",
    "top_opportunity",
    "recommended_attention",
  ]);
