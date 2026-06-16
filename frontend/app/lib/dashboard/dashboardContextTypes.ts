/**
 * Normalized Dashboard Context types for Phase 3:2 routing contract.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { DashboardSurfaceId } from "./dashboardSurfaceRegistry.ts";

export type DashboardContextCategory =
  | "operational"
  | "risk"
  | "scenario"
  | "timeline"
  | "war_room"
  | "executive_summary"
  | "decision"
  | "governance";

export type DashboardContextSource =
  | "scene"
  | "object"
  | "timeline"
  | "assistant"
  | "left_nav"
  | "system"
  | "legacy_redirect";

export type DashboardContextLifecyclePhase = "created" | "routed" | "dashboard_updated" | "archived";

export type DashboardRouteIntent =
  | "default"
  | "object_selected"
  | "risk_event"
  | "scenario_comparison"
  | "timeline_activation"
  | "war_room_activation"
  | "assistant_handoff";

export type NormalizedDashboardContextBase = Readonly<{
  id: string;
  category: DashboardContextCategory;
  source: DashboardContextSource;
  lifecyclePhase: DashboardContextLifecyclePhase;
  dashboardContext: DashboardContext;
  surfaceId: DashboardSurfaceId;
  intent: DashboardRouteIntent;
  objectId: string | null;
  scenarioId: string | null;
  timestamp: string;
  createdAt: string;
  routedAt: string | null;
  dashboardUpdatedAt: string | null;
  archivedAt: string | null;
  reason: string;
}>;

export type OperationalContext = NormalizedDashboardContextBase & { category: "operational" };
export type RiskContext = NormalizedDashboardContextBase & { category: "risk" };
export type ScenarioContext = NormalizedDashboardContextBase & { category: "scenario" };
export type TimelineContext = NormalizedDashboardContextBase & { category: "timeline" };
export type WarRoomContext = NormalizedDashboardContextBase & { category: "war_room" };
export type ExecutiveSummaryContext = NormalizedDashboardContextBase & { category: "executive_summary" };
export type DecisionContext = NormalizedDashboardContextBase & { category: "decision" };
export type GovernanceContext = NormalizedDashboardContextBase & { category: "governance" };

export type NormalizedDashboardContext =
  | OperationalContext
  | RiskContext
  | ScenarioContext
  | TimelineContext
  | WarRoomContext
  | ExecutiveSummaryContext
  | DecisionContext
  | GovernanceContext;

export const DASHBOARD_CONTEXT_ROUTER_VERSION = "3.2.0";

export const CANONICAL_DASHBOARD_CONTEXT_ROUTER = "dashboardContextRouter";

export type DashboardContextCommitSource =
  | "left_nav"
  | "scene_panel"
  | "object_panel"
  | "timeline"
  | "assistant"
  | "system"
  | "legacy_redirect"
  | "workspace_seed"
  | "runtime_container";
