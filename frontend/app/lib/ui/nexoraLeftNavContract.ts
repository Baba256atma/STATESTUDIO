import type { RightPanelView } from "./right-panel/rightPanelTypes";
import type { DashboardContext } from "./mainRightPanelContract";

export type NexoraLeftNavMode =
  | "sources"
  | "dashboard"
  | "scenario"
  | "risk"
  | "war_room"
  | "timeline"
  | "settings";

export type NexoraLeftNavDashboardContext = DashboardContext;
export type NexoraLeftNavRoutePolicy =
  | "dashboard_context"
  | "scene_native_timeline"
  | "controlled_settings_surface";

export type NexoraLeftNavItem = {
  id: NexoraLeftNavMode;
  label: string;
  iconKey: string;
  description: string;
  dashboardContext: NexoraLeftNavDashboardContext;
  defaultPanelTarget: NonNullable<RightPanelView>;
  routePolicy: NexoraLeftNavRoutePolicy;
};

export const DEFAULT_NEXORA_LEFT_NAV_MODE: NexoraLeftNavMode = "dashboard";

export const CANONICAL_NEXORA_LEFT_NAV_ITEMS: readonly NexoraLeftNavItem[] = Object.freeze([
  {
    id: "sources",
    label: "Sources",
    iconKey: "sources",
    description: "Data input and source management.",
    dashboardContext: "sources",
    defaultPanelTarget: "dashboard",
    routePolicy: "dashboard_context",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    iconKey: "dashboard",
    description: "Main executive overview.",
    dashboardContext: "overview",
    defaultPanelTarget: "dashboard",
    routePolicy: "dashboard_context",
  },
  {
    id: "scenario",
    label: "Scenario",
    iconKey: "scenario",
    description: "Scenario design and comparison.",
    dashboardContext: "scenario",
    defaultPanelTarget: "dashboard",
    routePolicy: "dashboard_context",
  },
  {
    id: "risk",
    label: "Risk",
    iconKey: "risk",
    description: "Risk and weak-point analysis.",
    dashboardContext: "risk",
    defaultPanelTarget: "dashboard",
    routePolicy: "dashboard_context",
  },
  {
    id: "war_room",
    label: "War Room",
    iconKey: "war_room",
    description: "Critical decision workspace.",
    dashboardContext: "war_room",
    defaultPanelTarget: "dashboard",
    routePolicy: "dashboard_context",
  },
  {
    id: "timeline",
    label: "Timeline",
    iconKey: "timeline",
    description: "Timeline awareness and simulation history.",
    dashboardContext: "timeline",
    defaultPanelTarget: "dashboard",
    routePolicy: "scene_native_timeline",
  },
  {
    id: "settings",
    label: "Settings",
    iconKey: "settings",
    description: "Workspace preferences.",
    dashboardContext: "settings",
    defaultPanelTarget: "dashboard",
    routePolicy: "controlled_settings_surface",
  },
]);

const CANONICAL_MODE_SET = new Set<NexoraLeftNavMode>(
  CANONICAL_NEXORA_LEFT_NAV_ITEMS.map((item) => item.id)
);

/**
 * Deprecated legacy navigation values retained only as input compatibility.
 * They must never be displayed as primary left-nav labels or create MRP tabs.
 */
export const DEPRECATED_LEFT_NAV_MODE_MAP: Readonly<Record<string, NexoraLeftNavMode>> = Object.freeze({
  OPS: "dashboard",
  WAR: "war_room",
  RSK: "risk",
  EXE: "dashboard",
  CTRL: "settings",
  scene_group: "dashboard",
  strategy_group: "scenario",
  risk_group: "risk",
  workflow_group: "dashboard",
  executive_group: "dashboard",
  operational_topology: "dashboard",
  war_room: "war_room",
  risk_view: "risk",
  executive_control: "settings",
  scene: "dashboard",
  objects: "dashboard",
  simulation: "scenario",
  simulate: "scenario",
  executive: "dashboard",
});

export function isNexoraLeftNavMode(value: unknown): value is NexoraLeftNavMode {
  return typeof value === "string" && CANONICAL_MODE_SET.has(value as NexoraLeftNavMode);
}

export function resolveNexoraLeftNavMode(value: unknown, options?: { warn?: boolean }): NexoraLeftNavMode {
  if (isNexoraLeftNavMode(value)) return value;

  const raw = typeof value === "string" ? value.trim() : "";
  const mapped = raw ? DEPRECATED_LEFT_NAV_MODE_MAP[raw] ?? DEPRECATED_LEFT_NAV_MODE_MAP[raw.toUpperCase()] : null;
  if (mapped) return mapped;

  if (options?.warn !== false) {
    console.warn("[LeftNav][Brake]", {
      invalidMode: value ?? null,
      fallbackMode: DEFAULT_NEXORA_LEFT_NAV_MODE,
    });
  }
  return DEFAULT_NEXORA_LEFT_NAV_MODE;
}

export function getNexoraLeftNavItem(mode: unknown): NexoraLeftNavItem {
  const resolvedMode = resolveNexoraLeftNavMode(mode);
  return (
    CANONICAL_NEXORA_LEFT_NAV_ITEMS.find((item) => item.id === resolvedMode) ??
    CANONICAL_NEXORA_LEFT_NAV_ITEMS[1]
  );
}
