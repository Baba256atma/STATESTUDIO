import { getInstitutionalRecallStore } from "./institutionalRecallStore";
import type {
  ExecutiveHistoricalReference,
  HistoricalContextFrame,
  HistoricalSituationReconstruction,
  InstitutionalRecallResult,
  InstitutionalRecallSnapshot,
  StrategicMemoryMatch,
} from "./institutionalRecallTypes";

/** Readonly selectors for future executive historical timelines and strategic context dashboards. */

export function selectInstitutionalRecallResults(
  organizationId: string
): readonly InstitutionalRecallResult[] {
  return getInstitutionalRecallStore(organizationId).getState().recalls;
}

export function selectHistoricalContextFrames(
  organizationId: string
): readonly HistoricalContextFrame[] {
  return getInstitutionalRecallStore(organizationId).getState().contextFrames;
}

export function selectExecutiveHistoricalReferences(
  organizationId: string
): readonly ExecutiveHistoricalReference[] {
  return getInstitutionalRecallStore(organizationId).getState().executiveReferences;
}

export function selectStrategicMemoryMatches(
  organizationId: string
): readonly StrategicMemoryMatch[] {
  return getInstitutionalRecallStore(organizationId).getState().strategicMatches;
}

export function selectHistoricalSituationReconstructions(
  organizationId: string
): readonly HistoricalSituationReconstruction[] {
  return getInstitutionalRecallStore(organizationId).getState().reconstructions;
}

export function selectInstitutionalRecallSnapshot(
  organizationId: string
): InstitutionalRecallSnapshot | null {
  const state = getInstitutionalRecallStore(organizationId).getState();
  if (state.recalls.length === 0) return null;

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    recallCount: state.recalls.length,
    contextFrameCount: state.contextFrames.length,
    reconstructionCount: state.reconstructions.length,
    recallSummary: `Organization retains ${state.recalls.length} institutional recall results.`,
    dominantCategories: Object.freeze(
      Array.from(new Set(state.recalls.map((r) => r.category))).slice(0, 4)
    ),
    recentRecalls: Object.freeze(state.recalls.slice(0, 6)),
    contextFrames: Object.freeze(state.contextFrames.slice(0, 6)),
    executiveReferences: Object.freeze(state.executiveReferences.slice(0, 4)),
    strategicMatches: Object.freeze(state.strategicMatches.slice(0, 6)),
    reconstructions: Object.freeze(state.reconstructions.slice(0, 6)),
  };
}

export function selectInstitutionalRecallSignature(organizationId: string): string {
  return getInstitutionalRecallStore(organizationId).getState().signature;
}
