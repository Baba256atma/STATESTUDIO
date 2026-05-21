import { getTemporalFieldStore } from "./temporalFieldStore";
import type {
  EnterpriseLongHorizonPattern,
  InstitutionalContinuityField,
  LongHorizonAwarenessSnapshot,
  LongHorizonContinuitySignal,
  OperationalEraEvolution,
  OrganizationalTimeField,
  StrategicTemporalField,
} from "./temporalFieldTypes";

/** Readonly selectors for future long-horizon dashboards, evolution overlays, and executive panels. */

export function selectOrganizationalTimeFields(
  organizationId: string
): readonly OrganizationalTimeField[] {
  return getTemporalFieldStore(organizationId).getState().timeFields;
}

export function selectLongHorizonAwarenessSnapshots(
  organizationId: string
): readonly LongHorizonAwarenessSnapshot[] {
  return getTemporalFieldStore(organizationId).getState().snapshots;
}

export function selectLatestLongHorizonAwarenessSnapshot(
  organizationId: string
): LongHorizonAwarenessSnapshot | null {
  return getTemporalFieldStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseLongHorizonPatterns(
  organizationId: string
): readonly EnterpriseLongHorizonPattern[] {
  return getTemporalFieldStore(organizationId).getState().longHorizonPatterns;
}

export function selectStrategicTemporalFields(
  organizationId: string
): readonly StrategicTemporalField[] {
  return getTemporalFieldStore(organizationId).getState().strategicTemporalFields;
}

export function selectOperationalEraEvolutions(
  organizationId: string
): readonly OperationalEraEvolution[] {
  return getTemporalFieldStore(organizationId).getState().eraEvolutions;
}

export function selectInstitutionalContinuityFields(
  organizationId: string
): readonly InstitutionalContinuityField[] {
  return getTemporalFieldStore(organizationId).getState().continuityFields;
}

export function selectLongHorizonContinuitySignals(
  organizationId: string
): readonly LongHorizonContinuitySignal[] {
  return getTemporalFieldStore(organizationId).getState().continuitySignals;
}

export function selectTemporalFieldSignature(organizationId: string): string {
  return getTemporalFieldStore(organizationId).getState().signature;
}
