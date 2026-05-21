import { getUnifiedTemporalCognitionStore } from "./unifiedTemporalCognitionStore";
import type {
  EnterpriseTimeIntelligenceSnapshot,
  UnifiedTemporalCognitionState,
} from "./unifiedTemporalCognitionTypes";

/** Readonly selectors for future executive temporal dashboards and chronology overlays. */

export function selectEnterpriseTimeIntelligenceSnapshots(
  organizationId: string
): readonly EnterpriseTimeIntelligenceSnapshot[] {
  return getUnifiedTemporalCognitionStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseTimeIntelligenceSnapshot(
  organizationId: string
): EnterpriseTimeIntelligenceSnapshot | null {
  return getUnifiedTemporalCognitionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectUnifiedTemporalCognitionState(
  organizationId: string
): UnifiedTemporalCognitionState {
  const store = getUnifiedTemporalCognitionStore(organizationId).getState();
  return {
    organizationId,
    latestSnapshot: store.snapshots[0] ?? null,
    cognitionHistory: store.snapshots,
    runtimeStatus: store.runtimeStatus,
    signature: store.signature,
    updatedAt: store.updatedAt,
    lastEvaluationSignature: store.lastEvaluationSignature,
    lastRuntimeStatus: store.lastRuntimeStatus,
  };
}

export function selectOrganizationalEvolutionSummaries(organizationId: string) {
  return getUnifiedTemporalCognitionStore(organizationId).getState().evolutionSummaries;
}

export function selectUnifiedTemporalCognitionSignature(organizationId: string): string {
  return getUnifiedTemporalCognitionStore(organizationId).getState().signature;
}

export function selectUnifiedTemporalRuntimeStatus(organizationId: string) {
  return getUnifiedTemporalCognitionStore(organizationId).getState().runtimeStatus;
}
