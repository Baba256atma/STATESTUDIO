import { getCognitiveDriftStore } from "./cognitiveDriftStore";
import type {
  CognitiveVolatilityIndicator,
  EnterpriseDriftSignal,
  ExecutiveCognitiveDriftSnapshot,
  LongHorizonConsistencyField,
  StrategicReasoningStability,
} from "./cognitiveDriftTypes";

/** Readonly selectors for future cognition stability dashboards and drift monitoring overlays. */

export function selectStrategicReasoningStabilities(
  organizationId: string
): readonly StrategicReasoningStability[] {
  return getCognitiveDriftStore(organizationId).getState().reasoningStabilities;
}

export function selectExecutiveCognitiveDriftSnapshots(
  organizationId: string
): readonly ExecutiveCognitiveDriftSnapshot[] {
  return getCognitiveDriftStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveCognitiveDriftSnapshot(
  organizationId: string
): ExecutiveCognitiveDriftSnapshot | null {
  return getCognitiveDriftStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseDriftSignals(
  organizationId: string
): readonly EnterpriseDriftSignal[] {
  return getCognitiveDriftStore(organizationId).getState().driftSignals;
}

export function selectCognitiveVolatilityIndicators(
  organizationId: string
): readonly CognitiveVolatilityIndicator[] {
  return getCognitiveDriftStore(organizationId).getState().volatilityIndicators;
}

export function selectLongHorizonConsistencyFields(
  organizationId: string
): readonly LongHorizonConsistencyField[] {
  return getCognitiveDriftStore(organizationId).getState().longHorizonConsistencyFields;
}

export function selectCognitiveDriftSignature(organizationId: string): string {
  return getCognitiveDriftStore(organizationId).getState().signature;
}
