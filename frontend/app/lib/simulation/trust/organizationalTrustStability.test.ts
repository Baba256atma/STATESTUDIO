/**
 * D7:3:5 — Organizational trust stability intelligence tests.
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
import { evaluateDecisionFriction } from "../friction/organizationalDecisionFrictionEngine.ts";
import { evaluateStakeholderInfluence } from "../influence/stakeholderInfluencePropagationEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateOrganizationalTrust,
  freezeOrganizationalTrustSnapshot,
} from "./organizationalTrustStabilityEngine.ts";
import {
  buildTrustContentFingerprint,
  containsProhibitedTrustText,
  guardEvaluateOrganizationalTrust,
} from "./trustGuards.ts";
import { buildExecutiveTrustSemantics } from "./executiveTrustSemantics.ts";
import {
  calculateOrganizationalTrustScore,
  calculateTrustDegradationScore,
  deriveOrganizationalTrustSignals,
} from "./trustDegradationRecoveryModel.ts";
import { analyzeCoordinationTrust } from "./coordinationTrustAnalysis.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-trust", objects });
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

function buildTrustStack() {
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
  const friction = evaluateDecisionFriction({
    topology,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    pressureState: pressure.snapshot.state,
    frictionContext: { approvalChainDelayFactor: 0.3 },
  });
  assert.ok(friction.ok);
  if (!friction.ok) throw new Error("friction failed");
  const influence = evaluateStakeholderInfluence({
    topology,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    pressureState: pressure.snapshot.state,
    influenceContext: { propagationDelayFactor: 0.2 },
  });
  assert.ok(influence.ok);
  if (!influence.ok) throw new Error("influence failed");
  return {
    topology,
    momentum: momentum.snapshot.state,
    recovery: recovery.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    pressure: pressure.snapshot.state,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
    influenceState: influence.snapshot.state,
  };
}

test("deterministic trust analysis", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    momentum,
    recovery,
    equilibrium,
    pressure,
  } = buildTrustStack();
  const r1 = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    trustContext: { coordinationFailureFactor: 0.15 },
  });
  const r2 = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    trustContext: { coordinationFailureFactor: 0.15 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("trust degradation and recovery modeling", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    recovery,
  } = buildTrustStack();
  const signals = deriveOrganizationalTrustSignals({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    recoveryState: recovery,
    coordinationFailureFactor: 0.2,
  });
  const trustScore = calculateOrganizationalTrustScore({
    actorState,
    coordinationState,
    influenceState,
    signals,
  });
  const degradation = calculateTrustDegradationScore({
    signals,
    coordinationState,
    decisionFrictionState,
  });
  assert.ok(trustScore >= 0 && trustScore <= 1);
  assert.ok(degradation >= 0 && degradation <= 1);
  assert.ok(signals.length > 0);
});

test("trust consistency validation", () => {
  const {
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
  } = buildTrustStack();
  const signals = deriveOrganizationalTrustSignals({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
  });
  const c1 = analyzeCoordinationTrust({
    topology,
    coordinationState,
    influenceState,
    decisionFrictionState,
    signals,
  });
  const c2 = analyzeCoordinationTrust({
    topology,
    coordinationState,
    influenceState,
    decisionFrictionState,
    signals,
  });
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen trust snapshot", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
  } = buildTrustStack();
  const result = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeOrganizationalTrustSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { organizationalTrustScore: number }).organizationalTrustScore = 0;
  });
});

test("ethical guard rejects prohibited trust text", () => {
  assert.ok(containsProhibitedTrustText("emotional sentiment mining"));
  const guard = guardEvaluateOrganizationalTrust({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["finance"],
        trustState: "degrading",
        intensity: 0.7,
        executiveLabel: "psychological trust breakdown",
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invasive_trust_analysis");
});

test("rejects duplicate trust build fingerprint", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
  } = buildTrustStack();
  const first = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildTrustContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint: stableStringify({
      sync: coordinationState.organizationalSynchronizationScore,
      label: coordinationState.coordinationDynamicsLabel,
    }),
    frictionFingerprint: stableStringify({
      drag: decisionFrictionState.organizationalDragLevel,
      label: decisionFrictionState.decisionFrictionLabel,
    }),
    influenceFingerprint: stableStringify({
      propagation: influenceState.influencePropagationScore,
      label: influenceState.influenceStabilityLabel,
    }),
    actorFingerprint: stableStringify({
      alignment: actorState.organizationalAlignmentScore,
      pressure: actorState.coordinationPressure,
      label: actorState.coordinationQualityLabel,
    }),
    tick: 0,
  });
  const second = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    tick: 0,
    priorTrustFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_trust_build");
});

test("immutable trust state preservation", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    momentum,
    recovery,
    equilibrium,
    pressure,
  } = buildTrustStack();
  const frozenActor = JSON.stringify(actorState);
  const frozenCoordination = JSON.stringify(coordinationState);
  const frozenFriction = JSON.stringify(decisionFrictionState);
  const frozenInfluence = JSON.stringify(influenceState);
  evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
  });
  assert.equal(JSON.stringify(actorState), frozenActor);
  assert.equal(JSON.stringify(coordinationState), frozenCoordination);
  assert.equal(JSON.stringify(decisionFrictionState), frozenFriction);
  assert.equal(JSON.stringify(influenceState), frozenInfluence);
});

test("executive trust semantics are readable", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    momentum,
    recovery,
    equilibrium,
    pressure,
  } = buildTrustStack();
  const result = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    trustContext: { trustErosionFactor: 0.2 },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /trust|coordination|recovery|logistics|executive|stability|confidence/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion instability"));

  const manual = buildExecutiveTrustSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated panel contract", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
  } = buildTrustStack();
  const result = evaluateOrganizationalTrust({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, topology.topologyId);
  assert.ok(
    ["stable", "strained", "degrading", "recovering", "critical"].includes(
      result.panelContract.trustStabilityLabel
    )
  );
});

test("governance rejects invalid trust region", () => {
  const guard = guardEvaluateOrganizationalTrust({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown_region"],
        trustState: "strained",
        intensity: 0.6,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_trust_region");
});
