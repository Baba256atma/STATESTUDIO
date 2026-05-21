import { getStrategicResonanceStore } from "./strategicResonanceStore";
import type {
  CrossSystemResonanceSignal,
  EnterpriseStrategicResonanceSnapshot,
  HarmonicAlignmentField,
  ResonanceAmplificationIndicator,
  StrategicReinforcementObservation,
} from "./strategicResonanceTypes";

/** Readonly selectors for future strategic resonance dashboards and harmonic alignment overlays. */

export function selectStrategicResonanceObservations(
  organizationId: string
): readonly StrategicReinforcementObservation[] {
  return getStrategicResonanceStore(organizationId).getState().observations;
}

export function selectEnterpriseStrategicResonanceSnapshots(
  organizationId: string
): readonly EnterpriseStrategicResonanceSnapshot[] {
  return getStrategicResonanceStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseStrategicResonanceSnapshot(
  organizationId: string
): EnterpriseStrategicResonanceSnapshot | null {
  return getStrategicResonanceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCrossSystemResonanceSignals(
  organizationId: string
): readonly CrossSystemResonanceSignal[] {
  return getStrategicResonanceStore(organizationId).getState().crossSystemResonanceSignals;
}

export function selectHarmonicAlignmentFields(
  organizationId: string
): readonly HarmonicAlignmentField[] {
  return getStrategicResonanceStore(organizationId).getState().harmonicAlignmentFields;
}

export function selectResonanceAmplificationIndicators(
  organizationId: string
): readonly ResonanceAmplificationIndicator[] {
  return getStrategicResonanceStore(organizationId).getState().amplificationIndicators;
}

export function selectStrategicResonanceSignature(organizationId: string): string {
  return getStrategicResonanceStore(organizationId).getState().signature;
}
