import { getAdvisoryForesightStore } from "./advisoryForesightStore";
import type {
  AdvisoryPriorityField,
  EnterpriseRecommendationSnapshot,
  ExecutiveGuidanceRecommendation,
  OrganizationalFocusSuggestion,
  StrategicAdvisorySignal,
} from "./advisoryForesightTypes";

/** Readonly selectors for future executive advisory dashboards and guidance panels. */

export function selectExecutiveGuidanceRecommendations(
  organizationId: string
): readonly ExecutiveGuidanceRecommendation[] {
  return getAdvisoryForesightStore(organizationId).getState().executiveGuidanceRecommendations;
}

export function selectEnterpriseRecommendationSnapshots(
  organizationId: string
): readonly EnterpriseRecommendationSnapshot[] {
  return getAdvisoryForesightStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseRecommendationSnapshot(
  organizationId: string
): EnterpriseRecommendationSnapshot | null {
  return getAdvisoryForesightStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicAdvisorySignals(
  organizationId: string
): readonly StrategicAdvisorySignal[] {
  return getAdvisoryForesightStore(organizationId).getState().strategicAdvisorySignals;
}

export function selectOrganizationalFocusSuggestions(
  organizationId: string
): readonly OrganizationalFocusSuggestion[] {
  return getAdvisoryForesightStore(organizationId).getState().organizationalFocusSuggestions;
}

export function selectAdvisoryPriorityFields(
  organizationId: string
): readonly AdvisoryPriorityField[] {
  return getAdvisoryForesightStore(organizationId).getState().advisoryPriorityFields;
}

export function selectAdvisoryForesightSignature(organizationId: string): string {
  return getAdvisoryForesightStore(organizationId).getState().signature;
}
