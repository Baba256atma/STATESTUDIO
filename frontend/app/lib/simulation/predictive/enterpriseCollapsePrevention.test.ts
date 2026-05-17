/**
 * D7:4:6 — Predictive systemic collapse prevention intelligence tests.
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
import { evaluateRecoveryOpportunities } from "./predictiveRecoveryOpportunityEngine.ts";
import {
  evaluateCollapsePrevention,
  freezePredictiveCollapsePreventionSnapshot,
} from "./predictiveSystemicCollapsePreventionEngine.ts";
import {
  buildPreventionContentFingerprint,
  PREVENTION_UNCERTAINTY_DISCLAIMER,
  guardEvaluateCollapsePrevention,
  guardPreventionExecutiveSemantics,
} from "./preventionGuards.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { buildExecutiveCollapsePreventionSemantics } from "./executiveCollapsePreventionSemantics.ts";
import {
  deriveCollapsePreventionSignals,
  calculateCollapseInterruptionScore,
  resolvePreventionInflection,
  classifyPredictivePreventionLabel,
} from "./criticalThresholdPreventionModel.ts";
import { analyzeStabilizationInterruption } from "./stabilizationInterruptionAnalysis.ts";
import { analyzeResiliencePreservation } from "./predictiveResiliencePreservationIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-prevention", objects });
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

function buildPreventionStack() {
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

  const recoveryOpportunity = evaluateRecoveryOpportunities({
    topology,
    cascadeState: cascade.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    resilienceState: resilience.snapshot.state,
    recoveryState: recovery.snapshot.state,
    coordinationState: coordination.snapshot.state,
    pressureState: pressure.snapshot.state,
    trustState: trust.snapshot.state,
  });
  assert.ok(recoveryOpportunity.ok);
  if (!recoveryOpportunity.ok) throw new Error("recovery opportunity failed");

  return {
    topology,
    trajectory: trajectory.snapshot.state,
    divergence: divergence.snapshot.state,
    cascade: cascade.snapshot.state,
    recoveryOpportunity: recoveryOpportunity.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
    recovery: recovery.snapshot.state,
    coordination: coordination.snapshot.state,
    pressure: pressure.snapshot.state,
    trust: trust.snapshot.state,
  };
}

test("deterministic prevention analysis", () => {
  const stack = buildPreventionStack();
  const r1 = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
    preventionContext: { preventionLeverageFactor: 0.1 },
  });
  const r2 = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
    preventionContext: { preventionLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("critical-threshold prevention modeling", () => {
  const stack = buildPreventionStack();
  const inflection = resolvePreventionInflection({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const signals = deriveCollapsePreventionSignals({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    inflection,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    trustState: stack.trust,
  });
  const interruption = calculateCollapseInterruptionScore({
    signals,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
  });
  assert.ok(signals.length > 0);
  assert.ok(interruption >= 0 && interruption <= 1);
  for (const signal of signals) {
    assert.ok(signal.preventionStrength <= 0.92);
  }
});

test("stabilization consistency validation", () => {
  const stack = buildPreventionStack();
  const inflection = resolvePreventionInflection({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const signals = deriveCollapsePreventionSignals({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    inflection,
  });
  const i1 = analyzeStabilizationInterruption({
    signals,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    collapseInterruptionScore: 0.5,
  });
  const i2 = analyzeStabilizationInterruption({
    signals,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    collapseInterruptionScore: 0.5,
  });
  assert.equal(
    i1.map((r) => r.recordId).join("|"),
    i2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen prevention snapshot", () => {
  const stack = buildPreventionStack();
  const result = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezePredictiveCollapsePreventionSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { collapseInterruptionScore: number }).collapseInterruptionScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed collapse prevention"));
  const guard = guardEvaluateCollapsePrevention({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown"],
        preventionState: "monitoring",
        preventionStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_prevention_region");

  const semanticsGuard = guardPreventionExecutiveSemantics({
    headline: "Collapse is guaranteed to be prevented",
    summary: "Prevention window",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable prevention state preservation", () => {
  const stack = buildPreventionStack();
  const frozenCascade = JSON.stringify(stack.cascade);
  evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.equal(JSON.stringify(stack.cascade), frozenCascade);
});

test("executive prevention semantics are readable", () => {
  const stack = buildPreventionStack();
  const result = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    tick: 7,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /prevention|logistics|manufacturing|stabilization|collapse|fragility|coordination|operational/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion prevention exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, PREVENTION_UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveCollapsePreventionSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("intervention opportunity testing", () => {
  const stack = buildPreventionStack();
  const inflection = resolvePreventionInflection({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const signals = deriveCollapsePreventionSignals({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    inflection,
  });
  const preservation = analyzeResiliencePreservation({
    topology: stack.topology,
    signals,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resiliencePreservationScore: 0.55,
  });
  assert.ok(preservation.length > 0);
  const label = classifyPredictivePreventionLabel({
    collapseInterruptionScore: 0.65,
    criticalThresholdProximityScore: 0.3,
    resiliencePreservationScore: 0.6,
  });
  assert.equal(label, "intervenable");
});

test("integrated prevention panel contract", () => {
  const stack = buildPreventionStack();
  const result = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
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
  assert.equal(result.panelContract.uncertaintyDisclaimer, PREVENTION_UNCERTAINTY_DISCLAIMER);
  assert.ok(result.panelContract.signals.length > 0);
});

test("rejects duplicate prevention build fingerprint", () => {
  const stack = buildPreventionStack();
  const first = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const inflection = resolvePreventionInflection({
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
  });
  const fp = buildPreventionContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    cascadeFingerprint: stableStringify({
      label: stack.cascade.predictiveCascadeLabel,
      amplification: stack.cascade.cascadeAmplificationScore,
    }),
    recoveryOpportunityFingerprint: stableStringify({
      label: stack.recoveryOpportunity.recoveryOpportunityLabel,
      stabilization: stack.recoveryOpportunity.stabilizationPotentialScore,
    }),
    inflectionFingerprint: stableStringify({
      label: inflection.strategicInflectionLabel,
      pressure: inflection.inflectionPressureScore,
    }),
    tick: 0,
  });
  const second = evaluateCollapsePrevention({
    topology: stack.topology,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
    priorPreventionFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_prevention_build");
});
