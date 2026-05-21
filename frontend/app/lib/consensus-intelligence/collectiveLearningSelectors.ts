import { getCollectiveLearningStore } from "./collectiveLearningStore";
import type {
  DistributedStrategicLearningSignal,
  EnterpriseIntelligenceEvolution,
  ExecutiveCollectiveLearningSnapshot,
  PerspectiveLearningField,
  StrategicMaturityObservation,
} from "./collectiveLearningTypes";

/** Readonly selectors for future collective-learning dashboards and evolution overlays. */

export function selectEnterpriseIntelligenceEvolutions(
  organizationId: string
): readonly EnterpriseIntelligenceEvolution[] {
  return getCollectiveLearningStore(organizationId).getState().evolutions;
}

export function selectExecutiveCollectiveLearningSnapshots(
  organizationId: string
): readonly ExecutiveCollectiveLearningSnapshot[] {
  return getCollectiveLearningStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveCollectiveLearningSnapshot(
  organizationId: string
): ExecutiveCollectiveLearningSnapshot | null {
  return getCollectiveLearningStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectDistributedStrategicLearningSignals(
  organizationId: string
): readonly DistributedStrategicLearningSignal[] {
  return getCollectiveLearningStore(organizationId).getState().learningSignals;
}

export function selectStrategicMaturityObservations(
  organizationId: string
): readonly StrategicMaturityObservation[] {
  return getCollectiveLearningStore(organizationId).getState().maturityObservations;
}

export function selectPerspectiveLearningFields(
  organizationId: string
): readonly PerspectiveLearningField[] {
  return getCollectiveLearningStore(organizationId).getState().learningFields;
}

export function selectCollectiveLearningSignature(organizationId: string): string {
  return getCollectiveLearningStore(organizationId).getState().signature;
}
