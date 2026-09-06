import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import type { NexoraConversationState } from "../manager-object/nexoraNca2ConversationStateTypes.ts";
import type { NexoraConversationWorkingContext } from "./nexoraConversationWorkingContext.ts";

export const ECA_WORKING_CONTEXT_IDENTITY = "NPA-T ECA:1/WorkingConversationContext" as const;

export type EcaConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export type EcaReferenceRole =
  | "EXPLICIT"
  | "CONFIRMED"
  | "ACTIVE_SUBJECT"
  | "RECENT_SUBJECT"
  | "STAGE_CANDIDATE"
  | "AMBIGUOUS_CANDIDATE";

export type EcaSubject = Readonly<{
  id: string;
  label: string;
  kind: string | null;
}>;

export type EcaReference = Readonly<{
  subject: EcaSubject;
  role: EcaReferenceRole;
  confidence: EcaConfidence;
  source: string;
}>;

export type EcaStageContext = Readonly<{
  available: boolean;
  workspace: string | null;
  focus: EcaSubject | null;
  selected: EcaSubject | null;
  visible: readonly EcaSubject[];
  collection: Readonly<{
    kind: string;
    label: string;
    members: readonly EcaSubject[];
  }> | null;
  theatreSceneId: string | null;
}>;

export type EcaDataContext = Readonly<{
  sourceId: string;
  sourceLabel: string | null;
  fieldId: string;
  fieldLabel: string | null;
  semanticStatus: "CONFIRMED" | "PROPOSED" | "UNKNOWN";
  evidenceRefs: readonly string[];
}>;

export type EcaMutationProposal = Readonly<{
  proposalId: string;
  operation: "ADD" | "UPDATE" | "REMOVE" | "RELATE" | "CHANGE_CONTEXT";
  targetType: string | null;
  proposedName: string | null;
  subject: EcaSubject | null;
  relationship: Readonly<{ target: EcaSubject | null }> | null;
  statement: string;
  sourceTurnId: string;
  status: "PROPOSED" | "NEEDS_CLARIFICATION" | "CANCELLED" | "HANDED_OFF" | "FAILED";
  provenance: readonly string[];
  requiresExplicitConfirmation: true;
  canonicalWriter: string | null;
  executed: false;
}>;

export type EcaWorkingConversationContext = Readonly<{
  identity: typeof ECA_WORKING_CONTEXT_IDENTITY;
  managerContext: Readonly<{
    turnIndex: number | null;
    meaning: CanonicalManagerMeaning | null;
    role: string | null;
  }>;
  businessContext: Readonly<{
    workspaceId: string | null;
    projectId: string | null;
    goalId: string | null;
  }>;
  stageContext: EcaStageContext;
  conversationContext: Readonly<{
    activeSubject: EcaSubject | null;
    activeThreadId: string | null;
    activeCollection: string | null;
    sessionScoped: true;
  }>;
  activeSubject: EcaSubject | null;
  activeObject: EcaSubject | null;
  activeCollection: EcaStageContext["collection"];
  activeDataSource: EcaDataContext | null;
  readonly decisionContext: Readonly<{
    readonly comparisonSubjects: readonly EcaSubject[];
    readonly criterion: string | null;
  }>;
  managerIntent: Readonly<{
    communicativeIntent: CanonicalManagerMeaning["communicativeIntent"] | null;
    operation: CanonicalManagerMeaning["requestedOperation"] | null;
    questionType: CanonicalManagerMeaning["questionType"] | null;
  }>;
  interactionMode: "READ" | "PROPOSE_MUTATION" | "CLARIFY";
  references: readonly EcaReference[];
  unresolved: readonly string[];
  pendingQuestions: readonly string[];
  confidence: EcaConfidence;
  provenance: readonly string[];
  continuation: Readonly<{
    kind: "ANSWER" | "CLARIFY" | "PROPOSE" | "OFFER";
    safeNext: string;
    options: readonly string[];
  }>;
  mutationProposal: EcaMutationProposal | null;
  repeatedSignals: readonly string[];
  readonly diagnostics: Readonly<{
    readonly who: string | null;
    readonly what: string | null;
    readonly where: string | null;
    readonly how: string | null;
    readonly why: string | null;
    readonly now: string | null;
    readonly next: string;
  }>;
}>;

export type EcaWorkingContextInput = Readonly<{
  utterance: string;
  meaning: CanonicalManagerMeaning | null;
  conversationState?: NexoraConversationState | null;
  working?: NexoraConversationWorkingContext | null;
  stage: EcaStageContext;
  subjects: readonly EcaSubject[];
  managerRole?: string | null;
  workspaceId?: string | null;
  projectId?: string | null;
  goalId?: string | null;
  dataContext?: EcaDataContext | null;
  recentSubjects?: readonly EcaSubject[];
  explicitAmbiguity?: boolean;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function subjectFromRecord(
  reference: { readonly subjectId: string | null; readonly canonicalName: string | null } | null,
  subjects: readonly EcaSubject[],
): EcaSubject | null {
  if (!reference) return null;
  if (reference.subjectId) {
    return subjects.find((subject) => subject.id === reference.subjectId) ?? {
      id: reference.subjectId,
      label: reference.canonicalName ?? reference.subjectId,
      kind: null,
    };
  }
  const name = reference.canonicalName?.trim().toLowerCase();
  return name
    ? subjects.find((subject) => subject.label.toLowerCase() === name) ?? null
    : null;
}

function stateSubject(state: NexoraConversationState | null | undefined): EcaSubject | null {
  const subject = state?.activeSubject;
  return subject?.id && subject.name
    ? freeze({ id: subject.id, label: subject.name, kind: subject.kind })
    : null;
}

function requestedMutation(utterance: string): EcaMutationProposal["operation"] | null {
  const text = utterance.trim().toLowerCase();
  if (
    /^(?:add|create)\s+.+\s+as\s+(?:a|an)\s+[a-z]+\.?$/i.test(text) ||
    /^create\s+(?:a|an)\s+[a-z]+\s+called\s+.+\.?$/i.test(text) ||
    /^make\s+.+\s+(?:a|an)\s+[a-z]+\.?$/i.test(text) ||
    /^i\s+want\s+.+\s+added\s+as\s+(?:a|an)\s+[a-z]+\.?$/i.test(text)
  ) return "ADD";
  if (/^(?:update|change|edit)\b/.test(text)) return "UPDATE";
  if (/^(?:remove|delete)\b/.test(text)) return "REMOVE";
  if (/^(?:connect|link)\b/.test(text)) return "RELATE";
  return /\b(?:change|set)\s+(?:the )?(?:business|project|goal)\b/.test(text)
    ? "CHANGE_CONTEXT"
    : null;
}

function mutationTarget(utterance: string, operation: EcaMutationProposal["operation"]): {
  readonly targetType: string | null;
  readonly proposedName: string | null;
} {
  const text = utterance.trim();
  const add = text.match(/^(?:add|create)\s+(.+?)\s+as\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const make = text.match(/^make\s+(.+?)\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const requested = text.match(/^i\s+want\s+(.+?)\s+added\s+as\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const called = text.match(/^create\s+(?:a|an)\s+([A-Za-z]+)\s+called\s+(.+?)\.?$/i);
  const match = add ?? make ?? requested;
  if (operation === "ADD" && called) {
    return { proposedName: called[2]?.trim() ?? null, targetType: called[1]?.trim().toUpperCase() ?? null };
  }
  if (operation === "ADD" && match) {
    return { proposedName: match[1]?.trim() ?? null, targetType: match[2]?.trim().toUpperCase() ?? null };
  }
  const remove = text.match(/^(?:remove|delete)\s+(?:this\s+|the\s+)?([A-Za-z]+)?/i);
  return { proposedName: operation === "REMOVE" ? remove?.[1] ?? null : null, targetType: null };
}

function proposalId(input: { readonly operation: string; readonly name: string | null; readonly source: string }): string {
  return `eca-proposal-${input.operation.toLowerCase()}-${(input.name ?? "target").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${input.source}`;
}

export function isEcaMutationConfirmation(utterance: string): boolean {
  return /^(?:yes|yes,?\s*(?:add(?:\s+the\s+\w+)?|do it|go ahead)|add it|confirm|go ahead|do it)[.!?]?$/i.test(utterance.trim());
}

export function isEcaMutationCancellation(utterance: string): boolean {
  return /^(?:cancel|never mind|don't add it|do not add it|no|leave it)[.!?]?$/i.test(utterance.trim());
}

function confidenceFor(input: {
  readonly explicit: EcaSubject | null;
  readonly active: EcaSubject | null;
  readonly ambiguous: boolean;
}): EcaConfidence {
  if (input.ambiguous) return "LOW";
  if (input.explicit) return "HIGH";
  if (input.active) return "MEDIUM";
  return "UNKNOWN";
}

export function emptyEcaStageContext(): EcaStageContext {
  return freeze({
    available: false,
    workspace: null,
    focus: null,
    selected: null,
    visible: freeze([]),
    collection: null,
    theatreSceneId: null,
  });
}

export function composeEcaWorkingConversationContext(
  input: EcaWorkingContextInput,
): EcaWorkingConversationContext {
  const meaning = input.meaning;
  const explicit = subjectFromRecord(
    meaning?.objectReference ?? meaning?.subject ?? null,
    input.subjects,
  );
  const confirmed = stateSubject(input.conversationState);
  const threadSubjectId = input.working?.conversationThread?.primarySubject ?? null;
  const threadSubject = threadSubjectId
    ? input.subjects.find((subject) => subject.id === threadSubjectId) ?? null
    : null;
  const active = explicit ?? confirmed ?? threadSubject ?? input.recentSubjects?.[0] ?? null;
  const ambiguous = input.explicitAmbiguity === true || meaning?.ambiguity.unresolved === true;
  const explicitCandidates = (meaning?.ambiguity.candidates ?? [])
    .map((candidate) => subjectFromRecord(candidate, input.subjects))
    .filter((candidate): candidate is EcaSubject => candidate != null);
  const candidates = explicitCandidates.length > 0
    ? explicitCandidates
    : input.stage.visible.filter((subject) => subject.id !== active?.id);
  const references: EcaReference[] = [];
  if (explicit) references.push(freeze({ subject: explicit, role: "EXPLICIT", confidence: "HIGH", source: "NCA canonical meaning" }));
  else if (confirmed) references.push(freeze({ subject: confirmed, role: "CONFIRMED", confidence: "HIGH", source: "NCA conversation state" }));
  else if (threadSubject) references.push(freeze({ subject: threadSubject, role: "ACTIVE_SUBJECT", confidence: "MEDIUM", source: "NEX-CONV thread" }));
  else if (input.recentSubjects?.[0]) references.push(freeze({ subject: input.recentSubjects[0], role: "RECENT_SUBJECT", confidence: "LOW", source: "ECA input recent subjects" }));
  if (input.stage.focus && input.stage.focus.id !== active?.id) {
    references.push(freeze({ subject: input.stage.focus, role: "STAGE_CANDIDATE", confidence: "LOW", source: "NXA:5-FIX4 Stage read model" }));
  }
  for (const recent of input.recentSubjects ?? []) {
    if (recent.id !== active?.id && !references.some((reference) => reference.subject.id === recent.id)) {
      references.push(freeze({ subject: recent, role: "RECENT_SUBJECT", confidence: "LOW", source: "NCA recent subject history" }));
    }
  }
  if (ambiguous) {
    for (const candidate of candidates) {
      references.push(freeze({ subject: candidate, role: "AMBIGUOUS_CANDIDATE", confidence: "LOW", source: "NCA ambiguity" }));
    }
  }
  const mutation = requestedMutation(input.utterance);
  const target = mutation ? mutationTarget(input.utterance, mutation) : null;
  const unresolved = [
    ...(ambiguous ? ["Manager referent is ambiguous."] : []),
    ...(active ? [] : ["Conversational subject is unknown."]),
  ];
  const collectionQuestion = meaning?.questionType === "STATUS" && input.stage.collection != null;
  const subjectForObject = collectionQuestion ? null : active;
  const pendingQuestions = input.conversationState?.pendingQuestion?.question
    ? [input.conversationState.pendingQuestion.question]
    : input.working?.pendingClarification
      ? ["A previous conversation clarification is pending."]
      : [];
  const kind = ambiguous ? "CLARIFY" : mutation ? "PROPOSE" : "ANSWER";
  return freeze({
    identity: ECA_WORKING_CONTEXT_IDENTITY,
    managerContext: freeze({ turnIndex: input.conversationState?.turnIndex ?? null, meaning, role: input.managerRole ?? null }),
    businessContext: freeze({ workspaceId: input.workspaceId ?? null, projectId: input.projectId ?? null, goalId: input.goalId ?? null }),
    stageContext: input.stage,
    conversationContext: freeze({
      activeSubject: confirmed ?? threadSubject,
      activeThreadId: input.conversationState?.currentThreadId ?? input.working?.conversationThread?.threadId ?? null,
      activeCollection: input.stage.collection?.kind ?? null,
      sessionScoped: true,
    }),
    activeSubject: subjectForObject,
    activeObject: subjectForObject,
    activeCollection: input.stage.collection,
    activeDataSource: input.dataContext ?? null,
    decisionContext: freeze({
      comparisonSubjects: freeze(
        (input.conversationState?.activeComparison?.candidateIds ?? [])
          .map((id) => input.subjects.find((subject) => subject.id === id) ?? null)
          .filter((subject): subject is EcaSubject => subject != null),
      ),
      criterion: input.conversationState?.activeComparison?.criterion ?? null,
    }),
    managerIntent: freeze({
      communicativeIntent: meaning?.communicativeIntent ?? null,
      operation: meaning?.requestedOperation ?? null,
      questionType: meaning?.questionType ?? null,
    }),
    interactionMode: ambiguous ? "CLARIFY" : mutation ? "PROPOSE_MUTATION" : "READ",
    references: freeze(references),
    unresolved: freeze(unresolved),
    pendingQuestions: freeze(pendingQuestions),
    confidence: confidenceFor({ explicit, active, ambiguous }),
    provenance: freeze([
      ...(meaning ? ["NCA canonical manager meaning"] : []),
      ...(input.conversationState ? ["NCA:2 conversation state"] : []),
      ...(input.working ? ["NEX-CONV:1/2 working context"] : []),
      ...(input.stage.available ? ["NXA:5-FIX4 Stage read model"] : []),
      ...(input.dataContext ? ["DATA-ADV/Data Reality supplied data context"] : []),
    ]),
    continuation: freeze({
      kind,
      safeNext: ambiguous
        ? "Ask which subject the manager means before answering."
        : mutation
          ? "Present the proposed change and wait for explicit manager confirmation."
          : "Answer the manager's request without changing Stage or business state.",
      options: ambiguous ? freeze(candidates.slice(0, 3).map((candidate) => candidate.label)) : freeze([]),
    }),
    mutationProposal: mutation
      ? freeze({
          proposalId: proposalId({ operation: mutation, name: target?.proposedName ?? explicit?.label ?? null, source: meaning?.rawUtterance ?? input.utterance }),
          operation: mutation,
          targetType: target?.targetType ?? null,
          proposedName: target?.proposedName ?? explicit?.label ?? null,
          subject: explicit ?? active,
          relationship: null,
          statement: input.utterance.trim(),
          sourceTurnId: meaning?.rawUtterance ?? input.utterance,
          status: target?.targetType || explicit || active ? "PROPOSED" : "NEEDS_CLARIFICATION",
          provenance: freeze(["NCA canonical manager meaning", "ECA:1 explicit mutation recognition"]),
          requiresExplicitConfirmation: true,
          canonicalWriter: null,
          executed: false,
        })
      : null,
    repeatedSignals: freeze([]),
    diagnostics: freeze({
      who: input.managerRole ?? "manager",
      what: subjectForObject?.label ?? input.stage.collection?.label ?? null,
      where: input.stage.workspace ?? input.workspaceId ?? input.projectId ?? null,
      how: meaning?.requestedOperation ?? meaning?.communicativeIntent ?? null,
      why: input.goalId ?? null,
      now: input.conversationState
        ? `${input.conversationState.dialogueMove} / ${input.stage.collection ? "COLLECTION" : input.stage.focus ? "FOCUS" : "OVERVIEW"}`
        : input.stage.available
          ? input.stage.collection
            ? "COLLECTION"
            : input.stage.focus
              ? "FOCUS"
              : "OVERVIEW"
          : null,
      next: ambiguous
        ? "Clarify the referent before answering."
        : mutation
          ? "Wait for explicit confirmation before using the canonical writer."
          : "Answer or investigate without changing authoritative state.",
    }),
  });
}