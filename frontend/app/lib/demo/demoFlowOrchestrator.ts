export type DemoFlowPhase =
  | "started"
  | "response_received"
  | "canonical_result_ready"
  | "commit_applied"
  | "stale_ignored";

type DemoFlowTraceEvent = {
  phase: DemoFlowPhase;
  source: string;
  seq: number;
  requestId?: string | null;
  detail?: Record<string, unknown>;
};

export function nextDemoFlowSequence(ref: { current: number }): number {
  ref.current += 1;
  return ref.current;
}

export function isLatestDemoFlowSequence(ref: { current: number }, seq: number): boolean {
  return ref.current === seq;
}

export function shouldApplyExecutionResultImmediately(input: {
  hasLocalActions: boolean;
  hasBackendPayload: boolean;
}): boolean {
  return input.hasLocalActions || !input.hasBackendPayload;
}

export function traceDemoFlowEvent(event: DemoFlowTraceEvent): void {
  if (process.env.NODE_ENV === "production") return;

  console.debug("[Nexora][DemoFlow]", {
    phase: event.phase,
    source: event.source,
    seq: event.seq,
    requestId: event.requestId ?? null,
    ...(event.detail ? { detail: event.detail } : {}),
  });
}
