/**
 * EIL-6:4 — Integration Observability Validation Rules.
 *
 * Exactly forty immutable validation rules across ten categories.
 * Descriptive architecture only. No executable validators.
 *
 * Ownership: owned exclusively by EIL-6:4.
 */

import {
  IntegrationObservabilityModelCanonicalId,
  IntegrationObservabilityModelIdentity,
} from "./integrationObservabilityModel.ts";
import type { ObservabilityValidationCategoryKey } from "./integrationObservabilityValidationCategories.ts";
import type { ObservabilityValidationResultValue } from "./integrationObservabilityValidationResults.ts";

/** Immutable validation rule descriptor. */
export interface IntegrationObservabilityValidationRule {
  readonly ruleId: `EIL-6:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly categoryKey: ObservabilityValidationCategoryKey;
  readonly order: number;
  readonly declaredResult: ObservabilityValidationResultValue;
  readonly namespace: "nexora.eil.integration-observability.validation";
  readonly sourceModelId: typeof IntegrationObservabilityModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  key: string,
  canonicalName: string,
  description: string,
  categoryKey: ObservabilityValidationCategoryKey,
  order: number,
): IntegrationObservabilityValidationRule =>
  Object.freeze({
    ruleId: `EIL-6:4/Rule/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    categoryKey,
    order,
    declaredResult: "Pass" as const,
    namespace: "nexora.eil.integration-observability.validation" as const,
    sourceModelId: IntegrationObservabilityModelCanonicalId,
    sourceReference: `${IntegrationObservabilityModelIdentity.canonicalId}/validation/rules/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly forty validation rules (four per category) in deterministic order.
 */
export const IntegrationObservabilityValidationRules: readonly IntegrationObservabilityValidationRule[] =
  Object.freeze([
    // Identity Validation (1–4)
    rule(
      "CanonicalPhaseId",
      "Canonical Phase ID",
      "Model phase ID must equal EIL-6:3.",
      "IdentityValidation",
      1,
    ),
    rule(
      "CanonicalModelId",
      "Canonical Model ID",
      "Model canonical ID must equal EIL-6:3/IntegrationObservabilityModel.",
      "IdentityValidation",
      2,
    ),
    rule(
      "CanonicalModelName",
      "Canonical Model Name",
      "Model name must equal Integration Observability Model.",
      "IdentityValidation",
      3,
    ),
    rule(
      "CanonicalModelVersion",
      "Canonical Model Version",
      "Model version must equal 1.0.0.",
      "IdentityValidation",
      4,
    ),

    // Namespace Validation (5–8)
    rule(
      "ModelNamespaceCanonical",
      "Model Namespace Canonical",
      "Model namespace must equal nexora.eil.integration-observability.model.",
      "NamespaceValidation",
      5,
    ),
    rule(
      "ValidationNamespaceCanonical",
      "Validation Namespace Canonical",
      "Validation namespace must equal nexora.eil.integration-observability.validation.",
      "NamespaceValidation",
      6,
    ),
    rule(
      "DomainNamespaceConsistency",
      "Domain Namespace Consistency",
      "Domain models must declare the Model namespace.",
      "NamespaceValidation",
      7,
    ),
    rule(
      "ContractNamespaceConsistency",
      "Contract Namespace Consistency",
      "Contract models must declare the Model namespace.",
      "NamespaceValidation",
      8,
    ),

    // Dependency Validation (9–12)
    rule(
      "ModelDependsOnRegistryOnly",
      "Model Depends On Registry Only",
      "Model must depend exclusively on EIL-6:2 Registry.",
      "DependencyValidation",
      9,
    ),
    rule(
      "ValidationDependsOnModelOnly",
      "Validation Depends On Model Only",
      "Validation must depend exclusively on EIL-6:3 Model.",
      "DependencyValidation",
      10,
    ),
    rule(
      "NoLaterPhaseDependency",
      "No Later Phase Dependency",
      "Validation must not depend on Manifest or later phases.",
      "DependencyValidation",
      11,
    ),
    rule(
      "NoFoundationDirectImport",
      "No Foundation Direct Import",
      "Validation must not import Foundation private modules directly.",
      "DependencyValidation",
      12,
    ),

    // Inventory Validation (13–16)
    rule(
      "DomainCountTen",
      "Domain Count Ten",
      "Model must expose exactly ten domain models.",
      "InventoryValidation",
      13,
    ),
    rule(
      "ContractCapabilityCountTen",
      "Contract And Capability Count Ten",
      "Model must expose exactly ten contract and ten capability models.",
      "InventoryValidation",
      14,
    ),
    rule(
      "MetricEventLifecycleCounts",
      "Metric Event Lifecycle Counts",
      "Model must expose eight metrics, eight events, and nine lifecycle models.",
      "InventoryValidation",
      15,
    ),
    rule(
      "DerivedTotalFiftyFive",
      "Derived Total Fifty Five",
      "Model inventory total must equal the sum of collection lengths (55).",
      "InventoryValidation",
      16,
    ),

    // Relationship Validation (17–20)
    rule(
      "RelationshipTypeCoverage",
      "Relationship Type Coverage",
      "Relationship models must cover the closed ten-type vocabulary.",
      "RelationshipValidation",
      17,
    ),
    rule(
      "RelationshipMetadataOnly",
      "Relationship Metadata Only",
      "Relationships must declare resolvesRuntime false.",
      "RelationshipValidation",
      18,
    ),
    rule(
      "RelationshipUniqueIds",
      "Relationship Unique IDs",
      "Relationship identifiers must be unique.",
      "RelationshipValidation",
      19,
    ),
    rule(
      "RelationshipSourceTargets",
      "Relationship Source Targets",
      "Relationships must reference canonical Model or Registry identities.",
      "RelationshipValidation",
      20,
    ),

    // Ordering Validation (21–24)
    rule(
      "DomainOrderSequential",
      "Domain Order Sequential",
      "Domain model orders must be sequential starting at 1.",
      "OrderingValidation",
      21,
    ),
    rule(
      "LifecycleOrderPreserved",
      "Lifecycle Order Preserved",
      "Lifecycle model order must preserve Registry lifecycle order.",
      "OrderingValidation",
      22,
    ),
    rule(
      "MetricEventOrderPreserved",
      "Metric Event Order Preserved",
      "Metric and event model orders must preserve Registry category order.",
      "OrderingValidation",
      23,
    ),
    rule(
      "DeterministicCollectionOrder",
      "Deterministic Collection Order",
      "All Model collections must be deterministically ordered.",
      "OrderingValidation",
      24,
    ),

    // Immutability Validation (25–28)
    rule(
      "AggregateFrozen",
      "Aggregate Frozen",
      "Model aggregate must be frozen immutable metadata.",
      "ImmutabilityValidation",
      25,
    ),
    rule(
      "CollectionsFrozen",
      "Collections Frozen",
      "Model collections must be frozen immutable arrays.",
      "ImmutabilityValidation",
      26,
    ),
    rule(
      "IdentityFrozen",
      "Identity Frozen",
      "Model identity must be frozen immutable metadata.",
      "ImmutabilityValidation",
      27,
    ),
    rule(
      "InventoryFrozen",
      "Inventory Frozen",
      "Model inventory must be frozen immutable metadata.",
      "ImmutabilityValidation",
      28,
    ),

    // Export Validation (29–32)
    rule(
      "PackageExportsModelIdentity",
      "Package Exports Model Identity",
      "Package entry must export Model identity.",
      "ExportValidation",
      29,
    ),
    rule(
      "PackageExportsModelAggregate",
      "Package Exports Model Aggregate",
      "Package entry must export Model aggregate.",
      "ExportValidation",
      30,
    ),
    rule(
      "PackageExportsModelCollections",
      "Package Exports Model Collections",
      "Package entry must export Model domain, contract, capability, metric, event, and lifecycle collections.",
      "ExportValidation",
      31,
    ),
    rule(
      "NoSeparatePackageRoot",
      "No Separate Package Root",
      "Validation must expose only through the existing package entry.",
      "ExportValidation",
      32,
    ),

    // Metadata Validation (33–36)
    rule(
      "MetadataOnlyGuarantee",
      "Metadata Only Guarantee",
      "Model must declare metadataOnly true.",
      "MetadataValidation",
      33,
    ),
    rule(
      "NoRuntimeBehavior",
      "No Runtime Behavior",
      "Model must declare runtimeBehavior false.",
      "MetadataValidation",
      34,
    ),
    rule(
      "NoTelemetryEngines",
      "No Telemetry Engines",
      "Model must declare no telemetry, OTel, Prometheus, or Grafana behavior.",
      "MetadataValidation",
      35,
    ),
    rule(
      "UniqueModelIdentities",
      "Unique Model Identities",
      "All Model instance identifiers and keys must be unique.",
      "MetadataValidation",
      36,
    ),

    // Readiness Validation (37–40)
    rule(
      "ModelStatusModeled",
      "Model Status Modeled",
      "Model status must equal Model.",
      "ReadinessValidation",
      37,
    ),
    rule(
      "ModelReadyForValidation",
      "Model Ready For Validation",
      "Model readiness must equal ReadyForValidation.",
      "ReadinessValidation",
      38,
    ),
    rule(
      "ValidationStatusValidation",
      "Validation Status Validation",
      "Validation status must equal Validation.",
      "ReadinessValidation",
      39,
    ),
    rule(
      "ValidationReadyForManifest",
      "Validation Ready For Manifest",
      "Validation readiness must equal ReadyForManifest.",
      "ReadinessValidation",
      40,
    ),
  ]);
