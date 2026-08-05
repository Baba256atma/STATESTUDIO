/**
 * Sprint 6 — Executive Advisor Conversation Experience coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore.ts";
import { buildExecutiveAdvisorContext } from "../advisor/ExecutiveAdvisorContextBuilder.ts";
import { runExecutiveAdvisorEngine } from "../advisor/ExecutiveAdvisorEngine.ts";
import {
  buildConversationTurn,
  buildSuggestedQuestions,
  buildWelcomeCopy,
  createEmptyConversationSession,
  filterConversationMessages,
  type ConversationRuntimeFacts,
} from "./index.ts";

const facts: ConversationRuntimeFacts = {
  modelName: "Manufacturing",
  warningSignalCount: 2,
  criticalSignalCount: 0,
  pendingDecision: true,
  decisionName: "Increase Safety Stock",
  simulationCompleted: true,
  simulationSummary: "Inventory Shortage completed",
  monitoringHealth: "Watch",
  alertTitles: ["Lead-time variance"],
};

describe("Sprint 6 Executive Conversation Experience", () => {
  it("builds a dynamic Runtime-aware welcome summary", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Problem" });
    const context = buildExecutiveAdvisorContext(store.getState());
    const welcome = buildWelcomeCopy(context, facts);
    assert.match(welcome, /executive cockpit is ready/i);
    assert.match(welcome, /Two signals require attention/i);
    assert.match(welcome, /How would you like to begin/);
  });

  it("shares conversation turn grounding for Advisor and Insight perspectives", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Decision" });
    const context = buildExecutiveAdvisorContext(store.getState());
    const engine = runExecutiveAdvisorEngine(context);

    const advisorTurn = buildConversationTurn(
      "Why was this decision recommended?",
      "Assist",
      context,
      engine,
      facts,
    );
    const insightTurn = buildConversationTurn(
      "Why was this decision recommended?",
      "Insight",
      context,
      engine,
      facts,
    );

    assert.match(advisorTurn.text, /Advisor guidance/i);
    assert.match(insightTurn.text, /Insight analysis/i);
    assert.ok(advisorTurn.proposals.length > 0);
    assert.equal(insightTurn.proposals.length, 0);
    assert.ok(insightTurn.insight?.kpiCards?.length);
    assert.ok(advisorTurn.references.length > 0);
  });

  it("filters conversation messages by search query without mutating session", () => {
    const session = createEmptyConversationSession({
      packTitle: "Production Delay",
      mode: "Problem",
      goal: "Resolve delay",
    });
    const messages = [
      {
        id: "1",
        role: "user" as const,
        text: "Explain inventory risk",
        at: 1,
      },
      {
        id: "2",
        role: "advisor" as const,
        text: "Supplier lead time is the driver",
        at: 2,
      },
    ];
    const filtered = filterConversationMessages(messages, "supplier");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.id, "2");
    assert.equal(session.messages.length, 0);
  });

  it("generates Runtime-grounded suggested questions", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Problem" });
    const context = buildExecutiveAdvisorContext(store.getState());
    const suggestions = buildSuggestedQuestions(context, facts);
    assert.ok(suggestions.some((s) => /risks/i.test(s)));
    assert.ok(suggestions.some((s) => /recommend|step|scenario/i.test(s)));
    assert.ok(suggestions.length <= 6);
  });

  it("renders shared conversation chrome inside the cockpit Advisor panel", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /data-testid="executive-conversation-view"/);
    assert.match(html, /data-testid="executive-conversation-layout"/);
    assert.match(html, /data-testid="executive-conversation-welcome"/);
    assert.match(html, /data-testid="executive-conversation-input"/);
    assert.match(html, /data-testid="executive-advisor-suggestion-cards"/);
    assert.match(html, /data-testid="executive-action-inbox-button"/);
    assert.match(html, /data-testid="executive-advisor-context-button"/);
    assert.match(html, /data-testid="executive-advisor-more-button"/);
    assert.match(html, /data-testid="executive-advisor-guidance"/);
    assert.match(html, /data-testid="executive-advisor-collapse"/);
    assert.match(html, /data-testid="executive-advisor-footer"/);
    assert.doesNotMatch(html, /Search conversation/);
    assert.doesNotMatch(html, /Context Ready/);
    assert.doesNotMatch(html, /Advisor lens/);
    assert.doesNotMatch(html, /data-testid="executive-advisor-proposals"/);
    assert.match(html, /Ask Nexora/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
