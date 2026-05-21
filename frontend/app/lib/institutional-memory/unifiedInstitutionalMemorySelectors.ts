import { getUnifiedInstitutionalMemoryStore } from "./unifiedInstitutionalMemoryStore";
import type {
  EnterpriseMemoryCognitionSnapshot,
  UnifiedInstitutionalMemoryState,
} from "./unifiedInstitutionalMemoryTypes";

/** Readonly selectors for future executive institutional dashboards and cognition timelines. */

export function selectEnterpriseMemoryCognitionSnapshots(
  organizationId: string
): readonly EnterpriseMemoryCognitionSnapshot[] {
  return getUnifiedInstitutionalMemoryStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseMemorySnapshot(
  organizationId: string
): EnterpriseMemoryCognitionSnapshot | null {
  return getUnifiedInstitutionalMemoryStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectUnifiedInstitutionalMemoryState(
  organizationId: string
): UnifiedInstitutionalMemoryState | null {
  const storeState = getUnifiedInstitutionalMemoryStore(organizationId).getState();
  const latest = storeState.snapshots[0] ?? null;
  if (!latest) return null;

  return {
    organizationId,
    latestSnapshot: latest,
    cognitionHistory: Object.freeze(storeState.snapshots.slice(0, 8)),
    runtimeStatus: storeState.runtimeStatus,
    signature: storeState.signature,
    updatedAt: storeState.updatedAt,
    lastEvaluationSignature: storeState.lastEvaluationSignature,
    lastRuntimeStatus: storeState.lastRuntimeStatus,
  };
}

export function selectUnifiedInstitutionalMemorySignature(organizationId: string): string {
  return getUnifiedInstitutionalMemoryStore(organizationId).getState().signature;
}
