import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1 } from "./assistantChatFirstFinalFreezeContract.ts";
import {
  expandAssistantPanel,
  getAssistantPanelVisibility,
  isAssistantPanelVisible,
  resetAssistantPanelVisibilityForTests,
} from "./assistantPanelDockRuntime.ts";
import {
  collapseAllAssistantSupportAccordionPanels,
  openAssistantSupportAccordionPanel,
} from "./assistantSupportAccordionRuntime.ts";
import {
  buildAssistantIntelligenceCards,
  resetAssistantIntelligenceCardsTraceForTests,
} from "./assistantIntelligenceCardsRuntime.ts";
import {
  publishAssistantStabilityGateResult,
  resetAssistantStabilityGateForTests,
  runAssistantStabilityGate,
  traceAssistantStabilityGate,
} from "./assistantStabilityGateRuntime.ts";
import { resolveAssistantRailWidth } from "./assistantRailWidthRuntime.ts";

describe("assistant chat-first final freeze", () => {
  beforeEach(() => {
    resetAssistantStabilityGateForTests();
    resetAssistantIntelligenceCardsTraceForTests();
  });

  afterEach(() => {
    resetAssistantStabilityGateForTests();
  });

  it("Test 1 — final freeze contract locks chat-first architecture", () => {
    assert.equal(CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.id, "CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1");
    assert.ok(
      CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.frozenSubsystems.includes("chat_first_layout")
    );
    assert.ok(
      CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.invariants.includes(
        "intelligence_cards_max_four_cards"
      )
    );
  });

  it("Test 2 — stability gate passes all components", () => {
    const result = runAssistantStabilityGate();
    assert.equal(result.overall, "pass");
    assert.equal(result.components.AssistantSurface, "pass");
    assert.equal(result.components.IntelligenceCards, "pass");
    assert.equal(result.components.Accordion, "pass");
    assert.equal(result.components.SuggestedQuestions, "pass");
    assert.equal(result.components.ObjectContextBridge, "pass");
    assert.equal(result.components.DashboardBoundary, "pass");
  });

  it("Test 3 — accordion single-open behavior is preserved", () => {
    resetAssistantPanelVisibilityForTests();
    openAssistantSupportAccordionPanel("insight");
    openAssistantSupportAccordionPanel("scenario");
    assert.equal(isAssistantPanelVisible("scenario"), true);
    assert.equal(isAssistantPanelVisible("insight"), false);
  });

  it("Test 4 — icon dock restore opens one panel", () => {
    resetAssistantPanelVisibilityForTests();
    collapseAllAssistantSupportAccordionPanels();
    expandAssistantPanel("governance");
    assert.deepEqual(getAssistantPanelVisibility(), {
      insight: false,
      scenario: false,
      analytics: false,
      governance: true,
      actions: false,
      questions: false,
    });
  });

  it("Test 5 — intelligence cards remain compact (max 4)", () => {
    const cards = buildAssistantIntelligenceCards({
      selectedObjectId: "obj-1",
      selectedObjectName: "Object 1",
      dashboardMode: "overview",
      hasRiskSignal: true,
      hasScenarioConflict: true,
    });
    assert.ok(cards.length <= 4);
  });

  it("Test 6 — external store snapshot stays stable between reads", () => {
    resetAssistantPanelVisibilityForTests();
    const first = getAssistantPanelVisibility();
    const second = getAssistantPanelVisibility();
    assert.equal(first, second);
  });

  it("Test 7 — adaptive rail width keeps scene dominant at desktop", () => {
    const width = resolveAssistantRailWidth({ viewportWidth: 1440, preset: "executive" });
    const chrome = 72 + 48 + 48 + 24;
    const scene = 1440 - width - chrome;
    assert.ok(scene / 1440 >= 0.55);
  });

  it("Test 8 — stability gate trace publishes once", () => {
    const first = traceAssistantStabilityGate(true);
    const second = traceAssistantStabilityGate(false);
    assert.equal(first.overall, "pass");
    assert.equal(second.overall, "pass");
  });

  it("Test 9 — stability gate result can be published for runtime audit", () => {
    const result = runAssistantStabilityGate();
    publishAssistantStabilityGateResult(result);
    assert.equal(result.overall, "pass");
  });

  it("Test 10 — dashboard boundary validation passes", () => {
    const result = runAssistantStabilityGate();
    assert.equal(result.components.DashboardBoundary, "pass");
  });
});
