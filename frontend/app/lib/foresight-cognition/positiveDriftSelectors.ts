import { getPositiveDriftStore } from "./positiveDriftStore";
import type {
  AdaptiveEvolutionSignal,
  OrganizationalGrowthPattern,
  PositiveTrajectorySnapshot,
  ResilienceOpportunityField,
  StrategicOpportunitySignal,
} from "./positiveDriftTypes";

/** Readonly selectors for future enterprise opportunity dashboards and overlays. */

export function selectStrategicOpportunitySignals(
  organizationId: string
): readonly StrategicOpportunitySignal[] {
  return getPositiveDriftStore(organizationId).getState().strategicOpportunitySignals;
}

export function selectPositiveTrajectorySnapshots(
  organizationId: string
): readonly PositiveTrajectorySnapshot[] {
  return getPositiveDriftStore(organizationId).getState().snapshots;
}

export function selectLatestPositiveTrajectorySnapshot(
  organizationId: string
): PositiveTrajectorySnapshot | null {
  return getPositiveDriftStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectOrganizationalGrowthPatterns(
  organizationId: string
): readonly OrganizationalGrowthPattern[] {
  return getPositiveDriftStore(organizationId).getState().growthPatterns;
}

export function selectResilienceOpportunityFields(
  organizationId: string
): readonly ResilienceOpportunityField[] {
  return getPositiveDriftStore(organizationId).getState().resilienceOpportunityFields;
}

export function selectAdaptiveEvolutionSignals(
  organizationId: string
): readonly AdaptiveEvolutionSignal[] {
  return getPositiveDriftStore(organizationId).getState().adaptiveEvolutionSignals;
}

export function selectPositiveDriftSignature(organizationId: string): string {
  return getPositiveDriftStore(organizationId).getState().signature;
}
