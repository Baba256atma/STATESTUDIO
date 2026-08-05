/**
 * Sprint 6 — Conversation experience configuration (session-only).
 */

export const CONVERSATION_STREAM_CHUNK_MS = 22;
export const CONVERSATION_THINKING_MS = 280;
export const CONVERSATION_MESSAGE_CAP = 80;

export const CONVERSATION_QUICK_ACTIONS = [
  "Explain",
  "Compare",
  "Investigate",
  "Summarize",
  "Review",
  "Next Step",
] as const;

export type ConversationQuickAction =
  (typeof CONVERSATION_QUICK_ACTIONS)[number];

export const QUICK_ACTION_PROMPTS: Record<ConversationQuickAction, string> = {
  Explain: "Explain the current executive situation in plain language.",
  Compare: "Compare the active scenario options and their trade-offs.",
  Investigate: "Investigate today's executive risks and what is driving them.",
  Summarize: "Summarize the executive Runtime state for a board update.",
  Review: "Review open decisions and what still needs manager approval.",
  "Next Step": "What is the next best executive step from here?",
};

export const ATTACHMENTS_PLACEHOLDER =
  "Attachments coming soon — file uploads are not available in this release.";

export type MoreSuggestionItem = {
  readonly id: string;
  readonly label: string;
  readonly prompt: string;
};

/** Sprint 6.6 — ✨ More popover items */
export const MORE_SUGGESTION_ITEMS: readonly MoreSuggestionItem[] = [
  {
    id: "explain",
    label: "Explain",
    prompt: QUICK_ACTION_PROMPTS.Explain,
  },
  {
    id: "compare",
    label: "Compare",
    prompt: QUICK_ACTION_PROMPTS.Compare,
  },
  {
    id: "investigate",
    label: "Investigate",
    prompt: QUICK_ACTION_PROMPTS.Investigate,
  },
  {
    id: "review",
    label: "Review",
    prompt: QUICK_ACTION_PROMPTS.Review,
  },
  {
    id: "risks",
    label: "Executive Risks",
    prompt: "Show today's executive risks.",
  },
  {
    id: "simulation",
    label: "Simulation",
    prompt: "Interpret the latest simulation results for an executive decision.",
  },
  {
    id: "decision",
    label: "Decision",
    prompt: "What decision should I prepare or approve next?",
  },
  {
    id: "monitoring",
    label: "Monitoring",
    prompt: "Summarize monitoring health and alerts I should act on.",
  },
];
