import { getDistributedMemorySyncStore } from "./distributedMemorySyncStore";
import type {
  CollaborativeContinuityObservation,
  DistributedCognitionContinuitySignal,
  EnterpriseMemoryDivergenceIndicator,
  MultiPerspectiveMemorySnapshot,
  StrategicMemoryAlignmentField,
} from "./distributedMemorySyncTypes";

/** Readonly selectors for future distributed-memory dashboards and continuity overlays. */

export function selectCollaborativeContinuityObservations(
  organizationId: string
): readonly CollaborativeContinuityObservation[] {
  return getDistributedMemorySyncStore(organizationId).getState().observations;
}

export function selectMultiPerspectiveMemorySnapshots(
  organizationId: string
): readonly MultiPerspectiveMemorySnapshot[] {
  return getDistributedMemorySyncStore(organizationId).getState().snapshots;
}

export function selectLatestMultiPerspectiveMemorySnapshot(
  organizationId: string
): MultiPerspectiveMemorySnapshot | null {
  return getDistributedMemorySyncStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectDistributedCognitionContinuitySignals(
  organizationId: string
): readonly DistributedCognitionContinuitySignal[] {
  return getDistributedMemorySyncStore(organizationId).getState().continuitySignals;
}

export function selectEnterpriseMemoryDivergenceIndicators(
  organizationId: string
): readonly EnterpriseMemoryDivergenceIndicator[] {
  return getDistributedMemorySyncStore(organizationId).getState().divergenceIndicators;
}

export function selectStrategicMemoryAlignmentFields(
  organizationId: string
): readonly StrategicMemoryAlignmentField[] {
  return getDistributedMemorySyncStore(organizationId).getState().alignmentFields;
}

export function selectDistributedMemorySyncSignature(organizationId: string): string {
  return getDistributedMemorySyncStore(organizationId).getState().signature;
}
