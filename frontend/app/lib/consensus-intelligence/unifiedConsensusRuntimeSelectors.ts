import { getUnifiedConsensusRuntimeStore } from "./unifiedConsensusRuntimeStore";
import type {
  ConsensusRuntimeHistoryEntry,
  ConsensusSubsystemState,
  DistributedExecutiveCognitionSnapshot,
} from "./unifiedConsensusRuntimeTypes";

/** Readonly selectors for future enterprise consensus dashboards and distributed cognition overlays. */

export function selectDistributedExecutiveCognitionSnapshots(
  organizationId: string
): readonly DistributedExecutiveCognitionSnapshot[] {
  return getUnifiedConsensusRuntimeStore(organizationId).getState().cognitionSnapshots;
}

export function selectLatestDistributedExecutiveCognitionSnapshot(
  organizationId: string
): DistributedExecutiveCognitionSnapshot | null {
  return getUnifiedConsensusRuntimeStore(organizationId).getState().cognitionSnapshots[0] ?? null;
}

export function selectConsensusSubsystemStates(
  organizationId: string
): readonly ConsensusSubsystemState[] {
  return getUnifiedConsensusRuntimeStore(organizationId).getState().subsystemStates;
}

export function selectConsensusRuntimeHistory(
  organizationId: string
): readonly ConsensusRuntimeHistoryEntry[] {
  return getUnifiedConsensusRuntimeStore(organizationId).getState().runtimeHistory;
}

export function selectUnifiedConsensusRuntimeSignature(organizationId: string): string {
  return getUnifiedConsensusRuntimeStore(organizationId).getState().signature;
}
