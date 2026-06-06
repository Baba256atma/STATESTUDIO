export type ScenePanelState = "expanded" | "collapsed";

export type ObjectCatalogState = "closed" | "open";

export type ScenePanelLocation = "left_scene_dock";

export type ScenePanelAllowedAction =
  | "open_catalog"
  | "refresh_scene"
  | "focus_scene"
  | "view_scene_details";

export type ScenePanelForbiddenAction =
  | "edit_object"
  | "rename_selected_object"
  | "object_property_editing"
  | "risk_calculation"
  | "scenario_generation";

export type ObjectCatalogEntrySource =
  | "scene_panel"
  | "scene_info_hud_legacy"
  | "catalog_ui"
  | "catalog_confirm";

export type ScenePanelInformationField =
  | "scene_name"
  | "scene_type"
  | "scene_status"
  | "object_count"
  | "topology_type"
  | "active_mode";

export type ScenePanelContract = Readonly<{
  location: ScenePanelLocation;
  sceneNative: true;
  headerAlwaysVisible: true;
  bodyCollapsible: true;
  allowedActions: readonly ScenePanelAllowedAction[];
  forbiddenActions: readonly ScenePanelForbiddenAction[];
  informationFields: readonly ScenePanelInformationField[];
  objectCatalogEntrySource: Extract<ObjectCatalogEntrySource, "scene_panel">;
  objectInsertionFlow: readonly [
    "scene_panel",
    "object_catalog",
    "object_selection",
    "scene_object_creation",
    "scene_refresh",
  ];
  forbiddenInsertionFlow: readonly [
    "scene_panel",
    "direct_scene_mutation",
  ];
}>;

export const SCENE_PANEL_CONTRACT: ScenePanelContract = Object.freeze({
  location: "left_scene_dock",
  sceneNative: true,
  headerAlwaysVisible: true,
  bodyCollapsible: true,
  allowedActions: [
    "open_catalog",
    "refresh_scene",
    "focus_scene",
    "view_scene_details",
  ] as const,
  forbiddenActions: [
    "edit_object",
    "rename_selected_object",
    "object_property_editing",
    "risk_calculation",
    "scenario_generation",
  ] as const,
  informationFields: [
    "scene_name",
    "scene_type",
    "scene_status",
    "object_count",
    "topology_type",
    "active_mode",
  ] as const,
  objectCatalogEntrySource: "scene_panel",
  objectInsertionFlow: [
    "scene_panel",
    "object_catalog",
    "object_selection",
    "scene_object_creation",
    "scene_refresh",
  ] as const,
  forbiddenInsertionFlow: [
    "scene_panel",
    "direct_scene_mutation",
  ] as const,
});

export function normalizeScenePanelState(value: unknown, options?: { warn?: boolean }): ScenePanelState {
  if (value === "expanded" || value === "collapsed") return value;
  if (typeof value === "boolean") return value ? "collapsed" : "expanded";

  if (options?.warn !== false) {
    console.warn("[ScenePanel][Brake] Invalid scene panel state.", {
      state: value ?? null,
      fallbackState: "expanded",
    });
  }
  return "expanded";
}

export function normalizeObjectCatalogState(value: unknown, options?: { warn?: boolean }): ObjectCatalogState {
  if (value === "open" || value === "closed") return value;

  if (options?.warn !== false) {
    console.warn("[ScenePanel][Brake] Object catalog failed to open.", {
      catalogState: value ?? null,
      fallbackState: "closed",
    });
  }
  return "closed";
}

export function warnSceneStateUnavailable(detail?: Record<string, unknown>): void {
  console.warn("[ScenePanel][Brake] Scene state unavailable.", detail ?? {});
}

export function normalizeObjectCatalogEntrySource(
  value: unknown,
  options?: { warn?: boolean }
): ObjectCatalogEntrySource {
  if (
    value === "scene_panel" ||
    value === "scene_info_hud_legacy" ||
    value === "catalog_ui" ||
    value === "catalog_confirm"
  ) {
    return value;
  }

  if (options?.warn !== false) {
    console.warn("[ScenePanel][Brake] Object catalog failed to open.", {
      source: value ?? null,
      fallbackSource: "scene_panel",
    });
  }
  return "scene_panel";
}

export function isScenePanelAllowedAction(value: unknown): value is ScenePanelAllowedAction {
  return (
    typeof value === "string" &&
    (SCENE_PANEL_CONTRACT.allowedActions as readonly string[]).includes(value)
  );
}
