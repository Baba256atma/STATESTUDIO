/**
 * MRP:11:2:1 — Assistant suggestions visibility contract.
 */

export const DEFAULT_ASSISTANT_SUGGESTIONS_VISIBLE = true as const;

export const ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY =
  "nexora:assistant-suggestions-visible" as const;

export type AssistantSuggestionsToggleAction = "expand" | "collapse";

export type AssistantSuggestionsVisibilityState = Readonly<{
  assistantSuggestionsVisible: boolean;
}>;

export function resolveAssistantSuggestionsToggleAction(
  visible: boolean
): AssistantSuggestionsToggleAction {
  return visible ? "collapse" : "expand";
}

export function resolveAssistantSuggestionsTooltip(visible: boolean): string {
  return visible ? "Hide Suggestions" : "Show Suggestions";
}
