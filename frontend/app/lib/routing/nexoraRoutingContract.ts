import {
  mapLegacyPanelRouteToDashboardContext,
  normalizeDashboardContext,
  normalizeMainRightPanelTab,
  type DashboardContext,
  type MainRightPanelTab,
} from "../ui/mainRightPanelContract";
import type { TimelineViewMode } from "../timeline/timelineArchitectureContract";

export type RouteRequestSource =
  | "left_nav"
  | "scene_panel"
  | "object_panel"
  | "timeline"
  | "assistant"
  | "system";

export type RouteRequestTarget =
  | "dashboard"
  | "assistant"
  | "scene"
  | "object"
  | "timeline";

export interface NexoraRouteRequest {
  source: RouteRequestSource;
  target: RouteRequestTarget;
  dashboardContext?: DashboardContext;
  objectId?: string;
  timelineMode?: TimelineViewMode;
  reason?: string;
  legacyRoute?: string;
}

export type NexoraRouteResolution = Readonly<{
  valid: boolean;
  mrpTab: MainRightPanelTab;
  dashboardContext: DashboardContext;
  sceneTimelineActive: boolean;
  selectedObjectId: string | null;
  assistantIsolated: boolean;
  reason: string;
}>;

export const DEFAULT_NEXORA_ROUTE_RESOLUTION: NexoraRouteResolution = Object.freeze({
  valid: true,
  mrpTab: "dashboard",
  dashboardContext: "overview",
  sceneTimelineActive: false,
  selectedObjectId: null,
  assistantIsolated: false,
  reason: "default_dashboard_overview",
});

export const NEXORA_ROUTING_CONTRACT = Object.freeze({
  defaults: DEFAULT_NEXORA_ROUTE_RESOLUTION,
  allowedMrpTabs: ["dashboard", "assistant"] as const satisfies readonly MainRightPanelTab[],
  allowedDashboardContexts: [
    "overview",
    "sources",
    "scenario",
    "risk",
    "war_room",
    "timeline",
    "settings",
  ] as const satisfies readonly DashboardContext[],
  routeSources: [
    "left_nav",
    "scene_panel",
    "object_panel",
    "timeline",
    "assistant",
    "system",
  ] as const satisfies readonly RouteRequestSource[],
  routeTargets: [
    "dashboard",
    "assistant",
    "scene",
    "object",
    "timeline",
  ] as const satisfies readonly RouteRequestTarget[],
});

const routingWarnings = new Set<string>();

function warnRoutingBrake(message: string, payload?: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(payload ?? {})}`;
  if (routingWarnings.has(key)) return;
  routingWarnings.add(key);
  console.warn(message, payload ?? {});
}

export function isRouteRequestSource(value: unknown): value is RouteRequestSource {
  return (
    typeof value === "string" &&
    (NEXORA_ROUTING_CONTRACT.routeSources as readonly string[]).includes(value.trim().toLowerCase())
  );
}

export function isRouteRequestTarget(value: unknown): value is RouteRequestTarget {
  return (
    typeof value === "string" &&
    (NEXORA_ROUTING_CONTRACT.routeTargets as readonly string[]).includes(value.trim().toLowerCase())
  );
}

export function normalizeRouteRequestSource(value: unknown): RouteRequestSource {
  if (isRouteRequestSource(value)) return value.trim().toLowerCase() as RouteRequestSource;
  warnRoutingBrake("[Routing][Brake] Invalid route request.", {
    field: "source",
    received: value ?? null,
    fallback: "system",
  });
  return "system";
}

export function normalizeRouteRequestTarget(value: unknown): RouteRequestTarget {
  if (isRouteRequestTarget(value)) return value.trim().toLowerCase() as RouteRequestTarget;
  warnRoutingBrake("[Routing][Brake] Invalid route request.", {
    field: "target",
    received: value ?? null,
    fallback: "dashboard",
  });
  return "dashboard";
}

export function resolveNexoraRouteRequest(input: Partial<NexoraRouteRequest> | null | undefined): NexoraRouteResolution {
  if (!input || typeof input !== "object") {
    warnRoutingBrake("[Routing][Brake] Invalid route request.", {
      reason: "missing_request",
    });
    return {
      ...DEFAULT_NEXORA_ROUTE_RESOLUTION,
      valid: false,
      reason: "invalid_request_fallback",
    };
  }

  const source = normalizeRouteRequestSource(input.source);
  const target = normalizeRouteRequestTarget(input.target);
  const context =
    input.dashboardContext != null
      ? normalizeDashboardContext(input.dashboardContext, { warn: false })
      : input.legacyRoute
        ? mapLegacyPanelRouteToDashboardContext(input.legacyRoute, { warn: true })
        : "overview";
  const objectId =
    typeof input.objectId === "string" && input.objectId.trim().length > 0
      ? input.objectId.trim()
      : null;

  if (target === "assistant") {
    return {
      valid: true,
      mrpTab: "assistant",
      dashboardContext: context,
      sceneTimelineActive: false,
      selectedObjectId: objectId,
      assistantIsolated: true,
      reason: input.reason ?? `${source}_assistant_route`,
    };
  }

  if (target === "timeline") {
    return {
      valid: true,
      mrpTab: "dashboard",
      dashboardContext: "timeline",
      sceneTimelineActive: true,
      selectedObjectId: objectId,
      assistantIsolated: false,
      reason: input.reason ?? `${source}_timeline_scene_route`,
    };
  }

  if (target === "object") {
    return {
      valid: true,
      mrpTab: "dashboard",
      dashboardContext: context,
      sceneTimelineActive: false,
      selectedObjectId: objectId,
      assistantIsolated: false,
      reason: input.reason ?? `${source}_object_selection_route`,
    };
  }

  return {
    valid: true,
    mrpTab: "dashboard",
    dashboardContext: context,
    sceneTimelineActive: false,
    selectedObjectId: objectId,
    assistantIsolated: false,
    reason: input.reason ?? `${source}_${target}_dashboard_route`,
  };
}

export function warnUnauthorizedRoutingMrpTab(tab: unknown): void {
  const normalized = normalizeMainRightPanelTab(tab, { warn: false });
  if (normalized === tab) return;
  warnRoutingBrake("[Routing][Brake] Unauthorized MRP tab requested.", {
    attemptedTab: tab ?? null,
    allowedTabs: NEXORA_ROUTING_CONTRACT.allowedMrpTabs,
  });
}

export function warnLegacyRouteDetected(route: unknown, mappedContext?: DashboardContext): void {
  warnRoutingBrake("[Routing][Brake] Legacy route detected.", {
    legacyRoute: route ?? null,
    mappedDashboardContext: mappedContext ?? null,
  });
}

export function warnDashboardContextResolutionFailed(value: unknown): void {
  warnRoutingBrake("[Routing][Brake] Dashboard context resolution failed.", {
    dashboardContext: value ?? null,
    fallback: "overview",
  });
}

export function warnDuplicateRouteStateDetected(states: readonly string[]): void {
  const normalized = states.map((state) => state.trim()).filter(Boolean);
  if (normalized.length <= 1) return;
  warnRoutingBrake("[Routing][Brake] Duplicate route state detected.", {
    states: normalized,
    canonical: "NexoraRouteRequest -> MainRightPanelTab + DashboardContext",
  });
}
