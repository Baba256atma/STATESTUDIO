import { getFinalMVPCompletionStore } from "./finalMVPCompletionStore";
import type {
  FinalMVPCompletionHistoryEntry,
  FinalMVPCompletionSnapshot,
} from "./finalMVPCompletionTypes";

export function selectFinalMVPCompletionSnapshots(
  organizationId: string
): readonly FinalMVPCompletionSnapshot[] {
  return getFinalMVPCompletionStore(organizationId).getState().completionSnapshots;
}

export function selectLatestFinalMVPCompletionSnapshot(
  organizationId: string
): FinalMVPCompletionSnapshot | null {
  return getFinalMVPCompletionStore(organizationId).getState().completionSnapshots[0] ?? null;
}

export function selectFinalMVPReadinessHistory(
  organizationId: string
): readonly FinalMVPCompletionHistoryEntry[] {
  return getFinalMVPCompletionStore(organizationId).getState().readinessHistory;
}

export function selectFinalMVPBlockerHistory(organizationId: string): readonly string[] {
  return getFinalMVPCompletionStore(organizationId).getState().blockerHistory;
}

export function selectFinalMVPCompletionSignature(organizationId: string): string {
  return getFinalMVPCompletionStore(organizationId).getState().signature;
}
