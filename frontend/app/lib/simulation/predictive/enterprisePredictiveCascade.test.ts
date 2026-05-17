/**
 * D7:4:4 — Predictive cascading consequence intelligence tests.
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
import { evaluateHumanSystemResilience } from "../resilience/enterpriseHumanSystemResilienceEngine.ts";
import { evaluateFutureTrajectories } from "./predictiveFutureTrajectoryEngine.ts";
import { evaluateFutureDivergence } from "./multiFutureDivergenceEngine.ts";
import {
  evaluatePredictiveCascades,
  freezePredictiveCascadeSnapshot,
} from "./predictiveCascadingConsequenceEngine.ts";
import {
  buildCascadeContentFingerprint,
  CASCADE_UNCERTAINTY_DISCLAIMER,
  guardEvaluatePredictiveCascades,
  guardCascadeExecutiveSemantics,
} from "./cascadeGuards.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { buildExecutiveCascadeSemantics } from "./executiveCascadeSemantics.ts";
import {
  derivePredictiveCascadeSignals,
  calculateCascadePropagationScore,
  resolveInflectionSurface,
  classifyPredictiveCascadeLabel,
} from "./predictivePropagationModel.ts";
import { analyzeSecondaryTertiaryConsequences } from "./secondaryTertiaryConsequenceAnalysis.ts";
import { analyzeFutureAmplification } from "./futureAmplificationIntelligence.ts";
import type { SceneJson } from "../../sceneTypes.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-cascade", objects });
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

function buildCascadeStack() {
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
  const resilience = evaluateHumanSystemResilience({
    topology,
    actorState: actors.snapshot.state,
    coordinationState: coordination.snapshot.state,
    decisionFrictionState: friction.snapshot.state,
    influenceState: influence.snapshot.state,
    trustState: trust.snapshot.state,
    leadershipState: leadership.snapshot.state,
    alignmentState: alignment.snapshot.state,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    pressureState: pressure.snapshot.state,
    resilienceContext: { adaptationStressFactor: 0.2 },
  });
  assert.ok(resilience.ok);
  if (!resilience.ok) throw new Error("resilience failed");

  const trajectory = evaluateFutureTrajectories({
    topology,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    resilienceState: resilience.snapshot.state,
    recoveryState: recovery.snapshot.state,
    coordinationState: coordination.snapshot.state,
    alignmentState: alignment.snapshot.state,
    pressureState: pressure.snapshot.state,
    trustState: trust.snapshot.state,
  });
  assert.ok(trajectory.ok);
  if (!trajectory.ok) throw new Error("trajectory failed");

  const divergence = evaluateFutureDivergence({
    topology,
    trajectoryState: trajectory.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    resilienceState: resilience.snapshot.state,
    coordinationState: coordination.snapshot.state,
    alignmentState: alignment.snapshot.state,
    pressureState: pressure.snapshot.state,
    trustState: trust.snapshot.state,
    leadershipState: leadership.snapshot.state,
  });
  assert.ok(divergence.ok);
  if (!divergence.ok) throw new Error("divergence failed");

  return {
    topology,
    trajectory: trajectory.snapshot.state,
    divergence: divergence.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
    coordination: coordination.snapshot.state,
    pressure: pressure.snapshot.state,
    trust: trust.snapshot.state,
  };
}

test("deterministic cascade analysis", () => {
  const stack = buildCascadeStack();
  const r1 = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
    cascadeContext: { propagationStressFactor: 0.1 },
  });
  const r2 = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
    cascadeContext: { propagationStressFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("predictive propagation modeling", () => {
  const stack = buildCascadeStack();
  const inflection = resolveInflectionSurface({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const signals = derivePredictiveCascadeSignals({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    inflection,
  });
  const propagation = calculateCascadePropagationScore({
    signals,
    trajectoryState: stack.trajectory,
  });
  assert.ok(signals.length > 0);
  assert.ok(propagation >= 0 && propagation <= 1);
  for (const signal of signals) {
    assert.ok(signal.propagationIntensity <= 0.92);
    assert.ok(signal.hopDepth <= 4);
  }
});

test("propagation consistency validation", () => {
  const stack = buildCascadeStack();
  const inflection = resolveInflectionSurface({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const signals = derivePredictiveCascadeSignals({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    inflection,
  });
  const c1 = analyzeSecondaryTertiaryConsequences({
    signals,
    trustState: stack.trust,
    coordinationState: stack.coordination,
    divergenceState: stack.divergence,
  });
  const c2 = analyzeSecondaryTertiaryConsequences({
    signals,
    trustState: stack.trust,
    coordinationState: stack.coordination,
    divergenceState: stack.divergence,
  });
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen cascade snapshot", () => {
  const stack = buildCascadeStack();
  const result = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    pressureState: stack.pressure,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezePredictiveCascadeSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { cascadePropagationScore: number }).cascadePropagationScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed cascade outcome"));
  const guard = guardEvaluatePredictiveCascades({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        originatingRegionIds: ["unknown"],
        affectedRegionIds: ["finance"],
        cascadeState: "propagating",
        propagationIntensity: 0.5,
        hopDepth: 1,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_cascade_region");

  const semanticsGuard = guardCascadeExecutiveSemantics({
    headline: "The cascade is guaranteed",
    summary: "Propagation chain",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable cascade state preservation", () => {
  const stack = buildCascadeStack();
  const frozenTrajectory = JSON.stringify(stack.trajectory);
  evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.equal(JSON.stringify(stack.trajectory), frozenTrajectory);
});

test("executive cascade semantics are readable", () => {
  const stack = buildCascadeStack();
  const result = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    pressureState: stack.pressure,
    coordinationState: stack.coordination,
    tick: 4,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /cascade|manufacturing|logistics|finance|recovery|instability|consequence|propagat|coordination/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion amplification exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, CASCADE_UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveCascadeSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("secondary/tertiary consequence testing", () => {
  const stack = buildCascadeStack();
  const inflection = resolveInflectionSurface({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const signals = derivePredictiveCascadeSignals({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    inflection,
  });
  const amplifications = analyzeFutureAmplification({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    pressureState: stack.pressure,
    cascadeAmplificationScore: 0.4,
  });
  assert.ok(amplifications.length > 0);
  const label = classifyPredictiveCascadeLabel({
    cascadePropagationScore: 0.3,
    cascadeAmplificationScore: 0.25,
    cascadeStabilizationScore: 0.65,
  });
  assert.equal(label, "stabilizing");
});

test("integrated cascade panel contract", () => {
  const stack = buildCascadeStack();
  const result = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    trustState: stack.trust,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.uncertaintyDisclaimer, CASCADE_UNCERTAINTY_DISCLAIMER);
  assert.ok(result.panelContract.signals.length > 0);
});

test("rejects duplicate cascade build fingerprint", () => {
  const stack = buildCascadeStack();
  const first = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const inflection = resolveInflectionSurface({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const fp = buildCascadeContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    trajectoryFingerprint: stableStringify({
      label: stack.trajectory.predictiveTrajectoryLabel,
      propagation: stack.trajectory.trajectoryDivergenceScore,
    }),
    divergenceFingerprint: stableStringify({
      label: stack.divergence.multiFutureDivergenceLabel,
      fragmentation: stack.divergence.futureFragmentationScore,
    }),
    inflectionFingerprint: stableStringify({
      label: inflection.strategicInflectionLabel,
      pressure: inflection.inflectionPressureScore,
    }),
    tick: 0,
  });
  const second = evaluatePredictiveCascades({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
    priorCascadeFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_cascade_build");
});
