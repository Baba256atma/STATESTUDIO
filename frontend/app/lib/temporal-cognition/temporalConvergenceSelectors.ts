import { getTemporalConvergenceStore } from "./temporalConvergenceStore";
import type {
  EnterpriseConvergenceSignal,
  OperationalSynchronizationSequence,
  OrganizationalAlignmentTrajectory,
  StabilityConvergencePattern,
  StrategicAlignmentSnapshot,
} from "./temporalConvergenceTypes";

/** Readonly selectors for future stabilization overlays, convergence maps, and alignment dashboards. */

export function selectStabilityConvergencePatterns(
  organizationId: string
): readonly StabilityConvergencePattern[] {
  return getTemporalConvergenceStore(organizationId).getState().patterns;
}

export function selectStrategicAlignmentSnapshots(
  organizationId: string
): readonly StrategicAlignmentSnapshot[] {
  return getTemporalConvergenceStore(organizationId).getState().snapshots;
}

export function selectLatestStrategicAlignmentSnapshot(
  organizationId: string
): StrategicAlignmentSnapshot | null {
  return getTemporalConvergenceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseConvergenceSignals(
  organizationId: string
): readonly EnterpriseConvergenceSignal[] {
  return getTemporalConvergenceStore(organizationId).getState().signals;
}

export function selectOrganizationalAlignmentTrajectories(
  organizationId: string
): readonly OrganizationalAlignmentTrajectory[] {
  return getTemporalConvergenceStore(organizationId).getState().trajectories;
}

export function selectOperationalSynchronizationSequences(
  organizationId: string
): readonly OperationalSynchronizationSequence[] {
  return getTemporalConvergenceStore(organizationId).getState().sequences;
}

export function selectTemporalConvergenceSignature(organizationId: string): string {
  return getTemporalConvergenceStore(organizationId).getState().signature;
}
