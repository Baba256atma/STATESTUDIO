/**
 * D7:4:2 — Multi-future divergence intelligence tests.
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
import {
  evaluateFutureDivergence,
  freezeMultiFutureDivergenceSnapshot,
} from "./multiFutureDivergenceEngine.ts";
import {
  buildDivergenceContentFingerprint,
  DIVERGENCE_UNCERTAINTY_DISCLAIMER,
  guardEvaluateFutureDivergence,
  guardDivergenceExecutiveSemantics,
} from "./divergenceGuards.ts";
import { containsFalseCertaintyText } from "./trajectoryGuards.ts";
import { buildExecutiveDivergenceSemantics } from "./executiveDivergenceSemantics.ts";
import {
  deriveFutureBranches,
  deriveFutureDivergenceSignals,
  calculateFutureConvergenceScore,
  classifyMultiFutureDivergenceLabel,
  CANONICAL_FUTURE_BRANCH_IDS,
} from "./futureBranchEvolutionModel.ts";
import { analyzeDivergenceConvergence } from "./divergenceConvergenceAnalysis.ts";
import { analyzeStrategicFutureSeparation } from "./strategicFutureSeparationIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-divergence", objects });
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

function buildDivergenceStack() {
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

  return {
    topology,
    trajectory: trajectory.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
    resilience: resilience.snapshot.state,
    coordination: coordination.snapshot.state,
    alignment: alignment.snapshot.state,
    pressure: pressure.snapshot.state,
    trust: trust.snapshot.state,
    leadership: leadership.snapshot.state,
  };
}

test("deterministic divergence analysis", () => {
  const stack = buildDivergenceStack();
  const r1 = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    trustState: stack.trust,
    leadershipState: stack.leadership,
    divergenceContext: { fragmentationStressFactor: 0.1 },
  });
  const r2 = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    trustState: stack.trust,
    leadershipState: stack.leadership,
    divergenceContext: { fragmentationStressFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("future branch evolution modeling", () => {
  const stack = buildDivergenceStack();
  const branches = deriveFutureBranches({
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    coordinationState: stack.coordination,
    alignmentState: stack.alignment,
    pressureState: stack.pressure,
    trustState: stack.trust,
  });
  const signals = deriveFutureDivergenceSignals({
    branches,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    resilienceState: stack.resilience,
  });
  assert.ok(branches.length >= 3);
  assert.ok(branches.some((b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.stabilization));
  assert.ok(branches.some((b) => b.branchId === CANONICAL_FUTURE_BRANCH_IDS.degradation));
  assert.ok(signals.length > 0);
  for (const signal of signals) {
    assert.ok(signal.divergenceIntensity <= 0.92);
  }
});

test("future consistency validation", () => {
  const stack = buildDivergenceStack();
  const branches = deriveFutureBranches({
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  const signals = deriveFutureDivergenceSignals({
    branches,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    resilienceState: stack.resilience,
  });
  const convergence = calculateFutureConvergenceScore({ branches, signals });
  const c1 = analyzeDivergenceConvergence({
    branches,
    signals,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    leadershipState: stack.leadership,
    futureConvergenceScore: convergence,
    futureFragmentationScore: 0.4,
  });
  const c2 = analyzeDivergenceConvergence({
    branches,
    signals,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    leadershipState: stack.leadership,
    futureConvergenceScore: convergence,
    futureFragmentationScore: 0.4,
  });
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen divergence snapshot", () => {
  const stack = buildDivergenceStack();
  const result = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    pressureState: stack.pressure,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeMultiFutureDivergenceSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { futureVolatilityScore: number }).futureVolatilityScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed future branch"));
  const guard = guardEvaluateFutureDivergence({
    topologyId: "topo",
    knownBranchIds: [CANONICAL_FUTURE_BRANCH_IDS.stabilization],
    signals: [
      {
        signalId: "bad",
        futureBranchIds: ["future-branch::unknown"],
        divergenceState: "volatile_split",
        divergenceIntensity: 0.5,
      },
    ],
    branches: [],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_future_branch");

  const semanticsGuard = guardDivergenceExecutiveSemantics({
    headline: "The future is guaranteed",
    summary: "Branch separation",
  });
  assert.equal(semanticsGuard.ok, false);
});

test("immutable divergence state preservation", () => {
  const stack = buildDivergenceStack();
  const frozenTrajectory = JSON.stringify(stack.trajectory);
  evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
  });
  assert.equal(JSON.stringify(stack.trajectory), frozenTrajectory);
});

test("executive divergence semantics are readable", () => {
  const stack = buildDivergenceStack();
  const result = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    pressureState: stack.pressure,
    alignmentState: stack.alignment,
    tick: 3,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /future|diverge|stabilization|degradation|operational|fragment|converg/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion fragmentation exceeded"));
  assert.equal(result.snapshot.state.uncertaintyDisclaimer, DIVERGENCE_UNCERTAINTY_DISCLAIMER);

  const manual = buildExecutiveDivergenceSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("convergence analysis testing", () => {
  const stack = buildDivergenceStack();
  const branches = deriveFutureBranches({
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    pressureState: stack.pressure,
  });
  const signals = deriveFutureDivergenceSignals({
    branches,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    resilienceState: stack.resilience,
  });
  const separations = analyzeStrategicFutureSeparation({
    topology: stack.topology,
    branches,
    trajectoryState: stack.trajectory,
    pressureState: stack.pressure,
    equilibriumState: stack.equilibrium,
  });
  assert.ok(separations.length > 0);
  const label = classifyMultiFutureDivergenceLabel({
    futureConvergenceScore: 0.65,
    futureFragmentationScore: 0.25,
    futureVolatilityScore: 0.3,
  });
  assert.equal(label, "converging");
});

test("integrated divergence panel contract", () => {
  const stack = buildDivergenceStack();
  const result = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    leadershipState: stack.leadership,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.uncertaintyDisclaimer, DIVERGENCE_UNCERTAINTY_DISCLAIMER);
  assert.ok(result.panelContract.branches.length > 0);
});

test("rejects duplicate divergence build fingerprint", () => {
  const stack = buildDivergenceStack();
  const first = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildDivergenceContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    trajectoryFingerprint: stableStringify({
      label: stack.trajectory.predictiveTrajectoryLabel,
      stability: stack.trajectory.futureStabilityScore,
      divergence: stack.trajectory.trajectoryDivergenceScore,
    }),
    momentumFingerprint: stableStringify({
      trend: stack.momentum.momentumTrendLabel,
      score: stack.momentum.organizationalMomentumScore,
    }),
    resilienceFingerprint: stableStringify({
      label: stack.resilience.resilienceStabilityLabel,
      score: stack.resilience.enterpriseResilienceScore,
    }),
    tick: 0,
  });
  const second = evaluateFutureDivergence({
    topology: stack.topology,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    resilienceState: stack.resilience,
    tick: 0,
    priorDivergenceFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_divergence_build");
});
