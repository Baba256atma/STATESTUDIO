import { getInstitutionalAlignmentStore } from "./institutionalAlignmentStore";
import type {
  EnterprisePolicyAlignment,
  GovernanceCoherenceSnapshot,
  InstitutionalAlignmentSignal,
  OrganizationalIntegrityField,
  StrategicConsistencyIndicator,
} from "./institutionalAlignmentTypes";

/** Readonly selectors for future governance coherence dashboards and alignment panels. */

export function selectEnterprisePolicyAlignments(
  organizationId: string
): readonly EnterprisePolicyAlignment[] {
  return getInstitutionalAlignmentStore(organizationId).getState().policyAlignments;
}

export function selectGovernanceCoherenceSnapshots(
  organizationId: string
): readonly GovernanceCoherenceSnapshot[] {
  return getInstitutionalAlignmentStore(organizationId).getState().snapshots;
}

export function selectLatestGovernanceCoherenceSnapshot(
  organizationId: string
): GovernanceCoherenceSnapshot | null {
  return getInstitutionalAlignmentStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectInstitutionalAlignmentSignals(
  organizationId: string
): readonly InstitutionalAlignmentSignal[] {
  return getInstitutionalAlignmentStore(organizationId).getState().alignmentSignals;
}

export function selectStrategicConsistencyIndicators(
  organizationId: string
): readonly StrategicConsistencyIndicator[] {
  return getInstitutionalAlignmentStore(organizationId).getState().consistencyIndicators;
}

export function selectOrganizationalIntegrityFields(
  organizationId: string
): readonly OrganizationalIntegrityField[] {
  return getInstitutionalAlignmentStore(organizationId).getState().integrityFields;
}

export function selectInstitutionalAlignmentSignature(organizationId: string): string {
  return getInstitutionalAlignmentStore(organizationId).getState().signature;
}
