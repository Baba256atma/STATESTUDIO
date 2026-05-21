import { getDistributedGovernanceStore } from "./distributedGovernanceStore";
import type {
  CollaborativeIntegrityObservation,
  CollectiveIntegritySignal,
  DistributedGovernanceIndicator,
  DistributedStrategicGovernanceSnapshot,
  EnterpriseCoherenceField,
} from "./distributedGovernanceTypes";

/** Readonly selectors for future distributed-governance dashboards and integrity overlays. */

export function selectCollaborativeIntegrityObservations(
  organizationId: string
): readonly CollaborativeIntegrityObservation[] {
  return getDistributedGovernanceStore(organizationId).getState().observations;
}

export function selectDistributedStrategicGovernanceSnapshots(
  organizationId: string
): readonly DistributedStrategicGovernanceSnapshot[] {
  return getDistributedGovernanceStore(organizationId).getState().snapshots;
}

export function selectLatestDistributedStrategicGovernanceSnapshot(
  organizationId: string
): DistributedStrategicGovernanceSnapshot | null {
  return getDistributedGovernanceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCollectiveIntegritySignals(
  organizationId: string
): readonly CollectiveIntegritySignal[] {
  return getDistributedGovernanceStore(organizationId).getState().integritySignals;
}

export function selectDistributedGovernanceIndicators(
  organizationId: string
): readonly DistributedGovernanceIndicator[] {
  return getDistributedGovernanceStore(organizationId).getState().governanceIndicators;
}

export function selectEnterpriseCoherenceFields(
  organizationId: string
): readonly EnterpriseCoherenceField[] {
  return getDistributedGovernanceStore(organizationId).getState().coherenceFields;
}

export function selectDistributedGovernanceSignature(organizationId: string): string {
  return getDistributedGovernanceStore(organizationId).getState().signature;
}
