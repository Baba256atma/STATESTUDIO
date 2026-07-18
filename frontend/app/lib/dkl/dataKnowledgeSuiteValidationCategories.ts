/**
 * DKL-9:4 — Data Knowledge Suite Validation Categories.
 *
 * Categories, severities, and outcomes for Suite validation.
 * Metadata-only.
 *
 * Ownership: owned exclusively by DKL-9:4.
 */

import type {
  DataKnowledgeSuiteValidationCategory,
  DataKnowledgeSuiteValidationCategoryDescriptor,
  DataKnowledgeSuiteValidationOutcomeDescriptor,
  DataKnowledgeSuiteValidationSeverityDescriptor,
} from "./dataKnowledgeSuiteValidationTypes.ts";

const category = (
  categoryName: DataKnowledgeSuiteValidationCategory,
  description: string,
  order: number,
): DataKnowledgeSuiteValidationCategoryDescriptor =>
  Object.freeze({
    categoryId: `DKL-9:4/Category/${categoryName}`,
    category: categoryName,
    description,
    deterministicOrder: order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly twelve validation categories. */
export const DataKnowledgeSuiteValidationCategories: readonly DataKnowledgeSuiteValidationCategoryDescriptor[] =
  Object.freeze([
    category("Identity", "Suite and validation identity integrity.", 1),
    category("Dependency", "Sole Model dependency and import prohibitions.", 2),
    category("Composition", "Suite composition structural integrity.", 3),
    category("Capability", "Capability catalog completeness and uniqueness.", 4),
    category("Ordering", "Canonical capability ordering integrity.", 5),
    category(
      "ReferenceIntegrity",
      "Canonical reference preservation across suite models.",
      6,
    ),
    category("Platform", "Public platform reference integrity.", 7),
    category("ApiRegistry", "Public API registry reference integrity.", 8),
    category("Ownership", "Suite ownership declaration integrity.", 9),
    category("Boundaries", "Suite boundary declaration integrity.", 10),
    category("Inventory", "Canonical inventory consistency.", 11),
    category("Readiness", "Validation and Manifest readiness consistency.", 12),
  ]);

/** Validation severities. */
export const DataKnowledgeSuiteValidationSeverities: readonly DataKnowledgeSuiteValidationSeverityDescriptor[] =
  Object.freeze([
    Object.freeze({
      severityId: "DKL-9:4/Severity/Info",
      severity: "Info" as const,
      description: "Informational metadata observation.",
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      severityId: "DKL-9:4/Severity/Warning",
      severity: "Warning" as const,
      description: "Non-blocking warning outcome.",
      deterministicOrder: 2,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      severityId: "DKL-9:4/Severity/Error",
      severity: "Error" as const,
      description: "Blocking structural validation error.",
      deterministicOrder: 3,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      severityId: "DKL-9:4/Severity/Critical",
      severity: "Critical" as const,
      description: "Critical blocking integrity failure.",
      deterministicOrder: 4,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);

/** Validation outcomes — Pass, Fail, Warning, NotApplicable only. */
export const DataKnowledgeSuiteValidationOutcomes: readonly DataKnowledgeSuiteValidationOutcomeDescriptor[] =
  Object.freeze([
    Object.freeze({
      outcomeId: "DKL-9:4/Outcome/Pass",
      outcome: "Pass" as const,
      description: "Structural check satisfied.",
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      outcomeId: "DKL-9:4/Outcome/Fail",
      outcome: "Fail" as const,
      description: "Structural check failed.",
      deterministicOrder: 2,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      outcomeId: "DKL-9:4/Outcome/Warning",
      outcome: "Warning" as const,
      description: "Non-blocking warning observation.",
      deterministicOrder: 3,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      outcomeId: "DKL-9:4/Outcome/NotApplicable",
      outcome: "NotApplicable" as const,
      description: "Check not applicable to suite composition scope.",
      deterministicOrder: 4,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
