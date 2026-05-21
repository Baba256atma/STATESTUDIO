import { getEnterpriseRuntimeFoundationStore } from "./enterpriseRuntimeFoundationStore";
import type {
  EnterpriseRuntimeFoundationHistoryEntry,
  EnterpriseRuntimeGovernanceSignal,
  MVPStrategicReadinessSnapshot,
  RuntimeReliabilityObservation,
} from "./enterpriseRuntimeFoundationTypes";

/** Readonly selectors for future runtime health dashboards and MVP readiness panels. */

export function selectMVPStrategicReadinessSnapshots(
  organizationId: string
): readonly MVPStrategicReadinessSnapshot[] {
  return getEnterpriseRuntimeFoundationStore(organizationId).getState().readinessSnapshots;
}

export function selectLatestMVPStrategicReadinessSnapshot(
  organizationId: string
): MVPStrategicReadinessSnapshot | null {
  return (
    getEnterpriseRuntimeFoundationStore(organizationId).getState().readinessSnapshots[0] ?? null
  );
}

export function selectRuntimeReliabilityObservations(
  organizationId: string
): readonly RuntimeReliabilityObservation[] {
  return getEnterpriseRuntimeFoundationStore(organizationId).getState().reliabilityObservations;
}

export function selectEnterpriseRuntimeGovernanceSignals(
  organizationId: string
): readonly EnterpriseRuntimeGovernanceSignal[] {
  return (
    selectLatestMVPStrategicReadinessSnapshot(organizationId)?.governanceSignals ?? []
  );
}

export function selectEnterpriseRuntimeFoundationHistory(
  organizationId: string
): readonly EnterpriseRuntimeFoundationHistoryEntry[] {
  return getEnterpriseRuntimeFoundationStore(organizationId).getState().foundationHistory;
}

export function selectEnterpriseRuntimeFoundationSignature(organizationId: string): string {
  return getEnterpriseRuntimeFoundationStore(organizationId).getState().signature;
}
