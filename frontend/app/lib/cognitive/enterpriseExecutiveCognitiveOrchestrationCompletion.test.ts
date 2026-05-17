/**
 * D7:6:10 — Executive cognitive orchestration completion tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../simulation/topology/operationalUniverseTopologyEngine.ts";
import { evaluateStrategicConsensus } from "../recommendation/executiveStrategicConsensusEngine.ts";
import { evaluateUnifiedExecutiveOrchestration } from "../orchestration/unifiedExecutiveStrategicOrchestrationEngine.ts";
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
import { generateStrategicRecommendations } from "../recommendation/autonomousStrategicRecommendationEngine.ts";
import { evaluateRecommendationConfidence } from "../recommendation/strategicRecommendationConfidenceEngine.ts";
import { evaluateExecutiveTradeoffs } from "../recommendation/executiveTradeoffAnalysisEngine.ts";
import { evaluateMultiStrategyComparison } from "../recommendation/executiveMultiStrategyComparisonEngine.ts";
import { evaluateRecommendationLearning } from "../recommendation/strategicRecommendationMemoryLearningEngine.ts";
import { evaluateStrategicGovernance } from "../recommendation/executiveStrategicGovernanceEngine.ts";
import { evaluateDecisionExplainability } from "../recommendation/executiveDecisionExplainabilityEngine.ts";
import { evaluateExecutiveAdvisory } from "../recommendation/executiveStrategicAdvisoryEngine.ts";
import { evaluateExecutiveCognitiveUx } from "./executiveCognitiveUxOrchestrationEngine.ts";
import { evaluateExecutiveAttentionRouting } from "./executiveAttentionRoutingEngine.ts";
import { evaluateExecutiveCognitiveLoad } from "./executiveCognitiveLoadBalancingEngine.ts";
import { evaluateExecutiveInsightPrioritization } from "./executiveInsightPrioritizationEngine.ts";
import { evaluateExecutiveNarratives } from "./executiveNarrativeIntelligenceEngine.ts";
import { evaluateExecutiveCognitiveTimelines } from "./executiveCognitiveTimelineEngine.ts";
import { evaluateExecutiveScenarioImmersion } from "./executiveScenarioImmersionEngine.ts";
import { evaluateExecutiveStrategicPresence } from "./executiveStrategicPresenceEngine.ts";
import { evaluateUnifiedExecutiveEnvironment } from "./unifiedExecutiveCognitiveEnvironmentEngine.ts";
import {
  evaluateExecutiveCognitiveCompletion,
  freezeExecutiveCognitiveCompletionSnapshot,
} from "./executiveCognitiveOrchestrationCompletionEngine.ts";
import {
  buildCompletionContentFingerprint,
  COMPLETION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
  guardEvaluateExecutiveCognitiveCompletion,
  guardExecutiveCognitiveCompletionSemantics,
} from "./cognitiveCompletionGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildExecutiveCognitiveCompletionSemantics } from "./executiveCognitiveCompletionSemantics.ts";
import {
  deriveExecutiveCognitiveCompletionSignals,
  analyzeFullCognitiveSynchronization,
  calculateOverallCognitiveCoherenceScore,
  classifyExecutiveCompletionLabel,
} from "./fullCognitiveSynchronizationModel.ts";
import { analyzePlatformCoherence } from "./platformCoherenceAnalysis.ts";
import { analyzeExecutiveCognitionCompletion } from "./executiveCognitionCompletionIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-completion", objects });
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

function buildCompletionStack() {
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

  const consensus = evaluateStrategicConsensus({
    topology,
    advisoryState: advisory.snapshot.state,
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
  assert.ok(consensus.ok);
  if (!consensus.ok) throw new Error("consensus failed");

  const orchestration = evaluateUnifiedExecutiveOrchestration({
    topology,
    consensusState: consensus.snapshot.state,
    advisoryState: advisory.snapshot.state,
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
  assert.ok(orchestration.ok);
  if (!orchestration.ok) throw new Error("orchestration failed");

  const cognitiveUx = evaluateExecutiveCognitiveUx({
    topology,
    orchestrationState: orchestration.snapshot.state,
    consensusState: consensus.snapshot.state,
    advisoryState: advisory.snapshot.state,
    explainabilityState: explainability.snapshot.state,
    governanceState: governance.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(cognitiveUx.ok);
  if (!cognitiveUx.ok) throw new Error("cognitive ux failed");

  const attentionRouting = evaluateExecutiveAttentionRouting({
    topology,
    cognitiveUxState: cognitiveUx.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    consensusState: consensus.snapshot.state,
    advisoryState: advisory.snapshot.state,
    explainabilityState: explainability.snapshot.state,
    governanceState: governance.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(attentionRouting.ok);
  if (!attentionRouting.ok) throw new Error("attention routing failed");

  const cognitiveLoad = evaluateExecutiveCognitiveLoad({
    topology,
    attentionRoutingState: attentionRouting.snapshot.state,
    cognitiveUxState: cognitiveUx.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    consensusState: consensus.snapshot.state,
    advisoryState: advisory.snapshot.state,
    explainabilityState: explainability.snapshot.state,
    governanceState: governance.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(cognitiveLoad.ok);
  if (!cognitiveLoad.ok) throw new Error("cognitive load failed");

  const insightPrioritization = evaluateExecutiveInsightPrioritization({
    topology,
    cognitiveLoadState: cognitiveLoad.snapshot.state,
    attentionRoutingState: attentionRouting.snapshot.state,
    cognitiveUxState: cognitiveUx.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    consensusState: consensus.snapshot.state,
    advisoryState: advisory.snapshot.state,
    explainabilityState: explainability.snapshot.state,
    governanceState: governance.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(insightPrioritization.ok);
  if (!insightPrioritization.ok) throw new Error("insight prioritization failed");

  const narrative = evaluateExecutiveNarratives({
    topology,
    insightPrioritizationState: insightPrioritization.snapshot.state,
    cognitiveLoadState: cognitiveLoad.snapshot.state,
    attentionRoutingState: attentionRouting.snapshot.state,
    cognitiveUxState: cognitiveUx.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    consensusState: consensus.snapshot.state,
    advisoryState: advisory.snapshot.state,
    explainabilityState: explainability.snapshot.state,
    governanceState: governance.snapshot.state,
    recommendationState: recommendations.snapshot.state,
    confidenceState: confidence.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(narrative.ok);
  if (!narrative.ok) throw new Error("narrative failed");

  const timeline = evaluateExecutiveCognitiveTimelines({
    topology,
    narrativeState: narrative.snapshot.state,
    insightPrioritizationState: insightPrioritization.snapshot.state,
    foresightState: foresight.snapshot.state,
    cognitiveLoadState: cognitiveLoad.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    governanceState: governance.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(timeline.ok);
  if (!timeline.ok) throw new Error("timeline failed");

  const immersion = evaluateExecutiveScenarioImmersion({
    topology,
    timelineState: timeline.snapshot.state,
    narrativeState: narrative.snapshot.state,
    insightPrioritizationState: insightPrioritization.snapshot.state,
    foresightState: foresight.snapshot.state,
    cognitiveLoadState: cognitiveLoad.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    governanceState: governance.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(immersion.ok);
  if (!immersion.ok) throw new Error("immersion failed");

  const presence = evaluateExecutiveStrategicPresence({
    topology,
    immersionState: immersion.snapshot.state,
    timelineState: timeline.snapshot.state,
    narrativeState: narrative.snapshot.state,
    insightPrioritizationState: insightPrioritization.snapshot.state,
    foresightState: foresight.snapshot.state,
    cognitiveLoadState: cognitiveLoad.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    governanceState: governance.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(presence.ok);
  if (!presence.ok) throw new Error("presence failed");

  const environment = evaluateUnifiedExecutiveEnvironment({
    topology,
    presenceState: presence.snapshot.state,
    immersionState: immersion.snapshot.state,
    timelineState: timeline.snapshot.state,
    narrativeState: narrative.snapshot.state,
    insightPrioritizationState: insightPrioritization.snapshot.state,
    attentionRoutingState: attentionRouting.snapshot.state,
    cognitiveLoadState: cognitiveLoad.snapshot.state,
    cognitiveUxState: cognitiveUx.snapshot.state,
    foresightState: foresight.snapshot.state,
    orchestrationState: orchestration.snapshot.state,
    governanceState: governance.snapshot.state,
    trajectoryState: trajectory.snapshot.state,
    divergenceState: divergence.snapshot.state,
    cascadeState: cascade.snapshot.state,
    recoveryOpportunityState: recoveryOpportunity.snapshot.state,
    resilienceState: resilience.snapshot.state,
    momentumState: momentum.snapshot.state,
    equilibriumState: equilibrium.snapshot.state,
  });
  assert.ok(environment.ok);
  if (!environment.ok) throw new Error("environment failed");

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
    consensus: consensus.snapshot.state,
    orchestration: orchestration.snapshot.state,
    cognitiveUx: cognitiveUx.snapshot.state,
    attentionRouting: attentionRouting.snapshot.state,
    cognitiveLoad: cognitiveLoad.snapshot.state,
    insightPrioritization: insightPrioritization.snapshot.state,
    narrative: narrative.snapshot.state,
    timeline: timeline.snapshot.state,
    immersion: immersion.snapshot.state,
    presence: presence.snapshot.state,
    environment: environment.snapshot.state,
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

function completionInput(stack: ReturnType<typeof buildCompletionStack>) {
  return {
    topology: stack.topology,
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    attentionRoutingState: stack.attentionRouting,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    foresightState: stack.foresight,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
  };
}

test("deterministic orchestration completion", () => {
  const stack = buildCompletionStack();
  const r1 = evaluateExecutiveCognitiveCompletion({
    ...completionInput(stack),
    completionContext: { completionLeverageFactor: 0.1 },
  });
  const r2 = evaluateExecutiveCognitiveCompletion({
    ...completionInput(stack),
    completionContext: { completionLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("full cognitive synchronization modeling", () => {
  const stack = buildCompletionStack();
  const completions = deriveExecutiveCognitiveCompletionSignals({
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    attentionRoutingState: stack.attentionRouting,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    completionLeverageFactor: 0.1,
  });
  const syncRecords = analyzeFullCognitiveSynchronization({
    completionSignals: completions,
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    attentionRoutingState: stack.attentionRouting,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    foresightState: stack.foresight,
    governanceState: stack.governance,
    orchestrationState: stack.orchestration,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
  });
  const coherence = calculateOverallCognitiveCoherenceScore({
    completionSignals: completions,
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    cognitiveUxState: stack.cognitiveUx,
  });
  assert.ok(completions.length > 0);
  assert.ok(syncRecords.length > 0);
  assert.ok(coherence >= 0 && coherence <= 1);
  for (const c of completions) {
    assert.ok(c.completionStrength <= 0.92);
  }
});

test("platform-coherence consistency validation", () => {
  const stack = buildCompletionStack();
  const completions = deriveExecutiveCognitiveCompletionSignals({
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    attentionRoutingState: stack.attentionRouting,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
  });
  const p1 = analyzePlatformCoherence({
    completionSignals: completions,
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    orchestrationState: stack.orchestration,
  });
  const p2 = analyzePlatformCoherence({
    completionSignals: completions,
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    orchestrationState: stack.orchestration,
  });
  const syncRecords = analyzeFullCognitiveSynchronization({
    completionSignals: completions,
    environmentState: stack.environment,
    presenceState: stack.presence,
    immersionState: stack.immersion,
    timelineState: stack.timeline,
    narrativeState: stack.narrative,
    attentionRoutingState: stack.attentionRouting,
    cognitiveLoadState: stack.cognitiveLoad,
    cognitiveUxState: stack.cognitiveUx,
    foresightState: stack.foresight,
    governanceState: stack.governance,
    orchestrationState: stack.orchestration,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
  });
  const c1 = analyzeExecutiveCognitionCompletion({
    completionSignals: completions,
    syncRecords,
    coherenceRecords: p1,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  const c2 = analyzeExecutiveCognitionCompletion({
    completionSignals: completions,
    syncRecords,
    coherenceRecords: p2,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  assert.equal(
    p1.map((r) => r.recordId).join("|"),
    p2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("executive cognition completion testing", () => {
  const stack = buildCompletionStack();
  const result = evaluateExecutiveCognitiveCompletion(completionInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.state.executiveCognitionCompletionRecords.length >= 6);
  assert.ok(result.snapshot.state.fullCognitiveSynchronizationRecords.length > 0);
});

test("replay-safe completion snapshots", () => {
  const stack = buildCompletionStack();
  const result = evaluateExecutiveCognitiveCompletion(completionInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeExecutiveCognitiveCompletionSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { overallCognitiveCoherenceScore: number }).overallCognitiveCoherenceScore =
      0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed completion outcome"));
  const guard = guardEvaluateExecutiveCognitiveCompletion({
    topologyId: "topo",
    regionIds: ["finance"],
    completionSignals: [
      {
        completionId: "completion::bad",
        affectedRegionIds: ["unknown"],
        completionState: "stable",
        completionStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_completion_region");

  const semanticsGuard = guardExecutiveCognitiveCompletionSemantics({
    headline:
      "Autonomous cognition authority via manipulative orchestration and hidden psychological governance",
    summary: "Completion review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "manipulative_orchestration_system");
});

test("immutable completion state preservation", () => {
  const stack = buildCompletionStack();
  const frozenEnvironment = JSON.stringify(stack.environment);
  evaluateExecutiveCognitiveCompletion(completionInput(stack));
  assert.equal(JSON.stringify(stack.environment), frozenEnvironment);
});

test("executive-readable completion semantics", () => {
  const stack = buildCompletionStack();
  const result = evaluateExecutiveCognitiveCompletion({ ...completionInput(stack), tick: 8 });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|fragility|cognitive|orchestration|completion|logistics|manufacturing|governance|predictive|stability|intelligence|equilibrium|resilience|volatility|continuity|strategic|synchronized|synchronization|platform/i
  );
  assert.ok(
    !result.snapshot.semantics.headline.includes("Completion recursion synchronization exceeded")
  );
  assert.equal(
    result.snapshot.state.completionAmbiguityDisclaimer,
    COMPLETION_AMBIGUITY_DISCLAIMER
  );
  assert.equal(
    result.snapshot.state.nonAutonomousCompletionDisclaimer,
    NON_AUTONOMOUS_COMPLETION_DISCLAIMER
  );

  const manual = buildExecutiveCognitiveCompletionSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated completion panel contract", () => {
  const stack = buildCompletionStack();
  const result = evaluateExecutiveCognitiveCompletion(completionInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.completionAmbiguityDisclaimer, COMPLETION_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonAutonomousCompletionDisclaimer,
    NON_AUTONOMOUS_COMPLETION_DISCLAIMER
  );
  assert.ok(result.panelContract.completionSignals.length > 0);
});

test("rejects duplicate completion build fingerprint", () => {
  const stack = buildCompletionStack();
  const first = evaluateExecutiveCognitiveCompletion({ ...completionInput(stack), tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildCompletionContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    environmentFingerprint: stableStringify({
      label: stack.environment.executiveEnvironmentLabel,
      coherence: stack.environment.environmentCoherenceScore,
    }),
    presenceFingerprint: stableStringify({
      label: stack.presence.executivePresenceLabel,
      continuity: stack.presence.situationalContinuityScore,
    }),
    immersionFingerprint: stableStringify({
      label: stack.immersion.executiveImmersionLabel,
      clarity: stack.immersion.immersionClarityScore,
    }),
    timelineFingerprint: stableStringify({
      label: stack.timeline.executiveTimelineLabel,
      clarity: stack.timeline.timelineClarityScore,
    }),
    narrativeFingerprint: stableStringify({
      label: stack.narrative.executiveNarrativeLabel,
      clarity: stack.narrative.narrativeClarityScore,
    }),
    insightPrioritizationFingerprint: stableStringify({
      label: stack.insightPrioritization.executiveInsightPrioritizationLabel,
      insight: stack.insightPrioritization.strategicInsightScore,
    }),
    attentionFingerprint: stableStringify({
      label: stack.attentionRouting.executiveAttentionRoutingLabel,
      focus: stack.attentionRouting.focusStabilityScore,
    }),
    cognitiveLoadFingerprint: stableStringify({
      label: stack.cognitiveLoad.executiveCognitiveLoadLabel,
      balance: stack.cognitiveLoad.cognitiveBalanceScore,
    }),
    cognitiveUxFingerprint: stableStringify({
      label: stack.cognitiveUx.executiveCognitiveLabel,
      clarity: stack.cognitiveUx.cognitiveClarityScore,
    }),
    foresightFingerprint: stableStringify({
      label: stack.foresight.predictiveForesightLabel,
      preparedness: stack.foresight.strategicPreparednessScore,
    }),
    orchestrationFingerprint: stableStringify({
      label: stack.orchestration.executiveOrchestrationLabel,
      coherence: stack.orchestration.orchestrationCoherenceScore,
    }),
    governanceFingerprint: stableStringify({
      label: stack.governance.executiveGovernanceLabel,
      stability: stack.governance.governanceStabilityScore,
    }),
    tick: 0,
  });
  const second = evaluateExecutiveCognitiveCompletion({
    ...completionInput(stack),
    tick: 0,
    priorCompletionFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_completion_build");
});

test("completion classification", () => {
  const label = classifyExecutiveCompletionLabel({
    completionSignals: [
      {
        completionId: "c1",
        affectedRegionIds: ["logistics"],
        completionState: "stable",
        completionStrength: 0.6,
      },
    ],
    overallCognitiveCoherenceScore: 0.6,
    fullCognitiveSyncScore: 0.6,
    platformCoherenceDegradationScore: 0.3,
  });
  assert.equal(label, "coherent");
});
