import { integrityRank } from "./institutionalGovernanceGuards";
import { getInstitutionalGovernanceStore } from "./institutionalGovernanceStore";
import type {
  CognitiveIntegritySignal,
  InstitutionalLearningGovernanceAggregateSnapshot,
  InstitutionalLearningGovernanceSnapshot,
  StrategicTrustValidation,
} from "./institutionalGovernanceTypes";

/** Readonly selectors for future institutional trust dashboards and cognitive integrity overlays. */

export function selectInstitutionalLearningGovernanceSnapshots(
  organizationId: string
): readonly InstitutionalLearningGovernanceSnapshot[] {
  return getInstitutionalGovernanceStore(organizationId).getState().snapshots;
}

export function selectCognitiveIntegritySignals(
  organizationId: string
): readonly CognitiveIntegritySignal[] {
  return getInstitutionalGovernanceStore(organizationId).getState().integritySignals;
}

export function selectStrategicTrustValidations(
  organizationId: string
): readonly StrategicTrustValidation[] {
  return getInstitutionalGovernanceStore(organizationId).getState().trustValidations;
}

export function selectInstitutionalLearningGovernanceSnapshot(
  organizationId: string
): InstitutionalLearningGovernanceAggregateSnapshot | null {
  const state = getInstitutionalGovernanceStore(organizationId).getState();
  if (state.snapshots.length === 0) return null;

  const integrityLevel = state.snapshots.reduce(
    (best, s) => (integrityRank(s.integrityLevel) > integrityRank(best) ? s.integrityLevel : best),
    state.snapshots[0]!.integrityLevel
  );

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    governanceStatus: state.lastGovernanceStatus ?? state.snapshots[0]!.governanceStatus,
    integrityLevel,
    governanceSummary: `Organization retains ${state.snapshots.length} governance integrity snapshots.`,
    snapshotCount: state.snapshots.length,
    trustValidationCount: state.trustValidations.length,
    dominantTrustCategories: Object.freeze(
      Array.from(new Set(state.integritySignals.map((s) => s.category))).slice(0, 4)
    ),
    recentGovernanceSnapshots: Object.freeze(state.snapshots.slice(0, 6)),
    integritySignals: Object.freeze(state.integritySignals.slice(0, 6)),
    trustValidations: Object.freeze(state.trustValidations.slice(0, 6)),
    learningHealth: state.learningHealth,
    consistencyObservations: Object.freeze(state.consistencyObservations.slice(0, 6)),
  };
}

export function selectInstitutionalGovernanceSignature(organizationId: string): string {
  return getInstitutionalGovernanceStore(organizationId).getState().signature;
}
