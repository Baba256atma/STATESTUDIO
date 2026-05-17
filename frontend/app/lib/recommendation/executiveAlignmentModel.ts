/**
 * D7:5:9 — Executive-alignment modeling.
 */

import type { ExecutiveStrategicAdvisoryState } from "./executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "./executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveAlignmentRecord,
  ExecutiveConsensusSignal,
  ExecutiveConsensusStateLabel,
  ExecutiveStrategicConsensusState,
} from "./executiveConsensusTypes.ts";
import { logExecutiveStrategicConsensusDev } from "./consensusDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function consensusStateFromProfile(
  alignment: number,
  fragmentation: number,
  volatility: number
): ExecutiveConsensusStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (volatility >= 0.65) return "volatile";
  if (fragmentation >= 0.55 && alignment < 0.45) return "fragmented";
  if (alignment >= 0.62 && fragmentation < 0.4) return "aligned";
  if (alignment >= 0.45) return "emerging";
  return fragmentation > alignment ? "fragmented" : "volatile";
}

export function deriveExecutiveConsensusSignals(input: {
  advisoryState: ExecutiveStrategicAdvisoryState;
  comparisonState: ExecutiveMultiStrategyState;
  governanceState: ExecutiveStrategicGovernanceState;
  memoryState: StrategicRecommendationMemoryState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  consensusLeverageFactor?: number;
  fragmentationStressFactor?: number;
}): ExecutiveConsensusSignal[] {
  const leverage = clamp01(input.consensusLeverageFactor ?? 0);
  const stress = clamp01(input.fragmentationStressFactor ?? 0);

  const signals: ExecutiveConsensusSignal[] = [];

  const zoneSets = [
    input.advisoryState.executivePriorityZones,
    input.comparisonState.balancedStrategyZones,
    input.governanceState.executiveOversightZones,
    input.recommendationState.stabilizationRecommendationZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const alignment = clamp01(
      input.advisoryState.strategicCoherenceScore * 0.25 +
        input.comparisonState.comparisonStabilityScore * 0.25 +
        input.governanceState.governanceStabilityScore * 0.2 +
        leverage * 0.1
    );
    const fragmentation = clamp01(
      input.comparisonState.pathwayDivergenceScore * 0.35 +
        input.divergenceState.futureFragmentationScore * 0.3 +
        stress * 0.15
    );
    const volatility = clamp01(
      input.trajectoryState.trajectoryVolatilityScore * 0.4 +
        input.confidenceState.uncertaintyAmplificationScore * 0.3
    );

    const consensusState = consensusStateFromProfile(alignment, fragmentation, volatility);
    const consensusStrength = clamp01(alignment * 0.5 + (1 - fragmentation) * 0.35);

    const drivers: string[] = [];
    if (consensusState === "aligned") drivers.push("dependency_reduction_agreement", "recovery_sequencing");
    if (consensusState === "emerging") drivers.push("alignment_forming", "coordination_sync");
    if (consensusState === "fragmented") drivers.push("competing_priorities", "pathway_divergence");
    if (consensusState === "volatile") drivers.push("restructuring_dispute", "recovery_volatility");
    if (consensusState === "critical") drivers.push("strategic_disagreement", "governance_caution");

    signals.push(
      Object.freeze({
        consensusId: `consensus::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        consensusState,
        consensusStrength,
        dominantConsensusDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["consensus_assessment"]
        ),
        executiveLabel:
          consensusState === "aligned"
            ? "Executive agreement may strengthen recovery coordination in this zone cluster"
            : consensusState === "fragmented"
              ? "Strategic disagreement may increase operational divergence in this zone cluster"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        consensusId: "consensus::fallback-alignment",
        affectedRegionIds: Object.freeze(fallback),
        consensusState: "emerging",
        consensusStrength: clamp01(input.advisoryState.advisoryClarityScore * 0.5 + leverage * 0.2),
        dominantConsensusDrivers: Object.freeze(["baseline_alignment_assessment"]),
        executiveLabel: "Baseline strategic consensus assessment may apply across operational regions",
      })
    );
  }

  logExecutiveStrategicConsensusDev("Consensus", { consensusSignalCount: signals.length });
  return signals.sort((a, b) => a.consensusId.localeCompare(b.consensusId));
}

export function analyzeExecutiveAlignment(input: {
  consensusSignals: readonly ExecutiveConsensusSignal[];
  advisoryState: ExecutiveStrategicAdvisoryState;
  comparisonState: ExecutiveMultiStrategyState;
  governanceState: ExecutiveStrategicGovernanceState;
  adaptationState: PredictiveStrategicAdaptationState;
  resilienceState: HumanSystemResilienceState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): readonly ExecutiveAlignmentRecord[] {
  const records: ExecutiveAlignmentRecord[] = [];
  const consensusIds = input.consensusSignals.map((c) => c.consensusId);

  const regions =
    input.consensusSignals.flatMap((c) => c.affectedRegionIds).length > 0
      ? [...new Set(input.consensusSignals.flatMap((c) => c.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const alignedCount = input.consensusSignals.filter((c) => c.consensusState === "aligned").length;

  records.push(
    Object.freeze({
      recordId: "alignment::strategic-alignment",
      alignmentType: "strategic_alignment",
      alignmentStrength: clamp01(
        input.advisoryState.strategicCoherenceScore * 0.4 +
          input.comparisonState.comparisonStabilityScore * 0.35
      ),
      explanation:
        "Strategic alignment may strengthen when executive agreement converges on dependency reduction and recovery sequencing priorities.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "alignment::operational-coherence",
      alignmentType: "operational_coherence",
      alignmentStrength: clamp01(
        (alignedCount / Math.max(1, input.consensusSignals.length)) * 0.5 +
          input.governanceState.recommendationSafetyScore * 0.35
      ),
      explanation:
        "Operational coherence may improve when consensus-driven stabilization aligns governance and advisory pathways.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "alignment::consensus-stabilization",
      alignmentType: "consensus_stabilization",
      alignmentStrength: clamp01(
        input.recoveryOpportunityState.stabilizationPotentialScore * 0.45 +
          input.advisoryState.actionabilityScore * 0.35
      ),
      explanation:
        "Consensus-driven stabilization may accelerate recovery coordination when alignment remains stable across domains.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "alignment::resilience-alignment",
      alignmentType: "resilience_alignment",
      alignmentStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.45 +
          input.adaptationState.adaptiveResilienceScore * 0.35
      ),
      explanation:
        "Resilience-alignment relationships may link executive coherence to enterprise stabilization capacity.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "alignment::executive-synchronization",
      alignmentType: "executive_synchronization",
      alignmentStrength: clamp01(input.governanceState.governanceStabilityScore * 0.5),
      explanation:
        "Executive synchronization may reduce coordination friction when strategic priorities remain coherent across pathways.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  const fragmented = input.consensusSignals.filter((c) => c.consensusState === "fragmented").length;
  if (fragmented > 0 || input.comparisonState.pathwayDivergenceScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "alignment::fragmentation-escalation",
        alignmentType: "fragmentation_escalation",
        alignmentStrength: clamp01(
          input.comparisonState.pathwayDivergenceScore * 0.45 + fragmented / Math.max(1, input.consensusSignals.length)
        ),
        explanation:
          "Fragmentation escalation may increase operational divergence when competing strategic priorities remain unresolved.",
        contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
        affectedRegionIds: Object.freeze(regions),
      })
    );
  }

  logExecutiveStrategicConsensusDev("ExecutiveAlignment", { alignmentRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicAlignmentScore(input: {
  consensusSignals: readonly ExecutiveConsensusSignal[];
  advisoryState: ExecutiveStrategicAdvisoryState;
  comparisonState: ExecutiveMultiStrategyState;
}): number {
  if (input.consensusSignals.length === 0) return 0;
  const aligned = input.consensusSignals.filter((c) => c.consensusState === "aligned").length;
  const emerging = input.consensusSignals.filter((c) => c.consensusState === "emerging").length;
  const avgStrength =
    input.consensusSignals.reduce((sum, c) => sum + c.consensusStrength, 0) /
    input.consensusSignals.length;
  return clamp01(
    avgStrength * 0.35 +
      (aligned / input.consensusSignals.length) * 0.3 +
      (emerging / input.consensusSignals.length) * 0.15 +
      input.advisoryState.strategicCoherenceScore * 0.2
  );
}

export function calculateExecutiveCoherenceScore(input: {
  consensusSignals: readonly ExecutiveConsensusSignal[];
  governanceState: ExecutiveStrategicGovernanceState;
  explainabilityState: ExecutiveExplainabilityState;
}): number {
  const coherent = input.consensusSignals.filter(
    (c) => c.consensusState === "aligned" || c.consensusState === "emerging"
  ).length;
  return clamp01(
    (coherent / Math.max(1, input.consensusSignals.length)) * 0.4 +
      input.governanceState.governanceStabilityScore * 0.3 +
      input.explainabilityState.reasoningTransparencyScore * 0.3
  );
}

export function calculateFragmentationEscalationScore(input: {
  consensusSignals: readonly ExecutiveConsensusSignal[];
  comparisonState: ExecutiveMultiStrategyState;
  divergenceState: MultiFutureDivergenceState;
}): number {
  const fragmented = input.consensusSignals.filter(
    (c) =>
      c.consensusState === "fragmented" ||
      c.consensusState === "volatile" ||
      c.consensusState === "critical"
  ).length;
  return clamp01(
    (fragmented / Math.max(1, input.consensusSignals.length)) * 0.4 +
      input.comparisonState.pathwayDivergenceScore * 0.35 +
      input.divergenceState.futureFragmentationScore * 0.25
  );
}

export function identifyConsensusStabilityZones(
  consensusSignals: readonly ExecutiveConsensusSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const c of consensusSignals) {
    if (c.consensusState === "aligned" || c.consensusState === "emerging") {
      for (const r of c.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentationZones(
  consensusSignals: readonly ExecutiveConsensusSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const c of consensusSignals) {
    if (
      c.consensusState === "fragmented" ||
      c.consensusState === "volatile" ||
      c.consensusState === "critical"
    ) {
      for (const r of c.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveConsensusLabel(input: {
  strategicAlignmentScore: number;
  executiveCoherenceScore: number;
  fragmentationEscalationScore: number;
  consensusSignals: readonly ExecutiveConsensusSignal[];
}): ExecutiveStrategicConsensusState["executiveConsensusLabel"] {
  const critical = input.consensusSignals.filter((c) => c.consensusState === "critical").length;
  if (critical > 0 || input.fragmentationEscalationScore >= 0.68) return "critical";
  if (input.fragmentationEscalationScore >= 0.55) return "fragmented";
  if (input.fragmentationEscalationScore >= 0.45) return "volatile";
  if (input.strategicAlignmentScore >= 0.55 && input.executiveCoherenceScore >= 0.5) {
    return "aligned";
  }
  if (input.strategicAlignmentScore >= 0.4) return "emerging";
  return "fragmented";
}
