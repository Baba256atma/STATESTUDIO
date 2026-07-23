/**
 * EIL-9:4 — Executive Integration Layer Validation Rules.
 *
 * Exactly forty immutable validation rules across ten categories.
 * Descriptive architecture only. No executable validators.
 *
 * Ownership: owned exclusively by EIL-9:4.
 */

import {
  ExecutiveIntegrationLayerModelCanonicalId,
  ExecutiveIntegrationLayerModelIdentity,
} from "./executiveIntegrationLayerModel.ts";
import type { LayerValidationCategoryKey } from "./executiveIntegrationLayerValidationCategories.ts";
import type { LayerValidationResultValue } from "./executiveIntegrationLayerValidationResults.ts";

/** Immutable validation rule descriptor. */
export interface ExecutiveIntegrationLayerValidationRule {
  readonly ruleId: `EIL-9:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly categoryKey: LayerValidationCategoryKey;
  readonly order: number;
  readonly declaredResult: LayerValidationResultValue;
  readonly namespace: "nexora.eil.executive-integration-layer.validation";
  readonly sourceModelId: typeof ExecutiveIntegrationLayerModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  key: string,
  canonicalName: string,
  description: string,
  categoryKey: LayerValidationCategoryKey,
  order: number,
): ExecutiveIntegrationLayerValidationRule =>
  Object.freeze({
    ruleId: `EIL-9:4/Rule/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    categoryKey,
    order,
    declaredResult: "Pass" as const,
    namespace: "nexora.eil.executive-integration-layer.validation" as const,
    sourceModelId: ExecutiveIntegrationLayerModelCanonicalId,
    sourceReference: `${ExecutiveIntegrationLayerModelIdentity.canonicalId}/validation/rules/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly forty validation rules (four per category) in deterministic order.
 */
export const ExecutiveIntegrationLayerValidationRules: readonly ExecutiveIntegrationLayerValidationRule[] =
  Object.freeze([
    rule(
      "CanonicalPhaseId",
      "Canonical Phase ID",
      "Model phase ID must equal EIL-9:3.",
      "Identity",
      1,
    ),
    rule(
      "CanonicalModelId",
      "Canonical Model ID",
      "Model canonical ID must equal EIL-9:3/ExecutiveIntegrationLayerModel.",
      "Identity",
      2,
    ),
    rule(
      "CanonicalModelName",
      "Canonical Model Name",
      "Model name must equal Executive Integration Layer Model.",
      "Identity",
      3,
    ),
    rule(
      "CanonicalModelVersion",
      "Canonical Model Version",
      "Model version must equal 1.0.0.",
      "Identity",
      4,
    ),
    rule(
      "ModelNamespaceCanonical",
      "Model Namespace Canonical",
      "Model namespace must equal nexora.eil.executive-integration-layer.model.",
      "Namespace",
      5,
    ),
    rule(
      "ValidationNamespaceCanonical",
      "Validation Namespace Canonical",
      "Validation namespace must equal nexora.eil.executive-integration-layer.validation.",
      "Namespace",
      6,
    ),
    rule(
      "DomainNamespaceConsistency",
      "Domain Namespace Consistency",
      "Domain models must declare the Model namespace.",
      "Namespace",
      7,
    ),
    rule(
      "ModuleNamespaceConsistency",
      "Module Namespace Consistency",
      "Module models must declare the Model namespace.",
      "Namespace",
      8,
    ),
    rule(
      "ModelDependsOnRegistryOnly",
      "Model Depends On Registry Only",
      "Model must depend exclusively on EIL-9:2 Registry.",
      "Dependency",
      9,
    ),
    rule(
      "ValidationDependsOnModelOnly",
      "Validation Depends On Model Only",
      "Validation must depend exclusively on EIL-9:3 Model.",
      "Dependency",
      10,
    ),
    rule(
      "NoLaterPhaseDependency",
      "No Later Phase Dependency",
      "Validation must not depend on Manifest or later phases.",
      "Dependency",
      11,
    ),
    rule(
      "NoRegistryDirectImport",
      "No Registry Direct Import",
      "Validation must not import Registry private modules directly.",
      "Dependency",
      12,
    ),
    rule(
      "ModuleCountOne",
      "Module Count One",
      "Model must expose exactly one module model.",
      "Inventory",
      13,
    ),
    rule(
      "ContractCapabilityDomainCounts",
      "Contract Capability Domain Counts",
      "Model must expose eight contract, eight capability, and eight domain models.",
      "Inventory",
      14,
    ),
    rule(
      "LifecycleCountNine",
      "Lifecycle Count Nine",
      "Model must expose exactly nine lifecycle models.",
      "Inventory",
      15,
    ),
    rule(
      "DerivedTotalThirtyFour",
      "Derived Total Thirty Four",
      "Model inventory total must equal the sum of collection lengths (34).",
      "Inventory",
      16,
    ),
    rule(
      "RelationshipTypeCoverage",
      "Relationship Type Coverage",
      "Relationship models must cover the closed ten-type vocabulary.",
      "Relationship",
      17,
    ),
    rule(
      "RelationshipMetadataOnly",
      "Relationship Metadata Only",
      "Relationships must declare resolvesRuntime false.",
      "Relationship",
      18,
    ),
    rule(
      "RelationshipUniqueIds",
      "Relationship Unique IDs",
      "Relationship identifiers must be unique.",
      "Relationship",
      19,
    ),
    rule(
      "PublicIndexRelationshipsPreserved",
      "Public Index Relationships Preserved",
      "Module models must preserve Public Index relationship references.",
      "Relationship",
      20,
    ),
    rule(
      "ModuleOrderSequential",
      "Module Order Sequential",
      "Module model orders must be sequential starting at 1.",
      "Ordering",
      21,
    ),
    rule(
      "LifecycleOrderPreserved",
      "Lifecycle Order Preserved",
      "Lifecycle model order must preserve Registry lifecycle order.",
      "Ordering",
      22,
    ),
    rule(
      "ContractOrderPreserved",
      "Contract Order Preserved",
      "Contract model orders must preserve Registry contract order.",
      "Ordering",
      23,
    ),
    rule(
      "DeterministicCollectionOrder",
      "Deterministic Collection Order",
      "All Model collections must be deterministically ordered.",
      "Ordering",
      24,
    ),
    rule(
      "AggregateFrozen",
      "Aggregate Frozen",
      "Model aggregate must be frozen immutable metadata.",
      "Immutability",
      25,
    ),
    rule(
      "CollectionsFrozen",
      "Collections Frozen",
      "Model collections must be frozen immutable arrays.",
      "Immutability",
      26,
    ),
    rule(
      "IdentityFrozen",
      "Identity Frozen",
      "Model identity must be frozen immutable metadata.",
      "Immutability",
      27,
    ),
    rule(
      "InventoryFrozen",
      "Inventory Frozen",
      "Model inventory must be frozen immutable metadata.",
      "Immutability",
      28,
    ),
    rule(
      "PackageExportsModelIdentity",
      "Package Exports Model Identity",
      "Package entry must export Model identity.",
      "Export",
      29,
    ),
    rule(
      "PackageExportsModelAggregate",
      "Package Exports Model Aggregate",
      "Package entry must export Model aggregate.",
      "Export",
      30,
    ),
    rule(
      "PackageExportsModelCollections",
      "Package Exports Model Collections",
      "Package entry must export Model module, contract, capability, domain, and lifecycle collections.",
      "Export",
      31,
    ),
    rule(
      "NoSeparatePackageRoot",
      "No Separate Package Root",
      "Validation must expose only through the existing package entry.",
      "Export",
      32,
    ),
    rule(
      "MetadataOnlyGuarantee",
      "Metadata Only Guarantee",
      "Model must declare metadataOnly true.",
      "Metadata",
      33,
    ),
    rule(
      "NoRuntimeBehavior",
      "No Runtime Behavior",
      "Model must declare runtimeBehavior false.",
      "Metadata",
      34,
    ),
    rule(
      "CompositionOnlyGuarantee",
      "Composition Only Guarantee",
      "Model must declare compositionOnly true with no integration runtime.",
      "Metadata",
      35,
    ),
    rule(
      "UniqueModelIdentities",
      "Unique Model Identities",
      "All Model instance identifiers and keys must be unique.",
      "Metadata",
      36,
    ),
    rule(
      "ModelStatusModeled",
      "Model Status Modeled",
      "Model status must equal Model.",
      "Readiness",
      37,
    ),
    rule(
      "ModelReadyForValidation",
      "Model Ready For Validation",
      "Model readiness must equal ReadyForValidation.",
      "Readiness",
      38,
    ),
    rule(
      "ValidationStatusValidation",
      "Validation Status Validation",
      "Validation status must equal Validation.",
      "Readiness",
      39,
    ),
    rule(
      "ValidationReadyForManifest",
      "Validation Ready For Manifest",
      "Validation readiness must equal ReadyForManifest.",
      "Readiness",
      40,
    ),
  ]);
