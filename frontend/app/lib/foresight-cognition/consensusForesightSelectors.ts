import { getConsensusForesightStore } from "./consensusForesightStore";
import type {
  AdvisoryPerspectiveSignal,
  ConsensusAlignmentScore,
  MultiPerspectiveRecommendation,
  StrategicConsensusSnapshot,
  StrategicDisagreementSignal,
} from "./consensusForesightTypes";

/** Readonly selectors for future executive consensus dashboards and advisory alignment panels. */

export function selectMultiPerspectiveRecommendations(
  organizationId: string
): readonly MultiPerspectiveRecommendation[] {
  return getConsensusForesightStore(organizationId).getState().multiPerspectiveRecommendations;
}

export function selectStrategicConsensusSnapshots(
  organizationId: string
): readonly StrategicConsensusSnapshot[] {
  return getConsensusForesightStore(organizationId).getState().snapshots;
}

export function selectLatestStrategicConsensusSnapshot(
  organizationId: string
): StrategicConsensusSnapshot | null {
  return getConsensusForesightStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectAdvisoryPerspectiveSignals(
  organizationId: string
): readonly AdvisoryPerspectiveSignal[] {
  return getConsensusForesightStore(organizationId).getState().perspectiveSignals;
}

export function selectConsensusAlignmentScores(
  organizationId: string
): readonly ConsensusAlignmentScore[] {
  return getConsensusForesightStore(organizationId).getState().alignmentScores;
}

export function selectStrategicDisagreementSignals(
  organizationId: string
): readonly StrategicDisagreementSignal[] {
  return getConsensusForesightStore(organizationId).getState().disagreementSignals;
}

export function selectConsensusForesightSignature(organizationId: string): string {
  return getConsensusForesightStore(organizationId).getState().signature;
}
