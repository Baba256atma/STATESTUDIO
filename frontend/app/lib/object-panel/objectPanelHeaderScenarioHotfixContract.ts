/**
 * Object Panel header Scenario button hotfix — single canonical Scenario launch source.
 *
 * Canonical Scenario action lives in ExecutiveActionPanel object action button group only.
 */

export const OBJECT_PANEL_HEADER_SCENARIO_REMOVED_TAG =
  "[OBJECT_PANEL_HEADER_SCENARIO_REMOVED]" as const;

export type SceneActionDockHeaderActionId = "object" | "focus" | "explain";

export type SceneActionDockHeaderAction = Readonly<{
  id: SceneActionDockHeaderActionId;
  label: string;
  dashboardAction?: "focus" | "advisory";
}>;

/** Header/compact dock actions — Scenario intentionally excluded (see ExecutiveActionPanel). */
export const SCENE_ACTION_DOCK_HEADER_ACTIONS: readonly SceneActionDockHeaderAction[] =
  Object.freeze([
    { id: "object", label: "Object" },
    { id: "focus", label: "Focus", dashboardAction: "focus" },
    { id: "explain", label: "Explain", dashboardAction: "advisory" },
  ]);

export const SCENE_ACTION_DOCK_FORBIDDEN_HEADER_ACTIONS = Object.freeze(["scenario"] as const);
