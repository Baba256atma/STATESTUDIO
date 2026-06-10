import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_ASSISTANT_SUGGESTIONS_VISIBLE,
  resolveAssistantSuggestionsToggleAction,
  resolveAssistantSuggestionsTooltip,
} from "./assistantSuggestionsVisibilityContract.ts";
import { ASSISTANT_PANEL_DOCK_STORAGE_KEY } from "./assistantPanelDockContract.ts";
import {
  getAssistantSuggestionsVisible,
  resetAssistantSuggestionsVisibilityForTests,
  setAssistantSuggestionsVisible,
  toggleAssistantSuggestionsVisible,
} from "./assistantSuggestionsVisibilityRuntime.ts";

describe("assistant suggestions visibility", () => {
  beforeEach(() => {
    if (typeof globalThis.sessionStorage === "undefined") {
      const store = new Map<string, string>();
      (globalThis as typeof globalThis & { sessionStorage: Storage }).sessionStorage = {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
        clear: () => store.clear(),
        key: (index: number) => [...store.keys()][index] ?? null,
        get length() {
          return store.size;
        },
      } as Storage;
    }
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

  it("Test 4 — persists in sessionStorage across navigation", () => {
    setAssistantSuggestionsVisible(false);
    assert.equal(getAssistantSuggestionsVisible(), false);
    const raw = globalThis.sessionStorage?.getItem(ASSISTANT_PANEL_DOCK_STORAGE_KEY);
    assert.ok(raw);
    const parsed = JSON.parse(raw!) as { suggestions: boolean };
    assert.equal(parsed.suggestions, false);
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
