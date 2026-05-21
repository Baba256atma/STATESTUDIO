import { getAdaptiveSequencingStore } from "./adaptiveSequencingStore";
import type {
  AdaptiveDecisionSequence,
  AdaptiveSequencingSnapshot,
  DynamicResponseEvolution,
  EnterpriseResponseTransition,
  OperationalPriorityShift,
  SequencingAdaptationSignal,
} from "./adaptiveSequencingTypes";

/** Readonly selectors for future adaptive sequencing dashboards and evolution panels. */

export function selectAdaptiveDecisionSequences(
  organizationId: string
): readonly AdaptiveDecisionSequence[] {
  return getAdaptiveSequencingStore(organizationId).getState().adaptiveSequences;
}

export function selectAdaptiveSequencingSnapshots(
  organizationId: string
): readonly AdaptiveSequencingSnapshot[] {
  return getAdaptiveSequencingStore(organizationId).getState().snapshots;
}

export function selectLatestAdaptiveSequencingSnapshot(
  organizationId: string
): AdaptiveSequencingSnapshot | null {
  return getAdaptiveSequencingStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectDynamicResponseEvolutions(
  organizationId: string
): readonly DynamicResponseEvolution[] {
  return getAdaptiveSequencingStore(organizationId).getState().responseEvolutions;
}

export function selectEnterpriseResponseTransitions(
  organizationId: string
): readonly EnterpriseResponseTransition[] {
  return getAdaptiveSequencingStore(organizationId).getState().responseTransitions;
}

export function selectOperationalPriorityShifts(
  organizationId: string
): readonly OperationalPriorityShift[] {
  return getAdaptiveSequencingStore(organizationId).getState().priorityShifts;
}

export function selectSequencingAdaptationSignals(
  organizationId: string
): readonly SequencingAdaptationSignal[] {
  return getAdaptiveSequencingStore(organizationId).getState().adaptationSignals;
}

export function selectAdaptiveSequencingSignature(organizationId: string): string {
  return getAdaptiveSequencingStore(organizationId).getState().signature;
}
