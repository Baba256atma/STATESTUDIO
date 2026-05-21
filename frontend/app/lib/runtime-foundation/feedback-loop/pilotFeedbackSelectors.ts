import { getPilotFeedbackStore } from "./pilotFeedbackStore";
import type {
  ExecutiveFeedbackSignal,
  MVPPilotFeedback,
  PilotFeedbackHistoryEntry,
  PilotLearningSnapshot,
} from "./pilotFeedbackTypes";

export function selectMVPPilotFeedbackEntries(organizationId: string): readonly MVPPilotFeedback[] {
  return getPilotFeedbackStore(organizationId).getState().feedbackEntries;
}

export function selectLatestPilotLearningSnapshot(
  organizationId: string
): PilotLearningSnapshot | null {
  return getPilotFeedbackStore(organizationId).getState().learningSnapshots[0] ?? null;
}

export function selectPilotLearningSnapshots(organizationId: string): readonly PilotLearningSnapshot[] {
  return getPilotFeedbackStore(organizationId).getState().learningSnapshots;
}

export function selectPilotImprovementSignals(organizationId: string): readonly ExecutiveFeedbackSignal[] {
  return getPilotFeedbackStore(organizationId).getState().improvementSignals;
}

export function selectPilotFeedbackHistory(organizationId: string): readonly PilotFeedbackHistoryEntry[] {
  return getPilotFeedbackStore(organizationId).getState().feedbackHistory;
}

export function selectPilotFeedbackSignature(organizationId: string): string {
  return getPilotFeedbackStore(organizationId).getState().signature;
}
