import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_ASSISTANT_SUGGESTIONS_VISIBLE,
  resolveAssistantSuggestionsToggleAction,
  resolveAssistantSuggestionsTooltip,
} from "./assistantSuggestionsVisibilityContract.ts";
import {
  getAssistantSuggestionsVisible,
  resetAssistantSuggestionsVisibilityForTests,
  setAssistantSuggestionsVisible,
  toggleAssistantSuggestionsVisible,
} from "./assistantSuggestionsVisibilityRuntime.ts";

describe("assistant suggestions visibility", () => {
  beforeEach(() => {
    resetAssistantSuggestionsVisibilityForTests(DEFAULT_ASSISTANT_SUGGESTIONS_VISIBLE);
  });

  it("Test 1 — default visible on assistant open", () => {
    assert.equal(getAssistantSuggestionsVisible(), true);
  });

  it("Test 2 — toggle collapses suggestions", () => {
    toggleAssistantSuggestionsVisible();
    assert.equal(getAssistantSuggestionsVisible(), false);
    assert.equal(resolveAssistantSuggestionsToggleAction(true), "collapse");
  });

  it("Test 3 — toggle again expands suggestions", () => {
    setAssistantSuggestionsVisible(false);
    toggleAssistantSuggestionsVisible();
    assert.equal(getAssistantSuggestionsVisible(), true);
    assert.equal(resolveAssistantSuggestionsToggleAction(false), "expand");
  });

  it("Test 4 — collapsed state remains in runtime across navigation-like reads", () => {
    setAssistantSuggestionsVisible(false);
    assert.equal(getAssistantSuggestionsVisible(), false);
  });

  it("Test 5 — collapsed state preserved after object context change simulation", () => {
    setAssistantSuggestionsVisible(false);
    setAssistantSuggestionsVisible(false);
    assert.equal(getAssistantSuggestionsVisible(), false);
  });

  it("tooltip copy matches visibility state", () => {
    assert.equal(resolveAssistantSuggestionsTooltip(true), "Hide Suggestions");
    assert.equal(resolveAssistantSuggestionsTooltip(false), "Show Suggestions");
  });
});
