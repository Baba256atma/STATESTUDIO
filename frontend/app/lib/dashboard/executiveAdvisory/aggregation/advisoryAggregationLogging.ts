/**
 * Phase 5:2 — Advisory Context Aggregation logging.
 */

import type { AdvisoryContext, StandardizedAdvisoryInput } from "./advisoryContextContract.ts";

const loggedKeys = new Set<string>();

function shouldLog(key: string): boolean {
  if (loggedKeys.has(key)) return false;
  loggedKeys.add(key);
  return true;
}

export function reportAdvisoryAggregation(detail: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `aggregation:${JSON.stringify(detail)}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryAggregation]", detail);
}

export function reportAdvisoryNormalization(inputs: readonly StandardizedAdvisoryInput[]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `normalize:${inputs.length}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryNormalization]", {
    inputCount: inputs.length,
    sources: [...new Set(inputs.map((input) => input.source))],
  });
}

export function reportAdvisoryPriority(ranked: readonly StandardizedAdvisoryInput[]): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `priority:${ranked[0]?.label ?? "none"}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryPriority]", {
    top: ranked[0]?.label,
    priority: ranked[0]?.priority,
    score: ranked[0]?.score,
  });
}

export function reportAdvisoryContext(context: AdvisoryContext): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `context:${context.metadata.timestamp}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][AdvisoryContext]", {
    sourceSurface: context.metadata.sourceSurface,
    priority: context.metadata.priority,
    confidence: context.metadata.confidence,
    inputCount: context.rankedInputs.length,
  });
}

export function reportReasoningTrace(context: AdvisoryContext): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `trace:${context.metadata.reasoningTrace.sourceChain.join(">")}`;
  if (!shouldLog(key)) return;
  globalThis.console?.info?.("[Nexora][ReasoningTrace]", context.metadata.reasoningTrace);
}

export function resetAdvisoryAggregationLoggingForTests(): void {
  loggedKeys.clear();
}
