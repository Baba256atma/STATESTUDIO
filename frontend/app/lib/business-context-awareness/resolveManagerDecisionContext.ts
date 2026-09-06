import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectSourceRef, ContextConfirmationState } from "./businessProjectContextContract.ts";
import {
  managerDecisionContextIdentity,
  type ManagerDecisionContext,
  type ManagerDecisionContextDiagnostics,
  type ManagerRoleFamily,
  type ManagerRoleRecord,
  type ResolveManagerDecisionContextInput,
} from "./managerDecisionContextContract.ts";
import { findRoleFamilyByExactTitle, findRoleRelevance } from "./managerRoleRelevanceRegistry.ts";

const REJECTED = Object.freeze([
  "role does not establish permission",
  "role does not establish decision authority",
  "role relevance is not importance",
  "role relevance is not a recommendation",
  "interest does not establish role",
  "session interest does not mutate durable role",
  "decision context is not a Nexora Decision",
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

function established(concept: BusinessProjectConcept): boolean {
  return Boolean(concept.canonicalMeaning) && (concept.state === "KNOWN" || concept.state === "MULTI_CONTEXT" || concept.state === "PARTIALLY_UNDERSTOOD");
}

function concernAreas(concern: string | null | undefined): readonly string[] {
  if (!concern) return [];
  const text = concern.toLowerCase();
  const areas: string[] = [];
  if (/\bschedule|milestone|delay\b/.test(text)) areas.push("PROJECT", "SCHEDULE");
  if (/\brisk\b/.test(text)) areas.push("RISK");
  if (/\bcapacit|backlog|otd|delivery|fulfill/.test(text)) areas.push("DELIVERY", "CAPACITY");
  return [...new Set(areas)];
}

function resolveRoles(input: ResolveManagerDecisionContextInput): readonly ManagerRoleRecord[] {
  const confirmed = (input.managerConfirmedRoles ?? []).map((entry) => Object.freeze({
    rawTitle: entry.rawTitle,
    canonicalRoleFamily: entry.family,
    state: "MANAGER_CONFIRMED" as const,
    confirmationState: "MANAGER_CONFIRMED" as const,
    sourceRef: entry.sourceRef,
  }));
  if (confirmed.length) return confirmed;
  const attached = input.context.managerContext;
  const titles = [
    ...(input.rawTitles ?? []),
    ...(attached?.roleLabel ? [attached.roleLabel] : []),
  ];
  if (titles.length === 0) {
    return Object.freeze([Object.freeze({
      rawTitle: null,
      canonicalRoleFamily: "UNKNOWN",
      state: "UNKNOWN",
      confirmationState: "UNCONFIRMED" as ContextConfirmationState,
      sourceRef: null,
    })]);
  }
  return titles.map((title) => {
    const mapped = findRoleFamilyByExactTitle(title);
    if (mapped === "AMBIGUOUS") {
      return Object.freeze({
        rawTitle: title,
        canonicalRoleFamily: "UNKNOWN",
        state: "AMBIGUOUS" as const,
        confirmationState: attached?.confirmationState ?? "UNCONFIRMED",
        sourceRef: attached?.sourceRef ?? null,
      });
    }
    if (!mapped) {
      return Object.freeze({
        rawTitle: title,
        canonicalRoleFamily: "UNKNOWN",
        state: "UNKNOWN" as const,
        confirmationState: attached?.confirmationState ?? "UNCONFIRMED",
        sourceRef: attached?.sourceRef ?? null,
      });
    }
    return Object.freeze({
      rawTitle: title,
      canonicalRoleFamily: mapped,
      state: attached?.confirmationState === "MANAGER_CONFIRMED" ? "MANAGER_CONFIRMED" as const : "KNOWN" as const,
      confirmationState: attached?.confirmationState ?? "UNCONFIRMED",
      sourceRef: attached?.sourceRef ?? null,
    });
  });
}

function meaningRelevant(meaning: string, families: readonly ManagerRoleFamily[], goalWantsDelivery: boolean): boolean {
  const operations = ["Backlog", "Capacity", "On-Time Delivery", "Throughput", "Quality", "Delivery", "Supplier Lead Time"];
  const finance = ["Cost", "Gross Margin", "Revenue", "Budget"];
  const project = ["Schedule Variance", "Milestone", "Cost", "Resource Availability", "Project Schedule"];
  const executive = ["Backlog", "Capacity", "On-Time Delivery", "Cost", "Gross Margin", "Schedule Variance"];
  if (families.includes("OPERATIONS") && operations.includes(meaning)) return true;
  if (families.includes("FINANCE") && finance.includes(meaning)) return true;
  if (families.includes("PROJECT") && project.includes(meaning)) return true;
  if ((families.includes("EXECUTIVE") || families.includes("GENERAL_MANAGEMENT")) && (executive.includes(meaning) || goalWantsDelivery && operations.includes(meaning))) return true;
  if (families.includes("SUPPLY_CHAIN") && ["Supplier Lead Time", "Capacity"].includes(meaning)) return true;
  if (families.includes("QUALITY") && meaning === "Quality") return true;
  if (!families.length && goalWantsDelivery && operations.includes(meaning)) return true;
  return false;
}

function relevantConcepts(input: ResolveManagerDecisionContextInput, families: readonly ManagerRoleFamily[]): readonly BusinessProjectConcept[] {
  const goalWantsDelivery = /\bdelivery|otd|on-time\b/.test((input.goalLabels ?? []).join(" ").toLowerCase());
  return input.concepts.filter((concept) => established(concept) && meaningRelevant(concept.canonicalMeaning ?? "", families, goalWantsDelivery));
}

export function resolveManagerDecisionContext(input: ResolveManagerDecisionContextInput): ManagerDecisionContext {
  const roles = resolveRoles(input);
  const families = [...new Set(roles.map((role) => role.canonicalRoleFamily).filter((family) => family !== "UNKNOWN"))] as ManagerRoleFamily[];
  const primary = roles.find((role) => role.canonicalRoleFamily !== "UNKNOWN") ?? roles[0]!;
  const relevanceDefs = families.map((family) => findRoleRelevance(family)).filter((entry): entry is NonNullable<ReturnType<typeof findRoleRelevance>> => Boolean(entry));
  const concepts = relevantConcepts(input, families.length ? families : []);
  const conceptIds = concepts.map((concept) => concept.conceptId);
  const relationshipIds = (input.relationships ?? [])
    .filter((edge) => conceptIds.includes(edge.fromConceptId) || conceptIds.includes(edge.toConceptId))
    .map((edge) => edge.relationshipId);
  const processIds = (input.processPlacements ?? [])
    .filter((placement) => placement.conceptIds.some((id) => conceptIds.includes(id)))
    .map((placement) => placement.processContextId);
  const conversationAreas = concernAreas(input.currentConversationConcern);
  const decisionContextAreas = [...new Set([
    ...relevanceDefs.flatMap((entry) => [...entry.decisionContextAreas]),
    ...conversationAreas,
    ...(input.context.contextKind === "HYBRID" ? ["BUSINESS", "PROJECT"] : [input.context.contextKind]),
  ])];
  const responsibilityAreas = [...new Set(relevanceDefs.flatMap((entry) => [...entry.responsibilityAreas]))];
  const refs = uniqueRefs([
    ...input.context.sourceRefs,
    ...roles.map((role) => role.sourceRef),
    ...concepts.flatMap((concept) => concept.sourceRefs),
  ]);
  const confirmation: ContextConfirmationState = roles.some((role) => role.confirmationState === "MANAGER_CONFIRMED")
    ? "MANAGER_CONFIRMED"
    : roles.some((role) => role.confirmationState === "AUTHORITATIVE") ? "AUTHORITATIVE" : "UNCONFIRMED";
  const ambiguous = roles.some((role) => role.state === "AMBIGUOUS");
  const interest = input.conversationInterest?.toLowerCase() ?? "";
  const interestWouldInventFinance = /gross margin|finance/.test(interest) && primary.canonicalRoleFamily === "UNKNOWN";

  return deepFreeze({
    authority: managerDecisionContextIdentity,
    managerContextId: `bca5:${input.context.contextId}:${input.managerId ?? "anonymous"}:${primary.canonicalRoleFamily}:${roles.map((role) => role.rawTitle ?? "none").join("|")}`,
    managerId: input.managerId ?? null,
    managerName: input.managerName ?? null,
    roles,
    roleFamily: families.length > 1 ? primary.canonicalRoleFamily : primary.canonicalRoleFamily,
    rawTitle: primary.rawTitle,
    businessProjectContextId: input.context.contextId,
    responsibilityAreas,
    decisionContextAreas,
    relevantConceptIds: conceptIds,
    relevantRelationshipIds: relationshipIds,
    relevantProcessContextIds: processIds,
    relevantGoalLabels: [...(input.goalLabels ?? [])],
    attentionPriorities: Object.freeze([]),
    evidence: [
      `bca1:${input.context.contextId}`,
      `role:${primary.canonicalRoleFamily}:${primary.state}`,
      ...(input.goalLabels ?? []).map((label) => `goal:${label}`),
    ],
    provenance: refs,
    confidence: ambiguous ? "AMBIGUOUS" : primary.state === "UNKNOWN" ? "UNKNOWN" : primary.state === "MANAGER_CONFIRMED" ? "MANAGER_CONFIRMED" : "SUPPORTED",
    confirmationState: confirmation,
    sourceRefs: refs,
    scope: conversationAreas.length ? "CURRENT_DECISION_CONTEXT" : families.length ? "GENERAL_ROLE" : "CURRENT_DECISION_CONTEXT",
    ambiguity: {
      preserved: ambiguous,
      note: ambiguous ? "raw title is insufficient to classify a canonical role family" : interestWouldInventFinance ? "conversation interest was not used to infer role" : null,
      candidates: ambiguous ? ["OPERATIONS", "PROJECT", "CUSTOMER_SERVICE", "TECHNOLOGY"] : [],
    },
    permissionsKnown: false,
    decisionAuthorityKnown: false,
    permissions: null,
    decisionAuthorities: null,
    expertise: "UNKNOWN",
    durableRoleUnchangedBySession: true,
    roleBasedAuthorityInferenceRejected: true,
    recommendationGenerated: false,
    mostImportantClaimed: false,
    rejectedInferences: [
      ...REJECTED,
      ...(interestWouldInventFinance ? ["conversation interest does not establish a finance role"] : []),
    ],
  });
}

export function diagnoseManagerDecisionContext(context: ManagerDecisionContext): ManagerDecisionContextDiagnostics {
  return deepFreeze({
    managerContextId: context.managerContextId,
    roleTrace: context.roles.map((role) => `${role.rawTitle ?? "none"}:${role.canonicalRoleFamily}:${role.state}`),
    relevanceTrace: context.relevantConceptIds,
    roleBasedAuthorityInferenceRejected: true,
    durableRoleUnchangedBySession: true,
    recommendationGenerated: false,
    mutatesAuthorities: false,
  });
}
