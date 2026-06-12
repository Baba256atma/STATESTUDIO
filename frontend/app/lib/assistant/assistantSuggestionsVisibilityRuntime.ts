/**
 * MRP:12:7 — Footer suggestions visibility (decoupled from support dock).
 */

import { ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY } from "./assistantSuggestionsVisibilityContract.ts";

const listeners = new Set<() => void>();

let suggestionsVisible = true;

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

export function getAssistantSuggestionsVisible(): boolean {
  return suggestionsVisible;
}

export function setAssistantSuggestionsVisible(visible: boolean): boolean {
  if (suggestionsVisible === visible) return suggestionsVisible;
  suggestionsVisible = visible;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY, visible ? "1" : "0");
    } catch {
      // ignore storage failures
    }
  }
  notifyListeners();
  return suggestionsVisible;
}

export function toggleAssistantSuggestionsVisible(): boolean {
  return setAssistantSuggestionsVisible(!getAssistantSuggestionsVisible());
}

export function resetAssistantSuggestionsVisibilityForTests(visible = true): void {
  suggestionsVisible = visible;
  notifyListeners();
}

export function subscribeAssistantSuggestionsVisibility(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function collapseAssistantSuggestions(): void {
  setAssistantSuggestionsVisible(false);
}

export function expandAssistantSuggestions(): void {
  setAssistantSuggestionsVisible(true);
}
