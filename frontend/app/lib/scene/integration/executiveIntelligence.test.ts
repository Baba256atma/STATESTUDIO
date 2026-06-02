import test from "node:test";
import assert from "node:assert/strict";

import { buildExecutiveWarRoomState } from "../warroom/executiveWarRoomRuntime.ts";
import { buildExecutiveCognitiveTwinState } from "../twin/executiveCognitiveTwinRuntime.ts";
import {
  buildExecutiveIntelligenceInputSignature,
  buildExecutiveIntelligenceRefreshSignature,
  buildExecutiveIntelligenceState,
  refreshExecutiveIntelligenceCascade,
  resetExecutiveIntelligenceRuntimeCacheForTests,
} from "./executiveIntelligenceRuntime.ts";
import {
  refreshExecutiveIntelligence,
  resetExecutiveIntelligenceForTests,
  getExecutiveIntelligenceState,
} from "./executiveIntelligenceStore.ts";
import { resetExecutiveWarRoomForTests } from "../warroom/executiveWarRoomStore.ts";
import { resetExecutiveCognitiveTwinForTests } from "../twin/executiveCognitiveTwinStore.ts";
import { resetExecutiveAdvisorForTests } from "../advisor/executiveAdvisorStore.ts";
import { validateExecutiveIntelligence } from "./executiveIntelligenceValidation.ts";
import { summarizeExecutiveRuntimeHealth } from "./executiveIntelligenceHealthMonitor.ts";
import { buildExecutiveRuntimeRegistry } from "./executiveIntelligenceRegistry.ts";

const sceneJson = {
  objects: [
    { id: "supplier_a", name: "Supplier A", label: "Supplier A" },
    { id: "inventory_b", name: "Inventory B", label: "Inventory B" },
    { id: "customer_c", name: "Customer C", label: "Customer C" },
  ],
  relationships: [{ id: "rel_1", sourceId: "supplier_a", targetId: "inventory_b", type: "supply" }],
};

test("refreshExecutiveIntelligenceCascade coordinates twin, war room, and advisor", () => {
  resetExecutiveIntelligenceForTests();
  resetExecutiveWarRoomForTests();
  resetExecutiveCognitiveTwinForTests();
  resetExecutiveAdvisorForTests();

  refreshExecutiveIntelligenceCascade({
    sceneJson,
    selectedObjectId: "supplier_a",
    domainLabel: "Supply Chain",
    activeSimulation: {
      scenarioId: "scenario_delay",
      affectedObjectIds: ["supplier_a", "inventory_b"],
      propagationPaths: [{ from: "supplier_a", to: "inventory_b", intensity: 0.82 }],
      riskLevel: "high",
      summary: "Supplier delay propagates through inventory.",
    },
    executiveTimelineHud: {
      focusedEventId: "evt_1",
      events: [
        {
          id: "evt_1",
          title: "Supplier delay signal",
          summary: "Delay risk emerging upstream",
          status: "active",
          severity: "warning",
          markerType: "risk",
          relatedObjectIds: ["supplier_a"],
        },
      ],
    },
    alerts: [
      {
        id: "alert_1",
        level: "critical",
        message: "Supplier instability",
        relatedObjectIds: ["supplier_a"],
        timestamp: Date.now(),
        acknowledged: false,
      },
    ],
    cameraPreset: "balanced",
  });

  const state = buildExecutiveIntelligenceState({
    sceneJson,
    selectedObjectId: "supplier_a",
    domainLabel: "Supply Chain",
    cameraPreset: "balanced",
    executiveTimelineHud: {
      focusedEventId: "evt_1",
      events: [
        {
          id: "evt_1",
          title: "Supplier delay signal",
          summary: "Delay risk emerging upstream",
          status: "active",
          severity: "warning",
          markerType: "risk",
          relatedObjectIds: ["supplier_a"],
        },
      ],
    },
  });

  assert.equal(state.active, true);
  assert.ok(state.registry.length >= 9);
  assert.ok(state.validations.length >= 20);
  assert.ok(state.scorecard.executiveReadinessScore > 0);
  assert.ok(state.demoFlow.walkthroughSteps.length === 5);
  assert.ok(state.checklists.length === 3);
});

test("executiveIntelligenceStore dedupes refresh by signature", () => {
  resetExecutiveIntelligenceForTests();
  resetExecutiveWarRoomForTests();
  resetExecutiveCognitiveTwinForTests();
  resetExecutiveAdvisorForTests();

  const input = {
    sceneJson,
    selectedObjectId: "supplier_a",
    domainLabel: "Supply Chain",
    cameraPreset: "balanced",
  };
  const first = refreshExecutiveIntelligence(input);
  const second = refreshExecutiveIntelligence(input);
  assert.equal(first?.signature, second?.signature);
  assert.equal(buildExecutiveIntelligenceInputSignature(input), first?.signature);
});

test("refreshExecutiveIntelligence ignores empty bootstrap signatures", () => {
  resetExecutiveIntelligenceForTests();
  resetExecutiveWarRoomForTests();
  resetExecutiveCognitiveTwinForTests();
  resetExecutiveAdvisorForTests();

  const emptyScene = { objects: [] };
  const first = refreshExecutiveIntelligence({
    sceneJson: emptyScene,
    sceneObjectCount: 0,
    cameraPreset: "balanced",
  });
  assert.equal(first, null);
  assert.equal(getExecutiveIntelligenceState(), null);

  const hydrated = refreshExecutiveIntelligence({
    sceneJson,
    selectedObjectId: "supplier_a",
    domainLabel: "Supply Chain",
    cameraPreset: "balanced",
  });
  assert.ok(hydrated?.active);
});

test("buildExecutiveIntelligenceState returns cached reference for unchanged input signature", () => {
  resetExecutiveIntelligenceForTests();
  resetExecutiveWarRoomForTests();
  resetExecutiveCognitiveTwinForTests();
  resetExecutiveAdvisorForTests();
  resetExecutiveIntelligenceRuntimeCacheForTests();

  const input = {
    sceneJson,
    selectedObjectId: "supplier_a",
    domainLabel: "Supply Chain",
    cameraPreset: "balanced",
  };
  refreshExecutiveIntelligenceCascade(input);
  const first = buildExecutiveIntelligenceState(input);
  const second = buildExecutiveIntelligenceState(input);
  assert.equal(first, second);
});

test("runtime registry and validation scorecard reflect module health", () => {
  const twin = buildExecutiveCognitiveTwinState({
    sceneObjectIds: ["supplier_a", "inventory_b", "customer_c"],
    sceneObjectMeta: [
      { id: "supplier_a", label: "Supplier A" },
      { id: "inventory_b", label: "Inventory B" },
      { id: "customer_c", label: "Customer C" },
    ],
    relationships: [{ id: "rel_1", sourceId: "supplier_a", targetId: "inventory_b" }],
  });
  const warRoom = buildExecutiveWarRoomState({
    selectedObjectId: "supplier_a",
    cognitiveTwin: twin,
    alerts: [
      {
        id: "alert_1",
        level: "critical",
        message: "Supplier instability",
        relatedObjectIds: ["supplier_a"],
        timestamp: Date.now(),
        acknowledged: false,
      },
    ],
  });
  const registry = buildExecutiveRuntimeRegistry({
    sceneObjectCount: 3,
    cameraPreset: "balanced",
    timelineEventCount: 1,
    playback: null,
    universe: null,
    simulation: null,
    warRoom,
    cognitiveTwin: twin,
    advisor: null,
  });
  const health = summarizeExecutiveRuntimeHealth(registry);
  const validations = validateExecutiveIntelligence({
    input: { sceneJson, sceneObjectCount: 3, cameraPreset: "balanced" },
    warRoom,
    cognitiveTwin: twin,
    advisor: null,
    playback: null,
    universe: null,
    health,
  });
  assert.ok(registry.some((entry) => entry.moduleId === "war_room" && entry.health === "active"));
  assert.ok(validations.some((entry) => entry.validationId === "war_room_operational" && entry.passed));
});
