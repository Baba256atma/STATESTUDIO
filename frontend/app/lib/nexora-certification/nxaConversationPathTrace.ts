/**
 * NXA:6-PREP — narrow conversation-path projection from existing CC/DIR/Stage results.
 * Not a second authority. Console emission is opt-in via diagnosticSwitch.
 */

import { devDiagnosticLog, isDiagnosticEnabled } from "../runtime/diagnosticSwitch.ts";
import type { NexoraConversationalExperienceResult } from "../conversational-control/conversationalExperience.ts";
import type { NexoraMVPObjectInteractionState } from "../nex-mvp/nexoraMVPObjectInteraction.ts";

export const NXA_CONVERSATION_DIAGNOSTIC_SCOPE = "nxaConversation" as const;

export const NXA_CONVERSATION_PATH_FIELDS = Object.freeze([
  "inputTurn",
  "normalizedUtterance",
  "resolvedIntent",
  "canonicalReference",
  "inheritedSubject",
  "activeCollection",
  "dialogueJourney",
  "authorityRoute",
  "readWrite",
  "advisorMode",
  "plannedPresentation",
  "dirInstruction",
  "stageMode",
  "focusId",
  "collectionMemberIds",
  "safetyState",
  "noChangeReason",
] as const);

export type NxaConversationPathTrace = Readonly<{
  inputTurn: string;
  normalizedUtterance: string;
  resolvedIntent: string | null;
  canonicalReference: string | null;
  inheritedSubject: string | null;
  activeCollection: string | null;
  dialogueJourney: string | null;
  authorityRoute: string | null;
  readWrite: "read" | "write";
  advisorMode: string | null;
  plannedPresentation: string | null;
  dirInstruction: string | null;
  stageMode: "overview" | "focus" | "collection";
  focusId: string | null;
  collectionMemberIds: readonly string[];
  safetyState: string;
  noChangeReason: string | null;
}>;

export function projectConversationPathTrace(input: {
  readonly utterance: string;
  readonly inheritedSubjectId?: string | null;
  readonly result: NexoraConversationalExperienceResult & {
    readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  };
}): NxaConversationPathTrace {
  const { result } = input;
  const state = result.nextRuntimeState;
  const collection = state.collectionContext;
  const mutation = Boolean(result.directorPlan?.mutationRequired || result.shouldCommitRuntime);
  const trace = Object.freeze({
    inputTurn: input.utterance,
    normalizedUtterance: result.intentResult.intent.normalizedUtterance,
    resolvedIntent: result.intentResult.intent.kind,
    canonicalReference:
      result.contextResult.context.primarySubject?.subjectId ??
      result.trace.nluSubject ??
      null,
    inheritedSubject: input.inheritedSubjectId ?? null,
    activeCollection: collection?.category ?? result.ncaConversationState?.lastCollection?.kind ?? null,
    dialogueJourney: [
      result.trace.nca2Move,
      result.trace.journeyPhase,
      result.trace.journeyState,
    ]
      .filter(Boolean)
      .join("/") || null,
    authorityRoute: result.trace.nluAuthority ?? result.trace.nca7Owner ?? null,
    readWrite: mutation ? "write" as const : "read" as const,
    advisorMode: result.trace.nxaNeed ?? result.trace.ncaBehavior ?? null,
    plannedPresentation: result.directorPlan?.stageEffect ?? null,
    dirInstruction: result.directorPlan?.intent ?? null,
    stageMode: collection
      ? "collection" as const
      : state.focusedSubject
        ? "focus" as const
        : "overview" as const,
    focusId: state.focusedSubject?.id ?? null,
    collectionMemberIds: Object.freeze([...(collection?.objectIds ?? [])]),
    safetyState: `decision=${result.trace.nxa3DecisionState ?? "none"};execution=${result.trace.nxa3ExecutionState ?? "none"};confirmation=${result.status}`,
    noChangeReason: result.directorPlan?.mutationRequired ? null : (result.directorPlan?.reason ?? null),
  });
  if (isDiagnosticEnabled(NXA_CONVERSATION_DIAGNOSTIC_SCOPE)) {
    devDiagnosticLog(NXA_CONVERSATION_DIAGNOSTIC_SCOPE, "nxa-conversation-path", trace);
  }
  return trace;
}

export function firstPathDivergence(
  actual: NxaConversationPathTrace,
  expected: Partial<NxaConversationPathTrace>,
): { readonly field: string; readonly expected: unknown; readonly actual: unknown } | null {
  for (const field of NXA_CONVERSATION_PATH_FIELDS) {
    if (!(field in expected) || expected[field] === undefined) continue;
    const wanted = expected[field];
    const got = actual[field];
    const equal = Array.isArray(wanted)
      ? JSON.stringify(wanted) === JSON.stringify(got)
      : wanted === got;
    if (!equal) return { field, expected: wanted, actual: got };
  }
  return null;
}
