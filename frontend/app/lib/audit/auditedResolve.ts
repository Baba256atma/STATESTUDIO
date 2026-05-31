/**
 * Orchestrates cached, dependency-guarded audit resolution with deduplicated logging.
 */

import { buildStableAuditInputKey } from "./auditInputKey";
import { resetAuditExecutionGuardForTests, trackAuditDependencyChange } from "./auditExecutionGuard";
import { resetAuditLogDeduperForTests, shouldEmitAuditLog } from "./auditLogDeduper";
import {
  getCachedAuditResult,
  resetAuditResultCacheForTests,
  setCachedAuditResult,
} from "./auditResultCache";
import {
  recordAuditCached,
  recordAuditExecuted,
  recordAuditSkipped,
  resetAuditRenderInspectorForTests,
} from "./auditRenderInspector";

export type AuditedResolveOptions<T> = {
  auditName: string;
  inputs: Record<string, unknown>;
  compute: () => T;
  formatLogPayload?: (result: T) => Record<string, unknown>;
  log?: (payload: Record<string, unknown>) => void;
};

export function auditedResolve<T>(options: AuditedResolveOptions<T>): T {
  const inputKey = buildStableAuditInputKey(options.inputs);

  const cached = getCachedAuditResult<T>(options.auditName, inputKey);
  if (cached !== undefined) {
    recordAuditCached(options.auditName, inputKey);
    return cached;
  }

  const dependencyChanged = trackAuditDependencyChange(options.auditName, inputKey);
  const result = options.compute();
  setCachedAuditResult(options.auditName, inputKey, result);

  if (dependencyChanged) {
    recordAuditExecuted(options.auditName, inputKey);
  }

  if (options.log) {
    const payload = options.formatLogPayload?.(result) ?? {
      ...options.inputs,
      result,
    };
    if (shouldEmitAuditLog(options.auditName, inputKey, payload)) {
      options.log(payload);
    } else {
      recordAuditSkipped(options.auditName, inputKey, "duplicate_log");
    }
  }

  return result;
}

export function resetAuditedResolveForTests(): void {
  resetAuditExecutionGuardForTests();
  resetAuditLogDeduperForTests();
  resetAuditRenderInspectorForTests();
  resetAuditResultCacheForTests();
}
