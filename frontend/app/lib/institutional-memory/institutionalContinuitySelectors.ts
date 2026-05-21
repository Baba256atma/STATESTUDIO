import { continuityRank } from "./institutionalContinuityGuards";
import { getInstitutionalContinuityStore } from "./institutionalContinuityStore";
import type {
  ContinuityLevel,
  InstitutionalKnowledgeAnchor,
  InstitutionalWisdomArtifact,
  OrganizationalContinuitySnapshot,
  StrategicKnowledgeContinuityRecord,
} from "./institutionalContinuityTypes";

/** Readonly selectors for future organizational wisdom dashboards and continuity timelines. */

export function selectInstitutionalWisdomArtifacts(
  organizationId: string
): readonly InstitutionalWisdomArtifact[] {
  return getInstitutionalContinuityStore(organizationId).getState().artifacts;
}

export function selectStrategicKnowledgeContinuityRecords(
  organizationId: string
): readonly StrategicKnowledgeContinuityRecord[] {
  return getInstitutionalContinuityStore(organizationId).getState().continuityRecords;
}

export function selectInstitutionalKnowledgeAnchors(
  organizationId: string
): readonly InstitutionalKnowledgeAnchor[] {
  return getInstitutionalContinuityStore(organizationId).getState().knowledgeAnchors;
}

export function selectOrganizationalContinuitySnapshot(
  organizationId: string
): OrganizationalContinuitySnapshot | null {
  const state = getInstitutionalContinuityStore(organizationId).getState();
  if (state.artifacts.length === 0) return null;

  const dominantContinuityLevel = state.artifacts.reduce<ContinuityLevel>(
    (best, a) => (continuityRank(a.continuityLevel) > continuityRank(best) ? a.continuityLevel : best),
    state.artifacts[0]!.continuityLevel
  );

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    artifactCount: state.artifacts.length,
    anchorCount: state.knowledgeAnchors.length,
    continuitySummary: `Organization preserves ${state.artifacts.length} institutional wisdom artifacts.`,
    dominantCategories: Object.freeze(
      Array.from(new Set(state.artifacts.map((a) => a.category))).slice(0, 4)
    ),
    dominantContinuityLevel,
    recentArtifacts: Object.freeze(state.artifacts.slice(0, 6)),
    continuityRecords: Object.freeze(state.continuityRecords.slice(0, 6)),
    preservationSignals: Object.freeze(state.preservationSignals.slice(0, 6)),
    knowledgeAnchors: Object.freeze(state.knowledgeAnchors.slice(0, 6)),
  };
}

export function selectInstitutionalContinuitySignature(organizationId: string): string {
  return getInstitutionalContinuityStore(organizationId).getState().signature;
}
