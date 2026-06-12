/** MRP_HUD:14:1 — Scene Panel is the permanent system control center. */

export const SCENE_PANEL_ROLE = "system_control_center" as const;

export const SCENE_PANEL_EXPANSION_SLOTS = Object.freeze([
  { id: "governance", label: "Governance" },
  { id: "simulation", label: "Simulation" },
  { id: "forecast", label: "Forecast" },
  { id: "optimization", label: "Optimization" },
  { id: "timeline", label: "Timeline Intelligence" },
] as const);

export type ScenePanelExpansionSlotId = (typeof SCENE_PANEL_EXPANSION_SLOTS)[number]["id"];

/** Object-specific actions belong exclusively to Object Panel. */
export const SCENE_PANEL_FORBIDDEN_OBJECT_ACTIONS = Object.freeze([
  "object",
  "explain_object",
  "object_focus",
  "object_scenario",
] as const);

let loggedRole = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceNexoraScenePanelRole(): void {
  if (!isDev() || loggedRole) return;
  loggedRole = true;
  globalThis.console?.log?.(`[NexoraScenePanel] role=${SCENE_PANEL_ROLE}`);
}

export function resetScenePanelPurposeContractForTests(): void {
  loggedRole = false;
}
