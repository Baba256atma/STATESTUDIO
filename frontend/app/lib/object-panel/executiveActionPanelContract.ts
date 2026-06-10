/** E2:X — Object Panel action ids (request-only; never selection authority). */

export type ExecutiveActionPanelActionId =
  | "focus_object"
  | "explain_object"
  | "show_dependencies"
  | "show_risks"
  | "run_scenario"
  | "compare_scenarios"
  | "open_war_room"
  | "open_timeline"
  | "open_decision_analysis"
  | "open_strategic_comparison";

export type ExecutiveActionPanelModel = {
  objectId: string;
  objectName: string;
  objectType: string;
  status: string;
  riskLevel: string;
  connections: number;
  dependencies: number;
  scenarios: number;
  lastUpdated?: string;
};

export const EXECUTIVE_OBJECT_PANEL_ACTION_EVENT = "nexora:executive-object-action";

export function emitExecutiveObjectPanelAction(
  action: ExecutiveActionPanelActionId | string,
  objectId: string
): void {
  if (typeof window === "undefined") return;
  const normalizedId = String(objectId ?? "").trim();
  if (!normalizedId) return;
  window.dispatchEvent(
    new CustomEvent(EXECUTIVE_OBJECT_PANEL_ACTION_EVENT, {
      detail: { action, objectId: normalizedId },
    })
  );
}

export const EXECUTIVE_PRIMARY_ACTIONS: ReadonlyArray<{
  id: ExecutiveActionPanelActionId;
  label: string;
}> = Object.freeze([
  { id: "focus_object", label: "Focus" },
  { id: "explain_object", label: "Explain" },
  { id: "show_dependencies", label: "Dependencies" },
  { id: "show_risks", label: "Risks" },
  { id: "run_scenario", label: "Simulate" },
  { id: "compare_scenarios", label: "Compare" },
]);

export const EXECUTIVE_ADVANCED_ACTIONS: ReadonlyArray<{
  id: ExecutiveActionPanelActionId;
  label: string;
}> = Object.freeze([
  { id: "open_war_room", label: "War Room" },
  { id: "open_timeline", label: "Timeline" },
  { id: "open_decision_analysis", label: "Decision Analysis" },
  { id: "open_strategic_comparison", label: "Strategic Comparison" },
]);
