import type { SceneNavigationActionId } from "../sceneNavigationTypes";

/** E2:53 — Canonical executive toolbar actions (four only). */
export type ExecutiveToolbarAction =
  | "toggle_view_mode"
  | "global_view"
  | "fit_scene"
  | "focus_mode";

/** @deprecated Use ExecutiveToolbarAction */
export type SceneToolbarActionId = ExecutiveToolbarAction;

/** Object-specific actions that must not live on the scene toolbar. */
export type ObjectContextActionId = "create_impact";

export type ExecutiveToolbarVisibleAction = {
  id: Exclude<ExecutiveToolbarAction, "toggle_view_mode">;
  label: string;
  icon: string;
  navigationAction?: SceneNavigationActionId;
};

export type SceneToolbarVisibleAction = ExecutiveToolbarVisibleAction;

export const EXECUTIVE_TOOLBAR_ACTIONS: readonly ExecutiveToolbarVisibleAction[] = Object.freeze([
  { id: "global_view", label: "Global View", icon: "◉" },
  { id: "fit_scene", label: "Fit Scene", icon: "⊞", navigationAction: "fit_scene" },
  { id: "focus_mode", label: "Focus Mode", icon: "◎" },
]);

/** @deprecated Use EXECUTIVE_TOOLBAR_ACTIONS */
export const SCENE_TOOLBAR_VISIBLE_ACTIONS = EXECUTIVE_TOOLBAR_ACTIONS;

export const REMOVED_SCENE_TOOLBAR_MODES = Object.freeze([
  "select",
  "pan",
  "orbit",
  "zoom",
] as const);

export const REMOVED_SCENE_TOOLBAR_ACTIONS = Object.freeze([
  "focus_selection",
  "zoom_in",
  "zoom_out",
  "fullscreen",
  "reset_scene",
  "reset_view",
] as const);

export const OBJECT_CONTEXT_ACTIONS: Readonly<
  Record<ObjectContextActionId, { owner: "objectInfoHud"; label: string }>
> = Object.freeze({
  create_impact: {
    owner: "objectInfoHud",
    label: "Create Impact Path",
  },
});

const logKeys = new Set<string>();

function devLog(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function logSceneToolbarSimplified(): void {
  devLog("[Nexora][ToolbarSimplified]", {
    visibleActions: EXECUTIVE_TOOLBAR_ACTIONS.map((action) => action.id),
    removedModes: REMOVED_SCENE_TOOLBAR_MODES,
    removedActions: REMOVED_SCENE_TOOLBAR_ACTIONS,
  });
  devLog("[Nexora][ToolbarFinalized]", {
    actions: ["toggle_view_mode", ...EXECUTIVE_TOOLBAR_ACTIONS.map((action) => action.id)],
  });
}

export function logSceneToolbarActionRemoved(actionId: string, reason: string): void {
  devLog("[Nexora][ToolbarActionRemoved]", { actionId, reason });
}

export function logObjectActionMoved(actionId: ObjectContextActionId, targetPanel: string): void {
  devLog("[Nexora][ObjectActionMoved]", { actionId, targetPanel });
}

export function logSceneToolbarOwnership(): void {
  devLog("[Nexora][ToolbarOwnership]", {
    toolbarActions: ["toggle_view_mode", ...EXECUTIVE_TOOLBAR_ACTIONS.map((action) => action.id)],
    objectActions: Object.keys(OBJECT_CONTEXT_ACTIONS),
  });
}

export function resetSceneToolbarActionRegistryForTests(): void {
  logKeys.clear();
}
