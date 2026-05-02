export type SelectedObjectGuardInput = {
  intent: string;
  userInput: string;
  selectedObjectId?: string | null;
  targetPanel?: string | null;
};

export type SelectedObjectGuardDecision = {
  blocked: boolean;
  reason: string;
  assistantMessage: string;
  recommendedPanel: "SCN" | "OBJECTS" | "FOCUS" | null;
};

/**
 * Blocks analyze/decision execution when no object is selected.
 * Does not block open_panel, explain, or ask_context (deterministic on pipeline intent).
 */
export function evaluateSelectedObjectGuard(
  input: SelectedObjectGuardInput
): SelectedObjectGuardDecision {
  const intent = String(input.intent ?? "").trim().toLowerCase();
  const sel = typeof input.selectedObjectId === "string" ? input.selectedObjectId.trim() : "";
  const hasObject = Boolean(sel);

  if (intent === "open_panel" || intent === "explain" || intent === "ask_context") {
    return {
      blocked: false,
      reason: "selected_object_available_or_not_required",
      assistantMessage: "",
      recommendedPanel: null,
    };
  }

  const needsObject = intent === "analyze" || intent === "decide";

  if (needsObject && !hasObject) {
    return {
      blocked: true,
      reason: "analysis_requires_selected_object",
      assistantMessage: "Select an object first so I can analyze the right surface.",
      recommendedPanel: "SCN",
    };
  }

  return {
    blocked: false,
    reason: "selected_object_available_or_not_required",
    assistantMessage: "",
    recommendedPanel: null,
  };
}
