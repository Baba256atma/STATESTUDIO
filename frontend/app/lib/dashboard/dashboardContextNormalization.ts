/**
 * Normalizes raw dashboard context inputs into standardized payloads.
 */

import {
  mapLegacyPanelRouteToDashboardContext,
  normalizeDashboardContext,
  type DashboardContext,
} from "../ui/mainRightPanelContract.ts";
import type { NexoraRouteResolution } from "../routing/nexoraRoutingContract.ts";
import type { RouteRequestSource } from "../routing/nexoraRoutingContract.ts";
import {
  resolveDashboardSurfaceForContext,
  type DashboardSurfaceId,
} from "./dashboardSurfaceRegistry.ts";
import type {
  DashboardContextCategory,
  DashboardContextCommitSource,
  DashboardContextSource,
  DashboardRouteIntent,
  NormalizedDashboardContext,
} from "./dashboardContextTypes.ts";

export type RawDashboardContextInput = Readonly<{
  dashboardContext?: unknown;
  legacyRoute?: unknown;
  objectId?: unknown;
  scenarioId?: unknown;
  timestamp?: unknown;
  reason?: string;
  routeResolution?: NexoraRouteResolution;
}>;

const DASHBOARD_CONTEXT_TO_CATEGORY: Readonly<Record<DashboardContext, DashboardContextCategory>> = Object.freeze({
  overview: "executive_summary",
  sources: "operational",
  compare: "scenario",
  scenario: "scenario",
  risk: "risk",
  war_room: "war_room",
  timeline: "timeline",
  settings: "operational",
  advisory: "decision",
  governance: "governance",
});

const ROUTE_SOURCE_TO_CONTEXT_SOURCE: Readonly<Record<RouteRequestSource, DashboardContextSource>> = Object.freeze({
  left_nav: "left_nav",
  scene_panel: "scene",
  object_panel: "object",
  timeline: "timeline",
  assistant: "assistant",
  system: "system",
});

function normalizeObjectId(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeScenarioId(value: unknown): string | null {
  return normalizeObjectId(value);
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value).toISOString();
  return new Date().toISOString();
}

function mapRouteSourceToContextSource(
  source: DashboardContextSource | RouteRequestSource | DashboardContextCommitSource
): DashboardContextSource {
  if (source in ROUTE_SOURCE_TO_CONTEXT_SOURCE) {
    return ROUTE_SOURCE_TO_CONTEXT_SOURCE[source as RouteRequestSource];
  }
  if (source === "legacy_redirect" || source === "workspace_seed" || source === "runtime_container") {
    return "system";
  }
  return source as DashboardContextSource;
}

function resolveIntent(input: {
  source: DashboardContextSource;
  objectId: string | null;
  dashboardContext: DashboardContext;
  explicitIntent?: DashboardRouteIntent;
}): DashboardRouteIntent {
  if (input.explicitIntent && input.explicitIntent !== "default") return input.explicitIntent;
  if (input.objectId && input.source === "object") return "object_selected";
  if (input.dashboardContext === "risk") return "risk_event";
  if (input.dashboardContext === "compare") return "scenario_comparison";
  if (input.dashboardContext === "scenario") return "scenario_comparison";
  if (input.dashboardContext === "timeline") return "timeline_activation";
  if (input.dashboardContext === "war_room") return "war_room_activation";
  if (input.dashboardContext === "advisory") return "assistant_handoff";
  if (input.dashboardContext === "governance") return "default";
  if (input.source === "assistant") return "assistant_handoff";
  return "default";
}

export function resolveSurfaceFromNormalizedContext(input: {
  category: DashboardContextCategory;
  intent: DashboardRouteIntent;
  dashboardContext: DashboardContext;
}): DashboardSurfaceId {
  if (input.intent === "object_selected") return "operational";
  if (input.intent === "risk_event") return "risk";
  if (input.intent === "scenario_comparison") return "scenario";
  if (input.intent === "timeline_activation") return "timeline";
  if (input.intent === "war_room_activation") return "war_room";
  return resolveDashboardSurfaceForContext(input.dashboardContext);
}

export function resolveCategoryFromDashboardContext(context: DashboardContext): DashboardContextCategory {
  return DASHBOARD_CONTEXT_TO_CATEGORY[context] ?? "executive_summary";
}

export function normalizeDashboardContextInput(input: {
  source: DashboardContextSource | RouteRequestSource | DashboardContextCommitSource;
  raw: RawDashboardContextInput;
  intent?: DashboardRouteIntent;
  contextId?: string;
}): NormalizedDashboardContext {
  const contextSource = mapRouteSourceToContextSource(input.source);
  const now = new Date().toISOString();

  const dashboardContext =
    input.raw.routeResolution?.dashboardContext ??
    (input.raw.dashboardContext != null
      ? normalizeDashboardContext(input.raw.dashboardContext, { warn: false })
      : input.raw.legacyRoute != null
        ? mapLegacyPanelRouteToDashboardContext(input.raw.legacyRoute, { warn: false })
        : "overview");

  const objectId =
    normalizeObjectId(input.raw.routeResolution?.selectedObjectId) ??
    normalizeObjectId(input.raw.objectId);
  const scenarioId = normalizeScenarioId(input.raw.scenarioId);
  const timestamp = normalizeTimestamp(input.raw.timestamp);
  const reason = input.raw.reason?.trim() || input.raw.routeResolution?.reason || "dashboard_context_route";
  const intent = resolveIntent({
    source: contextSource,
    objectId,
    dashboardContext,
    explicitIntent: input.intent,
  });

  let category = resolveCategoryFromDashboardContext(dashboardContext);
  if (intent === "object_selected") category = "operational";
  if (intent === "risk_event") category = "risk";
  if (intent === "scenario_comparison") category = "scenario";
  if (intent === "timeline_activation") category = "timeline";
  if (intent === "war_room_activation") category = "war_room";
  if (intent === "assistant_handoff" && dashboardContext === "advisory") category = "decision";
  if (dashboardContext === "governance") category = "governance";
  if (intent === "assistant_handoff" && dashboardContext === "overview") category = "executive_summary";

  const surfaceId = resolveSurfaceFromNormalizedContext({ category, intent, dashboardContext });
  const id =
    input.contextId?.trim() ||
    `dctx:${contextSource}:${dashboardContext}:${objectId ?? "none"}:${timestamp}`;

  return Object.freeze({
    id,
    category,
    source: contextSource,
    lifecyclePhase: "created",
    dashboardContext,
    surfaceId,
    intent,
    objectId,
    scenarioId,
    timestamp,
    createdAt: now,
    routedAt: null,
    dashboardUpdatedAt: null,
    archivedAt: null,
    reason,
  });
}
