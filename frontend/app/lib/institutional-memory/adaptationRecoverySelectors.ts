import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import type {
  AdaptationRecoverySnapshot,
  OrganizationalAdaptationRecord,
  StrategicRecoveryPattern,
} from "./adaptationRecoveryTypes";

/** Readonly selectors for future resilience dashboards and adaptation timelines. */

export function selectOrganizationalAdaptationRecords(
  organizationId: string
): readonly OrganizationalAdaptationRecord[] {
  return getAdaptationRecoveryStore(organizationId).getState().adaptations;
}

export function selectStrategicRecoveryPatterns(
  organizationId: string
): readonly StrategicRecoveryPattern[] {
  return getAdaptationRecoveryStore(organizationId).getState().patterns;
}

export function selectAdaptationRecoverySnapshot(
  organizationId: string
): AdaptationRecoverySnapshot | null {
  const state = getAdaptationRecoveryStore(organizationId).getState();
  if (state.adaptations.length === 0) return null;

  const stability =
    state.adaptations.find((a) => a.recoveryStability === "highly_resilient")?.recoveryStability ??
    state.adaptations.find((a) => a.recoveryStability === "resilient")?.recoveryStability ??
    state.adaptations[0]?.recoveryStability ??
    "unstable";

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    adaptationCount: state.adaptations.length,
    patternCount: state.patterns.length,
    recoverySummary: `Organization retains ${state.adaptations.length} adaptation recovery records.`,
    dominantAdaptationTypes: Object.freeze(
      Array.from(new Set(state.adaptations.map((a) => a.adaptationType))).slice(0, 4)
    ),
    recoveryStability: stability,
    recentAdaptations: Object.freeze(state.adaptations.slice(0, 6)),
    recoveryPatterns: Object.freeze(state.patterns.slice(0, 6)),
    resilienceObservations: Object.freeze(state.resilienceObservations.slice(0, 4)),
  };
}

export function selectAdaptationRecoverySignature(organizationId: string): string {
  return getAdaptationRecoveryStore(organizationId).getState().signature;
}
