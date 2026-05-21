import { getEarlyWarningStore } from "./earlyWarningStore";
import type {
  EnterpriseEarlyWarningSnapshot,
  EscalationPrecursorField,
  OrganizationalWarningPattern,
  PreEscalationSignal,
  StrategicInstabilityIndicator,
} from "./earlyWarningTypes";

/** Readonly selectors for future executive early warning dashboards and overlays. */

export function selectPreEscalationSignals(
  organizationId: string
): readonly PreEscalationSignal[] {
  return getEarlyWarningStore(organizationId).getState().preEscalationSignals;
}

export function selectEnterpriseEarlyWarningSnapshots(
  organizationId: string
): readonly EnterpriseEarlyWarningSnapshot[] {
  return getEarlyWarningStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseEarlyWarningSnapshot(
  organizationId: string
): EnterpriseEarlyWarningSnapshot | null {
  return getEarlyWarningStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectOrganizationalWarningPatterns(
  organizationId: string
): readonly OrganizationalWarningPattern[] {
  return getEarlyWarningStore(organizationId).getState().warningPatterns;
}

export function selectEscalationPrecursorFields(
  organizationId: string
): readonly EscalationPrecursorField[] {
  return getEarlyWarningStore(organizationId).getState().precursorFields;
}

export function selectStrategicInstabilityIndicators(
  organizationId: string
): readonly StrategicInstabilityIndicator[] {
  return getEarlyWarningStore(organizationId).getState().instabilityIndicators;
}

export function selectEarlyWarningSignature(organizationId: string): string {
  return getEarlyWarningStore(organizationId).getState().signature;
}
