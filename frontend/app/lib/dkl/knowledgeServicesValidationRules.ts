/**
 * DKL-7:4 — Knowledge Services Validation Rules.
 *
 * Exactly forty-eight deterministic architecture validation rules.
 * Status values are precomputed from canonical Model inventories and evidence.
 * No runtime callbacks or executable predicates.
 *
 * Ownership: owned exclusively by DKL-7:4.
 */

import {
  KnowledgeServicesValidationEvidence,
  KnowledgeServicesValidationObservations as O,
} from "./knowledgeServicesValidationEvidence.ts";
import type {
  KnowledgeServicesValidationRule,
  KnowledgeServicesValidationRuleId,
  KnowledgeServicesValidationRuleStatus,
  KnowledgeServicesValidationSeverity,
  KnowledgeServicesValidationGroupId,
} from "./knowledgeServicesValidationTypes.ts";

export const KnowledgeServicesValidationId =
  "DKL-7:4/KnowledgeServicesValidation" as const;

export const KnowledgeServicesValidationName =
  "Knowledge Services Validation" as const;

export const KnowledgeServicesValidationVersion = "1.0.0" as const;

export const KnowledgeServicesValidationNamespace =
  "nexora.dkl.knowledge-services.validation" as const;

export const KnowledgeServicesValidationStatus =
  "ValidationComplete" as const;

const evidenceRef = (evidenceId: string, role = "primary") =>
  Object.freeze({ evidenceId, role });

const pass = (condition: boolean): KnowledgeServicesValidationRuleStatus =>
  condition ? "Pass" : "Fail";

const rule = (
  ruleId: KnowledgeServicesValidationRuleId,
  name: string,
  description: string,
  group: KnowledgeServicesValidationGroupId,
  severity: KnowledgeServicesValidationSeverity,
  subject: string,
  expectedCondition: string,
  actualEvidence: string,
  status: KnowledgeServicesValidationRuleStatus,
  evidenceId: string,
  failureImpact: string,
  deterministicOrder: number,
): KnowledgeServicesValidationRule =>
  Object.freeze({
    ruleId,
    name,
    description,
    group,
    severity,
    subject,
    expectedCondition,
    actualEvidence,
    status,
    evidenceReferences: Object.freeze([evidenceRef(evidenceId)]),
    failureImpact,
    readinessRelevance: true as const,
    runtimeCallback: false as const,
    executablePredicate: false as const,
    metadataOnly: true as const,
    deterministicOrder,
  });

const evidenceByOrder = (order: number): string =>
  KnowledgeServicesValidationEvidence.find((e) => e.deterministicOrder === order)
    ?.evidenceId ?? `KS-V-EV-${String(order).padStart(3, "0")}`;

const identityRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-ID-001",
    "Validation Identity",
    "Validation ID, version, and stage match the canonical Validation identity.",
    "Identity",
    "Critical",
    KnowledgeServicesValidationId,
    "DKL-7:4/KnowledgeServicesValidation; version 1.0.0; stage Validation",
    `${KnowledgeServicesValidationId}; ${KnowledgeServicesValidationVersion}; Validation`,
    pass(
      KnowledgeServicesValidationId === "DKL-7:4/KnowledgeServicesValidation" &&
        KnowledgeServicesValidationVersion === "1.0.0",
    ),
    evidenceByOrder(1),
    "Invalid Validation identity blocks Manifest readiness.",
    1,
  ),
  rule(
    "KS-V-ID-002",
    "Model Identity Reference",
    "Canonical Model identity and version are preserved.",
    "Identity",
    "Critical",
    O.modelId,
    "DKL-7:3/KnowledgeServicesModel; version 1.0.0",
    `${O.modelId}; ${O.modelVersion}`,
    pass(
      O.modelId === "DKL-7:3/KnowledgeServicesModel" &&
        O.modelVersion === "1.0.0",
    ),
    evidenceByOrder(2),
    "Model identity mismatch invalidates Validation.",
    2,
  ),
  rule(
    "KS-V-ID-003",
    "Registry Identity Reachability",
    "Registry identity is reachable through KnowledgeServicesModel.registry.",
    "Identity",
    "Critical",
    O.registryId,
    "DKL-7:2/KnowledgeServicesRegistry",
    O.registryId,
    pass(O.registryId === "DKL-7:2/KnowledgeServicesRegistry"),
    evidenceByOrder(3),
    "Registry unreachable through Model blocks Validation.",
    3,
  ),
  rule(
    "KS-V-ID-004",
    "Foundation Identity Reachability",
    "Foundation identity is reachable through Model.registry.foundation.",
    "Identity",
    "Critical",
    O.foundationId,
    "DKL-7:1/KnowledgeServicesFoundation",
    O.foundationId,
    pass(O.foundationId === "DKL-7:1/KnowledgeServicesFoundation"),
    evidenceByOrder(4),
    "Foundation unreachable through Registry blocks Validation.",
    4,
  ),
]);

const dependencyRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-DEP-001",
    "Model-Only Direct Dependency",
    "Validation consumes the canonical Model as its only previous-phase direct dependency.",
    "Dependency",
    "Critical",
    "DKL-7:4/Dependency",
    "directPreviousPhaseModule=knowledgeServicesModel.ts; modelOnly=true",
    `module=${O.dependencyDeclarations.directPreviousPhaseModule}; modelOnly=${O.dependencyDeclarations.modelOnly}`,
    pass(
      O.dependencyDeclarations.directPreviousPhaseModule ===
        "knowledgeServicesModel.ts" && O.dependencyDeclarations.modelOnly,
    ),
    evidenceByOrder(5),
    "Additional previous-phase direct dependencies violate architecture.",
    5,
  ),
  rule(
    "KS-V-DEP-002",
    "No Direct Registry Dependency",
    "Registry is consumed through Model reference only.",
    "Dependency",
    "Critical",
    "DKL-7:4/Dependency",
    "registryDirectImport=false; registryReachedThroughModel=true",
    `direct=${O.dependencyDeclarations.registryDirectImport}; throughModel=${O.dependencyDeclarations.registryReachedThroughModel}`,
    pass(
      O.dependencyDeclarations.registryDirectImport === false &&
        O.dependencyDeclarations.registryReachedThroughModel,
    ),
    evidenceByOrder(6),
    "Direct Registry import bypasses Model surface.",
    6,
  ),
  rule(
    "KS-V-DEP-003",
    "No Direct Foundation Dependency",
    "Foundation is consumed through Model → Registry only.",
    "Dependency",
    "Critical",
    "DKL-7:4/Dependency",
    "foundationDirectImport=false; foundationReachedThroughRegistry=true",
    `direct=${O.dependencyDeclarations.foundationDirectImport}; throughRegistry=${O.dependencyDeclarations.foundationReachedThroughRegistry}`,
    pass(
      O.dependencyDeclarations.foundationDirectImport === false &&
        O.dependencyDeclarations.foundationReachedThroughRegistry,
    ),
    evidenceByOrder(7),
    "Direct Foundation import bypasses Registry chain.",
    7,
  ),
  rule(
    "KS-V-DEP-004",
    "No Direct Repository Dependency",
    "No DKL-6 internal or Repository implementation dependency is introduced.",
    "Dependency",
    "Critical",
    "DKL-7:4/Dependency",
    "dkl6DirectImport=false",
    `dkl6DirectImport=${O.dependencyDeclarations.dkl6DirectImport}`,
    pass(O.dependencyDeclarations.dkl6DirectImport === false),
    evidenceByOrder(8),
    "Direct DKL-6 dependency violates Knowledge Services boundaries.",
    8,
  ),
]);

const foundationRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-FND-001",
    "Foundation Ownership Inventory",
    "Foundation ownership inventory remains owns=6 and doesNotOwn=24.",
    "Foundation",
    "Critical",
    "Foundation.ownership",
    "owned=6; non-owned=24; required owns preserved",
    `owned=${O.ownedCount}; nonOwned=${O.nonOwnedCount}; ownsExact=${O.ownsExact}`,
    pass(O.ownedCount === 6 && O.nonOwnedCount === 24 && O.ownsExact),
    evidenceByOrder(9),
    "Ownership inventory drift breaks Foundation guarantees.",
    9,
  ),
  rule(
    "KS-V-FND-002",
    "Foundation Boundary Inventory",
    "Exactly 29 prohibited surfaces remain preserved.",
    "Foundation",
    "Critical",
    "Foundation.boundaries",
    "prohibitedSurfaceCount=29",
    `prohibited=${O.prohibitedCount}`,
    pass(O.prohibitedCount === 29),
    evidenceByOrder(10),
    "Boundary inventory drift allows prohibited surfaces.",
    10,
  ),
]);

const registryRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-REG-001",
    "Service Inventory",
    "Exactly 12 registered services are preserved.",
    "Registry",
    "Critical",
    "Registry.services",
    "12",
    String(O.serviceCount),
    pass(O.serviceCount === 12),
    evidenceByOrder(11),
    "Service inventory mismatch breaks Registry alignment.",
    11,
  ),
  rule(
    "KS-V-REG-002",
    "Capability Inventory",
    "Exactly 12 registered capabilities are preserved.",
    "Registry",
    "Critical",
    "Registry.capabilities",
    "12",
    String(O.capabilityCount),
    pass(O.capabilityCount === 12),
    evidenceByOrder(12),
    "Capability inventory mismatch breaks Registry alignment.",
    12,
  ),
  rule(
    "KS-V-REG-003",
    "Contract Inventory",
    "Exactly 11 registered contracts are preserved.",
    "Registry",
    "Critical",
    "Registry.contracts",
    "11",
    String(O.contractCount),
    pass(O.contractCount === 11),
    evidenceByOrder(13),
    "Contract inventory mismatch breaks Registry alignment.",
    13,
  ),
  rule(
    "KS-V-REG-004",
    "Request and Response Categories",
    "Request and response categories remain 12 each.",
    "Registry",
    "Critical",
    "Registry.categories",
    "request=12; response=12",
    `request=${O.requestCategoryCount}; response=${O.responseCategoryCount}`,
    pass(O.requestCategoryCount === 12 && O.responseCategoryCount === 12),
    evidenceByOrder(14),
    "Category inventory mismatch breaks Model alignment.",
    14,
  ),
  rule(
    "KS-V-REG-005",
    "Access Mode Safety",
    "Exactly 10 read-only access modes exist and mutation modes remain 0.",
    "Registry",
    "Critical",
    "Registry.accessModes",
    "accessModes=10; mutationModes=0; prohibited mutation vocabulary preserved",
    `accessModeSafe=${O.accessModeSafe}`,
    pass(O.accessModeSafe),
    evidenceByOrder(15),
    "Mutation access modes violate Knowledge Services read-only architecture.",
    15,
  ),
]);

const modelStructureRules: readonly KnowledgeServicesValidationRule[] =
  Object.freeze([
    rule(
      "KS-V-MOD-001",
      "Canonical Section Order",
      "Model preserves the exact canonical section order.",
      "ModelStructure",
      "Critical",
      "Model.sections",
      "identity,metadata,registry,requests,responses,results,contexts,references,relationships,inventory,guarantees,status",
      `sectionOrderExact=${O.sectionOrderExact}`,
      pass(O.sectionOrderExact),
      evidenceByOrder(16),
      "Section order drift breaks Model contract.",
      16,
    ),
    rule(
      "KS-V-MOD-002",
      "Canonical Inventory Total",
      "Total canonical Model inventory is exactly 79.",
      "ModelStructure",
      "Critical",
      "Model.inventory",
      "79",
      `inventoryCounts=${O.inventoryCounts}`,
      pass(O.inventoryCounts),
      evidenceByOrder(17),
      "Inventory total mismatch blocks Manifest.",
      17,
    ),
    rule(
      "KS-V-MOD-003",
      "Inventory Counting Rule",
      "Counting rule 12+12+12+4+8+3+28 equals 79.",
      "ModelStructure",
      "Critical",
      "Model.inventory.countingRule",
      "12+12+12+4+8+3+28=79",
      `inventoryCounts=${O.inventoryCounts}`,
      pass(O.inventoryCounts),
      evidenceByOrder(18),
      "Counting-rule drift invalidates Model inventory.",
      18,
    ),
    rule(
      "KS-V-MOD-004",
      "Model Guarantee Inventory",
      "Exactly 20 immutable Model guarantees are preserved.",
      "ModelStructure",
      "Critical",
      "Model.guarantees",
      "20",
      String(O.guaranteeCount),
      pass(O.guaranteeCount === 20),
      evidenceByOrder(19),
      "Guarantee inventory drift weakens Model safety.",
      19,
    ),
  ]);

const requestRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-REQ-001",
    "Request Model Count",
    "Exactly 12 request models are registered.",
    "RequestModels",
    "Critical",
    "Model.requests",
    "12",
    String(O.requestCount),
    pass(O.requestCount === 12),
    evidenceByOrder(20),
    "Request model count mismatch breaks Model inventory.",
    20,
  ),
  rule(
    "KS-V-REQ-002",
    "Request Category Alignment",
    "Every request model references one of the 12 registered request categories.",
    "RequestModels",
    "Critical",
    "Model.requests",
    "all requestCategoryReference values resolve",
    String(O.allRequestsAlignedCategories),
    pass(O.allRequestsAlignedCategories),
    evidenceByOrder(21),
    "Unaligned request categories break Registry alignment.",
    21,
  ),
  rule(
    "KS-V-REQ-003",
    "Service and Capability Alignment",
    "Every request model references a valid registered service and capability.",
    "RequestModels",
    "Critical",
    "Model.requests",
    "all service and capability references resolve",
    String(O.allRequestsAlignedServices),
    pass(O.allRequestsAlignedServices),
    evidenceByOrder(22),
    "Unaligned service/capability references break Registry alignment.",
    22,
  ),
  rule(
    "KS-V-REQ-004",
    "Contract and Access Alignment",
    "Every request model references a valid contract and approved read-only access mode.",
    "RequestModels",
    "Critical",
    "Model.requests",
    "all contract and access-mode references resolve",
    String(O.allRequestsAlignedContracts),
    pass(O.allRequestsAlignedContracts),
    evidenceByOrder(23),
    "Unaligned contract/access-mode references break Registry alignment.",
    23,
  ),
  rule(
    "KS-V-REQ-005",
    "Request Mutation Prohibition",
    "Request models contain no supported mutation or execution semantics.",
    "RequestModels",
    "Critical",
    "Model.requests",
    "readOnly=true; mutationAllowed=false; executable=false; hasHandler=false",
    String(O.allRequestsReadOnly),
    pass(O.allRequestsReadOnly),
    evidenceByOrder(24),
    "Mutation semantics in requests violate Knowledge Services architecture.",
    24,
  ),
]);

const responseRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-RES-001",
    "Response Model Count",
    "Exactly 12 response models are registered.",
    "ResponseModels",
    "Critical",
    "Model.responses",
    "12",
    String(O.responseCount),
    pass(O.responseCount === 12),
    evidenceByOrder(25),
    "Response model count mismatch breaks Model inventory.",
    25,
  ),
  rule(
    "KS-V-RES-002",
    "Response Category Alignment",
    "Every response model references a registered response category.",
    "ResponseModels",
    "Critical",
    "Model.responses",
    "all responseCategoryReference values resolve",
    String(O.allResponsesAlignedCategories),
    pass(O.allResponsesAlignedCategories),
    evidenceByOrder(26),
    "Unaligned response categories break Registry alignment.",
    26,
  ),
  rule(
    "KS-V-RES-003",
    "Architectural Outcome Vocabulary",
    "Approved architectural outcomes are deterministic and transport-neutral.",
    "ResponseModels",
    "High",
    "Model.responses.outcomes",
    "Available,PartiallyAvailable,Unavailable,Ambiguous,NotFound,Restricted,InvalidRequestMetadata",
    String(O.outcomesMatch),
    pass(O.outcomesMatch),
    evidenceByOrder(27),
    "Outcome vocabulary drift introduces transport semantics risk.",
    27,
  ),
  rule(
    "KS-V-RES-004",
    "Transport Neutrality",
    "Response models contain no runtime HTTP, serializer, endpoint, or network behavior.",
    "ResponseModels",
    "Critical",
    "Model.responses",
    "transportAware=false; hasSerializer=false; hasHandler=false; readOnly=true",
    String(O.responsesTransportNeutral),
    pass(O.responsesTransportNeutral),
    evidenceByOrder(28),
    "Transport-specific response behavior violates architecture.",
    28,
  ),
]);

const resultRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-RSL-001",
    "Result Model Count",
    "Exactly 12 primary result models are registered.",
    "ResultModels",
    "Critical",
    "Model.results",
    "12",
    String(O.resultCount),
    pass(O.resultCount === 12),
    evidenceByOrder(29),
    "Result model count mismatch breaks Model inventory.",
    29,
  ),
  rule(
    "KS-V-RSL-002",
    "Result Identity Uniqueness",
    "Every result model ID is unique.",
    "ResultModels",
    "Critical",
    "Model.results",
    "unique result model IDs",
    String(O.resultIdsUnique),
    pass(O.resultIdsUnique),
    evidenceByOrder(30),
    "Duplicate result IDs break Model determinism.",
    30,
  ),
  rule(
    "KS-V-RSL-003",
    "Static Graph and Timeline Models",
    "Graph Path Result has no traversal algorithm; Timeline Result has no runtime date processing.",
    "ResultModels",
    "Critical",
    "Model.results",
    "graph.algorithmic=false; timeline.repositoryAccess=false",
    String(O.staticGraphTimeline),
    pass(O.staticGraphTimeline === true),
    evidenceByOrder(31),
    "Algorithmic graph/timeline behavior violates Model constraints.",
    31,
  ),
  rule(
    "KS-V-RSL-004",
    "No AI or Inference Behavior",
    "Summary, resolution, discovery, and evidence results contain no AI/inference/search/scoring behavior.",
    "ResultModels",
    "Critical",
    "Model.results",
    "aiBehavior=false; algorithmic=false; executable=false for prohibited result kinds",
    String(O.noAiInference),
    pass(O.noAiInference === true),
    evidenceByOrder(32),
    "AI or inference behavior violates Knowledge Services Model.",
    32,
  ),
  rule(
    "KS-V-RSL-005",
    "Result Envelope Safety",
    "Canonical result envelope remains read-only, metadata-only, and free from runtime payload processing.",
    "ResultModels",
    "Critical",
    "DKL-7:3/Result/ServiceResultEnvelope",
    "envelope referenced; repository/transport/persistence neutral; no runtime payload processing",
    String(O.envelopeSafe),
    pass(O.envelopeSafe),
    evidenceByOrder(33),
    "Unsafe result envelope introduces runtime payload processing.",
    33,
  ),
]);

const contextRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-CTX-001",
    "Context Inventory",
    "Exactly 4 context models exist: Consumer, Scope, Provenance, Trace.",
    "ContextAndReferenceModels",
    "Critical",
    "Model.contexts",
    "Consumer,Scope,Provenance,Trace",
    String(O.contextInventoryExact),
    pass(O.contextInventoryExact),
    evidenceByOrder(34),
    "Context inventory mismatch breaks Model inventory.",
    34,
  ),
  rule(
    "KS-V-CTX-002",
    "Reference Inventory",
    "Exactly 8 reference models exist; Business Object references do not transfer ownership.",
    "ContextAndReferenceModels",
    "Critical",
    "Model.references",
    "referenceCount=8; ownsReferencedEntity=false for BusinessObject",
    String(O.referenceInventorySafe),
    pass(O.referenceInventorySafe),
    evidenceByOrder(35),
    "Reference ownership transfer violates DKL ownership boundaries.",
    35,
  ),
  rule(
    "KS-V-CTX-003",
    "Graph Supporting Inventory",
    "Exactly 3 graph supporting models exist as metadata only.",
    "ContextAndReferenceModels",
    "Critical",
    "Model.contexts.graphModels",
    "Neighborhood,Direction,PathScope; algorithmic=false; traversable=false",
    String(O.graphSupportingExact),
    pass(O.graphSupportingExact),
    evidenceByOrder(36),
    "Graph supporting inventory drift introduces traversal risk.",
    36,
  ),
]);

const relationshipRules: readonly KnowledgeServicesValidationRule[] =
  Object.freeze([
    rule(
      "KS-V-REL-001",
      "Relationship Count",
      "Exactly 28 model relationships are registered.",
      "Relationships",
      "Critical",
      "Model.relationships",
      "28",
      String(O.relationshipCount),
      pass(O.relationshipCount === 28),
      evidenceByOrder(37),
      "Relationship count mismatch breaks Model inventory.",
      37,
    ),
    rule(
      "KS-V-REL-002",
      "Request Trace Chains",
      "Exactly 12 request trace chains are preserved.",
      "Relationships",
      "Critical",
      "Model.relationships",
      "RequestTrace count=12",
      String(O.traceCount),
      pass(O.traceCount === 12),
      evidenceByOrder(38),
      "Missing request traces break architectural traceability.",
      38,
    ),
    rule(
      "KS-V-REL-003",
      "Structural Bindings",
      "Exactly 16 structural Registry/result/reference relationships exist.",
      "Relationships",
      "Critical",
      "Model.relationships",
      "structural count=16",
      String(O.structuralCount),
      pass(O.structuralCount === 16),
      evidenceByOrder(39),
      "Structural binding drift breaks Model relationships.",
      39,
    ),
  ]);

const ownershipRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-OWN-001",
    "Knowledge Services Ownership",
    "DKL-7 owns only the six approved Knowledge Services responsibilities.",
    "Ownership",
    "Critical",
    "Foundation.ownership.owns",
    "6 approved owns declarations",
    String(O.ownsExact),
    pass(O.ownsExact),
    evidenceByOrder(40),
    "Ownership expansion violates DKL-7 boundaries.",
    40,
  ),
  rule(
    "KS-V-OWN-002",
    "Non-Ownership Preservation",
    "All 24 canonical non-owned declarations remain preserved.",
    "Ownership",
    "Critical",
    "Foundation.ownership.doesNotOwn",
    "nonOwnedCount=24; required non-owns preserved",
    `nonOwned=${O.nonOwnedCount}; preserved=${O.nonOwnsPreserved}`,
    pass(O.nonOwnedCount === 24 && O.nonOwnsPreserved),
    evidenceByOrder(41),
    "Non-ownership drift transfers prohibited responsibilities into DKL-7.",
    41,
  ),
]);

const boundaryRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-BND-001",
    "Prohibited Surface Preservation",
    "All 29 Foundation prohibited surfaces remain preserved.",
    "Boundaries",
    "Critical",
    "Foundation.boundaries",
    "29",
    String(O.prohibitedCount),
    pass(O.prohibitedCount === 29),
    evidenceByOrder(42),
    "Missing prohibited surfaces weaken architectural boundaries.",
    42,
  ),
  rule(
    "KS-V-BND-002",
    "Boundary Leakage Prevention",
    "Model does not claim repository, search, graph, AI, Engine, Advisor, Scene, or UI implementation.",
    "Boundaries",
    "Critical",
    "Model.guarantees",
    "no repository/search/graph/AI/engine runtime claims",
    String(O.boundaryLeakagePrevented),
    pass(O.boundaryLeakagePrevented),
    evidenceByOrder(43),
    "Boundary leakage introduces prohibited implementation surfaces.",
    43,
  ),
]);

const immutabilityRules: readonly KnowledgeServicesValidationRule[] =
  Object.freeze([
    rule(
      "KS-V-IMM-001",
      "Canonical Collection Immutability",
      "Canonical Model collections are frozen according to project conventions.",
      "Immutability",
      "Critical",
      "Model/collections",
      "model and canonical collections frozen",
      `model=${O.modelFrozen}; requests=${O.requestsFrozen}; responses=${O.responsesFrozen}; results=${O.resultsFrozen}; relationships=${O.relationshipsFrozen}`,
      pass(
        O.modelFrozen &&
          O.requestsFrozen &&
          O.responsesFrozen &&
          O.resultsFrozen &&
          O.relationshipsFrozen,
      ),
      evidenceByOrder(44),
      "Mutable collections break deterministic Validation.",
      44,
    ),
    rule(
      "KS-V-IMM-002",
      "Previous-Phase Reference Preservation",
      "Model, Registry, and Foundation are preserved by canonical reference.",
      "Immutability",
      "Critical",
      "Model.registry/foundation",
      "previous phases by reference, not reconstructed",
      String(O.previousPhaseByReference),
      pass(O.previousPhaseByReference),
      evidenceByOrder(45),
      "Reconstructed previous phases break canonical reference integrity.",
      45,
    ),
  ]);

const runtimeRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-RUN-001",
    "No Service Runtime",
    "Validation and Model introduce no handlers, executors, dispatch, or query execution.",
    "RuntimeProhibitions",
    "Critical",
    "Model.runtime",
    "serviceExecution=false; no handlers/executors",
    String(O.noServiceRuntime),
    pass(O.noServiceRuntime),
    evidenceByOrder(46),
    "Service runtime behavior violates Validation principles.",
    46,
  ),
  rule(
    "KS-V-RUN-002",
    "No Infrastructure Runtime",
    "Validation and Model introduce no networking, databases, queues, telemetry, reflection, or dynamic imports.",
    "RuntimeProhibitions",
    "Critical",
    "Model.runtime",
    "transport/persistence neutral; runtimeBehavior=false",
    String(O.noInfrastructureRuntime),
    pass(O.noInfrastructureRuntime),
    evidenceByOrder(47),
    "Infrastructure runtime behavior violates Validation principles.",
    47,
  ),
]);

const rulesBeforeReadiness: readonly KnowledgeServicesValidationRule[] =
  Object.freeze([
    ...identityRules,
    ...dependencyRules,
    ...foundationRules,
    ...registryRules,
    ...modelStructureRules,
    ...requestRules,
    ...responseRules,
    ...resultRules,
    ...contextRules,
    ...relationshipRules,
    ...ownershipRules,
    ...boundaryRules,
    ...immutabilityRules,
    ...runtimeRules,
  ]);

const priorAllPass = rulesBeforeReadiness.every((r) => r.status === "Pass");
const readinessPass =
  priorAllPass &&
  O.modelStatus === "ModelComplete" &&
  O.modelReadiness === "ReadyForValidation" &&
  KnowledgeServicesValidationStatus === "ValidationComplete";

const readinessRules: readonly KnowledgeServicesValidationRule[] = Object.freeze([
  rule(
    "KS-V-RDY-001",
    "Ready for Manifest",
    "All prior rules pass and Validation is ReadyForManifest.",
    "Readiness",
    "Critical",
    "Validation.readiness",
    "47 prior rules Pass; ModelComplete; ReadyForValidation; ValidationComplete",
    `priorAllPass=${priorAllPass}; modelStatus=${O.modelStatus}; modelReadiness=${O.modelReadiness}`,
    pass(readinessPass),
    evidenceByOrder(48),
    "Any failed prior rule blocks Manifest readiness.",
    48,
  ),
]);

/** Exactly forty-eight canonical validation rules. */
export const KnowledgeServicesValidationRules: readonly KnowledgeServicesValidationRule[] =
  Object.freeze([...rulesBeforeReadiness, ...readinessRules]);

export const KNOWLEDGE_SERVICES_VALIDATION_RULE_COUNT =
  KnowledgeServicesValidationRules.length;
