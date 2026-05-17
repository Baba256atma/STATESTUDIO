/**
 * D7:6:6 — Executive cognitive timeline intelligence tests.
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
import {
  evaluateExecutiveCognitiveTimelines,
  freezeExecutiveCognitiveTimelineSnapshot,
} from "./executiveCognitiveTimelineEngine.ts";
import {
  buildTimelineContentFingerprint,
  TIMELINE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_TIMELINE_DISCLAIMER,
  guardEvaluateExecutiveCognitiveTimelines,
  guardExecutiveCognitiveTimelineSemantics,
} from "./cognitiveTimelineGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildExecutiveCognitiveTimelineSemantics } from "./executiveCognitiveTimelineSemantics.ts";
import {
  deriveExecutiveTimelineSignals,
  analyzeMultiHorizonTimelines,
  calculateTimelineClarityScore,
  classifyExecutiveTimelineLabel,
} from "./multiHorizonTimelineModel.ts";
import { analyzeTimelineFragmentation } from "./timelineFragmentationAnalysis.ts";
import { analyzeExecutiveTemporalCognition } from "./executiveTemporalCognitionIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-timeline", objects });
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

function buildTimelineStack() {
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

function timelineInput(stack: ReturnType<typeof buildTimelineStack>) {
  return {
    topology: stack.topology,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    foresightState: stack.foresight,
    cognitiveLoadState: stack.cognitiveLoad,
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

test("deterministic timeline analysis", () => {
  const stack = buildTimelineStack();
  const r1 = evaluateExecutiveCognitiveTimelines({
    ...timelineInput(stack),
    timelineContext: { timelineLeverageFactor: 0.1 },
  });
  const r2 = evaluateExecutiveCognitiveTimelines({
    ...timelineInput(stack),
    timelineContext: { timelineLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("multi-horizon modeling", () => {
  const stack = buildTimelineStack();
  const timelines = deriveExecutiveTimelineSignals({
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    foresightState: stack.foresight,
    cognitiveLoadState: stack.cognitiveLoad,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
    timelineLeverageFactor: 0.1,
  });
  const horizons = analyzeMultiHorizonTimelines({
    timelineSignals: timelines,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    foresightState: stack.foresight,
    cognitiveLoadState: stack.cognitiveLoad,
    governanceState: stack.governance,
    orchestrationState: stack.orchestration,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
  });
  const clarity = calculateTimelineClarityScore({
    timelineSignals: timelines,
    narrativeState: stack.narrative,
    foresightState: stack.foresight,
  });
  assert.ok(timelines.length > 0);
  assert.ok(horizons.length > 0);
  assert.ok(clarity >= 0 && clarity <= 1);
  for (const t of timelines) {
    assert.ok(t.timelineStrength <= 0.92);
  }
});

test("timeline-coherence consistency validation", () => {
  const stack = buildTimelineStack();
  const timelines = deriveExecutiveTimelineSignals({
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    foresightState: stack.foresight,
    cognitiveLoadState: stack.cognitiveLoad,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
  });
  const f1 = analyzeTimelineFragmentation({
    timelineSignals: timelines,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    cognitiveLoadState: stack.cognitiveLoad,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const f2 = analyzeTimelineFragmentation({
    timelineSignals: timelines,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    cognitiveLoadState: stack.cognitiveLoad,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const horizons = analyzeMultiHorizonTimelines({
    timelineSignals: timelines,
    narrativeState: stack.narrative,
    insightPrioritizationState: stack.insightPrioritization,
    foresightState: stack.foresight,
    cognitiveLoadState: stack.cognitiveLoad,
    governanceState: stack.governance,
    orchestrationState: stack.orchestration,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    recoveryOpportunityState: stack.recoveryOpportunity,
    resilienceState: stack.resilience,
  });
  const t1 = analyzeExecutiveTemporalCognition({
    timelineSignals: timelines,
    horizonRecords: horizons,
    fragmentationRecords: f1,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  const t2 = analyzeExecutiveTemporalCognition({
    timelineSignals: timelines,
    horizonRecords: horizons,
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
    t1.map((r) => r.recordId).join("|"),
    t2.map((r) => r.recordId).join("|")
  );
});

test("executive temporal cognition testing", () => {
  const stack = buildTimelineStack();
  const result = evaluateExecutiveCognitiveTimelines(timelineInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.state.executiveTemporalCognitionRecords.length >= 6);
  assert.ok(result.snapshot.state.cognitiveHorizonRecords.length > 0);
});

test("replay-safe timeline snapshots", () => {
  const stack = buildTimelineStack();
  const result = evaluateExecutiveCognitiveTimelines(timelineInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeExecutiveCognitiveTimelineSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { timelineClarityScore: number }).timelineClarityScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed timeline outcome"));
  const guard = guardEvaluateExecutiveCognitiveTimelines({
    topologyId: "topo",
    regionIds: ["finance"],
    timelineSignals: [
      {
        timelineId: "timeline::bad",
        affectedRegionIds: ["unknown"],
        timelineState: "developing",
        timelineStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_timeline_region");

  const semanticsGuard = guardExecutiveCognitiveTimelineSemantics({
    headline: "Fabricated future timeline via manipulative urgency and hidden temporal persuasion",
    summary: "Timeline review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_future_timeline");
});

test("immutable timeline state preservation", () => {
  const stack = buildTimelineStack();
  const frozenNarrative = JSON.stringify(stack.narrative);
  evaluateExecutiveCognitiveTimelines(timelineInput(stack));
  assert.equal(JSON.stringify(stack.narrative), frozenNarrative);
});

test("executive-readable timeline semantics", () => {
  const stack = buildTimelineStack();
  const result = evaluateExecutiveCognitiveTimelines({ ...timelineInput(stack), tick: 8 });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|fragility|timeline|logistics|manufacturing|governance|predictive|stability|intelligence|equilibrium|resilience|volatility|horizon|instability|synchronization/i
  );
  assert.ok(
    !result.snapshot.semantics.headline.includes("Timeline recursion synchronization exceeded")
  );
  assert.equal(result.snapshot.state.timelineAmbiguityDisclaimer, TIMELINE_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonManipulationTimelineDisclaimer,
    NON_MANIPULATION_TIMELINE_DISCLAIMER
  );

  const manual = buildExecutiveCognitiveTimelineSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated timeline panel contract", () => {
  const stack = buildTimelineStack();
  const result = evaluateExecutiveCognitiveTimelines(timelineInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.timelineAmbiguityDisclaimer, TIMELINE_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonManipulationTimelineDisclaimer,
    NON_MANIPULATION_TIMELINE_DISCLAIMER
  );
  assert.ok(result.panelContract.timelineSignals.length > 0);
});

test("rejects duplicate timeline build fingerprint", () => {
  const stack = buildTimelineStack();
  const first = evaluateExecutiveCognitiveTimelines({ ...timelineInput(stack), tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildTimelineContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    narrativeFingerprint: stableStringify({
      label: stack.narrative.executiveNarrativeLabel,
      clarity: stack.narrative.narrativeClarityScore,
    }),
    insightPrioritizationFingerprint: stableStringify({
      label: stack.insightPrioritization.executiveInsightPrioritizationLabel,
      insight: stack.insightPrioritization.strategicInsightScore,
    }),
    foresightFingerprint: stableStringify({
      label: stack.foresight.predictiveForesightLabel,
      preparedness: stack.foresight.strategicPreparednessScore,
    }),
    cognitiveLoadFingerprint: stableStringify({
      label: stack.cognitiveLoad.executiveCognitiveLoadLabel,
      balance: stack.cognitiveLoad.cognitiveBalanceScore,
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
  const second = evaluateExecutiveCognitiveTimelines({
    ...timelineInput(stack),
    tick: 0,
    priorTimelineFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_timeline_build");
});

test("timeline classification", () => {
  const label = classifyExecutiveTimelineLabel({
    timelineSignals: [
      {
        timelineId: "t1",
        affectedRegionIds: ["logistics"],
        timelineState: "developing",
        timelineStrength: 0.6,
      },
    ],
    timelineClarityScore: 0.4,
    multiHorizonScore: 0.5,
    timelineFragmentationScore: 0.35,
  });
  assert.equal(label, "developing");
});
