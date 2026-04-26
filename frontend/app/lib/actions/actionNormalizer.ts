import { CANONICAL_RIGHT_PANEL_VIEWS, type CenterExecutionSurface, type RightPanelView } from "../ui/right-panel/rightPanelTypes";
import type { CanonicalNexoraAction, NexoraActionSource, NexoraActionSurface } from "./actionTypes";

function createActionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `act_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isCanonicalPanelView(v: string): v is Exclude<RightPanelView, null> {
  return (CANONICAL_RIGHT_PANEL_VIEWS as readonly string[]).includes(v);
}

export function inferSourceFromOpenPanelMeta(sourceHint?: string | null): NexoraActionSource {
  const s = String(sourceHint ?? "").toLowerCase();
  if (s.includes("chat") || s === "command" || s.includes("assistant")) return "chat";
  if (s.includes("scanner")) return "scanner";
  if (s.includes("demo")) return "demo";
  if (s.includes("guided") || s.includes("prompt_guide")) return "guided";
  if (s.includes("left_nav") || s === "left_nav" || s.includes("leftnav")) return "left_nav";
  if (s.includes("topbar") || s.includes("header") || s.includes("command_header")) return "topbar";
  if (s.includes("cta") || s.includes("panel")) return "panel_cta";
  return "system";
}

export type OpenRightPanelEventDetail = {
  view?: RightPanelView | string | null;
  tab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  source?: string | null;
  contextId?: string | null;
  clickedTab?: string | null;
  clickedNav?: string | null;
  preserveIfSameContext?: boolean;
  allowAutoOverride?: boolean;
};

/** Normalize `nexora:open-right-panel` custom event detail. */
export function normalizeOpenRightPanelEventDetail(detail: OpenRightPanelEventDetail | null | undefined): CanonicalNexoraAction {
  const rawView = typeof detail?.view === "string" ? detail.view.trim() : "";
  const viewCandidate = rawView.length > 0 ? rawView : null;
  const view: RightPanelView =
    viewCandidate && isCanonicalPanelView(viewCandidate) ? viewCandidate : null;

  const source = inferSourceFromOpenPanelMeta(detail?.source ?? null);
  const rawSource =
    typeof detail?.source === "string" && detail.source.trim()
      ? `event:nexora:open-right-panel:${detail.source.trim()}`
      : "event:nexora:open-right-panel";

  return {
    actionId: createActionId(),
    source,
    surface: "event_bus",
    intent: {
      kind: "open_panel",
      view,
      contextId: detail?.contextId ?? null,
      legacyTab: detail?.tab ?? null,
      leftNav: detail?.leftNav ?? null,
      section: detail?.section ?? null,
      clickedTab: detail?.clickedTab ?? null,
      clickedNav: detail?.clickedNav ?? null,
      preserveIfSameContext: detail?.preserveIfSameContext,
      allowAutoOverride: detail?.allowAutoOverride,
    },
    target: { type: "panel", id: view },
    meta: { rawSource, timestamp: Date.now() },
  };
}

export function normalizeRunSimulation(args: {
  source?: NexoraActionSource;
  surface?: NexoraActionSurface;
  rawSource?: string;
  /** B.8 — optional context for downstream consumers (fragility-anchored simulate). */
  payload?: Record<string, unknown> | null;
}): CanonicalNexoraAction {
  return {
    actionId: createActionId(),
    source: args.source ?? "panel_cta",
    surface: args.surface ?? "panel_cta",
    intent: { kind: "run_simulation" },
    target: { type: "center", id: "simulation" },
    meta: { rawSource: args.rawSource ?? "panel_cta:simulate", timestamp: Date.now() },
    ...(args.payload && Object.keys(args.payload).length > 0 ? { payload: args.payload } : {}),
  };
}

export function normalizeCompareOptions(args: {
  source?: NexoraActionSource;
  surface?: NexoraActionSurface;
  rawSource?: string;
  payload?: Record<string, unknown> | null;
}): CanonicalNexoraAction {
  return {
    actionId: createActionId(),
    source: args.source ?? "panel_cta",
    surface: args.surface ?? "center_overlay",
    intent: { kind: "compare_options" },
    target: { type: "center", id: "compare" },
    meta: { rawSource: args.rawSource ?? "panel_cta:compare", timestamp: Date.now() },
    ...(args.payload && Object.keys(args.payload).length > 0 ? { payload: args.payload } : {}),
  };
}

export function normalizeOpenCenterTimeline(args: {
  source?: NexoraActionSource;
  surface?: NexoraActionSurface;
  rawSource?: string;
}): CanonicalNexoraAction {
  return {
    actionId: createActionId(),
    source: args.source ?? "panel_cta",
    surface: args.surface ?? "center_overlay",
    intent: { kind: "open_center_timeline" },
    target: { type: "center", id: "timeline" },
    meta: { rawSource: args.rawSource ?? "panel_cta:timeline", timestamp: Date.now() },
  };
}

export function normalizeOpenObjectInspectionCenter(args?: {
  source?: NexoraActionSource;
  surface?: NexoraActionSurface;
  rawSource?: string;
}): CanonicalNexoraAction {
  const centerSurface: CenterExecutionSurface = "object_inspection";
  return {
    actionId: createActionId(),
    source: args?.source ?? "panel_cta",
    surface: args?.surface ?? "sub_panel",
    intent: { kind: "open_center_execution", surface: centerSurface },
    target: { type: "center", id: centerSurface },
    meta: { rawSource: args?.rawSource ?? "scene_inspect_objects_btn", timestamp: Date.now() },
  };
}

export function normalizeOpenPanelCta(args: {
  view: Exclude<RightPanelView, null>;
  contextId?: string | null;
  legacyTab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  clickedTab?: string | null;
  clickedNav?: string | null;
  preserveIfSameContext?: boolean;
  allowAutoOverride?: boolean;
  source?: NexoraActionSource;
  surface?: NexoraActionSurface;
  rawSource: string;
}): CanonicalNexoraAction {
  const source = args.source ?? "panel_cta";
  const surface = args.surface ?? (args.section || args.leftNav || args.legacyTab ? "sub_panel" : "panel_cta");
  return {
    actionId: createActionId(),
    source,
    surface,
    intent: {
      kind: "open_panel",
      view: args.view,
      contextId: args.contextId ?? null,
      legacyTab: args.legacyTab ?? null,
      leftNav: args.leftNav ?? null,
      section: args.section ?? null,
      clickedTab: args.clickedTab ?? null,
      clickedNav: args.clickedNav ?? null,
      preserveIfSameContext: args.preserveIfSameContext,
      allowAutoOverride: args.allowAutoOverride,
    },
    target: { type: "panel", id: args.view },
    meta: { rawSource: args.rawSource, timestamp: Date.now() },
  };
}

export function normalizeStartDemoFromTopBar(): CanonicalNexoraAction {
  return {
    actionId: createActionId(),
    source: "topbar",
    surface: "topbar",
    intent: { kind: "start_demo" },
    target: { type: "none", id: null },
    meta: { rawSource: "command_header:start_investor_demo", timestamp: Date.now() },
  };
}

export function normalizeFocusObject(args: {
  objectId: string | null;
  source?: NexoraActionSource;
  surface?: NexoraActionSurface;
  rawSource?: string;
}): CanonicalNexoraAction {
  return {
    actionId: createActionId(),
    source: args.source ?? "chat",
    surface: args.surface ?? "chat",
    intent: { kind: "focus_object", objectId: args.objectId },
    target: { type: "object", id: args.objectId },
    meta: { rawSource: args.rawSource ?? "chat:focus_object", timestamp: Date.now() },
  };
}
