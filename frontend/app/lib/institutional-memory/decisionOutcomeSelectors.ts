import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import type {
  DecisionOutcomeSnapshot,
  ExecutiveConsequencePattern,
  InstitutionalDecisionRecord,
} from "./decisionOutcomeTypes";

/** Readonly selectors for future executive consequence dashboards and impact overlays. */

export function selectInstitutionalDecisionOutcomes(
  organizationId: string
): readonly InstitutionalDecisionRecord[] {
  return getDecisionOutcomeStore(organizationId).getState().decisions;
}

export function selectExecutiveConsequencePatterns(
  organizationId: string
): readonly ExecutiveConsequencePattern[] {
  return getDecisionOutcomeStore(organizationId).getState().patterns;
}

export function selectDecisionOutcomeSnapshot(
  organizationId: string
): DecisionOutcomeSnapshot | null {
  const state = getDecisionOutcomeStore(organizationId).getState();
  if (state.decisions.length === 0) return null;

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    outcomeCount: state.decisions.length,
    patternCount: state.patterns.length,
    consequenceSummary: `Organization retains ${state.decisions.length} decision consequence records.`,
    dominantCategories: Object.freeze(
      Array.from(new Set(state.decisions.map((d) => d.decisionCategory))).slice(0, 4)
    ),
    recentOutcomes: Object.freeze(state.decisions.slice(0, 6)),
    consequencePatterns: Object.freeze(state.patterns.slice(0, 6)),
    strategicCorrelations: Object.freeze(state.correlations.slice(0, 6)),
  };
}

export function selectDecisionOutcomeSignature(organizationId: string): string {
  return getDecisionOutcomeStore(organizationId).getState().signature;
}
