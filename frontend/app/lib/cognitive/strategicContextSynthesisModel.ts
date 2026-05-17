/**
 * D7:6:5 — Strategic-context synthesis modeling for executive narratives.
 */

import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type {
  ExecutiveNarrativeIntelligenceState,
  ExecutiveNarrativeSignal,
  ExecutiveNarrativeStateLabel,
  ExecutiveNarrativeContextRecord,
} from "./executiveNarrativeTypes.ts";
import { logExecutiveNarrativeDev } from "./narrativeIntelligenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function narrativeStateFromProfile(
  clarity: number,
  complexity: number,
  fragmentation: number
): ExecutiveNarrativeStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmented";
  if (complexity >= 0.62) return "complex";
  if (complexity >= 0.48 && clarity < 0.42) return "developing";
  if (clarity >= 0.55 && fragmentation < 0.4) return "clear";
  return complexity > clarity ? "complex" : "developing";
}

export function deriveExecutiveNarrativeSignals(input: {
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  narrativeLeverageFactor?: number;
  coherenceStressFactor?: number;
}): ExecutiveNarrativeSignal[] {
  const leverage = clamp01(input.narrativeLeverageFactor ?? 0);
  const stress = clamp01(input.coherenceStressFactor ?? 0);

  const signals: ExecutiveNarrativeSignal[] = [];

  const zoneSets = [
    input.insightPrioritizationState.elevatedInsightZones,
    input.insightPrioritizationState.lowSignalNoiseZones,
    input.cognitiveLoadState.overloadZones,
    input.cognitiveLoadState.stabilizedAttentionZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const clarity = clamp01(
      input.explainabilityState.explanationClarityScore * 0.3 +
        input.advisoryState.advisoryClarityScore * 0.25 +
        input.insightPrioritizationState.strategicInsightScore * 0.2 +
        leverage * 0.1
    );
    const complexity = clamp01(
      input.cognitiveLoadState.signalDensityScore * 0.28 +
        input.insightPrioritizationState.strategicValueScore * 0.25 +
        input.orchestrationState.orchestrationInstabilityScore * 0.2 +
        stress * 0.12
    );
    const fragmentation = clamp01(
      input.insightPrioritizationState.urgencyEscalationScore * 0.3 +
        input.divergenceState.futureFragmentationScore * 0.28 +
        input.cognitiveLoadState.overloadEscalationScore * 0.2
    );

    const narrativeState = narrativeStateFromProfile(clarity, complexity, fragmentation);
    const narrativeStrength = clamp01(
      clarity * 0.35 + (1 - complexity) * 0.3 + (1 - fragmentation) * 0.25
    );

    const drivers: string[] = [];
    if (narrativeState === "clear") drivers.push("stable_continuity", "high_clarity");
    if (narrativeState === "developing") drivers.push("emerging_context", "moderate_synthesis");
    if (narrativeState === "complex") drivers.push("multi_layer_context", "dense_signals");
    if (narrativeState === "fragmented") drivers.push("conflicting_interpretation", "synthesis_gap");
    if (narrativeState === "critical") drivers.push("narrative_breakdown", "continuity_risk");

    signals.push(
      Object.freeze({
        narrativeId: `narrative::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        narrativeState,
        narrativeStrength,
        dominantNarrativeDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["narrative_assessment"]
        ),
        executiveLabel:
          narrativeState === "fragmented" || narrativeState === "critical"
            ? "Executive narrative synthesis may require additional context across operational intelligence surfaces"
            : narrativeState === "clear"
              ? "Coherent narrative framing may apply where recovery and equilibrium remain stable"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        narrativeId: "narrative::fallback-synthesis",
        affectedRegionIds: Object.freeze(fallback),
        narrativeState: "developing",
        narrativeStrength: clamp01(
          input.explainabilityState.explanationClarityScore * 0.4 + leverage * 0.2
        ),
        dominantNarrativeDrivers: Object.freeze(["baseline_narrative_assessment"]),
        executiveLabel:
          "Baseline executive narrative synthesis may apply across strategic operational regions",
      })
    );
  }

  logExecutiveNarrativeDev("Narrative", { narrativeSignalCount: signals.length });
  return signals.sort((a, b) => a.narrativeId.localeCompare(b.narrativeId));
}

export function analyzeStrategicContext(input: {
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): readonly ExecutiveNarrativeContextRecord[] {
  const records: ExecutiveNarrativeContextRecord[] = [];
  const narrativeIds = input.narrativeSignals.map((n) => n.narrativeId);

  const regions =
    input.narrativeSignals.flatMap((n) => n.affectedRegionIds).length > 0
      ? [...new Set(input.narrativeSignals.flatMap((n) => n.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const signalCount =
    input.narrativeSignals.length +
    input.insightPrioritizationState.activeInsightPriorities.length +
    input.explainabilityState.activeExplainabilitySignals.length;

  records.push(
    Object.freeze({
      recordId: "context::operational-synthesis",
      contextType: "operational_context_synthesis",
      contextStrength: clamp01(signalCount / 14),
      explanation:
        "Operational-context synthesis may connect fragmented signals into coherent executive understanding across enterprise intelligence layers.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "context::strategic-continuity",
      contextType: "strategic_continuity",
      contextStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.insightPrioritizationState.strategicInsightScore * 0.3
      ),
      explanation:
        "Strategic continuity may frame how operational evolution connects to long-term enterprise momentum under executive control.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "context::resilience-framing",
      contextType: "resilience_narrative_framing",
      contextStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.5 +
          input.recoveryOpportunityState.stabilizationPotentialScore * 0.3
      ),
      explanation:
        "Resilience narrative framing may explain how human-system capacity supports recovery sequencing and volatility reduction.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "context::predictive-trajectory",
      contextType: "predictive_trajectory_interpretation",
      contextStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.4 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35 +
          input.cascadeState.cascadePropagationScore * 0.2
      ),
      explanation:
        "Predictive trajectory interpretation may contextualize future divergence within operational consequence pathways.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "context::governance-aware",
      contextType: "governance_aware_storytelling",
      contextStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.45 +
          input.governanceState.activeGovernanceSignals.length / 12
      ),
      explanation:
        "Governance-aware storytelling may integrate policy sensitivity without speculative or manipulative narration.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "context::recovery-sequencing",
      contextType: "recovery_sequencing_explanation",
      contextStrength: clamp01(
        input.recoveryOpportunityState.recoveryAccelerationScore * 0.55 +
          input.cognitiveLoadState.cognitiveBalanceScore * 0.25
      ),
      explanation:
        "Recovery-sequencing explanation may describe how stabilization momentum could strengthen resilience while reducing operational volatility.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveNarrativeDev("StrategicStory", { contextRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateNarrativeClarityScore(input: {
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
  explainabilityState: ExecutiveExplainabilityState;
  advisoryState: ExecutiveStrategicAdvisoryState;
}): number {
  if (input.narrativeSignals.length === 0) return 0;
  const avgStrength =
    input.narrativeSignals.reduce((s, n) => s + n.narrativeStrength, 0) /
    input.narrativeSignals.length;
  return clamp01(
    avgStrength * 0.4 +
      input.explainabilityState.explanationClarityScore * 0.3 +
      input.advisoryState.advisoryClarityScore * 0.25
  );
}

export function calculateStrategicContextScore(input: {
  contextRecords: readonly ExecutiveNarrativeContextRecord[];
}): number {
  if (input.contextRecords.length === 0) return 0;
  return clamp01(
    input.contextRecords.reduce((s, r) => s + r.contextStrength, 0) /
      input.contextRecords.length
  );
}

export function identifyStrategicNarrativeZones(
  signals: readonly ExecutiveNarrativeSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.narrativeState === "clear" ||
      signal.narrativeState === "developing" ||
      signal.narrativeState === "complex"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedNarrativeZones(
  signals: readonly ExecutiveNarrativeSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.narrativeState === "fragmented" || signal.narrativeState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveNarrativeLabel(input: {
  narrativeClarityScore: number;
  strategicContextScore: number;
  narrativeFragmentationScore: number;
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
}): ExecutiveNarrativeIntelligenceState["executiveNarrativeLabel"] {
  const critical = input.narrativeSignals.filter((n) => n.narrativeState === "critical").length;
  if (critical > 0 || input.narrativeFragmentationScore >= 0.68) return "critical";
  if (input.narrativeFragmentationScore >= 0.55) return "fragmented";
  if (input.strategicContextScore >= 0.58) return "complex";
  if (input.strategicContextScore >= 0.45 && input.narrativeClarityScore < 0.45) {
    return "developing";
  }
  if (input.narrativeClarityScore >= 0.55 && input.narrativeFragmentationScore < 0.4) {
    return "clear";
  }
  return input.narrativeFragmentationScore > input.narrativeClarityScore
    ? "fragmented"
    : "developing";
}
