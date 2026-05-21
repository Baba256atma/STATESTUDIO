import { getUnifiedMetaCognitionStore } from "./unifiedMetaCognitionStore";
import type {
  CognitionGovernanceHistoryEntry,
  EnterpriseSelfReflectiveSnapshot,
  ExecutiveTrustRuntime,
  MetaCognitionSubsystemState,
  SelfRegulationPatternRecord,
  SurvivabilitySummaryRecord,
  UnifiedMetaCognitionRuntimeState,
} from "./unifiedMetaCognitionTypes";

/** Readonly selectors for future executive trust dashboards and self-reflective intelligence surfaces. */

export function selectUnifiedMetaCognitionRuntimeState(
  organizationId: string
): UnifiedMetaCognitionRuntimeState {
  return getUnifiedMetaCognitionStore(organizationId).getState();
}

export function selectEnterpriseSelfReflectiveSnapshots(
  organizationId: string
): readonly EnterpriseSelfReflectiveSnapshot[] {
  return getUnifiedMetaCognitionStore(organizationId).getState().selfReflectiveSnapshots;
}

export function selectLatestEnterpriseSelfReflectiveSnapshot(
  organizationId: string
): EnterpriseSelfReflectiveSnapshot | null {
  return getUnifiedMetaCognitionStore(organizationId).getState().selfReflectiveSnapshots[0] ?? null;
}

export function selectMetaCognitionSubsystemStates(
  organizationId: string
): readonly MetaCognitionSubsystemState[] {
  return getUnifiedMetaCognitionStore(organizationId).getState().subsystemStates;
}

export function selectCognitionGovernanceHistory(
  organizationId: string
): readonly CognitionGovernanceHistoryEntry[] {
  return getUnifiedMetaCognitionStore(organizationId).getState().governanceHistory;
}

export function selectExecutiveTrustRuntimeObservations(
  organizationId: string
): readonly ExecutiveTrustRuntime[] {
  return getUnifiedMetaCognitionStore(organizationId).getState().trustRuntimeObservations;
}

export function selectSurvivabilitySummaryRecords(
  organizationId: string
): readonly SurvivabilitySummaryRecord[] {
  return getUnifiedMetaCognitionStore(organizationId).getState().survivabilitySummaries;
}

export function selectSelfRegulationPatternRecords(
  organizationId: string
): readonly SelfRegulationPatternRecord[] {
  return getUnifiedMetaCognitionStore(organizationId).getState().selfRegulationPatterns;
}

export function selectUnifiedMetaCognitionSignature(organizationId: string): string {
  return getUnifiedMetaCognitionStore(organizationId).getState().signature;
}
