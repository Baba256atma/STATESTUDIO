/**
 * DKL-7:4 — Knowledge Services Validation Evidence.
 *
 * Exactly forty-eight immutable evidence records — one primary evidence per rule.
 * Derived from canonical Model / Registry / Foundation references only.
 *
 * Ownership: owned exclusively by DKL-7:4.
 */

import {
  getKnowledgeServicesModelInventoryCount,
  getKnowledgeServicesModelSummary,
  KnowledgeServicesContextModels,
  KnowledgeServicesModel,
  KnowledgeServicesModelId,
  KnowledgeServicesModelRelationships,
  KnowledgeServicesModelStatus,
  KnowledgeServicesModelVersion,
  KnowledgeServicesRequestModels,
  KnowledgeServicesResponseModels,
  KnowledgeServicesResultModels,
} from "./knowledgeServicesModel.ts";
import type { KnowledgeServicesValidationEvidence as ValidationEvidenceRecord } from "./knowledgeServicesValidationTypes.ts";

const model = KnowledgeServicesModel;
const registry = model.registry;
const foundation = registry.foundation;
const summary = getKnowledgeServicesModelSummary();

const evidence = (
  evidenceId: string,
  name: string,
  subject: string,
  observedValue: string,
  sourceReference: string,
  deterministicOrder: number,
): ValidationEvidenceRecord =>
  Object.freeze({
    evidenceId,
    name,
    subject,
    observedValue,
    sourceReference,
    metadataOnly: true as const,
    runtimeLog: false as const,
    networkResponse: false as const,
    databaseQuery: false as const,
    sourceScanning: false as const,
    deterministicOrder,
  });

const sectionOrder = Object.freeze([
  "identity",
  "metadata",
  "registry",
  "requests",
  "responses",
  "results",
  "contexts",
  "references",
  "relationships",
  "inventory",
  "guarantees",
  "status",
] as const);

const modelKeys = Object.keys(model);
const sectionIndexes = sectionOrder.map((section) => modelKeys.indexOf(section));
const sectionOrderExact = sectionIndexes.every(
  (index, i) =>
    index >= 0 && (i === 0 || index > (sectionIndexes[i - 1] as number)),
);

const requestCategoryIds = new Set(registry.requestCategories.map((c) => c.id));
const responseCategoryIds = new Set(
  registry.responseCategories.map((c) => c.id),
);
const serviceIds = new Set(registry.services.map((s) => s.id));
const capabilityIds = new Set(registry.capabilities.map((c) => c.id));
const contractIds = new Set(registry.contracts.map((c) => c.id));
const accessModeIds = new Set(registry.accessModes.map((m) => m.id));

const allRequestsAlignedCategories = KnowledgeServicesRequestModels.every((r) =>
  requestCategoryIds.has(r.requestCategoryReference),
);
const allRequestsAlignedServices = KnowledgeServicesRequestModels.every(
  (r) =>
    serviceIds.has(r.serviceReference) &&
    capabilityIds.has(r.capabilityReference),
);
const allRequestsAlignedContracts = KnowledgeServicesRequestModels.every(
  (r) =>
    contractIds.has(r.contractReference) &&
    accessModeIds.has(r.accessModeReference),
);
const allRequestsReadOnly = KnowledgeServicesRequestModels.every(
  (r) =>
    r.readOnly === true &&
    r.mutationAllowed === false &&
    r.executable === false &&
    r.hasHandler === false,
);

const allResponsesAlignedCategories = KnowledgeServicesResponseModels.every(
  (r) => responseCategoryIds.has(r.responseCategoryReference),
);
const expectedOutcomes = Object.freeze([
  "Available",
  "PartiallyAvailable",
  "Unavailable",
  "Ambiguous",
  "NotFound",
  "Restricted",
  "InvalidRequestMetadata",
] as const);
const outcomesMatch = KnowledgeServicesResponseModels.every(
  (r) =>
    r.architecturalOutcomeVocabulary.length === expectedOutcomes.length &&
    expectedOutcomes.every((o) => r.architecturalOutcomeVocabulary.includes(o)),
);
const responsesTransportNeutral = KnowledgeServicesResponseModels.every(
  (r) =>
    r.transportAware === false &&
    r.hasSerializer === false &&
    r.hasHandler === false &&
    r.readOnly === true,
);

const resultIds = KnowledgeServicesResultModels.map((r) => r.modelId);
const resultIdsUnique = new Set(resultIds).size === resultIds.length;
const graphPath = KnowledgeServicesResultModels.find(
  (r) => r.resultKind === "GraphPath",
);
const timeline = KnowledgeServicesResultModels.find(
  (r) => r.resultKind === "Timeline",
);
const summaryResult = KnowledgeServicesResultModels.find(
  (r) => r.resultKind === "KnowledgeSummary",
);
const resolution = KnowledgeServicesResultModels.find(
  (r) => r.resultKind === "ReferenceResolution",
);
const discovery = KnowledgeServicesResultModels.find(
  (r) => r.resultKind === "Discovery",
);
const evidenceResult = KnowledgeServicesResultModels.find(
  (r) => r.resultKind === "Evidence",
);

const staticGraphTimeline =
  graphPath?.algorithmic === false && timeline?.repositoryAccess === false;
const noAiInference =
  summaryResult?.aiBehavior === false &&
  resolution?.aiBehavior === false &&
  resolution?.algorithmic === false &&
  discovery?.executable === false &&
  evidenceResult?.algorithmic === false;

const envelopeSafe =
  KnowledgeServicesResponseModels.every(
    (r) =>
      r.resultEnvelopeReference === "DKL-7:3/Result/ServiceResultEnvelope",
  ) &&
  model.guarantees.noResultAccessesRepository === true &&
  model.guarantees.modelsAreTransportNeutral === true &&
  model.guarantees.modelsArePersistenceNeutral === true &&
  model.repositoryAccess === false &&
  model.runtimeBehavior === false;

const contextKinds = KnowledgeServicesContextModels.map((c) => c.contextKind);
const contextInventoryExact =
  KnowledgeServicesContextModels.length === 4 &&
  contextKinds.includes("Consumer") &&
  contextKinds.includes("Scope") &&
  contextKinds.includes("Provenance") &&
  contextKinds.includes("Trace");

const businessObjectRef = model.references.find(
  (r) => r.referenceKind === "BusinessObject",
);
const referenceInventorySafe =
  model.references.length === 8 &&
  businessObjectRef?.ownsReferencedEntity === false;

const graphKinds = model.contexts.graphModels.map((g) => g.graphKind);
const graphSupportingExact =
  model.contexts.graphModels.length === 3 &&
  graphKinds.includes("Neighborhood") &&
  graphKinds.includes("Direction") &&
  graphKinds.includes("PathScope") &&
  model.contexts.graphModels.every(
    (g) => g.algorithmic === false && g.traversable === false,
  );

const traceCount = KnowledgeServicesModelRelationships.filter(
  (r) => r.relationshipKind === "RequestTrace",
).length;
const structuralCount = KnowledgeServicesModelRelationships.filter(
  (r) => r.relationshipKind !== "RequestTrace",
).length;

const requiredOwns = Object.freeze([
  "Knowledge Service contracts",
  "Knowledge Service metadata",
  "Service capability declarations",
  "Knowledge access vocabulary",
  "Read-only service boundaries",
  "Service lifecycle definitions",
] as const);

const ownsExact =
  registry.ownership.ownedCount === 6 &&
  requiredOwns.every((item) =>
    registry.ownership.foundationOwns.includes(item),
  );

const requiredNonOwns = Object.freeze([
  "Repository implementation",
  "Persistence",
  "Database",
  "Search engine",
  "Graph engine",
  "Caching",
  "Transport",
  "Authentication",
  "Authorization",
  "NEA",
  "Executive Engine",
  "Advisor",
  "Scene",
  "Business Object creation",
  "Planning",
  "Decision making",
  "Execution",
] as const);

const nonOwnsPreserved =
  registry.ownership.nonOwnedCount === 24 &&
  requiredNonOwns.every((item) =>
    registry.ownership.foundationDoesNotOwn.includes(item),
  );

const prohibitedSurfaces = foundation.boundaries.prohibitedSurfaces;
const prohibitedCount = prohibitedSurfaces.length;

const boundaryLeakagePrevented =
  model.repositoryAccess === false &&
  model.searchExecution === false &&
  model.graphTraversal === false &&
  model.aiBehavior === false &&
  model.performsExecutiveReasoning === false &&
  model.runtimeBehavior === false &&
  model.guarantees.noMutationModeExists === true &&
  model.guarantees.businessObjectsReferencedNotOwned === true;

const mutationModesForbidden = Object.freeze([
  "create",
  "update",
  "delete",
  "execute",
  "mutate",
  "persist",
  "approve",
  "decide",
  "plan",
  "orchestrate",
] as const);

const accessModeSafe =
  registry.accessModes.length === 10 &&
  summary.mutationModeCount === 0 &&
  registry.accessModes.every((m) => m.mutationAllowed === false) &&
  registry.inventory.prohibitedMutationModes.length === 10 &&
  mutationModesForbidden.every((mode) =>
    registry.inventory.prohibitedMutationModes.includes(mode),
  );

const inventoryCounts =
  model.inventory.requestModelCount === 12 &&
  model.inventory.responseModelCount === 12 &&
  model.inventory.resultModelCount === 12 &&
  model.inventory.contextModelCount === 4 &&
  model.inventory.referenceModelCount === 8 &&
  model.inventory.graphModelCount === 3 &&
  model.inventory.relationshipCount === 28 &&
  model.inventory.totalEntryCount === 79 &&
  getKnowledgeServicesModelInventoryCount() === 79;

const guaranteeCount = Object.keys(model.guarantees).length;

const previousPhaseByReference =
  model.registry === registry &&
  registry.foundation === foundation &&
  model.identity.foundationId === foundation.foundationId;

const noServiceRuntime =
  model.serviceExecution === false &&
  model.runtimeBehavior === false &&
  KnowledgeServicesRequestModels.every((r) => r.hasHandler === false) &&
  KnowledgeServicesResponseModels.every((r) => r.hasHandler === false) &&
  KnowledgeServicesResultModels.every((r) => r.executable === false);

const noInfrastructureRuntime =
  model.metadataOnly === true &&
  model.guarantees.modelsAreTransportNeutral === true &&
  model.guarantees.modelsArePersistenceNeutral === true &&
  model.runtimeBehavior === false;

/** Observed architectural facts used by rule evaluation. */
export const KnowledgeServicesValidationObservations = Object.freeze({
  validationIdExpected: "DKL-7:4/KnowledgeServicesValidation",
  validationVersionExpected: "1.0.0",
  validationStageExpected: "Validation",
  modelId: KnowledgeServicesModelId,
  modelVersion: KnowledgeServicesModelVersion,
  modelStatus: KnowledgeServicesModelStatus,
  modelReadiness: model.readiness,
  registryId: registry.identity.registryId,
  foundationId: foundation.foundationId,
  sectionOrderExact,
  inventoryCounts,
  guaranteeCount,
  ownedCount: registry.ownership.ownedCount,
  nonOwnedCount: registry.ownership.nonOwnedCount,
  ownsExact,
  nonOwnsPreserved,
  prohibitedCount,
  serviceCount: registry.services.length,
  capabilityCount: registry.capabilities.length,
  contractCount: registry.contracts.length,
  requestCategoryCount: registry.requestCategories.length,
  responseCategoryCount: registry.responseCategories.length,
  accessModeSafe,
  requestCount: KnowledgeServicesRequestModels.length,
  allRequestsAlignedCategories,
  allRequestsAlignedServices,
  allRequestsAlignedContracts,
  allRequestsReadOnly,
  responseCount: KnowledgeServicesResponseModels.length,
  allResponsesAlignedCategories,
  outcomesMatch,
  responsesTransportNeutral,
  resultCount: KnowledgeServicesResultModels.length,
  resultIdsUnique,
  staticGraphTimeline,
  noAiInference,
  envelopeSafe,
  contextInventoryExact,
  referenceInventorySafe,
  graphSupportingExact,
  relationshipCount: KnowledgeServicesModelRelationships.length,
  traceCount,
  structuralCount,
  boundaryLeakagePrevented,
  previousPhaseByReference,
  noServiceRuntime,
  noInfrastructureRuntime,
  modelFrozen: Object.isFrozen(model),
  requestsFrozen: Object.isFrozen(KnowledgeServicesRequestModels),
  responsesFrozen: Object.isFrozen(KnowledgeServicesResponseModels),
  resultsFrozen: Object.isFrozen(KnowledgeServicesResultModels),
  relationshipsFrozen: Object.isFrozen(KnowledgeServicesModelRelationships),
  dependencyDeclarations: Object.freeze({
    directPreviousPhaseModule: "knowledgeServicesModel.ts" as const,
    modelOnly: true as const,
    registryDirectImport: false as const,
    foundationDirectImport: false as const,
    dkl6DirectImport: false as const,
    registryReachedThroughModel: true as const,
    foundationReachedThroughRegistry: true as const,
  }),
});

/** Exactly forty-eight evidence records aligned to the forty-eight rules. */
export const KnowledgeServicesValidationEvidence: readonly ValidationEvidenceRecord[] =
  Object.freeze([
    evidence("KS-V-EV-001", "Validation Identity Constants", "Validation", "DKL-7:4/KnowledgeServicesValidation@1.0.0/Validation", "DKL-7:4/Identity", 1),
    evidence("KS-V-EV-002", "Model Identity", "Model", `${KnowledgeServicesModelId}@${KnowledgeServicesModelVersion}`, KnowledgeServicesModelId, 2),
    evidence("KS-V-EV-003", "Registry Identity Through Model", "Registry", registry.identity.registryId, `${KnowledgeServicesModelId}.registry`, 3),
    evidence("KS-V-EV-004", "Foundation Identity Through Registry", "Foundation", foundation.foundationId, `${KnowledgeServicesModelId}.registry.foundation`, 4),
    evidence("KS-V-EV-005", "Model-Only Direct Dependency", "Dependency", "knowledgeServicesModel.ts", "DKL-7:4/Dependency", 5),
    evidence("KS-V-EV-006", "No Direct Registry Dependency", "Dependency", "registryReachedThroughModel=true", "DKL-7:4/Dependency", 6),
    evidence("KS-V-EV-007", "No Direct Foundation Dependency", "Dependency", "foundationReachedThroughRegistry=true", "DKL-7:4/Dependency", 7),
    evidence("KS-V-EV-008", "No Direct Repository Dependency", "Dependency", "dkl6DirectImport=false", "DKL-7:4/Dependency", 8),
    evidence("KS-V-EV-009", "Foundation Ownership Inventory", "Foundation.ownership", `owns=${registry.ownership.ownedCount};doesNotOwn=${registry.ownership.nonOwnedCount}`, `${foundation.foundationId}.ownership`, 9),
    evidence("KS-V-EV-010", "Foundation Boundary Inventory", "Foundation.boundaries", `prohibited=${prohibitedCount}`, `${foundation.foundationId}.boundaries`, 10),
    evidence("KS-V-EV-011", "Registry Service Inventory", "Registry.services", String(registry.services.length), `${registry.identity.registryId}.services`, 11),
    evidence("KS-V-EV-012", "Registry Capability Inventory", "Registry.capabilities", String(registry.capabilities.length), `${registry.identity.registryId}.capabilities`, 12),
    evidence("KS-V-EV-013", "Registry Contract Inventory", "Registry.contracts", String(registry.contracts.length), `${registry.identity.registryId}.contracts`, 13),
    evidence("KS-V-EV-014", "Request and Response Categories", "Registry.categories", `request=${registry.requestCategories.length};response=${registry.responseCategories.length}`, `${registry.identity.registryId}.categories`, 14),
    evidence("KS-V-EV-015", "Access Mode Safety", "Registry.accessModes", `modes=${registry.accessModes.length};mutation=${summary.mutationModeCount}`, `${registry.identity.registryId}.accessModes`, 15),
    evidence("KS-V-EV-016", "Canonical Section Order", "Model.sections", sectionOrder.join(","), KnowledgeServicesModelId, 16),
    evidence("KS-V-EV-017", "Canonical Inventory Total", "Model.inventory", String(model.inventory.totalEntryCount), `${KnowledgeServicesModelId}.inventory`, 17),
    evidence("KS-V-EV-018", "Inventory Counting Rule", "Model.inventory", "12+12+12+4+8+3+28=79", `${KnowledgeServicesModelId}.inventory.countingRule`, 18),
    evidence("KS-V-EV-019", "Model Guarantee Inventory", "Model.guarantees", String(guaranteeCount), `${KnowledgeServicesModelId}.guarantees`, 19),
    evidence("KS-V-EV-020", "Request Model Count", "Model.requests", String(KnowledgeServicesRequestModels.length), `${KnowledgeServicesModelId}.requests`, 20),
    evidence("KS-V-EV-021", "Request Category Alignment", "Model.requests", String(allRequestsAlignedCategories), `${KnowledgeServicesModelId}.requests`, 21),
    evidence("KS-V-EV-022", "Service and Capability Alignment", "Model.requests", String(allRequestsAlignedServices), `${KnowledgeServicesModelId}.requests`, 22),
    evidence("KS-V-EV-023", "Contract and Access Alignment", "Model.requests", String(allRequestsAlignedContracts), `${KnowledgeServicesModelId}.requests`, 23),
    evidence("KS-V-EV-024", "Request Mutation Prohibition", "Model.requests", String(allRequestsReadOnly), `${KnowledgeServicesModelId}.requests`, 24),
    evidence("KS-V-EV-025", "Response Model Count", "Model.responses", String(KnowledgeServicesResponseModels.length), `${KnowledgeServicesModelId}.responses`, 25),
    evidence("KS-V-EV-026", "Response Category Alignment", "Model.responses", String(allResponsesAlignedCategories), `${KnowledgeServicesModelId}.responses`, 26),
    evidence("KS-V-EV-027", "Architectural Outcome Vocabulary", "Model.responses", expectedOutcomes.join(","), `${KnowledgeServicesModelId}.responses`, 27),
    evidence("KS-V-EV-028", "Transport Neutrality", "Model.responses", String(responsesTransportNeutral), `${KnowledgeServicesModelId}.responses`, 28),
    evidence("KS-V-EV-029", "Result Model Count", "Model.results", String(KnowledgeServicesResultModels.length), `${KnowledgeServicesModelId}.results`, 29),
    evidence("KS-V-EV-030", "Result Identity Uniqueness", "Model.results", String(resultIdsUnique), `${KnowledgeServicesModelId}.results`, 30),
    evidence("KS-V-EV-031", "Static Graph and Timeline Models", "Model.results", String(staticGraphTimeline), `${KnowledgeServicesModelId}.results`, 31),
    evidence("KS-V-EV-032", "No AI or Inference Behavior", "Model.results", String(noAiInference), `${KnowledgeServicesModelId}.results`, 32),
    evidence("KS-V-EV-033", "Result Envelope Safety", "Model.responses.envelope", String(envelopeSafe), "DKL-7:3/Result/ServiceResultEnvelope", 33),
    evidence("KS-V-EV-034", "Context Inventory", "Model.contexts", contextKinds.join(","), `${KnowledgeServicesModelId}.contexts`, 34),
    evidence("KS-V-EV-035", "Reference Inventory", "Model.references", `count=${model.references.length};ownsBO=${businessObjectRef?.ownsReferencedEntity === false}`, `${KnowledgeServicesModelId}.references`, 35),
    evidence("KS-V-EV-036", "Graph Supporting Inventory", "Model.contexts.graphModels", graphKinds.join(","), `${KnowledgeServicesModelId}.contexts.graphModels`, 36),
    evidence("KS-V-EV-037", "Relationship Count", "Model.relationships", String(KnowledgeServicesModelRelationships.length), `${KnowledgeServicesModelId}.relationships`, 37),
    evidence("KS-V-EV-038", "Request Trace Chains", "Model.relationships", String(traceCount), `${KnowledgeServicesModelId}.relationships`, 38),
    evidence("KS-V-EV-039", "Structural Bindings", "Model.relationships", String(structuralCount), `${KnowledgeServicesModelId}.relationships`, 39),
    evidence("KS-V-EV-040", "Knowledge Services Ownership", "Foundation.ownership.owns", registry.ownership.foundationOwns.join("|"), `${foundation.foundationId}.ownership.owns`, 40),
    evidence("KS-V-EV-041", "Non-Ownership Preservation", "Foundation.ownership.doesNotOwn", `count=${registry.ownership.nonOwnedCount}`, `${foundation.foundationId}.ownership.doesNotOwn`, 41),
    evidence("KS-V-EV-042", "Prohibited Surface Preservation", "Foundation.boundaries", String(prohibitedCount), `${foundation.foundationId}.boundaries`, 42),
    evidence("KS-V-EV-043", "Boundary Leakage Prevention", "Model.guarantees", String(boundaryLeakagePrevented), KnowledgeServicesModelId, 43),
    evidence("KS-V-EV-044", "Canonical Collection Immutability", "Model/collections", `modelFrozen=${Object.isFrozen(model)}`, KnowledgeServicesModelId, 44),
    evidence("KS-V-EV-045", "Previous-Phase Reference Preservation", "Model.registry/foundation", String(previousPhaseByReference), KnowledgeServicesModelId, 45),
    evidence("KS-V-EV-046", "No Service Runtime", "Model.runtime", String(noServiceRuntime), KnowledgeServicesModelId, 46),
    evidence("KS-V-EV-047", "No Infrastructure Runtime", "Model.runtime", String(noInfrastructureRuntime), KnowledgeServicesModelId, 47),
    evidence("KS-V-EV-048", "Ready for Manifest Preconditions", "Validation.readiness", `status=${KnowledgeServicesModelStatus};readiness=${model.readiness}`, KnowledgeServicesModelId, 48),
  ]);

export const KNOWLEDGE_SERVICES_VALIDATION_EVIDENCE_COUNT =
  KnowledgeServicesValidationEvidence.length;
