import { getCausalDependencyStore } from "./causalDependencyStore";
import type {
  CausalDependencySnapshot,
  DependencyPropagationSignal,
  OperationalCausalChain,
  OrganizationalImpactChain,
  StrategicCauseEffectSequence,
  TemporalDependencyLink,
} from "./causalDependencyTypes";

/** Readonly selectors for future dependency graphs, progression maps, and causal timeline views. */

export function selectOperationalCausalChains(
  organizationId: string
): readonly OperationalCausalChain[] {
  return getCausalDependencyStore(organizationId).getState().chains;
}

export function selectTemporalDependencyLinks(
  organizationId: string
): readonly TemporalDependencyLink[] {
  return getCausalDependencyStore(organizationId).getState().links;
}

export function selectCausalDependencySnapshots(
  organizationId: string
): readonly CausalDependencySnapshot[] {
  return getCausalDependencyStore(organizationId).getState().snapshots;
}

export function selectLatestCausalDependencySnapshot(
  organizationId: string
): CausalDependencySnapshot | null {
  return getCausalDependencyStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectDependencyPropagationSignals(
  organizationId: string
): readonly DependencyPropagationSignal[] {
  return getCausalDependencyStore(organizationId).getState().signals;
}

export function selectOrganizationalImpactChains(
  organizationId: string
): readonly OrganizationalImpactChain[] {
  return getCausalDependencyStore(organizationId).getState().impactChains;
}

export function selectStrategicCauseEffectSequences(
  organizationId: string
): readonly StrategicCauseEffectSequence[] {
  return getCausalDependencyStore(organizationId).getState().causeEffectSequences;
}

export function selectCausalDependencySignature(organizationId: string): string {
  return getCausalDependencyStore(organizationId).getState().signature;
}
