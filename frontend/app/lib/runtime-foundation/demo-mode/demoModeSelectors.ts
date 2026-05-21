import { getDemoModeStore } from "./demoModeStore";
import type {
  ControlledPilotPresentationSnapshot,
  DemoModeHistoryEntry,
  DemoRiskIndicator,
  MVPDemoModeState,
} from "./demoModeTypes";

/** Readonly selectors for MVP readiness dashboard and controlled pilot presentation surfaces. */

export function selectMVPDemoModeSnapshots(organizationId: string): readonly MVPDemoModeState[] {
  return getDemoModeStore(organizationId).getState().demoModeSnapshots;
}

export function selectLatestMVPDemoModeState(organizationId: string): MVPDemoModeState | null {
  return getDemoModeStore(organizationId).getState().demoModeSnapshots[0] ?? null;
}

export function selectDemoRiskHistory(organizationId: string): readonly DemoRiskIndicator[] {
  return getDemoModeStore(organizationId).getState().demoRiskHistory;
}

export function selectControlledPilotPresentations(
  organizationId: string
): readonly ControlledPilotPresentationSnapshot[] {
  return getDemoModeStore(organizationId).getState().pilotObservations;
}

export function selectLatestControlledPilotPresentation(
  organizationId: string
): ControlledPilotPresentationSnapshot | null {
  return getDemoModeStore(organizationId).getState().pilotObservations[0] ?? null;
}

export function selectDemoModeHistory(organizationId: string): readonly DemoModeHistoryEntry[] {
  return getDemoModeStore(organizationId).getState().demoHistory;
}

export function selectDemoModeSignature(organizationId: string): string {
  return getDemoModeStore(organizationId).getState().signature;
}
