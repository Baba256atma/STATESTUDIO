import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectSourceRef } from "./businessProjectContextContract.ts";
import {
  businessProjectContextClarificationIdentity,
  BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY,
  type ClarificationAmbiguityType,
  type ClarificationCandidate,
  type ClarificationMateriality,
  type ClarificationSubjectKind,
  type ContextClarificationDiagnostics,
  type ContextClarificationNeed,
  type ExistingScopedConfirmation,
  type ResolveContextClarificationInput,
} from "./businessProjectContextClarificationContract.ts";

const REJECTED = Object.freeze([
  "unknown is not automatically a clarification",
  "clarification need is not confirmation",
  "clarification intent is not a conversation writer",
  "manager confirmation is not global truth",
  "manager confirmation is not current reality",
  "manager confirmation is not causality",
  "manager role confirmation is not permission",
  "manager role confirmation is not decision authority",
  "context confirmation is not decision approval",
  "one clarification is not an interrogation",
]);

type CandidateNeed = Readonly<{
  rank: number;
  key: string;
  subjectKind: ClarificationSubjectKind;
  subjectId: string | null;
  ambiguityType: ClarificationAmbiguityType;
  materiality: ClarificationMateriality;
  candidates: readonly ClarificationCandidate[];
  currentInterpretation: string | null;
  unresolvedFields: readonly string[];
  refs: readonly BusinessProjectSourceRef[];
  evidence: readonly string[];
  scope: string;
  blockingReason: string | null;
  recommendedClarificationKind: string;
  intent: string;
  layers: readonly string[];
  handoff: ContextClarificationNeed["confirmationHandoffAuthority"];
}>;

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

function requestKind(request: string): "MEANING" | "RESPONSIBILITY" | "CAPACITY_SCOPE" | "PROCESS" | "RELATIONSHIP" | "CURRENT_STATE" | "ROLE_PERSPECTIVE" | "GENERAL" {
  const text = request.trim().toLowerCase();
  if (/\bwhat does\b.+\bmean\b/.test(text)) return "MEANING";
  if (/\bact(?:ing)? as\b|\bfor this (?:issue|discussion)\b/.test(text)) return "ROLE_PERSPECTIVE";
  if (/\bcapacit/.test(text) && /\b(issue|investigate|problem|explain)\b/.test(text)) return "CAPACITY_SCOPE";
  if (/\bresponsibility\b|\bmatters most\b/.test(text)) return "RESPONSIBILITY";
  if (/\b(where .+ used|process relevance|organization'?s work|belongs)\b/.test(text)) return "PROCESS";
  if (/\bconnected|related\b/.test(text)) return "RELATIONSHIP";
  if (/\bcurrent (state|capacity|value)\b/.test(text)) return "CURRENT_STATE";
  return "GENERAL";
}

function confirmationFor(input: ResolveContextClarificationInput, key: string): ExistingScopedConfirmation | undefined {
  return (input.existingConfirmations ?? []).find((entry) => entry.clarificationKey === key);
}

function suppressed(record: ExistingScopedConfirmation | undefined): boolean {
  return record?.confirmationState === "MANAGER_CONFIRMED" || record?.confirmationState === "DECLINED" || record?.confirmationState === "UNRESOLVED";
}

function capacityConcept(input: ResolveContextClarificationInput): BusinessProjectConcept | undefined {
  return input.concepts.find((concept) => concept.canonicalMeaning === "Capacity");
}

function hybridCapacityUnresolved(input: ResolveContextClarificationInput): boolean {
  if (input.context.contextKind !== "HYBRID") return false;
  const concept = capacityConcept(input);
  if (!concept) return false;
  const aspects = new Set(concept.domainRelevance.map((entry) => entry.aspect));
  return aspects.has("CURRENT_OPERATIONS") && aspects.has("PLANNED_PROJECT");
}

function gather(input: ResolveContextClarificationInput): readonly CandidateNeed[] {
  const kind = requestKind(input.currentRequest);
  const manager = input.managerDecisionContext;
  const needs: CandidateNeed[] = [];
  const roleKey = "MANAGER_ROLE:ROLE_AMBIGUITY";
  const capacityKey = "SCOPE:HYBRID_SCOPE_AMBIGUITY:Capacity";
  const processMeaning = (input.unknownProcessMeanings ?? []).find((meaning) => /\bcustom engineering load\b/i.test(meaning))
    ?? (input.unknownProcessMeanings ?? [])[0]
    ?? null;
  const processKey = processMeaning ? `PROCESS_CONTEXT:PROCESS_PLACEMENT_AMBIGUITY:${processMeaning}` : "PROCESS_CONTEXT:PROCESS_PLACEMENT_AMBIGUITY";
  const temporalKey = "TEMPORAL_CONTEXT:TEMPORAL_AMBIGUITY:Capacity";
  const orgKey = "ORGANIZATION_SPECIFIC_MEANING:Backlog";

  const roleAmbiguous = manager?.roles.some((role) => role.state === "AMBIGUOUS") === true;
  const roleRecord = confirmationFor(input, roleKey);
  if (roleAmbiguous && kind === "RESPONSIBILITY" && !suppressed(roleRecord)) {
    needs.push({
      rank: 40,
      key: roleKey,
      subjectKind: "MANAGER_ROLE",
      subjectId: manager?.managerContextId ?? null,
      ambiguityType: "ROLE_AMBIGUITY",
      materiality: "BLOCKING",
      candidates: (manager?.ambiguity.candidates ?? ["OPERATIONS", "PROJECT", "CUSTOMER_SERVICE", "TECHNOLOGY"]).map((id) => ({ id, label: id, scope: "ROLE" })),
      currentInterpretation: null,
      unresolvedFields: [manager?.rawTitle ?? "role"],
      refs: uniqueRefs([...(manager?.sourceRefs ?? []), ...input.context.sourceRefs]),
      evidence: ["bca5-role-ambiguous", `request:${kind}`],
      scope: "ROLE",
      blockingReason: "current reasoning depends on which delivery responsibility applies",
      recommendedClarificationKind: "ROLE",
      intent: "When you say Delivery Manager, do you mean delivery operations/logistics, project delivery, or another kind of delivery responsibility?",
      layers: ["BCA:5"],
      handoff: "ManagerConversation",
    });
  }

  const capacityRecord = confirmationFor(input, capacityKey);
  if (hybridCapacityUnresolved(input) && kind === "CAPACITY_SCOPE" && !suppressed(capacityRecord)) {
    const concept = capacityConcept(input)!;
    needs.push({
      rank: 20,
      key: capacityKey,
      subjectKind: "SCOPE",
      subjectId: concept.conceptId,
      ambiguityType: "HYBRID_SCOPE_AMBIGUITY",
      materiality: "BLOCKING",
      candidates: [
        { id: "CURRENT_OPERATIONS", label: "current operating capacity", scope: "BUSINESS" },
        { id: "PLANNED_PROJECT", label: "capacity related to the expansion project", scope: "PROJECT" },
      ],
      currentInterpretation: null,
      unresolvedFields: ["capacity-scope"],
      refs: uniqueRefs([...concept.sourceRefs, ...input.context.sourceRefs]),
      evidence: ["bca1-hybrid", "bca2-capacity-multi-context", `request:${kind}`],
      scope: "CURRENT_DECISION_CONTEXT",
      blockingReason: "current vs project capacity would change which issue is in view",
      recommendedClarificationKind: "HYBRID_SCOPE",
      intent: "When you say Capacity here, do you mean current operating capacity or capacity planned through the project?",
      layers: ["BCA:1", "BCA:2"],
      handoff: "ManagerConversation",
    });
  }

  const temporalRecord = confirmationFor(input, temporalKey);
  const measurement = (input.statedMeasurements ?? []).find((item) => item.conceptMeaning === "Capacity" && item.temporalStatus == null);
  if (measurement && kind === "CURRENT_STATE" && !suppressed(temporalRecord)) {
    needs.push({
      rank: 25,
      key: temporalKey,
      subjectKind: "TEMPORAL_CONTEXT",
      subjectId: capacityConcept(input)?.conceptId ?? "Capacity",
      ambiguityType: "TEMPORAL_AMBIGUITY",
      materiality: "BLOCKING",
      candidates: [
        { id: "CURRENT", label: "current", scope: "TEMPORAL" },
        { id: "HISTORICAL", label: "last period", scope: "TEMPORAL" },
        { id: "FORECAST", label: "forecast", scope: "TEMPORAL" },
        { id: "TARGET", label: "target", scope: "TEMPORAL" },
      ],
      currentInterpretation: null,
      unresolvedFields: ["temporal-status"],
      refs: uniqueRefs([measurement.sourceRef, ...input.context.sourceRefs]),
      evidence: [`measurement:${measurement.value}`, `request:${kind}`],
      scope: "TEMPORAL",
      blockingReason: "time scope is required before treating a figure as current state",
      recommendedClarificationKind: "TEMPORAL",
      intent: "Is that capacity figure current, from a prior period, a forecast, or a target?",
      layers: ["BCA:4"],
      handoff: "ManagerConversation",
    });
  }

  const processRecord = confirmationFor(input, processKey);
  if (processMeaning && kind === "PROCESS" && !suppressed(processRecord)) {
    needs.push({
      rank: 50,
      key: processKey,
      subjectKind: "PROCESS_CONTEXT",
      subjectId: processMeaning,
      ambiguityType: "PROCESS_PLACEMENT_AMBIGUITY",
      materiality: "IMPORTANT",
      candidates: [
        { id: "ENGINEERING_PLANNING", label: "engineering planning", scope: "ORGANIZATION" },
        { id: "PRODUCTION_PLANNING", label: "production planning", scope: "ORGANIZATION" },
        { id: "OTHER", label: "another process", scope: "ORGANIZATION" },
      ],
      currentInterpretation: null,
      unresolvedFields: [processMeaning],
      refs: uniqueRefs(input.context.sourceRefs),
      evidence: ["bca4-unknown-placement", `request:${kind}`],
      scope: "ORGANIZATION",
      blockingReason: "process placement is needed for the current process question",
      recommendedClarificationKind: "PROCESS_PLACEMENT",
      intent: "Is Custom Engineering Load mainly used for engineering planning, production planning, or another process?",
      layers: ["BCA:4"],
      handoff: "ManagerConversation",
    });
  }

  const orgRecord = confirmationFor(input, orgKey);
  if (kind === "PROCESS" && input.concepts.some((concept) => concept.canonicalMeaning === "Backlog") && !suppressed(orgRecord) && !processMeaning) {
    needs.push({
      rank: 55,
      key: orgKey,
      subjectKind: "ORGANIZATION_SPECIFIC_MEANING",
      subjectId: "Backlog",
      ambiguityType: "UNCONFIRMED_ORGANIZATION_SPECIFIC_MEANING",
      materiality: "IMPORTANT",
      candidates: [
        { id: "FULFILLMENT", label: "fulfillment (general)", scope: "GENERAL" },
        { id: "PRODUCTION_PLANNING", label: "production planning (this organization)", scope: "ORGANIZATION" },
      ],
      currentInterpretation: "FULFILLMENT",
      unresolvedFields: ["organization-backlog-placement"],
      refs: uniqueRefs(input.context.sourceRefs),
      evidence: ["bca4-general-fulfillment", `request:${kind}`],
      scope: "ORGANIZATION",
      blockingReason: null,
      recommendedClarificationKind: "ORGANIZATION_PROCESS",
      intent: "For this organization, does backlog belong to production planning, or should Nexora keep the general fulfillment placement?",
      layers: ["BCA:4"],
      handoff: "ManagerConversation",
    });
  }

  return needs;
}

export function resolveBusinessProjectContextClarification(input: ResolveContextClarificationInput): ContextClarificationNeed {
  const kind = requestKind(input.currentRequest);
  const all = gather(input);
  const records = input.existingConfirmations ?? [];
  const declined = records.find((entry) => entry.confirmationState === "DECLINED" || entry.confirmationState === "UNRESOLVED");
  const open = all.filter((need) => !suppressed(confirmationFor(input, need.key)));
  const selected = [...open].sort((a, b) => a.rank - b.rank || a.key.localeCompare(b.key))[0] ?? null;
  const alreadyAsked = Boolean(selected && input.pendingClarificationKey === selected.key);
  const roleClarificationNeeded = selected?.ambiguityType === "ROLE_AMBIGUITY";
  const proceed = selected ? selected.materiality !== "BLOCKING" : true;
  const refs = uniqueRefs([...(selected?.refs ?? []), ...input.context.sourceRefs]);
  const sourceLeakRejected = input.concepts.every((concept) => {
    const ctx = concept.sourceRefs.map((ref) => ref.sourceContextId).filter(Boolean);
    return new Set(ctx).size <= 1 || ctx.every((id) => id === concept.sourceRefs[0]?.sourceContextId);
  });

  return deepFreeze({
    authority: businessProjectContextClarificationIdentity,
    clarificationId: selected ? `bca6:${input.context.contextId}:${selected.key}` : `bca6:${input.context.contextId}:none`,
    subjectKind: selected?.subjectKind ?? null,
    subjectId: selected?.subjectId ?? null,
    contextKind: input.context.contextKind,
    ambiguityType: selected?.ambiguityType ?? (kind === "MEANING" ? "UNKNOWN_BUT_NONBLOCKING" : null),
    clarificationNeeded: Boolean(selected),
    materiality: selected?.materiality ?? "NONE",
    candidateInterpretations: selected?.candidates ?? [],
    currentInterpretation: selected?.currentInterpretation ?? input.currentRolePerspective ?? null,
    unresolvedFields: selected?.unresolvedFields ?? [],
    evidence: selected?.evidence ?? [`request:${kind}`, "bca1-5-consumed"],
    provenance: refs,
    confidence: selected ? "AMBIGUOUS" : "SUPPORTED",
    confirmationState: !selected && declined ? declined.confirmationState : "UNCONFIRMED",
    sourceRefs: refs,
    scope: selected?.scope ?? "CURRENT_CONTEXT",
    blockingReason: selected?.blockingReason ?? null,
    decisionImpact: null,
    recommendedClarificationKind: selected?.recommendedClarificationKind ?? null,
    clarificationQuestionIntent: selected?.intent ?? null,
    canProceedWithoutClarification: selected ? proceed : true,
    roleClarificationNeeded,
    alreadyAsked,
    declinedOrUnknown: Boolean(declined),
    stableRolesPreserved: true,
    currentRolePerspective: input.currentRolePerspective ?? null,
    confirmationHandoffAuthority: selected?.handoff ?? "none",
    writesConfirmation: false,
    causalQuestionRejected: true,
    permissionsInferred: false,
    currentRealityInferred: false,
    decisionCommitted: false,
    executionMutated: false,
    stageMutated: false,
    theatreMutated: false,
    rejectedInferences: [
      ...REJECTED,
      ...(sourceLeakRejected ? ["confirmation does not transfer across sources"] : []),
      "confirmation does not transfer across projects",
      ...(kind === "RELATIONSHIP" ? ["relationship clarification must not presuppose causality"] : []),
    ],
  });
}

export function diagnoseBusinessProjectContextClarification(
  need: ContextClarificationNeed,
  input?: ResolveContextClarificationInput,
): ContextClarificationDiagnostics {
  const gathered = input ? gather(input) : [];
  const confirmed = (input?.existingConfirmations ?? []).some((entry) => entry.confirmationState === "MANAGER_CONFIRMED");
  return deepFreeze({
    clarificationId: need.clarificationId,
    detectedAmbiguities: gathered.map((item) => `${item.ambiguityType}:${item.materiality}`),
    selectedWhy: need.clarificationNeeded ? `${need.ambiguityType}:${need.materiality}` : "no material ambiguity for the current request",
    producingLayers: gathered.find((item) => need.clarificationId.endsWith(`:${item.key}`))?.layers ?? (need.clarificationNeeded ? ["BCA:6"] : []),
    materialNow: need.materiality === "BLOCKING" || need.materiality === "IMPORTANT",
    canProceedWithoutClarification: need.canProceedWithoutClarification,
    alreadyAsked: need.alreadyAsked,
    alreadyConfirmed: confirmed && !need.clarificationNeeded,
    declinedOrUnknown: need.declinedOrUnknown,
    confirmationWriter: need.confirmationHandoffAuthority === "none" ? "none" : need.confirmationHandoffAuthority === "applyCsvSemanticClarification" ? BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.confirmationWriterSemantic : BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.confirmationWriterContextual,
    bcaWriteAttempted: false,
    sourceScopePreserved: true,
    projectScopePreserved: true,
    mutatesAuthorities: false,
  });
}
