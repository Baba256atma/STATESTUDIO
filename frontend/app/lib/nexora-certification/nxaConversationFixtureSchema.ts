/**
 * NXA:6-PREP — fixture schema for the conversation certification harness.
 * Named objects belong in fixtures only.
 */

import type { NxaConversationPathTrace } from "./nxaConversationPathTrace.ts";

export const NXA_CONVERSATION_CASE_FAMILIES = Object.freeze([
  "knowledge-definition",
  "singular-reveal",
  "collection-reveal",
  "singular-to-collection",
  "collection-to-singular",
  "follow-up-reference",
  "collection-readback",
  "comparison-judgment",
  "natural-reference",
  "ambiguity-clarification",
  "goal-aware",
  "investigation-consequence",
  "do-nothing-continuity",
  "decision-vs-commitment",
  "confirmation-safety",
  "execution-start-safety",
  "outcome-learning-readonly",
  "refresh-restoration",
  "back-forward",
  "rapid-command-switch",
  "advisor-queue-stage-parity",
  "knowledge-no-stage",
  "readonly-journey-preserve",
  "explicit-supersedes-focus",
  "architecture-language-strip",
] as const);

export type NxaConversationCaseFamily = (typeof NXA_CONVERSATION_CASE_FAMILIES)[number];

export type NxaConversationTurnExpectation = Readonly<{
  responseIncludes?: readonly string[];
  responseExcludes?: readonly string[];
  intentKind?: string;
  readWrite?: "read" | "write";
  stageEffect?: "none" | "focus" | "collection";
  focusId?: string | null;
  collectionCategory?: string | null;
  collectionMemberIds?: readonly string[];
  confirmationPending?: boolean;
  executionActive?: boolean;
  path?: Partial<NxaConversationPathTrace>;
}>;

export type NxaConversationTurn = Readonly<{
  utterance: string;
  expect?: NxaConversationTurnExpectation;
}>;

export type NxaConversationCase = Readonly<{
  id: string;
  title: string;
  purpose: string;
  families: readonly NxaConversationCaseFamily[];
  setup?: Readonly<{
    focusId?: string;
    restoreConversation?: boolean;
  }>;
  turns: readonly NxaConversationTurn[];
  queueParityCategory?: "problem" | "scenario" | "decision" | "execution";
  navigationProbe?: "back-forward";
}>;
