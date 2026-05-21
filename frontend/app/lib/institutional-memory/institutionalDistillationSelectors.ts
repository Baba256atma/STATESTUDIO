import { getInstitutionalDistillationStore } from "./institutionalDistillationStore";
import type {
  DistilledInstitutionalInsight,
  InstitutionalCompressionSnapshot,
  OrganizationalWisdomPattern,
  StrategicKnowledgeArtifact,
} from "./institutionalDistillationTypes";

/** Readonly selectors for future executive wisdom dashboards and institutional intelligence panels. */

export function selectDistilledInstitutionalInsights(
  organizationId: string
): readonly DistilledInstitutionalInsight[] {
  return getInstitutionalDistillationStore(organizationId).getState().insights;
}

export function selectStrategicKnowledgeArtifacts(
  organizationId: string
): readonly StrategicKnowledgeArtifact[] {
  return getInstitutionalDistillationStore(organizationId).getState().artifacts;
}

export function selectInstitutionalCompressionSnapshot(
  organizationId: string
): InstitutionalCompressionSnapshot | null {
  const state = getInstitutionalDistillationStore(organizationId).getState();
  if (state.insights.length === 0) return null;

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    insightCount: state.insights.length,
    artifactCount: state.artifacts.length,
    wisdomPatternCount: state.wisdomPatterns.length,
    distillationSummary: `Organization retains ${state.insights.length} distilled strategic insights.`,
    dominantCategories: Object.freeze(
      Array.from(new Set(state.insights.map((i) => i.category))).slice(0, 4)
    ),
    recentInsights: Object.freeze(state.insights.slice(0, 6)),
    strategicArtifacts: Object.freeze(state.artifacts.slice(0, 6)),
    executiveSummary: state.summaries[0] ?? null,
    wisdomPatterns: Object.freeze(state.wisdomPatterns.slice(0, 6)),
  };
}

export function selectOrganizationalWisdomPatterns(
  organizationId: string
): readonly OrganizationalWisdomPattern[] {
  return getInstitutionalDistillationStore(organizationId).getState().wisdomPatterns;
}

export function selectInstitutionalDistillationSignature(organizationId: string): string {
  return getInstitutionalDistillationStore(organizationId).getState().signature;
}
