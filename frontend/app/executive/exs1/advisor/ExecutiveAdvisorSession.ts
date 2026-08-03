/**
 * Sprint 5 — Session-only Advisor memory (no persistence).
 */

import type {
  AdvisorProposal,
  AdvisorSessionMessage,
  AdvisorSuggestion,
} from "./ExecutiveAdvisorTypes";

export type ExecutiveAdvisorSessionState = {
  readonly topic: string;
  readonly goal: string;
  readonly packTitle: string;
  readonly messages: readonly AdvisorSessionMessage[];
  readonly previousQuestions: readonly string[];
  readonly pendingProposals: readonly AdvisorProposal[];
  readonly lastSuggestionId: string | null;
  readonly lastAdvisorEvent: string | null;
};

export function createInitialAdvisorSession(
  packTitle = "Production Delay",
): ExecutiveAdvisorSessionState {
  return {
    topic: "Executive orientation",
    goal: "Resolve Production Delay with executive control retained.",
    packTitle,
    messages: [
      {
        id: "msg-welcome",
        role: "advisor",
        text: "I am reading the Executive Runtime. Ask for an explanation, review, or proposal — I will not change Runtime without your approval.",
        at: Date.now(),
      },
    ],
    previousQuestions: [],
    pendingProposals: [],
    lastSuggestionId: null,
    lastAdvisorEvent: null,
  };
}

export function rememberAdvisorQuestion(
  session: ExecutiveAdvisorSessionState,
  question: string,
): ExecutiveAdvisorSessionState {
  const trimmed = question.trim();
  if (!trimmed) return session;
  return {
    ...session,
    previousQuestions: [...session.previousQuestions, trimmed].slice(-12),
    messages: [
      ...session.messages,
      {
        id: `msg-${Date.now().toString(36)}`,
        role: "manager" as const,
        text: trimmed,
        at: Date.now(),
      },
    ].slice(-40),
    topic: trimmed.slice(0, 72),
  };
}

export function rememberAdvisorExplanation(
  session: ExecutiveAdvisorSessionState,
  text: string,
  packTitle: string,
): ExecutiveAdvisorSessionState {
  return {
    ...session,
    packTitle,
    messages: [
      ...session.messages,
      {
        id: `msg-${Date.now().toString(36)}`,
        role: "advisor" as const,
        text,
        at: Date.now(),
      },
    ].slice(-40),
    lastAdvisorEvent: "AdvisorExplanationGenerated",
  };
}

export function syncPendingProposals(
  session: ExecutiveAdvisorSessionState,
  proposals: readonly AdvisorProposal[],
): ExecutiveAdvisorSessionState {
  const retained = session.pendingProposals.filter(
    (p) => p.status === "pending",
  );
  const retainedKinds = new Set(retained.map((p) => p.kind));
  const incoming = proposals.filter(
    (p) => p.status === "pending" && !retainedKinds.has(p.kind),
  );
  return {
    ...session,
    pendingProposals: [...retained, ...incoming].slice(0, 8),
  };
}

export function markProposalStatus(
  session: ExecutiveAdvisorSessionState,
  proposalId: string,
  status: "accepted" | "dismissed",
): ExecutiveAdvisorSessionState {
  return {
    ...session,
    pendingProposals: session.pendingProposals.map((p) =>
      p.id === proposalId ? { ...p, status } : p,
    ),
    lastAdvisorEvent:
      status === "accepted"
        ? "AdvisorSuggestionAccepted"
        : "AdvisorSuggestionDismissed",
  };
}

export function rememberSuggestion(
  session: ExecutiveAdvisorSessionState,
  suggestion: AdvisorSuggestion,
): ExecutiveAdvisorSessionState {
  return {
    ...session,
    lastSuggestionId: suggestion.id,
  };
}
