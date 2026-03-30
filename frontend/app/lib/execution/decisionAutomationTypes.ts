import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

export type DecisionAutomationResult = {
  status: "success" | "partial" | "error";
  mode: "simulate" | "preview" | "compare" | "save" | "apply";
  summary: string;
  affected_target_ids?: string[];
  next_view?: RightPanelView | null;
};
