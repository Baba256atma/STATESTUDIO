/**
 * D7:3:1 — Strategic human actor foundation tests.
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
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateHumanActorParticipation,
  freezeHumanActorParticipationSnapshot,
} from "./strategicHumanActorFoundationEngine.ts";
import { deriveDefaultActorsFromTopology } from "./organizationalRoleModeling.ts";
import {
  buildActorContentFingerprint,
  detectProhibitedActorAttributes,
  guardEvaluateHumanActorParticipation,
  PROHIBITED_ACTOR_ATTRIBUTE_KEYS,
} from "./actorGuards.ts";
import { buildExecutiveActorSemantics } from "./executiveActorSemantics.ts";
import { calculateCoordinationPressure } from "./coordinationInfluenceModel.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-actors", objects });
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

function buildMomentumStack() {
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
  return {
    topology,
    momentum: momentum.snapshot.state,
    recovery: recovery.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
  };
}

test("deterministic actor modeling", () => {
  const { topology, momentum, recovery, equilibrium } = buildMomentumStack();
  const r1 = evaluateHumanActorParticipation({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
  });
  const r2 = evaluateHumanActorParticipation({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.activeActors.length > 0);
});

test("organizational role consistency", () => {
  const topology = buildTopology();
  const actors = deriveDefaultActorsFromTopology(topology);
  const roles = new Set(actors.map((a) => a.role));
  assert.ok(roles.has("manager"));
  assert.ok(roles.has("executive") || roles.has("stakeholder"));
  assert.ok(actors.every((a) => a.assignedRegionIds.length > 0));
});

test("coordination influence analysis", () => {
  const { topology, momentum, equilibrium } = buildMomentumStack();
  const actors = deriveDefaultActorsFromTopology(topology);
  const pressure = calculateCoordinationPressure({
    actors,
    momentumState: momentum,
    equilibriumState: equilibrium,
    coordinationLoadFactor: 0.3,
  });
  assert.ok(pressure >= 0 && pressure <= 1);
});

test("replay-safe frozen actor snapshot", () => {
  const topology = buildTopology();
  const result = evaluateHumanActorParticipation({ topology });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeHumanActorParticipationSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { coordinationPressure: number }).coordinationPressure = 0;
  });
});

test("ethical guard rejects prohibited sensitive attributes", () => {
  const prohibited = detectProhibitedActorAttributes({
    actorId: "bad",
    displayLabel: "Test",
    role: "manager",
    assignedRegionIds: ["a"],
    influenceLevel: 0.5,
    coordinationContribution: 0.5,
    operationalParticipation: 0.5,
    personality: "introvert",
  } as never);
  assert.ok(prohibited);
  assert.ok(PROHIBITED_ACTOR_ATTRIBUTE_KEYS.length > 0);
});

test("ethical guard rejects invasive display labels", () => {
  const guard = guardEvaluateHumanActorParticipation({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    actors: [
      {
        actorId: "bad",
        displayLabel: "psychological profile lead",
        role: "manager",
        assignedRegionIds: ["a"],
        influenceLevel: 0.5,
        coordinationContribution: 0.5,
        operationalParticipation: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invasive_behavioral_inference");
});

test("rejects duplicate actor build fingerprint", () => {
  const topology = buildTopology();
  const first = evaluateHumanActorParticipation({ topology, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildActorContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    tick: 0,
    actorIds: first.snapshot.state.activeActors.map((a) => a.actorId),
  });
  const second = evaluateHumanActorParticipation({
    topology,
    tick: 0,
    priorActorFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_actor_build");
});

test("upstream state immutability preserved", () => {
  const { topology, momentum, equilibrium } = buildMomentumStack();
  const frozen = {
    topology: JSON.stringify(topology),
    momentum: JSON.stringify(momentum),
    equilibrium: JSON.stringify(equilibrium),
  };
  evaluateHumanActorParticipation({
    topology,
    momentumState: momentum,
    equilibriumState: equilibrium,
  });
  assert.equal(JSON.stringify(topology), frozen.topology);
  assert.equal(JSON.stringify(momentum), frozen.momentum);
  assert.equal(JSON.stringify(equilibrium), frozen.equilibrium);
});

test("executive actor semantics are readable", () => {
  const { topology, momentum, recovery, equilibrium } = buildMomentumStack();
  const result = evaluateHumanActorParticipation({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    participationContext: { coordinationLoadFactor: 0.4 },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /coordination|actor|participation|recovery|operational|management|executive/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("behavioral instability recursion"));

  const manual = buildExecutiveActorSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated panel contract", () => {
  const topology = buildTopology();
  const result = evaluateHumanActorParticipation({ topology });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, topology.topologyId);
  assert.ok(result.panelContract.actors.length > 0);
});

test("governance rejects invalid actor regions", () => {
  const guard = guardEvaluateHumanActorParticipation({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    actors: [
      {
        actorId: "orphan",
        displayLabel: "Lead",
        role: "operator",
        assignedRegionIds: ["missing"],
        influenceLevel: 0.5,
        coordinationContribution: 0.5,
        operationalParticipation: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_actor_region");
});
