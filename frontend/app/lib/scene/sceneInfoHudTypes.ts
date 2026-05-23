/**
 * E2:8 — Scene Info HUD contracts (view selector, FRSI, quick actions).
 */

export type SceneInfoViewOption = {
  id: string;
  label: string;
};

/** Future-ready scene view selector options (no business logic in E2:8). */
export const SCENE_INFO_VIEW_OPTIONS: readonly SceneInfoViewOption[] = [
  { id: "global", label: "Global View" },
  { id: "regional", label: "Regional View" },
  { id: "supply_chain", label: "Supply Chain View" },
] as const;

export type SceneInfoFrsiMetricKey = "flow" | "resource" | "stability" | "impact";

export type SceneInfoFrsiMetrics = Record<SceneInfoFrsiMetricKey, number>;

export const SCENE_INFO_FRSI_LABELS: Record<SceneInfoFrsiMetricKey, string> = {
  flow: "Flow",
  resource: "Resource",
  stability: "Stability",
  impact: "Impact",
};

/** Read-only placeholder metrics until live engines wire in (E2:10 / D3). */
export const SCENE_INFO_FRSI_PLACEHOLDER: SceneInfoFrsiMetrics = {
  flow: 0.72,
  resource: 0.64,
  stability: 0.81,
  impact: 0.58,
};

export type SceneInfoQuickActionId = "reset_view" | "focus_selection" | "fit_scene" | "snapshot";

export const SCENE_INFO_QUICK_ACTIONS: readonly { id: SceneInfoQuickActionId; label: string }[] = [
  { id: "reset_view", label: "Reset View" },
  { id: "focus_selection", label: "Focus Selection" },
  { id: "fit_scene", label: "Fit Scene" },
  { id: "snapshot", label: "Snapshot" },
] as const;
