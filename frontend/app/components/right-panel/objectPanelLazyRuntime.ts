import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";

export const CHECKPOINT1_OBJECT_PANEL_VISIBILITY_TAGS = Object.freeze([
  "[CHECKPOINT1_OBJECT_PANEL_VISIBILITY_FIX]",
  "[READONLY_SELECTION_PANEL_OPEN]",
  "[OBJECT_PANEL_OPEN_WITHOUT_ROUTE_COMMIT]",
  "[NO_OBJECT_CLICK_WRITE_REINTRODUCED]",
  "[CHECKPOINT1_FIX_COMPLETE]",
] as const);

export const NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX =
  "[NexoraObjectPanelVisibility]" as const;

export type ObjectPanelLazyRenderKind =
  | "executive_panel"
  | "object_context_fallback"
  | "no_selection_fallback"
  | "no_visible_objects_fallback";

export type ObjectPanelLazyResolutionInput = Readonly<{
  view: RightPanelView;
  contextId?: string | null;
  selectedObjectId?: string | null;
  activeExecutiveObjectId?: string | null;
  focusedId?: string | null;
  visibleSceneObjects: readonly { id?: string; name?: string }[];
  hasVisibleSceneObjects: boolean;
}>;

export type ObjectPanelLazyResolvedState = Readonly<{
  resolvedObjectId: string | null;
  renderKind: ObjectPanelLazyRenderKind;
  readonlySelectionPanelOpen: boolean;
}>;

export function resolveObjectPanelLazyObjectId(
  props: Pick<
    ObjectPanelLazyResolutionInput,
    "contextId" | "activeExecutiveObjectId" | "selectedObjectId" | "focusedId"
  >
): string | null {
  const resolvedObjectId = String(
    props.contextId ??
      props.activeExecutiveObjectId ??
      props.selectedObjectId ??
      props.focusedId ??
      ""
  ).trim();
  return resolvedObjectId || null;
}

function buildVisibleObjectIdSet(
  props: Pick<ObjectPanelLazyResolutionInput, "hasVisibleSceneObjects" | "visibleSceneObjects">
): ReadonlySet<string> {
  if (!props.hasVisibleSceneObjects) return new Set();
  return new Set(
    props.visibleSceneObjects
      .map((object) => String(object?.id ?? "").trim())
      .filter(Boolean)
  );
}

export function resolveObjectPanelLazyState(
  props: ObjectPanelLazyResolutionInput
): ObjectPanelLazyResolvedState {
  const resolvedObjectId = resolveObjectPanelLazyObjectId(props);
  const visibleIds = buildVisibleObjectIdSet(props);

  if (resolvedObjectId) {
    if (visibleIds.size > 0 && !visibleIds.has(resolvedObjectId)) {
      return Object.freeze({
        resolvedObjectId,
        renderKind: "object_context_fallback",
        readonlySelectionPanelOpen: false,
      });
    }
    return Object.freeze({
      resolvedObjectId,
      renderKind: "executive_panel",
      readonlySelectionPanelOpen: props.view !== "executive_object",
    });
  }

  if (!props.hasVisibleSceneObjects || props.visibleSceneObjects.length === 0) {
    return Object.freeze({
      resolvedObjectId: null,
      renderKind: "no_visible_objects_fallback",
      readonlySelectionPanelOpen: false,
    });
  }

  return Object.freeze({
    resolvedObjectId: null,
    renderKind: "no_selection_fallback",
    readonlySelectionPanelOpen: false,
  });
}
