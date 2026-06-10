import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  ASSISTANT_PANEL_DOCK_DEFINITIONS,
  DEFAULT_ASSISTANT_PANEL_VISIBILITY,
  resolveAssistantPanelDockAction,
  resolveAssistantPanelExpandTooltip,
} from "./assistantPanelDockContract.ts";
import {
  collapseAssistantPanel,
  expandAssistantPanel,
  getAssistantPanelVisibility,
  resetAssistantPanelVisibilityForTests,
  setAssistantPanelVisible,
  toggleAssistantPanelVisible,
} from "./assistantPanelDockRuntime.ts";

describe("assistantPanelDockRuntime", () => {
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
    resetAssistantPanelVisibilityForTests();
  });

  afterEach(() => {
    resetAssistantPanelVisibilityForTests();
  });

  it("Test 1 — collapse suggestions leaves only suggestions hidden", () => {
    assert.deepEqual(getAssistantPanelVisibility(), DEFAULT_ASSISTANT_PANEL_VISIBILITY);
    collapseAssistantPanel("suggestions");
    assert.equal(getAssistantPanelVisibility().suggestions, false);
    assert.equal(getAssistantPanelVisibility().guidance, true);
    assert.equal(getAssistantPanelVisibility().scenario, true);
    assert.equal(getAssistantPanelVisibility().decision, true);
    assert.equal(getAssistantPanelVisibility().actions, true);
  });

  it("Test 2 — expand suggestions restores panel", () => {
    collapseAssistantPanel("suggestions");
    expandAssistantPanel("suggestions");
    assert.equal(getAssistantPanelVisibility().suggestions, true);
  });

  it("Test 3 — collapse scenario does not affect other panels", () => {
    collapseAssistantPanel("scenario");
    assert.equal(getAssistantPanelVisibility().scenario, false);
    assert.equal(getAssistantPanelVisibility().suggestions, true);
    assert.equal(getAssistantPanelVisibility().decision, true);
  });

  it("Test 4 — panel visibility persists in sessionStorage", () => {
    collapseAssistantPanel("guidance");
    const raw = globalThis.sessionStorage?.getItem("nexora:assistant-panel-dock-visibility");
    assert.ok(raw);
    const parsed = JSON.parse(raw!) as { guidance: boolean };
    assert.equal(parsed.guidance, false);
  });

  it("Test 5 — toggle is idempotent per panel", () => {
    assert.equal(toggleAssistantPanelVisible("actions"), false);
    assert.equal(toggleAssistantPanelVisible("actions"), true);
    assert.equal(setAssistantPanelVisible("actions", true), true);
    assert.equal(setAssistantPanelVisible("actions", true), true);
  });

  it("contract resolves dock actions and icons", () => {
    assert.equal(resolveAssistantPanelDockAction(true), "collapse");
    assert.equal(resolveAssistantPanelDockAction(false), "expand");
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.suggestions.icon, "💡");
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.scenario.icon, "📊");
    assert.match(resolveAssistantPanelExpandTooltip("suggestions"), /Suggested Questions/);
  });
});
