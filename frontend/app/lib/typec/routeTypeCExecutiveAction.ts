import type { TypeCExecutiveAction } from "./typeCExecutiveActions.ts";

export type TypeCActionPanelResolution = {
  panelId: string;
  reason: string;
};

export function resolveTypeCActionPanel(action: TypeCExecutiveAction): TypeCActionPanelResolution | null {
  if (!action || action.disabled) return null;

  switch (action.kind) {
    case "analyze_object":
      return {
        panelId: "object_focus",
        reason: action.reason ?? "type_c_analyze_object",
      };
    case "explain_risk":
      return {
        panelId: "risk",
        reason: action.reason ?? "type_c_explain_risk",
      };
    case "monitor_signal":
      return {
        panelId: "risk_flow",
        reason: action.reason ?? "type_c_monitor_signal",
      };
    case "open_scenario":
      return {
        panelId: "war_room",
        reason: action.reason ?? "type_c_open_scenario",
      };
    case "compare_options":
      return {
        panelId: "compare",
        reason: action.reason ?? "type_c_compare_options",
      };
    default:
      return null;
  }
}
