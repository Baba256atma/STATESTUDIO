import { getStrategicCoherenceStore } from "./strategicCoherenceStore";
import type {
  CrossRuntimeMisalignmentIndicator,
  EnterpriseCoherenceField,
  StrategicCoherenceObservation,
  TotalSystemAlignmentSignal,
  UnifiedStrategicCoherenceSnapshot,
} from "./strategicCoherenceTypes";

/** Readonly selectors for future total-system coherence dashboards and strategic alignment overlays. */

export function selectStrategicCoherenceObservations(
  organizationId: string
): readonly StrategicCoherenceObservation[] {
  return getStrategicCoherenceStore(organizationId).getState().observations;
}

export function selectUnifiedStrategicCoherenceSnapshots(
  organizationId: string
): readonly UnifiedStrategicCoherenceSnapshot[] {
  return getStrategicCoherenceStore(organizationId).getState().snapshots;
}

export function selectLatestUnifiedStrategicCoherenceSnapshot(
  organizationId: string
): UnifiedStrategicCoherenceSnapshot | null {
  return getStrategicCoherenceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectTotalSystemAlignmentSignals(
  organizationId: string
): readonly TotalSystemAlignmentSignal[] {
  return getStrategicCoherenceStore(organizationId).getState().totalSystemAlignmentSignals;
}

export function selectEnterpriseCoherenceFields(
  organizationId: string
): readonly EnterpriseCoherenceField[] {
  return getStrategicCoherenceStore(organizationId).getState().enterpriseCoherenceFields;
}

export function selectCrossRuntimeMisalignmentIndicators(
  organizationId: string
): readonly CrossRuntimeMisalignmentIndicator[] {
  return getStrategicCoherenceStore(organizationId).getState().misalignmentIndicators;
}

export function selectStrategicCoherenceSignature(organizationId: string): string {
  return getStrategicCoherenceStore(organizationId).getState().signature;
}
