import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

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
  isAssistantPanelVisible,
  resetAssistantPanelVisibilityForTests,
  setAssistantPanelVisible,
  toggleAssistantPanelVisible,
} from "./assistantPanelDockRuntime.ts";
import {
  collapseAllAssistantSupportAccordionPanels,
  getAssistantSupportAccordionState,
  openAssistantSupportAccordionPanel,
} from "./assistantSupportAccordionRuntime.ts";

describe("assistant support accordion runtime", () => {
  beforeEach(() => {
    resetAssistantPanelVisibilityForTests();
  });

  it("Test 1 — fresh assistant open expands suggested questions only", () => {
    assert.deepEqual(getAssistantSupportAccordionState(), { openPanelId: "suggestions" });
    assert.deepEqual(getAssistantPanelVisibility(), DEFAULT_ASSISTANT_PANEL_VISIBILITY);
  });

  it("getSnapshot compatibility visibility returns a stable reference between updates", () => {
    const firstSnapshot = getAssistantPanelVisibility();
    const secondSnapshot = getAssistantPanelVisibility();
    assert.equal(firstSnapshot, secondSnapshot);

    openAssistantSupportAccordionPanel("scenario");
    const scenarioSnapshot = getAssistantPanelVisibility();
    assert.notEqual(scenarioSnapshot, firstSnapshot);
    assert.equal(getAssistantPanelVisibility(), scenarioSnapshot);
  });

  it("Test 2 — opening scenario collapses suggested questions", () => {
    openAssistantSupportAccordionPanel("scenario");
    assert.equal(isAssistantPanelVisible("scenario"), true);
    assert.equal(isAssistantPanelVisible("suggestions"), false);
  });

  it("Test 3 — opening decision collapses scenario", () => {
    openAssistantSupportAccordionPanel("scenario");
    openAssistantSupportAccordionPanel("decision");
    assert.equal(isAssistantPanelVisible("decision"), true);
    assert.equal(isAssistantPanelVisible("scenario"), false);
  });

  it("Test 4 — collapsing the current panel leaves all panels collapsed", () => {
    openAssistantSupportAccordionPanel("decision");
    collapseAssistantPanel("decision");
    assert.equal(getAssistantSupportAccordionState().openPanelId, null);
    assert.deepEqual(getAssistantPanelVisibility(), {
      suggestions: false,
      guidance: false,
      scenario: false,
      decision: false,
      actions: false,
    });
  });

  it("Test 5 — icon dock restore opens requested panel and collapses all others", () => {
    collapseAllAssistantSupportAccordionPanels();
    expandAssistantPanel("suggestions");
    assert.equal(isAssistantPanelVisible("suggestions"), true);
    assert.equal(isAssistantPanelVisible("guidance"), false);
    assert.equal(isAssistantPanelVisible("scenario"), false);
    assert.equal(isAssistantPanelVisible("decision"), false);
    assert.equal(isAssistantPanelVisible("actions"), false);
  });

  it("compatibility setters cannot create conflicting booleans", () => {
    setAssistantPanelVisible("guidance", true);
    setAssistantPanelVisible("actions", true);
    assert.deepEqual(getAssistantPanelVisibility(), {
      suggestions: false,
      guidance: false,
      scenario: false,
      decision: false,
      actions: true,
    });
  });

  it("toggle opens a closed panel and collapses an open panel", () => {
    assert.equal(toggleAssistantPanelVisible("scenario"), true);
    assert.equal(getAssistantSupportAccordionState().openPanelId, "scenario");
    assert.equal(toggleAssistantPanelVisible("scenario"), false);
    assert.equal(getAssistantSupportAccordionState().openPanelId, null);
  });

  it("contract resolves dock actions and icons", () => {
    assert.equal(resolveAssistantPanelDockAction(true), "collapse");
    assert.equal(resolveAssistantPanelDockAction(false), "expand");
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.suggestions.icon, "💡");
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.scenario.icon, "📊");
    assert.match(resolveAssistantPanelExpandTooltip("suggestions"), /Suggested Questions/);
  });
});
