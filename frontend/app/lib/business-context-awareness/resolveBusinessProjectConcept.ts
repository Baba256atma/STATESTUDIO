import {
  businessProjectConceptIntelligenceIdentity,
  type BusinessProjectConcept,
  type BusinessProjectConceptDiagnostics,
  type BusinessProjectConceptState,
  type ConceptFamilyRelevance,
  type EstablishedSemanticMeaning,
  type ResolveBusinessProjectConceptInput,
} from "./businessProjectConceptContract.ts";
import type { BusinessProjectContextKind, BusinessProjectSourceRef, ContextConfirmationState } from "./businessProjectContextContract.ts";
import { findBusinessProjectConceptDefinition } from "./businessProjectConceptRegistry.ts";

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

function uniqueRefs(refs: readonly BusinessProjectSourceRef[]): readonly BusinessProjectSourceRef[] {
  return [...new Map(refs.map((ref) => [sourceKey(ref), ref])).values()];
}

function isEstablished(state: EstablishedSemanticMeaning["state"]): state is "AUTHORITATIVE" | "MANAGER_CONFIRMED" {
  return state === "AUTHORITATIVE" || state === "MANAGER_CONFIRMED";
}

function resolvedContextKind(input: ResolveBusinessProjectConceptInput, relevance: readonly ConceptFamilyRelevance[]): BusinessProjectContextKind {
  const supportsBusiness = relevance.some((entry) => entry.contextKind === "BUSINESS");
  const supportsProject = relevance.some((entry) => entry.contextKind === "PROJECT");
  if (input.context.contextKind === "BUSINESS" && supportsBusiness) return "BUSINESS";
  if (input.context.contextKind === "PROJECT" && supportsProject) return "PROJECT";
  if (input.context.contextKind === "HYBRID" && supportsBusiness && supportsProject) return "HYBRID";
  return supportsBusiness && supportsProject ? "HYBRID" : supportsBusiness ? "BUSINESS" : supportsProject ? "PROJECT" : "UNKNOWN";
}

function unrecognized(input: ResolveBusinessProjectConceptInput, state: BusinessProjectConceptState): BusinessProjectConcept {
  const organizationSpecific = input.organizationSpecificMeaning ?? null;
  const refs = uniqueRefs([...input.semantic.sourceRefs, ...(organizationSpecific ? [organizationSpecific.sourceRef] : [])]);
  return deepFreeze({
    authority: businessProjectConceptIntelligenceIdentity,
    conceptId: `bca2:${input.semantic.semanticId}:${state.toLowerCase()}`,
    canonicalMeaning: null,
    contextKind: "UNKNOWN",
    state,
    conceptFamilies: [],
    domainRelevance: [],
    generalMeaning: null,
    organizationSpecificMeaning: organizationSpecific,
    knowledgeScopes: organizationSpecific ? ["ORGANIZATION_SPECIFIC"] : [],
    evidence: organizationSpecific ? ["manager-confirmed-organization-meaning"] : [],
    provenance: refs,
    confidence: state === "AMBIGUOUS" ? "AMBIGUOUS" : state === "PARTIALLY_UNDERSTOOD" ? "MANAGER_CONFIRMED" : "UNKNOWN",
    confirmationState: input.semantic.state === "MANAGER_CONFIRMED" || organizationSpecific ? "MANAGER_CONFIRMED" : input.semantic.state === "AUTHORITATIVE" ? "AUTHORITATIVE" : "UNCONFIRMED",
    sourceRefs: refs,
    ambiguity: { upstreamState: input.semantic.state, candidates: [...(input.semantic.candidates ?? [])], preserved: !isEstablished(input.semantic.state) },
    contextualAssociations: [],
    currentReality: "NOT_ESTABLISHED",
    executiveObjectId: null,
    rejectedInferences: ["unknown concept was not classified by substring", "concept knowledge does not establish current state", "no executive object was created", "no causal conclusion was produced"],
  });
}

export function resolveBusinessProjectConcept(input: ResolveBusinessProjectConceptInput): BusinessProjectConcept {
  if (!isEstablished(input.semantic.state) || !input.semantic.meaning) {
    return unrecognized(input, input.semantic.state === "LIKELY" || input.semantic.state === "AMBIGUOUS" ? "AMBIGUOUS" : "UNKNOWN");
  }
  const definition = findBusinessProjectConceptDefinition(input.semantic.meaning);
  if (!definition) return unrecognized(input, input.organizationSpecificMeaning ? "PARTIALLY_UNDERSTOOD" : "UNKNOWN");
  const contextKind = resolvedContextKind(input, definition.familyRelevance);
  const relevant = input.context.contextKind === "HYBRID" || input.context.contextKind === "UNKNOWN"
    ? definition.familyRelevance
    : definition.familyRelevance.filter((entry) => entry.contextKind === input.context.contextKind);
  const domainRelevance = relevant.length ? relevant : definition.familyRelevance;
  const multiContext = new Set(domainRelevance.map((entry) => entry.contextKind)).size > 1;
  const organizationSpecific = input.organizationSpecificMeaning ?? null;
  const sourceRefs = uniqueRefs([...input.semantic.sourceRefs, ...input.context.sourceRefs, ...(organizationSpecific ? [organizationSpecific.sourceRef] : [])]);
  const confirmationState: ContextConfirmationState = input.semantic.state === "MANAGER_CONFIRMED" || organizationSpecific ? "MANAGER_CONFIRMED" : "AUTHORITATIVE";
  return deepFreeze({
    authority: businessProjectConceptIntelligenceIdentity,
    conceptId: `bca2:${input.semantic.semanticId}:${definition.registryId}`,
    canonicalMeaning: definition.canonicalName,
    contextKind,
    state: multiContext ? "MULTI_CONTEXT" : "KNOWN",
    conceptFamilies: [...new Set(domainRelevance.map((entry) => entry.family))],
    domainRelevance,
    generalMeaning: definition.generalMeaning,
    organizationSpecificMeaning: organizationSpecific,
    knowledgeScopes: organizationSpecific ? ["GENERAL", "ORGANIZATION_SPECIFIC"] : ["GENERAL"],
    evidence: [`established-semantic:${input.semantic.semanticId}`, `registry:${definition.registryId}`, `bca1-context:${input.context.contextId}`],
    provenance: sourceRefs,
    confidence: input.semantic.state === "MANAGER_CONFIRMED" ? "MANAGER_CONFIRMED" : input.context.confidence === "UNKNOWN" ? "SUPPORTED" : input.context.confidence,
    confirmationState,
    sourceRefs,
    ambiguity: { upstreamState: input.semantic.state, candidates: [], preserved: false },
    contextualAssociations: definition.safeAssociations,
    currentReality: "NOT_ESTABLISHED",
    executiveObjectId: null,
    rejectedInferences: [...definition.rejectedConclusions, "managerial relevance does not grant decision authority"],
  });
}

export function diagnoseBusinessProjectConcept(concept: BusinessProjectConcept): BusinessProjectConceptDiagnostics {
  return deepFreeze({
    conceptId: concept.conceptId,
    recognizedConcept: concept.canonicalMeaning,
    recognitionBasis: concept.canonicalMeaning ? ["exact established-meaning registry match", "BCA:1 context qualification"] : ["no exact established-meaning registry match"],
    semanticAuthority: concept.sourceRefs.map(sourceKey),
    families: [...concept.conceptFamilies],
    knowledgeScopes: [...concept.knowledgeScopes],
    evidenceTrace: [...concept.evidence],
    ambiguity: concept.ambiguity,
    rejectedInferences: [...concept.rejectedInferences],
    causalInference: "NONE",
    mutatesAuthorities: false,
  });
}
