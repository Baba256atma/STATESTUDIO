import { getActionDependencyStore } from "./actionDependencyStore";
import type {
  CoordinationBottleneckIndicator,
  DependencyAwarenessSnapshot,
  EnterpriseDependencyNode,
  OperationalCoordinationGraph,
  ResponseRelationshipSignal,
} from "./actionDependencyTypes";

/** Readonly selectors for future coordination graph overlays and dependency maps. */

export function selectOperationalCoordinationGraphs(
  organizationId: string
): readonly OperationalCoordinationGraph[] {
  return getActionDependencyStore(organizationId).getState().coordinationGraphs;
}

export function selectDependencyAwarenessSnapshots(
  organizationId: string
): readonly DependencyAwarenessSnapshot[] {
  return getActionDependencyStore(organizationId).getState().snapshots;
}

export function selectLatestDependencyAwarenessSnapshot(
  organizationId: string
): DependencyAwarenessSnapshot | null {
  return getActionDependencyStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseDependencyNodes(
  organizationId: string
): readonly EnterpriseDependencyNode[] {
  return getActionDependencyStore(organizationId).getState().dependencyNodes;
}

export function selectResponseRelationshipSignals(
  organizationId: string
): readonly ResponseRelationshipSignal[] {
  return getActionDependencyStore(organizationId).getState().relationshipSignals;
}

export function selectCoordinationBottleneckIndicators(
  organizationId: string
): readonly CoordinationBottleneckIndicator[] {
  return getActionDependencyStore(organizationId).getState().bottleneckIndicators;
}

export function selectActionDependencySignature(organizationId: string): string {
  return getActionDependencyStore(organizationId).getState().signature;
}
