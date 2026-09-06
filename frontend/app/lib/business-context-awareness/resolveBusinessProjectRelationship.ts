import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import { findBusinessProjectConceptDefinition } from "./businessProjectConceptRegistry.ts";
import type { BusinessProjectContextKind, BusinessProjectSourceRef, ContextConfirmationState } from "./businessProjectContextContract.ts";
import {
  BUSINESS_PROJECT_RELATIONSHIP_PRECEDENCE,
  businessProjectRelationshipIntelligenceIdentity,
  type BusinessProjectConceptRelationship,
  type BusinessProjectRelationshipDiagnostics,
  type BusinessProjectRelationshipProjection,
  type BusinessProjectRelationshipType,
  type ResolveBusinessProjectRelationshipInput,
  type UnknownConceptPair,
} from "./businessProjectRelationshipContract.ts";
import {
  BUSINESS_PROJECT_RELATIONSHIP_REGISTRY,
  relationshipEndpointKey,
  type BusinessProjectRelationshipDefinition,
} from "./businessProjectRelationshipRegistry.ts";

const REJECTED = Object.freeze([
  "relationship does not establish causality",
  "relationship does not establish current state",
  "no executive object graph was created",
  "source meaning was not transferred",
  "unsupported dependency was not inferred from concept names",
  "unsupported goal linkage was not created",
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

function uniqueRefs(refs: readonly BusinessProjectSourceRef[]): readonly BusinessProjectSourceRef[] {
  return [...new Map(refs.map((ref) => [sourceKey(ref), ref])).values()];
}

function established(concept: BusinessProjectConcept): boolean {
  return Boolean(concept.canonicalMeaning) && (concept.state === "KNOWN" || concept.state === "MULTI_CONTEXT" || concept.state === "PARTIALLY_UNDERSTOOD");
}

function meaningOf(concept: BusinessProjectConcept): string {
  return concept.canonicalMeaning ?? "";
}

function conceptMatchesName(concept: BusinessProjectConcept, name: string): boolean {
  if (!concept.canonicalMeaning) return false;
  if (relationshipEndpointKey(concept.canonicalMeaning) === relationshipEndpointKey(name)) return true;
  const definition = findBusinessProjectConceptDefinition(concept.canonicalMeaning);
  if (!definition) return false;
  return [definition.canonicalName, ...definition.aliases].some((candidate) => relationshipEndpointKey(candidate) === relationshipEndpointKey(name));
}

function sourceContextIds(concept: BusinessProjectConcept): readonly string[] {
  return [...new Set(concept.sourceRefs.map((ref) => ref.sourceContextId).filter((value): value is string => Boolean(value)))];
}

function sameSource(from: BusinessProjectConcept, to: BusinessProjectConcept): boolean {
  const left = sourceContextIds(from);
  const right = sourceContextIds(to);
  return left.some((id) => right.includes(id));
}

function contextAllows(definition: BusinessProjectRelationshipDefinition, contextKind: BusinessProjectContextKind): boolean {
  if (contextKind === "UNKNOWN") return false;
  if (contextKind === "HYBRID") return definition.contexts.some((kind) => kind === "HYBRID" || kind === "BUSINESS" || kind === "PROJECT");
  return definition.contexts.includes(contextKind) || (definition.contexts.includes("HYBRID") && (contextKind === "BUSINESS" || contextKind === "PROJECT"));
}

function crossSourceAllowed(definition: BusinessProjectRelationshipDefinition, from: BusinessProjectConcept, to: BusinessProjectConcept, contextKind: BusinessProjectContextKind): boolean {
  if (sameSource(from, to)) return true;
  return definition.crossSource === "HYBRID_CONTEXT" && contextKind === "HYBRID";
}

function aspectsConflict(from: BusinessProjectConcept, to: BusinessProjectConcept): boolean {
  const fromAspects = new Set(from.domainRelevance.map((entry) => entry.aspect));
  const toAspects = new Set(to.domainRelevance.map((entry) => entry.aspect));
  return fromAspects.has("CURRENT_OPERATIONS") && toAspects.has("PLANNED_PROJECT") || fromAspects.has("PLANNED_PROJECT") && toAspects.has("CURRENT_OPERATIONS");
}

function precedenceIndex(type: BusinessProjectRelationshipType): number {
  const index = BUSINESS_PROJECT_RELATIONSHIP_PRECEDENCE.indexOf(type);
  return index === -1 ? BUSINESS_PROJECT_RELATIONSHIP_PRECEDENCE.length : index;
}

function pairKey(fromId: string, toId: string): string {
  return `${fromId}::${toId}`;
}

function confirmation(from: BusinessProjectConcept, to: BusinessProjectConcept, confirmed: boolean): ContextConfirmationState {
  if (confirmed) return "MANAGER_CONFIRMED";
  if (from.confirmationState === "MANAGER_CONFIRMED" || to.confirmationState === "MANAGER_CONFIRMED") return "MANAGER_CONFIRMED";
  if (from.confirmationState === "AUTHORITATIVE" || to.confirmationState === "AUTHORITATIVE") return "AUTHORITATIVE";
  return "UNCONFIRMED";
}

function instantiate(
  from: BusinessProjectConcept,
  to: BusinessProjectConcept,
  definition: BusinessProjectRelationshipDefinition,
  contextId: string,
  extras: Readonly<{ suppressed: boolean; orgSpecific: boolean; managerRef: BusinessProjectSourceRef | null }>,
): BusinessProjectConceptRelationship {
  const refs = uniqueRefs([...from.sourceRefs, ...to.sourceRefs, ...(extras.managerRef ? [extras.managerRef] : [])]);
  const conflict = aspectsConflict(from, to);
  const type = conflict && definition.relationshipType !== "POTENTIALLY_RELATED_TO" && definition.relationshipType !== "POTENTIALLY_CONSTRAINS"
    ? "POTENTIALLY_RELATED_TO"
    : definition.relationshipType;
  return {
    authority: businessProjectRelationshipIntelligenceIdentity,
    relationshipId: `bca3:${from.conceptId}:${type}:${to.conceptId}:${definition.registryId}${extras.orgSpecific ? ":org" : ""}`,
    fromConceptId: from.conceptId,
    toConceptId: to.conceptId,
    fromCanonicalMeaning: meaningOf(from),
    toCanonicalMeaning: meaningOf(to),
    relationshipType: type,
    kind: type,
    contextKinds: definition.contexts,
    conceptFamilies: definition.families,
    directionality: definition.directionality,
    scope: extras.orgSpecific ? "ORGANIZATION" : definition.scope,
    knowledgeScopes: extras.orgSpecific ? ["ORGANIZATION_SPECIFIC"] : ["GENERAL"],
    evidence: [
      `bca1-context:${contextId}`,
      `bca2-from:${from.conceptId}`,
      `bca2-to:${to.conceptId}`,
      `bca3-registry:${definition.registryId}`,
    ],
    provenance: refs,
    confidence: extras.orgSpecific ? "MANAGER_CONFIRMED" : definition.confidence,
    confirmationState: confirmation(from, to, extras.orgSpecific),
    sourceRefs: refs,
    ambiguity: { preserved: extras.suppressed, note: extras.suppressed ? "organization-specific contrary context outranks general knowledge for current reasoning" : null },
    currentRealityEstablished: false,
    causalityEstablished: false,
    currentReality: "NOT_ESTABLISHED",
    causal: false,
    suppressedForCurrentContext: extras.suppressed,
    rejectedInferences: conflict
      ? [...REJECTED, "current operations and planned project aspects are not merged"]
      : [...REJECTED],
    domainRelevance: [...from.domainRelevance, ...to.domainRelevance],
  };
}

function literalTarget(toMeaning: string, sourceRef: BusinessProjectSourceRef): BusinessProjectConcept {
  return {
    authority: "BCA:2/BusinessProjectConceptIntelligence",
    conceptId: `bca3:external:${relationshipEndpointKey(toMeaning)}`,
    canonicalMeaning: toMeaning,
    contextKind: "UNKNOWN",
    state: "PARTIALLY_UNDERSTOOD",
    conceptFamilies: [],
    domainRelevance: [],
    generalMeaning: null,
    organizationSpecificMeaning: { meaning: toMeaning, confirmationState: "MANAGER_CONFIRMED", sourceRef },
    knowledgeScopes: ["ORGANIZATION_SPECIFIC"],
    evidence: ["manager-confirmed-organization-relationship"],
    provenance: [sourceRef],
    confidence: "MANAGER_CONFIRMED",
    confirmationState: "MANAGER_CONFIRMED",
    sourceRefs: [sourceRef],
    ambiguity: { upstreamState: "MANAGER_CONFIRMED", candidates: [], preserved: false },
    contextualAssociations: [],
    currentReality: "NOT_ESTABLISHED",
    executiveObjectId: null,
    rejectedInferences: REJECTED,
  };
}

function findConcept(concepts: readonly BusinessProjectConcept[], name: string): BusinessProjectConcept | null {
  return concepts.find((concept) => conceptMatchesName(concept, name)) ?? null;
}

export function resolveBusinessProjectRelationships(input: ResolveBusinessProjectRelationshipInput): BusinessProjectRelationshipProjection {
  const present = input.concepts.filter(established);
  const omitted = input.concepts.filter((concept) => !established(concept)).map((concept) => `${concept.conceptId}:not-established`);
  const managerEntries = input.managerConfirmedRelationships ?? [];
  const contrary = managerEntries.filter((entry) => entry.stance === "CONTRARY");
  const affirmed = managerEntries.filter((entry) => entry.stance === "AFFIRMS");
  const raw: BusinessProjectConceptRelationship[] = [];

  for (const definition of BUSINESS_PROJECT_RELATIONSHIP_REGISTRY) {
    if (!contextAllows(definition, input.context.contextKind)) continue;
    const from = present.find((concept) => conceptMatchesName(concept, definition.from));
    const to = present.find((concept) => conceptMatchesName(concept, definition.to));
    if (!from || !to || from.conceptId === to.conceptId) continue;
    if (!crossSourceAllowed(definition, from, to, input.context.contextKind)) {
      omitted.push(`${definition.registryId}:cross-source-blocked`);
      continue;
    }
    const blocked = contrary.some((entry) => relationshipEndpointKey(entry.fromMeaning) === relationshipEndpointKey(definition.from) && relationshipEndpointKey(entry.toMeaning) === relationshipEndpointKey(definition.to));
    raw.push(instantiate(from, to, definition, input.context.contextId, { suppressed: blocked, orgSpecific: false, managerRef: blocked ? contrary[0]?.sourceRef ?? null : null }));
  }

  for (const entry of affirmed) {
    const from = findConcept(present, entry.fromMeaning) ?? literalTarget(entry.fromMeaning, entry.sourceRef);
    const to = findConcept(present, entry.toMeaning) ?? literalTarget(entry.toMeaning, entry.sourceRef);
    const definition: BusinessProjectRelationshipDefinition = {
      registryId: `manager:${relationshipEndpointKey(entry.fromMeaning)}:${relationshipEndpointKey(entry.toMeaning)}`,
      from: entry.fromMeaning,
      to: entry.toMeaning,
      relationshipType: entry.relationshipType,
      directionality: "CONTEXTUAL",
      scope: "ORGANIZATION",
      contexts: input.context.contextKind === "UNKNOWN" ? ["BUSINESS"] : input.context.contextKind === "HYBRID" ? ["HYBRID"] : [input.context.contextKind],
      families: [],
      confidence: "KNOWN",
      crossSource: "NEVER",
    };
    raw.push(instantiate(from, to, definition, input.context.contextId, { suppressed: false, orgSpecific: true, managerRef: entry.sourceRef }));
  }

  const byPair = new Map<string, BusinessProjectConceptRelationship[]>();
  for (const edge of raw) {
    const key = pairKey(edge.fromConceptId, edge.toConceptId);
    byPair.set(key, [...(byPair.get(key) ?? []), edge]);
  }
  const collapsed: BusinessProjectConceptRelationship[] = [];
  const strongerPreferred: string[] = [];
  for (const edges of byPair.values()) {
    const ranked = [...edges].sort((left, right) => precedenceIndex(left.relationshipType) - precedenceIndex(right.relationshipType) || left.relationshipId.localeCompare(right.relationshipId));
    const kept: BusinessProjectConceptRelationship[] = [];
    for (const edge of ranked) {
      const winner = kept[0];
      if (winner && edge.scope === "GENERAL" && winner.scope === "GENERAL" && (winner.relationshipType === "MEASURE_OF" || winner.relationshipType === "PART_OF") && edge.relationshipType === "RELEVANT_TO") {
        strongerPreferred.push(`${edge.fromCanonicalMeaning}:${edge.relationshipType}:${edge.toCanonicalMeaning}`);
        continue;
      }
      kept.push(edge);
    }
    collapsed.push(...kept);
  }

  const unique = [...new Map(collapsed.map((entry) => [entry.relationshipId, entry])).values()]
    .sort((left, right) => left.relationshipId.localeCompare(right.relationshipId));

  const unknownPairs: UnknownConceptPair[] = [];
  for (let i = 0; i < present.length; i += 1) {
    for (let j = i + 1; j < present.length; j += 1) {
      const left = present[i]!;
      const right = present[j]!;
      const related = unique.some((edge) =>
        (edge.fromConceptId === left.conceptId && edge.toConceptId === right.conceptId)
        || (edge.fromConceptId === right.conceptId && edge.toConceptId === left.conceptId)
        || (edge.directionality === "SYMMETRIC" && edge.fromCanonicalMeaning === meaningOf(right) && edge.toCanonicalMeaning === meaningOf(left))
      );
      if (related) continue;
      unknownPairs.push({
        fromCanonicalMeaning: meaningOf(left),
        toCanonicalMeaning: meaningOf(right),
        state: "UNKNOWN",
        reason: "no registry or manager-confirmed relationship supports this pair",
      });
    }
  }

  void strongerPreferred;
  return deepFreeze({
    authority: businessProjectRelationshipIntelligenceIdentity,
    contextId: input.context.contextId,
    relationships: unique,
    unknownPairs: unknownPairs.sort((left, right) => `${left.fromCanonicalMeaning}:${left.toCanonicalMeaning}`.localeCompare(`${right.fromCanonicalMeaning}:${right.toCanonicalMeaning}`)),
    omitted: [...new Set(omitted)].sort(),
  });
}

export function diagnoseBusinessProjectRelationships(projection: BusinessProjectRelationshipProjection): BusinessProjectRelationshipDiagnostics {
  const compared = [...new Set(projection.relationships.flatMap((entry) => [entry.fromCanonicalMeaning, entry.toCanonicalMeaning]))];
  return deepFreeze({
    contextId: projection.contextId,
    comparedConcepts: compared.sort(),
    relationshipTrace: projection.relationships.map((entry) => `${entry.fromCanonicalMeaning}:${entry.relationshipType}:${entry.toCanonicalMeaning}:${entry.directionality}:causal=${entry.causal}:scope=${entry.scope}`),
    selectedWhy: projection.relationships.map((entry) => `${entry.relationshipId}:${entry.knowledgeScopes.join(",")}:${entry.confidence}`),
    omitted: [...projection.omitted],
    unknownPairs: projection.unknownPairs.map((entry) => `${entry.fromCanonicalMeaning}|${entry.toCanonicalMeaning}`),
    strongerRelationsPreferred: projection.relationships.filter((entry) => entry.relationshipType === "MEASURE_OF" || entry.relationshipType === "PART_OF").map((entry) => entry.relationshipType),
    causalityRejected: true,
    dependencyRejectedUnlessConfirmed: true,
    sourceLeakagePrevented: projection.omitted.some((item) => item.includes("cross-source-blocked")),
    reusedAuthorities: [
      "BCA:1/BusinessProjectContextFoundation",
      "BCA:2/BusinessProjectConceptIntelligence",
      "BCA:3/BusinessProjectRelationshipRegistry",
    ],
    causalInference: "NONE",
    mutatesAuthorities: false,
  });
}
