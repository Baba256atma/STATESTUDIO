/**
 * MRP_HUD:13:8 / MRP_HUD:14:2 — Scene Panel header scene control actions.
 */

export type ScenePanelControlActionId = "global_view" | "fit_scene" | "focus";

export const SCENE_PANEL_CONTROL_ACTIONS = Object.freeze([
  { id: "global_view" as const, label: "GLOBAL", title: "Global View", icon: "🌐" },
  { id: "fit_scene" as const, label: "FIT", title: "Fit Scene", icon: "⊞" },
  { id: "focus" as const, label: "FOCUS", title: "Focus Mode", icon: "◎" },
]);

export const SCENE_PANEL_CONTROL_COMPACT_LABELS = "GLOBAL,FIT,FOCUS" as const;

let loggedHeaderActions = false;
const loggedActions = new Set<ScenePanelControlActionId>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceNexoraScenePanelActions(): void {
  if (!isDev() || loggedHeaderActions) return;
  loggedHeaderActions = true;
  globalThis.console?.log?.(
    `[NexoraScenePanelActions] compact=true alwaysVisible=true labels=${SCENE_PANEL_CONTROL_COMPACT_LABELS}`
  );
}

/** @deprecated Use traceNexoraScenePanelActions */
export function traceScenePanelControlsTop(): void {
  traceNexoraScenePanelActions();
}

export function traceScenePanelControlAction(action: ScenePanelControlActionId): void {
  if (!isDev()) return;
  if (loggedActions.has(action)) return;
  loggedActions.add(action);
  globalThis.console?.log?.(`[NexoraSceneControls] action=${action}`);
}

export function resetScenePanelControlsContractForTests(): void {
  loggedHeaderActions = false;
  loggedActions.clear();
}
