/**
 * EIL-7:4 — Integration Governance Validation Categories.
 *
 * Exactly ten immutable validation categories.
 * Descriptive metadata only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-7:4.
 */

import {
  IntegrationGovernanceModelCanonicalId,
  IntegrationGovernanceModelIdentity,
} from "./integrationGovernanceModel.ts";

/** Closed validation-category key vocabulary. */
export type GovernanceValidationCategoryKey =
  | "IdentityValidation"
  | "NamespaceValidation"
  | "DependencyValidation"
  | "InventoryValidation"
  | "RelationshipValidation"
  | "OrderingValidation"
  | "ImmutabilityValidation"
  | "ExportValidation"
  | "MetadataValidation"
  | "ReadinessValidation";

/** Immutable validation category descriptor. */
export interface IntegrationGovernanceValidationCategory {
  readonly categoryId: `EIL-7:4/Category/${GovernanceValidationCategoryKey}`;
  readonly canonicalKey: GovernanceValidationCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.validation";
  readonly sourceModelId: typeof IntegrationGovernanceModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  key: GovernanceValidationCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationGovernanceValidationCategory =>
  Object.freeze({
    categoryId: `EIL-7:4/Category/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.integration-governance.validation" as const,
    sourceModelId: IntegrationGovernanceModelCanonicalId,
    sourceReference: `${IntegrationGovernanceModelIdentity.canonicalId}/validation/categories/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten validation categories in deterministic order.
 */
export const IntegrationGovernanceValidationCategories: readonly IntegrationGovernanceValidationCategory[] =
  Object.freeze([
    category(
      "IdentityValidation",
      "Identity Validation",
      "Validates canonical Model identity, phase ID, and version metadata.",
      1,
    ),
    category(
      "NamespaceValidation",
      "Namespace Validation",
      "Validates Model namespace consistency across architectural surfaces.",
      2,
    ),
    category(
      "DependencyValidation",
      "Dependency Validation",
      "Validates exclusive Model dependency on Registry and Validation on Model.",
      3,
    ),
    category(
      "InventoryValidation",
      "Inventory Validation",
      "Validates derived Model inventory counts and canonical instance totals.",
      4,
    ),
    category(
      "RelationshipValidation",
      "Relationship Validation",
      "Validates architectural relationship types and metadata integrity.",
      5,
    ),
    category(
      "OrderingValidation",
      "Ordering Validation",
      "Validates deterministic sequential ordering of Model collections.",
      6,
    ),
    category(
      "ImmutabilityValidation",
      "Immutability Validation",
      "Validates frozen, immutable Model metadata declarations.",
      7,
    ),
    category(
      "ExportValidation",
      "Export Validation",
      "Validates package export surface for Model architectural metadata.",
      8,
    ),
    category(
      "MetadataValidation",
      "Metadata Validation",
      "Validates metadata-only and runtime-free architectural guarantees.",
      9,
    ),
    category(
      "ReadinessValidation",
      "Readiness Validation",
      "Validates Model readiness and Validation readiness declarations.",
      10,
    ),
  ]);
