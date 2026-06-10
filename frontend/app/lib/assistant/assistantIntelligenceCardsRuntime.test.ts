import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ASSISTANT_INTELLIGENCE_CARD_LIMIT,
} from "./assistantIntelligenceCardsContract.ts";
import {
  buildAssistantIntelligenceCards,
  resetAssistantIntelligenceCardsTraceForTests,
  traceAssistantIntelligenceCards,
} from "./assistantIntelligenceCardsRuntime.ts";

describe("assistant intelligence cards runtime", () => {
  it("returns default executive overview cards when no object is selected", () => {
    const cards = buildAssistantIntelligenceCards({
      dashboardMode: "overview",
      assistantContextSummary: "Portfolio margin and delivery signals are available.",
    });

    assert.equal(cards.length, ASSISTANT_INTELLIGENCE_CARD_LIMIT);
    assert.equal(cards.some((card) => card.id === "executive_insight"), true);
    assert.equal(cards.some((card) => card.id === "recommendation"), true);
    assert.equal(cards[0]?.id, "executive_insight");
  });

  it("makes cards object-aware when an object is selected", () => {
    const cards = buildAssistantIntelligenceCards({
      selectedObjectId: "supplier-7",
      selectedObjectName: "Supplier 7",
      selectedObjectType: "Supplier",
      dashboardMode: "focus",
    });

    assert.equal(cards.length, ASSISTANT_INTELLIGENCE_CARD_LIMIT);
    assert.match(cards.map((card) => card.summary).join(" "), /Supplier 7/);
    assert.equal(cards.find((card) => card.id === "recommendation")?.action.id, "analyze");
  });

  it("prioritizes risk when the selected object has an elevated signal", () => {
    const cards = buildAssistantIntelligenceCards({
      selectedObjectId: "supplier-9",
      selectedObjectName: "Supplier 9",
      hasRiskSignal: true,
      objectImpact: "high",
    });

    assert.equal(cards[0]?.id, "risk_signal");
    assert.equal(cards[0]?.badge, "High");
    assert.equal(cards[0]?.action.id, "simulate");
  });

  it("reflects active scenario context", () => {
    const cards = buildAssistantIntelligenceCards({
      activeScenarioId: "scenario-a",
      activeScenarioName: "Freight Shock",
      hasScenarioConflict: true,
    });
    const scenarioCard = cards.find((card) => card.id === "scenario");

    assert.ok(scenarioCard);
    assert.match(scenarioCard?.summary ?? "", /Freight Shock/);
    assert.equal(scenarioCard?.action.id, "simulate");
  });

  it("deduplicates runtime traces by signature", () => {
    resetAssistantIntelligenceCardsTraceForTests();
    const cards = buildAssistantIntelligenceCards({
      selectedObjectId: "node-1",
      selectedObjectName: "Node 1",
    });

    traceAssistantIntelligenceCards({ selectedObjectId: "node-1" }, cards);
    traceAssistantIntelligenceCards({ selectedObjectId: "node-1" }, cards);

    assert.equal(cards.length, ASSISTANT_INTELLIGENCE_CARD_LIMIT);
  });
});
