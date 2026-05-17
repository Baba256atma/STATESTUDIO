/**
 * D7:6:1 — Cognitive-load analysis.
 */

import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  CognitiveLoadRecord,
  ExecutiveCognitiveSignal,
} from "./executiveCognitiveUxTypes.ts";
import { logExecutiveCognitiveUxDev } from "./cognitiveUxDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeCognitiveLoad(input: {
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: ExecutiveExplainabilityState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly CognitiveLoadRecord[] {
  const records: CognitiveLoadRecord[] = [];
  const signalIds = input.cognitiveSignals.map((s) => s.signalId);

  const overloadedSignals = input.cognitiveSignals.filter(
    (s) => s.cognitiveState === "overloaded" || s.cognitiveState === "critical"
  ).length;

  if (overloadedSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "load::executive-overload",
        loadType: "executive_overload",
        loadStrength: clamp01(
          overloadedSignals / Math.max(1, input.cognitiveSignals.length)
        ),
        explanation:
          "Executive overload conditions may emerge when multiple cognitive signals indicate overloaded or critical attention states.",
        contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      })
    );
  }

  const signalDensity = input.cognitiveSignals.length + input.orchestrationState.activeOrchestrationSignals.length;
  if (signalDensity >= 6) {
    records.push(
      Object.freeze({
        recordId: "load::excessive-signal-density",
        loadType: "excessive_signal_density",
        loadStrength: clamp01(signalDensity / 12),
        explanation:
          "Excessive signal density may increase cognitive friction when too many competing intelligence surfaces demand attention simultaneously.",
        contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.45 &&
    input.advisoryState.executiveAdvisoryLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "load::fragmented-attention",
        loadType: "fragmented_attention",
        loadStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.orchestrationState.orchestrationInstabilityScore * 0.35
        ),
        explanation:
          "Fragmented strategic attention may elevate cognitive overload risk when competing alerts coincide with high divergence volatility.",
        contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      })
    );
  }

  if (input.trajectoryState.trajectoryVolatilityScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "load::complexity-escalation",
        loadType: "complexity_escalation",
        loadStrength: input.trajectoryState.trajectoryVolatilityScore,
        explanation:
          "Operational complexity escalation may reduce decision confidence when trajectory volatility rises across interconnected domains.",
        contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      })
    );
  }

  if (input.explainabilityState.explanationClarityScore < 0.4) {
    records.push(
      Object.freeze({
        recordId: "load::low-clarity-interaction",
        loadType: "low_clarity_interaction",
        loadStrength: clamp01(1 - input.explainabilityState.explanationClarityScore),
        explanation:
          "Low-clarity interaction states may impede rapid understanding when explainability remains restricted under dense intelligence output.",
        contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      })
    );
  }

  if (input.orchestrationState.executiveOrchestrationLabel === "volatile" ||
    input.orchestrationState.executiveOrchestrationLabel === "critical") {
    records.push(
      Object.freeze({
        recordId: "load::unstable-orchestration",
        loadType: "unstable_orchestration_pattern",
        loadStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Unstable UX orchestration patterns may emerge when backend orchestration instability propagates into executive interaction layers.",
        contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
      })
    );
  }

  logExecutiveCognitiveUxDev("CognitiveLoad", {
    loadRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateCognitiveLoadScore(input: {
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
  loadRecords: readonly CognitiveLoadRecord[];
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const overloaded = input.cognitiveSignals.filter(
    (s) => s.cognitiveState === "overloaded" || s.cognitiveState === "critical"
  ).length;
  const avgLoad =
    input.loadRecords.length > 0
      ? input.loadRecords.reduce((s, r) => s + r.loadStrength, 0) / input.loadRecords.length
      : 0;
  return clamp01(
    avgLoad * 0.5 +
      (overloaded / Math.max(1, input.cognitiveSignals.length)) * 0.3 +
      input.orchestrationState.orchestrationInstabilityScore * 0.2
  );
}
