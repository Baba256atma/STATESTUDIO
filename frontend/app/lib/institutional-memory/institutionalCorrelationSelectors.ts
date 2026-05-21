import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import type {
  InstitutionalCorrelation,
  LearningConsolidationSnapshot,
  OrganizationalLearningPattern,
  StrategicExperienceLink,
} from "./institutionalCorrelationTypes";

/** Readonly selectors for future learning graphs, memory maps, and timeline overlays. */

export function selectInstitutionalCorrelations(
  organizationId: string
): readonly InstitutionalCorrelation[] {
  return getInstitutionalCorrelationStore(organizationId).getState().correlations;
}

export function selectStrategicExperienceLinks(
  organizationId: string
): readonly StrategicExperienceLink[] {
  return getInstitutionalCorrelationStore(organizationId).getState().links;
}

export function selectOrganizationalLearningPatterns(
  organizationId: string
): readonly OrganizationalLearningPattern[] {
  return getInstitutionalCorrelationStore(organizationId).getState().patterns;
}

export function selectLearningConsolidationSnapshot(
  organizationId: string
): LearningConsolidationSnapshot | null {
  const state = getInstitutionalCorrelationStore(organizationId).getState();
  if (state.correlations.length === 0) return null;

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    correlationCount: state.correlations.length,
    patternCount: state.patterns.length,
    linkCount: state.links.length,
    consolidationSummary: `Organization retains ${state.correlations.length} correlated experience chains.`,
    dominantPatterns: Object.freeze(
      Array.from(new Set(state.patterns.map((p) => p.category))).slice(0, 4)
    ),
    strongCorrelations: Object.freeze(
      state.correlations.filter((c) => c.strength === "strong" || c.strength === "systemic").slice(0, 6)
    ),
    consolidatedPatterns: Object.freeze(state.patterns.slice(0, 6)),
  };
}

export function selectInstitutionalCorrelationSignature(organizationId: string): string {
  return getInstitutionalCorrelationStore(organizationId).getState().signature;
}
