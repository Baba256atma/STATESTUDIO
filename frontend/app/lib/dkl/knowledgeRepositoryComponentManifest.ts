/**
 * DKL-6:5 — Knowledge Repository Component Manifest.
 *
 * Component inventory, architecture inventories, and public API inventory.
 * Derived from DKL-6:1–6:4 public metadata. Metadata only.
 *
 * Ownership: owned exclusively by DKL-6:5.
 */

import {
  getKnowledgeRepositoryFoundationSummary,
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationNamespace,
  KnowledgeRepositoryFoundationStatus,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import {
  getKnowledgeRepositoryModelCount,
  getKnowledgeRepositoryModelSummary,
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
  KnowledgeRepositoryModelNamespace,
  KnowledgeRepositoryModelStatus,
  KnowledgeRepositoryModelVersion,
} from "./knowledgeRepositoryModel.ts";
import {
  getKnowledgeRepositoryRegistryEntryCount,
  getKnowledgeRepositoryRegistrySummary,
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryNamespace,
  KnowledgeRepositoryRegistryStatus,
  KnowledgeRepositoryRegistryVersion,
} from "./knowledgeRepositoryRegistry.ts";
import {
  getKnowledgeRepositoryValidationRuleCount,
  getKnowledgeRepositoryValidationSummary,
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
  KnowledgeRepositoryValidationNamespace,
  KnowledgeRepositoryValidationStatus,
  KnowledgeRepositoryValidationVersion,
} from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryManifestComponentEntry,
  KnowledgeRepositoryManifestInventoryEntry,
  KnowledgeRepositoryManifestPublicApiPhase,
} from "./knowledgeRepositoryManifestTypes.ts";

const MANIFEST_ID = "DKL-6:5/KnowledgeRepositoryManifest" as const;
const MANIFEST_VERSION = "1.0.0" as const;
const MANIFEST_NAMESPACE = "nexora.dkl.repository.manifest" as const;
const MANIFEST_STATUS = "Manifested" as const;
const MANIFEST_PUBLIC_API_COUNT = 8 as const;

const foundationSummary = getKnowledgeRepositoryFoundationSummary();
const registrySummary = getKnowledgeRepositoryRegistrySummary();
const modelSummary = getKnowledgeRepositoryModelSummary();
const validationSummary = getKnowledgeRepositoryValidationSummary();

const inventory = (
  id: string,
  category: string,
  sourceReference: string,
  count: number,
): KnowledgeRepositoryManifestInventoryEntry =>
  Object.freeze({
    id,
    category,
    sourceReference,
    count,
    status: "Complete" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const component = (
  id: string,
  componentName: string,
  sourceIdentity: string,
  version: string,
  namespace: string,
  status: string,
  architecturalRole: string,
  publicApiCount: number,
): KnowledgeRepositoryManifestComponentEntry =>
  Object.freeze({
    id,
    componentName,
    sourceIdentity,
    version,
    namespace,
    status,
    architecturalRole,
    publicApiCount,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
    completeness: "Complete" as const,
  });

/** Exact five-component inventory. */
export const KnowledgeRepositoryManifestComponents: readonly KnowledgeRepositoryManifestComponentEntry[] =
  Object.freeze([
    component(
      "DKL-6:5/Component/Foundation",
      "KnowledgeRepositoryFoundation",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundationVersion,
      KnowledgeRepositoryFoundationNamespace,
      KnowledgeRepositoryFoundationStatus,
      "Foundation",
      6,
    ),
    component(
      "DKL-6:5/Component/Registry",
      "KnowledgeRepositoryRegistry",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistryVersion,
      KnowledgeRepositoryRegistryNamespace,
      KnowledgeRepositoryRegistryStatus,
      "Registry",
      8,
    ),
    component(
      "DKL-6:5/Component/Model",
      "KnowledgeRepositoryModel",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModelVersion,
      KnowledgeRepositoryModelNamespace,
      KnowledgeRepositoryModelStatus,
      "Model",
      8,
    ),
    component(
      "DKL-6:5/Component/Validation",
      "KnowledgeRepositoryValidation",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidationVersion,
      KnowledgeRepositoryValidationNamespace,
      KnowledgeRepositoryValidationStatus,
      "Validation",
      8,
    ),
    component(
      "DKL-6:5/Component/Manifest",
      "KnowledgeRepositoryManifest",
      MANIFEST_ID,
      MANIFEST_VERSION,
      MANIFEST_NAMESPACE,
      MANIFEST_STATUS,
      "Manifest",
      MANIFEST_PUBLIC_API_COUNT,
    ),
  ]);

/** Foundation inventory counts derived from public Foundation metadata. */
export const KnowledgeRepositoryFoundationInventory: readonly KnowledgeRepositoryManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "DKL-6:5/Inventory/Foundation/Capabilities",
      "FoundationCapabilities",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundation.contracts.capabilityCount,
    ),
    inventory(
      "DKL-6:5/Inventory/Foundation/Contracts",
      "FoundationContracts",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundation.contracts.contractCount,
    ),
    inventory(
      "DKL-6:5/Inventory/Foundation/LifecycleStates",
      "FoundationLifecycleStates",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundation.lifecycle.stateCount,
    ),
    inventory(
      "DKL-6:5/Inventory/Foundation/Policies",
      "FoundationPolicies",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundation.policies.policyCount,
    ),
    inventory(
      "DKL-6:5/Inventory/Foundation/PublicExports",
      "FoundationPublicExports",
      KnowledgeRepositoryFoundationId,
      6,
    ),
  ]);

/** Registry inventory counts derived from public Registry metadata. */
export const KnowledgeRepositoryRegistryInventory: readonly KnowledgeRepositoryManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "DKL-6:5/Inventory/Registry/RepositoryTypes",
      "RegistryRepositoryTypes",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.repositoryTypes.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/Components",
      "RegistryComponents",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.components.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/KnowledgeRecordTypes",
      "RegistryKnowledgeRecordTypes",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.knowledgeRecordTypes.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/VersionTypes",
      "RegistryVersionTypes",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.versionTypes.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/SnapshotTypes",
      "RegistrySnapshotTypes",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.snapshotTypes.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/HistoryEventTypes",
      "RegistryHistoryEventTypes",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.historyEventTypes.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/ArchiveStates",
      "RegistryArchiveStates",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.archiveStates.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/RetentionPolicies",
      "RegistryRetentionPolicies",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.retentionPolicies.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/IndexDeclarations",
      "RegistryIndexDeclarations",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.indexDeclarations.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/RetrievalDeclarations",
      "RegistryRetrievalDeclarations",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.retrievalDeclarations.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/FoundationCapabilities",
      "RegistryFoundationCapabilities",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.capabilities.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/FoundationContracts",
      "RegistryFoundationContracts",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.contracts.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/FoundationLifecycleStates",
      "RegistryFoundationLifecycleStates",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.lifecycle.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/FoundationPolicies",
      "RegistryFoundationPolicies",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistry.policies.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/TotalEntries",
      "RegistryTotalEntries",
      KnowledgeRepositoryRegistryId,
      getKnowledgeRepositoryRegistryEntryCount(),
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/OrderedContentGroups",
      "RegistryOrderedContentGroups",
      KnowledgeRepositoryRegistryId,
      registrySummary.registryGroupCount,
    ),
    inventory(
      "DKL-6:5/Inventory/Registry/PublicExports",
      "RegistryPublicExports",
      KnowledgeRepositoryRegistryId,
      8,
    ),
  ]);

/** Model inventory counts derived from public Model metadata. */
export const KnowledgeRepositoryModelInventory: readonly KnowledgeRepositoryManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "DKL-6:5/Inventory/Model/IdentityAndAggregate",
      "ModelIdentityAndAggregate",
      KnowledgeRepositoryModelId,
      2,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/RecordModels",
      "ModelRecordModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.recordModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/VersionModels",
      "ModelVersionModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.versionModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/SnapshotModels",
      "ModelSnapshotModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.snapshotModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/HistoryModels",
      "ModelHistoryModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.historyModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/ArchiveModels",
      "ModelArchiveModels",
      KnowledgeRepositoryModelId,
      1,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/RetentionModels",
      "ModelRetentionModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.retentionModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/IndexModels",
      "ModelIndexModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.indexModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/RetrievalModels",
      "ModelRetrievalModels",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.retrievalModels.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/TotalModels",
      "ModelTotalModels",
      KnowledgeRepositoryModelId,
      getKnowledgeRepositoryModelCount(),
    ),
    inventory(
      "DKL-6:5/Inventory/Model/Relationships",
      "ModelRelationships",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.relationships.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/LifecycleStates",
      "ModelLifecycleStates",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.lifecycle.stateCount,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/RegistryTraceabilityGroups",
      "ModelRegistryTraceabilityGroups",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModel.registryTraceability.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Model/PublicExports",
      "ModelPublicExports",
      KnowledgeRepositoryModelId,
      8,
    ),
  ]);

/** Validation inventory counts derived from public Validation metadata. */
export const KnowledgeRepositoryValidationInventory: readonly KnowledgeRepositoryManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "DKL-6:5/Inventory/Validation/Categories",
      "ValidationCategories",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidation.categories.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/Rules",
      "ValidationRules",
      KnowledgeRepositoryValidationId,
      getKnowledgeRepositoryValidationRuleCount(),
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/PassedRules",
      "ValidationPassedRules",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidation.result.passedRules,
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/FailedRules",
      "ValidationFailedRules",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidation.result.failedRules,
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/Gates",
      "ValidationGates",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidation.gates.length,
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/PassedGates",
      "ValidationPassedGates",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidation.result.passedGates,
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/FailedGates",
      "ValidationFailedGates",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidation.result.failedGates,
    ),
    inventory(
      "DKL-6:5/Inventory/Validation/PublicExports",
      "ValidationPublicExports",
      KnowledgeRepositoryValidationId,
      8,
    ),
  ]);

/** Manifest-local inventory. */
export const KnowledgeRepositoryManifestLocalInventory: readonly KnowledgeRepositoryManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "DKL-6:5/Inventory/Manifest/ArchitectureSections",
      "ManifestArchitectureSections",
      MANIFEST_ID,
      5,
    ),
    inventory(
      "DKL-6:5/Inventory/Manifest/Components",
      "ManifestComponents",
      MANIFEST_ID,
      KnowledgeRepositoryManifestComponents.length,
    ),
  ]);

/** Combined inventory groups. */
export const KnowledgeRepositoryManifestInventories = Object.freeze({
  foundation: KnowledgeRepositoryFoundationInventory,
  registry: KnowledgeRepositoryRegistryInventory,
  model: KnowledgeRepositoryModelInventory,
  validation: KnowledgeRepositoryValidationInventory,
  manifest: KnowledgeRepositoryManifestLocalInventory,
  groupCount: 5 as const,
});

/** Public API phase inventory — declared counts, no module reflection. */
export const KnowledgeRepositoryManifestPublicApis: readonly KnowledgeRepositoryManifestPublicApiPhase[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-6:5/PublicApi/Foundation",
      phase: "DKL-6:1",
      sourceIdentity: KnowledgeRepositoryFoundationId,
      publicApiCount: 6,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:5/PublicApi/Registry",
      phase: "DKL-6:2",
      sourceIdentity: KnowledgeRepositoryRegistryId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:5/PublicApi/Model",
      phase: "DKL-6:3",
      sourceIdentity: KnowledgeRepositoryModelId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:5/PublicApi/Validation",
      phase: "DKL-6:4",
      sourceIdentity: KnowledgeRepositoryValidationId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:5/PublicApi/Manifest",
      phase: "DKL-6:5",
      sourceIdentity: MANIFEST_ID,
      publicApiCount: MANIFEST_PUBLIC_API_COUNT,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

export const KnowledgeRepositoryManifestCanonicalCounts = Object.freeze({
  foundation: Object.freeze({
    capabilities: foundationSummary.capabilityCount,
    contracts: foundationSummary.contractCount,
    lifecycleStates: foundationSummary.lifecycleStateCount,
    policies: foundationSummary.policyCount,
    publicExports: 6,
  }),
  registry: Object.freeze({
    totalEntries: registrySummary.totalEntryCount,
    orderedContentGroups: registrySummary.registryGroupCount,
    publicExports: 8,
  }),
  model: Object.freeze({
    totalModels: modelSummary.totalModelCount,
    relationships: modelSummary.relationshipCount,
    lifecycleStates: modelSummary.lifecycleCount,
    registryTraceabilityGroups: modelSummary.registryTraceabilityCount,
    publicExports: 8,
  }),
  validation: Object.freeze({
    categories: validationSummary.categoryCount,
    rules: validationSummary.ruleCount,
    passedRules: validationSummary.passedRuleCount,
    failedRules: validationSummary.failedRuleCount,
    gates: validationSummary.gateCount,
    passedGates: validationSummary.passedGateCount,
    failedGates: validationSummary.failedGateCount,
    publicExports: 8,
  }),
  manifest: Object.freeze({
    architectureSections: 5,
    components: KnowledgeRepositoryManifestComponents.length,
    publicExports: MANIFEST_PUBLIC_API_COUNT,
  }),
});
