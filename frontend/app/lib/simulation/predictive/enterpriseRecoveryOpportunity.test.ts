/**
 * D7:4:5 — Predictive recovery opportunity intelligence tests.
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
import { evaluatePredictiveCascades } from "./predictiveCascadingConsequenceEngine.ts";
import {
  evaluateRecoveryOpportunities,
  freezePredictiveRecoveryOpportunitySnapshot,
} from "./predictiveRecoveryOpportunityEngine.ts";
import {
  buildRecoveryOpportunityContentFingerprint,
  RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER,
  guardEvaluateRecoveryOpportunities,
  guardRecoveryOpportunityExecutiveSemantics,
} from "./recoveryOpportunityGuards.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { buildExecutiveRecoveryOpportunitySemantics } from "./executiveRecoveryOpportunitySemantics.ts";
import {
  deriveRecoveryOpportunitySignals,
  calculateRecoveryAccelerationScore,
  classifyRecoveryOpportunityLabel,
} from "./opportunityEmergenceModel.ts";
import { analyzeRecoveryLeveragePoints } from "./recoveryLeveragePointAnalysis.ts";
import { analyzePredictiveStabilization } from "./predictiveStabilizationIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-recovery-opp", objects });
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

function buildRecoveryOpportunityStack() {
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

  const cascade = evaluatePredictiveCascades({
    topology,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    resilienceState: resilience.snapshot.state,
    coordinationState: coordination.snapshot.state,
    pressureState: pressure.snapshot.state,
    trustState: trust.snapshot.state,
  });
  assert.ok(cascade.ok);
  if (!cascade.ok) throw new Error("cascade failed");

  return {
    topology,
    trajectory: trajectory.snapshot.state,
    divergence: divergence.snapshot.state,
    cascade: cascade.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
    recovery: recovery.snapshot.state,
    coordination: coordination.snapshot.state,
    pressure: pressure.snapshot.state,
    trust: trust.snapshot.state,
  };
}

test("deterministic recovery opportunity analysis", () => {
  const stack = buildRecoveryOpportunityStack();
  const r1 = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
    recoveryOpportunityContext: { interventionLeverageFactor: 0.1 },
  });
  const r2 = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
    recoveryOpportunityContext: { interventionLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("opportunity emergence modeling", () => {
  const stack = buildRecoveryOpportunityStack();
  const signals = deriveRecoveryOpportunitySignals({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
  });
  const acceleration = calculateRecoveryAccelerationScore({
    signals,
    momentumState: stack.momentum,
    resilienceState: stack.resilience,
  });
  assert.ok(signals.length > 0);
  assert.ok(acceleration >= 0 && acceleration <= 1);
  for (const signal of signals) {
    assert.ok(signal.opportunityStrength <= 0.92);
  }
});

test("stabilization consistency validation", () => {
  const stack = buildRecoveryOpportunityStack();
  const signals = deriveRecoveryOpportunitySignals({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const l1 = analyzeRecoveryLeveragePoints({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
  });
  const l2 = analyzeRecoveryLeveragePoints({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
  });
  assert.equal(
    l1.map((r) => r.recordId).join("|"),
    l2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen recovery opportunity snapshot", () => {
  const stack = buildRecoveryOpportunityStack();
  const result = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezePredictiveRecoveryOpportunitySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { recoveryAccelerationScore: number }).recoveryAccelerationScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed recovery outcome"));
  const guard = guardEvaluateRecoveryOpportunities({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown"],
        opportunityState: "emerging",
        opportunityStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_recovery_region");

  const semanticsGuard = guardRecoveryOpportunityExecutiveSemantics({
    headline: "Recovery is guaranteed",
    summary: "Opportunity emergence",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable recovery state preservation", () => {
  const stack = buildRecoveryOpportunityStack();
  const frozenCascade = JSON.stringify(stack.cascade);
  evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.equal(JSON.stringify(stack.cascade), frozenCascade);
});

test("executive recovery semantics are readable", () => {
  const stack = buildRecoveryOpportunityStack();
  const result = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    tick: 6,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /recovery|logistics|manufacturing|coordination|stabilization|opportunity|operational/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion amplification exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveRecoveryOpportunitySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("leverage-point analysis testing", () => {
  const stack = buildRecoveryOpportunityStack();
  const signals = deriveRecoveryOpportunitySignals({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    pressureState: stack.pressure,
  });
  const stabilization = analyzePredictiveStabilization({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    stabilizationPotentialScore: 0.55,
  });
  assert.ok(stabilization.length > 0);
  const label = classifyRecoveryOpportunityLabel({
    recoveryAccelerationScore: 0.65,
    stabilizationPotentialScore: 0.6,
    fragileZoneCount: 1,
  });
  assert.equal(label, "accelerating");
});

test("integrated recovery opportunity panel contract", () => {
  const stack = buildRecoveryOpportunityStack();
  const result = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.uncertaintyDisclaimer, RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER);
  assert.ok(result.panelContract.signals.length > 0);
});

test("rejects duplicate recovery opportunity build fingerprint", () => {
  const stack = buildRecoveryOpportunityStack();
  const first = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildRecoveryOpportunityContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    cascadeFingerprint: stableStringify({
      label: stack.cascade.predictiveCascadeLabel,
      stabilization: stack.cascade.cascadeStabilizationScore,
    }),
    trajectoryFingerprint: stableStringify({
      label: stack.trajectory.predictiveTrajectoryLabel,
      recovery: stack.trajectory.futureStabilityScore,
    }),
    resilienceFingerprint: stableStringify({
      label: stack.resilience.resilienceStabilityLabel,
      score: stack.resilience.enterpriseResilienceScore,
    }),
    tick: 0,
  });
  const second = evaluateRecoveryOpportunities({
    topology: stack.topology,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
    priorRecoveryOpportunityFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_recovery_opportunity_build");
});
