import { getPerspectiveNegotiationStore } from "./perspectiveNegotiationStore";
import type {
  CognitiveNegotiationSignal,
  EnterpriseConflictResolutionSnapshot,
  ExecutiveTradeoffResolution,
  PerspectiveReconciliationField,
  StrategicPerspectiveNegotiation,
} from "./perspectiveNegotiationTypes";

/** Readonly selectors for future strategic negotiation dashboards and conflict-resolution overlays. */

export function selectStrategicPerspectiveNegotiations(
  organizationId: string
): readonly StrategicPerspectiveNegotiation[] {
  return getPerspectiveNegotiationStore(organizationId).getState().negotiations;
}

export function selectEnterpriseConflictResolutionSnapshots(
  organizationId: string
): readonly EnterpriseConflictResolutionSnapshot[] {
  return getPerspectiveNegotiationStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseConflictResolutionSnapshot(
  organizationId: string
): EnterpriseConflictResolutionSnapshot | null {
  return getPerspectiveNegotiationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectExecutiveTradeoffResolutions(
  organizationId: string
): readonly ExecutiveTradeoffResolution[] {
  return getPerspectiveNegotiationStore(organizationId).getState().tradeoffResolutions;
}

export function selectCognitiveNegotiationSignals(
  organizationId: string
): readonly CognitiveNegotiationSignal[] {
  return getPerspectiveNegotiationStore(organizationId).getState().negotiationSignals;
}

export function selectPerspectiveReconciliationFields(
  organizationId: string
): readonly PerspectiveReconciliationField[] {
  return getPerspectiveNegotiationStore(organizationId).getState().reconciliationFields;
}

export function selectPerspectiveNegotiationSignature(organizationId: string): string {
  return getPerspectiveNegotiationStore(organizationId).getState().signature;
}
