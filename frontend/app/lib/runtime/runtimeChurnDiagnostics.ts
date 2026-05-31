/**
 * E2:63 — Development diagnostics for scene/panel runtime churn.
 */

export type RuntimeChurnKind =
  | "duplicate_write_skipped"
  | "panel_write_skipped"
  | "scene_reset_skipped"
  | "parity_stable"
  | "salvage_skipped"
  | "drift_skipped";

const counters = new Map<string, number>();
const logKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logOnce(key: string, label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function recordRuntimeChurn(kind: RuntimeChurnKind, detail?: Record<string, unknown>): void {
  if (!isDev()) return;
  const count = (counters.get(kind) ?? 0) + 1;
  counters.set(kind, count);
  logOnce(`churn:${kind}:${JSON.stringify(detail ?? {})}`, "[Nexora][RuntimeChurn]", {
    kind,
    count,
    ...detail,
  });
}

export function traceDuplicateWriteSkipped(detail: Record<string, unknown>): void {
  recordRuntimeChurn("duplicate_write_skipped", detail);
  logOnce(`dup:${JSON.stringify(detail)}`, "[Nexora][DuplicateWriteSkipped]", detail);
}

export function tracePanelWriteSkipped(detail: Record<string, unknown>): void {
  recordRuntimeChurn("panel_write_skipped", detail);
  logOnce(`panel:${JSON.stringify(detail)}`, "[Nexora][PanelWriteSkipped]", detail);
}

export function traceSceneResetSkipped(detail: Record<string, unknown>): void {
  recordRuntimeChurn("scene_reset_skipped", detail);
  logOnce(`reset:${JSON.stringify(detail)}`, "[Nexora][SceneResetSkipped]", detail);
}

export function traceParityStable(detail: Record<string, unknown>): void {
  recordRuntimeChurn("parity_stable", detail);
  logOnce(`parity:${JSON.stringify(detail)}`, "[Nexora][ParityStable]", detail);
}

export function traceSalvageSkipped(detail: Record<string, unknown>): void {
  recordRuntimeChurn("salvage_skipped", detail);
  logOnce(`salvage:${JSON.stringify(detail)}`, "[Nexora][SalvageSkipped]", detail);
}

export function traceDriftSkipped(detail: Record<string, unknown>): void {
  recordRuntimeChurn("drift_skipped", detail);
  logOnce(`drift:${JSON.stringify(detail)}`, "[Nexora][DriftSkipped]", detail);
}

export function tracePanelWriteSkippedNoOp(detail: Record<string, unknown>): void {
  recordRuntimeChurn("panel_write_skipped", detail);
  logOnce(`panel-noop:${JSON.stringify(detail)}`, "[Nexora][PanelWriteSkippedNoOp]", detail);
}

export function traceSceneWriteSkippedDuplicate(detail: Record<string, unknown>): void {
  recordRuntimeChurn("duplicate_write_skipped", detail);
  logOnce(`scene-dup:${JSON.stringify(detail)}`, "[Nexora][SceneWriteSkippedDuplicate]", detail);
}

export function traceParityAlreadyStable(detail: Record<string, unknown>): void {
  recordRuntimeChurn("parity_stable", detail);
  logOnce(`parity-stable:${JSON.stringify(detail)}`, "[Nexora][ParityAlreadyStable]", detail);
}

export function traceEventDeduped(detail: Record<string, unknown>): void {
  logOnce(`event-dedup:${JSON.stringify(detail)}`, "[Nexora][EventDeduped]", detail);
}

export function getRuntimeChurnCounters(): Readonly<Record<string, number>> {
  return Object.fromEntries(counters.entries());
}

export function resetRuntimeChurnDiagnosticsForTests(): void {
  counters.clear();
  logKeys.clear();
}
