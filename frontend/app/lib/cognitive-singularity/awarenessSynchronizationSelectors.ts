import { getAwarenessSynchronizationStore } from "./awarenessSynchronizationStore";
import type {
  AwarenessFragmentationIndicator,
  AwarenessSynchronizationObservation,
  CrossDomainAwarenessSignal,
  EnterpriseAwarenessSynchronizationSnapshot,
  StrategicAwarenessAlignment,
  UnifiedOperationalCognitionField,
} from "./awarenessSynchronizationTypes";

/** Readonly selectors for future enterprise awareness dashboards and cross-domain cognition overlays. */

export function selectAwarenessSynchronizationObservations(
  organizationId: string
): readonly AwarenessSynchronizationObservation[] {
  return getAwarenessSynchronizationStore(organizationId).getState().observations;
}

export function selectEnterpriseAwarenessSynchronizationSnapshots(
  organizationId: string
): readonly EnterpriseAwarenessSynchronizationSnapshot[] {
  return getAwarenessSynchronizationStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseAwarenessSynchronizationSnapshot(
  organizationId: string
): EnterpriseAwarenessSynchronizationSnapshot | null {
  return getAwarenessSynchronizationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCrossDomainAwarenessSignals(
  organizationId: string
): readonly CrossDomainAwarenessSignal[] {
  return getAwarenessSynchronizationStore(organizationId).getState().awarenessSignals;
}

export function selectUnifiedOperationalCognitionFields(
  organizationId: string
): readonly UnifiedOperationalCognitionField[] {
  return getAwarenessSynchronizationStore(organizationId).getState().operationalCognitionFields;
}

export function selectStrategicAwarenessAlignments(
  organizationId: string
): readonly StrategicAwarenessAlignment[] {
  return getAwarenessSynchronizationStore(organizationId).getState().awarenessAlignments;
}

export function selectAwarenessFragmentationIndicators(
  organizationId: string
): readonly AwarenessFragmentationIndicator[] {
  return getAwarenessSynchronizationStore(organizationId).getState().fragmentationIndicators;
}

export function selectAwarenessSynchronizationSignature(organizationId: string): string {
  return getAwarenessSynchronizationStore(organizationId).getState().signature;
}
