import { getUnifiedDecisionRuntimeStore } from "./unifiedDecisionRuntimeStore";
import type {
  DecisionSubsystemState,
  EnterpriseStrategicActionSnapshot,
  UnifiedDecisionRuntimeState,
} from "./unifiedDecisionRuntimeTypes";

/** Readonly selectors for future executive orchestration dashboards and action intelligence surfaces. */

export function selectUnifiedDecisionRuntimeSnapshots(
  organizationId: string
): readonly EnterpriseStrategicActionSnapshot[] {
  return getUnifiedDecisionRuntimeStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseStrategicActionSnapshot(
  organizationId: string
): EnterpriseStrategicActionSnapshot | null {
  return getUnifiedDecisionRuntimeStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectUnifiedDecisionRuntimeState(
  organizationId: string
): UnifiedDecisionRuntimeState {
  const store = getUnifiedDecisionRuntimeStore(organizationId).getState();
  return {
    organizationId: organizationId.trim() || "nexora-default",
    latestSnapshot: store.snapshots[0] ?? null,
    actionHistory: store.snapshots,
    runtimeStatus: store.runtimeStatus,
    signature: store.signature,
    updatedAt: store.updatedAt,
    lastEvaluationSignature: store.lastEvaluationSignature,
    lastRuntimeStatus: store.lastRuntimeStatus,
  };
}

export function selectDecisionSubsystemHealthRecords(organizationId: string) {
  return getUnifiedDecisionRuntimeStore(organizationId).getState().subsystemHealthRecords;
}

export function selectStrategicActionHistory(organizationId: string) {
  return getUnifiedDecisionRuntimeStore(organizationId).getState().strategicActionHistory;
}

export function selectOrchestrationSummaries(organizationId: string) {
  return getUnifiedDecisionRuntimeStore(organizationId).getState().orchestrationSummaries;
}

export function selectLatestDecisionSubsystemStates(
  organizationId: string
): readonly DecisionSubsystemState[] {
  return (
    getUnifiedDecisionRuntimeStore(organizationId).getState().snapshots[0]?.subsystemStates ?? []
  );
}

export function selectUnifiedDecisionRuntimeSignature(organizationId: string): string {
  return getUnifiedDecisionRuntimeStore(organizationId).getState().signature;
}
