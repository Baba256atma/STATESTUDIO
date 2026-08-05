/**
 * Sprint 6 — Shared Executive Conversation session (no persistence).
 * Conversation consumes Runtime via Advisor context — never owns business state.
 */

import type {
  AdvisorProposal,
  AdvisorReference,
  ExecutiveAdvisorContext,
} from "../advisor/ExecutiveAdvisorTypes";
import type { ExecutiveAdvisorTab } from "../shell/executiveCockpitTypes";
import { CONVERSATION_MESSAGE_CAP } from "./ExecutiveConversationConfig";

export type ConversationMessageRole =
  | "user"
  | "advisor"
  | "insight"
  | "proposal"
  | "system";

export type ConversationStreamState =
  | "idle"
  | "thinking"
  | "streaming"
  | "completed"
  | "cancelled"
  | "error";

export type ConversationReferenceKind =
  | "object"
  | "pack"
  | "signal"
  | "scenario"
  | "simulation"
  | "decision"
  | "timeline"
  | "explorer";

export type ConversationReference = {
  readonly id: string;
  readonly kind: ConversationReferenceKind;
  readonly label: string;
  readonly objectId?: AdvisorReference["objectId"];
  readonly packId?: string;
  readonly signalId?: string;
  readonly scenarioId?: string;
  readonly decisionId?: string;
  readonly simulationId?: string;
  readonly nav?: AdvisorReference["nav"];
  readonly lens?: AdvisorReference["lens"];
};

export type ConversationKpiCard = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone?: "neutral" | "warning" | "positive" | "critical";
};

export type ConversationEvidenceRow = {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
};

export type ConversationInsightBlock = {
  readonly kpiCards?: readonly ConversationKpiCard[];
  readonly comparisonRows?: readonly ConversationEvidenceRow[];
  readonly evidence?: readonly ConversationEvidenceRow[];
  /** Charts reserved for a future release. */
  readonly chartPlaceholder?: string;
};

export type ConversationMessage = {
  readonly id: string;
  readonly role: ConversationMessageRole;
  readonly text: string;
  readonly at: number;
  readonly perspective?: ExecutiveAdvisorTab;
  readonly streamState?: ConversationStreamState;
  readonly references?: readonly ConversationReference[];
  readonly proposals?: readonly AdvisorProposal[];
  readonly insight?: ConversationInsightBlock;
  readonly error?: string;
  readonly retryPrompt?: string;
};

export type ExecutiveConversationSession = {
  readonly messages: readonly ConversationMessage[];
  readonly currentTopic: string | null;
  readonly activePackTitle: string;
  readonly activeMode: string;
  readonly references: readonly ConversationReference[];
  readonly pendingProposalIds: readonly string[];
  readonly streamState: ConversationStreamState;
  readonly streamingMessageId: string | null;
  readonly searchQuery: string;
  readonly lastError: string | null;
  readonly executiveGoal: string;
};

export type ConversationRuntimeFacts = {
  readonly modelName: string;
  readonly warningSignalCount: number;
  readonly criticalSignalCount: number;
  readonly pendingDecision: boolean;
  readonly decisionName: string | null;
  readonly simulationCompleted: boolean;
  readonly simulationSummary: string | null;
  readonly monitoringHealth: string;
  readonly alertTitles: readonly string[];
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyConversationSession(
  context: Pick<
    ExecutiveAdvisorContext,
    "packTitle" | "mode" | "goal"
  >,
): ExecutiveConversationSession {
  return {
    messages: [],
    currentTopic: null,
    activePackTitle: context.packTitle,
    activeMode: context.mode,
    references: [],
    pendingProposalIds: [],
    streamState: "idle",
    streamingMessageId: null,
    searchQuery: "",
    lastError: null,
    executiveGoal: context.goal,
  };
}

export function buildWelcomeCopy(
  context: ExecutiveAdvisorContext,
  facts: ConversationRuntimeFacts,
): string {
  void context;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";

  const signalTotal =
    facts.warningSignalCount + facts.criticalSignalCount;
  const signalLine =
    signalTotal === 0
      ? "No signals require attention right now."
      : signalTotal === 1
        ? "One signal requires attention."
        : `${signalTotal === 2 ? "Two" : String(signalTotal)} signals require attention.`;

  return [
    greeting,
    "Your executive cockpit is ready.",
    signalLine,
    "How would you like to begin?",
  ].join("\n");
}

export function buildSuggestedQuestions(
  context: ExecutiveAdvisorContext,
  facts: ConversationRuntimeFacts,
): readonly string[] {
  const suggestions: string[] = [];
  if (context.packTitle) {
    suggestions.push(`Why is ${context.packTitle} increasing?`);
  }
  suggestions.push("Compare Scenario A/B");
  suggestions.push("Executive Risks");
  if (facts.warningSignalCount + facts.criticalSignalCount > 0) {
    suggestions.push("Explain Recommendation");
  } else if (facts.pendingDecision || context.decisionName) {
    suggestions.push("Explain Recommendation");
  } else {
    suggestions.push("Next best executive step");
  }
  if (context.selectedObjectLabel) {
    suggestions.push(`Focus on ${context.selectedObjectLabel}`);
  }
  return suggestions.slice(0, 6);
}

export function appendUserMessage(
  session: ExecutiveConversationSession,
  text: string,
): ExecutiveConversationSession {
  const trimmed = text.trim();
  if (!trimmed) return session;
  const message: ConversationMessage = {
    id: newId("msg-user"),
    role: "user",
    text: trimmed,
    at: Date.now(),
  };
  return {
    ...session,
    messages: [...session.messages, message].slice(-CONVERSATION_MESSAGE_CAP),
    currentTopic: trimmed.slice(0, 72),
    lastError: null,
  };
}

export function beginAssistantMessage(
  session: ExecutiveConversationSession,
  perspective: ExecutiveAdvisorTab,
): { session: ExecutiveConversationSession; messageId: string } {
  const messageId = newId(
    perspective === "Insight" ? "msg-insight" : "msg-advisor",
  );
  const message: ConversationMessage = {
    id: messageId,
    role: perspective === "Insight" ? "insight" : "advisor",
    text: "",
    at: Date.now(),
    perspective,
    streamState: "thinking",
  };
  return {
    messageId,
    session: {
      ...session,
      messages: [...session.messages, message].slice(-CONVERSATION_MESSAGE_CAP),
      streamState: "thinking",
      streamingMessageId: messageId,
      lastError: null,
    },
  };
}

export function patchMessage(
  session: ExecutiveConversationSession,
  messageId: string,
  patch: Partial<ConversationMessage>,
): ExecutiveConversationSession {
  return {
    ...session,
    messages: session.messages.map((m) =>
      m.id === messageId ? { ...m, ...patch } : m,
    ),
  };
}

export function setStreamState(
  session: ExecutiveConversationSession,
  streamState: ConversationStreamState,
  streamingMessageId: string | null = session.streamingMessageId,
): ExecutiveConversationSession {
  return {
    ...session,
    streamState,
    streamingMessageId,
  };
}

export function filterConversationMessages(
  messages: readonly ConversationMessage[],
  query: string,
): readonly ConversationMessage[] {
  const q = query.trim().toLowerCase();
  if (!q) return messages;
  return messages.filter((m) => m.text.toLowerCase().includes(q));
}

export function resetConversationSession(
  session: ExecutiveConversationSession,
  context: Pick<ExecutiveAdvisorContext, "packTitle" | "mode" | "goal">,
): ExecutiveConversationSession {
  return {
    ...createEmptyConversationSession(context),
    searchQuery: session.searchQuery,
  };
}

export function advisorReferencesToConversation(
  refs: readonly AdvisorReference[],
): ConversationReference[] {
  return refs.map((ref) => ({
    id: `cref-${ref.id}`,
    kind: ref.kind === "explorer" ? "explorer" : ref.kind,
    label: ref.label,
    objectId: ref.objectId,
    packId: ref.packId,
    scenarioId: ref.scenarioId,
    decisionId: ref.decisionId,
    nav: ref.nav,
    lens: ref.lens,
  }));
}
