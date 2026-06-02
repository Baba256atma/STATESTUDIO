import { describe, expect, it } from "vitest";

import { EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS } from "../executiveTimelineHudTypes";
import {
  buildExecutiveScenarioPlaybackSequence,
  buildScenarioCompletionSummary,
  resolvePlaybackStepDuration,
} from "./executiveScenarioPlaybackRuntime";
import {
  resolveScenarioPlaybackObjectSelection,
  resolveScenarioPropagationView,
} from "./executiveScenarioPropagationRuntime";
import {
  loadExecutiveScenarioPlaybackSequence,
  nextExecutiveScenarioPlaybackStep,
  playExecutiveScenarioPlayback,
  resetExecutiveScenarioPlaybackForTests,
  restartExecutiveScenarioPlayback,
} from "./executiveScenarioPlaybackStore";

describe("executiveScenarioPlaybackRuntime", () => {
  it("builds multi-hop steps from Type-C simulation paths", () => {
    const sequence = buildExecutiveScenarioPlaybackSequence({
      scenarioId: "scenario_a",
      scenarioName: "Supplier Delay Scenario",
      simulation: {
        scenarioId: "scenario_a",
        affectedObjectIds: ["supplier_a", "inventory_b", "customer_c"],
        propagationPaths: [
          { from: "supplier_a", to: "inventory_b", intensity: 0.82 },
          { from: "inventory_b", to: "customer_c", intensity: 0.74 },
        ],
        riskLevel: "high",
        summary: "Supplier delay propagates through inventory to customer impact.",
      },
      sceneObjectLabels: {
        supplier_a: "Supplier A",
        inventory_b: "Inventory B",
        customer_c: "Customer C",
      },
    });

    expect(sequence).not.toBeNull();
    expect(sequence!.steps.length).toBeGreaterThanOrEqual(3);
    expect(sequence!.steps.some((step) => step.propagationHops?.length)).toBe(true);
  });

  it("merges timeline events into playback sequence", () => {
    const sequence = buildExecutiveScenarioPlaybackSequence({
      timelineEvents: EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS.map((event) => ({
        id: event.id,
        title: event.title,
        summary: event.summary,
        severity: event.severity,
        markerType: event.markerType,
      })),
    });

    expect(sequence?.steps.length).toBe(EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS.length);
  });
});

describe("executiveScenarioPlaybackStore", () => {
  it("advances playback steps and resolves propagation view", () => {
    resetExecutiveScenarioPlaybackForTests();
    const sequence = buildExecutiveScenarioPlaybackSequence({
      simulation: {
        scenarioId: "scenario_a",
        affectedObjectIds: ["supplier_a", "inventory_b"],
        propagationPaths: [{ from: "supplier_a", to: "inventory_b", intensity: 0.8 }],
        riskLevel: "medium",
        summary: "Inventory pressure rises.",
      },
    });
    loadExecutiveScenarioPlaybackSequence(sequence);
    playExecutiveScenarioPlayback();
    nextExecutiveScenarioPlaybackStep();

    const state = restartExecutiveScenarioPlayback();
    expect(state.currentStepIndex).toBe(0);
    nextExecutiveScenarioPlaybackStep();
    const withHop = nextExecutiveScenarioPlaybackStep();
    expect(withHop.propagationView?.propagationEdges.length).toBeGreaterThan(0);

    const selection = resolveScenarioPlaybackObjectSelection(withHop.propagationView);
    expect(selection?.highlighted_objects?.length).toBeGreaterThan(0);
  });

  it("builds completion summary at end of sequence", () => {
    const sequence = buildExecutiveScenarioPlaybackSequence({
      timelineEvents: EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS.map((event) => ({
        id: event.id,
        title: event.title,
      })),
    });
    expect(sequence).not.toBeNull();
    const summary = buildScenarioCompletionSummary(sequence!);
    expect(summary.affectedObjectIds.length).toBeGreaterThanOrEqual(0);
    expect(summary.confidenceScore).toBeGreaterThan(0);
  });
});

describe("executiveScenarioPropagationRuntime", () => {
  it("accumulates multi-hop propagation edges across steps", () => {
    const sequence = buildExecutiveScenarioPlaybackSequence({
      simulation: {
        scenarioId: "scenario_chain",
        affectedObjectIds: ["a", "b", "c", "d"],
        propagationPaths: [
          { from: "a", to: "b", intensity: 0.7 },
          { from: "b", to: "c", intensity: 0.68 },
          { from: "c", to: "d", intensity: 0.66 },
        ],
        riskLevel: "high",
        summary: "Chain reaction",
      },
    });
    expect(sequence).not.toBeNull();
    const lateView = resolveScenarioPropagationView({
      sequence: sequence!,
      stepIndex: sequence!.steps.length - 1,
    });
    expect(lateView.propagationEdges.length).toBeGreaterThanOrEqual(3);
  });

  it("uses distinct playback speeds", () => {
    expect(resolvePlaybackStepDuration("slow")).toBeGreaterThan(resolvePlaybackStepDuration("fast"));
  });
});
