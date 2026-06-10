"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getAssistantSuggestionsVisible,
  subscribeAssistantSuggestionsVisibility,
  toggleAssistantSuggestionsVisible,
} from "../../lib/assistant/assistantSuggestionsVisibilityRuntime";
import { DEFAULT_ASSISTANT_SUGGESTIONS_VISIBLE } from "../../lib/assistant/assistantSuggestionsVisibilityContract";

export function useAssistantSuggestionsVisibility(): boolean {
  return useSyncExternalStore(
    subscribeAssistantSuggestionsVisibility,
    getAssistantSuggestionsVisible,
    () => DEFAULT_ASSISTANT_SUGGESTIONS_VISIBLE
  );
}

export function useAssistantSuggestionsVisibilityControls(): Readonly<{
  assistantSuggestionsVisible: boolean;
  toggleAssistantSuggestionsVisible: () => void;
}> {
  const assistantSuggestionsVisible = useAssistantSuggestionsVisibility();
  const toggle = useCallback(() => {
    toggleAssistantSuggestionsVisible();
  }, []);

  return {
    assistantSuggestionsVisible,
    toggleAssistantSuggestionsVisible: toggle,
  };
}

export default useAssistantSuggestionsVisibility;
