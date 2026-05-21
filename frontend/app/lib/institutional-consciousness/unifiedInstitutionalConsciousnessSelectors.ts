import { getUnifiedInstitutionalConsciousnessStore } from "./unifiedInstitutionalConsciousnessStore";
import type {
  CivilizationScaleEnterpriseSnapshot,
  CivilizationScaleRuntimeSignal,
  InstitutionalConsciousnessRuntimeHistoryEntry,
  InstitutionalConsciousnessSubsystemState,
} from "./unifiedInstitutionalConsciousnessTypes";

/** Readonly selectors for future institutional-consciousness dashboards and macro-awareness surfaces. */

export function selectCivilizationScaleEnterpriseSnapshots(
  organizationId: string
): readonly CivilizationScaleEnterpriseSnapshot[] {
  return getUnifiedInstitutionalConsciousnessStore(organizationId).getState().enterpriseSnapshots;
}

export function selectLatestCivilizationScaleEnterpriseSnapshot(
  organizationId: string
): CivilizationScaleEnterpriseSnapshot | null {
  return (
    getUnifiedInstitutionalConsciousnessStore(organizationId).getState().enterpriseSnapshots[0] ??
    null
  );
}

export function selectInstitutionalConsciousnessSubsystemStates(
  organizationId: string
): readonly InstitutionalConsciousnessSubsystemState[] {
  return getUnifiedInstitutionalConsciousnessStore(organizationId).getState().subsystemStates;
}

export function selectInstitutionalConsciousnessRuntimeHistory(
  organizationId: string
): readonly InstitutionalConsciousnessRuntimeHistoryEntry[] {
  return getUnifiedInstitutionalConsciousnessStore(organizationId).getState().runtimeHistory;
}

export function selectCivilizationScaleRuntimeSignals(
  organizationId: string
): readonly CivilizationScaleRuntimeSignal[] {
  return (
    selectLatestCivilizationScaleEnterpriseSnapshot(organizationId)?.runtimeSignals ?? []
  );
}

export function selectUnifiedInstitutionalConsciousnessSignature(organizationId: string): string {
  return getUnifiedInstitutionalConsciousnessStore(organizationId).getState().signature;
}
