import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import type { NexoraConversationState } from "../manager-object/nexoraNca2ConversationStateTypes.ts";
import { collectionOrdinalIndex } from "../manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
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

function stateSubject(
  state: NexoraConversationState | null | undefined,
  subjects: readonly EcaSubject[],
): EcaSubject | null {
  const subject = state?.activeSubject;
  const name = subject?.name;
  if (!name) return null;
  return (
    (subject.id ? subjects.find((item) => item.id === subject.id) : null) ??
    subjects.find((item) => item.label.toLowerCase() === name.toLowerCase()) ??
    (subject.id
      ? freeze({ id: subject.id, label: name, kind: subject.kind })
      : freeze({ id: name, label: name, kind: subject.kind }))
  );
}

function requestedMutation(utterance: string): EcaMutationProposal["operation"] | null {
  const text = utterance.trim().toLowerCase();
  if (/\b(?:execution\s+)?plan\b/.test(text)) return null;
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

function mutationKindNoun(value: string | null): boolean {
  return /^(?:this|that|it|risks?|problems?|goals?|scenarios?|decisions?|executions?|kpis?|objects?)$/i.test(
    (value ?? "").trim(),
  );
}

function mutationTarget(utterance: string, operation: EcaMutationProposal["operation"]): {
  readonly targetType: string | null;
  readonly proposedName: string | null;
  readonly deictic: boolean;
} {
  const text = utterance.trim();
  const add = text.match(/^(?:add|create)\s+(.+?)\s+as\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const make = text.match(/^make\s+(.+?)\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const requested = text.match(/^i\s+want\s+(.+?)\s+added\s+as\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const called = text.match(/^create\s+(?:a|an)\s+([A-Za-z]+)\s+called\s+(.+?)\.?$/i);
  const addThis = text.match(/^(?:add|create)\s+(?:this|that|it)\s+as\s+(?:a|an)\s+([A-Za-z]+)\.?$/i);
  const match = add ?? make ?? requested;
  if (operation === "ADD" && called) {
    return { proposedName: called[2]?.trim() ?? null, targetType: called[1]?.trim().toUpperCase() ?? null, deictic: false };
  }
  if (operation === "ADD" && addThis) {
    return { proposedName: null, targetType: addThis[1]?.trim().toUpperCase() ?? null, deictic: true };
  }
  if (operation === "ADD" && match) {
    const name = match[1]?.trim() ?? null;
    return {
      proposedName: mutationKindNoun(name) ? null : name,
      targetType: match[2]?.trim().toUpperCase() ?? null,
      deictic: mutationKindNoun(name),
    };
  }
  if (operation === "REMOVE") {
    const deictic = /^(?:remove|delete)\s+(?:this|that|it)\b/i.test(text);
    const named = text.match(/^(?:remove|delete)\s+(?:the\s+)?(.+?)\.?$/i)?.[1]?.trim() ?? null;
    if (deictic || mutationKindNoun(named)) {
      return { proposedName: null, targetType: null, deictic: true };
    }
    return { proposedName: named, targetType: null, deictic: false };
  }
  return { proposedName: null, targetType: null, deictic: false };
}

function managerFacingSubjectLabel(label: string): string {
  if (/^cc9:scenario:/i.test(label)) {
    const kind = label.split(":")[2] ?? "option";
    return kind === "do-nothing" ? "the current course" : kind.replace(/-/g, " ");
  }
  if (/^[A-Z][A-Z0-9_]+$/.test(label)) {
    return label === "INSUFFICIENT_REALITY"
      ? "missing confirmed evidence"
      : label.toLowerCase().replace(/_/g, " ");
  }
  return label;
}

function proposalId(input: { readonly operation: string; readonly name: string | null; readonly source: string }): string {
  return `eca-proposal-${input.operation.toLowerCase()}-${(input.name ?? "target").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${input.source}`;
}

export function isEcaMutationConfirmation(utterance: string): boolean {
  return /^(?:yes|yes,?\s*(?:add(?:\s+the\s+\w+)?|do it|go ahead)|add it|confirm|go ahead|do it)[.!?]?$/i.test(utterance.trim());
}

export function isEcaMutationCancellation(utterance: string): boolean {
  return /^(?:cancel|never mind|forget (?:it|that)(?:\s+for now)?|don't (?:add|remove|delete) it|do not (?:add|remove|delete) it|no|leave it|not now)[.!?]?$/i.test(
    utterance.trim(),
  );
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
  const ambiguous =
    input.explicitAmbiguity === true || meaning?.ambiguity.unresolved === true;
  const rawExplicit = subjectFromRecord(
    meaning?.objectReference ?? meaning?.subject ?? null,
    input.subjects,
  );
  // NCA may still carry the resolved subject on operation-only follow-ups
  // ("Show me the evidence.") without re-speaking the label. That meaning-carried
  // referent is continuity, not a newly spoken subject switch.
  const meaningCarriedSubject =
    rawExplicit && !/^(you|yourself|it|this|that)$/i.test(rawExplicit.label.trim())
      ? rawExplicit
      : null;
  const spokenExplicit =
    meaningCarriedSubject &&
    input.utterance.toLowerCase().includes(meaningCarriedSubject.label.toLowerCase())
      ? meaningCarriedSubject
      : null;
  // Only a spoken name is EXPLICIT. Meaning-carried continuity is applied later
  // after ordinal/letter/spoken winners, so leftover meaning cannot outrank them.
  const explicit = spokenExplicit;
  const confirmed = stateSubject(input.conversationState, input.subjects);
  const threadSubjectId = input.working?.conversationThread?.primarySubject ?? null;
  const threadSubject = threadSubjectId
    ? input.subjects.find((subject) => subject.id === threadSubjectId) ?? null
    : null;
  const comparisonPool = (input.conversationState?.activeComparison?.candidateIds ?? [])
    .map((id) => input.subjects.find((subject) => subject.id === id) ?? null)
    .filter((subject): subject is EcaSubject => subject != null);
  const collectionPool = (input.stage.collection?.members ?? []).filter(
    (member) => !/watch$/i.test(member.label),
  );
  const scenarioPool = input.subjects.filter((subject) => /scenario/i.test(subject.kind ?? ""));
  const problemPool = input.subjects.filter((subject) => /problem/i.test(subject.kind ?? ""));
  const letter = input.utterance.match(/\bscenario\s+([ab])\b/i)?.[1]?.toLowerCase() ?? null;
  const letterPool = collectionPool.length > 0 ? collectionPool : scenarioPool;
  const letterSubject =
    letter === "a"
      ? letterPool[0] ?? null
      : letter === "b"
        ? letterPool[1] ?? null
        : null;
  const ordinalIdx = collectionOrdinalIndex(input.utterance);
  const listedIds = input.conversationState?.lastCollection?.memberIds ?? [];
  const listedPool = listedIds.length
    ? listedIds
        .map((id) => input.subjects.find((subject) => subject.id === id) ?? null)
        .filter((subject): subject is EcaSubject => subject != null)
    : (input.conversationState?.lastCollection?.items ?? [])
        .map(
          (name) =>
            input.subjects.find((subject) => subject.label.toLowerCase() === name.toLowerCase()) ?? null,
        )
        .filter((subject): subject is EcaSubject => subject != null);
  const stageMembershipUtterance = /\bon (?:the )?stage\b/i.test(input.utterance);
  const ordinalPool =
    comparisonPool.length > 0
      ? comparisonPool
      : !stageMembershipUtterance && listedPool.length > 0
        ? listedPool
      : /\bscenario/i.test(input.utterance)
        ? /scenario/i.test(input.stage.collection?.kind ?? "") && collectionPool.length > 0
          ? collectionPool
          : scenarioPool
        : /\bproblem/i.test(input.utterance)
          ? /problem/i.test(input.stage.collection?.kind ?? "") && collectionPool.length > 0
            ? collectionPool
            : problemPool
          : collectionPool.length > 0
            ? collectionPool
            : scenarioPool;
  const ordinalSubject =
    ordinalIdx == null || ordinalPool.length === 0
      ? null
      : ordinalIdx < 0
        ? ordinalPool[ordinalPool.length - 1] ?? null
        : ordinalPool[ordinalIdx] ?? null;
  const namedVisible = input.stage.visible.filter((subject) => {
    const needle = input.utterance.toLowerCase();
    const label = subject.label.toLowerCase();
    const base = label.replace(/\s+watch$/i, "");
    if (/watch$/i.test(subject.label) && !/watch/i.test(needle)) return false;
    return needle.includes(label) || (base.length > 3 && needle.includes(base));
  });
  const uniqueVisible = namedVisible.length === 1 ? namedVisible[0]! : null;
  const pronounFollowUp =
    /^(?:explain|investigate|why|what about|tell me about)?\s*(?:it|this|that)(?:\s+(?:problem|scenario|one))?[.!?]?$/i.test(
      input.utterance.trim(),
    );
  const knowledgeFollowUp =
    /^(?:explain|what is|why|tell me about)\s+(?:it|this|that)\b/i.test(input.utterance.trim()) ||
    /^(?:it|this|that)(?:\s+problem)?[.!?]?$/i.test(input.utterance.trim());
  const stageNamed = ordinalSubject ?? letterSubject ?? (pronounFollowUp || knowledgeFollowUp ? null : uniqueVisible);
  const conversational =
    confirmed ?? threadSubject ?? input.recentSubjects?.[input.recentSubjects.length - 1] ?? null;
  const knowledgeRecent =
    knowledgeFollowUp || pronounFollowUp
      ? input.recentSubjects?.[input.recentSubjects.length - 1] ?? conversational
      : null;
  // Preserve a valid meaning-carried subject across compatible operation changes
  // when the manager did not name a different subject and continuity is unambiguous.
  const continuityFromMeaning =
    !ambiguous &&
    !spokenExplicit &&
    meaningCarriedSubject &&
    (uniqueVisible == null || uniqueVisible.id === meaningCarriedSubject.id)
      ? meaningCarriedSubject
      : null;
  const active =
    ordinalSubject ??
    explicit ??
    letterSubject ??
    knowledgeRecent ??
    (knowledgeFollowUp || pronounFollowUp ? conversational : stageNamed) ??
    conversational ??
    continuityFromMeaning ??
    (knowledgeFollowUp ? null : uniqueVisible) ??
    null;
  const explicitCandidates = (meaning?.ambiguity.candidates ?? [])
    .map((candidate) => subjectFromRecord(candidate, input.subjects))
    .filter((candidate): candidate is EcaSubject => candidate != null);
  const candidates = explicitCandidates.length > 0
    ? explicitCandidates
    : input.stage.visible.filter((subject) => subject.id !== active?.id);
  const references: EcaReference[] = [];
  if (explicit) references.push(freeze({ subject: explicit, role: "EXPLICIT", confidence: "HIGH", source: "NCA canonical meaning" }));
  else if (stageNamed) references.push(freeze({ subject: stageNamed, role: ordinalSubject ? "EXPLICIT" : "STAGE_CANDIDATE", confidence: "HIGH", source: "NXA:5-FIX4 Stage presentation read model" }));
  else if (confirmed) references.push(freeze({ subject: confirmed, role: "CONFIRMED", confidence: "HIGH", source: "NCA conversation state" }));
  else if (threadSubject) references.push(freeze({ subject: threadSubject, role: "ACTIVE_SUBJECT", confidence: "MEDIUM", source: "NEX-CONV thread" }));
  else if (input.recentSubjects?.[0]) references.push(freeze({ subject: input.recentSubjects[0], role: "RECENT_SUBJECT", confidence: "LOW", source: "ECA input recent subjects" }));
  if (input.stage.focus && input.stage.focus.id !== active?.id) {
    references.push(freeze({ subject: input.stage.focus, role: "STAGE_CANDIDATE", confidence: "LOW", source: "NXA:5-FIX4 Stage read model" }));
  }
  for (const visible of input.stage.visible) {
    if (visible.id === active?.id || references.some((reference) => reference.subject.id === visible.id)) continue;
    references.push(freeze({ subject: visible, role: "STAGE_CANDIDATE", confidence: "LOW", source: "NXA:5-FIX4 Stage presentation read model" }));
  }
  for (const recent of input.recentSubjects ?? []) {
    if (recent.id !== active?.id && !references.some((reference) => reference.subject.id === recent.id)) {
      references.push(freeze({ subject: recent, role: "RECENT_SUBJECT", confidence: "LOW", source: "NCA recent subject history" }));
    }
  }
  if (
    active &&
    !references.some((reference) => reference.subject.id === active.id)
  ) {
    references.push(
      freeze({
        subject: active,
        role: confirmed?.id === active.id ? "CONFIRMED" : "ACTIVE_SUBJECT",
        confidence: confirmed?.id === active.id ? "HIGH" : "MEDIUM",
        source: "ECA resolved active subject",
      }),
    );
  }
  if (ambiguous) {
    for (const candidate of candidates) {
      references.push(freeze({ subject: candidate, role: "AMBIGUOUS_CANDIDATE", confidence: "LOW", source: "NCA ambiguity" }));
    }
  }
  const mutation = requestedMutation(input.utterance);
  const target = mutation ? mutationTarget(input.utterance, mutation) : null;
  const mutationName =
    target?.proposedName ??
    (mutation === "REMOVE" && (explicit ?? conversational)
      ? (explicit ?? conversational)?.label ?? null
      : target?.deictic === true
        ? explicit && !mutationKindNoun(explicit.label)
          ? explicit.label
          : null
        : explicit?.label ?? null);
  const mutationType = target?.targetType ?? null;
  const mutationWriter =
    mutation === "ADD" && mutationType === "RISK" ? "canonicalRiskWriter" : null;
  const mutationReady =
    mutation === "ADD" ? Boolean(mutationName) : Boolean(mutationName || mutationType);
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
      options: ambiguous
        ? freeze(candidates.slice(0, 3).map((candidate) => managerFacingSubjectLabel(candidate.label)))
        : freeze([]),
    }),
    mutationProposal: mutation
      ? freeze({
          proposalId: proposalId({ operation: mutation, name: mutationName, source: meaning?.rawUtterance ?? input.utterance }),
          operation: mutation,
          targetType: mutationType,
          proposedName: mutationName,
          subject: explicit ?? conversational ?? active,
          relationship: null,
          statement: input.utterance.trim(),
          sourceTurnId: meaning?.rawUtterance ?? input.utterance,
          status: mutationReady ? "PROPOSED" : "NEEDS_CLARIFICATION",
          provenance: freeze(["NCA canonical manager meaning", "ECA:1 typed mutation recognition"]),
          requiresExplicitConfirmation: true,
          canonicalWriter: mutationWriter,
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
