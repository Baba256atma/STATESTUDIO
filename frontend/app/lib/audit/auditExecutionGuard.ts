/**
 * Dependency-driven audit execution guard.
 * Tracks meaningful input changes for diagnostics — never blocks computation.
 */

import { buildStableAuditInputKey } from "./auditInputKey";
import { recordAuditDependencyChanged, recordAuditSkipped } from "./auditRenderInspector";

const lastInputKeys = new Map<string, string>();

/** Records whether meaningful audit inputs changed since the last run of this audit name. */
export function trackAuditDependencyChange(auditName: string, inputKey: string): boolean {
  const previous = lastInputKeys.get(auditName);
  if (previous === inputKey) {
    recordAuditSkipped(auditName, inputKey, "unchanged_inputs");
    return false;
  }
  if (previous != null) {
    recordAuditDependencyChanged(auditName, previous, inputKey);
  }
  lastInputKeys.set(auditName, inputKey);
  return true;
}

/** @deprecated Use trackAuditDependencyChange — kept for callers that gate on input change. */
export function shouldExecuteAudit(auditName: string, inputKey: string): boolean {
  return trackAuditDependencyChange(auditName, inputKey);
}

export function buildAuditDependencyKey(inputs: Record<string, unknown>): string {
  return buildStableAuditInputKey(inputs);
}

export function resetAuditExecutionGuardForTests(): void {
  lastInputKeys.clear();
}
