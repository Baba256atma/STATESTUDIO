/**
 * D7:1:3 — Simulation event propagation engine tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  applyAttenuation,
  attenuationFactorForDepth,
  PROPAGATION_MAX_EFFECTIVE_DEPTH,
} from "./simulationPropagationAttenuation.ts";
import {
  buildSimulationObjectGraphFromScene,
  reconstructPropagationPath,
} from "./simulationPropagationGraph.ts";
import type { SimulationEvent } from "./simulationEventTypes.ts";
import {
  propagateSimulationEvent,
  propagateSimulationEvents,
  propagationResultToEvolutionSignals,
  simulationPropagationFingerprint,
} from "./simulationEventPropagationEngine.ts";
import type { SceneJson } from "../sceneTypes.ts";

function sceneFixture(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        { id: "inventory", dependencies: [] },
        { id: "supply", dependencies: ["inventory"] },
        { id: "delivery", dependencies: ["supply"] },
        { id: "customer", dependencies: ["delivery"] },
      ],
      loops: [],
    },
  };
}

function evt(partial: Partial<SimulationEvent> & Pick<SimulationEvent, "id" | "type">): SimulationEvent {
  return { createdAt: "2026-01-01T00:00:00.000Z", ...partial };
}

test("attenuation weakens intensity by depth deterministically", () => {
  assert.equal(attenuationFactorForDepth(1), 0.9);
  assert.equal(attenuationFactorForDepth(2), 0.6);
  assert.equal(attenuationFactorForDepth(3), 0.3);
  assert.equal(attenuationFactorForDepth(4), 0);
  assert.ok(applyAttenuation(1, 1) > applyAttenuation(1, 2));
  assert.ok(applyAttenuation(1, 2) > applyAttenuation(1, 3));
});

test("deterministic propagation order for identical inputs", () => {
  const graph = buildSimulationObjectGraphFromScene(sceneFixture());
  const event = evt({
    id: "e1",
    type: "risk_increase",
    sourceObjectId: "inventory",
    payload: { delta: 0.2 },
  });
  const input = { event, objectGraph: graph, tick: 1 };
  const a = propagateSimulationEvent(input);
  const b = propagateSimulationEvent(input);
  assert.equal(simulationPropagationFingerprint(a), simulationPropagationFingerprint(b));
  assert.deepEqual(
    a.propagationEvents.map((e) => e.id),
    b.propagationEvents.map((e) => e.id)
  );
});

test("cascade reaches downstream nodes with decreasing depth intensity", () => {
  const graph = buildSimulationObjectGraphFromScene(sceneFixture());
  const result = propagateSimulationEvent({
    event: evt({
      id: "overload",
      type: "resource_shift",
      sourceObjectId: "inventory",
      payload: { loadDelta: 0.3 },
    }),
    objectGraph: graph,
    tick: 2,
  });
  assert.ok(result.propagationEvents.length >= 2);
  const supply = result.intensityByObjectId.supply ?? 0;
  const delivery = result.intensityByObjectId.delivery ?? 0;
  assert.ok(supply > 0);
  assert.ok(delivery > 0);
  assert.ok(supply >= delivery);
  assert.ok(result.snapshotFragment.affectedObjectIds.includes("supply"));
});

test("loop prevention blocks circular traversal", () => {
  const cyclic: SceneJson = {
    state_vector: {},
    scene: {
      objects: [
        { id: "a", dependencies: ["c"] },
        { id: "b", dependencies: ["a"] },
        { id: "c", dependencies: ["b"] },
      ],
    },
  };
  const graph = buildSimulationObjectGraphFromScene(cyclic);
  const result = propagateSimulationEvent({
    event: evt({ id: "loop", type: "risk_increase", sourceObjectId: "a" }),
    objectGraph: graph,
    tick: 1,
  });
  assert.ok(result.rejections.some((r) => r.code === "circular_dependency"));
});

test("depth limiting caps cascade extent", () => {
  const graph = buildSimulationObjectGraphFromScene(sceneFixture());
  const result = propagateSimulationEvent({
    event: evt({ id: "deep", type: "risk_increase", sourceObjectId: "inventory" }),
    objectGraph: graph,
    tick: 1,
    maxTraversedNodes: 2,
  });
  assert.ok(result.rejections.some((r) => r.code === "max_nodes_exceeded") || result.propagationEvents.length <= 2);
  const maxDepth = Math.max(0, ...result.propagationEvents.map((e) => e.depth));
  assert.ok(maxDepth <= PROPAGATION_MAX_EFFECTIVE_DEPTH);
});

test("propagation path reconstruction is stable", () => {
  const path = reconstructPropagationPath("inventory", ["inventory", "supply", "delivery"], 0.42, 2);
  assert.equal(path.sourceObjectId, "inventory");
  assert.deepEqual(path.traversedObjectIds, ["inventory", "supply", "delivery"]);
  assert.equal(path.depth, 2);
});

test("immutable snapshot fragment and evolution signal bridge", () => {
  const graph = buildSimulationObjectGraphFromScene(sceneFixture());
  const result = propagateSimulationEvent({
    event: evt({ id: "bridge", type: "operational_alert", sourceObjectId: "inventory" }),
    objectGraph: graph,
    tick: 3,
  });
  const fragment = result.snapshotFragment;
  const frozen = JSON.stringify(fragment);
  propagationResultToEvolutionSignals(result);
  assert.equal(JSON.stringify(fragment), frozen);
  const signals = propagationResultToEvolutionSignals(result);
  assert.ok(signals.length >= 1);
});

test("batch propagation preserves deterministic ordering", () => {
  const graph = buildSimulationObjectGraphFromScene(sceneFixture());
  const events = [
    evt({ id: "b", type: "risk_increase", sourceObjectId: "inventory" }),
    evt({ id: "a", type: "resource_shift", sourceObjectId: "inventory" }),
  ];
  const result = propagateSimulationEvents({ events, objectGraph: graph, tick: 1 });
  assert.ok(result.propagationEvents.length > 0);
  const ids = result.propagationEvents.map((e) => e.id);
  assert.deepEqual(ids, [...ids].sort());
});
