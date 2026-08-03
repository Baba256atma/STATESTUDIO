/**
 * Phase B — Executive Runtime Intelligence coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import { createInitialMetadataCatalog } from "../metadata/index.ts";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore.ts";
import {
  ATTENTION_RULES,
  buildExecutiveRecommendationContext,
  filterExecutiveSignals,
  prioritizeExecutiveSignals,
  processRuntimeEventForIntelligence,
  resolveAttention,
} from "./index.ts";
import { ExecutiveIntelligenceExplorer } from "./ExecutiveIntelligenceExplorer.tsx";
import { ExecutiveRuntimeIntelligenceProvider } from "./ExecutiveRuntimeIntelligenceProvider.tsx";
import { ExecutiveMetadataProvider } from "../metadata/ExecutiveMetadataProvider.tsx";
import { ExecutiveRuntimeProvider } from "../runtime/ExecutiveRuntimeProvider.tsx";

describe("Phase B Executive Runtime Intelligence", () => {
  it("maps Runtime events to structured Executive Signals with metadata", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Problem" });
    store.actions.selectObject("inventory");
    const event = store.getState().events.at(-1)!;
    const catalog = createInitialMetadataCatalog();
    const result = processRuntimeEventForIntelligence({
      event,
      previous: null,
      current: store.getState(),
      catalog,
      existing: [],
    });
    assert.ok(result.created);
    assert.equal(result.created!.sourceEvent, "ObjectSelected");
    assert.ok(result.created!.relatedObjectIds.includes("inventory"));
    assert.ok(result.created!.domainNames.length > 0);
    assert.ok(result.created!.suggestedWorkspace);
    assert.ok(result.journal?.summary.includes("[Intelligence]"));
  });

  it("applies configurable attention rules without business math", () => {
    assert.ok(ATTENTION_RULES.length >= 8);
    assert.equal(resolveAttention("TimelineMoved").severity, "Low");
    assert.equal(resolveAttention("ScenarioSelected").severity, "Medium");
    assert.equal(resolveAttention("ExecutionStarted").severity, "High");
  });

  it("builds recommendation context for Advisor (not raw Runtime)", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Monitoring" });
    store.actions.selectObject("inventory");
    const catalog = createInitialMetadataCatalog();
    const event = store.getState().events.at(-1)!;
    const { created, signals } = processRuntimeEventForIntelligence({
      event,
      previous: null,
      current: store.getState(),
      catalog,
      existing: [],
    });
    assert.ok(created);
    const ranked = prioritizeExecutiveSignals(signals, "Monitoring");
    const ctx = buildExecutiveRecommendationContext(
      ranked[0]!,
      store.getState(),
      catalog,
    );
    assert.ok(ctx.why.length > 0);
    assert.ok(ctx.impact.length > 0);
    assert.ok(ctx.nextStep.length > 0);
    assert.equal(ctx.focusObjectLabel, "Inventory");
  });

  it("filters inbox views for warnings and decision-required", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Decision" });
    store.actions.approveDecision(
      store.getState().decision.currentDecisionId ??
        store.getState().decision.decisions[0]!.id,
    );
    const catalog = createInitialMetadataCatalog();
    const event = store.getState().events.at(-1)!;
    const { signals } = processRuntimeEventForIntelligence({
      event,
      previous: null,
      current: store.getState(),
      catalog,
      existing: [],
    });
    const decisionRequired = filterExecutiveSignals(
      signals,
      "Decision Required",
    );
    assert.ok(decisionRequired.length >= 1);
  });

  it("renders Intelligence explorer surfaces", () => {
    const html = renderToStaticMarkup(
      <ExecutiveRuntimeProvider>
        <ExecutiveMetadataProvider>
          <ExecutiveRuntimeIntelligenceProvider>
            <ExecutiveIntelligenceExplorer />
          </ExecutiveRuntimeIntelligenceProvider>
        </ExecutiveMetadataProvider>
      </ExecutiveRuntimeProvider>,
    );
    assert.match(html, /data-testid="executive-intelligence-explorer"/);
    assert.match(html, /data-testid="executive-inbox"/);
    assert.match(html, /data-testid="intelligence-search"/);
    assert.match(html, /data-testid="intelligence-section-signals"/);
  });

  it("exposes Intelligence nav while keeping Runtime object IDs stable", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="executive-nav-intelligence"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /data-meta-label="Inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
