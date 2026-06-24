import { devLogThrottled } from "../../lib/runtime/diagnosticThrottle.ts";
import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";
import {
  NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX,
  resolveObjectPanelLazyObjectId,
} from "./objectPanelLazyRuntime.ts";

export const CHECKPOINT1_FIX2_OBJECT_PANEL_RENDER_TAGS = Object.freeze([
  "[CHECKPOINT1_RIGHT_PANEL_HOST_OBJECT_RENDER_FIX]",
  "[READONLY_SELECTION_RENDER_PATH]",
  "[OBJECT_PANEL_OPEN_WITH_DASHBOARD_VIEW]",
  "[NO_ROUTE_COMMIT_REINTRODUCED]",
  "[CHECKPOINT1_FIX2_COMPLETE]",
] as const);

export const CHECKPOINT1_FIX3_OBJECT_PANEL_RENDER_TAGS = Object.freeze([
  "[CHECKPOINT1_FIX3_SELECTION_OVERRIDE_ORDER]",
  "[OBJECT_PANEL_BEFORE_EMPTY_DASHBOARD_FALLBACK]",
  "[READONLY_OBJECT_PANEL_RENDER_FIXED]",
  "[NO_ROUTE_COMMIT_REINTRODUCED]",
  "[CHECKPOINT1_FIX3_COMPLETE]",
] as const);

export type ReadonlySelectedObjectInput = Readonly<{
  contextId?: string | null;
  activeExecutiveObjectId?: string | null;
  selectedObjectId?: string | null;
  focusedId?: string | null;
}>;

export type ReadonlyObjectPanelRenderInput = Readonly<{
  viewToRender: RightPanelView;
  rightPanelOpen: boolean;
}> &
  ReadonlySelectedObjectInput;

const OBJECT_PANEL_VIEWS = new Set<RightPanelView>([
  "executive_object",
  "object",
  "object_focus",
]);

export function isDedicatedObjectPanelView(view: RightPanelView): boolean {
  return view != null && OBJECT_PANEL_VIEWS.has(view);
}

export function resolveReadonlySelectedObjectId(
  input: ReadonlySelectedObjectInput
): string | null {
  return resolveObjectPanelLazyObjectId({
    contextId: input.contextId,
    activeExecutiveObjectId: input.activeExecutiveObjectId,
    selectedObjectId: input.selectedObjectId,
    focusedId: input.focusedId,
  });
}

export function shouldRenderReadonlyObjectPanel(
  input: ReadonlyObjectPanelRenderInput
): boolean {
  const readonlySelectedObjectId = resolveReadonlySelectedObjectId(input);
  if (!input.rightPanelOpen) return false;
  if (!readonlySelectedObjectId) return false;
  if (isDedicatedObjectPanelView(input.viewToRender)) return false;
  return true;
}

export function logReadonlyObjectPanelHostRender(input: {
  viewToRender: RightPanelView;
  objectId: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  devLogThrottled({
    key: `readonly-object-panel-host:${input.viewToRender ?? "none"}:${input.objectId}`,
    label: NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX,
    scope: "panel",
    intervalMs: 1000,
    payload: {
      source: "RightPanelHost",
      action: "readonly_selection_render",
      reason: "selected_object_without_view_route",
      viewToRender: input.viewToRender ?? null,
      objectId: input.objectId,
      tags: CHECKPOINT1_FIX2_OBJECT_PANEL_RENDER_TAGS,
    },
  });
}
