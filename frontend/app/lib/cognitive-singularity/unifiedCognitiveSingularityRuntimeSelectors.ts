import { getUnifiedCognitiveSingularityRuntimeStore } from "./unifiedCognitiveSingularityRuntimeStore";
import type {
  CognitiveSingularitySubsystemState,
  FinalEnterpriseIntelligenceSignal,
  FinalStrategicIntelligenceSnapshot,
  UnifiedCognitiveSingularityRuntimeHistoryEntry,
} from "./unifiedCognitiveSingularityRuntimeTypes";

/** Readonly selectors for future final strategic intelligence dashboards and runtime panels. */

export function selectFinalStrategicIntelligenceSnapshots(
  organizationId: string
): readonly FinalStrategicIntelligenceSnapshot[] {
  return getUnifiedCognitiveSingularityRuntimeStore(organizationId).getState().finalSnapshots;
}

export function selectLatestFinalStrategicIntelligenceSnapshot(
  organizationId: string
): FinalStrategicIntelligenceSnapshot | null {
  return getUnifiedCognitiveSingularityRuntimeStore(organizationId).getState().finalSnapshots[0] ?? null;
}

export function selectCognitiveSingularitySubsystemStates(
  organizationId: string
): readonly CognitiveSingularitySubsystemState[] {
  return getUnifiedCognitiveSingularityRuntimeStore(organizationId).getState().subsystemStates;
}

export function selectFinalEnterpriseIntelligenceSignals(
  organizationId: string
): readonly FinalEnterpriseIntelligenceSignal[] {
  return (
    selectLatestFinalStrategicIntelligenceSnapshot(organizationId)?.finalEnterpriseIntelligenceSignals ??
    []
  );
}

export function selectUnifiedCognitiveSingularityRuntimeHistory(
  organizationId: string
): readonly UnifiedCognitiveSingularityRuntimeHistoryEntry[] {
  return getUnifiedCognitiveSingularityRuntimeStore(organizationId).getState().runtimeHistory;
}

export function selectUnifiedCognitiveSingularityRuntimeSignature(organizationId: string): string {
  return getUnifiedCognitiveSingularityRuntimeStore(organizationId).getState().signature;
}
