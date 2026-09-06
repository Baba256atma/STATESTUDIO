import {
  businessProjectContextIdentity,
  type BusinessProjectContext,
  type BusinessProjectContextConfidence,
  type BusinessProjectContextDiagnostics,
  type BusinessProjectContextEvidence,
  type BusinessProjectContextKind,
  type BusinessProjectContextRelationship,
  type BusinessProjectKnownConcept,
  type BusinessProjectSourceRef,
  type ContextConfirmationState,
  type ResolveProjectContextInput,
} from "./businessProjectContextContract.ts";

const PROJECT_TERMS = /\b(project|program|schedule|milestone|deliverable|planned completion|actual completion|scope|earned value)\b/i;
const BUSINESS_TERMS = /\b(business|company|operations?|finance|sales|marketing|supply chain|procurement|customer|quality|human resources?|production|service|delivery|backlog|capacity|workload|revenue|margin)\b/i;

type Relevance = Readonly<{ pattern: RegExp; contexts: readonly string[]; kind: "RELEVANT_TO" | "MEASURE_OF" }>;
const RELEVANCE: readonly Relevance[] = Object.freeze([
  { pattern: /\b(backlog|workload)\b/i, contexts: ["Operations", "Delivery", "Workload"], kind: "RELEVANT_TO" },
  { pattern: /\b(on[ -]?time|delivery)\b/i, contexts: ["Operations", "Delivery"], kind: "MEASURE_OF" },
  { pattern: /\b(capacity|throughput|production)\b/i, contexts: ["Operations", "Production", "Capacity"], kind: "RELEVANT_TO" },
  { pattern: /\b(revenue|margin|cash|cost|budget)\b/i, contexts: ["Finance"], kind: "RELEVANT_TO" },
  { pattern: /\b(schedule|completion|milestone)\b/i, contexts: ["Project Schedule"], kind: "RELEVANT_TO" },
  { pattern: /\b(resource|staff)\b/i, contexts: ["Project Resources"], kind: "RELEVANT_TO" },
  { pattern: /\b(scope|deliverable)\b/i, contexts: ["Project Scope"], kind: "RELEVANT_TO" },
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

function uniqueRefs(evidence: readonly BusinessProjectContextEvidence[], concepts: readonly BusinessProjectKnownConcept[], managerRef: BusinessProjectSourceRef | null): readonly BusinessProjectSourceRef[] {
  const refs = [...evidence.map((entry) => entry.sourceRef), ...concepts.map((entry) => entry.sourceRef), ...(managerRef ? [managerRef] : [])];
  return [...new Map(refs.map((ref) => [sourceKey(ref), ref])).values()];
}

function confirmed(state: ContextConfirmationState): boolean {
  return state === "AUTHORITATIVE" || state === "MANAGER_CONFIRMED";
}

function aggregateConfirmation(evidence: readonly BusinessProjectContextEvidence[]): ContextConfirmationState {
  if (evidence.some((entry) => entry.confirmationState === "MANAGER_CONFIRMED")) return "MANAGER_CONFIRMED";
  if (evidence.some((entry) => entry.confirmationState === "AUTHORITATIVE")) return "AUTHORITATIVE";
  return "UNCONFIRMED";
}

function contextConfidence(kind: BusinessProjectContextKind, evidence: readonly BusinessProjectContextEvidence[]): BusinessProjectContextConfidence {
  if (kind === "UNKNOWN") return evidence.length ? "AMBIGUOUS" : "UNKNOWN";
  if (evidence.some((entry) => entry.confirmationState === "MANAGER_CONFIRMED")) return "MANAGER_CONFIRMED";
  if (evidence.some((entry) => entry.confirmationState === "AUTHORITATIVE" && ["DOMAIN", "ORGANIZATION", "PROJECT"].includes(entry.kind))) return "KNOWN";
  if (evidence.some((entry) => entry.kind === "DATA_ADV_CONFIRMED_SEMANTIC" && confirmed(entry.confirmationState))) return "SUPPORTED";
  return "LIKELY";
}

function conceptRelationships(concepts: readonly BusinessProjectKnownConcept[], evidence: readonly BusinessProjectContextEvidence[]): readonly BusinessProjectContextRelationship[] {
  const result: BusinessProjectContextRelationship[] = [];
  for (const concept of concepts) {
    const conceptEvidence = evidence.find((entry) => entry.sourceRef.sourceId === concept.sourceRef.sourceId && entry.label === concept.label);
    if (!conceptEvidence) continue;
    for (const relevance of RELEVANCE) {
      if (!relevance.pattern.test(concept.label)) continue;
      for (const target of relevance.contexts) {
        result.push({
          relationshipId: `${concept.conceptId}:${relevance.kind.toLowerCase()}:${target.toLowerCase().replace(/\s+/g, "-")}`,
          fromConceptId: concept.conceptId,
          toContextConcept: target,
          kind: relevance.kind,
          confidence: concept.confirmationState === "MANAGER_CONFIRMED" ? "MANAGER_CONFIRMED" : "SUPPORTED",
          evidenceIds: [conceptEvidence.evidenceId],
          causal: false,
        });
      }
    }
  }
  return result;
}

export function resolveBusinessProjectContext(input: ResolveProjectContextInput): BusinessProjectContext {
  const rawSignals = [
    ...(input.domain ? [input.domain.evidence] : []),
    ...(input.organization ? [input.organization.evidence] : []),
    ...(input.project ? [input.project.evidence] : []),
    ...(input.goalSignals ?? []),
    ...(input.objectSignals ?? []),
    ...(input.dataRealitySignals ?? []),
    ...(input.relationshipSignals ?? []),
  ];
  const semanticConcepts = (input.confirmedSemanticConcepts ?? []).filter((concept) => confirmed(concept.confirmationState));
  const semanticEvidence: BusinessProjectContextEvidence[] = semanticConcepts.map((concept) => ({
    evidenceId: `bca:semantic:${concept.conceptId}`,
    kind: "DATA_ADV_CONFIRMED_SEMANTIC",
    label: concept.label,
    confirmationState: concept.confirmationState,
    sourceRef: concept.sourceRef,
  }));
  const evidence: BusinessProjectContextEvidence[] = [...rawSignals, ...semanticEvidence];
  const confirmedEvidence = evidence.filter((entry) => confirmed(entry.confirmationState));
  const semanticText = semanticConcepts.map((concept) => concept.label).join(" ");
  const domainId = input.domain && confirmed(input.domain.evidence.confirmationState) ? input.domain.domainId : null;
  const businessSupported = Boolean(input.organization && confirmed(input.organization.evidence.confirmationState))
    || Boolean(domainId && domainId !== "general" && domainId !== "pmo")
    || BUSINESS_TERMS.test(semanticText);
  const projectSupported = Boolean(input.project && confirmed(input.project.evidence.confirmationState))
    || domainId === "pmo"
    || PROJECT_TERMS.test(semanticText);
  const contextKind: BusinessProjectContextKind = businessSupported && projectSupported ? "HYBRID" : businessSupported ? "BUSINESS" : projectSupported ? "PROJECT" : "UNKNOWN";
  const unresolvedContext = [
    ...(!businessSupported ? ["Business context is not supported by confirmed evidence."] : []),
    ...(!projectSupported ? ["Project context is not supported by confirmed evidence."] : []),
    ...(input.managerContext && !confirmed(input.managerContext.confirmationState) ? ["Manager role is unconfirmed."] : []),
    ...((input.confirmedSemanticConcepts ?? []).some((concept) => !confirmed(concept.confirmationState)) ? ["Unconfirmed semantic concepts were excluded from contextual interpretation."] : []),
  ];
  const context: BusinessProjectContext = {
    authority: businessProjectContextIdentity,
    contextId: `bca1:${input.workspaceId}:${[input.organization?.context.label, input.project?.context.projectId, domainId, ...semanticConcepts.map((item) => `${item.sourceRef.sourceContextId ?? item.sourceRef.sourceId}:${item.conceptId}`)].filter(Boolean).join("|") || "unknown"}`,
    workspaceId: input.workspaceId,
    contextKind,
    domain: domainId,
    organizationContext: input.organization && confirmed(input.organization.evidence.confirmationState) ? input.organization.context : null,
    projectContext: input.project && confirmed(input.project.evidence.confirmationState) ? input.project.context : null,
    managerContext: input.managerContext ?? null,
    knownConcepts: semanticConcepts,
    contextualRelationships: conceptRelationships(semanticConcepts, semanticEvidence),
    evidence,
    confidence: contextConfidence(contextKind, confirmedEvidence),
    confirmationState: aggregateConfirmation(confirmedEvidence),
    sourceRefs: uniqueRefs(evidence, semanticConcepts, input.managerContext?.sourceRef ?? null),
    unresolvedContext,
    createdFrom: "AUTHORITATIVE_PROJECTION",
  };
  return deepFreeze(context);
}

export function diagnoseBusinessProjectContext(context: BusinessProjectContext): BusinessProjectContextDiagnostics {
  return deepFreeze({
    contextId: context.contextId,
    resolvedContextKind: context.contextKind,
    confidence: context.confidence,
    evidenceTrace: context.evidence.map((entry) => `${entry.evidenceId}:${entry.kind}:${entry.confirmationState}:${sourceKey(entry.sourceRef)}`),
    relationshipTrace: context.contextualRelationships.map((entry) => `${entry.fromConceptId}:${entry.kind}:${entry.toContextConcept}:causal=${entry.causal}`),
    unresolvedContext: [...context.unresolvedContext],
    rejectedUnsafeInference: [
      "contextual-relevance-does-not-establish-causality",
      "manager-role-does-not-grant-permission",
      "manager-role-does-not-grant-decision-authority",
      "unconfirmed-semantics-do-not-establish-context",
    ],
    mutatesAuthorities: false,
  });
}
