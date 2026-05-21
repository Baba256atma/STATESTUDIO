import { maturityRank, trendRank } from "./institutionalMaturityGuards";
import { getInstitutionalMaturityStore } from "./institutionalMaturityStore";
import type {
  EvolutionTrend,
  InstitutionalMaturityLevel,
  InstitutionalIntelligenceMaturitySnapshot,
  InstitutionalMaturitySnapshot,
  IntelligenceMaturitySignal,
  OrganizationalLearningEvolution,
  ResilienceMaturityTrend,
  StrategicAdaptationProgress,
} from "./institutionalMaturityTypes";

/** Readonly selectors for future organizational maturity dashboards and evolution overlays. */

export function selectInstitutionalMaturitySnapshots(
  organizationId: string
): readonly InstitutionalMaturitySnapshot[] {
  return getInstitutionalMaturityStore(organizationId).getState().snapshots;
}

export function selectOrganizationalLearningEvolutions(
  organizationId: string
): readonly OrganizationalLearningEvolution[] {
  return getInstitutionalMaturityStore(organizationId).getState().evolutions;
}

export function selectIntelligenceMaturitySignals(
  organizationId: string
): readonly IntelligenceMaturitySignal[] {
  return getInstitutionalMaturityStore(organizationId).getState().signals;
}

export function selectResilienceMaturityTrends(
  organizationId: string
): readonly ResilienceMaturityTrend[] {
  return getInstitutionalMaturityStore(organizationId).getState().resilienceTrends;
}

export function selectStrategicAdaptationProgress(
  organizationId: string
): readonly StrategicAdaptationProgress[] {
  return getInstitutionalMaturityStore(organizationId).getState().adaptationProgress;
}

export function selectInstitutionalIntelligenceMaturitySnapshot(
  organizationId: string
): InstitutionalIntelligenceMaturitySnapshot | null {
  const state = getInstitutionalMaturityStore(organizationId).getState();
  if (state.snapshots.length === 0) return null;

  const dominantMaturityLevel = state.snapshots.reduce<InstitutionalMaturityLevel>(
    (best, s) => (maturityRank(s.maturityLevel) > maturityRank(best) ? s.maturityLevel : best),
    state.snapshots[0]!.maturityLevel
  );

  const dominantEvolutionTrend = state.snapshots.reduce<EvolutionTrend>(
    (best, s) => (trendRank(s.evolutionTrend) > trendRank(best) ? s.evolutionTrend : best),
    state.snapshots[0]!.evolutionTrend
  );

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    snapshotCount: state.snapshots.length,
    dominantMaturityLevel,
    dominantEvolutionTrend,
    maturitySummary: `Organization retains ${state.snapshots.length} institutional maturity snapshots.`,
    dominantCategories: Object.freeze(
      Array.from(new Set(state.snapshots.map((s) => s.category))).slice(0, 4)
    ),
    recentSnapshots: Object.freeze(state.snapshots.slice(0, 6)),
    learningEvolutions: Object.freeze(state.evolutions.slice(0, 6)),
    maturitySignals: Object.freeze(state.signals.slice(0, 6)),
    resilienceTrends: Object.freeze(state.resilienceTrends.slice(0, 4)),
    adaptationProgress: Object.freeze(state.adaptationProgress.slice(0, 6)),
  };
}

export function selectInstitutionalMaturitySignature(organizationId: string): string {
  return getInstitutionalMaturityStore(organizationId).getState().signature;
}
