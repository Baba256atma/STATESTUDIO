/**
 * D7:1:2 — Operational state evolution engine tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { SimulationEvent } from "./simulationEventTypes.ts";
import {
  evolveOperationalState,
  operationalEvolutionFingerprint,
  simulatedStatesToSnapshotObjectStates,
  snapshotObjectStatesToSimulatedStates,
} from "./operationalStateEvolutionEngine.ts";
import { createInitialSimulatedObjectState } from "./operationalStateTypes.ts";
import { propagationSignalsFromOverlay } from "./propagationEvolutionSignals.ts";
import type { PropagationOverlayState } from "./propagationTypes.ts";
import { isDirectTransitionAllowed } from "./operationalStateTransitionRules.ts";

function evt(partial: Partial<SimulationEvent> & Pick<SimulationEvent, "id" | "type">): SimulationEvent {
  return { createdAt: "2026-01-01T00:00:00.000Z", ...partial };
}

test("immutable progression does not mutate input states", () => {
  const current = {
    a: createInitialSimulatedObjectState("a", 0, "stable"),
  };
  const frozen = JSON.stringify(current);
  evolveOperationalState({
    currentStates: current,
    simulationEvents: [
      evt({
        id: "e1",
        type: "risk_increase",
        targetObjectIds: ["a"],
        payload: { delta: 0.2 },
      }),
    ],
    tick: 1,
  });
  assert.equal(JSON.stringify(current), frozen);
});

test("deterministic replay: identical inputs yield identical fingerprint", () => {
  const input = {
    currentStates: { node: createInitialSimulatedObjectState("node", 0, "stable") },
    simulationEvents: [
      evt({ id: "e1", type: "risk_increase", targetObjectIds: ["node"], payload: { delta: 0.25 } }),
      evt({ id: "e2", type: "risk_increase", targetObjectIds: ["node"], payload: { delta: 0.25 } }),
    ],
    tick: 1,
  };
  const a = evolveOperationalState(input);
  const b = evolveOperationalState(input);
  assert.equal(operationalEvolutionFingerprint(a), operationalEvolutionFingerprint(b));
});

test("escalation chain: stable → monitoring/strained under pressure", () => {
  const result = evolveOperationalState({
    currentStates: { svc: createInitialSimulatedObjectState("svc", 0, "stable") },
    simulationEvents: [
      evt({
        id: "e1",
        type: "resource_shift",
        targetObjectIds: ["svc"],
        payload: { loadDelta: 0.35 },
      }),
    ],
    tick: 1,
  });
  const next = result.nextStates.svc!;
  assert.notEqual(next.operationalState, "stable");
  assert.ok(["monitoring", "strained", "degraded"].includes(next.operationalState));
  assert.ok(result.transitionsApplied.length >= 1);
});

test("recovery chain: critical → recovering → stable over ticks", () => {
  let states = { x: createInitialSimulatedObjectState("x", 0, "critical") };
  states = {
    x: {
      ...states.x,
      metadata: { ...states.x.metadata, severity: 0.9, instabilityAccumulator: 0.5 },
    },
  };
  const r1 = evolveOperationalState({
    currentStates: states,
    simulationEvents: [],
    tick: 1,
    operationalMetrics: { operationalLoad: 0.05 },
  });
  assert.equal(r1.nextStates.x!.operationalState, "recovering");

  const r2 = evolveOperationalState({
    currentStates: r1.nextStates,
    simulationEvents: [],
    tick: 2,
    operationalMetrics: { operationalLoad: 0.05 },
  });
  assert.equal(r2.nextStates.x!.operationalState, "stable");
});

test("propagation-driven evolution increases pressure on impacted nodes", () => {
  const overlay: PropagationOverlayState = {
    active: true,
    source_object_id: "src",
    mode: "preview",
    impacted_nodes: [
      { object_id: "downstream", depth: 1, strength: 0.75, role: "impacted" },
    ],
    impacted_edges: [],
    meta: { timestamp: Date.now(), source_kind: "manual_action" },
  };
  const signals = propagationSignalsFromOverlay(overlay);
  const result = evolveOperationalState({
    currentStates: { downstream: createInitialSimulatedObjectState("downstream", 0, "stable") },
    simulationEvents: [],
    propagationEffects: signals,
    tick: 1,
  });
  assert.ok(result.transitionsApplied.length >= 1);
  assert.equal(result.transitionsApplied[0]!.reason, "propagation");
});

test("stable → critical direct jump is rejected or funneled through ladder", () => {
  const result = evolveOperationalState({
    currentStates: { core: createInitialSimulatedObjectState("core", 0, "stable") },
    simulationEvents: [
      evt({
        id: "spike",
        type: "state_change",
        payload: {
          objectId: "core",
          patch: { operationalState: "critical", pressure: 1 },
        },
      }),
    ],
    tick: 1,
  });
  const next = result.nextStates.core!;
  assert.notEqual(next.operationalState, "critical");
  const rejected = result.rejections.some((r) => r.code === "escalation_path_required");
  const ladderOk = ["monitoring", "strained", "degraded"].includes(next.operationalState);
  assert.ok(rejected || ladderOk);
});

test("snapshot round-trip preserves operational semantics", () => {
  const evolved = evolveOperationalState({
    currentStates: { a: createInitialSimulatedObjectState("a", 0) },
    simulationEvents: [
      evt({ id: "e1", type: "operational_alert", targetObjectIds: ["a"] }),
    ],
    tick: 1,
  });
  const encoded = simulatedStatesToSnapshotObjectStates(evolved.nextStates);
  const decoded = snapshotObjectStatesToSimulatedStates(encoded, 1);
  assert.equal(decoded.a!.operationalState, evolved.nextStates.a!.operationalState);
});

test("invalid transition stable → critical not in allowed direct edges", () => {
  assert.equal(isDirectTransitionAllowed("stable", "critical"), false);
});
