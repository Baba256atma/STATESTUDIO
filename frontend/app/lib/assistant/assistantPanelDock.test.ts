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

  it("Test 1 — fresh assistant open has no support panel expanded", () => {
    assert.deepEqual(getAssistantSupportAccordionState(), { openPanelId: null });
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

  it("Test 2 — opening scenario collapses insight", () => {
    openAssistantSupportAccordionPanel("insight");
    openAssistantSupportAccordionPanel("scenario");
    assert.equal(isAssistantPanelVisible("scenario"), true);
    assert.equal(isAssistantPanelVisible("insight"), false);
  });

  it("Test 3 — opening analytics collapses scenario", () => {
    openAssistantSupportAccordionPanel("scenario");
    openAssistantSupportAccordionPanel("analytics");
    assert.equal(isAssistantPanelVisible("analytics"), true);
    assert.equal(isAssistantPanelVisible("scenario"), false);
  });

  it("Test 4 — collapsing the current panel leaves all panels collapsed", () => {
    openAssistantSupportAccordionPanel("analytics");
    collapseAssistantPanel("analytics");
    assert.equal(getAssistantSupportAccordionState().openPanelId, null);
    assert.deepEqual(getAssistantPanelVisibility(), {
      insight: false,
      scenario: false,
      analytics: false,
      governance: false,
      actions: false,
      questions: false,
    });
  });

  it("Test 5 — icon dock restore opens requested panel and collapses all others", () => {
    collapseAllAssistantSupportAccordionPanels();
    expandAssistantPanel("governance");
    assert.equal(isAssistantPanelVisible("governance"), true);
    assert.equal(isAssistantPanelVisible("insight"), false);
    assert.equal(isAssistantPanelVisible("scenario"), false);
    assert.equal(isAssistantPanelVisible("analytics"), false);
    assert.equal(isAssistantPanelVisible("actions"), false);
    assert.equal(isAssistantPanelVisible("questions"), false);
  });

  it("Test 6 — opening questions collapses other panels", () => {
    openAssistantSupportAccordionPanel("insight");
    openAssistantSupportAccordionPanel("questions");
    assert.equal(isAssistantPanelVisible("questions"), true);
    assert.equal(isAssistantPanelVisible("insight"), false);
  });

  it("contract resolves questions dock icon and label", () => {
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.questions.icon, "❓");
    assert.match(resolveAssistantPanelExpandTooltip("questions"), /Executive Questions/);
  });

  it("compatibility setters cannot create conflicting booleans", () => {
    setAssistantPanelVisible("insight", true);
    setAssistantPanelVisible("actions", true);
    assert.deepEqual(getAssistantPanelVisibility(), {
      insight: false,
      scenario: false,
      analytics: false,
      governance: false,
      actions: true,
      questions: false,
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
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.insight.icon, "💡");
    assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.scenario.icon, "📘");
    assert.match(resolveAssistantPanelExpandTooltip("insight"), /Insight/);
  });
});
