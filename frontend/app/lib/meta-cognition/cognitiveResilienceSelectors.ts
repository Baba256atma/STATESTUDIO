import { getCognitiveResilienceStore } from "./cognitiveResilienceStore";
import type {
  CognitiveStressField,
  EnterpriseSurvivabilitySignal,
  ExecutiveCognitiveResilienceSnapshot,
  RuntimeResilienceObservation,
  StrategicDurabilityIndicator,
} from "./cognitiveResilienceTypes";

/** Readonly selectors for future enterprise survivability dashboards and resilience overlays. */

export function selectRuntimeResilienceObservations(
  organizationId: string
): readonly RuntimeResilienceObservation[] {
  return getCognitiveResilienceStore(organizationId).getState().resilienceObservations;
}

export function selectExecutiveCognitiveResilienceSnapshots(
  organizationId: string
): readonly ExecutiveCognitiveResilienceSnapshot[] {
  return getCognitiveResilienceStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveCognitiveResilienceSnapshot(
  organizationId: string
): ExecutiveCognitiveResilienceSnapshot | null {
  return getCognitiveResilienceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseSurvivabilitySignals(
  organizationId: string
): readonly EnterpriseSurvivabilitySignal[] {
  return getCognitiveResilienceStore(organizationId).getState().survivabilitySignals;
}

export function selectStrategicDurabilityIndicators(
  organizationId: string
): readonly StrategicDurabilityIndicator[] {
  return getCognitiveResilienceStore(organizationId).getState().durabilityIndicators;
}

export function selectCognitiveStressFields(
  organizationId: string
): readonly CognitiveStressField[] {
  return getCognitiveResilienceStore(organizationId).getState().cognitiveStressFields;
}

export function selectCognitiveResilienceSignature(organizationId: string): string {
  return getCognitiveResilienceStore(organizationId).getState().signature;
}
