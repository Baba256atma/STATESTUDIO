import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectSourceRef } from "./businessProjectContextContract.ts";
import type { BusinessProjectContextKind } from "./businessProjectContextContract.ts";
import {
  businessProjectProcessContextIdentity,
  type BusinessProjectProcessContextDiagnostics,
  type BusinessProjectProcessContextProjection,
  type BusinessProjectProcessPlacement,
  type ManagerConfirmedProcessContext,
  type ResolveBusinessProjectProcessContextInput,
} from "./businessProjectProcessContextContract.ts";
import {
  PROJECT_WORK_REFERENCE_SEQUENCE,
  findProcessContextDefinitions,
  processConceptKey,
  type BusinessProjectProcessContextDefinition,
} from "./businessProjectProcessContextRegistry.ts";

const REJECTED = Object.freeze([
  "process context does not establish a process instance",
  "process context is not process mining",
  "process context is not workflow execution",
  "project work phase is not CC:11 Execution",
  "process output is not a Nexora Outcome",
  "process area is not an executive Object",
  "reference sequence is not observed sequence",
  "process position is not dependency",
  "process position is not causality",
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

function contextAllows(definition: BusinessProjectProcessContextDefinition, contextKind: BusinessProjectContextKind): boolean {
  if (contextKind === "UNKNOWN") return false;
  if (contextKind === "HYBRID") return true;
  return definition.contextKind === contextKind;
}

function instantiate(
  concept: BusinessProjectConcept,
  definition: BusinessProjectProcessContextDefinition,
  relationshipIds: readonly string[],
  extras: Readonly<{ orgSpecific: boolean; suppressed: boolean; managerRef: BusinessProjectSourceRef | null }>,
): BusinessProjectProcessPlacement {
  return {
    authority: businessProjectProcessContextIdentity,
    processContextId: `bca4:${concept.conceptId}:${definition.registryId}${extras.orgSpecific ? ":org" : ""}`,
    contextKind: definition.contextKind,
    conceptIds: [concept.conceptId],
    canonicalMeaning: meaningOf(concept),
    relationshipIds,
    processFamily: definition.processAreas[0] ?? definition.projectControlAreas[0] ?? definition.projectWorkPhases[0] ?? null,
    processAreas: definition.processAreas,
    projectWorkPhases: definition.projectWorkPhases,
    projectControlAreas: definition.projectControlAreas,
    participationTypes: definition.participationTypes,
    evidence: [`bca2:${concept.conceptId}`, `bca4-registry:${definition.registryId}`],
    provenance: uniqueRefs([...concept.sourceRefs, ...(extras.managerRef ? [extras.managerRef] : [])]),
    confidence: extras.orgSpecific ? "MANAGER_CONFIRMED" : "KNOWN",
    confirmationState: extras.orgSpecific ? "MANAGER_CONFIRMED" : concept.confirmationState,
    sourceRefs: uniqueRefs([...concept.sourceRefs, ...(extras.managerRef ? [extras.managerRef] : [])]),
    scope: extras.orgSpecific ? "ORGANIZATION" : "GENERAL",
    knowledgeScopes: extras.orgSpecific ? ["ORGANIZATION_SPECIFIC"] : ["GENERAL"],
    temporalStatus: "GENERAL",
    currentRealityEstablished: false,
    processInstanceEstablished: false,
    observedSequenceEstablished: false,
    nexoraExecutionEntityId: null,
    nexoraCanonicalExecutionRuntime: "CC:11/CanonicalExecution",
    nexoraOutcomeId: null,
    executiveObjectId: null,
    ambiguity: { preserved: extras.suppressed, note: extras.suppressed ? "organization-specific process placement outranks general knowledge for current reasoning" : null },
    suppressedForCurrentContext: extras.suppressed,
    rejectedInferences: [...REJECTED],
  };
}

function orgDefinition(entry: ManagerConfirmedProcessContext): BusinessProjectProcessContextDefinition {
  return {
    registryId: `manager:${processConceptKey(entry.conceptMeaning)}`,
    concept: entry.conceptMeaning,
    contextKind: entry.scope === "PROJECT" ? "PROJECT" : "BUSINESS",
    processAreas: entry.processAreas,
    projectWorkPhases: entry.projectWorkPhases ?? [],
    projectControlAreas: entry.projectControlAreas ?? [],
    participationTypes: entry.participationTypes ?? ["ASSOCIATED_WITH_PROCESS"],
  };
}

export function resolveBusinessProjectProcessContext(input: ResolveBusinessProjectProcessContextInput): BusinessProjectProcessContextProjection {
  const present = input.concepts.filter(established);
  const manager = input.managerConfirmedProcessContexts ?? [];
  const unknownConcepts = present
    .filter((concept) => findProcessContextDefinitions(meaningOf(concept)).length === 0 && !manager.some((entry) => processConceptKey(entry.conceptMeaning) === processConceptKey(meaningOf(concept))))
    .map((concept) => meaningOf(concept));
  const affirmed = manager.filter((entry) => entry.stance === "AFFIRMS");
  const contrary = manager.filter((entry) => entry.stance === "CONTRARY");
  const placements: BusinessProjectProcessPlacement[] = [];

  for (const concept of present) {
    const relatedIds = (input.relationships ?? [])
      .filter((edge) => edge.fromConceptId === concept.conceptId || edge.toConceptId === concept.conceptId)
      .map((edge) => edge.relationshipId);
    const defs = findProcessContextDefinitions(meaningOf(concept)).filter((definition) => contextAllows(definition, input.context.contextKind));
    for (const definition of defs) {
      const blocked = contrary.some((entry) => processConceptKey(entry.conceptMeaning) === processConceptKey(meaningOf(concept)));
      placements.push(instantiate(concept, definition, relatedIds, { orgSpecific: false, suppressed: blocked, managerRef: blocked ? contrary[0]?.sourceRef ?? null : null }));
    }
  }

  for (const entry of affirmed) {
    const concept = present.find((item) => processConceptKey(meaningOf(item)) === processConceptKey(entry.conceptMeaning));
    if (!concept) continue;
    placements.push(instantiate(concept, orgDefinition(entry), [], { orgSpecific: true, suppressed: false, managerRef: entry.sourceRef }));
  }

  const unique = [...new Map(placements.map((entry) => [entry.processContextId, entry])).values()]
    .sort((left, right) => left.processContextId.localeCompare(right.processContextId));

  return deepFreeze({
    authority: businessProjectProcessContextIdentity,
    contextId: input.context.contextId,
    placements: unique,
    unknownConcepts: [...new Set(unknownConcepts)].sort(),
    referenceSequence: {
      kind: "REFERENCE_SEQUENCE",
      steps: [...PROJECT_WORK_REFERENCE_SEQUENCE],
      observedSequence: "UNKNOWN",
      dependencyInferred: false,
      causal: false,
    },
    processMiningPerformed: false,
    workflowMutated: false,
  });
}

export function diagnoseBusinessProjectProcessContext(projection: BusinessProjectProcessContextProjection): BusinessProjectProcessContextDiagnostics {
  return deepFreeze({
    contextId: projection.contextId,
    evaluatedConcepts: [...new Set(projection.placements.map((entry) => entry.canonicalMeaning).filter((value): value is string => Boolean(value)))].sort(),
    placementTrace: projection.placements.map((entry) => `${entry.canonicalMeaning}:${entry.processAreas.join("+")}:${entry.projectWorkPhases.join("+")}:${entry.projectControlAreas.join("+")}:instance=${entry.processInstanceEstablished}`),
    selectedWhy: projection.placements.map((entry) => `${entry.processContextId}:${entry.knowledgeScopes.join(",")}:${entry.scope}`),
    processInstanceEstablished: false,
    observedSequenceInferred: false,
    dependencyRejected: true,
    causalityRejected: true,
    sourceLeakagePrevented: true,
    objectMutationAttempted: false,
    nexoraExecutionConfused: false,
    reusedAuthorities: [
      "BCA:1/BusinessProjectContextFoundation",
      "BCA:2/BusinessProjectConceptIntelligence",
      "BCA:3/BusinessProjectRelationshipIntelligence",
    ],
    causalInference: "NONE",
    mutatesAuthorities: false,
  });
}
