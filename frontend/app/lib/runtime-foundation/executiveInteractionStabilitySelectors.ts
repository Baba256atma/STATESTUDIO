import { getExecutiveInteractionStabilityStore } from "./executiveInteractionStabilityStore";
import type {
  ExecutiveInteractionStabilityHistoryEntry,
  ExecutiveInteractionStabilitySnapshot,
  InteractionStabilityObservation,
  UIStabilitySignal,
} from "./executiveInteractionStabilityTypes";

/** Readonly selectors for future MVP UI readiness badge and interaction health panels. */

export function selectExecutiveInteractionStabilitySnapshots(
  organizationId: string
): readonly ExecutiveInteractionStabilitySnapshot[] {
  return getExecutiveInteractionStabilityStore(organizationId).getState().stabilitySnapshots;
}

export function selectLatestExecutiveInteractionStabilitySnapshot(
  organizationId: string
): ExecutiveInteractionStabilitySnapshot | null {
  return (
    getExecutiveInteractionStabilityStore(organizationId).getState().stabilitySnapshots[0] ?? null
  );
}

export function selectInteractionStabilityObservations(
  organizationId: string
): readonly InteractionStabilityObservation[] {
  return getExecutiveInteractionStabilityStore(organizationId).getState().interactionObservations;
}

export function selectUIStabilitySignals(organizationId: string): readonly UIStabilitySignal[] {
  return (
    selectLatestExecutiveInteractionStabilitySnapshot(organizationId)?.uiStabilitySignals ?? []
  );
}

export function selectExecutiveInteractionStabilityHistory(
  organizationId: string
): readonly ExecutiveInteractionStabilityHistoryEntry[] {
  return getExecutiveInteractionStabilityStore(organizationId).getState().interactionHistory;
}

export function selectExecutiveInteractionStabilitySignature(organizationId: string): string {
  return getExecutiveInteractionStabilityStore(organizationId).getState().signature;
}
