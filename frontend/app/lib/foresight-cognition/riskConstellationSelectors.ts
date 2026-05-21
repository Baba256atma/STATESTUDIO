import { getRiskConstellationStore } from "./riskConstellationStore";
import type {
  DistributedInstabilityPattern,
  EnterpriseRiskConstellation,
  MultiSignalPressureCluster,
  RiskConstellationSnapshot,
  StrategicRiskEmergence,
  WeakSignalCorrelation,
} from "./riskConstellationTypes";

/** Readonly selectors for future risk constellation overlays and cluster maps. */

export function selectEnterpriseRiskConstellations(
  organizationId: string
): readonly EnterpriseRiskConstellation[] {
  return getRiskConstellationStore(organizationId).getState().constellations;
}

export function selectRiskConstellationSnapshots(
  organizationId: string
): readonly RiskConstellationSnapshot[] {
  return getRiskConstellationStore(organizationId).getState().snapshots;
}

export function selectLatestRiskConstellationSnapshot(
  organizationId: string
): RiskConstellationSnapshot | null {
  return getRiskConstellationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectWeakSignalCorrelations(
  organizationId: string
): readonly WeakSignalCorrelation[] {
  return getRiskConstellationStore(organizationId).getState().correlations;
}

export function selectDistributedInstabilityPatterns(
  organizationId: string
): readonly DistributedInstabilityPattern[] {
  return getRiskConstellationStore(organizationId).getState().instabilityPatterns;
}

export function selectStrategicRiskEmergences(
  organizationId: string
): readonly StrategicRiskEmergence[] {
  return getRiskConstellationStore(organizationId).getState().strategicRiskEmergences;
}

export function selectMultiSignalPressureClusters(
  organizationId: string
): readonly MultiSignalPressureCluster[] {
  return getRiskConstellationStore(organizationId).getState().pressureClusters;
}

export function selectRiskConstellationSignature(organizationId: string): string {
  return getRiskConstellationStore(organizationId).getState().signature;
}
