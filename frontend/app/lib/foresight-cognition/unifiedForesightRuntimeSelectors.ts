import { getUnifiedForesightRuntimeStore } from "./unifiedForesightRuntimeStore";
import type {
  EnterpriseAnticipatorySnapshot,
  UnifiedForesightRuntimeState,
} from "./unifiedForesightRuntimeTypes";

/** Readonly selectors for future executive foresight dashboards and anticipatory panels. */

export function selectEnterpriseAnticipatorySnapshots(
  organizationId: string
): readonly EnterpriseAnticipatorySnapshot[] {
  return getUnifiedForesightRuntimeStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseAnticipatorySnapshot(
  organizationId: string
): EnterpriseAnticipatorySnapshot | null {
  return getUnifiedForesightRuntimeStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectUnifiedForesightRuntimeState(
  organizationId: string
): UnifiedForesightRuntimeState {
  const store = getUnifiedForesightRuntimeStore(organizationId).getState();
  const latest = store.snapshots[0] ?? null;
  return {
    organizationId: organizationId.trim() || "nexora-default",
    latestSnapshot: latest,
    foresightHistory: store.snapshots,
    runtimeStatus: store.runtimeStatus,
    signature: store.signature,
    updatedAt: store.updatedAt,
    lastEvaluationSignature: store.lastEvaluationSignature,
    lastRuntimeStatus: store.lastRuntimeStatus,
  };
}

export function selectForesightRuntimeSummaries(
  organizationId: string
): readonly { summaryId: string; headline: string; generatedAt: number }[] {
  return getUnifiedForesightRuntimeStore(organizationId).getState().foresightSummaries;
}

export function selectUnifiedForesightRuntimeSignature(organizationId: string): string {
  return getUnifiedForesightRuntimeStore(organizationId).getState().signature;
}
