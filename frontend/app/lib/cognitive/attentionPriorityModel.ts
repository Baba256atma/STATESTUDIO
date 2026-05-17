/**
 * D7:6:1 — Executive attention-priority modeling.
 */

import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicConsensusState } from "../recommendation/executiveConsensusTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  AttentionPriorityRecord,
  ExecutiveCognitiveSignal,
  ExecutiveCognitiveStateLabel,
  ExecutiveCognitiveUxState,
} from "./executiveCognitiveUxTypes.ts";
import { logExecutiveCognitiveUxDev } from "./cognitiveUxDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function cognitiveStateFromProfile(
  clarity: number,
  load: number,
  urgency: number
): ExecutiveCognitiveStateLabel {
  if (load >= 0.72) return "critical";
  if (load >= 0.58) return "overloaded";
  if (urgency >= 0.62 && clarity >= 0.45) return "elevated";
  if (clarity >= 0.55 && load < 0.45) return "focused";
  if (clarity >= 0.4 && load < 0.55) return "stable";
  return load > clarity ? "overloaded" : "elevated";
}

export function deriveExecutiveCognitiveSignals(input: {
  orchestrationState: UnifiedExecutiveOrchestrationState;
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  cognitiveLeverageFactor?: number;
  overloadStressFactor?: number;
}): ExecutiveCognitiveSignal[] {
  const leverage = clamp01(input.cognitiveLeverageFactor ?? 0);
  const stress = clamp01(input.overloadStressFactor ?? 0);

  const signals: ExecutiveCognitiveSignal[] = [];

  const zoneSets = [
    input.orchestrationState.orchestrationFragilityZones,
    input.orchestrationState.synchronizedIntelligenceZones,
    input.consensusState.fragmentationZones,
    input.advisoryState.executivePriorityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const clarity = clamp01(
      input.orchestrationState.orchestrationCoherenceScore * 0.22 +
        input.advisoryState.advisoryClarityScore * 0.22 +
        input.confidenceState.overallConfidenceScore * 0.18 +
        leverage * 0.1
    );
    const load = clamp01(
      input.orchestrationState.orchestrationInstabilityScore * 0.28 +
        input.divergenceState.futureFragmentationScore * 0.28 +
        stress * 0.15
    );
    const urgency = clamp01(
      input.cascadeState.cascadePropagationScore * 0.35 +
        input.trajectoryState.trajectoryVolatilityScore * 0.3 +
        input.consensusState.fragmentationEscalationScore * 0.2
    );

    const cognitiveState = cognitiveStateFromProfile(clarity, load, urgency);
    const cognitiveStrength = clamp01(clarity * 0.4 + urgency * 0.35 + (1 - load) * 0.2);

    const drivers: string[] = [];
    if (cognitiveState === "focused") drivers.push("strategic_focus", "low_friction");
    if (cognitiveState === "stable") drivers.push("recovery_stability", "governance_confidence");
    if (cognitiveState === "elevated") drivers.push("fragility_escalation", "future_divergence");
    if (cognitiveState === "overloaded") drivers.push("signal_density", "attention_fragmentation");
    if (cognitiveState === "critical") drivers.push("cognitive_overload", "urgency_spike");

    signals.push(
      Object.freeze({
        signalId: `cognitive::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        cognitiveState,
        cognitiveStrength,
        dominantCognitiveDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["cognitive_assessment"]
        ),
        executiveLabel:
          cognitiveState === "elevated" || cognitiveState === "critical"
            ? "Executive attention priority may be elevated for operational intelligence in this zone cluster"
            : cognitiveState === "stable" || cognitiveState === "focused"
              ? "Cognitive urgency may be reduced where recovery and governance signals remain stable"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        signalId: "cognitive::fallback-attention",
        affectedRegionIds: Object.freeze(fallback),
        cognitiveState: "stable",
        cognitiveStrength: clamp01(input.advisoryState.advisoryClarityScore * 0.45 + leverage * 0.2),
        dominantCognitiveDrivers: Object.freeze(["baseline_cognitive_assessment"]),
        executiveLabel: "Baseline executive cognitive UX assessment may apply across operational regions",
      })
    );
  }

  logExecutiveCognitiveUxDev("CognitiveUX", { cognitiveSignalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function analyzeAttentionPriority(input: {
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
  orchestrationState: UnifiedExecutiveOrchestrationState;
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  cascadeState: PredictiveCascadeState;
}): readonly AttentionPriorityRecord[] {
  const records: AttentionPriorityRecord[] = [];
  const signalIds = input.cognitiveSignals.map((s) => s.signalId);

  const regions =
    input.cognitiveSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.cognitiveSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "attention::executive-focus",
      priorityType: "executive_focus",
      priorityStrength: clamp01(input.advisoryState.advisoryClarityScore * 0.45),
      explanation:
        "Executive focus prioritization may route attention toward the highest-clarity strategic pathways under current orchestration.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "attention::operational-urgency",
      priorityType: "operational_urgency",
      priorityStrength: clamp01(
        input.cascadeState.cascadePropagationScore * 0.4 +
          input.orchestrationState.orchestrationInstabilityScore * 0.35
      ),
      explanation:
        "Operational urgency weighting may elevate attention when fragility escalation and cascade signals intensify together.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "attention::strategic-routing",
      priorityType: "strategic_attention_routing",
      priorityStrength: clamp01(input.orchestrationState.crossSystemSynchronizationScore * 0.5),
      explanation:
        "Strategic attention routing may align advisory, consensus, and governance surfaces without hidden steering.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "attention::recovery-elevation",
      priorityType: "recovery_priority_elevation",
      priorityStrength: clamp01(
        input.recommendationState.stabilizationLeverageScore * 0.45 +
          input.consensusState.strategicAlignmentScore * 0.3
      ),
      explanation:
        "Recovery-priority elevation may surface when stabilization recommendations align with consensus stability zones.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "attention::fragility-visibility",
      priorityType: "fragility_visibility",
      priorityStrength: clamp01(
        input.orchestrationState.orchestrationInstabilityScore * 0.5 +
          input.consensusState.fragmentationEscalationScore * 0.35
      ),
      explanation:
        "Operational fragility signals across logistics recovery systems may be elevated in executive attention priority because future divergence and dependency pressure continue to intensify.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "attention::governance-awareness",
      priorityType: "governance_awareness",
      priorityStrength: clamp01(input.governanceState.governanceStabilityScore * 0.5),
      explanation:
        "Governance-awareness surfacing may increase when oversight requirements rise without autonomous workflow enforcement.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveCognitiveUxDev("ExecutiveAttention", {
    attentionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateCognitiveClarityScore(input: {
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: { explanationClarityScore: number };
}): number {
  if (input.cognitiveSignals.length === 0) return 0;
  const avg =
    input.cognitiveSignals.reduce((s, c) => s + c.cognitiveStrength, 0) /
    input.cognitiveSignals.length;
  return clamp01(
    avg * 0.35 +
      input.orchestrationState.orchestrationCoherenceScore * 0.25 +
      input.advisoryState.advisoryClarityScore * 0.2 +
      input.explainabilityState.explanationClarityScore * 0.15
  );
}

export function calculateAttentionPriorityScore(input: {
  attentionRecords: readonly AttentionPriorityRecord[];
}): number {
  if (input.attentionRecords.length === 0) return 0;
  return clamp01(
    input.attentionRecords.reduce((s, r) => s + r.priorityStrength, 0) /
      input.attentionRecords.length
  );
}

export function identifyAttentionPriorityZones(
  signals: readonly ExecutiveCognitiveSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.cognitiveState === "elevated" ||
      signal.cognitiveState === "critical" ||
      signal.cognitiveState === "focused"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyCognitiveOverloadZones(
  signals: readonly ExecutiveCognitiveSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.cognitiveState === "overloaded" || signal.cognitiveState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveCognitiveLabel(input: {
  cognitiveClarityScore: number;
  cognitiveLoadScore: number;
  attentionPriorityScore: number;
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
}): ExecutiveCognitiveUxState["executiveCognitiveLabel"] {
  const critical = input.cognitiveSignals.filter((s) => s.cognitiveState === "critical").length;
  if (critical > 0 || input.cognitiveLoadScore >= 0.68) return "critical";
  if (input.cognitiveLoadScore >= 0.55) return "overloaded";
  if (input.attentionPriorityScore >= 0.58 && input.cognitiveClarityScore >= 0.45) {
    return "elevated";
  }
  if (input.cognitiveClarityScore >= 0.55 && input.cognitiveLoadScore < 0.45) {
    return "focused";
  }
  if (input.cognitiveClarityScore >= 0.4) return "stable";
  return input.cognitiveLoadScore > input.cognitiveClarityScore ? "overloaded" : "elevated";
}
