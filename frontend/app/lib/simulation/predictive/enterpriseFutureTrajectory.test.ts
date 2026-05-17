/**
 * D7:4:1 — Predictive future trajectory intelligence foundation tests.
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
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateFutureTrajectories,
  freezePredictiveTrajectorySnapshot,
} from "./predictiveFutureTrajectoryEngine.ts";
import {
  buildTrajectoryContentFingerprint,
  containsFalseCertaintyText,
  guardEvaluateFutureTrajectories,
  guardTrajectoryExecutiveSemantics,
  UNCERTAINTY_DISCLAIMER,
} from "./trajectoryGuards.ts";
import { buildExecutiveTrajectorySemantics } from "./executiveTrajectorySemantics.ts";
import {
  calculateFutureStabilityScore,
  calculateTrajectoryDivergenceScore,
  deriveFutureTrajectorySignals,
  classifyPredictiveTrajectoryLabel,
} from "./directionalEvolutionModel.ts";
import { analyzeTrajectoryDivergence } from "./trajectoryDivergenceAnalysis.ts";
import { analyzeRecoveryDegradationTrends } from "./recoveryDegradationTrendIntelligence.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-trajectory", objects });
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

function buildTrajectoryStack() {
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

  return {
    topology,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
    recovery: recovery.snapshot.state,
    coordination: coordination.snapshot.state,
    alignment: alignment.snapshot.state,
    pressure: pressure.snapshot.state,
    trust: trust.snapshot.state,
  };
}

test("deterministic trajectory analysis", () => {
  const stack = buildTrajectoryStack();
  const r1 = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    trustState: stack.trust,
    predictiveContext: { horizonStressFactor: 0.15 },
  });
  const r2 = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    trustState: stack.trust,
    predictiveContext: { horizonStressFactor: 0.15 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("directional evolution modeling", () => {
  const stack = buildTrajectoryStack();
  const signals = deriveFutureTrajectorySignals({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    horizonStressFactor: 0.2,
  });
  const stability = calculateFutureStabilityScore({
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    signals,
  });
  assert.ok(signals.length > 0);
  assert.ok(stability >= 0 && stability <= 1);
  for (const signal of signals) {
    assert.ok(signal.directionalConfidence <= 0.92);
  }
});

test("trajectory consistency", () => {
  const stack = buildTrajectoryStack();
  const signals = deriveFutureTrajectorySignals({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    alignmentState: stack.alignment,
  });
  const divergenceScore = calculateTrajectoryDivergenceScore({
    signals,
    momentumState: stack.momentum,
    resilienceState: stack.resilience,
  });
  const d1 = analyzeTrajectoryDivergence({
    signals,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    trustState: stack.trust,
    trajectoryDivergenceScore: divergenceScore,
  });
  const d2 = analyzeTrajectoryDivergence({
    signals,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    trustState: stack.trust,
    trajectoryDivergenceScore: divergenceScore,
  });
  assert.equal(
    d1.map((r) => r.recordId).join("|"),
    d2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen predictive snapshot", () => {
  const stack = buildTrajectoryStack();
  const result = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezePredictiveTrajectorySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { futureStabilityScore: number }).futureStabilityScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed future outcome"));
  const guard = guardEvaluateFutureTrajectories({
    topologyId: "topo",
    regionIds: ["finance"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["finance"],
        trajectoryState: "volatile",
        directionalConfidence: 0.95,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "false_certainty_language");

  const semanticsGuard = guardTrajectoryExecutiveSemantics({
    headline: "The future is certain",
    summary: "Operational movement",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable predictive state preservation", () => {
  const stack = buildTrajectoryStack();
  const frozenMomentum = JSON.stringify(stack.momentum);
  evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.equal(JSON.stringify(stack.momentum), frozenMomentum);
});

test("executive trajectory semantics are readable", () => {
  const stack = buildTrajectoryStack();
  const result = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    recoveryState: stack.recovery,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    tick: 5,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /trajectory|operational|volatility|recovery|stabilization|movement|conditions|degradation|critical/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion prediction exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveTrajectorySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("divergence analysis validation", () => {
  const stack = buildTrajectoryStack();
  const signals = deriveFutureTrajectorySignals({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    alignmentState: stack.alignment,
  });
  const trends = analyzeRecoveryDegradationTrends({
    topology: stack.topology,
    signals,
    momentumState: stack.momentum,
    recoveryState: stack.recovery,
    pressureState: stack.pressure,
    equilibriumState: stack.equilibrium,
  });
  assert.ok(trends.length > 0);
  const label = classifyPredictiveTrajectoryLabel({
    futureStabilityScore: 0.6,
    trajectoryVolatilityScore: 0.3,
    trajectoryDivergenceScore: 0.2,
  });
  assert.equal(label, "stabilizing");
});

test("integrated panel contract", () => {
  const stack = buildTrajectoryStack();
  const result = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    pressureState: stack.pressure,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.uncertaintyDisclaimer, UNCERTAINTY_DISCLAIMER);
  assert.ok(
    ["stabilizing", "recovering", "volatile", "degrading", "critical"].includes(
      result.panelContract.predictiveTrajectoryLabel
    )
  );
});

test("rejects duplicate trajectory build fingerprint", () => {
  const stack = buildTrajectoryStack();
  const first = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildTrajectoryContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    momentumFingerprint: stableStringify({
      trend: stack.momentum.momentumTrendLabel,
      score: stack.momentum.organizationalMomentumScore,
    }),
    equilibriumFingerprint: stableStringify({
      label: stack.equilibrium.equilibriumLabel,
      score: stack.equilibrium.equilibriumScore,
    }),
    resilienceFingerprint: stableStringify({
      label: stack.resilience.resilienceStabilityLabel,
      score: stack.resilience.enterpriseResilienceScore,
    }),
    tick: 0,
  });
  const second = evaluateFutureTrajectories({
    topology: stack.topology,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
    priorTrajectoryFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_trajectory_build");
});
