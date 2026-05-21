import { getDistributedAdvisoryStore } from "./distributedAdvisoryStore";
import type {
  AdvisoryCoordinationSignal,
  CollectiveStrategicGuidanceSnapshot,
  DistributedExecutiveAdvisory,
  EnterpriseRecommendationConsensus,
  StrategicGuidanceField,
} from "./distributedAdvisoryTypes";

/** Readonly selectors for future collective advisory dashboards and guidance overlays. */

export function selectDistributedExecutiveAdvisories(
  organizationId: string
): readonly DistributedExecutiveAdvisory[] {
  return getDistributedAdvisoryStore(organizationId).getState().advisories;
}

export function selectCollectiveStrategicGuidanceSnapshots(
  organizationId: string
): readonly CollectiveStrategicGuidanceSnapshot[] {
  return getDistributedAdvisoryStore(organizationId).getState().snapshots;
}

export function selectLatestCollectiveStrategicGuidanceSnapshot(
  organizationId: string
): CollectiveStrategicGuidanceSnapshot | null {
  return getDistributedAdvisoryStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseRecommendationConsensus(
  organizationId: string
): readonly EnterpriseRecommendationConsensus[] {
  return getDistributedAdvisoryStore(organizationId).getState().recommendationConsensus;
}

export function selectAdvisoryCoordinationSignals(
  organizationId: string
): readonly AdvisoryCoordinationSignal[] {
  return getDistributedAdvisoryStore(organizationId).getState().coordinationSignals;
}

export function selectStrategicGuidanceFields(
  organizationId: string
): readonly StrategicGuidanceField[] {
  return getDistributedAdvisoryStore(organizationId).getState().guidanceFields;
}

export function selectDistributedAdvisorySignature(organizationId: string): string {
  return getDistributedAdvisoryStore(organizationId).getState().signature;
}
