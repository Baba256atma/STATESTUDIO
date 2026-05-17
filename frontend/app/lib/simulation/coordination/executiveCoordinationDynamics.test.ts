/**
 * D7:3:2 — Executive coordination dynamics intelligence tests.
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
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateExecutiveCoordination,
  freezeExecutiveCoordinationSnapshot,
} from "./executiveCoordinationDynamicsEngine.ts";
import {
  buildCoordinationContentFingerprint,
  containsProhibitedCoordinationText,
  guardEvaluateExecutiveCoordination,
} from "./coordinationGuards.ts";
import { buildExecutiveCoordinationSemantics } from "./executiveCoordinationSemantics.ts";
import {
  calculateCoordinationFrictionScore,
  calculateExecutiveAlignmentScore,
  deriveExecutiveCoordinationSignals,
} from "./alignmentFrictionModel.ts";
import { analyzeCrossDomainSynchronization } from "./crossDomainSynchronization.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-coordination", objects });
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

function buildActorStack() {
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
  return {
    topology,
    momentum: momentum.snapshot.state,
    recovery: recovery.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    actorState: actors.snapshot.state,
  };
}

test("deterministic coordination analysis", () => {
  const { topology, actorState, momentum, recovery, equilibrium } = buildActorStack();
  const r1 = evaluateExecutiveCoordination({
    topology,
    actorState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    coordinationContext: { communicationDelayFactor: 0.2 },
  });
  const r2 = evaluateExecutiveCoordination({
    topology,
    actorState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    coordinationContext: { communicationDelayFactor: 0.2 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("alignment and friction modeling", () => {
  const { actorState } = buildActorStack();
  const signals = deriveExecutiveCoordinationSignals({
    actorState,
    communicationDelayFactor: 0.25,
  });
  const alignment = calculateExecutiveAlignmentScore({ actorState, signals });
  const friction = calculateCoordinationFrictionScore({
    actorState,
    signals,
    communicationDelayFactor: 0.25,
  });
  assert.ok(alignment >= 0 && alignment <= 1);
  assert.ok(friction >= 0 && friction <= 1);
});

test("synchronization consistency", () => {
  const { topology, actorState } = buildActorStack();
  const s1 = analyzeCrossDomainSynchronization({ topology, actorState });
  const s2 = analyzeCrossDomainSynchronization({ topology, actorState });
  assert.equal(
    s1.map((r) => r.recordId).join("|"),
    s2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen coordination snapshot", () => {
  const { topology, actorState } = buildActorStack();
  const result = evaluateExecutiveCoordination({ topology, actorState });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeExecutiveCoordinationSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { executiveAlignmentScore: number }).executiveAlignmentScore = 0;
  });
});

test("ethical guard rejects prohibited coordination text", () => {
  assert.ok(containsProhibitedCoordinationText("psychological coordination drift"));
  const guard = guardEvaluateExecutiveCoordination({
    topologyId: "topo",
    actorIds: ["a1"],
    signals: [
      {
        signalId: "bad",
        participatingActorIds: ["a1"],
        coordinationState: "strained",
        intensity: 0.5,
        affectedRegionIds: ["finance"],
        executiveLabel: "emotional leadership breakdown",
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invasive_coordination_analysis");
});

test("rejects duplicate coordination build fingerprint", () => {
  const { topology, actorState, momentum } = buildActorStack();
  const first = evaluateExecutiveCoordination({ topology, actorState, momentumState: momentum, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildCoordinationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    actorFingerprint: stableStringify({
      alignment: actorState.organizationalAlignmentScore,
      pressure: actorState.coordinationPressure,
      label: actorState.coordinationQualityLabel,
    }),
    momentumFingerprint: stableStringify({ trend: momentum.momentumTrendLabel }),
    tick: 0,
  });
  const second = evaluateExecutiveCoordination({
    topology,
    actorState,
    momentumState: momentum,
    tick: 0,
    priorCoordinationFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_coordination_build");
});

test("actor state immutability preserved", () => {
  const { topology, actorState, momentum, recovery, equilibrium } = buildActorStack();
  const frozen = JSON.stringify(actorState);
  evaluateExecutiveCoordination({
    topology,
    actorState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
  });
  assert.equal(JSON.stringify(actorState), frozen);
});

test("executive coordination semantics are readable", () => {
  const { topology, actorState, momentum, recovery, equilibrium } = buildActorStack();
  const result = evaluateExecutiveCoordination({
    topology,
    actorState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    coordinationContext: { communicationDelayFactor: 0.3 },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /coordination|synchronization|alignment|executive|recovery|logistics|finance/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion instability"));

  const manual = buildExecutiveCoordinationSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated panel contract", () => {
  const { topology, actorState, momentum } = buildActorStack();
  const result = evaluateExecutiveCoordination({
    topology,
    actorState,
    momentumState: momentum,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, topology.topologyId);
  assert.ok(
    ["synchronized", "strained", "fragmented", "recovering"].includes(
      result.panelContract.coordinationDynamicsLabel
    )
  );
});

test("governance rejects invalid coordination actors", () => {
  const guard = guardEvaluateExecutiveCoordination({
    topologyId: "topo",
    actorIds: ["a1"],
    signals: [
      {
        signalId: "bad",
        participatingActorIds: ["unknown"],
        coordinationState: "fragmented",
        intensity: 0.8,
        affectedRegionIds: ["finance"],
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_coordination_actor");
});
