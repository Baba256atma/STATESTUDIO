import { getConsensusIntelligenceStore } from "./consensusIntelligenceStore";
import type {
  ConsensusAlignmentField,
  EnterprisePerspectiveConflict,
  ExecutiveReasoningPerspective,
  MultiAgentReasoningSignal,
  StrategicConsensusRecord,
  StrategicConsensusSnapshot,
} from "./consensusIntelligenceTypes";

/** Readonly selectors for future executive consensus dashboards and perspective-comparison overlays. */

export function selectExecutiveReasoningPerspectives(
  organizationId: string
): readonly ExecutiveReasoningPerspective[] {
  return getConsensusIntelligenceStore(organizationId).getState().reasoningPerspectives;
}

export function selectStrategicConsensusRecords(
  organizationId: string
): readonly StrategicConsensusRecord[] {
  return getConsensusIntelligenceStore(organizationId).getState().consensusRecords;
}

export function selectStrategicConsensusSnapshots(
  organizationId: string
): readonly StrategicConsensusSnapshot[] {
  return getConsensusIntelligenceStore(organizationId).getState().snapshots;
}

export function selectLatestStrategicConsensusSnapshot(
  organizationId: string
): StrategicConsensusSnapshot | null {
  return getConsensusIntelligenceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterprisePerspectiveConflicts(
  organizationId: string
): readonly EnterprisePerspectiveConflict[] {
  return getConsensusIntelligenceStore(organizationId).getState().perspectiveConflicts;
}

export function selectMultiAgentReasoningSignals(
  organizationId: string
): readonly MultiAgentReasoningSignal[] {
  return getConsensusIntelligenceStore(organizationId).getState().multiAgentSignals;
}

export function selectConsensusAlignmentFields(
  organizationId: string
): readonly ConsensusAlignmentField[] {
  return getConsensusIntelligenceStore(organizationId).getState().alignmentFields;
}

export function selectConsensusIntelligenceSignature(organizationId: string): string {
  return getConsensusIntelligenceStore(organizationId).getState().signature;
}
