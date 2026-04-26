import type { CenterExecutionSurface, CanonicalRightPanelView, RightPanelView } from "./rightPanelTypes";

export type NexoraPanelButtonRole = "command" | "processing";
export type PanelHelpTargetType = "right_panel" | "center_execution";

export type PanelHelpSuggestion = {
  label: string;
  targetType: PanelHelpTargetType;
  targetView?: CanonicalRightPanelView;
  centerSurface?: CenterExecutionSurface;
};

const COMMAND_VIEWS = new Set<CanonicalRightPanelView>([
  "input",
  "workspace",
  "object",
  "object_focus",
  "war_room",
  "timeline",
  "advice",
  "explanation",
  "conflict",
  "risk",
  "fragility",
]);

const PROCESSING_VIEWS = new Set<CanonicalRightPanelView>([
  "simulate",
  "compare",
  "decision_timeline",
  "replay",
  "scenario_tree",
]);

const PROCESSING_TOKENS = /\b(simulate|simulation|compare|replay|execute|run|trace|propagation|deep|scenario|impact|timeline|workspace)\b/i;

export function resolvePanelButtonRole(input: {
  label?: string | null;
  action?: string | null;
  targetView?: RightPanelView;
}): NexoraPanelButtonRole {
  if (input.targetView && PROCESSING_VIEWS.has(input.targetView)) return "processing";
  if (input.targetView && COMMAND_VIEWS.has(input.targetView)) return "command";
  const text = `${input.label ?? ""} ${input.action ?? ""}`.trim();
  if (PROCESSING_TOKENS.test(text)) return "processing";
  return "command";
}

export function resolveCenterSurfaceForPanelAction(input: {
  label?: string | null;
  action?: string | null;
  targetView?: RightPanelView;
}): CenterExecutionSurface | null {
  if (input.targetView === "compare") return "compare";
  if (input.targetView === "timeline" || input.targetView === "decision_timeline") return "timeline";
  if (input.targetView === "simulate") return "simulation";
  if (input.targetView === "replay" || input.targetView === "scenario_tree") return "analysis";
  const text = `${input.label ?? ""} ${input.action ?? ""}`.toLowerCase();
  if (text.includes("workspace")) return "workspace";
  if (text.includes("compare")) return "compare";
  if (text.includes("timeline") || text.includes("trace") || text.includes("propagation")) return "timeline";
  if (text.includes("simulate") || text.includes("simulation") || text.includes("impact")) return "simulation";
  if (text.includes("replay") || text.includes("scenario") || text.includes("execute")) return "analysis";
  return null;
}

export function getPanelHelpSuggestions(view: RightPanelView): PanelHelpSuggestion[] {
  switch (view) {
    case "input":
      return [
        { label: "Open workspace", targetType: "center_execution", centerSurface: "workspace" },
        { label: "Strategic advice", targetType: "right_panel", targetView: "advice" },
      ];
    case "workspace":
      return [
        { label: "Open Workspace", targetType: "center_execution", centerSurface: "workspace" },
        { label: "Open Object Analysis", targetType: "center_execution", centerSurface: "object_inspection" },
      ];
    case "object":
    case "object_focus":
      return [
        { label: "Simulate impact", targetType: "center_execution", centerSurface: "simulation" },
        { label: "Inspect risk flow", targetType: "right_panel", targetView: "risk" },
      ];
    case "war_room":
      return [
        { label: "Compare options", targetType: "center_execution", centerSurface: "compare" },
        { label: "Open advice", targetType: "right_panel", targetView: "advice" },
      ];
    case "timeline":
      return [
        { label: "Open full timeline", targetType: "center_execution", centerSurface: "timeline" },
        { label: "Compare options", targetType: "center_execution", centerSurface: "compare" },
      ];
    case "advice":
      return [
        { label: "Compare options", targetType: "center_execution", centerSurface: "compare" },
        { label: "Go to War Room", targetType: "right_panel", targetView: "war_room" },
      ];
    case "explanation":
      return [
        { label: "Inspect conflict", targetType: "right_panel", targetView: "conflict" },
        { label: "Simulate mitigation", targetType: "center_execution", centerSurface: "simulation" },
      ];
    case "conflict":
      return [
        { label: "Inspect risk flow", targetType: "right_panel", targetView: "risk" },
        { label: "Compare mitigation", targetType: "center_execution", centerSurface: "compare" },
      ];
    case "risk":
    case "fragility":
      return [
        { label: "Trace propagation", targetType: "center_execution", centerSurface: "timeline" },
        { label: "Simulate mitigation", targetType: "center_execution", centerSurface: "simulation" },
      ];
    case "simulate":
      return [
        { label: "Open simulation", targetType: "center_execution", centerSurface: "simulation" },
        { label: "Compare options", targetType: "center_execution", centerSurface: "compare" },
      ];
    case "compare":
      return [
        { label: "Open compare", targetType: "center_execution", centerSurface: "compare" },
        { label: "Open timeline", targetType: "center_execution", centerSurface: "timeline" },
      ];
    default:
      return [
        { label: "Review advice", targetType: "right_panel", targetView: "advice" },
        { label: "Open timeline", targetType: "center_execution", centerSurface: "timeline" },
      ];
  }
}
