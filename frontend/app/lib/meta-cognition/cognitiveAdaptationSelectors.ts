import { getCognitiveAdaptationStore } from "./cognitiveAdaptationStore";
import type {
  AdaptiveReasoningObservation,
  EnterpriseSelfStabilizationSignal,
  ExecutiveCognitiveAdaptationSnapshot,
  RuntimeBalanceField,
  StrategicAdaptationIndicator,
} from "./cognitiveAdaptationTypes";

/** Readonly selectors for future cognitive stabilization dashboards and adaptation overlays. */

export function selectAdaptiveReasoningObservations(
  organizationId: string
): readonly AdaptiveReasoningObservation[] {
  return getCognitiveAdaptationStore(organizationId).getState().adaptiveObservations;
}

export function selectExecutiveCognitiveAdaptationSnapshots(
  organizationId: string
): readonly ExecutiveCognitiveAdaptationSnapshot[] {
  return getCognitiveAdaptationStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveCognitiveAdaptationSnapshot(
  organizationId: string
): ExecutiveCognitiveAdaptationSnapshot | null {
  return getCognitiveAdaptationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseSelfStabilizationSignals(
  organizationId: string
): readonly EnterpriseSelfStabilizationSignal[] {
  return getCognitiveAdaptationStore(organizationId).getState().selfStabilizationSignals;
}

export function selectStrategicAdaptationIndicators(
  organizationId: string
): readonly StrategicAdaptationIndicator[] {
  return getCognitiveAdaptationStore(organizationId).getState().adaptationIndicators;
}

export function selectRuntimeBalanceFields(
  organizationId: string
): readonly RuntimeBalanceField[] {
  return getCognitiveAdaptationStore(organizationId).getState().runtimeBalanceFields;
}

export function selectCognitiveAdaptationSignature(organizationId: string): string {
  return getCognitiveAdaptationStore(organizationId).getState().signature;
}
