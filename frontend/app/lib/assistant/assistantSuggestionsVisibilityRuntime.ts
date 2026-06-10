/**
 * MRP:11:2:2 — Back-compat bridge for suggestions visibility (delegates to panel dock).
 */

import { ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY } from "./assistantSuggestionsVisibilityContract.ts";
import {
  collapseAssistantPanel,
  expandAssistantPanel,
  getAssistantPanelVisibility,
  isAssistantPanelVisible,
  resetAssistantPanelVisibilityForTests,
  setAssistantPanelVisible,
  subscribeAssistantPanelVisibility,
} from "./assistantPanelDockRuntime.ts";

export function getAssistantSuggestionsVisible(): boolean {
  return isAssistantPanelVisible("suggestions");
}

export function setAssistantSuggestionsVisible(visible: boolean): boolean {
  return setAssistantPanelVisible("suggestions", visible);
}

export function toggleAssistantSuggestionsVisible(): boolean {
  return setAssistantPanelVisible("suggestions", !getAssistantSuggestionsVisible());
}

export function subscribeAssistantSuggestionsVisibility(listener: () => void): () => void {
  return subscribeAssistantPanelVisibility(listener);
}

export function resetAssistantSuggestionsVisibilityForTests(visible: boolean): void {
  resetAssistantPanelVisibilityForTests({
    ...getAssistantPanelVisibility(),
    suggestions: visible,
  });
}

export function collapseAssistantSuggestionsForTests(): void {
  collapseAssistantPanel("suggestions");
}

export function expandAssistantSuggestionsForTests(): void {
  expandAssistantPanel("suggestions");
}

/** @deprecated Legacy storage key — migrated on panel dock hydrate. */
export { ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY };
