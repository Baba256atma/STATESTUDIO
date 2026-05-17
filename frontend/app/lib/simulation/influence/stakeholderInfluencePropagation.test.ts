/**
 * D7:3:4 — Stakeholder influence propagation intelligence tests.
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
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateStakeholderInfluence,
  freezeStakeholderInfluenceSnapshot,
} from "./stakeholderInfluencePropagationEngine.ts";
import {
  buildInfluenceContentFingerprint,
  containsProhibitedInfluenceText,
  guardEvaluateStakeholderInfluence,
} from "./influenceGuards.ts";
import { buildExecutiveInfluenceSemantics } from "./executiveInfluenceSemantics.ts";
import {
  calculateInfluencePropagationScore,
  calculateOrganizationalAlignmentLevel,
  deriveStakeholderInfluenceSignals,
} from "./alignmentResistancePropagationModel.ts";
import { analyzeCrossDomainInfluencePropagation } from "./crossDomainInfluenceIntelligence.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-influence", objects });
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

function buildInfluenceStack() {
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
  return {
    topology,
    momentum: momentum.snapshot.state,
    recovery: recovery.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    pressure: pressure.snapshot.state,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
  };
}

test("deterministic influence analysis", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentum,
    recovery,
    equilibrium,
    pressure,
  } = buildInfluenceStack();
  const r1 = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    influenceContext: { propagationDelayFactor: 0.2 },
  });
  const r2 = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    influenceContext: { propagationDelayFactor: 0.2 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("alignment and resistance propagation modeling", () => {
  const { topology, actorState, coordinationState, decisionFrictionState } = buildInfluenceStack();
  const signals = deriveStakeholderInfluenceSignals({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    propagationDelayFactor: 0.25,
  });
  const alignment = calculateOrganizationalAlignmentLevel({
    actorState,
    coordinationState,
    signals,
  });
  const propagation = calculateInfluencePropagationScore({
    signals,
    coordinationState,
    decisionFrictionState,
    propagationDelayFactor: 0.25,
  });
  assert.ok(alignment >= 0 && alignment <= 1);
  assert.ok(propagation >= 0 && propagation <= 1);
  assert.ok(signals.length > 0);
});

test("propagation consistency", () => {
  const { topology, actorState, coordinationState, decisionFrictionState } = buildInfluenceStack();
  const signals = deriveStakeholderInfluenceSignals({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
  });
  const propagationScore = calculateInfluencePropagationScore({
    signals,
    coordinationState,
    decisionFrictionState,
  });
  const p1 = analyzeCrossDomainInfluencePropagation({
    topology,
    actorState,
    signals,
    influencePropagationScore: propagationScore,
    resistanceConcentrationScore: 0.4,
  });
  const p2 = analyzeCrossDomainInfluencePropagation({
    topology,
    actorState,
    signals,
    influencePropagationScore: propagationScore,
    resistanceConcentrationScore: 0.4,
  });
  assert.equal(
    p1.map((r) => r.recordId).join("|"),
    p2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen influence snapshot", () => {
  const { topology, actorState, coordinationState, decisionFrictionState } = buildInfluenceStack();
  const result = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStakeholderInfluenceSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { organizationalAlignmentLevel: number }).organizationalAlignmentLevel = 0;
  });
});

test("ethical guard rejects prohibited influence text", () => {
  assert.ok(containsProhibitedInfluenceText("political persuasion targeting"));
  const guard = guardEvaluateStakeholderInfluence({
    topologyId: "topo",
    actorIds: ["a1"],
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        sourceActorIds: ["a1"],
        affectedRegionIds: ["finance"],
        influenceState: "resistant",
        intensity: 0.7,
        executiveLabel: "emotional manipulation of stakeholders",
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invasive_influence_analysis");
});

test("rejects duplicate influence build fingerprint", () => {
  const { topology, actorState, coordinationState, decisionFrictionState } = buildInfluenceStack();
  const first = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildInfluenceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint: stableStringify({
      sync: coordinationState.organizationalSynchronizationScore,
      label: coordinationState.coordinationDynamicsLabel,
    }),
    frictionFingerprint: stableStringify({
      drag: decisionFrictionState.organizationalDragLevel,
      label: decisionFrictionState.decisionFrictionLabel,
    }),
    actorFingerprint: stableStringify({
      alignment: actorState.organizationalAlignmentScore,
      pressure: actorState.coordinationPressure,
      label: actorState.coordinationQualityLabel,
    }),
    tick: 0,
  });
  const second = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    tick: 0,
    priorInfluenceFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_influence_build");
});

test("immutable influence state preservation", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentum,
    recovery,
    equilibrium,
    pressure,
  } = buildInfluenceStack();
  const frozenActor = JSON.stringify(actorState);
  const frozenCoordination = JSON.stringify(coordinationState);
  const frozenFriction = JSON.stringify(decisionFrictionState);
  evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
  });
  assert.equal(JSON.stringify(actorState), frozenActor);
  assert.equal(JSON.stringify(coordinationState), frozenCoordination);
  assert.equal(JSON.stringify(decisionFrictionState), frozenFriction);
});

test("executive influence semantics are readable", () => {
  const {
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentum,
    recovery,
    equilibrium,
    pressure,
  } = buildInfluenceStack();
  const result = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    momentumState: momentum,
    recoveryState: recovery,
    equilibriumState: equilibrium,
    pressureState: pressure,
    influenceContext: { propagationDelayFactor: 0.3 },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /stakeholder|influence|alignment|resistance|finance|logistics|manufacturing|executive/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("propagation recursion"));

  const manual = buildExecutiveInfluenceSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated panel contract", () => {
  const { topology, actorState, coordinationState, decisionFrictionState, pressure } =
    buildInfluenceStack();
  const result = evaluateStakeholderInfluence({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    pressureState: pressure,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, topology.topologyId);
  assert.ok(
    ["stable", "strained", "fragmented", "resistant"].includes(
      result.panelContract.influenceStabilityLabel
    )
  );
});

test("governance rejects invalid influence actor", () => {
  const guard = guardEvaluateStakeholderInfluence({
    topologyId: "topo",
    actorIds: ["a1"],
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        sourceActorIds: ["unknown"],
        affectedRegionIds: ["finance"],
        influenceState: "strained",
        intensity: 0.6,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_influence_actor");
});
