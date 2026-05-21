import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type {
  ActionReadinessSignal,
  DecisionCoordinationSnapshot,
  ExecutiveActionCandidate,
  OperationalResponseSequence,
  OrganizationalResponseDependency,
  StrategicDecisionOrchestration,
} from "./decisionOrchestrationTypes";

/** Readonly selectors for future executive action dashboards and orchestration panels. */

export function selectStrategicDecisionOrchestrations(
  organizationId: string
): readonly StrategicDecisionOrchestration[] {
  return getDecisionOrchestrationStore(organizationId).getState().strategicOrchestrations;
}

export function selectDecisionCoordinationSnapshots(
  organizationId: string
): readonly DecisionCoordinationSnapshot[] {
  return getDecisionOrchestrationStore(organizationId).getState().snapshots;
}

export function selectLatestDecisionCoordinationSnapshot(
  organizationId: string
): DecisionCoordinationSnapshot | null {
  return getDecisionOrchestrationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectExecutiveActionCandidates(
  organizationId: string
): readonly ExecutiveActionCandidate[] {
  return getDecisionOrchestrationStore(organizationId).getState().actionCandidates;
}

export function selectActionReadinessSignals(
  organizationId: string
): readonly ActionReadinessSignal[] {
  return getDecisionOrchestrationStore(organizationId).getState().actionReadinessSignals;
}

export function selectOperationalResponseSequences(
  organizationId: string
): readonly OperationalResponseSequence[] {
  return getDecisionOrchestrationStore(organizationId).getState().responseSequences;
}

export function selectOrganizationalResponseDependencies(
  organizationId: string
): readonly OrganizationalResponseDependency[] {
  return getDecisionOrchestrationStore(organizationId).getState().responseDependencies;
}

export function selectDecisionOrchestrationSignature(organizationId: string): string {
  return getDecisionOrchestrationStore(organizationId).getState().signature;
}
