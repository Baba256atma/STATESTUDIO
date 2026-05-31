/**
 * Development-only audit execution diagnostics.
 */

export type AuditInspectorStat = {
  auditName: string;
  executionCount: number;
  cacheHitCount: number;
  skipCount: number;
  lastTrigger: "executed" | "cached" | "skipped" | "loop_detected" | "none";
  lastInputKey: string;
  lastDependencyChangeAt: number | null;
};

const stats = new Map<string, AuditInspectorStat>();
const loopWindow = new Map<string, { inputKey: string; count: number; startedAt: number }>();
const inspectorLogKeys = new Set<string>();

function devLogOnce(key: string, label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (inspectorLogKeys.has(key)) return;
  inspectorLogKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

function devLogEvent(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.(label, payload);
}

function statFor(auditName: string): AuditInspectorStat {
  const existing = stats.get(auditName);
  if (existing) return existing;
  const next: AuditInspectorStat = {
    auditName,
    executionCount: 0,
    cacheHitCount: 0,
    skipCount: 0,
    lastTrigger: "none",
    lastInputKey: "",
    lastDependencyChangeAt: null,
  };
  stats.set(auditName, next);
  return next;
}

export function recordAuditExecuted(auditName: string, inputKey: string): void {
  const stat = statFor(auditName);
  stat.executionCount += 1;
  stat.lastTrigger = "executed";
  stat.lastInputKey = inputKey;
  detectAuditLoop(auditName, inputKey);
  devLogOnce(`executed-${auditName}-${inputKey}`, "[Nexora][AuditExecuted]", {
    auditName,
    inputKey,
    executionCount: stat.executionCount,
  });
}

export function recordAuditCached(auditName: string, inputKey: string): void {
  const stat = statFor(auditName);
  stat.cacheHitCount += 1;
  stat.lastTrigger = "cached";
  stat.lastInputKey = inputKey;
  devLogOnce(`cached-${auditName}-${inputKey}`, "[Nexora][AuditCached]", { auditName, inputKey });
}

export function recordAuditSkipped(auditName: string, inputKey: string, reason: string): void {
  const stat = statFor(auditName);
  stat.skipCount += 1;
  stat.lastTrigger = "skipped";
  stat.lastInputKey = inputKey;
  devLogOnce(`skipped-${auditName}-${inputKey}-${reason}`, "[Nexora][AuditSkipped]", {
    auditName,
    inputKey,
    reason,
  });
}

export function recordAuditDependencyChanged(
  auditName: string,
  previousInputKey: string,
  nextInputKey: string
): void {
  const stat = statFor(auditName);
  stat.lastDependencyChangeAt = Date.now();
  devLogOnce(`dependency-${auditName}-${nextInputKey}`, "[Nexora][AuditDependencyChanged]", {
    auditName,
    from: previousInputKey,
    to: nextInputKey,
  });
}

function detectAuditLoop(auditName: string, inputKey: string): void {
  const now = Date.now();
  const windowKey = `${auditName}::${inputKey}`;
  const current = loopWindow.get(windowKey);
  if (current && now - current.startedAt < 1000) {
    current.count += 1;
    if (current.count > 3) {
      const stat = statFor(auditName);
      stat.lastTrigger = "loop_detected";
      devLogEvent("[Nexora][AuditLoopDetected]", {
        auditName,
        inputKey,
        executionsInWindow: current.count,
      });
    }
    return;
  }
  loopWindow.set(windowKey, { inputKey, count: 1, startedAt: now });
}

export function getAuditInspectorStats(): ReadonlyArray<AuditInspectorStat> {
  return Array.from(stats.values());
}

export function resetAuditRenderInspectorForTests(): void {
  stats.clear();
  loopWindow.clear();
  inspectorLogKeys.clear();
}
