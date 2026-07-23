/**
 * EIL-5:4 — Integration Policy & Governance Validation Categories.
 *
 * Immutable validation category declarations.
 * Metadata-only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-5:4.
 */

import type {
  IntegrationPolicyGovernanceValidationCategory,
  PolicyGovernanceValidationCategoryId,
} from "./integrationPolicyGovernanceValidationTypes.ts";

const category = (
  key: PolicyGovernanceValidationCategoryId,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationPolicyGovernanceValidationCategory =>
  Object.freeze({
    categoryId: `EIL-5:4/Category/${key}` as const,
    key,
    canonicalName,
    description,
    ownership: "EIL-5:4" as const,
    ordinal,
    tags: Object.freeze(["category", key.toLowerCase()]),
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen validation categories.
 */
export const IntegrationPolicyGovernanceValidationCategories: readonly IntegrationPolicyGovernanceValidationCategory[] =
  Object.freeze([
    category(
      "Identity",
      "Identity",
      "Validate canonical governance identity consistency.",
      1,
    ),
    category(
      "Namespace",
      "Namespace",
      "Validate namespace integrity across governance phases.",
      2,
    ),
    category(
      "Registry",
      "Registry",
      "Validate governance registry completeness metadata.",
      3,
    ),
    category(
      "DomainModel",
      "Domain Model",
      "Validate governance domain model completeness metadata.",
      4,
    ),
    category(
      "Relationship",
      "Relationship",
      "Validate governance relationship consistency metadata.",
      5,
    ),
    category(
      "Topology",
      "Topology",
      "Validate governance topology model integrity metadata.",
      6,
    ),
    category(
      "Lifecycle",
      "Lifecycle",
      "Validate governance lifecycle coverage metadata.",
      7,
    ),
    category(
      "Dependency",
      "Dependency",
      "Validate dependency direction and aggregate-only imports.",
      8,
    ),
    category(
      "Compatibility",
      "Compatibility",
      "Validate governance compatibility declaration metadata.",
      9,
    ),
    category(
      "Inventory",
      "Inventory",
      "Validate inventory derivation metadata.",
      10,
    ),
    category(
      "Export",
      "Export",
      "Validate aggregate export integrity metadata.",
      11,
    ),
    category(
      "Immutability",
      "Immutability",
      "Validate metadata immutability declarations.",
      12,
    ),
    category(
      "Determinism",
      "Determinism",
      "Validate deterministic ordering declarations.",
      13,
    ),
    category(
      "Readiness",
      "Readiness",
      "Validate readiness declaration metadata.",
      14,
    ),
    category(
      "Architecture",
      "Architecture",
      "Validate metadata-only architecture compliance.",
      15,
    ),
    category(
      "Documentation",
      "Documentation",
      "Validate documentation integrity of validation metadata.",
      16,
    ),
  ]);
