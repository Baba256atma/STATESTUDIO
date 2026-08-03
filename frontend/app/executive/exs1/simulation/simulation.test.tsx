/**
 * Phase D — Executive Scenario Simulation Engine coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import { createInitialMetadataCatalog } from "../metadata/index.ts";
import { createExecutiveRuntimeStore } from "../runtime/ExecutiveRuntimeStore.ts";
import { processRuntimeEventForIntelligence } from "../intelligence/index.ts";
import {
  createSimulationRunner,
  runScenarioSimulation,
  buildSimulationContext,
} from "./index.ts";
import { ExecutiveSimulationExplorer } from "./ExecutiveSimulationExplorer.tsx";
import { ExecutiveSimulationProvider } from "./ExecutiveSimulationProvider.tsx";
import { ExecutiveMetadataProvider } from "../metadata/ExecutiveMetadataProvider.tsx";
import { ExecutiveRuntimeProvider } from "../runtime/ExecutiveRuntimeProvider.tsx";
import { ExecutiveDataProvider } from "../data/ExecutiveDataProvider.tsx";
import { ExecutiveConnectorProvider } from "../connectors/ExecutiveConnectorProvider.tsx";

describe("Phase D Executive Scenario Simulation", () => {
  it("runs Inventory Shortage → Increase Safety Stock without mutating Runtime", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Scenario" });
    const beforeEvents = store.getState().events.length;
    const beforeSources = store.getState().data.sources.length;
    const catalog = createInitialMetadataCatalog();
    const draft = buildSimulationContext({
      state: store.getState(),
      catalog,
      scenarioLabel: "Inventory Shortage",
      assumptionIds: ["increase-safety-stock"],
    });
    const completed = runScenarioSimulation(draft, catalog);
    assert.equal(completed.status, "Completed");
    const inventory = completed.results!.future.objects.find(
      (o) => o.objectId === "inventory",
    );
    assert.ok(inventory);
    assert.equal(inventory!.current, 820);
    assert.equal(inventory!.future, 960);
    assert.equal(inventory!.delta, 140);
    const cash = completed.results!.future.objects.find(
      (o) => o.objectId === "revenue",
    );
    assert.ok(cash && cash.delta < 0);
    const delivery = completed.results!.future.objects.find(
      (o) => o.objectId === "customer",
    );
    assert.ok(delivery && delivery.delta > 0);
    assert.equal(store.getState().events.length, beforeEvents);
    assert.equal(store.getState().data.sources.length, beforeSources);
  });

  it("emits SimulationCompleted and creates Intelligence signal + Draft decision", () => {
    const store = createExecutiveRuntimeStore({ initialMode: "Scenario" });
    const catalog = createInitialMetadataCatalog();
    const runner = createSimulationRunner();
    const session = runner.createInventoryShortageSession(store, catalog);
    const completed = runner.run(session.sessionId, catalog, store);
    assert.equal(completed.status, "Completed");
    assert.ok(runner.getJournal()[0]?.summary.includes("[Simulation]"));

    const event = store.getState().events.find(
      (e) => e.type === "SimulationCompleted",
    );
    assert.ok(event);

    const intel = processRuntimeEventForIntelligence({
      event: event!,
      previous: null,
      current: store.getState(),
      catalog,
      existing: [],
    });
    assert.ok(intel.created);
    assert.match(intel.created!.summary, /Simulation/i);

    const decisionsBefore = store.getState().decision.decisions.length;
    store.actions.createManualDecision("Sim · Inventory Shortage · Safety Stock");
    const created = store.getState().decision.currentDecisionId!;
    const decision = store.getState().decision.decisions.find(
      (d) => d.id === created,
    );
    assert.equal(decision?.status, "Draft");
    assert.equal(
      store.getState().decision.decisions.length,
      decisionsBefore + 1,
    );
  });

  it("renders Simulations explorer surfaces", () => {
    const html = renderToStaticMarkup(
      <ExecutiveRuntimeProvider showInspector={false}>
        <ExecutiveDataProvider>
          <ExecutiveMetadataProvider>
            <ExecutiveConnectorProvider>
              <ExecutiveSimulationProvider>
                <ExecutiveSimulationExplorer />
              </ExecutiveSimulationProvider>
            </ExecutiveConnectorProvider>
          </ExecutiveMetadataProvider>
        </ExecutiveDataProvider>
      </ExecutiveRuntimeProvider>,
    );
    assert.match(html, /data-testid="executive-simulation-explorer"/);
    assert.match(html, /Executive Simulations/);
    assert.match(html, /data-testid="simulation-create-inventory-shortage"/);
    assert.match(html, /data-testid="simulation-section-sessions"/);
  });

  it("exposes Simulations nav while keeping Runtime object IDs stable", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="executive-nav-simulations"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /data-meta-label="Inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });
});
