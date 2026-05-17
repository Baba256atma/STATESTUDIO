/**
 * D7:4:7 — Predictive strategic adaptation intelligence tests.
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
import { evaluateCollapsePrevention } from "./predictiveSystemicCollapsePreventionEngine.ts";
import {
  evaluateStrategicAdaptation,
  freezePredictiveStrategicAdaptationSnapshot,
} from "./predictiveStrategicAdaptationEngine.ts";
import {
  buildAdaptationContentFingerprint,
  ADAPTATION_UNCERTAINTY_DISCLAIMER,
  guardEvaluateStrategicAdaptation,
  guardAdaptationExecutiveSemantics,
} from "./adaptationGuards.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { buildExecutiveStrategicAdaptationSemantics } from "./executiveStrategicAdaptationSemantics.ts";
import {
  deriveStrategicAdaptationSignals,
  calculateAdaptiveResilienceScore,
  classifyPredictiveAdaptationLabel,
} from "./adaptiveTransformationModel.ts";
import { analyzeResilienceFlexibility } from "./resilienceFlexibilityAnalysis.ts";
import { analyzePredictiveAdaptationPathways } from "./predictiveAdaptationPathwayIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-adaptation", objects });
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

function buildAdaptationStack() {
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

  const prevention = evaluateCollapsePrevention({
    topology,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
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
  assert.ok(prevention.ok);
  if (!prevention.ok) throw new Error("prevention failed");

  return {
    topology,
    trajectory: trajectory.snapshot.state,
    divergence: divergence.snapshot.state,
    prevention: prevention.snapshot.state,
    recoveryOpportunity: recoveryOpportunity.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
    recovery: recovery.snapshot.state,
    coordination: coordination.snapshot.state,
    alignment: alignment.snapshot.state,
    leadership: leadership.snapshot.state,
    pressure: pressure.snapshot.state,
    trust: trust.snapshot.state,
  };
}

test("deterministic adaptation analysis", () => {
  const stack = buildAdaptationStack();
  const r1 = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    leadershipState: stack.leadership,
    pressureState: stack.pressure,
    trustState: stack.trust,
    adaptationContext: { adaptationLeverageFactor: 0.1 },
  });
  const r2 = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    leadershipState: stack.leadership,
    pressureState: stack.pressure,
    trustState: stack.trust,
    adaptationContext: { adaptationLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("adaptive transformation modeling", () => {
  const stack = buildAdaptationStack();
  const signals = deriveStrategicAdaptationSignals({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    leadershipState: stack.leadership,
    pressureState: stack.pressure,
    trustState: stack.trust,
  });
  const adaptiveResilience = calculateAdaptiveResilienceScore({
    signals,
    resilienceState: stack.resilience,
    recoveryOpportunityState: stack.recoveryOpportunity,
  });
  assert.ok(signals.length > 0);
  assert.ok(adaptiveResilience >= 0 && adaptiveResilience <= 1);
  for (const signal of signals) {
    assert.ok(signal.adaptationStrength <= 0.92);
  }
});

test("flexibility consistency validation", () => {
  const stack = buildAdaptationStack();
  const signals = deriveStrategicAdaptationSignals({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const f1 = analyzeResilienceFlexibility({ topology: stack.topology, signals });
  const f2 = analyzeResilienceFlexibility({ topology: stack.topology, signals });
  assert.equal(
    f1.map((r) => r.recordId).join("|"),
    f2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen adaptation snapshot", () => {
  const stack = buildAdaptationStack();
  const result = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezePredictiveStrategicAdaptationSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { adaptiveResilienceScore: number }).adaptiveResilienceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed adaptation outcome"));
  const guard = guardEvaluateStrategicAdaptation({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown"],
        adaptationState: "emerging",
        adaptationStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_adaptation_region");

  const semanticsGuard = guardAdaptationExecutiveSemantics({
    headline: "Adaptation is guaranteed",
    summary: "Flexibility shift",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable adaptation state preservation", () => {
  const stack = buildAdaptationStack();
  const frozenPrevention = JSON.stringify(stack.prevention);
  evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.equal(JSON.stringify(stack.prevention), frozenPrevention);
});

test("executive adaptation semantics are readable", () => {
  const stack = buildAdaptationStack();
  const result = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    pressureState: stack.pressure,
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /adaptation|coordination|logistics|manufacturing|flexibility|operational|recovery|strategic/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion instability exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, ADAPTATION_UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveStrategicAdaptationSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("adaptation pathway testing", () => {
  const stack = buildAdaptationStack();
  const signals = deriveStrategicAdaptationSignals({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    pressureState: stack.pressure,
  });
  const pathways = analyzePredictiveAdaptationPathways({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    adaptiveResilienceScore: 0.55,
  });
  assert.ok(pathways.length > 0);
  const label = classifyPredictiveAdaptationLabel({
    adaptiveResilienceScore: 0.65,
    strategicFlexibilityScore: 0.6,
    adaptationFragilityScore: 0.25,
  });
  assert.equal(label, "flexible");
});

test("integrated adaptation panel contract", () => {
  const stack = buildAdaptationStack();
  const result = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
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
  assert.equal(result.panelContract.uncertaintyDisclaimer, ADAPTATION_UNCERTAINTY_DISCLAIMER);
  assert.ok(result.panelContract.signals.length > 0);
});

test("rejects duplicate adaptation build fingerprint", () => {
  const stack = buildAdaptationStack();
  const first = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
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
  const fp = buildAdaptationContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    preventionFingerprint: stableStringify({
      label: stack.prevention.predictivePreventionLabel,
      interruption: stack.prevention.collapseInterruptionScore,
    }),
    recoveryOpportunityFingerprint: stableStringify({
      label: stack.recoveryOpportunity.recoveryOpportunityLabel,
      acceleration: stack.recoveryOpportunity.recoveryAccelerationScore,
    }),
    resilienceFingerprint: stableStringify({
      label: stack.resilience.resilienceStabilityLabel,
      adaptation: stack.resilience.humanSystemAdaptationLevel,
    }),
    tick: 0,
  });
  const second = evaluateStrategicAdaptation({
    topology: stack.topology,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
    priorAdaptationFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_adaptation_build");
});
