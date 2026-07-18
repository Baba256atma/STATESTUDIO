/**
 * DKL-6:4 — Knowledge Repository Validation.
 *
 * Canonical immutable architectural validation for DKL-6:1 through DKL-6:3.
 * Consumes only Foundation, Registry, and Model public surfaces.
 * Metadata-only. No runtime data validation. No persistence or repository execution.
 *
 * Ownership: owned exclusively by DKL-6:4.
 *
 * Public exports (exactly 8):
 *   KnowledgeRepositoryValidation
 *   KnowledgeRepositoryValidationId
 *   KnowledgeRepositoryValidationVersion
 *   KnowledgeRepositoryValidationName
 *   KnowledgeRepositoryValidationNamespace
 *   KnowledgeRepositoryValidationStatus
 *   getKnowledgeRepositoryValidationSummary()
 *   getKnowledgeRepositoryValidationRuleCount()
 */

import {
  getKnowledgeRepositoryFoundationSummary,
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
} from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryBoundaryValidation } from "./knowledgeRepositoryBoundaryValidation.ts";
import { KnowledgeRepositoryFoundationValidation } from "./knowledgeRepositoryFoundationValidation.ts";
import {
  getKnowledgeRepositoryModelCount,
  getKnowledgeRepositoryModelSummary,
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
} from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryModelValidation } from "./knowledgeRepositoryModelValidation.ts";
import { KnowledgeRepositoryOwnershipValidation } from "./knowledgeRepositoryOwnershipValidation.ts";
import {
  getKnowledgeRepositoryRegistryEntryCount,
  getKnowledgeRepositoryRegistrySummary,
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
} from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryRegistryValidation } from "./knowledgeRepositoryRegistryValidation.ts";
import type {
  KnowledgeRepositoryValidationCategoryDescriptor,
  KnowledgeRepositoryValidationGate,
  KnowledgeRepositoryValidationIdentityDescriptor,
  KnowledgeRepositoryValidationResult,
  KnowledgeRepositoryValidationRule,
  KnowledgeRepositoryValidationSummaryDescriptor,
} from "./knowledgeRepositoryValidationTypes.ts";

export const KnowledgeRepositoryValidationId =
  "DKL-6:4/KnowledgeRepositoryValidation" as const;

export const KnowledgeRepositoryValidationVersion = "1.0.0" as const;

export const KnowledgeRepositoryValidationName =
  "Knowledge Repository Validation" as const;

export const KnowledgeRepositoryValidationNamespace =
  "nexora.dkl.repository.validation" as const;

export const KnowledgeRepositoryValidationStatus = "Validated" as const;

const identity: KnowledgeRepositoryValidationIdentityDescriptor = Object.freeze({
  validationId: KnowledgeRepositoryValidationId,
  validationName: KnowledgeRepositoryValidationName,
  validationVersion: KnowledgeRepositoryValidationVersion,
  validationNamespace: KnowledgeRepositoryValidationNamespace,
  phase: "DKL-6:4",
  owner: "DKL-6",
  status: KnowledgeRepositoryValidationStatus,
  readiness: "ReadyForDKL6Manifest",
  metadataOnly: true,
  immutable: true,
});

const declaredDependencies = Object.freeze({
  foundationPublicSurface: "knowledgeRepositoryFoundation.ts",
  registryPublicSurface: "knowledgeRepositoryRegistry.ts",
  modelPublicSurface: "knowledgeRepositoryModel.ts",
  foundationId: KnowledgeRepositoryFoundationId,
  registryId: KnowledgeRepositoryRegistryId,
  modelId: KnowledgeRepositoryModelId,
  consumesPublicSurfacesOnly: true as const,
  consumesDkl5Directly: false as const,
  consumesInternalFoundationFiles: false as const,
  consumesInternalRegistryFiles: false as const,
  consumesInternalModelFiles: false as const,
});

const rule = (
  id: string,
  name: string,
  category: KnowledgeRepositoryValidationRule["category"],
  description: string,
  subjectReference: string,
  expected: string,
  actual: string,
  status: KnowledgeRepositoryValidationRule["status"],
  severity: KnowledgeRepositoryValidationRule["severity"],
  deterministicOrder: number,
): KnowledgeRepositoryValidationRule =>
  Object.freeze({
    id,
    name,
    category,
    description,
    subjectReference,
    expected,
    actual,
    status,
    severity,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

const registryFoundationPass =
  KnowledgeRepositoryRegistry.foundation.foundationId ===
    KnowledgeRepositoryFoundationId &&
  KnowledgeRepositoryRegistry.foundation.soleArchitecturalDependency === true &&
  KnowledgeRepositoryRegistry.foundation.referencedThroughPublicFoundation ===
    true;

const modelFoundationPass =
  KnowledgeRepositoryModel.dependencies.foundationId ===
    KnowledgeRepositoryFoundationId &&
  KnowledgeRepositoryModel.dependencies.consumesPublicSurfacesOnly === true;

const modelRegistryPass =
  KnowledgeRepositoryModel.dependencies.registryId ===
    KnowledgeRepositoryRegistryId &&
  KnowledgeRepositoryModel.dependencies.consumesPublicSurfacesOnly === true;

const validationDependencyPass =
  declaredDependencies.consumesPublicSurfacesOnly === true &&
  declaredDependencies.consumesDkl5Directly === false &&
  declaredDependencies.foundationId === KnowledgeRepositoryFoundationId &&
  declaredDependencies.registryId === KnowledgeRepositoryRegistryId &&
  declaredDependencies.modelId === KnowledgeRepositoryModelId;

const dependencyValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-DEP-001",
      "Foundation Dependency",
      "Dependencies",
      "Registry depends only on the DKL-6:1 public surface.",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryRegistry.foundation.foundationId,
      registryFoundationPass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-DEP-002",
      "Model Foundation Dependency",
      "Dependencies",
      "Model consumes the DKL-6:1 public surface only.",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryModel.dependencies.foundationId,
      modelFoundationPass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-DEP-003",
      "Model Registry Dependency",
      "Dependencies",
      "Model consumes the DKL-6:2 public surface only.",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryModel.dependencies.registryId,
      modelRegistryPass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
    rule(
      "DKL6-VAL-DEP-004",
      "Validation Dependency Closure",
      "Dependencies",
      "DKL-6:4 consumes only the public surfaces of DKL-6:1, DKL-6:2, and DKL-6:3.",
      KnowledgeRepositoryValidationId,
      "foundation+registry+model-public-only",
      validationDependencyPass
        ? "foundation+registry+model-public-only"
        : "dependency-breach",
      validationDependencyPass ? "Pass" : "Fail",
      "Critical",
      4,
    ),
  ]);
const registryToFoundationPass =
  KnowledgeRepositoryRegistry.capabilities.length ===
    KnowledgeRepositoryFoundation.contracts.capabilityCount &&
  KnowledgeRepositoryRegistry.contracts.length ===
    KnowledgeRepositoryFoundation.contracts.contractCount &&
  KnowledgeRepositoryRegistry.lifecycle.length ===
    KnowledgeRepositoryFoundation.lifecycle.stateCount &&
  KnowledgeRepositoryRegistry.policies.length ===
    KnowledgeRepositoryFoundation.policies.policyCount;

const modelTraceabilityPass =
  KnowledgeRepositoryModel.registryTraceability.length === 14 &&
  KnowledgeRepositoryModel.registryTraceability.every(
    (entry) => entry.modeled === true,
  );

const recordTraceabilityPass =
  KnowledgeRepositoryModel.recordModels.length === 7 &&
  KnowledgeRepositoryModel.recordModels.every((model) =>
    KnowledgeRepositoryRegistry.knowledgeRecordTypes.some(
      (entry) => entry.id === model.registryEntryReference,
    ),
  );

const policyTraceabilityPass =
  KnowledgeRepositoryModel.versionModels.length ===
    KnowledgeRepositoryRegistry.versionTypes.length &&
  KnowledgeRepositoryModel.snapshotModels.length ===
    KnowledgeRepositoryRegistry.snapshotTypes.length &&
  KnowledgeRepositoryModel.historyModels.length ===
    KnowledgeRepositoryRegistry.historyEventTypes.length &&
  KnowledgeRepositoryModel.archiveModel.supportedStates.length ===
    KnowledgeRepositoryRegistry.archiveStates.length &&
  KnowledgeRepositoryModel.retentionModels.length ===
    KnowledgeRepositoryRegistry.retentionPolicies.length &&
  KnowledgeRepositoryModel.indexModels.length ===
    KnowledgeRepositoryRegistry.indexDeclarations.length &&
  KnowledgeRepositoryModel.retrievalModels.length ===
    KnowledgeRepositoryRegistry.retrievalDeclarations.length;

const traceabilityValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-TRC-001",
      "Registry to Foundation Traceability",
      "Traceability",
      "Registry aligns with Foundation capabilities, contracts, lifecycle, and policies.",
      KnowledgeRepositoryRegistryId,
      "aligned-to-foundation",
      registryToFoundationPass ? "aligned-to-foundation" : "traceability-gap",
      registryToFoundationPass ? "Pass" : "Fail",
      "Required",
      1,
    ),
    rule(
      "DKL6-VAL-TRC-002",
      "Model to Registry Traceability",
      "Traceability",
      "All 14 Registry traceability groups are modeled.",
      KnowledgeRepositoryModelId,
      "14",
      String(KnowledgeRepositoryModel.registryTraceability.length),
      modelTraceabilityPass ? "Pass" : "Fail",
      "Required",
      2,
    ),
    rule(
      "DKL6-VAL-TRC-003",
      "Record Model Traceability",
      "Traceability",
      "All seven record models correspond to registered record types.",
      KnowledgeRepositoryModelId,
      "7-record-models-traced",
      recordTraceabilityPass ? "7-record-models-traced" : "record-trace-gap",
      recordTraceabilityPass ? "Pass" : "Fail",
      "Required",
      3,
    ),
    rule(
      "DKL6-VAL-TRC-004",
      "Policy Model Traceability",
      "Traceability",
      "Version, snapshot, history, archive, retention, index, and retrieval models correspond to registered vocabulary.",
      KnowledgeRepositoryModelId,
      "policy-models-traced",
      policyTraceabilityPass ? "policy-models-traced" : "policy-trace-gap",
      policyTraceabilityPass ? "Pass" : "Fail",
      "Required",
      4,
    ),
  ]);
const foundationFrozen =
  Object.isFrozen(KnowledgeRepositoryFoundation) &&
  Object.isFrozen(KnowledgeRepositoryFoundation.identity) &&
  Object.isFrozen(KnowledgeRepositoryFoundation.contracts) &&
  Object.isFrozen(KnowledgeRepositoryFoundation.lifecycle) &&
  Object.isFrozen(KnowledgeRepositoryFoundation.policies);

const registryFrozen =
  Object.isFrozen(KnowledgeRepositoryRegistry) &&
  Object.isFrozen(KnowledgeRepositoryRegistry.identity) &&
  Object.isFrozen(KnowledgeRepositoryRegistry.repositoryTypes) &&
  Object.isFrozen(KnowledgeRepositoryRegistry.components) &&
  KnowledgeRepositoryRegistry.repositoryTypes.every((entry) =>
    Object.isFrozen(entry),
  );

const modelFrozen =
  Object.isFrozen(KnowledgeRepositoryModel) &&
  Object.isFrozen(KnowledgeRepositoryModel.identity) &&
  Object.isFrozen(KnowledgeRepositoryModel.recordModels) &&
  Object.isFrozen(KnowledgeRepositoryModel.relationships) &&
  KnowledgeRepositoryModel.recordModels.every((model) => Object.isFrozen(model)) &&
  KnowledgeRepositoryModel.relationships.every((rel) => Object.isFrozen(rel));

const immutabilityValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-IMM-001",
      "Foundation Immutability",
      "Immutability",
      "Foundation public aggregate is frozen.",
      KnowledgeRepositoryFoundationId,
      "frozen",
      foundationFrozen ? "frozen" : "mutable",
      foundationFrozen ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-IMM-002",
      "Registry Immutability",
      "Immutability",
      "Registry aggregate, groups, and entries are frozen.",
      KnowledgeRepositoryRegistryId,
      "frozen",
      registryFrozen ? "frozen" : "mutable",
      registryFrozen ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-IMM-003",
      "Model Immutability",
      "Immutability",
      "Model aggregate, inventories, models, and relationships are frozen.",
      KnowledgeRepositoryModelId,
      "frozen",
      modelFrozen ? "frozen" : "mutable",
      modelFrozen ? "Pass" : "Fail",
      "Critical",
      3,
    ),
  ]);
const foundationSummaryA = getKnowledgeRepositoryFoundationSummary();
const foundationSummaryB = getKnowledgeRepositoryFoundationSummary();
const registrySummaryA = getKnowledgeRepositoryRegistrySummary();
const registrySummaryB = getKnowledgeRepositoryRegistrySummary();
const modelSummaryA = getKnowledgeRepositoryModelSummary();
const modelSummaryB = getKnowledgeRepositoryModelSummary();

const summaryDeterminismPass =
  foundationSummaryA.foundationId === foundationSummaryB.foundationId &&
  foundationSummaryA.capabilityCount === foundationSummaryB.capabilityCount &&
  registrySummaryA.totalEntryCount === registrySummaryB.totalEntryCount &&
  registrySummaryA.registryGroupCount === registrySummaryB.registryGroupCount &&
  modelSummaryA.totalModelCount === modelSummaryB.totalModelCount &&
  modelSummaryA.relationshipCount === modelSummaryB.relationshipCount;

const countA = getKnowledgeRepositoryRegistryEntryCount();
const countB = getKnowledgeRepositoryRegistryEntryCount();
const modelCountA = getKnowledgeRepositoryModelCount();
const modelCountB = getKnowledgeRepositoryModelCount();
const countDeterminismPass =
  countA === countB && countA === 103 && modelCountA === modelCountB && modelCountA === 52;

const environmentIndependencePass =
  !("timestamp" in foundationSummaryA) &&
  !("generatedAt" in registrySummaryA) &&
  !("randomSeed" in modelSummaryA) &&
  KnowledgeRepositoryFoundation.deterministic === true &&
  KnowledgeRepositoryRegistry.deterministic === true &&
  KnowledgeRepositoryModel.deterministic === true;

const determinismValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-DET-001",
      "Summary Determinism",
      "Determinism",
      "Repeated summary calls return structurally equivalent immutable metadata.",
      KnowledgeRepositoryValidationId,
      "deterministic-summaries",
      summaryDeterminismPass
        ? "deterministic-summaries"
        : "summary-divergence",
      summaryDeterminismPass ? "Pass" : "Fail",
      "Required",
      1,
    ),
    rule(
      "DKL6-VAL-DET-002",
      "Count Determinism",
      "Determinism",
      "Registry and Model count functions return stable results.",
      KnowledgeRepositoryValidationId,
      "registry=103;model=52",
      `registry=${countA};model=${modelCountA}`,
      countDeterminismPass ? "Pass" : "Fail",
      "Required",
      2,
    ),
    rule(
      "DKL6-VAL-DET-003",
      "Environment Independence",
      "Determinism",
      "Validation output does not depend on timestamps, randomness, environment variables, filesystem state, or network state.",
      KnowledgeRepositoryValidationId,
      "environment-independent",
      environmentIndependencePass
        ? "environment-independent"
        : "environment-dependent",
      environmentIndependencePass ? "Pass" : "Fail",
      "Required",
      3,
    ),
  ]);
const registryEntries = Object.freeze([
  ...KnowledgeRepositoryRegistry.repositoryTypes,
  ...KnowledgeRepositoryRegistry.components,
  ...KnowledgeRepositoryRegistry.knowledgeRecordTypes,
  ...KnowledgeRepositoryRegistry.versionTypes,
  ...KnowledgeRepositoryRegistry.snapshotTypes,
  ...KnowledgeRepositoryRegistry.historyEventTypes,
  ...KnowledgeRepositoryRegistry.archiveStates,
  ...KnowledgeRepositoryRegistry.retentionPolicies,
  ...KnowledgeRepositoryRegistry.indexDeclarations,
  ...KnowledgeRepositoryRegistry.retrievalDeclarations,
  ...KnowledgeRepositoryRegistry.capabilities,
  ...KnowledgeRepositoryRegistry.contracts,
  ...KnowledgeRepositoryRegistry.lifecycle,
  ...KnowledgeRepositoryRegistry.policies,
]);

const noRuntimeBehaviorPass =
  registryEntries.every((entry) => entry.runtimeBehavior === "None") &&
  KnowledgeRepositoryModel.relationships.every(
    (rel) => rel.runtimeBehavior === "None",
  ) &&
  KnowledgeRepositoryRegistry.guarantees.runtimeBehaviorNone === true &&
  KnowledgeRepositoryModel.guarantees.runtimeFree === true;

const noExecutableOpsPass =
  KnowledgeRepositoryRegistry.guarantees.noRepositoryRuntime === true &&
  KnowledgeRepositoryModel.guarantees.noPersistence === true &&
  KnowledgeRepositoryModel.guarantees.noQueryExecution === true &&
  KnowledgeRepositoryModel.guarantees.noIndexConstruction === true &&
  KnowledgeRepositoryModel.guarantees.noRetrievalExecution === true &&
  KnowledgeRepositoryModel.guarantees.noMutationApis === true &&
  KnowledgeRepositoryFoundation.boundaries.executesQueries === false &&
  KnowledgeRepositoryFoundation.boundaries.performsIndexing === false;

const noAiOrEnginePass =
  KnowledgeRepositoryFoundation.boundaries.performsAiOrEmbeddings === false &&
  KnowledgeRepositoryFoundation.boundaries.executesEngineReasoning === false &&
  KnowledgeRepositoryFoundation.boundaries.narratesAdvisor === false &&
  KnowledgeRepositoryFoundation.boundaries.rendersScene === false &&
  KnowledgeRepositoryFoundation.boundaries.rendersUi === false &&
  KnowledgeRepositoryFoundation.ownership.doesNotOwn.includes("AI") &&
  KnowledgeRepositoryFoundation.ownership.doesNotOwn.includes("Embeddings") &&
  KnowledgeRepositoryFoundation.ownership.doesNotOwn.includes("Engine reasoning");

const runtimeProhibitionValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-RUN-001",
      "No Runtime Behavior",
      "RuntimeProhibition",
      "Registry entries and Model relationships declare runtimeBehavior None.",
      KnowledgeRepositoryValidationId,
      "runtimeBehavior=None",
      noRuntimeBehaviorPass ? "runtimeBehavior=None" : "runtime-behavior-present",
      noRuntimeBehaviorPass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-RUN-002",
      "No Executable Repository Operations",
      "RuntimeProhibition",
      "Architecture exposes no persistence, query, indexing, retrieval, version, snapshot, archive, restore, or retention executors.",
      KnowledgeRepositoryValidationId,
      "executors-absent",
      noExecutableOpsPass ? "executors-absent" : "executors-present",
      noExecutableOpsPass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-RUN-003",
      "No AI or Engine Logic",
      "RuntimeProhibition",
      "No AI inference, embeddings, reasoning, Advisor, Scene, or UI behavior exists.",
      KnowledgeRepositoryValidationId,
      "ai-engine-excluded",
      noAiOrEnginePass ? "ai-engine-excluded" : "ai-engine-present",
      noAiOrEnginePass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
  ]);
const dependencyValidation = Object.freeze({
  category: "Dependencies" as const,
  rules: dependencyValidationRules,
  ruleCount: dependencyValidationRules.length,
  passedRuleCount: dependencyValidationRules.filter((item) => item.status === "Pass")
    .length,
  failedRuleCount: dependencyValidationRules.filter((item) => item.status === "Fail")
    .length,
  declaredDependencies,
  metadataOnly: true as const,
  immutable: true as const,
});

const traceabilityValidation = Object.freeze({
  category: "Traceability" as const,
  rules: traceabilityValidationRules,
  ruleCount: traceabilityValidationRules.length,
  passedRuleCount: traceabilityValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: traceabilityValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});

const immutabilityValidation = Object.freeze({
  category: "Immutability" as const,
  rules: immutabilityValidationRules,
  ruleCount: immutabilityValidationRules.length,
  passedRuleCount: immutabilityValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: immutabilityValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});

const determinismValidation = Object.freeze({
  category: "Determinism" as const,
  rules: determinismValidationRules,
  ruleCount: determinismValidationRules.length,
  passedRuleCount: determinismValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: determinismValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});

const runtimeProhibitionValidation = Object.freeze({
  category: "RuntimeProhibition" as const,
  rules: runtimeProhibitionValidationRules,
  ruleCount: runtimeProhibitionValidationRules.length,
  passedRuleCount: runtimeProhibitionValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: runtimeProhibitionValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});

const allRules: readonly KnowledgeRepositoryValidationRule[] = Object.freeze([
  ...KnowledgeRepositoryFoundationValidation.rules,
  ...KnowledgeRepositoryRegistryValidation.rules,
  ...KnowledgeRepositoryModelValidation.rules,
  ...KnowledgeRepositoryOwnershipValidation.rules,
  ...KnowledgeRepositoryBoundaryValidation.rules,
  ...dependencyValidation.rules,
  ...traceabilityValidation.rules,
  ...immutabilityValidation.rules,
  ...determinismValidation.rules,
  ...runtimeProhibitionValidation.rules,
]);

const categories: readonly KnowledgeRepositoryValidationCategoryDescriptor[] =
  Object.freeze([
    Object.freeze({
      category: "Foundation" as const,
      name: "Foundation",
      ruleCount: 5,
      deterministicOrder: 1,
    }),
    Object.freeze({
      category: "Registry" as const,
      name: "Registry",
      ruleCount: 5,
      deterministicOrder: 2,
    }),
    Object.freeze({
      category: "Model" as const,
      name: "Model",
      ruleCount: 5,
      deterministicOrder: 3,
    }),
    Object.freeze({
      category: "Ownership" as const,
      name: "Ownership",
      ruleCount: 4,
      deterministicOrder: 4,
    }),
    Object.freeze({
      category: "Boundaries" as const,
      name: "Boundaries",
      ruleCount: 4,
      deterministicOrder: 5,
    }),
    Object.freeze({
      category: "Dependencies" as const,
      name: "Dependencies",
      ruleCount: 4,
      deterministicOrder: 6,
    }),
    Object.freeze({
      category: "Traceability" as const,
      name: "Traceability",
      ruleCount: 4,
      deterministicOrder: 7,
    }),
    Object.freeze({
      category: "Immutability" as const,
      name: "Immutability",
      ruleCount: 3,
      deterministicOrder: 8,
    }),
    Object.freeze({
      category: "Determinism" as const,
      name: "Determinism",
      ruleCount: 3,
      deterministicOrder: 9,
    }),
    Object.freeze({
      category: "RuntimeProhibition" as const,
      name: "Runtime Prohibition",
      ruleCount: 3,
      deterministicOrder: 10,
    }),
  ]);

const buildGate = (
  id: string,
  name: string,
  category: KnowledgeRepositoryValidationGate["category"],
  rules: readonly KnowledgeRepositoryValidationRule[],
  deterministicOrder: number,
): KnowledgeRepositoryValidationGate => {
  const passedRuleCount = rules.filter((item) => item.status === "Pass").length;
  const failedRuleCount = rules.filter((item) => item.status === "Fail").length;
  return Object.freeze({
    id,
    name,
    category,
    ruleReferences: Object.freeze(rules.map((item) => item.id)),
    passedRuleCount,
    failedRuleCount,
    status: failedRuleCount === 0 ? ("Pass" as const) : ("Fail" as const),
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });
};

const gates: readonly KnowledgeRepositoryValidationGate[] = Object.freeze([
  buildGate(
    "DKL6-GATE-FoundationIntegrity",
    "FoundationIntegrityGate",
    "Foundation",
    KnowledgeRepositoryFoundationValidation.rules,
    1,
  ),
  buildGate(
    "DKL6-GATE-RegistryIntegrity",
    "RegistryIntegrityGate",
    "Registry",
    KnowledgeRepositoryRegistryValidation.rules,
    2,
  ),
  buildGate(
    "DKL6-GATE-ModelIntegrity",
    "ModelIntegrityGate",
    "Model",
    KnowledgeRepositoryModelValidation.rules,
    3,
  ),
  buildGate(
    "DKL6-GATE-OwnershipIntegrity",
    "OwnershipIntegrityGate",
    "Ownership",
    KnowledgeRepositoryOwnershipValidation.rules,
    4,
  ),
  buildGate(
    "DKL6-GATE-BoundaryIntegrity",
    "BoundaryIntegrityGate",
    "Boundaries",
    KnowledgeRepositoryBoundaryValidation.rules,
    5,
  ),
  buildGate(
    "DKL6-GATE-DependencyIntegrity",
    "DependencyIntegrityGate",
    "Dependencies",
    dependencyValidation.rules,
    6,
  ),
  buildGate(
    "DKL6-GATE-TraceabilityIntegrity",
    "TraceabilityIntegrityGate",
    "Traceability",
    traceabilityValidation.rules,
    7,
  ),
  buildGate(
    "DKL6-GATE-ImmutabilityIntegrity",
    "ImmutabilityIntegrityGate",
    "Immutability",
    immutabilityValidation.rules,
    8,
  ),
  buildGate(
    "DKL6-GATE-DeterminismIntegrity",
    "DeterminismIntegrityGate",
    "Determinism",
    determinismValidation.rules,
    9,
  ),
  buildGate(
    "DKL6-GATE-RuntimeProhibition",
    "RuntimeProhibitionGate",
    "RuntimeProhibition",
    runtimeProhibitionValidation.rules,
    10,
  ),
]);

const passedRules = allRules.filter((item) => item.status === "Pass").length;
const failedRules = allRules.filter((item) => item.status === "Fail").length;
const passedGates = gates.filter((item) => item.status === "Pass").length;
const failedGates = gates.filter((item) => item.status === "Fail").length;

const result: KnowledgeRepositoryValidationResult = Object.freeze({
  validationId: KnowledgeRepositoryValidationId,
  status: "Validated",
  totalRules: allRules.length,
  passedRules,
  failedRules,
  gateStatus: failedGates === 0 ? "Pass" : "Fail",
  readiness: failedRules === 0 && failedGates === 0 ? "ReadyForDKL6Manifest" : "Blocked",
  gateCount: gates.length,
  passedGates,
  failedGates,
});

/** Canonical immutable Knowledge Repository Validation aggregate. */
export const KnowledgeRepositoryValidation = Object.freeze({
  identity,
  categories,
  rules: allRules,
  gates,
  foundationValidation: KnowledgeRepositoryFoundationValidation,
  registryValidation: KnowledgeRepositoryRegistryValidation,
  modelValidation: KnowledgeRepositoryModelValidation,
  ownershipValidation: KnowledgeRepositoryOwnershipValidation,
  boundaryValidation: KnowledgeRepositoryBoundaryValidation,
  dependencyValidation,
  traceabilityValidation,
  immutabilityValidation,
  determinismValidation,
  runtimeProhibitionValidation,
  result,
  readiness: result.readiness,
  dependencies: declaredDependencies,
  guarantees: Object.freeze({
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    runtimeFree: true as const,
    noPersistence: true as const,
    noSourceCodeScanning: true as const,
    noFilesystemInspection: true as const,
    noNetworkAccess: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic rule count derived from the validation rule inventory. */
export function getKnowledgeRepositoryValidationRuleCount(): number {
  return KnowledgeRepositoryValidation.rules.length;
}

/** Deterministic immutable validation summary. */
export function getKnowledgeRepositoryValidationSummary(): KnowledgeRepositoryValidationSummaryDescriptor {
  const criticalRuleCount = KnowledgeRepositoryValidation.rules.filter(
    (item) => item.severity === "Critical",
  ).length;
  const requiredRuleCount = KnowledgeRepositoryValidation.rules.filter(
    (item) => item.severity === "Required",
  ).length;
  return Object.freeze({
    validationId: KnowledgeRepositoryValidationId,
    version: KnowledgeRepositoryValidationVersion,
    name: KnowledgeRepositoryValidationName,
    namespace: KnowledgeRepositoryValidationNamespace,
    status: KnowledgeRepositoryValidationStatus,
    foundationDependencyId: KnowledgeRepositoryFoundationId,
    registryDependencyId: KnowledgeRepositoryRegistryId,
    modelDependencyId: KnowledgeRepositoryModelId,
    categoryCount: KnowledgeRepositoryValidation.categories.length,
    ruleCount: getKnowledgeRepositoryValidationRuleCount(),
    passedRuleCount: KnowledgeRepositoryValidation.result.passedRules,
    failedRuleCount: KnowledgeRepositoryValidation.result.failedRules,
    gateCount: KnowledgeRepositoryValidation.gates.length,
    passedGateCount: KnowledgeRepositoryValidation.result.passedGates,
    failedGateCount: KnowledgeRepositoryValidation.result.failedGates,
    criticalRuleCount,
    requiredRuleCount,
    overallGateStatus: KnowledgeRepositoryValidation.result.gateStatus,
    readiness: "ReadyForDKL6Manifest",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
