import { getPerspectiveWeightingStore } from "./perspectiveWeightingStore";
import type {
  AdaptiveInfluenceSignal,
  EnterpriseConsensusPrioritySnapshot,
  ExecutiveWeightingField,
  PerspectivePriorityShift,
  StrategicPerspectiveWeight,
} from "./perspectiveWeightingTypes";

/** Readonly selectors for future consensus weighting dashboards and perspective influence overlays. */

export function selectStrategicPerspectiveWeights(
  organizationId: string
): readonly StrategicPerspectiveWeight[] {
  return getPerspectiveWeightingStore(organizationId).getState().weightings;
}

export function selectEnterpriseConsensusPrioritySnapshots(
  organizationId: string
): readonly EnterpriseConsensusPrioritySnapshot[] {
  return getPerspectiveWeightingStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseConsensusPrioritySnapshot(
  organizationId: string
): EnterpriseConsensusPrioritySnapshot | null {
  return getPerspectiveWeightingStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectPerspectivePriorityShifts(
  organizationId: string
): readonly PerspectivePriorityShift[] {
  return getPerspectiveWeightingStore(organizationId).getState().priorityShifts;
}

export function selectAdaptiveInfluenceSignals(
  organizationId: string
): readonly AdaptiveInfluenceSignal[] {
  return getPerspectiveWeightingStore(organizationId).getState().influenceSignals;
}

export function selectExecutiveWeightingFields(
  organizationId: string
): readonly ExecutiveWeightingField[] {
  return getPerspectiveWeightingStore(organizationId).getState().weightingFields;
}

export function selectPerspectiveWeightingSignature(organizationId: string): string {
  return getPerspectiveWeightingStore(organizationId).getState().signature;
}
