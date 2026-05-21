import { getCognitiveSingularityStore } from "./cognitiveSingularityStore";
import type {
  CrossDomainAwarenessTopology,
  EnterpriseCognitiveSingularitySnapshot,
  IntelligenceConvergenceObservation,
  StrategicIntelligenceConvergenceSignal,
  UnifiedCognitionField,
} from "./cognitiveSingularityTypes";

/** Readonly selectors for future unified strategic-awareness dashboards and convergence overlays. */

export function selectIntelligenceConvergenceObservations(
  organizationId: string
): readonly IntelligenceConvergenceObservation[] {
  return getCognitiveSingularityStore(organizationId).getState().observations;
}

export function selectEnterpriseCognitiveSingularitySnapshots(
  organizationId: string
): readonly EnterpriseCognitiveSingularitySnapshot[] {
  return getCognitiveSingularityStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseCognitiveSingularitySnapshot(
  organizationId: string
): EnterpriseCognitiveSingularitySnapshot | null {
  return getCognitiveSingularityStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicIntelligenceConvergenceSignals(
  organizationId: string
): readonly StrategicIntelligenceConvergenceSignal[] {
  return getCognitiveSingularityStore(organizationId).getState().convergenceSignals;
}

export function selectUnifiedCognitionFields(organizationId: string): readonly UnifiedCognitionField[] {
  return getCognitiveSingularityStore(organizationId).getState().cognitionFields;
}

export function selectCrossDomainAwarenessTopologies(
  organizationId: string
): readonly CrossDomainAwarenessTopology[] {
  return getCognitiveSingularityStore(organizationId).getState().awarenessTopologies;
}

export function selectCognitiveSingularitySignature(organizationId: string): string {
  return getCognitiveSingularityStore(organizationId).getState().signature;
}
