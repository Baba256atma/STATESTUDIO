/**
 * EIL-9:4 — Executive Integration Layer Validation Categories.
 *
 * Exactly ten immutable validation categories.
 * Descriptive metadata only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-9:4.
 */

import {
  ExecutiveIntegrationLayerModelCanonicalId,
  ExecutiveIntegrationLayerModelIdentity,
} from "./executiveIntegrationLayerModel.ts";

/** Closed validation-category key vocabulary. */
export type LayerValidationCategoryKey =
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
export interface ExecutiveIntegrationLayerValidationCategory {
  readonly categoryId: `EIL-9:4/Category/${LayerValidationCategoryKey}`;
  readonly canonicalKey: LayerValidationCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.validation";
  readonly sourceModelId: typeof ExecutiveIntegrationLayerModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  key: LayerValidationCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationLayerValidationCategory =>
  Object.freeze({
    categoryId: `EIL-9:4/Category/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-layer.validation" as const,
    sourceModelId: ExecutiveIntegrationLayerModelCanonicalId,
    sourceReference: `${ExecutiveIntegrationLayerModelIdentity.canonicalId}/validation/categories/${key}`,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten validation categories in deterministic order.
 */
export const ExecutiveIntegrationLayerValidationCategories: readonly ExecutiveIntegrationLayerValidationCategory[] =
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
