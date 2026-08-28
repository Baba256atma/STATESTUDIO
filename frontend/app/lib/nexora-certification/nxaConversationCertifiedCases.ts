/** Certified seed conversations for NXA:6-PREP. Not NXA:6 coverage. */

import type { NxaConversationCase } from "./nxaConversationFixtureSchema.ts";

const PROBLEM_IDS = Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]);
const DECISION_IDS = Object.freeze(["ctx-decision-capacity", "ctx-decision-reprice"]);
const ARCHITECTURE = Object.freeze([
  "CC:4", "DIR:1", "NCA-POST", "mapRevealCollection", "open-queue-collection",
]);

export const NXA_CERTIFIED_CONVERSATION_CASES: readonly NxaConversationCase[] = Object.freeze([
  Object.freeze({
    id: "prep-knowledge-definition",
    title: "Knowledge definition does not move Stage",
    purpose: "Certified NXA:1 knowledge protection",
    families: Object.freeze(["knowledge-definition", "knowledge-no-stage", "architecture-language-strip"] as const),
    setup: Object.freeze({ focusId: "ctx-problem-margin" }),
    turns: Object.freeze([
      Object.freeze({
        utterance: "What is a Problem?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          focusId: "ctx-problem-margin",
          responseExcludes: ARCHITECTURE,
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-singular-reveal",
    title: "Explicit singular show focuses the named Problem",
    purpose: "Certified singular presentation",
    families: Object.freeze(["singular-reveal"] as const),
    turns: Object.freeze([
      Object.freeze({
        utterance: "show Margin Pressure",
        expect: Object.freeze({
          readWrite: "write",
          stageEffect: "focus",
          focusId: "ctx-problem-margin",
          responseIncludes: Object.freeze(["Margin Pressure"]),
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-collection-and-parity",
    title: "Show problems presents the canonical collection",
    purpose: "Certified FIX2 Advisor collection presentation",
    families: Object.freeze([
      "collection-reveal",
      "advisor-queue-stage-parity",
      "explicit-supersedes-focus",
    ] as const),
    setup: Object.freeze({ focusId: "ctx-problem-margin", restoreConversation: true }),
    queueParityCategory: "problem",
    turns: Object.freeze([
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({
          readWrite: "write",
          stageEffect: "collection",
          focusId: null,
          collectionCategory: "problem",
          collectionMemberIds: PROBLEM_IDS,
          responseIncludes: Object.freeze(["Capacity Gap", "Margin Pressure"]),
          responseExcludes: ARCHITECTURE,
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-mode-transitions",
    title: "Singular and collection commands replace each other",
    purpose: "Certified focus/collection transitions",
    families: Object.freeze(["singular-to-collection", "collection-to-singular"] as const),
    turns: Object.freeze([
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({ stageEffect: "collection", collectionCategory: "problem" }),
      }),
      Object.freeze({
        utterance: "show Margin Pressure",
        expect: Object.freeze({ stageEffect: "focus", focusId: "ctx-problem-margin" }),
      }),
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({
          stageEffect: "collection",
          focusId: null,
          collectionMemberIds: PROBLEM_IDS,
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-readback-judgment",
    title: "Stage readback and judgment stay on Problems",
    purpose: "Certified FIX1 judgment + FIX2 readback",
    families: Object.freeze([
      "follow-up-reference",
      "collection-readback",
      "comparison-judgment",
      "readonly-journey-preserve",
    ] as const),
    turns: Object.freeze([
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({ stageEffect: "collection", collectionCategory: "problem" }),
      }),
      Object.freeze({
        utterance: "what is on stage now?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          collectionCategory: "problem",
          collectionMemberIds: PROBLEM_IDS,
          responseIncludes: Object.freeze(["Capacity Gap", "Margin Pressure"]),
        }),
      }),
      Object.freeze({
        utterance: "which one is more important?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          collectionCategory: "problem",
          responseExcludes: Object.freeze(["evaluated scenarios"]),
        }),
      }),
      Object.freeze({
        utterance: "why?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          collectionCategory: "problem",
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-natural-and-goal",
    title: "Natural collection phrasing and Goal-aware read",
    purpose: "Certified show-all and Goal question without Stage theft",
    families: Object.freeze(["natural-reference", "goal-aware", "investigation-consequence"] as const),
    setup: Object.freeze({ focusId: "ctx-problem-margin" }),
    turns: Object.freeze([
      Object.freeze({
        utterance: "show all problems",
        expect: Object.freeze({
          stageEffect: "collection",
          collectionMemberIds: PROBLEM_IDS,
        }),
      }),
      Object.freeze({
        utterance: "what happens to the Goal if we do nothing?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          collectionCategory: "problem",
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-continuity-safety",
    title: "Do-nothing, Decision, Execution, Outcome remain non-mutating from knowledge",
    purpose: "Certified CC confirmation/execution/outcome safety",
    families: Object.freeze([
      "do-nothing-continuity",
      "decision-vs-commitment",
      "confirmation-safety",
      "execution-start-safety",
      "outcome-learning-readonly",
    ] as const),
    setup: Object.freeze({ focusId: "ctx-problem-margin" }),
    turns: Object.freeze([
      Object.freeze({
        utterance: "Thanks.",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          focusId: "ctx-problem-margin",
        }),
      }),
      Object.freeze({
        utterance: "show decisions",
        expect: Object.freeze({
          stageEffect: "collection",
          collectionCategory: "decision",
          collectionMemberIds: DECISION_IDS,
        }),
      }),
      Object.freeze({
        utterance: "which one should I commit?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          collectionCategory: "decision",
          confirmationPending: false,
          executionActive: false,
        }),
      }),
      Object.freeze({
        utterance: "what did we learn?",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          collectionCategory: "decision",
          executionActive: false,
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-rapid-and-restore",
    title: "Rapid commands and restored focus honor the latest explicit collection",
    purpose: "Certified FIX2 last-writer and restoration precedence",
    families: Object.freeze(["rapid-command-switch", "refresh-restoration"] as const),
    setup: Object.freeze({ focusId: "ctx-problem-margin", restoreConversation: true }),
    turns: Object.freeze([
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({ stageEffect: "collection", collectionCategory: "problem" }),
      }),
      Object.freeze({
        utterance: "show decisions",
        expect: Object.freeze({ stageEffect: "collection", collectionCategory: "decision" }),
      }),
      Object.freeze({
        utterance: "show scenarios",
        expect: Object.freeze({ stageEffect: "collection", collectionCategory: "scenario" }),
      }),
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({
          stageEffect: "collection",
          collectionCategory: "problem",
          collectionMemberIds: PROBLEM_IDS,
        }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-back-forward",
    title: "Back returns to the Problems collection",
    purpose: "Certified Stage trail after collection then focus",
    families: Object.freeze(["back-forward"] as const),
    navigationProbe: "back-forward",
    turns: Object.freeze([
      Object.freeze({
        utterance: "Focus on Margin Pressure.",
        expect: Object.freeze({ stageEffect: "focus", focusId: "ctx-problem-margin" }),
      }),
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({ stageEffect: "collection", collectionCategory: "problem" }),
      }),
      Object.freeze({
        utterance: "Focus on Capacity Gap.",
        expect: Object.freeze({ stageEffect: "focus", focusId: "ctx-problem-capacity" }),
      }),
    ]),
  }),
  Object.freeze({
    id: "prep-ambiguity",
    title: "Underspecified compare does not invent Stage movement",
    purpose: "Certified clarification/judgment without navigation",
    families: Object.freeze(["ambiguity-clarification"] as const),
    setup: Object.freeze({ focusId: "ctx-problem-margin" }),
    turns: Object.freeze([
      Object.freeze({
        utterance: "compare them",
        expect: Object.freeze({
          readWrite: "read",
          stageEffect: "none",
          focusId: "ctx-problem-margin",
        }),
      }),
    ]),
  }),
]);

export const NXA_HARNESS_INVALID_SYNTHETIC_CASE: NxaConversationCase = Object.freeze({
  id: "prep-invalid-synthetic",
  title: "Synthetic harness self-test only",
  purpose: "Prove the harness detects a false Stage expectation",
  families: Object.freeze(["collection-reveal"] as const),
  setup: Object.freeze({ focusId: "ctx-problem-margin" }),
  turns: Object.freeze([
    Object.freeze({
      utterance: "show problems",
      expect: Object.freeze({
        stageEffect: "focus",
        focusId: "ctx-problem-margin",
      }),
    }),
  ]),
});
