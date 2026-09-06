/**
 * NEX-ENT:1 — Entrance & Nexora Introduction contracts.
 *
 * Orchestration/presentation only. Does not own Stage, Advisor, Director,
 * conversation engine, Objects, Data Reality, Decision, Execution, Outcome,
 * or Learning. Does not invent business truth.
 */

import {
  emptyNexoraConversationWorkingContext,
  type NexoraConversationWorkingContext,
} from "@/app/lib/nexora-conversation/nexoraConversationWorkingContext.ts";

export const nexoraGuidedEntranceIdentity =
  "NEX-ENT:1/NexoraEntranceAndIntroduction" as const;
export const nexoraGuidedEntranceVersion = "1.0.0" as const;
export const nexoraGuidedEntranceNamespace =
  "nexora.experience.guided-entrance.introduction" as const;

export const NEXORA_GUIDED_ENTRANCE_BOUNDARY = Object.freeze({
  identity: nexoraGuidedEntranceIdentity,
  secondExecutiveRoute: false as const,
  tutorialPage: false as const,
  secondStage: false as const,
  secondAdvisor: false as const,
  secondDirector: false as const,
  secondConversationEngine: false as const,
  secondObjectStore: false as const,
  secondDataReality: false as const,
  secondExecutiveJourney: false as const,
  secondDecisionAuthority: false as const,
  fabricatesBusinessObjects: false as const,
  durableOnboardingStore: false as const,
  implementsGuidedAttention: false as const,
  implementsStageEducation: false as const,
  usesLlm: false as const,
  keywordRouter: false as const,
  impersonatesManager: false as const,
});

export const NEXORA_GUIDED_ENTRANCE_STATES = Object.freeze([
  "INACTIVE",
  "READY",
  "INTRODUCING",
  "AWAITING_MANAGER",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraGuidedEntranceState =
  (typeof NEXORA_GUIDED_ENTRANCE_STATES)[number];

export type NexoraGuidedEntranceSuggestedAction = {
  readonly id: string;
  readonly label: string;
  readonly utterance: string;
  readonly kind: "answer" | "question";
};

export const NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS = Object.freeze([
  Object.freeze({
    id: "continue" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "capability" as const,
    label: "What can Nexora do?",
    utterance: "What can Nexora do?",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip" as const,
    label: "Skip introduction",
    utterance: "Skip introduction",
    kind: "answer" as const,
  }),
]);

export const nexoraStageEducationIdentity =
  "NEX-ENT:2/StageWorkspaceEducation" as const;
export const nexoraStageEducationVersion = "1.0.0" as const;
export const nexoraStageEducationNamespace =
  "nexora.experience.guided-entrance.stage-education" as const;

export const NEXORA_STAGE_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraStageEducationIdentity,
  secondStage: false as const,
  tutorialStage: false as const,
  secondDirector: false as const,
  secondAdvisor: false as const,
  secondConversationEngine: false as const,
  secondObjectStore: false as const,
  secondStageStateStore: false as const,
  fabricatesBusinessObjects: false as const,
  mutatesBusinessTruth: false as const,
  implementsObjectEducation: false as const,
  implementsGuidedAttention: false as const,
  durableOnboardingStore: false as const,
});

export const NEXORA_STAGE_EDUCATION_STATES = Object.freeze([
  "INACTIVE",
  "INTRODUCING",
  "AWAITING_FOCUS",
  "FOCUS_DEMONSTRATED",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraStageEducationState =
  (typeof NEXORA_STAGE_EDUCATION_STATES)[number];

export type NexoraStageEducationSession = {
  readonly state: NexoraStageEducationState;
  readonly focusDemonstrated: boolean;
  readonly managerInteracted: boolean;
};

export type NexoraStagePresentationCue = "orient" | "demonstrate-focus" | null;

export const NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS = Object.freeze([
  Object.freeze({
    id: "focus" as const,
    label: "Show me how focus works",
    utterance: "Show me how focus works",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "appears" as const,
    label: "What appears here?",
    utterance: "What appears here?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "dashboard" as const,
    label: "Is this a dashboard?",
    utterance: "Is this a dashboard?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const NEXORA_STAGE_EDUCATION_FOCUS_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-focus" as const,
    label: "Show me",
    utterance: "Show me how focus works",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "explain-focus" as const,
    label: "Explain first",
    utterance: "Explain first",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const nexoraEntranceConversationContinuityIdentity =
  "NEX-ENT-FIX1/EntranceConversationContinuity" as const;
export const nexoraEntranceConversationContinuityVersion = "1.0.0" as const;
export const nexoraEntranceConversationContinuityNamespace =
  "nexora.experience.guided-entrance.conversation-continuity" as const;

export const NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY = Object.freeze({
  identity: nexoraEntranceConversationContinuityIdentity,
  secondConversationEngine: false as const,
  secondAdvisor: false as const,
  secondNlu: false as const,
  transcriptDatabase: false as const,
  duplicateLessonStore: false as const,
  secondStage: false as const,
  businessWriter: false as const,
  startsEnt11: false as const,
});

export type NexoraEntranceLessonSubject =
  | "CAPABILITY"
  | "STAGE"
  | "FOCUS"
  | "APPEARS"
  | null;

export type NexoraEntranceLessonAction =
  | "EXPLAIN"
  | "DEMONSTRATE"
  | "CONTINUE"
  | "ASK"
  | null;

export type NexoraEntranceLessonResult =
  | "PRESENTED"
  | "EXPLAINED"
  | "ACKNOWLEDGED"
  | null;

export type NexoraEntranceExplanationDepth =
  | "NONE"
  | "INTRODUCTORY"
  | "DEEPENED"
  | "PRACTICAL"
  | "SATURATED";

export type NexoraEntranceConversationContinuitySession = {
  readonly subject: NexoraEntranceLessonSubject;
  readonly lastAction: NexoraEntranceLessonAction;
  readonly lastResult: NexoraEntranceLessonResult;
  readonly capabilityDepth: NexoraEntranceExplanationDepth;
  readonly focusExplained: boolean;
  readonly focusWhyDepth: NexoraEntranceExplanationDepth;
  readonly focusExplainDepth: NexoraEntranceExplanationDepth;
  readonly appearsDepth: NexoraEntranceExplanationDepth;
  readonly dashboardDepth: NexoraEntranceExplanationDepth;
  readonly stageExplainDepth: NexoraEntranceExplanationDepth;
  readonly lastEducationalResponse: string | null;
  readonly working: NexoraConversationWorkingContext;
};

export function inactiveNexoraEntranceConversationContinuitySession(): NexoraEntranceConversationContinuitySession {
  return Object.freeze({
    subject: null,
    lastAction: null,
    lastResult: null,
    capabilityDepth: "NONE" as const,
    focusExplained: false,
    focusWhyDepth: "NONE" as const,
    focusExplainDepth: "NONE" as const,
    appearsDepth: "NONE" as const,
    dashboardDepth: "NONE" as const,
    stageExplainDepth: "NONE" as const,
    lastEducationalResponse: null,
    working: emptyNexoraConversationWorkingContext(),
  });
}

export const NEXORA_STAGE_EDUCATION_AFTER_DEMO_ACTIONS = Object.freeze([
  Object.freeze({
    id: "explain-saw" as const,
    label: "Explain what I saw",
    utterance: "Explain first",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "continue-after-focus" as const,
    label: "Continue",
    utterance: "Continue",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "show-again" as const,
    label: "Show again",
    utterance: "Show me how focus works",
    kind: "answer" as const,
  }),
]);

export const NEXORA_GUIDED_ENTRANCE_AFTER_CAPABILITY_ACTIONS = Object.freeze([
  Object.freeze({
    id: "continue" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip" as const,
    label: "Skip introduction",
    utterance: "Skip introduction",
    kind: "answer" as const,
  }),
]);

export const NEXORA_GUIDED_ENTRANCE_CAPABILITY_PROGRESS_ACTIONS = Object.freeze([
  Object.freeze({
    id: "continue" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "capability-which" as const,
    label: "What should we start with?",
    utterance: "What should we start with?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip" as const,
    label: "Skip introduction",
    utterance: "Skip introduction",
    kind: "answer" as const,
  }),
]);

export const NEXORA_STAGE_APPEARS_PROGRESS_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-focus" as const,
    label: "Show me focus",
    utterance: "Show me how focus works",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "continue-after-focus" as const,
    label: "Continue",
    utterance: "Continue",
    kind: "answer" as const,
  }),
]);

export const NEXORA_STAGE_APPEARS_SATURATED_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-focus" as const,
    label: "Show me focus",
    utterance: "Show me how focus works",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "appears-now" as const,
    label: "What is here now?",
    utterance: "What is here right now?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "continue-after-focus" as const,
    label: "Continue",
    utterance: "Continue",
    kind: "answer" as const,
  }),
]);

/**
 * Reserved for later NEX-ENT phases. NEX-ENT:1 must not implement Guided
 * Attention. Future attention belongs to Director/Stage presentation, never
 * Advisor DOM mutation.
 */
export type NexoraGuidedAttentionIntent = {
  readonly targetSubjectId: string | null;
  readonly reason: string;
  readonly presentationOwner: "director-stage";
  readonly implemented: false;
};

export const NEXORA_GUIDED_ATTENTION_RESERVED: NexoraGuidedAttentionIntent =
  Object.freeze({
    targetSubjectId: null,
    reason: "Reserved for later NEX-ENT phases",
    presentationOwner: "director-stage",
    implemented: false,
  });

export const nexoraObjectEducationIdentity =
  "NEX-ENT:3/ObjectLanguageEducation" as const;
export const nexoraObjectEducationVersion = "1.0.0" as const;
export const nexoraObjectEducationNamespace =
  "nexora.experience.guided-entrance.object-education" as const;

export const NEXORA_OBJECT_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraObjectEducationIdentity,
  secondObjectSystem: false as const,
  onboardingObjectStore: false as const,
  fabricatesBusinessObjects: false as const,
  mutatesBusinessTruth: false as const,
  writesDecisionCommitment: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  writesDataReality: false as const,
  implementsDataEducation: false as const,
  implementsChartEducation: false as const,
  implementsVariableSystem: false as const,
  implementsGuidedAttention: false as const,
  durableOnboardingStore: false as const,
});

export const NEXORA_OBJECT_EDUCATION_STATES = Object.freeze([
  "NOT_STARTED",
  "GOAL",
  "KPI",
  "ISSUE",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "REVIEW",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraObjectEducationState =
  (typeof NEXORA_OBJECT_EDUCATION_STATES)[number];

export type NexoraEducationalObjectKind =
  | "goal"
  | "kpi"
  | "problem"
  | "risk"
  | "scenario"
  | "decision"
  | "execution"
  | "outcome";

export type NexoraObjectEducationSession = {
  readonly state: NexoraObjectEducationState;
  readonly currentObjectId: string | null;
  readonly lastReferenceId: string | null;
};

export const NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS = Object.freeze([
  Object.freeze({
    id: "what-is-this" as const,
    label: "What is this?",
    utterance: "What is this?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "why-here" as const,
    label: "Why is it on Stage?",
    utterance: "Why is it on Stage?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "difference" as const,
    label: "What’s the difference?",
    utterance: "What's the difference?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "next-object" as const,
    label: "Show me the next one",
    utterance: "Show me the next one",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const nexoraConversationEducationIdentity =
  "NEX-ENT:4/AdvisorGuidedConversation" as const;
export const nexoraConversationEducationVersion = "1.0.0" as const;
export const nexoraConversationEducationNamespace =
  "nexora.experience.guided-entrance.conversation-education" as const;

export const NEXORA_CONVERSATION_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraConversationEducationIdentity,
  secondConversationEngine: false as const,
  onboardingNluEngine: false as const,
  tutorialKeywordRouter: false as const,
  secondAdvisor: false as const,
  secondDialogueStateStore: false as const,
  duplicateClarificationSystem: false as const,
  duplicateReferenceResolver: false as const,
  duplicateStageAwareness: false as const,
  onboardingCommandParser: false as const,
  secondDirector: false as const,
  secondStage: false as const,
  newBusinessAuthority: false as const,
  fabricatesBusinessObjects: false as const,
  fabricatesComparisonWinner: false as const,
  fabricatesCausality: false as const,
  writesDecisionCommitment: false as const,
  implementsGuidedAttention: false as const,
  implementsDataEducation: false as const,
  implementsChartEducation: false as const,
  implementsVariableSystem: false as const,
  durableOnboardingStore: false as const,
  advisorDirectStageDom: false as const,
});

export const NEXORA_CONVERSATION_EDUCATION_STATES = Object.freeze([
  "NOT_STARTED",
  "ASK",
  "SHOW",
  "EXPLAIN",
  "INVESTIGATE",
  "COMPARE",
  "REVIEW",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraConversationEducationState =
  (typeof NEXORA_CONVERSATION_EDUCATION_STATES)[number];

export type NexoraConversationEducationSession = {
  readonly state: NexoraConversationEducationState;
};

export const NEXORA_CONVERSATION_EDUCATION_ASK_ACTIONS = Object.freeze([
  Object.freeze({
    id: "what-is-this" as const,
    label: "What is this?",
    utterance: "What is this?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "show-something" as const,
    label: "Show me something",
    utterance: "Show me something",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const NEXORA_CONVERSATION_EDUCATION_SHOW_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-problems" as const,
    label: "Show me the problems",
    utterance: "Show me the problems",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "see-issues" as const,
    label: "Let me see the issues",
    utterance: "Let me see the issues",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "next-conversation" as const,
    label: "Show me the next one",
    utterance: "Show me the next one",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const NEXORA_CONVERSATION_EDUCATION_EXPLAIN_ACTIONS = Object.freeze([
  Object.freeze({
    id: "explain-this" as const,
    label: "Explain this",
    utterance: "Explain this",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "investigate-this" as const,
    label: "Investigate this",
    utterance: "Investigate this",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "why" as const,
    label: "Why?",
    utterance: "Why?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "next-conversation" as const,
    label: "Show me the next one",
    utterance: "Show me the next one",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const NEXORA_CONVERSATION_EDUCATION_COMPARE_ACTIONS = Object.freeze([
  Object.freeze({
    id: "compare-these" as const,
    label: "Compare these",
    utterance: "Compare these",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "not-sure" as const,
    label: "I’m not sure",
    utterance: "I'm not sure",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "next-conversation" as const,
    label: "Show me the next one",
    utterance: "Show me the next one",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const NEXORA_CONVERSATION_EDUCATION_REVIEW_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-something" as const,
    label: "Show me something",
    utterance: "Show me something",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "explain-this" as const,
    label: "Explain this",
    utterance: "Explain this",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "investigate-this" as const,
    label: "Investigate this",
    utterance: "Investigate this",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "compare-these" as const,
    label: "Compare these",
    utterance: "Compare these",
    kind: "question" as const,
  }),
]);

export const nexoraAttentionEducationIdentity =
  "NEX-ENT:5/GuidedAttentionEducation" as const;
export const nexoraAttentionEducationVersion = "1.0.0" as const;
export const nexoraAttentionEducationNamespace =
  "nexora.experience.guided-entrance.attention-education" as const;

export const NEXORA_ATTENTION_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraAttentionEducationIdentity,
  ownsGuidedAttention: false as const,
  advisorDomManipulation: false as const,
  autoClicks: false as const,
  implementsDataEducation: false as const,
  implementsChartEducation: false as const,
  durableOnboardingStore: false as const,
});

export const NEXORA_ATTENTION_EDUCATION_STATES = Object.freeze([
  "NOT_STARTED",
  "INTRODUCING",
  "DATA_GUIDANCE",
  "SECOND_TARGET",
  "REVIEW",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraAttentionEducationState =
  (typeof NEXORA_ATTENTION_EDUCATION_STATES)[number];

export type NexoraAttentionEducationSession = {
  readonly state: NexoraAttentionEducationState;
};

export const NEXORA_ATTENTION_EDUCATION_INTRO_ACTIONS = Object.freeze([
  Object.freeze({
    id: "where-is-data" as const,
    label: "Where is Data?",
    utterance: "Where is Data?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const NEXORA_ATTENTION_EDUCATION_OFFER_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-where" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "not-now" as const,
    label: "Not now",
    utterance: "Not now",
    kind: "answer" as const,
  }),
]);

export const NEXORA_ATTENTION_EDUCATION_NEXT_ACTIONS = Object.freeze([
  Object.freeze({
    id: "where-is-data" as const,
    label: "Where is Data?",
    utterance: "Where is Data?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "where-objects" as const,
    label: "Where do objects appear?",
    utterance: "Where do objects appear?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "how-back" as const,
    label: "How do I go back?",
    utterance: "How do I go back?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "next-conversation" as const,
    label: "Show me the next one",
    utterance: "Show me the next one",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-education" as const,
    label: "Skip",
    utterance: "Skip this",
    kind: "answer" as const,
  }),
]);

export const nexoraDataEducationIdentity =
  "NEX-ENT:6/DataEvidenceEducation" as const;
export const nexoraDataEducationVersion = "1.0.0" as const;
export const nexoraDataEducationNamespace =
  "nexora.experience.guided-entrance.data-education" as const;

export const NEXORA_DATA_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraDataEducationIdentity,
  ownsIngestion: false as const,
  ownsCsvParser: false as const,
  ownsDataLibrary: false as const,
  ownsDataReality: false as const,
  ownsDataObject: false as const,
  semanticWriter: "applyCsvSemanticClarification" as const,
  ownsGuidedAttention: false as const,
  autoOpensData: false as const,
  autoOpensFileChooser: false as const,
  fabricatesFieldMeaning: false as const,
  writesDecision: false as const,
  implementsChartEducation: false as const,
  durableOnboardingStore: false as const,
});

export const NEXORA_DATA_EDUCATION_STATES = Object.freeze([
  "NOT_STARTED",
  "SOURCE",
  "PREVIEW",
  "MEANING",
  "CLARIFICATION",
  "EVIDENCE",
  "DATA_OBJECT",
  "REVIEW",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraDataEducationState =
  (typeof NEXORA_DATA_EDUCATION_STATES)[number];

export type NexoraDataEducationSession = {
  readonly state: NexoraDataEducationState;
  readonly examplePath: boolean;
};

export const NEXORA_DATA_EDUCATION_CHOICE_ACTIONS = Object.freeze([
  Object.freeze({
    id: "example" as const,
    label: "Show me an example",
    utterance: "Show me an example",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "own-csv" as const,
    label: "Use my CSV",
    utterance: "Use my CSV",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-data" as const,
    label: "Skip for now",
    utterance: "Skip for now",
    kind: "answer" as const,
  }),
]);

export const NEXORA_DATA_EDUCATION_QUESTION_ACTIONS = Object.freeze([
  Object.freeze({
    id: "why-asking" as const,
    label: "Why are you asking?",
    utterance: "Why are you asking?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "field-meaning" as const,
    label: "What does this field mean?",
    utterance: "What does BKL mean?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "correct" as const,
    label: "Can I correct it?",
    utterance: "Can I correct it?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "remove-later" as const,
    label: "Can I remove this later?",
    utterance: "Can I remove this later?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "next" as const,
    label: "Show me the next one",
    utterance: "Show me the next one",
    kind: "question" as const,
  }),
]);

export const nexoraVisualEducationIdentity =
  "NEX-ENT:7/VisualIntelligenceEducation" as const;
export const nexoraVisualEducationVersion = "1.0.0" as const;
export const nexoraVisualEducationNamespace =
  "nexora.experience.guided-entrance.visual-education" as const;

export const NEXORA_VISUAL_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraVisualEducationIdentity,
  ownsVisualIntelligence: false as const,
  ownsEvidence: false as const,
  ownsDirector: false as const,
  ownsStage: false as const,
  writesObjects: false as const,
  writesDecision: false as const,
  writesDataReality: false as const,
  secondChartSystem: false as const,
  durableOnboardingStore: false as const,
});

export const NEXORA_VISUAL_EDUCATION_STATES = Object.freeze([
  "NOT_STARTED",
  "PURPOSE",
  "TREND",
  "COMPARE",
  "LIMITS",
  "REVIEW",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraVisualEducationState =
  (typeof NEXORA_VISUAL_EDUCATION_STATES)[number];

export type NexoraVisualEducationSession = {
  readonly state: NexoraVisualEducationState;
};

export const NEXORA_VISUAL_EDUCATION_INTRO_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-visual" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "what-visualize" as const,
    label: "What can I visualize?",
    utterance: "What can I visualize?",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-visual" as const,
    label: "Skip for now",
    utterance: "Skip for now",
    kind: "answer" as const,
  }),
]);

export const NEXORA_VISUAL_EDUCATION_QUESTION_ACTIONS = Object.freeze([
  Object.freeze({
    id: "delivery-over-time" as const,
    label: "Show delivery over time",
    utterance: "Show me delivery over time",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "how-changed" as const,
    label: "How has delivery changed?",
    utterance: "How has delivery changed?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "why-visual" as const,
    label: "Why this visual?",
    utterance: "Why did you choose this view?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "what-show" as const,
    label: "What does this show?",
    utterance: "What does this show?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "provenance" as const,
    label: "What data is this using?",
    utterance: "What data is this using?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "compare-periods" as const,
    label: "Compare the two periods",
    utterance: "Compare delivery across the two periods",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-visual-q" as const,
    label: "Skip for now",
    utterance: "Skip for now",
    kind: "answer" as const,
  }),
]);

export const nexoraDecisionLoopEducationIdentity =
  "NEX-ENT:8/DecisionLoopEducation" as const;
export const nexoraDecisionLoopEducationVersion = "1.0.0" as const;
export const nexoraDecisionLoopEducationNamespace =
  "nexora.experience.guided-entrance.decision-loop-education" as const;

export const NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY = Object.freeze({
  identity: nexoraDecisionLoopEducationIdentity,
  ownsIssueTruth: false as const,
  ownsScenarioTruth: false as const,
  ownsComparison: false as const,
  ownsRecommendation: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  secondDecisionLoop: false as const,
  durableOnboardingStore: false as const,
  decisionWriter: "CC:10R/CanonicalDecisionRuntime" as const,
  executionWriter: "CC:11/CanonicalExecution" as const,
});

export const NEXORA_DECISION_LOOP_EDUCATION_STATES = Object.freeze([
  "NOT_STARTED",
  "EVIDENCE",
  "ISSUE",
  "INVESTIGATE",
  "SCENARIOS",
  "COMPARE",
  "RECOMMEND",
  "COMMIT",
  "EXECUTION",
  "OUTCOME",
  "REVIEW",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraDecisionLoopEducationState =
  (typeof NEXORA_DECISION_LOOP_EDUCATION_STATES)[number];

export type NexoraDecisionLoopEducationSession = {
  readonly state: NexoraDecisionLoopEducationState;
};

export const NEXORA_DECISION_LOOP_EDUCATION_INTRO_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-loop" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "how-works" as const,
    label: "How does it work?",
    utterance: "How does it work?",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-loop" as const,
    label: "Skip for now",
    utterance: "Skip for now",
    kind: "answer" as const,
  }),
]);

export const NEXORA_DECISION_LOOP_EDUCATION_QUESTION_ACTIONS = Object.freeze([
  Object.freeze({
    id: "what-know" as const,
    label: "What do we know?",
    utterance: "What do we know?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "why-problem" as const,
    label: "Why is this a problem?",
    utterance: "Why is this a problem?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "is-cause" as const,
    label: "Is this the cause?",
    utterance: "Is capacity the cause?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "compare-q" as const,
    label: "Compare the scenarios",
    utterance: "Compare the scenarios",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "recommend-q" as const,
    label: "Which would you recommend?",
    utterance: "Which would you recommend?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "not-yet" as const,
    label: "Not yet",
    utterance: "Not yet",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-loop-q" as const,
    label: "Skip for now",
    utterance: "Skip for now",
    kind: "answer" as const,
  }),
]);

export const nexoraTrustReviewIdentity = "NEX-ENT:9/TrustReview" as const;
export const nexoraTrustReviewVersion = "1.0.0" as const;
export const nexoraTrustReviewNamespace =
  "nexora.experience.guided-entrance.trust-review" as const;

export const NEXORA_TRUST_REVIEW_BOUNDARY = Object.freeze({
  identity: nexoraTrustReviewIdentity,
  trustScore: false as const,
  quizEngine: false as const,
  secondTrustSystem: false as const,
  writesDecision: false as const,
  writesSemantics: false as const,
  writesExecution: false as const,
  durableOnboardingStore: false as const,
  startsPersonalDemo: false as const,
  semanticWriter: "applyCsvSemanticClarification" as const,
  decisionWriter: "CC:10R/CanonicalDecisionRuntime" as const,
});

export const NEXORA_TRUST_REVIEW_STATES = Object.freeze([
  "NOT_STARTED",
  "SOURCE",
  "UNCERTAINTY",
  "EVIDENCE",
  "EXPLANATION",
  "AUTHORITY",
  "QUICK_REVIEW",
  "READY",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraTrustReviewState = (typeof NEXORA_TRUST_REVIEW_STATES)[number];

export type NexoraTrustReviewSession = {
  readonly state: NexoraTrustReviewState;
  readonly reviewStep: 0 | 1 | 2 | 3;
};

export const NEXORA_TRUST_REVIEW_INTRO_ACTIONS = Object.freeze([
  Object.freeze({
    id: "show-trust" as const,
    label: "Show me",
    utterance: "Show me",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "what-rules" as const,
    label: "What rules?",
    utterance: "What rules?",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-review" as const,
    label: "Skip review",
    utterance: "Skip review",
    kind: "answer" as const,
  }),
]);

export const NEXORA_TRUST_REVIEW_QUESTION_ACTIONS = Object.freeze([
  Object.freeze({
    id: "where-from" as const,
    label: "Where did this come from?",
    utterance: "Where did this information come from?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "how-sure" as const,
    label: "How sure are you?",
    utterance: "Are you sure?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "why-rec" as const,
    label: "Why?",
    utterance: "Why did you recommend that?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "decide-for" as const,
    label: "Can you decide for me?",
    utterance: "Can you decide for me?",
    kind: "question" as const,
  }),
  Object.freeze({
    id: "skip-trust-q" as const,
    label: "Skip review",
    utterance: "Skip review",
    kind: "answer" as const,
  }),
]);

export const NEXORA_TRUST_REVIEW_Q1_ACTIONS = Object.freeze([
  Object.freeze({
    id: "ask-keep" as const,
    label: "Ask me",
    utterance: "Ask me or keep it unresolved",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "guess" as const,
    label: "Guess",
    utterance: "Guess the most likely meaning",
    kind: "answer" as const,
  }),
]);

export const NEXORA_TRUST_REVIEW_Q2_ACTIONS = Object.freeze([
  Object.freeze({
    id: "cause-no" as const,
    label: "No",
    utterance: "No",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "cause-yes" as const,
    label: "Yes",
    utterance: "Yes",
    kind: "answer" as const,
  }),
]);

export const NEXORA_TRUST_REVIEW_Q3_ACTIONS = Object.freeze([
  Object.freeze({
    id: "still-decide" as const,
    label: "No, I still decide",
    utterance: "No, I still decide",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "already-decision" as const,
    label: "Yes",
    utterance: "Yes",
    kind: "answer" as const,
  }),
]);

export const nexoraPersonalDemoHandoffIdentity =
  "NEX-ENT:10/PersonalDemoHandoff" as const;
export const nexoraPersonalDemoHandoffVersion = "1.0.0" as const;
export const nexoraPersonalDemoHandoffNamespace =
  "nexora.experience.guided-entrance.personal-demo-handoff" as const;

export const NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY = Object.freeze({
  identity: nexoraPersonalDemoHandoffIdentity,
  secondExecutive: false as const,
  secondStage: false as const,
  secondAdvisor: false as const,
  parallelIdentityStore: false as const,
  parallelGoalStore: false as const,
  parallelDataStore: false as const,
  writesIdentity: false as const,
  writesGoal: false as const,
  writesData: false as const,
  writesDecision: false as const,
  genericObjectRename: false as const,
  startsEnt11: false as const,
  identityWriter: "NEX-EXP:1/applyManagerIdentityUtterance" as const,
  goalWriter: "NEX-EXP:2/GoalDiscovery" as const,
  dataWriter: "DATA-UX/RDI Use" as const,
  centralWorkspace: "NEX-EXP:1/obj-executive-context" as const,
  bcaPersists: false as const,
});

export const NEXORA_PERSONAL_DEMO_HANDOFF_STATES = Object.freeze([
  "NOT_STARTED",
  "INTRO",
  "MANAGER_CONTEXT",
  "WORK_CONTEXT",
  "WORKSPACE_IDENTITY",
  "GOAL",
  "DATA_CHOICE",
  "READY",
  "HANDOFF",
  "COMPLETED",
  "SKIPPED",
] as const);

export type NexoraPersonalDemoHandoffState =
  (typeof NEXORA_PERSONAL_DEMO_HANDOFF_STATES)[number];

export type NexoraPersonalDemoHandoffSession = {
  readonly state: NexoraPersonalDemoHandoffState;
};

export const NEXORA_PERSONAL_DEMO_HANDOFF_INTRO_ACTIONS = Object.freeze([
  Object.freeze({
    id: "lets-do-it" as const,
    label: "Let’s do it",
    utterance: "Let's do it",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "what-need" as const,
    label: "What do you need?",
    utterance: "What do you need?",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "skip-handoff" as const,
    label: "Skip for now",
    utterance: "Skip for now",
    kind: "answer" as const,
  }),
]);

export const NEXORA_PERSONAL_DEMO_HANDOFF_CONTEXT_ACTIONS = Object.freeze([
  Object.freeze({
    id: "ctx-business" as const,
    label: "A business",
    utterance: "This is a business.",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "ctx-project" as const,
    label: "A project",
    utterance: "This is a project.",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "ctx-both" as const,
    label: "Both",
    utterance: "Both",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "ctx-unsure" as const,
    label: "I’m not sure",
    utterance: "I'm not sure",
    kind: "answer" as const,
  }),
]);

export const NEXORA_PERSONAL_DEMO_HANDOFF_DATA_ACTIONS = Object.freeze([
  Object.freeze({
    id: "use-data" as const,
    label: "Use my data",
    utterance: "Use my data",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "without-data" as const,
    label: "Start without data",
    utterance: "Start without data",
    kind: "answer" as const,
  }),
  Object.freeze({
    id: "how-data" as const,
    label: "Show me how",
    utterance: "Show me how",
    kind: "answer" as const,
  }),
]);

export type NexoraGuidedEntranceSession = {
  readonly state: NexoraGuidedEntranceState;
  readonly introduced: boolean;
  readonly introductionSeeded: boolean;
  readonly skipRequested: boolean;
  readonly stageEducation: NexoraStageEducationSession;
  readonly objectEducation: NexoraObjectEducationSession;
  readonly conversationEducation: NexoraConversationEducationSession;
  readonly attentionEducation: NexoraAttentionEducationSession;
  readonly dataEducation: NexoraDataEducationSession;
  readonly visualEducation: NexoraVisualEducationSession;
  readonly decisionLoopEducation: NexoraDecisionLoopEducationSession;
  readonly trustReview: NexoraTrustReviewSession;
  readonly personalDemoHandoff: NexoraPersonalDemoHandoffSession;
  readonly conversationContinuity: NexoraEntranceConversationContinuitySession;
};

export function inactiveNexoraStageEducationSession(): NexoraStageEducationSession {
  return Object.freeze({
    state: "INACTIVE" as const,
    focusDemonstrated: false,
    managerInteracted: false,
  });
}

export function inactiveNexoraObjectEducationSession(): NexoraObjectEducationSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
    currentObjectId: null,
    lastReferenceId: null,
  });
}

export function inactiveNexoraConversationEducationSession(): NexoraConversationEducationSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
  });
}

export function inactiveNexoraAttentionEducationSession(): NexoraAttentionEducationSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
  });
}

export function inactiveNexoraDataEducationSession(): NexoraDataEducationSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
    examplePath: false,
  });
}

export function inactiveNexoraVisualEducationSession(): NexoraVisualEducationSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
  });
}

export function inactiveNexoraDecisionLoopEducationSession(): NexoraDecisionLoopEducationSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
  });
}

export function inactiveNexoraTrustReviewSession(): NexoraTrustReviewSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
    reviewStep: 0 as const,
  });
}

export function inactiveNexoraPersonalDemoHandoffSession(): NexoraPersonalDemoHandoffSession {
  return Object.freeze({
    state: "NOT_STARTED" as const,
  });
}

export function inactiveNexoraGuidedEntranceSession(): NexoraGuidedEntranceSession {
  return Object.freeze({
    state: "INACTIVE" as const,
    introduced: false,
    introductionSeeded: false,
    skipRequested: false,
    stageEducation: inactiveNexoraStageEducationSession(),
    objectEducation: inactiveNexoraObjectEducationSession(),
    conversationEducation: inactiveNexoraConversationEducationSession(),
    attentionEducation: inactiveNexoraAttentionEducationSession(),
    dataEducation: inactiveNexoraDataEducationSession(),
    visualEducation: inactiveNexoraVisualEducationSession(),
    decisionLoopEducation: inactiveNexoraDecisionLoopEducationSession(),
    trustReview: inactiveNexoraTrustReviewSession(),
    personalDemoHandoff: inactiveNexoraPersonalDemoHandoffSession(),
    conversationContinuity: inactiveNexoraEntranceConversationContinuitySession(),
  });
}

export function readyNexoraGuidedEntranceSession(): NexoraGuidedEntranceSession {
  return Object.freeze({
    state: "READY" as const,
    introduced: false,
    introductionSeeded: false,
    skipRequested: false,
    stageEducation: inactiveNexoraStageEducationSession(),
    objectEducation: inactiveNexoraObjectEducationSession(),
    conversationEducation: inactiveNexoraConversationEducationSession(),
    attentionEducation: inactiveNexoraAttentionEducationSession(),
    dataEducation: inactiveNexoraDataEducationSession(),
    visualEducation: inactiveNexoraVisualEducationSession(),
    decisionLoopEducation: inactiveNexoraDecisionLoopEducationSession(),
    trustReview: inactiveNexoraTrustReviewSession(),
    personalDemoHandoff: inactiveNexoraPersonalDemoHandoffSession(),
    conversationContinuity: inactiveNexoraEntranceConversationContinuitySession(),
  });
}

export function getNexoraConversationEducationIdentity() {
  return Object.freeze({
    id: nexoraConversationEducationIdentity,
    version: nexoraConversationEducationVersion,
    namespace: nexoraConversationEducationNamespace,
  });
}

export function verifyNexoraConversationEducation(): { readonly ok: true } {
  if (
    getNexoraConversationEducationIdentity().id !==
    nexoraConversationEducationIdentity
  ) {
    throw new Error("NEX-ENT:4 identity mismatch");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.secondConversationEngine) {
    throw new Error("NEX-ENT:4 must not create a second conversation engine");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.onboardingNluEngine) {
    throw new Error("NEX-ENT:4 must not create an onboarding NLU engine");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.tutorialKeywordRouter) {
    throw new Error("NEX-ENT:4 must not create a tutorial keyword router");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.implementsGuidedAttention) {
    throw new Error("NEX-ENT:4 must not implement Guided Attention");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.implementsDataEducation) {
    throw new Error("NEX-ENT:4 must not implement Data education");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.implementsChartEducation) {
    throw new Error("NEX-ENT:4 must not implement Chart education");
  }
  if (NEXORA_CONVERSATION_EDUCATION_BOUNDARY.advisorDirectStageDom) {
    throw new Error("NEX-ENT:4 must not let Advisor mutate Stage DOM");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:4 must keep Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraAttentionEducationIdentity() {
  return Object.freeze({
    id: nexoraAttentionEducationIdentity,
    version: nexoraAttentionEducationVersion,
    namespace: nexoraAttentionEducationNamespace,
  });
}

export function verifyNexoraAttentionEducation(): { readonly ok: true } {
  if (
    getNexoraAttentionEducationIdentity().id !== nexoraAttentionEducationIdentity
  ) {
    throw new Error("NEX-ENT:5 identity mismatch");
  }
  if (NEXORA_ATTENTION_EDUCATION_BOUNDARY.ownsGuidedAttention) {
    throw new Error("NEX-ENT:5 must not own Guided Attention");
  }
  if (NEXORA_ATTENTION_EDUCATION_BOUNDARY.advisorDomManipulation) {
    throw new Error("NEX-ENT:5 must not let Advisor manipulate DOM");
  }
  if (NEXORA_ATTENTION_EDUCATION_BOUNDARY.implementsDataEducation) {
    throw new Error("NEX-ENT:5 must not implement Data education");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:5 must keep ENT-owned Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraDataEducationIdentity() {
  return Object.freeze({
    id: nexoraDataEducationIdentity,
    version: nexoraDataEducationVersion,
    namespace: nexoraDataEducationNamespace,
  });
}

export function verifyNexoraDataEducation(): { readonly ok: true } {
  if (getNexoraDataEducationIdentity().id !== nexoraDataEducationIdentity) {
    throw new Error("NEX-ENT:6 identity mismatch");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.ownsIngestion) {
    throw new Error("NEX-ENT:6 must not own ingestion");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.ownsDataReality) {
    throw new Error("NEX-ENT:6 must not own Data Reality");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.ownsGuidedAttention) {
    throw new Error("NEX-ENT:6 must not own Guided Attention");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.autoOpensData) {
    throw new Error("NEX-ENT:6 must not auto-open Data");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.autoOpensFileChooser) {
    throw new Error("NEX-ENT:6 must not auto-open the file chooser");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.fabricatesFieldMeaning) {
    throw new Error("NEX-ENT:6 must not fabricate field meaning");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.writesDecision) {
    throw new Error("NEX-ENT:6 must not write Decision");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.implementsChartEducation) {
    throw new Error("NEX-ENT:6 must not implement Chart education");
  }
  if (NEXORA_DATA_EDUCATION_BOUNDARY.semanticWriter !== "applyCsvSemanticClarification") {
    throw new Error("NEX-ENT:6 must keep applyCsvSemanticClarification as the semantic writer");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:6 must keep ENT-owned Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraVisualEducationIdentity() {
  return Object.freeze({
    id: nexoraVisualEducationIdentity,
    version: nexoraVisualEducationVersion,
    namespace: nexoraVisualEducationNamespace,
  });
}

export function verifyNexoraVisualEducation(): { readonly ok: true } {
  if (getNexoraVisualEducationIdentity().id !== nexoraVisualEducationIdentity) {
    throw new Error("NEX-ENT:7 identity mismatch");
  }
  if (NEXORA_VISUAL_EDUCATION_BOUNDARY.ownsVisualIntelligence) {
    throw new Error("NEX-ENT:7 must not own visual intelligence");
  }
  if (NEXORA_VISUAL_EDUCATION_BOUNDARY.writesObjects) {
    throw new Error("NEX-ENT:7 must not write Objects");
  }
  if (NEXORA_VISUAL_EDUCATION_BOUNDARY.writesDecision) {
    throw new Error("NEX-ENT:7 must not write Decision");
  }
  if (NEXORA_VISUAL_EDUCATION_BOUNDARY.secondChartSystem) {
    throw new Error("NEX-ENT:7 must not create a second chart system");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:7 must keep ENT-owned Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraDecisionLoopEducationIdentity() {
  return Object.freeze({
    id: nexoraDecisionLoopEducationIdentity,
    version: nexoraDecisionLoopEducationVersion,
    namespace: nexoraDecisionLoopEducationNamespace,
  });
}

export function verifyNexoraDecisionLoopEducation(): { readonly ok: true } {
  if (
    getNexoraDecisionLoopEducationIdentity().id !==
    nexoraDecisionLoopEducationIdentity
  ) {
    throw new Error("NEX-ENT:8 identity mismatch");
  }
  if (NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.writesDecision) {
    throw new Error("NEX-ENT:8 must not write Decision");
  }
  if (NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.writesExecution) {
    throw new Error("NEX-ENT:8 must not write Execution");
  }
  if (NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.secondDecisionLoop) {
    throw new Error("NEX-ENT:8 must not create a second Decision loop");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:8 must keep ENT-owned Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraTrustReviewIdentity() {
  return Object.freeze({
    id: nexoraTrustReviewIdentity,
    version: nexoraTrustReviewVersion,
    namespace: nexoraTrustReviewNamespace,
  });
}

export function verifyNexoraTrustReview(): { readonly ok: true } {
  if (getNexoraTrustReviewIdentity().id !== nexoraTrustReviewIdentity) {
    throw new Error("NEX-ENT:9 identity mismatch");
  }
  if (NEXORA_TRUST_REVIEW_BOUNDARY.trustScore) {
    throw new Error("NEX-ENT:9 must not create a trust score");
  }
  if (NEXORA_TRUST_REVIEW_BOUNDARY.quizEngine) {
    throw new Error("NEX-ENT:9 must not create a quiz engine");
  }
  if (NEXORA_TRUST_REVIEW_BOUNDARY.secondTrustSystem) {
    throw new Error("NEX-ENT:9 must not create a second trust system");
  }
  if (NEXORA_TRUST_REVIEW_BOUNDARY.writesDecision) {
    throw new Error("NEX-ENT:9 must not write Decision");
  }
  if (NEXORA_TRUST_REVIEW_BOUNDARY.writesSemantics) {
    throw new Error("NEX-ENT:9 must not write semantics");
  }
  if (NEXORA_TRUST_REVIEW_BOUNDARY.startsPersonalDemo) {
    throw new Error("NEX-ENT:9 must not start Personal Demo");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:9 must keep ENT-owned Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraPersonalDemoHandoffIdentity() {
  return Object.freeze({
    id: nexoraPersonalDemoHandoffIdentity,
    version: nexoraPersonalDemoHandoffVersion,
    namespace: nexoraPersonalDemoHandoffNamespace,
  });
}

export function verifyNexoraPersonalDemoHandoff(): { readonly ok: true } {
  if (
    getNexoraPersonalDemoHandoffIdentity().id !== nexoraPersonalDemoHandoffIdentity
  ) {
    throw new Error("NEX-ENT:10 identity mismatch");
  }
  if (NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.secondExecutive) {
    throw new Error("NEX-ENT:10 must not create a second Executive");
  }
  if (NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.parallelIdentityStore) {
    throw new Error("NEX-ENT:10 must not create a parallel identity store");
  }
  if (NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.writesGoal) {
    throw new Error("NEX-ENT:10 must not write Goal");
  }
  if (NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.genericObjectRename) {
    throw new Error("NEX-ENT:10 must not enable generic Object rename");
  }
  if (NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.startsEnt11) {
    throw new Error("NEX-ENT:10 must not start ENT:11");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:10 must keep ENT-owned Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraObjectEducationIdentity() {
  return Object.freeze({
    id: nexoraObjectEducationIdentity,
    version: nexoraObjectEducationVersion,
    namespace: nexoraObjectEducationNamespace,
  });
}

export function verifyNexoraObjectEducation(): { readonly ok: true } {
  if (getNexoraObjectEducationIdentity().id !== nexoraObjectEducationIdentity) {
    throw new Error("NEX-ENT:3 identity mismatch");
  }
  if (NEXORA_OBJECT_EDUCATION_BOUNDARY.secondObjectSystem) {
    throw new Error("NEX-ENT:3 must not create a second Object system");
  }
  if (NEXORA_OBJECT_EDUCATION_BOUNDARY.fabricatesBusinessObjects) {
    throw new Error("NEX-ENT:3 must not fabricate business Objects");
  }
  if (NEXORA_OBJECT_EDUCATION_BOUNDARY.writesDecisionCommitment) {
    throw new Error("NEX-ENT:3 must not write Decision commitment");
  }
  if (NEXORA_OBJECT_EDUCATION_BOUNDARY.implementsDataEducation) {
    throw new Error("NEX-ENT:3 must not implement Data education");
  }
  if (NEXORA_OBJECT_EDUCATION_BOUNDARY.implementsChartEducation) {
    throw new Error("NEX-ENT:3 must not implement Chart education");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:3 must keep Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraStageEducationIdentity() {
  return Object.freeze({
    id: nexoraStageEducationIdentity,
    version: nexoraStageEducationVersion,
    namespace: nexoraStageEducationNamespace,
  });
}

export function verifyNexoraStageEducation(): { readonly ok: true } {
  if (getNexoraStageEducationIdentity().id !== nexoraStageEducationIdentity) {
    throw new Error("NEX-ENT:2 identity mismatch");
  }
  if (NEXORA_STAGE_EDUCATION_BOUNDARY.secondStage) {
    throw new Error("NEX-ENT:2 must not create a second Stage");
  }
  if (NEXORA_STAGE_EDUCATION_BOUNDARY.implementsObjectEducation) {
    throw new Error("NEX-ENT:2 must not implement Object education");
  }
  if (NEXORA_STAGE_EDUCATION_BOUNDARY.implementsGuidedAttention) {
    throw new Error("NEX-ENT:2 must not implement Guided Attention");
  }
  if (NEXORA_STAGE_EDUCATION_BOUNDARY.fabricatesBusinessObjects) {
    throw new Error("NEX-ENT:2 must not fabricate business Objects");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:2 must keep Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraGuidedEntranceIdentity() {
  return Object.freeze({
    id: nexoraGuidedEntranceIdentity,
    version: nexoraGuidedEntranceVersion,
    namespace: nexoraGuidedEntranceNamespace,
  });
}

export function verifyNexoraGuidedEntrance(): { readonly ok: true } {
  if (getNexoraGuidedEntranceIdentity().id !== nexoraGuidedEntranceIdentity) {
    throw new Error("NEX-ENT:1 identity mismatch");
  }
  if (NEXORA_GUIDED_ENTRANCE_BOUNDARY.secondExecutiveRoute) {
    throw new Error("NEX-ENT:1 must not create a second /executive");
  }
  if (NEXORA_GUIDED_ENTRANCE_BOUNDARY.implementsGuidedAttention) {
    throw new Error("NEX-ENT:1 must not implement Guided Attention");
  }
  if (NEXORA_GUIDED_ENTRANCE_BOUNDARY.implementsStageEducation) {
    throw new Error("NEX-ENT:1 must not implement Stage education");
  }
  if (NEXORA_GUIDED_ENTRANCE_BOUNDARY.fabricatesBusinessObjects) {
    throw new Error("NEX-ENT:1 must not fabricate business Objects");
  }
  if (NEXORA_GUIDED_ATTENTION_RESERVED.implemented) {
    throw new Error("NEX-ENT:1 must keep Guided Attention unimplemented");
  }
  return Object.freeze({ ok: true as const });
}

export function getNexoraEntranceConversationContinuityIdentity() {
  return Object.freeze({
    id: nexoraEntranceConversationContinuityIdentity,
    version: nexoraEntranceConversationContinuityVersion,
    namespace: nexoraEntranceConversationContinuityNamespace,
  });
}

export function verifyNexoraEntranceConversationContinuity(): { readonly ok: true } {
  if (
    getNexoraEntranceConversationContinuityIdentity().id !==
    nexoraEntranceConversationContinuityIdentity
  ) {
    throw new Error("NEX-ENT-FIX1 identity mismatch");
  }
  if (NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.secondConversationEngine) {
    throw new Error("NEX-ENT-FIX1 must not create a second conversation engine");
  }
  if (NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.secondNlu) {
    throw new Error("NEX-ENT-FIX1 must not create a second NLU");
  }
  if (NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.transcriptDatabase) {
    throw new Error("NEX-ENT-FIX1 must not add a transcript database");
  }
  if (NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.businessWriter) {
    throw new Error("NEX-ENT-FIX1 must not write business state");
  }
  if (NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.startsEnt11) {
    throw new Error("NEX-ENT-FIX1 must not start ENT:11");
  }
  return Object.freeze({ ok: true as const });
}
