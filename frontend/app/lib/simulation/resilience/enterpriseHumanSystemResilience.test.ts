/**
 * D7:3:8 — Enterprise human-system resilience intelligence tests.
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
import { evaluateOrganizationalTrust } from "../trust/organizationalTrustStabilityEngine.ts";
import { evaluateLeadershipDynamics } from "../leadership/strategicLeadershipLoadDynamicsEngine.ts";
import { evaluateOrganizationalAlignment } from "../alignment/organizationalAlignmentDriftEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateHumanSystemResilience,
  freezeHumanSystemResilienceSnapshot,
} from "./enterpriseHumanSystemResilienceEngine.ts";
import {
  buildHumanSystemResilienceContentFingerprint,
  containsProhibitedResilienceText,
  guardEvaluateHumanSystemResilience,
} from "./humanSystemResilienceGuards.ts";
import { buildExecutiveResilienceSemantics } from "./executiveResilienceSemantics.ts";
import {
  calculateEnterpriseResilienceScore,
  calculateHumanSystemAdaptationLevel,
  deriveHumanSystemResilienceSignals,
} from "./adaptiveCoordinationModel.ts";
import { analyzeAdaptiveCoordination } from "./resilienceDegradationRecoveryAnalysis.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-resilience", objects });
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

function buildResilienceStack() {
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
  const trust = evaluateOrganizationalTrust({
    topology,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    influenceState: influence.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    pressureState: pressure.snapshot.state,
    trustContext: { coordinationFailureFactor: 0.15 },
  });
  assert.ok(trust.ok);
  if (!trust.ok) throw new Error("trust failed");
  const leadership = evaluateLeadershipDynamics({
    topology,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
    influenceState: influence.snapshot.state,
    trustState: trust.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    pressureState: pressure.snapshot.state,
    leadershipContext: { strategicBurdenFactor: 0.2 },
  });
  assert.ok(leadership.ok);
  if (!leadership.ok) throw new Error("leadership failed");
  const alignment = evaluateOrganizationalAlignment({
    topology,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
    influenceState: influence.snapshot.state,
    trustState: trust.snapshot.state,
    leadershipState: leadership.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    pressureState: pressure.snapshot.state,
    alignmentContext: { coordinationDivergenceFactor: 0.15 },
  });
  assert.ok(alignment.ok);
  if (!alignment.ok) throw new Error("alignment failed");
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
    trustState: trust.snapshot.state,
    leadershipState: leadership.snapshot.state,
    alignmentState: alignment.snapshot.state,
  };
}

test("deterministic resilience analysis", () => {
  const stack = buildResilienceStack();
  const r1 = evaluateHumanSystemResilience({
    ...stack,
    resilienceContext: { adaptationStressFactor: 0.2 },
  });
  const r2 = evaluateHumanSystemResilience({
    ...stack,
    resilienceContext: { adaptationStressFactor: 0.2 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("adaptive coordination modeling", () => {
  const stack = buildResilienceStack();
  const signals = deriveHumanSystemResilienceSignals({
    topology: stack.topology,
    actorState: stack.actorState,
    coordinationState: stack.coordinationState,
    decisionFrictionState: stack.decisionFrictionState,
    influenceState: stack.influenceState,
    trustState: stack.trustState,
    leadershipState: stack.leadershipState,
    alignmentState: stack.alignmentState,
    recoveryState: stack.recovery,
    resilienceFatigueFactor: 0.15,
  });
  const enterprise = calculateEnterpriseResilienceScore({
    coordinationState: stack.coordinationState,
    trustState: stack.trustState,
    leadershipState: stack.leadershipState,
    alignmentState: stack.alignmentState,
    recoveryState: stack.recovery,
    signals,
  });
  const adaptation = calculateHumanSystemAdaptationLevel({
    enterpriseResilienceScore: enterprise,
    resilienceDegradationScore: 0.4,
    coordinationState: stack.coordinationState,
    influenceState: stack.influenceState,
  });
  assert.ok(enterprise >= 0 && enterprise <= 1);
  assert.ok(adaptation >= 0 && adaptation <= 1);
  assert.ok(signals.length > 0);
});

test("resilience consistency", () => {
  const stack = buildResilienceStack();
  const signals = deriveHumanSystemResilienceSignals({
    topology: stack.topology,
    actorState: stack.actorState,
    coordinationState: stack.coordinationState,
    decisionFrictionState: stack.decisionFrictionState,
    influenceState: stack.influenceState,
    trustState: stack.trustState,
    leadershipState: stack.leadershipState,
    alignmentState: stack.alignmentState,
    recoveryState: stack.recovery,
  });
  const adaptation = calculateHumanSystemAdaptationLevel({
    enterpriseResilienceScore: 0.5,
    resilienceDegradationScore: 0.4,
    coordinationState: stack.coordinationState,
    influenceState: stack.influenceState,
  });
  const a1 = analyzeAdaptiveCoordination({
    topology: stack.topology,
    signals,
    coordinationState: stack.coordinationState,
    humanSystemAdaptationLevel: adaptation,
  });
  const a2 = analyzeAdaptiveCoordination({
    topology: stack.topology,
    signals,
    coordinationState: stack.coordinationState,
    humanSystemAdaptationLevel: adaptation,
  });
  assert.equal(
    a1.map((r) => r.recordId).join("|"),
    a2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen resilience snapshot", () => {
  const stack = buildResilienceStack();
  const result = evaluateHumanSystemResilience(stack);
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeHumanSystemResilienceSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { enterpriseResilienceScore: number }).enterpriseResilienceScore = 0;
  });
});

test("ethical guard rejects prohibited resilience text", () => {
  assert.ok(containsProhibitedResilienceText("emotional resilience scoring"));
  const guard = guardEvaluateHumanSystemResilience({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["finance"],
        resilienceState: "fragile",
        intensity: 0.7,
        executiveLabel: "mental health resilience breakdown",
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invasive_resilience_analysis");
});

test("rejects duplicate resilience build fingerprint", () => {
  const stack = buildResilienceStack();
  const first = evaluateHumanSystemResilience({ ...stack, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildHumanSystemResilienceContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    coordinationFingerprint: stableStringify({
      sync: stack.coordinationState.organizationalSynchronizationScore,
      label: stack.coordinationState.coordinationDynamicsLabel,
    }),
    frictionFingerprint: stableStringify({
      drag: stack.decisionFrictionState.organizationalDragLevel,
      label: stack.decisionFrictionState.decisionFrictionLabel,
    }),
    influenceFingerprint: stableStringify({
      propagation: stack.influenceState.influencePropagationScore,
      label: stack.influenceState.influenceStabilityLabel,
    }),
    trustFingerprint: stableStringify({
      trust: stack.trustState.organizationalTrustScore,
      label: stack.trustState.trustStabilityLabel,
    }),
    leadershipFingerprint: stableStringify({
      burden: stack.leadershipState.leadershipBurdenScore,
      label: stack.leadershipState.leadershipDynamicsLabel,
    }),
    alignmentFingerprint: stableStringify({
      coherence: stack.alignmentState.strategicCoherenceLevel,
      label: stack.alignmentState.alignmentDriftLabel,
    }),
    actorFingerprint: stableStringify({
      alignment: stack.actorState.organizationalAlignmentScore,
      pressure: stack.actorState.coordinationPressure,
      label: stack.actorState.coordinationQualityLabel,
    }),
    tick: 0,
  });
  const second = evaluateHumanSystemResilience({
    ...stack,
    tick: 0,
    priorResilienceFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_resilience_build");
});

test("immutable resilience state preservation", () => {
  const stack = buildResilienceStack();
  const frozenAlignment = JSON.stringify(stack.alignmentState);
  evaluateHumanSystemResilience(stack);
  assert.equal(JSON.stringify(stack.alignmentState), frozenAlignment);
});

test("executive resilience semantics are readable", () => {
  const stack = buildResilienceStack();
  const result = evaluateHumanSystemResilience({
    ...stack,
    resilienceContext: { resilienceFatigueFactor: 0.25 },
    tick: 7,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /resilience|recovery|logistics|executive|human-system|adaptation|coordination|fragility/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion instability"));

  const manual = buildExecutiveResilienceSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated panel contract", () => {
  const stack = buildResilienceStack();
  const result = evaluateHumanSystemResilience(stack);
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.ok(
    ["adaptive", "stable", "strained", "fragile", "recovering"].includes(
      result.panelContract.resilienceStabilityLabel
    )
  );
});

test("governance rejects invalid resilience region", () => {
  const guard = guardEvaluateHumanSystemResilience({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown_region"],
        resilienceState: "strained",
        intensity: 0.6,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_resilience_region");
});
