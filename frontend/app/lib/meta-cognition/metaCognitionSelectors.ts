import { getMetaCognitionStore } from "./metaCognitionStore";
import type {
  CognitionQualitySignal,
  MetaCognitionRuntimeSnapshot,
  MetaCognitiveRisk,
  ReasoningIntegrityObservation,
  SelfReflectionSummary,
  StrategicCognitionHealth,
} from "./metaCognitionTypes";

/** Readonly selectors for future executive trust dashboards and cognition health HUDs. */

export function selectReasoningIntegrityObservations(
  organizationId: string
): readonly ReasoningIntegrityObservation[] {
  return getMetaCognitionStore(organizationId).getState().integrityObservations;
}

export function selectMetaCognitionRuntimeSnapshots(
  organizationId: string
): readonly MetaCognitionRuntimeSnapshot[] {
  return getMetaCognitionStore(organizationId).getState().snapshots;
}

export function selectLatestMetaCognitionRuntimeSnapshot(
  organizationId: string
): MetaCognitionRuntimeSnapshot | null {
  return getMetaCognitionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCognitionQualitySignals(
  organizationId: string
): readonly CognitionQualitySignal[] {
  return getMetaCognitionStore(organizationId).getState().cognitionQualitySignals;
}

export function selectMetaCognitiveRisks(organizationId: string): readonly MetaCognitiveRisk[] {
  return getMetaCognitionStore(organizationId).getState().metaCognitiveRisks;
}

export function selectStrategicCognitionHealthRecords(
  organizationId: string
): readonly StrategicCognitionHealth[] {
  return getMetaCognitionStore(organizationId).getState().strategicCognitionHealthRecords;
}

export function selectSelfReflectionSummaries(
  organizationId: string
): readonly SelfReflectionSummary[] {
  return getMetaCognitionStore(organizationId).getState().selfReflectionSummaries;
}

export function selectMetaCognitionSignature(organizationId: string): string {
  return getMetaCognitionStore(organizationId).getState().signature;
}
