/**
 * Sprint 4 — Executive Runtime Integration coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import {
  createExecutiveRuntimeStore,
  createInitialRuntimeState,
} from "./ExecutiveRuntimeStore.ts";
import { ExecutiveRuntimeProvider } from "./ExecutiveRuntimeProvider.tsx";
import { selectRuntimeInspectorSnapshot } from "./ExecutiveRuntimeSelectors.ts";

describe("Sprint 4 Executive Runtime Store", () => {
  it("owns mode, pack, timeline, selection, and experience slices", () => {
    const state = createInitialRuntimeState({ initialMode: "Problem" });
    assert.equal(state.mode.activeMode, "Problem");
    assert.equal(state.pack.selectedPackId, "production-delay");
    assert.equal(state.timeline.lens, "week");
    assert.equal(state.selection.selection.kind, "welcome");
    assert.equal(state.scenario.currentScenarioId, "scenario-a");
    assert.equal(state.decision.currentDecisionId, "decision-a");
    assert.equal(state.data.selectedSourceId, "source-sales-csv");
    assert.equal(state.data.experienceActive, false);
  });

  it("publishes Runtime events for mode, pack, and timeline", () => {
    const store = createExecutiveRuntimeStore();
    store.actions.setActiveMode("Decision");
    store.actions.selectPack("production-delay", { timelineLens: "month" });
    store.actions.selectLens("year");
    store.actions.setTimelinePosition(70);
    const types = store.getEventLog().map((e) => e.type);
    assert.ok(types.includes("ModeChanged"));
    assert.ok(types.includes("PackSelected"));
    assert.ok(types.includes("TimelineMoved"));
    assert.equal(store.getState().timeline.position, 70);
    assert.equal(store.getState().timeline.lens, "year");
  });

  it("keeps Decision Pack selection from moving timeline lens", () => {
    const store = createExecutiveRuntimeStore();
    store.actions.selectLens("week");
    store.actions.approveDecision("decision-a");
    const packId = store.getState().decision.decisionPacks[0]?.id;
    assert.ok(packId);
    store.actions.selectPack(packId!);
    assert.equal(store.getState().timeline.lens, "week");
    assert.ok(
      store.getEventLog().some((e) => e.type === "DecisionApproved"),
    );
  });

  it("drives data experience from explorer nav", () => {
    const store = createExecutiveRuntimeStore();
    store.actions.setNav("Data");
    assert.equal(store.getState().data.experienceActive, true);
    assert.equal(store.getState().explorer.nav, "Data");
    store.actions.closeExplorer();
    assert.equal(store.getState().data.experienceActive, false);
    assert.equal(store.getState().explorer.nav, "Home");
  });

  it("exposes inspector snapshot selectors", () => {
    const store = createExecutiveRuntimeStore();
    const snap = selectRuntimeInspectorSnapshot(store.getState());
    assert.equal(snap.mode, "Problem");
    assert.equal(snap.pack, "production-delay");
  });

  it("renders Runtime Inspector toggle in development cockpit", () => {
    const html = renderToStaticMarkup(
      <ExecutiveRuntimeProvider showInspector>
        <div data-testid="runtime-child">ok</div>
      </ExecutiveRuntimeProvider>,
    );
    assert.match(html, /data-testid="executive-runtime-devtools"/);
    assert.match(html, /data-testid="runtime-inspector-toggle"/);
    assert.match(html, /data-testid="runtime-child"/);
  });

  it("keeps /executive cockpit Runtime-driven without UI regression anchors", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-data-active="false"/);
    assert.match(html, /data-monitoring-active="false"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
