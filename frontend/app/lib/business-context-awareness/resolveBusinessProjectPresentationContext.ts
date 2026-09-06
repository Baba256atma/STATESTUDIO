import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectSourceRef } from "./businessProjectContextContract.ts";
import type { ManagerRoleFamily } from "./managerDecisionContextContract.ts";
import {
  businessProjectPresentationIdentity,
  type BusinessProjectPresentationContext,
  type BusinessProjectPresentationDiagnostics,
  type PresentationRequestKind,
  type ResolveBusinessProjectPresentationInput,
} from "./businessProjectPresentationContract.ts";

const REJECTED = Object.freeze([
  "context-aware explanation is not new truth",
  "role relevance is not importance",
  "role relevance is not a recommendation",
  "role relevance is not stage membership",
  "role relevance is not stage focus",
  "role relevance is not object impact",
  "relationship is not causality",
  "clarification handoff is not a confirmation writer",
  "manager role is not decision authority",
  "presentation change is not decision mutation",
]);

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  }
  return value;
}

function sourceKey(ref: BusinessProjectSourceRef): string {
  return `${ref.authorityId}:${ref.sourceId}:${ref.sourceContextId ?? ""}`;
}

function uniqueRefs(refs: readonly (BusinessProjectSourceRef | null | undefined)[]): readonly BusinessProjectSourceRef[] {
  return [...new Map(refs.filter((ref): ref is BusinessProjectSourceRef => Boolean(ref)).map((ref) => [sourceKey(ref), ref])).values()];
}

function requestKind(request: string, selected: string | null | undefined): PresentationRequestKind {
  const text = request.toLowerCase();
  if (/\bwhy are you showing\b/.test(text)) return "WHY_SHOWING";
  if (/\bwhat should i look at\b/.test(text)) return "LOOK_AT";
  if (/\bwhy does this matter|why does backlog matter\b/.test(text)) return "WHY";
  if (/\bexplain (?:this |our )?(?:object |backlog)?|what is this\b/.test(text) && (selected || /\bbacklog\b/.test(text))) return "EXPLAIN_OBJECT";
  if (/\bexplain our capacity\b/.test(text)) return "CLARIFICATION";
  if (/\bobserved delivery|delivery improved\b/.test(text)) return "OUTCOME";
  if (/\bwhich operational issue|delivery manager\b/.test(text) && /\bresponsibility\b/.test(text)) return "CLARIFICATION";
  return "SITUATION";
}

function meaningOf(concept: BusinessProjectConcept | undefined): string {
  return concept?.canonicalMeaning ?? "";
}

function meaningsFor(ids: readonly string[], concepts: readonly BusinessProjectConcept[]): string[] {
  return ids.map((id) => meaningOf(concepts.find((item) => item.conceptId === id))).filter(Boolean);
}

function emphasis(family: ManagerRoleFamily, concepts: readonly BusinessProjectConcept[], relevantIds: readonly string[]): string[] {
  const named = meaningsFor(relevantIds, concepts);
  if (family === "OPERATIONS") return named.filter((item) => ["Backlog", "Capacity", "On-Time Delivery"].includes(item));
  if (family === "FINANCE") return named.filter((item) => ["Gross Margin", "Cost"].includes(item));
  if (family === "EXECUTIVE" || family === "GENERAL_MANAGEMENT") return ["Goal impact", "cross-functional trade-off", ...named.filter((item) => ["On-Time Delivery", "Backlog"].includes(item))];
  if (family === "PROJECT") return named.filter((item) => ["Schedule Variance", "Milestone", "Cost", "Resource Availability"].includes(item));
  return named;
}

function processAreas(input: ResolveBusinessProjectPresentationInput): string[] {
  const ids = new Set(input.managerDecisionContext?.relevantProcessContextIds ?? input.processPlacements?.map((item) => item.processContextId) ?? []);
  return [...new Set((input.processPlacements ?? []).filter((item) => ids.has(item.processContextId) || (input.managerDecisionContext?.relevantConceptIds ?? []).some((id) => item.conceptIds.includes(id))).flatMap((item) => item.processAreas))];
}

function relationshipQualifiers(input: ResolveBusinessProjectPresentationInput): string[] {
  return (input.relationships ?? [])
    .filter((edge) => edge.kind === "POTENTIALLY_RELATED_TO")
    .map((edge) => {
      const from = meaningOf(input.concepts.find((item) => item.conceptId === edge.fromConceptId));
      const to = meaningOf(input.concepts.find((item) => item.conceptId === edge.toConceptId));
      return `${from} is potentially related to ${to}, without an established cause`;
    });
}

function explanation(input: ResolveBusinessProjectPresentationInput, kind: PresentationRequestKind, family: ManagerRoleFamily, emphasisMeanings: readonly string[]): string {
  const selected = input.selectedConceptMeaning ?? "Backlog";
  const showing = (input.currentRequest.match(/why are you showing me ([^?]+)/i)?.[1] ?? "Capacity").trim();
  const forecast = input.temporalStatus === "FORECAST";
  if (kind === "EXPLAIN_OBJECT") {
    return `${selected} is an operations concept associated with order fulfillment and production. In your current delivery context it is relevant because it can indicate pressure in the work flow. Capacity is potentially related, but a cause has not been established.`;
  }
  if (kind === "WHY") {
    if (family === "FINANCE") return "Backlog matters because it can affect the delivery situation and may have financial consequences through cost and margin, but the current evidence does not establish those consequences yet.";
    return "Backlog matters because it sits in your fulfillment and delivery context. It is relevant to capacity, but Nexora does not yet have evidence that capacity is the cause.";
  }
  if (kind === "WHY_SHOWING") {
    return `Because this ${showing.toLowerCase()} is tied to the delivery context you are currently reviewing, and your operations role makes fulfillment and capacity particularly relevant. That does not mean it is the root cause.`;
  }
  if (kind === "LOOK_AT") {
    return "For this delivery issue, the most relevant areas to examine are backlog, current capacity, and on-time delivery. That does not yet mean any one of them is the cause.";
  }
  if (kind === "OUTCOME") {
    if (family === "FINANCE") return "The observed delivery improvement is operationally positive, but its margin effect is not established.";
    return "Delivery improved relative to baseline, but Nexora cannot yet attribute that change to a capacity action.";
  }
  if (forecast) return "That figure is a capacity forecast, not current operating capacity.";
  if (family === "FINANCE") return "The same delivery issue also has a financial dimension through cost and margin exposure. The operational evidence remains unchanged.";
  if (family === "EXECUTIVE" || family === "GENERAL_MANAGEMENT") return "This situation is relevant because of its goal impact, major risk, and cross-functional trade-offs. That does not make any one issue the most important by itself.";
  if (family === "PROJECT") return "Schedule variance belongs to schedule control and is relevant to the current milestone context, but it does not by itself establish why the project is delayed.";
  if (family === "UNKNOWN") return "This belongs to the current business and project context. A specific manager role is not required to explain the established meanings.";
  const named = emphasisMeanings.length ? emphasisMeanings.join(", ") : "delivery";
  return `${named} is directly relevant to your delivery and fulfillment context. Capacity is also worth examining, but the current evidence does not establish it as the cause.`;
}

function fingerprint(input: ResolveBusinessProjectPresentationInput): string {
  return input.concepts
    .map((concept) => {
      const dataRefs = concept.sourceRefs.filter((ref) => ref.authorityId !== "ManagerConversation").map(sourceKey).sort().join(",");
      return `${concept.canonicalMeaning ?? "unknown"}:${concept.currentReality}:${dataRefs}`;
    })
    .sort()
    .join("|");
}

function jargonFree(text: string): boolean {
  return !/BCA|NCA|DATA-ADV|sourceRef|role-family|process projection|confirmation enum/i.test(text);
}

export function resolveBusinessProjectPresentationContext(input: ResolveBusinessProjectPresentationInput): BusinessProjectPresentationContext {
  const manager = input.managerDecisionContext ?? null;
  const family = manager?.roleFamily ?? "UNKNOWN";
  const kind = requestKind(input.currentRequest, input.selectedConceptMeaning);
  const relevantIds = manager?.relevantConceptIds ?? input.concepts.map((item) => item.conceptId);
  const emphasisMeanings = [...new Set(emphasis(family, input.concepts, relevantIds))];
  const process = processAreas(input);
  const qualifiers = relationshipQualifiers(input);
  const clarification = input.clarificationNeed ?? null;
  const ask = Boolean(clarification?.clarificationNeeded);
  const composed = explanation(input, kind, family, emphasisMeanings);
  const text = ask && clarification?.clarificationQuestionIntent && kind !== "EXPLAIN_OBJECT" && kind !== "WHY" && kind !== "WHY_SHOWING" && kind !== "LOOK_AT" && kind !== "OUTCOME"
    ? clarification.clarificationQuestionIntent
    : composed;
  const refs = uniqueRefs([
    ...input.context.sourceRefs,
    ...(manager?.sourceRefs ?? []),
    ...input.concepts.flatMap((item) => item.sourceRefs),
    ...(clarification?.sourceRefs ?? []),
  ]);
  return deepFreeze({
    authority: businessProjectPresentationIdentity,
    presentationContextId: `bca7:${input.context.contextId}:${family}:${kind}`,
    contextKind: input.context.contextKind,
    managerRoleContext: manager,
    currentDecisionContext: manager?.decisionContextAreas ?? [input.context.contextKind],
    relevantConceptIds: relevantIds,
    relevantRelationshipIds: manager?.relevantRelationshipIds ?? (input.relationships ?? []).map((item) => item.relationshipId),
    relevantProcessContextIds: manager?.relevantProcessContextIds ?? (input.processPlacements ?? []).map((item) => item.processContextId),
    clarificationNeed: clarification,
    advisorContext: {
      roleFamily: family,
      emphasisMeanings,
      decisionContextAreas: manager?.decisionContextAreas ?? [],
      processAreas: process,
      relationshipQualifiers: qualifiers,
      managerFacingExplanation: jargonFree(text) ? text : "This is mainly an operations issue.",
      clarificationQuestionIntent: ask ? clarification?.clarificationQuestionIntent ?? null : null,
      ncaOwnsWording: true,
      jargonLeakageRejected: true,
    },
    stageContext: {
      objectsAdded: [],
      focusMutatedTo: null,
      collectionsMutated: false,
    },
    directorContext: {
      relevantConceptIds: relevantIds,
      currentDecisionContextConceptIds: relevantIds,
      relevantProcessContextIds: manager?.relevantProcessContextIds ?? [],
      clarificationSubjectId: ask ? clarification?.subjectId ?? null : null,
      mutatesStageMembership: false,
      mutatesStageFocus: false,
      mutatesCollections: false,
    },
    theatreContext: {
      contextuallyRelevantConceptIds: relevantIds,
      managerRoleRelevant: family !== "UNKNOWN",
      processContextRelevant: process.length > 0,
      clarificationRelated: ask,
      sizeUnchanged: true,
      colorUnchanged: true,
      causalVisualRejected: true,
      processMapCreated: false,
      scoresScenarios: false,
      commitsDecision: false,
      startsExecution: false,
    },
    underlyingEvidenceFingerprint: fingerprint(input),
    evidence: [`bca1:${input.context.contextId}`, `role:${family}`, `request:${kind}`],
    provenance: refs,
    confidence: manager?.confidence ?? input.context.confidence,
    sourceRefs: refs,
    presentationOnly: true,
    temporalStatus: input.temporalStatus ?? null,
    rejectedInferences: REJECTED,
  });
}

export function diagnoseBusinessProjectPresentationContext(presentation: BusinessProjectPresentationContext): BusinessProjectPresentationDiagnostics {
  return deepFreeze({
    presentationContextId: presentation.presentationContextId,
    emphasisTrace: presentation.advisorContext.emphasisMeanings,
    clarificationHandoff: presentation.advisorContext.clarificationQuestionIntent,
    evidenceFingerprint: presentation.underlyingEvidenceFingerprint,
    advisorOwned: false,
    stageMutated: false,
    theatreMutated: false,
    mutatesAuthorities: false,
  });
}
