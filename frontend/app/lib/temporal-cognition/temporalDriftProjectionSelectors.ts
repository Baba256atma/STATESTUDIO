import { getTemporalDriftProjectionStore } from "./temporalDriftProjectionStore";
import type {
  EnterpriseTrajectorySignal,
  OperationalDriftForecast,
  OrganizationalFutureDirection,
  StrategicEvolutionTrend,
  TemporalDriftProjection,
  TemporalDriftSnapshot,
} from "./temporalDriftProjectionTypes";

/** Readonly selectors for future trajectory dashboards, drift maps, and executive awareness panels. */

export function selectTemporalDriftProjections(
  organizationId: string
): readonly TemporalDriftProjection[] {
  return getTemporalDriftProjectionStore(organizationId).getState().projections;
}

export function selectTemporalDriftSnapshots(
  organizationId: string
): readonly TemporalDriftSnapshot[] {
  return getTemporalDriftProjectionStore(organizationId).getState().snapshots;
}

export function selectLatestTemporalDriftSnapshot(
  organizationId: string
): TemporalDriftSnapshot | null {
  return getTemporalDriftProjectionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseTrajectorySignals(
  organizationId: string
): readonly EnterpriseTrajectorySignal[] {
  return getTemporalDriftProjectionStore(organizationId).getState().signals;
}

export function selectOrganizationalFutureDirections(
  organizationId: string
): readonly OrganizationalFutureDirection[] {
  return getTemporalDriftProjectionStore(organizationId).getState().futureDirections;
}

export function selectStrategicEvolutionTrends(
  organizationId: string
): readonly StrategicEvolutionTrend[] {
  return getTemporalDriftProjectionStore(organizationId).getState().evolutionTrends;
}

export function selectOperationalDriftForecasts(
  organizationId: string
): readonly OperationalDriftForecast[] {
  return getTemporalDriftProjectionStore(organizationId).getState().forecasts;
}

export function selectTemporalDriftProjectionSignature(organizationId: string): string {
  return getTemporalDriftProjectionStore(organizationId).getState().signature;
}
