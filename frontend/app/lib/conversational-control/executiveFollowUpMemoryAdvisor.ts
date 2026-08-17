/** CC:12 capture/compare integration over CC:11 Runtime reads. */
import type { NexoraExecutionRuntimeAdapter } from "./executiveExecutionRuntimeAdapter.ts";
import { projectExecutionFollowUpSnapshot } from "./executiveFollowUpSnapshot.ts";
import { captureExecutionFollowUpSnapshot, readExecutionFollowUpHistory, type NexoraExecutiveFollowUpMemory } from "./executiveFollowUpMemory.ts";
import { compareExecutionFollowUpSnapshots, type NexoraExecutionFollowUpComparison } from "./executiveFollowUpChange.ts";
import { buildExecutiveFollowUpAdvisorResponse, type NexoraExecutiveFollowUpAdvisorResponse } from "./executiveFollowUpAdvisorResponse.ts";

export const executiveFollowUpMemoryAdvisorIdentity = "CC:12/ExecutiveFollowUpMemoryAndAdvisorIntegration" as const;
export const executiveFollowUpMemoryAdvisorVersion = "1.0.0" as const;
export const executiveFollowUpMemoryAdvisorNamespace = "nexora.conversational-control.executive-follow-up-memory-advisor-integration" as const;
export const executiveFollowUpMemoryAdvisorArchitecturalRole = "ExecutiveFollowUpMemoryAndAdvisorIntegrationAuthority" as const;
export const EXECUTIVE_FOLLOW_UP_MEMORY_ADVISOR_BOUNDARY = Object.freeze({ storesCurrentExecutionTruth: false, createsExecution: false, transitionsExecution: false, mutatesDecision: false, mutatesStage: false, movesCamera: false, mutatesTopology: false, stealsFocus: false, externalSideEffects: false, durablePersistence: false });

export type NexoraExecutiveFollowUpMemoryAdvisorResult = { readonly status: "baseline-captured" | "compared" | "not-found"; readonly memory: NexoraExecutiveFollowUpMemory; readonly response: NexoraExecutiveFollowUpAdvisorResponse | null; readonly comparison: NexoraExecutionFollowUpComparison | null; readonly reasons: readonly string[] };
export function reviewExecutionWithFollowUpMemory(input: { readonly runtime: NexoraExecutionRuntimeAdapter; readonly executionId: string; readonly memory: NexoraExecutiveFollowUpMemory; readonly title?: string; readonly observedAt?: string | null; readonly compareOnly?: boolean }): NexoraExecutiveFollowUpMemoryAdvisorResult {
  const current = projectExecutionFollowUpSnapshot({ runtime: input.runtime, executionId: input.executionId, observedAt: input.observedAt });
  if (!current) return Object.freeze({ status: "not-found", memory: input.memory, response: null, comparison: null, reasons: Object.freeze(["execution-not-found", "followup-memory-unchanged"]) });
  const history = readExecutionFollowUpHistory(input.memory, current); const previous = history.at(-1) ?? null;
  if (!previous) { const captured = captureExecutionFollowUpSnapshot(input.memory, current); return Object.freeze({ status: "baseline-captured", memory: captured.memory, response: buildExecutiveFollowUpAdvisorResponse({ title: input.title ?? current.executionId, current, noHistory: input.compareOnly === true }), comparison: null, reasons: Object.freeze(["followup-baseline-captured", "followup-no-prior-snapshot"]) }); }
  const comparison = compareExecutionFollowUpSnapshots(previous, current); const captured = captureExecutionFollowUpSnapshot(input.memory, current);
  return Object.freeze({ status: "compared", memory: captured.memory, response: buildExecutiveFollowUpAdvisorResponse({ title: input.title ?? current.executionId, current, comparison }), comparison, reasons: Object.freeze([captured.captured ? "followup-snapshot-captured" : "followup-duplicate-suppressed", "followup-comparison-generated"]) });
}
export function resolveExecutiveFollowUpMemoryHandoff(utterance: string): "CC:8" | "CC:9" | "CC:10" | null { const text = utterance.toLowerCase(); if (/what should i do|recommend/.test(text)) return "CC:8"; if (/what if|scenario/.test(text)) return "CC:9"; if (/reconsider|reverse the decision/.test(text)) return "CC:10"; return null; }
