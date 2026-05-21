import { getDecisionConfidenceStore } from "./decisionConfidenceStore";
import type {
  ConfidenceArbitrationSnapshot,
  EnterpriseUncertaintyField,
  ExecutiveDecisionConfidence,
  OperationalAmbiguityIndicator,
  StrategicCertaintySignal,
} from "./decisionConfidenceTypes";

/** Readonly selectors for future strategic certainty dashboards and reliability panels. */

export function selectExecutiveDecisionConfidences(
  organizationId: string
): readonly ExecutiveDecisionConfidence[] {
  return getDecisionConfidenceStore(organizationId).getState().executiveConfidences;
}

export function selectConfidenceArbitrationSnapshots(
  organizationId: string
): readonly ConfidenceArbitrationSnapshot[] {
  return getDecisionConfidenceStore(organizationId).getState().snapshots;
}

export function selectLatestConfidenceArbitrationSnapshot(
  organizationId: string
): ConfidenceArbitrationSnapshot | null {
  return getDecisionConfidenceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicCertaintySignals(
  organizationId: string
): readonly StrategicCertaintySignal[] {
  return getDecisionConfidenceStore(organizationId).getState().certaintySignals;
}

export function selectEnterpriseUncertaintyFields(
  organizationId: string
): readonly EnterpriseUncertaintyField[] {
  return getDecisionConfidenceStore(organizationId).getState().uncertaintyFields;
}

export function selectOperationalAmbiguityIndicators(
  organizationId: string
): readonly OperationalAmbiguityIndicator[] {
  return getDecisionConfidenceStore(organizationId).getState().ambiguityIndicators;
}

export function selectDecisionConfidenceSignature(organizationId: string): string {
  return getDecisionConfidenceStore(organizationId).getState().signature;
}
