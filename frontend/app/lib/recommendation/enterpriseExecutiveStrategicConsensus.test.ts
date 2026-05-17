/**
 * D7:5:9 — Executive strategic consensus intelligence tests.
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
import { evaluateExecutiveTradeoffs } from "./executiveTradeoffAnalysisEngine.ts";
import { evaluateMultiStrategyComparison } from "./executiveMultiStrategyComparisonEngine.ts";
import { evaluateRecommendationLearning } from "./strategicRecommendationMemoryLearningEngine.ts";
import { evaluateStrategicGovernance } from "./executiveStrategicGovernanceEngine.ts";
import { evaluateDecisionExplainability } from "./executiveDecisionExplainabilityEngine.ts";
import { evaluateExecutiveAdvisory } from "./executiveStrategicAdvisoryEngine.ts";
import {
  evaluateStrategicConsensus,
  freezeExecutiveStrategicConsensusSnapshot,
} from "./executiveStrategicConsensusEngine.ts";
import {
  buildConsensusContentFingerprint,
  CONSENSUS_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_DISCLAIMER,
  guardEvaluateStrategicConsensus,
  guardConsensusExecutiveSemantics,
} from "./consensusGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildExecutiveStrategicConsensusSemantics } from "./executiveStrategicConsensusSemantics.ts";
import {
  deriveExecutiveConsensusSignals,
  analyzeExecutiveAlignment,
  calculateStrategicAlignmentScore,
  classifyExecutiveConsensusLabel,
} from "./executiveAlignmentModel.ts";
import { analyzeConsensusFragmentation } from "./consensusFragmentationAnalysis.ts";
import { analyzeStrategicCoherence } from "./strategicCoherenceIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-consensus", objects });
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

function buildConsensusStack() {
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

  const tradeoffs = evaluateExecutiveTradeoffs({
    topology,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
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
  assert.ok(tradeoffs.ok);
  if (!tradeoffs.ok) throw new Error("tradeoffs failed");

  const comparison = evaluateMultiStrategyComparison({
    topology,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
    tradeoffState: tradeoffs.snapshot.state,
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
  assert.ok(comparison.ok);
  if (!comparison.ok) throw new Error("comparison failed");

  const learning = evaluateRecommendationLearning({
    topology,
    comparisonState: comparison.snapshot.state,
    tradeoffState: tradeoffs.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
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
  assert.ok(learning.ok);
  if (!learning.ok) throw new Error("learning failed");

  const governance = evaluateStrategicGovernance({
    topology,
    memoryState: learning.snapshot.state,
    comparisonState: comparison.snapshot.state,
    tradeoffState: tradeoffs.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
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
  assert.ok(governance.ok);
  if (!governance.ok) throw new Error("governance failed");

  const explainability = evaluateDecisionExplainability({
    topology,
    governanceState: governance.snapshot.state,
    memoryState: learning.snapshot.state,
    comparisonState: comparison.snapshot.state,
    tradeoffState: tradeoffs.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
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
  assert.ok(explainability.ok);
  if (!explainability.ok) throw new Error("explainability failed");

  const advisory = evaluateExecutiveAdvisory({
    topology,
    explainabilityState: explainability.snapshot.state,
    governanceState: governance.snapshot.state,
    memoryState: learning.snapshot.state,
    comparisonState: comparison.snapshot.state,
    tradeoffState: tradeoffs.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
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
  assert.ok(advisory.ok);
  if (!advisory.ok) throw new Error("advisory failed");

  return {
    topology,
    recommendations: recommendations.snapshot.state,
    confidence: confidence.snapshot.state,
    tradeoffs: tradeoffs.snapshot.state,
    comparison: comparison.snapshot.state,
    memory: learning.snapshot.state,
    governance: governance.snapshot.state,
    explainability: explainability.snapshot.state,
    advisory: advisory.snapshot.state,
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

function consensusInput(stack: ReturnType<typeof buildConsensusStack>) {
  return {
    topology: stack.topology,
    advisoryState: stack.advisory,
    explainabilityState: stack.explainability,
    governanceState: stack.governance,
    memoryState: stack.memory,
    comparisonState: stack.comparison,
    tradeoffState: stack.tradeoffs,
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

test("deterministic consensus analysis", () => {
  const stack = buildConsensusStack();
  const r1 = evaluateStrategicConsensus({
    ...consensusInput(stack),
    consensusContext: { consensusLeverageFactor: 0.1 },
  });
  const r2 = evaluateStrategicConsensus({
    ...consensusInput(stack),
    consensusContext: { consensusLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("executive-alignment modeling", () => {
  const stack = buildConsensusStack();
  const signals = deriveExecutiveConsensusSignals({
    advisoryState: stack.advisory,
    comparisonState: stack.comparison,
    governanceState: stack.governance,
    memoryState: stack.memory,
    recommendationState: stack.recommendations,
    confidenceState: stack.confidence,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    consensusLeverageFactor: 0.1,
  });
  const alignment = analyzeExecutiveAlignment({
    consensusSignals: signals,
    advisoryState: stack.advisory,
    comparisonState: stack.comparison,
    governanceState: stack.governance,
    adaptationState: stack.adaptation,
    resilienceState: stack.resilience,
    recoveryOpportunityState: stack.recoveryOpportunity,
  });
  const alignmentScore = calculateStrategicAlignmentScore({
    consensusSignals: signals,
    advisoryState: stack.advisory,
    comparisonState: stack.comparison,
  });
  assert.ok(signals.length > 0);
  assert.ok(alignment.length > 0);
  assert.ok(alignmentScore >= 0 && alignmentScore <= 1);
  for (const c of signals) {
    assert.ok(c.consensusStrength <= 0.92);
  }
});

test("fragmentation-analysis consistency validation", () => {
  const stack = buildConsensusStack();
  const signals = deriveExecutiveConsensusSignals({
    advisoryState: stack.advisory,
    comparisonState: stack.comparison,
    governanceState: stack.governance,
    memoryState: stack.memory,
    recommendationState: stack.recommendations,
    confidenceState: stack.confidence,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const f1 = analyzeConsensusFragmentation({
    consensusSignals: signals,
    comparisonState: stack.comparison,
    governanceState: stack.governance,
    advisoryState: stack.advisory,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const f2 = analyzeConsensusFragmentation({
    consensusSignals: signals,
    comparisonState: stack.comparison,
    governanceState: stack.governance,
    advisoryState: stack.advisory,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const c1 = analyzeStrategicCoherence({
    consensusSignals: signals,
    alignmentRecords: analyzeExecutiveAlignment({
      consensusSignals: signals,
      advisoryState: stack.advisory,
      comparisonState: stack.comparison,
      governanceState: stack.governance,
      adaptationState: stack.adaptation,
      resilienceState: stack.resilience,
      recoveryOpportunityState: stack.recoveryOpportunity,
    }),
    fragmentationRecords: f1,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  const c2 = analyzeStrategicCoherence({
    consensusSignals: signals,
    alignmentRecords: analyzeExecutiveAlignment({
      consensusSignals: signals,
      advisoryState: stack.advisory,
      comparisonState: stack.comparison,
      governanceState: stack.governance,
      adaptationState: stack.adaptation,
      resilienceState: stack.resilience,
      recoveryOpportunityState: stack.recoveryOpportunity,
    }),
    fragmentationRecords: f2,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  assert.equal(
    f1.map((r) => r.recordId).join("|"),
    f2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("strategic-coherence testing", () => {
  const stack = buildConsensusStack();
  const result = evaluateStrategicConsensus(consensusInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.state.strategicCoherenceRecords.length >= 6);
  assert.ok(result.snapshot.state.executiveAlignmentRecords.length > 0);
});

test("replay-safe consensus snapshots", () => {
  const stack = buildConsensusStack();
  const result = evaluateStrategicConsensus(consensusInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeExecutiveStrategicConsensusSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicAlignmentScore: number }).strategicAlignmentScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed consensus outcome"));
  const guard = guardEvaluateStrategicConsensus({
    topologyId: "topo",
    regionIds: ["finance"],
    consensusSignals: [
      {
        consensusId: "consensus::bad",
        affectedRegionIds: ["unknown"],
        consensusState: "emerging",
        consensusStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_consensus_region");

  const semanticsGuard = guardConsensusExecutiveSemantics({
    headline: "Manipulative alignment engineering will force alignment",
    summary: "Consensus review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "manipulative_alignment_detected");
});

test("immutable consensus state preservation", () => {
  const stack = buildConsensusStack();
  const frozenAdvisory = JSON.stringify(stack.advisory);
  evaluateStrategicConsensus(consensusInput(stack));
  assert.equal(JSON.stringify(stack.advisory), frozenAdvisory);
});

test("executive-readable consensus semantics", () => {
  const stack = buildConsensusStack();
  const result = evaluateStrategicConsensus({ ...consensusInput(stack), tick: 8 });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|restructuring|dependency|fragility|volatility|consensus|alignment|fragmentation|stabilization/i
  );
  assert.ok(
    !result.snapshot.semantics.headline.includes("Consensus recursion synchronization exceeded")
  );
  assert.equal(result.snapshot.state.consensusAmbiguityDisclaimer, CONSENSUS_AMBIGUITY_DISCLAIMER);
  assert.equal(result.snapshot.state.nonManipulationDisclaimer, NON_MANIPULATION_DISCLAIMER);

  const manual = buildExecutiveStrategicConsensusSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated consensus panel contract", () => {
  const stack = buildConsensusStack();
  const result = evaluateStrategicConsensus(consensusInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.consensusAmbiguityDisclaimer, CONSENSUS_AMBIGUITY_DISCLAIMER);
  assert.equal(result.panelContract.nonManipulationDisclaimer, NON_MANIPULATION_DISCLAIMER);
  assert.ok(result.panelContract.consensusSignals.length > 0);
});

test("rejects duplicate consensus build fingerprint", () => {
  const stack = buildConsensusStack();
  const first = evaluateStrategicConsensus({ ...consensusInput(stack), tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildConsensusContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    advisoryFingerprint: stableStringify({
      label: stack.advisory.executiveAdvisoryLabel,
      clarity: stack.advisory.advisoryClarityScore,
    }),
    explainabilityFingerprint: stableStringify({
      label: stack.explainability.executiveExplainabilityLabel,
      clarity: stack.explainability.explanationClarityScore,
    }),
    governanceFingerprint: stableStringify({
      label: stack.governance.executiveGovernanceLabel,
      stability: stack.governance.governanceStabilityScore,
    }),
    memoryFingerprint: stableStringify({
      label: stack.memory.executiveLearningLabel,
      clarity: stack.memory.learningStabilityScore,
    }),
    comparisonFingerprint: stableStringify({
      label: stack.comparison.executiveComparisonLabel,
      stability: stack.comparison.comparisonStabilityScore,
    }),
    recommendationFingerprint: stableStringify({
      label: stack.recommendations.strategicRecommendationLabel,
      count: stack.recommendations.activeRecommendations.length,
    }),
    confidenceFingerprint: stableStringify({
      label: stack.confidence.recommendationConfidenceLabel,
      overall: stack.confidence.overallConfidenceScore,
    }),
    tick: 0,
  });
  const second = evaluateStrategicConsensus({
    ...consensusInput(stack),
    tick: 0,
    priorConsensusFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_consensus_build");
});

test("consensus alignment classification", () => {
  const label = classifyExecutiveConsensusLabel({
    consensusSignals: [
      {
        consensusId: "c1",
        affectedRegionIds: ["logistics"],
        consensusState: "aligned",
        consensusStrength: 0.6,
      },
    ],
    strategicAlignmentScore: 0.7,
    executiveCoherenceScore: 0.55,
    fragmentationEscalationScore: 0.3,
  });
  assert.equal(label, "aligned");
});
