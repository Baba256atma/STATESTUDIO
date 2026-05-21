import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type {
  EnterpriseDecisionTradeoff,
  ExecutivePriorityArbitration,
  MultiObjectiveDecisionSnapshot,
  OperationalBalancingSignal,
  StrategicPriorityConflict,
} from "./priorityArbitrationTypes";

/** Readonly selectors for future strategic tradeoff dashboards and arbitration panels. */

export function selectExecutivePriorityArbitrations(
  organizationId: string
): readonly ExecutivePriorityArbitration[] {
  return getPriorityArbitrationStore(organizationId).getState().executiveArbitrations;
}

export function selectMultiObjectiveDecisionSnapshots(
  organizationId: string
): readonly MultiObjectiveDecisionSnapshot[] {
  return getPriorityArbitrationStore(organizationId).getState().snapshots;
}

export function selectLatestMultiObjectiveDecisionSnapshot(
  organizationId: string
): MultiObjectiveDecisionSnapshot | null {
  return getPriorityArbitrationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicPriorityConflicts(
  organizationId: string
): readonly StrategicPriorityConflict[] {
  return getPriorityArbitrationStore(organizationId).getState().priorityConflicts;
}

export function selectEnterpriseDecisionTradeoffs(
  organizationId: string
): readonly EnterpriseDecisionTradeoff[] {
  return getPriorityArbitrationStore(organizationId).getState().decisionTradeoffs;
}

export function selectOperationalBalancingSignals(
  organizationId: string
): readonly OperationalBalancingSignal[] {
  return getPriorityArbitrationStore(organizationId).getState().balancingSignals;
}

export function selectPriorityArbitrationSignature(organizationId: string): string {
  return getPriorityArbitrationStore(organizationId).getState().signature;
}
