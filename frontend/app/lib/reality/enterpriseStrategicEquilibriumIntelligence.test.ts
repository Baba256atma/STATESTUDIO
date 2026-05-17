/**
 * D7:7:7 — Enterprise strategic reality equilibrium intelligence tests.
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
import { evaluateExecutiveCognitiveUx } from "../cognitive/executiveCognitiveUxOrchestrationEngine.ts";
import { evaluateExecutiveAttentionRouting } from "../cognitive/executiveAttentionRoutingEngine.ts";
import { evaluateExecutiveCognitiveLoad } from "../cognitive/executiveCognitiveLoadBalancingEngine.ts";
import { evaluateExecutiveInsightPrioritization } from "../cognitive/executiveInsightPrioritizationEngine.ts";
import { evaluateExecutiveNarratives } from "../cognitive/executiveNarrativeIntelligenceEngine.ts";
import { evaluateExecutiveCognitiveTimelines } from "../cognitive/executiveCognitiveTimelineEngine.ts";
import { evaluateExecutiveScenarioImmersion } from "../cognitive/executiveScenarioImmersionEngine.ts";
import { evaluateExecutiveStrategicPresence } from "../cognitive/executiveStrategicPresenceEngine.ts";
import { evaluateUnifiedExecutiveEnvironment } from "../cognitive/unifiedExecutiveCognitiveEnvironmentEngine.ts";
import { evaluateExecutiveCognitiveCompletion } from "../cognitive/executiveCognitiveOrchestrationCompletionEngine.ts";
import { evaluateStrategicReality } from "./nexoraStrategicRealityEngine.ts";
import { evaluateEnterpriseRealitySynchronization } from "./enterpriseOperationalRealitySynchronizationEngine.ts";
import { evaluateOperationalCausality } from "./enterpriseOperationalCausalityEngine.ts";
import { evaluateStrategicRealityDrift } from "./enterpriseStrategicRealityDriftEngine.ts";
import { evaluateEnterpriseResilience } from "./enterpriseStrategicResilienceEngine.ts";
import { evaluateStrategicRealityEvolution } from "./enterpriseStrategicRealityEvolutionEngine.ts";
import {
  evaluateStrategicEquilibrium,
  freezeEnterpriseStrategicEquilibriumSnapshot,
} from "./enterpriseStrategicEquilibriumEngine.ts";
import {
  buildEquilibriumContentFingerprint,
  EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
  guardEvaluateStrategicEquilibrium,
  guardEnterpriseStrategicEquilibriumSemantics,
} from "./enterpriseStrategicEquilibriumGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildEnterpriseStrategicEquilibriumSemantics } from "./enterpriseStrategicEquilibriumSemantics.ts";
import {
  deriveEnterpriseStrategicEquilibriumSignals,
  analyzeDynamicBalance,
  calculateSystemicBalanceScore,
  classifyExecutiveEquilibriumLabel,
} from "./dynamicBalanceModeling.ts";
import { analyzeEquilibriumInstability } from "./equilibriumInstabilityAnalysis.ts";
import { analyzeEnterpriseStability } from "./enterpriseStabilityIntelligence.ts";
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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-reality", objects });
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

function buildSynchronizationStack() {
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

  const completion = evaluateExecutiveCognitiveCompletion({
    topology,
    environmentState: environment.snapshot.state,
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
  assert.ok(completion.ok);
  if (!completion.ok) throw new Error("completion failed");

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
    completion: completion.snapshot.state,
  };
}

function buildRealitySnapshot(stack: ReturnType<typeof buildSynchronizationStack>) {
  const result = evaluateStrategicReality(realityInput(stack));
  assert.ok(result.ok);
  if (!result.ok) throw new Error("strategic reality failed");
  return result.snapshot;
}

function realityInput(stack: ReturnType<typeof buildSynchronizationStack>) {
  return {
    topology: stack.topology,
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: {
      topology: stack.topology,
      momentumState: stack.momentum,
      equilibriumState: stack.equilibrium,
      resilienceState: stack.resilience,
      recoveryOpportunityState: stack.recoveryOpportunity,
      governanceState: stack.governance,
    },
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
  };
}

function syncInput(
  stack: ReturnType<typeof buildSynchronizationStack>,
  realitySnapshot: ReturnType<typeof buildRealitySnapshot>
) {
  return {
    topology: stack.topology,
    strategicRealityState: realitySnapshot.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    realityStateId: realitySnapshot.realityStateId,
  };
}

function buildSyncSnapshot(stack: ReturnType<typeof buildSynchronizationStack>) {
  const reality = buildRealitySnapshot(stack);
  const result = evaluateEnterpriseRealitySynchronization(syncInput(stack, reality));
  assert.ok(result.ok);
  if (!result.ok) throw new Error("synchronization failed");
  return result.snapshot;
}

function buildCausalitySnapshot(stack: ReturnType<typeof buildSynchronizationStack>) {
  const sync = buildSyncSnapshot(stack);
  const result = evaluateOperationalCausality(causalityInput(stack, sync));
  assert.ok(result.ok);
  if (!result.ok) throw new Error("causality failed");
  return result.snapshot;
}

function causalityInput(
  stack: ReturnType<typeof buildSynchronizationStack>,
  syncSnapshot: ReturnType<typeof buildSyncSnapshot>
) {
  const reality = buildRealitySnapshot(stack);
  return {
    topology: stack.topology,
    synchronizationState: syncSnapshot.state,
    strategicRealityState: reality.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    synchronizationStateId: syncSnapshot.synchronizationStateId,
    realityStateId: reality.realityStateId,
  };
}

function driftInput(
  stack: ReturnType<typeof buildSynchronizationStack>,
  causalitySnapshot: ReturnType<typeof buildCausalitySnapshot>
) {
  const sync = buildSyncSnapshot(stack);
  const reality = buildRealitySnapshot(stack);
  return {
    topology: stack.topology,
    causalityState: causalitySnapshot.state,
    synchronizationState: sync.state,
    strategicRealityState: reality.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    causalityStateId: causalitySnapshot.causalityStateId,
    synchronizationStateId: sync.synchronizationStateId,
    realityStateId: reality.realityStateId,
  };
}

function buildDriftSnapshot(stack: ReturnType<typeof buildSynchronizationStack>) {
  const causality = buildCausalitySnapshot(stack);
  const result = evaluateStrategicRealityDrift(driftInput(stack, causality));
  assert.ok(result.ok);
  if (!result.ok) throw new Error("drift failed");
  return result.snapshot;
}

function buildResilienceSnapshot(stack: ReturnType<typeof buildSynchronizationStack>) {
  const drift = buildDriftSnapshot(stack);
  const result = evaluateEnterpriseResilience(resilienceInput(stack, drift));
  assert.ok(result.ok);
  if (!result.ok) throw new Error("resilience failed");
  return result.snapshot;
}

function resilienceInput(
  stack: ReturnType<typeof buildSynchronizationStack>,
  driftSnapshot: ReturnType<typeof buildDriftSnapshot>
) {
  const sync = buildSyncSnapshot(stack);
  const causality = buildCausalitySnapshot(stack);
  const reality = buildRealitySnapshot(stack);
  return {
    topology: stack.topology,
    driftState: driftSnapshot.state,
    causalityState: causality.state,
    synchronizationState: sync.state,
    strategicRealityState: reality.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    driftStateId: driftSnapshot.driftStateId,
    causalityStateId: causality.causalityStateId,
    synchronizationStateId: sync.synchronizationStateId,
    realityStateId: reality.realityStateId,
  };
}

function buildEvolutionSnapshot(stack: ReturnType<typeof buildSynchronizationStack>) {
  const resilience = buildResilienceSnapshot(stack);
  const result = evaluateStrategicRealityEvolution(evolutionInput(stack, resilience));
  assert.ok(result.ok);
  if (!result.ok) throw new Error("evolution failed");
  return result.snapshot;
}

function evolutionInput(
  stack: ReturnType<typeof buildSynchronizationStack>,
  resilienceSnapshot: ReturnType<typeof buildResilienceSnapshot>
) {
  const sync = buildSyncSnapshot(stack);
  const causality = buildCausalitySnapshot(stack);
  const drift = buildDriftSnapshot(stack);
  const reality = buildRealitySnapshot(stack);
  return {
    topology: stack.topology,
    resilienceState: resilienceSnapshot.state,
    driftState: drift.state,
    causalityState: causality.state,
    synchronizationState: sync.state,
    strategicRealityState: reality.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    resilienceStateId: resilienceSnapshot.resilienceStateId,
    driftStateId: drift.driftStateId,
    causalityStateId: causality.causalityStateId,
    synchronizationStateId: sync.synchronizationStateId,
    realityStateId: reality.realityStateId,
  };
}

function equilibriumInput(
  stack: ReturnType<typeof buildSynchronizationStack>,
  evolutionSnapshot: ReturnType<typeof buildEvolutionSnapshot>
) {
  const sync = buildSyncSnapshot(stack);
  const causality = buildCausalitySnapshot(stack);
  const drift = buildDriftSnapshot(stack);
  const resilience = buildResilienceSnapshot(stack);
  const reality = buildRealitySnapshot(stack);
  return {
    topology: stack.topology,
    evolutionState: evolutionSnapshot.state,
    resilienceState: resilience.state,
    driftState: drift.state,
    causalityState: causality.state,
    synchronizationState: sync.state,
    strategicRealityState: reality.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
    governanceState: stack.governance,
    foresightState: stack.foresight,
    trajectoryState: stack.trajectory,
    divergenceState: stack.divergence,
    cascadeState: stack.cascade,
    evolutionStateId: evolutionSnapshot.evolutionStateId,
    resilienceStateId: resilience.resilienceStateId,
    driftStateId: drift.driftStateId,
    causalityStateId: causality.causalityStateId,
    synchronizationStateId: sync.synchronizationStateId,
    realityStateId: reality.realityStateId,
  };
}

test("deterministic equilibrium orchestration", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const r1 = evaluateStrategicEquilibrium({
    ...equilibriumInput(stack, evolution),
    equilibriumContext: { equilibriumLeverageFactor: 0.1 },
  });
  const r2 = evaluateStrategicEquilibrium({
    ...equilibriumInput(stack, evolution),
    equilibriumContext: { equilibriumLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("dynamic-balance modeling", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const input = equilibriumInput(stack, evolution);
  const signals = deriveEnterpriseStrategicEquilibriumSignals({
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: input.operationalUniverseState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    equilibriumLeverageFactor: 0.1,
  });
  const balanceRecords = analyzeDynamicBalance({
    equilibriumSignals: signals,
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: input.operationalUniverseState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });
  const balance = calculateSystemicBalanceScore({
    equilibriumSignals: signals,
    dynamicBalanceRecords: balanceRecords,
    operationalUniverseState: input.operationalUniverseState,
    synchronizationState: input.synchronizationState,
    evolutionState: input.evolutionState,
  });
  assert.ok(signals.length > 0);
  assert.ok(balanceRecords.length >= 6);
  assert.ok(balance >= 0 && balance <= 1);
  for (const s of signals) {
    assert.ok(s.equilibriumStrength <= 0.92);
  }
});

test("stability consistency validation", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const input = equilibriumInput(stack, evolution);
  const signals = deriveEnterpriseStrategicEquilibriumSignals({
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: input.operationalUniverseState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });
  const balanceRecords = analyzeDynamicBalance({
    equilibriumSignals: signals,
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: input.operationalUniverseState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });
  const i1 = analyzeEquilibriumInstability({
    equilibriumSignals: signals,
    dynamicBalanceRecords: balanceRecords,
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: input.operationalUniverseState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
  });
  const i2 = analyzeEquilibriumInstability({
    equilibriumSignals: signals,
    dynamicBalanceRecords: balanceRecords,
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: input.operationalUniverseState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
  });
  const s1 = analyzeEnterpriseStability({
    equilibriumSignals: signals,
    dynamicBalanceRecords: balanceRecords,
    instabilityRecords: i1,
    trajectoryState: input.trajectoryState,
    momentumState: input.operationalUniverseState.momentumState,
    equilibriumState: input.operationalUniverseState.equilibriumState,
    divergenceState: input.divergenceState,
  });
  const s2 = analyzeEnterpriseStability({
    equilibriumSignals: signals,
    dynamicBalanceRecords: balanceRecords,
    instabilityRecords: i2,
    trajectoryState: input.trajectoryState,
    momentumState: input.operationalUniverseState.momentumState,
    equilibriumState: input.operationalUniverseState.equilibriumState,
    divergenceState: input.divergenceState,
  });
  assert.equal(
    i1.map((r) => r.recordId).join("|"),
    i2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    s1.map((r) => r.recordId).join("|"),
    s2.map((r) => r.recordId).join("|")
  );
});

test("enterprise equilibrium testing", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const result = evaluateStrategicEquilibrium(equilibriumInput(stack, evolution));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.state.dynamicBalanceRecords.length >= 6);
  assert.ok(result.snapshot.state.equilibriumInstabilityRecords.length >= 6);
  assert.ok(result.snapshot.state.enterpriseStabilityRecords.length >= 6);
});

test("replay-safe equilibrium snapshots", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const result = evaluateStrategicEquilibrium(equilibriumInput(stack, evolution));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeEnterpriseStrategicEquilibriumSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { systemicBalanceScore: number }).systemicBalanceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed equilibrium outcome"));
  const guard = guardEvaluateStrategicEquilibrium({
    topologyId: "topo",
    regionIds: ["finance"],
    equilibriumSignals: [
      {
        equilibriumId: "equilibrium::bad",
        affectedRegionIds: ["unknown"],
        equilibriumState: "balanced",
        equilibriumStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_equilibrium_region");

  const semanticsGuard = guardEnterpriseStrategicEquilibriumSemantics({
    headline:
      "Autonomous balancing systems via manipulative orchestration and hidden governance manipulation",
    summary: "Equilibrium review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_equilibrium_narrative");
});

test("immutable equilibrium state preservation", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const frozenEvolution = JSON.stringify(evolution.state);
  evaluateStrategicEquilibrium(equilibriumInput(stack, evolution));
  assert.equal(JSON.stringify(evolution.state), frozenEvolution);
});

test("executive-readable equilibrium semantics", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const result = evaluateStrategicEquilibrium({
    ...equilibriumInput(stack, evolution),
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|equilibrium|balance|logistics|governance|coordination|adapt|stabil|volatil|recovery|manufacturing|strategic|horizon|pressure|harmony/i
  );
  assert.ok(
    !result.snapshot.semantics.headline.includes("Equilibrium recursion exceeded")
  );
  assert.equal(
    result.snapshot.state.equilibriumAmbiguityDisclaimer,
    EQUILIBRIUM_AMBIGUITY_DISCLAIMER
  );
  assert.equal(
    result.snapshot.state.nonAutonomousEquilibriumDisclaimer,
    NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER
  );

  const manual = buildEnterpriseStrategicEquilibriumSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated equilibrium panel contract", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const result = evaluateStrategicEquilibrium(equilibriumInput(stack, evolution));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(
    result.panelContract.equilibriumAmbiguityDisclaimer,
    EQUILIBRIUM_AMBIGUITY_DISCLAIMER
  );
  assert.equal(
    result.panelContract.nonAutonomousEquilibriumDisclaimer,
    NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER
  );
  assert.ok(result.panelContract.equilibriumSignals.length > 0);
});

test("rejects duplicate equilibrium build fingerprint", () => {
  const stack = buildSynchronizationStack();
  const evolution = buildEvolutionSnapshot(stack);
  const first = evaluateStrategicEquilibrium({
    ...equilibriumInput(stack, evolution),
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const input = equilibriumInput(stack, evolution);
  const fp = buildEquilibriumContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    evolutionFingerprint: stableStringify({
      label: input.evolutionState.executiveEvolutionLabel,
      coherence: input.evolutionState.transformationCoherenceScore,
      instability: input.evolutionState.transitionInstabilityScore,
    }),
    resilienceFingerprint: stableStringify({
      label: input.resilienceState.executiveResilienceLabel,
      capacity: input.resilienceState.resilienceCapacityScore,
      recovery: input.resilienceState.adaptiveRecoveryScore,
      pressure: input.resilienceState.recoveryPressureScore,
    }),
    driftFingerprint: stableStringify({
      label: input.driftState.executiveDriftLabel,
      coherence: input.driftState.strategicCoherenceScore,
      degradation: input.driftState.coherenceDegradationScore,
    }),
    causalityFingerprint: stableStringify({
      label: input.causalityState.executiveCausalityLabel,
      clarity: input.causalityState.causalityClarityScore,
      propagation: input.causalityState.causalPropagationScore,
    }),
    syncFingerprint: stableStringify({
      label: input.synchronizationState.executiveSynchronizationLabel,
      coherence: input.synchronizationState.synchronizationCoherenceScore,
      drift: input.synchronizationState.operationalDriftScore,
    }),
    realityFingerprint: stableStringify({
      label: input.strategicRealityState.executiveRealityLabel,
      coherence: input.strategicRealityState.operationalRealityCoherenceScore,
      instability: input.strategicRealityState.realityInstabilityScore,
    }),
    orchestrationFingerprint: stableStringify({
      label: stack.orchestration.executiveOrchestrationLabel,
      coherence: stack.orchestration.orchestrationCoherenceScore,
    }),
    momentumFingerprint: stableStringify({
      momentum: stack.momentum.organizationalMomentumScore,
      recovery: stack.momentum.recoveryMomentumScore,
    }),
    equilibriumFingerprint: stableStringify({
      score: input.operationalUniverseState.equilibriumState.equilibriumScore,
    }),
    governanceFingerprint: stableStringify({
      label: stack.governance.executiveGovernanceLabel,
      stability: stack.governance.governanceStabilityScore,
    }),
    foresightFingerprint: stableStringify({
      label: stack.foresight.predictiveForesightLabel,
      preparedness: stack.foresight.strategicPreparednessScore,
    }),
    trajectoryFingerprint: stableStringify({
      stability: stack.trajectory.futureStabilityScore,
      volatility: stack.trajectory.trajectoryVolatilityScore,
    }),
    divergenceFingerprint: stableStringify({
      fragmentation: stack.divergence.futureFragmentationScore,
    }),
    tick: 0,
  });
  const second = evaluateStrategicEquilibrium({
    ...equilibriumInput(stack, evolution),
    tick: 0,
    priorEquilibriumFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_equilibrium_build");
});

test("equilibrium classification", () => {
  const label = classifyExecutiveEquilibriumLabel({
    equilibriumSignals: [
      {
        equilibriumId: "eq1",
        affectedRegionIds: ["logistics"],
        equilibriumState: "balanced",
        equilibriumStrength: 0.6,
      },
    ],
    systemicBalanceScore: 0.6,
    dynamicBalanceScore: 0.3,
    destabilizationPressureScore: 0.3,
  });
  assert.equal(label, "balanced");
});
