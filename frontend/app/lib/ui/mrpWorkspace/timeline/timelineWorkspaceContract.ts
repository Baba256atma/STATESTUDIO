/**
 * MRP:4D:1–4D:6 — Timeline workspace contract.
 *
 * Certified read-only intelligence panel — structural runtime only in MRP:4D scope.
 */

import type { TimelineObjectContext } from "./timelineObjectContextContract.ts";
import type { TimelineSceneCoverage } from "./timelineSceneAwarenessContract.ts";
import type { TimelineVisualSurface } from "./timelineVisualSurfaceContract.ts";

export const TIMELINE_FOUNDATION_TAG = "[MRP_TIMELINE_FOUNDATION]" as const;
export const TIMELINE_CERTIFIED_TAG = "[MRP_TIMELINE_CERTIFIED]" as const;
export const MRP_PHASE4D_COMPLETE_TAG = "[MRP_PHASE4D_COMPLETE]" as const;

export const TIMELINE_WORKSPACE_VERSION = "4D.6.0";

export const CANONICAL_TIMELINE_WORKSPACE_OWNER = "TimelineWorkspace" as const;

export type TimelineWorkspaceSectionId =
  | "timeline_summary"
  | "recent_events"
  | "important_changes"
  | "decision_history"
  | "risk_evolution";

export type TimelineWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type TimelineWorkspaceCardView = Readonly<{
  id: TimelineWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: TimelineWorkspaceCardTone;
}>;

export type TimelineWorkspaceView = Readonly<{
  workspaceId: "timeline";
  cards: readonly TimelineWorkspaceCardView[];
  objectContext: TimelineObjectContext;
  visualSurface: TimelineVisualSurface;
  sceneCoverage: TimelineSceneCoverage;
  sceneAwarenessReadOnly: true;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "timeline_workspace_foundation" | "timeline_workspace_runtime_state";
}>;

export const TIMELINE_WORKSPACE_SECTION_ORDER: readonly TimelineWorkspaceSectionId[] =
  Object.freeze([
    "timeline_summary",
    "recent_events",
    "important_changes",
    "decision_history",
    "risk_evolution",
  ]);
