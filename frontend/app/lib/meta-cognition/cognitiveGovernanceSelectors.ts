import { getCognitiveGovernanceStore } from "./cognitiveGovernanceStore";
import type {
  CognitiveConstraintObservation,
  EnterpriseSelfRegulationSignal,
  ExecutiveCognitiveGovernanceSnapshot,
  GovernanceIntegrityField,
  StrategicBoundaryIndicator,
} from "./cognitiveGovernanceTypes";

/** Readonly selectors for future cognitive governance dashboards and self-regulation overlays. */

export function selectCognitiveConstraintObservations(
  organizationId: string
): readonly CognitiveConstraintObservation[] {
  return getCognitiveGovernanceStore(organizationId).getState().constraintObservations;
}

export function selectExecutiveCognitiveGovernanceSnapshots(
  organizationId: string
): readonly ExecutiveCognitiveGovernanceSnapshot[] {
  return getCognitiveGovernanceStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveCognitiveGovernanceSnapshot(
  organizationId: string
): ExecutiveCognitiveGovernanceSnapshot | null {
  return getCognitiveGovernanceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseSelfRegulationSignals(
  organizationId: string
): readonly EnterpriseSelfRegulationSignal[] {
  return getCognitiveGovernanceStore(organizationId).getState().selfRegulationSignals;
}

export function selectStrategicBoundaryIndicators(
  organizationId: string
): readonly StrategicBoundaryIndicator[] {
  return getCognitiveGovernanceStore(organizationId).getState().boundaryIndicators;
}

export function selectGovernanceIntegrityFields(
  organizationId: string
): readonly GovernanceIntegrityField[] {
  return getCognitiveGovernanceStore(organizationId).getState().governanceIntegrityFields;
}

export function selectCognitiveGovernanceSignature(organizationId: string): string {
  return getCognitiveGovernanceStore(organizationId).getState().signature;
}
