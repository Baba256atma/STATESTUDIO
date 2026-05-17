/**
 * D7:5:3 — Executive tradeoff analysis intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../simulation/topology/operationalUniverseTopologyEngine.ts";
import { calculateOrganizationalFlows } from "../simulation/flow/organizationalFlowDynamicsEngine.ts";
import { evaluateDependencyPressure } from "../simulation/pressure/enterpriseDependencyPressureEngine.ts";
import { mapOperationalFragility } from "../simulation/fragility/operationalFragilityConcentrationEngine.ts";
import { evaluateRecoveryCapacity } from "../simulation/recovery/organizationalRecoveryCapacityEngine.ts";
import { evaluateOperationalMomentum } from "../simulation/momentum/enterpriseOperationalMomentumEngine.ts";
import { evaluateOperationalEquilibrium } from "../simulation/equilibrium/strategicOperationalEquilibriumEngine.ts";
import { evaluateHumanActorParticipation } from "../simulation/actors/strategicHumanActorFoundationEngine.ts";
import { evaluateExecutiveCoordination } from "../simulation/coordination/executiveCoordinationDynamicsEngine.ts";
import { evaluateDecisionFriction } from "../simulation/friction/organizationalDecisionFrictionEngine.ts";
import { evaluateStakeholderInfluence } from "../simulation/influence/stakeholderInfluencePropagationEngine.ts";
import { evaluateOrganizationalTrust } from "../simulation/trust/organizationalTrustStabilityEngine.ts";
import { evaluateLeadershipDynamics } from "../simulation/leadership/strategicLeadershipLoadDynamicsEngine.ts";
import { evaluateOrganizationalAlignment } from "../simulation/alignment/organizationalAlignmentDriftEngine.ts";
import { evaluateHumanSystemResilience } from "../simulation/resilience/enterpriseHumanSystemResilienceEngine.ts";
import { evaluateFutureTrajectories } from "../simulation/predictive/predictiveFutureTrajectoryEngine.ts";
import { evaluateFutureDivergence } from "../simulation/predictive/multiFutureDivergenceEngine.ts";
import { evaluatePredictiveCascades } from "../simulation/predictive/predictiveCascadingConsequenceEngine.ts";
import { evaluateRecoveryOpportunities } from "../simulation/predictive/predictiveRecoveryOpportunityEngine.ts";
import { evaluateCollapsePrevention } from "../simulation/predictive/predictiveSystemicCollapsePreventionEngine.ts";
import { evaluateStrategicAdaptation } from "../simulation/predictive/predictiveStrategicAdaptationEngine.ts";
import { evaluateExecutiveForesight } from "../simulation/predictive/predictiveExecutiveForesightEngine.ts";
import { generateStrategicRecommendations } from "./autonomousStrategicRecommendationEngine.ts";
import { evaluateRecommendationConfidence } from "./strategicRecommendationConfidenceEngine.ts";
import {
  evaluateExecutiveTradeoffs,
  freezeExecutiveTradeoffSnapshot,
} from "./executiveTradeoffAnalysisEngine.ts";
import {
  buildTradeoffContentFingerprint,
  TRADEOFF_UNCERTAINTY_DISCLAIMER,
  NON_SELECTION_DISCLAIMER,
  guardEvaluateExecutiveTradeoffs,
  guardTradeoffExecutiveSemantics,
} from "./tradeoffGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildExecutiveTradeoffSemantics } from "./executiveTradeoffSemantics.ts";
import {
  deriveStrategicTradeoffSignals,
  calculateStrategicBalanceScore,
  analyzeStrategicCostBenefit,
  classifyExecutiveTradeoffLabel,
} from "./strategicCostBenefitModel.ts";
import { analyzeCompetingObjectives } from "./competingObjectiveAnalysis.ts";
import type { SceneJson } from "../sceneTypes.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-tradeoff", objects });
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

function buildTradeoffStack() {
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

  const adaptation = evaluateStrategicAdaptation({
    topology,
    preventionState: prevention.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
    resilienceState: resilience.snapshot.state,
    recoveryState: recovery.snapshot.state,
    coordinationState: coordination.snapshot.state,
    alignmentState: alignment.snapshot.state,
    leadershipState: leadership.snapshot.state,
    pressureState: pressure.snapshot.state,
    trustState: trust.snapshot.state,
  });
  assert.ok(adaptation.ok);
  if (!adaptation.ok) throw new Error("adaptation failed");

  const foresight = evaluateExecutiveForesight({
    topology,
    adaptationState: adaptation.snapshot.state,
    preventionState: prevention.snapshot.state,
    divergenceState: divergence.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(foresight.ok);
  if (!foresight.ok) throw new Error("foresight failed");

  const recommendations = generateStrategicRecommendations({
    topology,
    foresightState: foresight.snapshot.state,
    adaptationState: adaptation.snapshot.state,
    preventionState: prevention.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    cascadeState: cascade.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(recommendations.ok);
  if (!recommendations.ok) throw new Error("recommendations failed");

  const confidence = evaluateRecommendationConfidence({
    topology,
    recommendationState: recommendations.snapshot.state,
    foresightState: foresight.snapshot.state,
    adaptationState: adaptation.snapshot.state,
    preventionState: prevention.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    cascadeState: cascade.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(confidence.ok);
  if (!confidence.ok) throw new Error("confidence failed");

  return {
    topology,
    recommendations: recommendations.snapshot.state,
    confidence: confidence.snapshot.state,
    foresight: foresight.snapshot.state,
    adaptation: adaptation.snapshot.state,
    prevention: prevention.snapshot.state,
    recoveryOpportunity: recoveryOpportunity.snapshot.state,
    cascade: cascade.snapshot.state,
    trajectory: trajectory.snapshot.state,
    divergence: divergence.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
  };
}

function tradeoffInput(stack: ReturnType<typeof buildTradeoffStack>) {
  return {
    topology: stack.topology,
    recommendationState: stack.recommendations,
    confidenceState: stack.confidence,
    foresightState: stack.foresight,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    cascadeState: stack.cascade,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  };
}

test("deterministic tradeoff analysis", () => {
  const stack = buildTradeoffStack();
  const r1 = evaluateExecutiveTradeoffs({
    ...tradeoffInput(stack),
    tradeoffContext: { tradeoffLeverageFactor: 0.1 },
  });
  const r2 = evaluateExecutiveTradeoffs({
    ...tradeoffInput(stack),
    tradeoffContext: { tradeoffLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("cost/benefit modeling", () => {
  const stack = buildTradeoffStack();
  const tradeoffs = deriveStrategicTradeoffSignals(tradeoffInput(stack));
  const costBenefit = analyzeStrategicCostBenefit({
    topology: stack.topology,
    tradeoffs,
    recommendationState: stack.recommendations,
    adaptationState: stack.adaptation,
    recoveryOpportunityState: stack.recoveryOpportunity,
    preventionState: stack.prevention,
  });
  const balance = calculateStrategicBalanceScore({ tradeoffs, costBenefitRecords: costBenefit });
  assert.ok(tradeoffs.length > 0);
  assert.ok(costBenefit.length > 0);
  assert.ok(balance >= 0 && balance <= 1);
  for (const t of tradeoffs) {
    assert.ok(t.tradeoffStrength <= 0.92);
  }
});

test("competing-objective consistency validation", () => {
  const stack = buildTradeoffStack();
  const tradeoffs = deriveStrategicTradeoffSignals(tradeoffInput(stack));
  const o1 = analyzeCompetingObjectives({
    tradeoffs,
    adaptationState: stack.adaptation,
    recoveryOpportunityState: stack.recoveryOpportunity,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const o2 = analyzeCompetingObjectives({
    tradeoffs,
    adaptationState: stack.adaptation,
    recoveryOpportunityState: stack.recoveryOpportunity,
    divergenceState: stack.divergence,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  assert.equal(
    o1.map((r) => r.recordId).join("|"),
    o2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe tradeoff snapshots", () => {
  const stack = buildTradeoffStack();
  const result = evaluateExecutiveTradeoffs(tradeoffInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeExecutiveTradeoffSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicBalanceScore: number }).strategicBalanceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed tradeoff outcome"));
  const guard = guardEvaluateExecutiveTradeoffs({
    topologyId: "topo",
    regionIds: ["finance"],
    tradeoffs: [
      {
        tradeoffId: "bad",
        affectedRegionIds: ["unknown"],
        tradeoffState: "balanced",
        tradeoffStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_tradeoff_region");

  const semanticsGuard = guardTradeoffExecutiveSemantics({
    headline: "Automatically choose the best strategy",
    summary: "Tradeoff balance",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "autonomous_strategy_selection");
});

test("immutable tradeoff state preservation", () => {
  const stack = buildTradeoffStack();
  const frozenRecs = JSON.stringify(stack.recommendations);
  evaluateExecutiveTradeoffs(tradeoffInput(stack));
  assert.equal(JSON.stringify(stack.recommendations), frozenRecs);
});

test("executive-readable tradeoff semantics", () => {
  const stack = buildTradeoffStack();
  const result = evaluateExecutiveTradeoffs({ ...tradeoffInput(stack), tick: 8 });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /tradeoff|logistics|recovery|dependency|fragility|coordination|leadership|restructuring|operational/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Tradeoff recursion optimization exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, TRADEOFF_UNCERTAINTY_DISCLAIMER);
  assert.equal(result.snapshot.state.nonSelectionDisclaimer, NON_SELECTION_DISCLAIMER);

  const manual = buildExecutiveTradeoffSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated tradeoff panel contract", () => {
  const stack = buildTradeoffStack();
  const result = evaluateExecutiveTradeoffs(tradeoffInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.uncertaintyDisclaimer, TRADEOFF_UNCERTAINTY_DISCLAIMER);
  assert.equal(result.panelContract.nonSelectionDisclaimer, NON_SELECTION_DISCLAIMER);
  assert.ok(result.panelContract.tradeoffs.length > 0);
});

test("rejects duplicate tradeoff build fingerprint", () => {
  const stack = buildTradeoffStack();
  const first = evaluateExecutiveTradeoffs({ ...tradeoffInput(stack), tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildTradeoffContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    recommendationFingerprint: stableStringify({
      label: stack.recommendations.strategicRecommendationLabel,
      count: stack.recommendations.activeRecommendations.length,
    }),
    confidenceFingerprint: stableStringify({
      label: stack.confidence.recommendationConfidenceLabel,
      overall: stack.confidence.overallConfidenceScore,
    }),
    foresightFingerprint: stableStringify({
      label: stack.foresight.predictiveForesightLabel,
      preparedness: stack.foresight.strategicPreparednessScore,
    }),
    tick: 0,
  });
  const second = evaluateExecutiveTradeoffs({
    ...tradeoffInput(stack),
    tick: 0,
    priorTradeoffFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_tradeoff_build");
});

test("strategic-balance testing", () => {
  const label = classifyExecutiveTradeoffLabel({
    strategicBalanceScore: 0.65,
    operationalCostScore: 0.2,
    benefitAsymmetryScore: 0.45,
  });
  assert.equal(label, "favorable");
});
