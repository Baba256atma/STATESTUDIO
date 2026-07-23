/**
 * EIL-8:4 — Executive Integration Suite Validation Categories.
 *
 * Exactly ten immutable validation categories.
 * Descriptive metadata only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-8:4.
 */

import {
  ExecutiveIntegrationSuiteModelCanonicalId,
  ExecutiveIntegrationSuiteModelIdentity,
} from "./executiveIntegrationSuiteModel.ts";

/** Closed validation-category key vocabulary. */
export type SuiteValidationCategoryKey =
  | "Identity"
  | "Namespace"
  | "Dependency"
  | "Inventory"
  | "Relationship"
  | "Ordering"
  | "Immutability"
  | "Export"
  | "Metadata"
  | "Readiness";

/** Immutable validation category descriptor. */
export interface ExecutiveIntegrationSuiteValidationCategory {
  readonly categoryId: `EIL-8:4/Category/${SuiteValidationCategoryKey}`;
  readonly canonicalKey: SuiteValidationCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.validation";
  readonly sourceModelId: typeof ExecutiveIntegrationSuiteModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  key: SuiteValidationCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteValidationCategory =>
  Object.freeze({
    categoryId: `EIL-8:4/Category/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.validation" as const,
    sourceModelId: ExecutiveIntegrationSuiteModelCanonicalId,
    sourceReference: `${ExecutiveIntegrationSuiteModelIdentity.canonicalId}/validation/categories/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten validation categories in deterministic order.
 */
export const ExecutiveIntegrationSuiteValidationCategories: readonly ExecutiveIntegrationSuiteValidationCategory[] =
  Object.freeze([
    category(
      "Identity",
      "Identity",
      "Validates canonical Model identity, phase ID, and version metadata.",
      1,
    ),
    category(
      "Namespace",
      "Namespace",
      "Validates Model namespace consistency across architectural surfaces.",
      2,
    ),
    category(
      "Dependency",
      "Dependency",
      "Validates exclusive Model dependency on Registry and Validation on Model.",
      3,
    ),
    category(
      "Inventory",
      "Inventory",
      "Validates derived Model inventory counts and canonical instance totals.",
      4,
    ),
    category(
      "Relationship",
      "Relationship",
      "Validates architectural relationship types and metadata integrity.",
      5,
    ),
    category(
      "Ordering",
      "Ordering",
      "Validates deterministic sequential ordering of Model collections.",
      6,
    ),
    category(
      "Immutability",
      "Immutability",
      "Validates frozen, immutable Model metadata declarations.",
      7,
    ),
    category(
      "Export",
      "Export",
      "Validates package export surface for Model architectural metadata.",
      8,
    ),
    category(
      "Metadata",
      "Metadata",
      "Validates metadata-only and runtime-free architectural guarantees.",
      9,
    ),
    category(
      "Readiness",
      "Readiness",
      "Validates Model readiness and Validation readiness declarations.",
      10,
    ),
  ]);
