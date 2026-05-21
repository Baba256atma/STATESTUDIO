import { getFinalHardeningStore } from "./finalHardeningStore";
import type {
  FinalHardeningHistoryEntry,
  FinalStabilizationChecklist,
  HardeningRisk,
  MVPFinalHardeningSnapshot,
} from "./finalStabilizationChecklistTypes";

export function selectMVPFinalHardeningSnapshots(
  organizationId: string
): readonly MVPFinalHardeningSnapshot[] {
  return getFinalHardeningStore(organizationId).getState().hardeningSnapshots;
}

export function selectLatestMVPFinalHardeningSnapshot(
  organizationId: string
): MVPFinalHardeningSnapshot | null {
  return getFinalHardeningStore(organizationId).getState().hardeningSnapshots[0] ?? null;
}

export function selectFinalStabilizationChecklistHistory(
  organizationId: string
): readonly FinalStabilizationChecklist[] {
  return getFinalHardeningStore(organizationId).getState().checklistHistory;
}

export function selectFinalHardeningBlockerHistory(organizationId: string): readonly HardeningRisk[] {
  return getFinalHardeningStore(organizationId).getState().blockerHistory;
}

export function selectFinalHardeningHistory(
  organizationId: string
): readonly FinalHardeningHistoryEntry[] {
  return getFinalHardeningStore(organizationId).getState().releaseCandidateHistory;
}

export function selectFinalHardeningSignature(organizationId: string): string {
  return getFinalHardeningStore(organizationId).getState().signature;
}
