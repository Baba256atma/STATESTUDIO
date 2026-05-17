/**
 * D7:3:3 — Organizational decision friction intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../topology/operationalUniverseTopologyEngine.ts";
import { calculateOrganizationalFlows } from "../flow/organizationalFlowDynamicsEngine.ts";
import { evaluateDependencyPressure } from "../pressure/enterpriseDependencyPressureEngine.ts";
import { mapOperationalFragility } from "../fragility/operationalFragilityConcentrationEngine.ts";
import { evaluateRecoveryCapacity } from "../recovery/organizationalRecoveryCapacityEngine.ts";
import { evaluateOperationalMomentum } from "../momentum/enterpriseOperationalMomentumEngine.ts";
import { evaluateOperationalEquilibrium } from "../equilibrium/strategicOperationalEquilibriumEngine.ts";
import { evaluateHumanActorParticipation } from "../actors/strategicHumanActorFoundationEngine.ts";
import { evaluateExecutiveCoordination } from "../coordination/executiveCoordinationDynamicsEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateDecisionFriction,
  freezeOrganizationalDecisionFrictionSnapshot,
} from "./organizationalDecisionFrictionEngine.ts";
import {
  buildFrictionContentFingerprint,
  containsProhibitedFrictionText,
  guardEvaluateDecisionFriction,
} from "./decisionFrictionGuards.ts";
import { buildExecutiveDecisionFrictionSemantics } from "./executiveDecisionFrictionSemantics.ts";
import {
  calculateExecutionLatencyScore,
  calculateStrategicResistanceScore,
  deriveDecisionFrictionSignals,
} from "./executionResistanceModel.ts";
import { analyzeDecisionLatency } from "./decisionLatencyAnalysis.ts";

function sceneFixture(): SceneJson {
  return {
    scene: {
      objects: [
        { id: "plant_a", label: "Plant A", domain: "manufacturing", dependencies: ["warehouse_hub"] },
        { id: "warehouse_hub", label: "Warehouse", domain: "logistics", dependencies: ["customer_ops"] },
        { id: "customer_ops", label: "Customer Ops", domain: "customer" },
        { id: "finance_core", label: "Finance Core", domain: "finance" },
      ],
    },
  };
}

function buildTopology() {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const built = buildOperationalUniverseTopology({ topologyId: "topo-friction", objects });
  assert.ok(built.ok);
  if (!built.ok) throw new Error("topology build failed");
  return built.snapshot.topology;
}

const strainedMetrics = {
  manufacturing: { fragility: 0.62, operationalLoad: 0.7, recoveryCapacity: 0.3 },
  logistics: { fragility: 0.78, operationalLoad: 0.85, recoveryCapacity: 0.25 },
  customer_systems: { fragility: 0.48, operationalLoad: 0.5, recoveryCapacity: 0.45 },
  finance: { fragility: 0.28, operationalLoad: 0.35, recoveryCapacity: 0.7 },
};

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function buildFrictionStack() {
  const topology = buildTopology();
  const flow = calculateOrganizationalFlows({ topology, regionMetrics: strainedMetrics });
  assert.ok(flow.ok);
  if (!flow.ok) throw new Error("flow failed");
  const pressure = evaluateDependencyPressure({
    topology,
    flowState: flow.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(pressure.ok);
  if (!pressure.ok) throw new Error("pressure failed");
  const fragility = mapOperationalFragility({
    topology,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(fragility.ok);
  if (!fragility.ok) throw new Error("fragility failed");
  const recovery = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility.snapshot.map,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(recovery.ok);
  if (!recovery.ok) throw new Error("recovery failed");
  const momentum = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery.snapshot.state,
    fragilityMap: fragility.snapshot.map,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(momentum.ok);
  if (!momentum.ok) throw new Error("momentum failed");
  const equilibrium = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    fragilityMap: fragility.snapshot.map,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(equilibrium.ok);
  if (!equilibrium.ok) throw new Error("equilibrium failed");
  const actors = evaluateHumanActorParticipation({
    topology,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    participationContext: { coordinationLoadFactor: 0.35 },
  });
  assert.ok(actors.ok);
  if (!actors.ok) throw new Error("actors failed");
  const coordination = evaluateExecutiveCoordination({
    topology,
    actorState: actors.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    coordinationContext: { communicationDelayFactor: 0.25 },
  });
  assert.ok(coordination.ok);
  if (!coordination.ok) throw new Error("coordination failed");
  return {
    topology,
    momentum: momentum.snapshot.state,
    recovery: recovery.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    pressure: pressure.snapshot.state,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
  };
}

test("deterministic friction analysis", () => {
  const { topology, actorState, coordinationState, momentum, recovery, equilibrium, pressure } =
    buildFrictionStack();
  const r1 = evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    frictionContext: { approvalChainDelayFactor: 0.35 },
  });
  const r2 = evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    frictionContext: { approvalChainDelayFactor: 0.35 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("execution resistance modeling", () => {
  const { topology, actorState, coordinationState, pressure } = buildFrictionStack();
  const signals = deriveDecisionFrictionSignals({
    topology,
    actorState,
    coordinationState,
    pressureState: pressure,
    approvalChainDelayFactor: 0.4,
    implementationDragFactor: 0.2,
  });
  const resistance = calculateStrategicResistanceScore({
    actorState,
    coordinationState,
    signals,
  });
  const latency = calculateExecutionLatencyScore({
    signals,
    coordinationState,
    approvalChainDelayFactor: 0.4,
  });
  assert.ok(resistance >= 0 && resistance <= 1);
  assert.ok(latency >= 0 && latency <= 1);
  assert.ok(signals.length > 0);
});

test("latency consistency", () => {
  const { topology, actorState, coordinationState } = buildFrictionStack();
  const signals = deriveDecisionFrictionSignals({
    topology,
    actorState,
    coordinationState,
    approvalChainDelayFactor: 0.3,
  });
  const l1 = analyzeDecisionLatency({
    topology,
    actorState,
    coordinationState,
    signals,
    approvalChainDelayFactor: 0.3,
  });
  const l2 = analyzeDecisionLatency({
    topology,
    actorState,
    coordinationState,
    signals,
    approvalChainDelayFactor: 0.3,
  });
  assert.equal(
    l1.map((r) => r.recordId).join("|"),
    l2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen friction snapshot", () => {
  const { topology, actorState, coordinationState } = buildFrictionStack();
  const result = evaluateDecisionFriction({ topology, actorState, coordinationState });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeOrganizationalDecisionFrictionSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { executionLatencyScore: number }).executionLatencyScore = 0;
  });
});

test("ethical guard rejects prohibited friction text", () => {
  assert.ok(containsProhibitedFrictionText("psychological decision resistance"));
  const guard = guardEvaluateDecisionFriction({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["finance"],
        frictionState: "high",
        intensity: 0.7,
        executiveLabel: "emotional decision paralysis",
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invasive_friction_analysis");
});

test("rejects duplicate friction build fingerprint", () => {
  const { topology, actorState, coordinationState } = buildFrictionStack();
  const first = evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildFrictionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint: stableStringify({
      sync: coordinationState.organizationalSynchronizationScore,
      friction: coordinationState.coordinationFrictionScore,
      label: coordinationState.coordinationDynamicsLabel,
    }),
    actorFingerprint: stableStringify({
      alignment: actorState.organizationalAlignmentScore,
      pressure: actorState.coordinationPressure,
      label: actorState.coordinationQualityLabel,
    }),
    tick: 0,
  });
  const second = evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    tick: 0,
    priorFrictionFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_friction_build");
});

test("immutable friction state preservation", () => {
  const { topology, actorState, coordinationState, momentum, recovery, equilibrium, pressure } =
    buildFrictionStack();
  const frozenActor = JSON.stringify(actorState);
  const frozenCoordination = JSON.stringify(coordinationState);
  evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
  });
  assert.equal(JSON.stringify(actorState), frozenActor);
  assert.equal(JSON.stringify(coordinationState), frozenCoordination);
});

test("executive friction semantics are readable", () => {
  const { topology, actorState, coordinationState, momentum, recovery, equilibrium, pressure } =
    buildFrictionStack();
  const result = evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    frictionContext: { approvalChainDelayFactor: 0.45, implementationDragFactor: 0.25 },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /decision|friction|execution|approval|logistics|recovery|drag/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion instability"));

  const manual = buildExecutiveDecisionFrictionSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated panel contract", () => {
  const { topology, actorState, coordinationState, pressure } = buildFrictionStack();
  const result = evaluateDecisionFriction({
    topology,
    actorState,
    coordinationState,
    pressureState: pressure,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, topology.topologyId);
  assert.ok(
    ["fluid", "moderate", "elevated", "critical"].includes(
      result.panelContract.decisionFrictionLabel
    )
  );
});

test("governance rejects invalid friction region", () => {
  const guard = guardEvaluateDecisionFriction({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown_region"],
        frictionState: "high",
        intensity: 0.8,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_friction_region");
});
