import type { NexoraConversationKernelDecision } from "./nexoraConversationPolicy.ts";
import type { NexoraConversationCoverage } from "./nexoraConversationProgression.ts";

export type NexoraConversationMoveDiagnostics = {
  readonly identity: "NEX-CONV:1/ConversationKernel";
  readonly subject: string;
  readonly purpose: NexoraConversationKernelDecision["purpose"];
  readonly previousCoverage: NexoraConversationCoverage;
  readonly move: NexoraConversationKernelDecision["move"];
  readonly progression: NexoraConversationCoverage;
  readonly requestedCapability: NexoraConversationKernelDecision["requestedCapability"];
  readonly reason: NexoraConversationKernelDecision["reason"];
  readonly readOnly: true;
};

export function conversationMoveDiagnosticsOf(
  decision: NexoraConversationKernelDecision,
  previousCoverage: NexoraConversationCoverage,
): NexoraConversationMoveDiagnostics {
  return Object.freeze({
    identity: "NEX-CONV:1/ConversationKernel" as const,
    subject: decision.subjectId,
    purpose: decision.purpose,
    previousCoverage,
    move: decision.move,
    progression: decision.progression,
    requestedCapability: decision.requestedCapability,
    reason: decision.reason,
    readOnly: true as const,
  });
}

export function conversationDiagnosticsCopySafe(
  managerFacingText: string,
  diagnostics: NexoraConversationMoveDiagnostics | null | undefined,
): boolean {
  if (!diagnostics) return true;
  const haystack = managerFacingText.toLowerCase();
  if (haystack.includes("nex-conv")) return false;
  if (haystack.includes("prior_identity_explanation")) return false;
  if (haystack.includes("subject_purpose_saturated")) return false;
  if (haystack.includes(`reason: ${diagnostics.reason.toLowerCase()}`)) return false;
  return true;
}
