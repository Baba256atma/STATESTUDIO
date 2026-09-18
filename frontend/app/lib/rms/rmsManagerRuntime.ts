/**
 * NPA-T RMS:4 — Manager Agent runtime over visible knowledge only.
 */

import type {
  Rms4ConversationClassification,
  RmsManagerIntent,
  RmsManagerKnowledge,
  RmsManagerObjective,
  RmsManagerProfile,
  RmsManagerVisibleFact,
} from "./rmsManagerContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { generateRmsManagerTurn, nexoraAskedClarification, selectRmsManagerIntent } from "./rmsManagerTurnGeneration.ts";
import type { RmsCc5Turn } from "./rmsManagerCc5Adapter.ts";
import { projectManagerVisibleResponse } from "./rmsManagerCc5Adapter.ts";

export type RmsManagerMemory = {
  readonly nexoraTold: readonly string[];
  readonly currentSubject: string | null;
  readonly discussedLabels: readonly string[];
  readonly unresolvedQuestions: readonly string[];
  readonly visibleFacts: readonly RmsManagerVisibleFact[];
  readonly priorActions: readonly string[];
  readonly turnCount: number;
};

export type RmsManagerConversationBind = {
  profile: RmsManagerProfile;
  objective: RmsManagerObjective;
  knowledge: RmsManagerKnowledge;
  memory: RmsManagerMemory;
  lastIntent: RmsManagerIntent | null;
  lastUtterance: string | null;
  lastNexoraResponse: string | null;
  previousCc5: RmsCc5Turn | null;
  turns: readonly RmsManagerRecordedTurn[];
  classifications: readonly Rms4ConversationClassification[];
  autoConfirm: false;
  autoApproveDecision: false;
  autoStartExecution: false;
};

export type RmsManagerRecordedTurn = {
  readonly turnIndex: number;
  readonly intent: RmsManagerIntent;
  readonly utterance: string;
  readonly nexoraResponse: string;
  readonly nexoraIntentKind: string;
  readonly focusedSubjectId: string | null;
  readonly focusedSubjectLabel: string | null;
  readonly confirmationRequired: boolean;
  readonly rewritten: false;
};

export function emptyRmsManagerKnowledge(background: readonly string[] = [], knownMeanings: Readonly<Record<string, string>> = {}): RmsManagerKnowledge {
  return Object.freeze({
    plane: "MANAGER_PERCEPTION",
    background: Object.freeze([...background]),
    visibleFacts: Object.freeze([]),
    knownMeanings: Object.freeze({ ...knownMeanings }),
    currentSubject: null,
    discussedLabels: Object.freeze([]),
    unresolvedQuestions: Object.freeze([]),
    sealedGroundTruth: false,
    observerKnowledge: false,
  });
}

export function emptyRmsManagerMemory(): RmsManagerMemory {
  return Object.freeze({
    nexoraTold: Object.freeze([]),
    currentSubject: null,
    discussedLabels: Object.freeze([]),
    unresolvedQuestions: Object.freeze([]),
    visibleFacts: Object.freeze([]),
    priorActions: Object.freeze([]),
    turnCount: 0,
  });
}

export function createRmsManagerConversationBind(input: {
  readonly profile: RmsManagerProfile;
  readonly objective: RmsManagerObjective;
  readonly knowledge?: RmsManagerKnowledge;
}): RmsManagerConversationBind {
  if (input.profile.groundTruthAccess) throw new Error("RMS:4 profile must not grant Ground Truth");
  return {
    profile: input.profile,
    objective: input.objective,
    knowledge: input.knowledge ?? emptyRmsManagerKnowledge(),
    memory: emptyRmsManagerMemory(),
    lastIntent: null,
    lastUtterance: null,
    lastNexoraResponse: null,
    previousCc5: null,
    turns: Object.freeze([]),
    classifications: Object.freeze([]),
    autoConfirm: false,
    autoApproveDecision: false,
    autoStartExecution: false,
  };
}

export function chooseRmsManagerUtterance(bind: RmsManagerConversationBind, extras?: {
  readonly imperfect?: "incomplete" | "typo" | "deicticExplain" | "deicticMore" | "deicticInvestigate" | "wrongName" | "topicShift";
  readonly forcedUtterance?: string;
}): { readonly intent: RmsManagerIntent; readonly utterance: string; readonly replacesNexoraIntent: false } {
  if (RMS_4_BOUNDARY.managerReadsGroundTruth) throw new Error("RMS:4 Manager cannot read Ground Truth");
  if (extras?.forcedUtterance) {
    const intent = selectRmsManagerIntent({
      agenda: bind.objective.agenda,
      turnCount: bind.memory.turnCount,
      clarificationAsked: false,
    });
    return Object.freeze({ intent, utterance: extras.forcedUtterance, replacesNexoraIntent: false });
  }
  const intent = selectRmsManagerIntent({
    agenda: bind.objective.agenda,
    turnCount: bind.memory.turnCount,
    clarificationAsked: bind.lastNexoraResponse ? nexoraAskedClarification(bind.lastNexoraResponse) : false,
  });
  return generateRmsManagerTurn({
    intent,
    profile: bind.profile,
    knowledge: bind.knowledge,
    imperfect: extras?.imperfect,
    projectInvestigate: bind.objective.hostKind === "PROJECT",
  });
}

export function rememberRmsManagerTurn(bind: RmsManagerConversationBind, input: {
  readonly intent: RmsManagerIntent;
  readonly utterance: string;
  readonly result: RmsCc5Turn;
}): void {
  const response = projectManagerVisibleResponse(input.result);
  const fact: RmsManagerVisibleFact = Object.freeze({
    factId: `told:${bind.memory.turnCount}`,
    text: response,
    source: "nexora-response" as const,
  });
  const label = input.result.nextRuntimeState.focusedSubject?.label ?? bind.knowledge.currentSubject;
  bind.lastIntent = input.intent;
  bind.lastUtterance = input.utterance;
  bind.lastNexoraResponse = response;
  bind.previousCc5 = input.result;
  bind.knowledge = Object.freeze({
    ...bind.knowledge,
    visibleFacts: Object.freeze([...bind.knowledge.visibleFacts, fact]),
    currentSubject: label,
    discussedLabels: Object.freeze(label && !bind.knowledge.discussedLabels.includes(label)
      ? [...bind.knowledge.discussedLabels, label]
      : [...bind.knowledge.discussedLabels]),
  });
  bind.memory = Object.freeze({
    nexoraTold: Object.freeze([...bind.memory.nexoraTold, response]),
    currentSubject: label,
    discussedLabels: bind.knowledge.discussedLabels,
    unresolvedQuestions: Object.freeze(
      nexoraAskedClarification(response) ? [...bind.memory.unresolvedQuestions, response] : [...bind.memory.unresolvedQuestions],
    ),
    visibleFacts: bind.knowledge.visibleFacts,
    priorActions: Object.freeze([...bind.memory.priorActions, input.utterance]),
    turnCount: bind.memory.turnCount + 1,
  });
  bind.turns = Object.freeze([
    ...bind.turns,
    Object.freeze({
      turnIndex: bind.memory.turnCount,
      intent: input.intent,
      utterance: input.utterance,
      nexoraResponse: response,
      nexoraIntentKind: input.result.intentResult.intent.kind,
      focusedSubjectId: input.result.nextRuntimeState.focusedSubject?.id ?? input.result.trace.executiveCurrentSubjectId ?? null,
      focusedSubjectLabel: input.result.nextRuntimeState.focusedSubject?.label ?? null,
      confirmationRequired: input.result.status === "confirmation-required" || input.result.decisionCommitmentResult?.status === "confirmation-required",
      rewritten: false as const,
    }),
  ]);
}

export function verifyRmsManagerConversation(): { readonly ok: true } {
  if (RMS_4_BOUNDARY.parallelConversationEngine) throw new Error("RMS:4 must not create a conversation engine");
  if (RMS_4_BOUNDARY.managerReadsGroundTruth) throw new Error("RMS:4 Manager must not read Ground Truth");
  if (RMS_4_BOUNDARY.managerReadsObserver) throw new Error("RMS:4 Manager must not read Observer");
  if (RMS_4_BOUNDARY.autoConfirm || RMS_4_BOUNDARY.autoApproveDecision || RMS_4_BOUNDARY.autoStartExecution) {
    throw new Error("RMS:4 must not bypass confirmation/Decision/Execution");
  }
  if (RMS_4_BOUNDARY.startsRms5) throw new Error("RMS:4 must not start RMS:5");
  if (RMS_4_BOUNDARY.conversationEntry !== "executeNexoraConversationalExperience") {
    throw new Error("RMS:4 must use the CC:5 entry");
  }
  return Object.freeze({ ok: true as const });
}
