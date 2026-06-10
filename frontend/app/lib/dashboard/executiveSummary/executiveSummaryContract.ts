/**
 * Phase 4:1 — Executive Summary Surface contract.
 * Aggregation, attention model, and summary card types.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle } from "../dashboardVisualSignalContract.ts";

export const EXECUTIVE_SUMMARY_SURFACE_VERSION = "4.1.0";

export const CANONICAL_EXECUTIVE_SUMMARY_OWNER = "executiveSummaryRuntime";

export const CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID = "executive_summary" as const;

export const CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE = CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID;

export type ExecutiveAttentionLevel = "attention_required" | "monitor" | "stable" | "unknown";

export type ExecutiveSummaryAggregationSource =
  | "scene"
  | "object"
  | "timeline"
  | "dashboard"
  | "operational"
  | "risk"
  | "scenario"
  | "war_room"
  | "advisory"
  | "advisory_context"
  | "advisory_confidence"
  | "advisory_explainability"
  | "decision_guidance"
  | "governance_intelligence"
  | "strategic_alignment"
  | "policy_constraint_intelligence"
  | "stakeholder_intelligence"
  | "consensus_intelligence"
  | "institutional_alignment"
  | "advisory_war_room_integration";

export type SystemStatusLevel = "healthy" | "attention_needed" | "critical";

export type ExecutiveSummaryCardKind =
  | "system_status"
  | "active_objects"
  | "active_signals"
  | "executive_attention";

export type ExecutiveSummaryCard = Readonly<{
  kind: ExecutiveSummaryCardKind;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  attention: ExecutiveAttentionLevel;
}>;

export type ExecutiveSummaryAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  openContextCount?: number;
}>;

export type ExecutiveSummarySurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID;
  owner: typeof CANONICAL_EXECUTIVE_SUMMARY_OWNER;
  attention: ExecutiveAttentionLevel;
  headline: string;
  systemStatus: SystemStatusLevel;
  cards: readonly ExecutiveSummaryCard[];
  visualBundle: DashboardSurfaceVisualBundle;
  aggregationSources: readonly ExecutiveSummaryAggregationSource[];
  investigateNext: string;
}>;
