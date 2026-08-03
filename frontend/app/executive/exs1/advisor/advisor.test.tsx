/**
 * Sprint 5 — Executive Advisor AI Integration coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore.ts";
import { buildExecutiveAdvisorContext } from "./ExecutiveAdvisorContextBuilder.ts";
import { runExecutiveAdvisorEngine } from "./ExecutiveAdvisorEngine.ts";
import { selectPromptTemplate } from "./ExecutiveAdvisorPromptTemplates.ts";
import {
  createInitialAdvisorSession,
  markProposalStatus,
} from "./ExecutiveAdvisorSession.ts";

describe("Sprint 5 Executive Advisor", () => {
  it("builds immutable context from Runtime state", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Decision" });
    store.actions.selectObject("inventory");
    const context = buildExecutiveAdvisorContext(store.getState());
    assert.equal(context.mode, "Decision");
    assert.equal(context.selectedObjectId, "inventory");
    assert.equal(context.packTitle, "Production Delay");
    assert.ok(Object.isFrozen(context));
  });

  it("selects conversation mode from Runtime mode", () => {
    assert.equal(
      selectPromptTemplate("Scenario", false).conversationMode,
      "Review",
    );
    assert.equal(
      selectPromptTemplate("Decision", false).conversationMode,
      "Prepare Decision",
    );
    assert.equal(
      selectPromptTemplate("Execution", false).conversationMode,
      "Guide",
    );
    assert.equal(
      selectPromptTemplate("Monitoring", false).conversationMode,
      "Summarize",
    );
    assert.equal(
      selectPromptTemplate("Problem", true).id,
      "data-review",
    );
  });

  it("generates proposals that stay pending until approval helpers mark them", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Decision" });
    const context = buildExecutiveAdvisorContext(store.getState());
    const result = runExecutiveAdvisorEngine(context);
    assert.ok(result.proposals.some((p) => p.kind === "Approve Decision"));
    assert.ok(result.proposals.every((p) => p.status === "pending"));
    assert.match(result.assistGuidance, /approval/i);

    let session = createInitialAdvisorSession(context.packTitle);
    session = {
      ...session,
      pendingProposals: [...result.proposals],
    };
    const target = session.pendingProposals[0]!;
    session = markProposalStatus(session, target.id, "accepted");
    assert.equal(
      session.pendingProposals.find((p) => p.id === target.id)?.status,
      "accepted",
    );
  });

  it("does not auto-mutate Runtime when engine generates proposals", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Execution" });
    const before = store.getState().execution.started;
    runExecutiveAdvisorEngine(buildExecutiveAdvisorContext(store.getState()));
    assert.equal(store.getState().execution.started, before);
    assert.equal(store.getState().execution.plan.status, "Idle");
  });

  it("renders Advisor proposals inside the cockpit Assist panel", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="executive-advisor-panel"/);
    assert.match(html, /data-testid="executive-advisor-conversation-mode"/);
    assert.match(html, /data-testid="executive-advisor-suggestion-cards"/);
    assert.match(html, /data-testid="executive-advisor-proposals"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
