import { getFinalStrategicIntegrationStore } from "./finalStrategicIntegrationStore";
import type {
  EnterpriseCognitiveIntegrationField,
  FinalStrategicIntegrationSnapshot,
  RuntimeFragmentationIndicator,
  StrategicIntegrationObservation,
  TotalRuntimeConvergenceSignal,
} from "./finalStrategicIntegrationTypes";

/** Readonly selectors for future total runtime convergence dashboards and final strategic integration overlays. */

export function selectStrategicIntegrationObservations(
  organizationId: string
): readonly StrategicIntegrationObservation[] {
  return getFinalStrategicIntegrationStore(organizationId).getState().observations;
}

export function selectFinalStrategicIntegrationSnapshots(
  organizationId: string
): readonly FinalStrategicIntegrationSnapshot[] {
  return getFinalStrategicIntegrationStore(organizationId).getState().snapshots;
}

export function selectLatestFinalStrategicIntegrationSnapshot(
  organizationId: string
): FinalStrategicIntegrationSnapshot | null {
  return getFinalStrategicIntegrationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectTotalRuntimeConvergenceSignals(
  organizationId: string
): readonly TotalRuntimeConvergenceSignal[] {
  return getFinalStrategicIntegrationStore(organizationId).getState().totalRuntimeConvergenceSignals;
}

export function selectEnterpriseCognitiveIntegrationFields(
  organizationId: string
): readonly EnterpriseCognitiveIntegrationField[] {
  return getFinalStrategicIntegrationStore(organizationId).getState().enterpriseCognitiveIntegrationFields;
}

export function selectRuntimeFragmentationIndicators(
  organizationId: string
): readonly RuntimeFragmentationIndicator[] {
  return getFinalStrategicIntegrationStore(organizationId).getState().fragmentationIndicators;
}

export function selectFinalStrategicIntegrationSignature(organizationId: string): string {
  return getFinalStrategicIntegrationStore(organizationId).getState().signature;
}
