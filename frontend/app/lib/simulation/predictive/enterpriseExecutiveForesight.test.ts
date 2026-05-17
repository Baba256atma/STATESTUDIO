/**
 * D7:4:8 — Predictive executive foresight intelligence tests.
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
import { evaluateStrategicAdaptation } from "./predictiveStrategicAdaptationEngine.ts";
import {
  evaluateExecutiveForesight,
  freezePredictiveExecutiveForesightSnapshot,
} from "./predictiveExecutiveForesightEngine.ts";
import {
  buildForesightContentFingerprint,
  FORESIGHT_UNCERTAINTY_DISCLAIMER,
  guardEvaluateExecutiveForesight,
  guardForesightExecutiveSemantics,
} from "./foresightGuards.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { buildExecutiveForesightSemantics } from "./executiveForesightSemantics.ts";
import {
  deriveExecutiveForesightSignals,
  calculateStrategicPreparednessScore,
  classifyPredictiveForesightLabel,
} from "./emergingPatternModel.ts";
import { analyzeLongHorizonForesight } from "./longHorizonForesightAnalysis.ts";
import { analyzeExecutivePreparationGaps } from "./predictiveExecutivePreparationIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-foresight", objects });
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

function buildForesightStack() {
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

  return {
    topology,
    trajectory: trajectory.snapshot.state,
    divergence: divergence.snapshot.state,
    cascade: cascade.snapshot.state,
    prevention: prevention.snapshot.state,
    recoveryOpportunity: recoveryOpportunity.snapshot.state,
    adaptation: adaptation.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
  };
}

test("deterministic foresight analysis", () => {
  const stack = buildForesightStack();
  const r1 = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    foresightContext: { foresightAmplificationFactor: 0.1 },
  });
  const r2 = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    foresightContext: { foresightAmplificationFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("emerging-pattern modeling", () => {
  const stack = buildForesightStack();
  const signals = deriveExecutiveForesightSignals({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const preparedness = calculateStrategicPreparednessScore({
    signals,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
  });
  assert.ok(signals.length > 0);
  assert.ok(preparedness >= 0 && preparedness <= 1);
  for (const signal of signals) {
    assert.ok(signal.foresightStrength <= 0.92);
  }
});

test("long-horizon analysis testing", () => {
  const stack = buildForesightStack();
  const signals = deriveExecutiveForesightSignals({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const h1 = analyzeLongHorizonForesight({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    preventionState: stack.prevention,
    adaptationState: stack.adaptation,
  });
  const h2 = analyzeLongHorizonForesight({
    topology: stack.topology,
    signals,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    preventionState: stack.prevention,
    adaptationState: stack.adaptation,
  });
  assert.equal(
    h1.map((r) => r.recordId).join("|"),
    h2.map((r) => r.recordId).join("|")
  );
});

test("preparedness consistency validation", () => {
  const stack = buildForesightStack();
  const signals = deriveExecutiveForesightSignals({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const g1 = analyzeExecutivePreparationGaps({
    topology: stack.topology,
    signals,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  const g2 = analyzeExecutivePreparationGaps({
    topology: stack.topology,
    signals,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  assert.equal(
    g1.map((r) => r.recordId).join("|"),
    g2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe foresight snapshots", () => {
  const stack = buildForesightStack();
  const result = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezePredictiveExecutiveForesightSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicPreparednessScore: number }).strategicPreparednessScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed foresight outcome"));
  const guard = guardEvaluateExecutiveForesight({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["unknown"],
        foresightState: "emerging",
        foresightStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_foresight_region");

  const semanticsGuard = guardForesightExecutiveSemantics({
    headline: "Foresight is guaranteed",
    summary: "Long horizon",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable foresight state preservation", () => {
  const stack = buildForesightStack();
  const frozenPrevention = JSON.stringify(stack.prevention);
  evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  assert.equal(JSON.stringify(stack.prevention), frozenPrevention);
});

test("executive-readable foresight semantics", () => {
  const stack = buildForesightStack();
  const result = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /foresight|logistics|coordination|operational|fragility|stabilization|executive|preparation/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Foresight recursion prediction exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, FORESIGHT_UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveForesightSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated foresight panel contract", () => {
  const stack = buildForesightStack();
  const result = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.uncertaintyDisclaimer, FORESIGHT_UNCERTAINTY_DISCLAIMER);
  assert.ok(result.panelContract.signals.length > 0);
});

test("rejects duplicate foresight build fingerprint", () => {
  const stack = buildForesightStack();
  const first = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildForesightContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    adaptationFingerprint: stableStringify({
      label: stack.adaptation.predictiveAdaptationLabel,
      adaptive: stack.adaptation.adaptiveResilienceScore,
    }),
    preventionFingerprint: stableStringify({
      label: stack.prevention.predictivePreventionLabel,
      interruption: stack.prevention.collapseInterruptionScore,
    }),
    divergenceFingerprint: stableStringify({
      fragmentation: stack.divergence.futureFragmentationScore,
      label: stack.divergence.multiFutureDivergenceLabel,
    }),
    tick: 0,
  });
  const second = evaluateExecutiveForesight({
    topology: stack.topology,
    adaptationState: stack.adaptation,
    preventionState: stack.prevention,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    tick: 0,
    priorForesightFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_foresight_build");
});

test("predictive foresight label classification", () => {
  const label = classifyPredictiveForesightLabel({
    strategicPreparednessScore: 0.65,
    longHorizonRiskScore: 0.2,
    futureReadinessScore: 0.6,
  });
  assert.equal(label, "stabilizing");
});
