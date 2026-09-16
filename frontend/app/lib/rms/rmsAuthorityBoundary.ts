/**
 * NPA-T RMS:1 — authority reuse. No parallel Nexora authorities.
 */

export const RMS_AUTHORITY_BOUNDARY = Object.freeze({
  conversationRuntime: "CC:5 executeNexoraConversationalExperience",
  intent: "CC:1–4",
  managerObject: "MO:1",
  data: "Data Reality",
  evidence: "CC:8",
  scenario: "CC:9",
  decision: "CC:10",
  execution: "CC:11",
  outcome: "CORE-OUT",
  learning: "CORE-OUT:2 / ECA:12",
  advisor: "UX:3 Advisor presentation",
  stage: "Director / Stage interaction",
  problemSolving: "NPS consumes; does not own",
  executiveConversation: "ECA consumes; does not own Stage/Object",
  d7OperationalGraph: "frontend/app/lib/simulation — not RMS Ground Truth",
  rmsOwns: "RMS simulation contracts, actor identity, Ground Truth seal, Observer",
  parallelStage: false as const,
  parallelAdvisor: false as const,
  parallelObjectStore: false as const,
  parallelDecisionRuntime: false as const,
  parallelExecutionRuntime: false as const,
  parallelConversationalRuntime: false as const,
  hiddenTruthShortcutToNexora: false as const,
  observerWrites: false as const,
  unifiedCompany: false as const,
  vai: false as const,
  nmi: false as const,
});

export function verifyRmsAuthorityBoundary(): { readonly ok: true } {
  if (RMS_AUTHORITY_BOUNDARY.parallelStage) {
    throw new Error("RMS:1 must not create a parallel Stage");
  }
  if (RMS_AUTHORITY_BOUNDARY.parallelAdvisor) {
    throw new Error("RMS:1 must not create a parallel Advisor");
  }
  if (RMS_AUTHORITY_BOUNDARY.parallelObjectStore) {
    throw new Error("RMS:1 must not create a parallel Object store");
  }
  if (RMS_AUTHORITY_BOUNDARY.parallelDecisionRuntime) {
    throw new Error("RMS:1 must not create a parallel Decision runtime");
  }
  if (RMS_AUTHORITY_BOUNDARY.parallelExecutionRuntime) {
    throw new Error("RMS:1 must not create a parallel Execution runtime");
  }
  if (RMS_AUTHORITY_BOUNDARY.parallelConversationalRuntime) {
    throw new Error("RMS:1 must not create a parallel conversational runtime");
  }
  if (RMS_AUTHORITY_BOUNDARY.hiddenTruthShortcutToNexora) {
    throw new Error("RMS:1 must not give Nexora hidden Ground Truth");
  }
  if (RMS_AUTHORITY_BOUNDARY.observerWrites) {
    throw new Error("RMS:1 Observer must remain read-only");
  }
  return Object.freeze({ ok: true as const });
}
