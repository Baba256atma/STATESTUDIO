import { getMultiTimelineStore } from "./multiTimelineStore";
import type {
  AlternativeEvolutionTrajectory,
  EnterpriseDivergencePath,
  MultiTimelineSnapshot,
  OrganizationalTimelineBranch,
  StrategicBranchingSequence,
  TemporalDivergenceSignal,
} from "./multiTimelineTypes";

/** Readonly selectors for future multi-timeline overlays, branch visualizations, and divergence dashboards. */

export function selectEnterpriseDivergencePaths(
  organizationId: string
): readonly EnterpriseDivergencePath[] {
  return getMultiTimelineStore(organizationId).getState().divergencePaths;
}

export function selectOrganizationalTimelineBranches(
  organizationId: string
): readonly OrganizationalTimelineBranch[] {
  return getMultiTimelineStore(organizationId).getState().branches;
}

export function selectMultiTimelineSnapshots(
  organizationId: string
): readonly MultiTimelineSnapshot[] {
  return getMultiTimelineStore(organizationId).getState().snapshots;
}

export function selectLatestMultiTimelineSnapshot(
  organizationId: string
): MultiTimelineSnapshot | null {
  return getMultiTimelineStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectAlternativeEvolutionTrajectories(
  organizationId: string
): readonly AlternativeEvolutionTrajectory[] {
  return getMultiTimelineStore(organizationId).getState().alternativeTrajectories;
}

export function selectStrategicBranchingSequences(
  organizationId: string
): readonly StrategicBranchingSequence[] {
  return getMultiTimelineStore(organizationId).getState().branchingSequences;
}

export function selectTemporalDivergenceSignals(
  organizationId: string
): readonly TemporalDivergenceSignal[] {
  return getMultiTimelineStore(organizationId).getState().signals;
}

export function selectMultiTimelineSignature(organizationId: string): string {
  return getMultiTimelineStore(organizationId).getState().signature;
}
