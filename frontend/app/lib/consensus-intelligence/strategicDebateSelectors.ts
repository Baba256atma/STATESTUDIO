import { getStrategicDebateStore } from "./strategicDebateStore";
import type {
  AlternativeStrategyProjection,
  AssumptionStressField,
  CounterfactualReasoningSnapshot,
  EnterpriseChallengeSignal,
  ExecutiveStrategicDebate,
} from "./strategicDebateTypes";

/** Readonly selectors for future strategic debate dashboards and counterfactual overlays. */

export function selectExecutiveStrategicDebates(
  organizationId: string
): readonly ExecutiveStrategicDebate[] {
  return getStrategicDebateStore(organizationId).getState().debates;
}

export function selectCounterfactualReasoningSnapshots(
  organizationId: string
): readonly CounterfactualReasoningSnapshot[] {
  return getStrategicDebateStore(organizationId).getState().snapshots;
}

export function selectLatestCounterfactualReasoningSnapshot(
  organizationId: string
): CounterfactualReasoningSnapshot | null {
  return getStrategicDebateStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectAlternativeStrategyProjections(
  organizationId: string
): readonly AlternativeStrategyProjection[] {
  return getStrategicDebateStore(organizationId).getState().alternativeProjections;
}

export function selectEnterpriseChallengeSignals(
  organizationId: string
): readonly EnterpriseChallengeSignal[] {
  return getStrategicDebateStore(organizationId).getState().challengeSignals;
}

export function selectAssumptionStressFields(
  organizationId: string
): readonly AssumptionStressField[] {
  return getStrategicDebateStore(organizationId).getState().assumptionStressFields;
}

export function selectStrategicDebateSignature(organizationId: string): string {
  return getStrategicDebateStore(organizationId).getState().signature;
}
