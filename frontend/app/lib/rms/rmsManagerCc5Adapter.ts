/**
 * NPA-T RMS:4 — speak through the real CC:5 entry. No parallel conversation engine.
 */

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "./rmsActorContracts.ts";

export type RmsCc5Turn = ReturnType<typeof executeNexoraConversationalExperience>;

export const RMS_REAL_CONVERSATION_ENTRY = executeNexoraConversationalExperience;
export const RMS_REAL_CONVERSATION_ENTRY_NAME = RMS_NEXORA_PARTICIPANT_CONTRACT.runtimeEntry;

export function speakRmsManagerThroughCc5(input: {
  readonly utterance: string;
  readonly previous?: RmsCc5Turn | null;
  readonly messageIdSeed: string;
}): RmsCc5Turn {
  if (RMS_4_BOUNDARY.parallelConversationEngine) throw new Error("RMS:4 must not own a conversation engine");
  if (RMS_4_BOUNDARY.privilegedNexoraRoute) throw new Error("RMS:4 must not use a privileged Nexora route");
  if (RMS_REAL_CONVERSATION_ENTRY !== executeNexoraConversationalExperience) {
    throw new Error("RMS:4 must use executeNexoraConversationalExperience");
  }
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const previous = input.previous ?? null;
  return executeNexoraConversationalExperience({
    utterance: input.utterance,
    conversationContext: previous?.nextConversationContext ?? Object.freeze({ currentSubjectId: null, previousSubjectIds: Object.freeze([]) }),
    executiveContext: previous?.nextExecutiveContext ?? null,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    catalog,
    previousUtterance: previous?.managerMessage.text ?? null,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    decisionRuntime: previous ? previous.decisionRuntime : undefined,
    executionRuntime: previous ? previous.executionRuntime : undefined,
    pendingTurnExpectation: previous?.nextPendingTurnExpectation ?? null,
    messageIdSeed: input.messageIdSeed,
  });
}

export function projectManagerVisibleResponse(result: RmsCc5Turn): string {
  if (RMS_4_BOUNDARY.rewriteNexoraResponses) throw new Error("RMS:4 must not rewrite Nexora responses");
  return result.response;
}
