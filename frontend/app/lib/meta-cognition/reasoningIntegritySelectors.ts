import { getReasoningIntegrityStore } from "./reasoningIntegrityStore";
import type {
  CognitiveConsistencySignal,
  CrossRuntimeAlignment,
  EnterpriseContradictionIndicator,
  ExecutiveTrustObservation,
  StrategicReasoningIntegritySnapshot,
} from "./reasoningIntegrityTypes";

/** Readonly selectors for future executive trust dashboards and reasoning verification overlays. */

export function selectExecutiveTrustObservations(
  organizationId: string
): readonly ExecutiveTrustObservation[] {
  return getReasoningIntegrityStore(organizationId).getState().trustObservations;
}

export function selectStrategicReasoningIntegritySnapshots(
  organizationId: string
): readonly StrategicReasoningIntegritySnapshot[] {
  return getReasoningIntegrityStore(organizationId).getState().snapshots;
}

export function selectLatestStrategicReasoningIntegritySnapshot(
  organizationId: string
): StrategicReasoningIntegritySnapshot | null {
  return getReasoningIntegrityStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCognitiveConsistencySignals(
  organizationId: string
): readonly CognitiveConsistencySignal[] {
  return getReasoningIntegrityStore(organizationId).getState().consistencySignals;
}

export function selectEnterpriseContradictionIndicators(
  organizationId: string
): readonly EnterpriseContradictionIndicator[] {
  return getReasoningIntegrityStore(organizationId).getState().contradictionIndicators;
}

export function selectCrossRuntimeAlignments(
  organizationId: string
): readonly CrossRuntimeAlignment[] {
  return getReasoningIntegrityStore(organizationId).getState().crossRuntimeAlignments;
}

export function selectReasoningIntegritySignature(organizationId: string): string {
  return getReasoningIntegrityStore(organizationId).getState().signature;
}
