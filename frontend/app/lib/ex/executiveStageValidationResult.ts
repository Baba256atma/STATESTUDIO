/**
 * EX-1:4 — Executive Stage Validation Result.
 *
 * Structured immutable validation result model.
 * No exceptions are used as business validation.
 *
 * Ownership: owned exclusively by EX-1:4.
 */

import type { ExecutiveStageValidationCategoryName } from "./executiveStageValidationCategories.ts";
import type { ExecutiveStageValidationSeverityLevel } from "./executiveStageValidationSeverity.ts";

/** Canonical validation outcome status. */
export type ExecutiveStageValidationStatus =
  | "Passed"
  | "PassedWithWarnings"
  | "Failed"
  | "Blocked";

/** Single result-section field declaration. */
export interface ExecutiveStageValidationResultFieldModel {
  readonly resultFieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly required: true;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** ValidationResult structural model. */
export interface ExecutiveStageValidationResultModel {
  readonly resultModelId: "EX-1:4/ValidationResult";
  readonly fields: readonly ExecutiveStageValidationResultFieldModel[];
  readonly fieldCount: number;
  readonly immutableResults: true;
  readonly usesExceptionsAsBusinessValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const resultField = (
  fieldName: string,
  description: string,
  order: number,
): ExecutiveStageValidationResultFieldModel =>
  Object.freeze({
    resultFieldId: `EX-1:4/ValidationResult/Field/${fieldName}`,
    fieldName,
    description,
    required: true as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Structured ValidationResult model — seven sections.
 * Identity, Status, Category Results, Warnings, Errors, Timestamp, Stage Version.
 */
export const ExecutiveStageValidationResultModelDeclaration:
  ExecutiveStageValidationResultModel = Object.freeze({
    resultModelId: "EX-1:4/ValidationResult" as const,
    fields: Object.freeze([
      resultField("identity", "Validation result identity.", 1),
      resultField("status", "Overall validation status.", 2),
      resultField("categoryResults", "Per-category evaluation results.", 3),
      resultField("warnings", "Non-blocking warning collection.", 4),
      resultField("errors", "Blocking error collection.", 5),
      resultField("timestamp", "Immutable evaluation timestamp metadata.", 6),
      resultField("stageVersion", "Validated Stage version metadata.", 7),
    ]),
    fieldCount: 7,
    immutableResults: true as const,
    usesExceptionsAsBusinessValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Declared validation status vocabulary. */
export const ExecutiveStageValidationStatuses = Object.freeze([
  Object.freeze({
    statusId: "EX-1:4/Status/Passed",
    status: "Passed" as const,
    description: "All rules passed without warnings.",
    renderPermitted: true as const,
  }),
  Object.freeze({
    statusId: "EX-1:4/Status/PassedWithWarnings",
    status: "PassedWithWarnings" as const,
    description: "Rules passed with non-blocking warnings.",
    renderPermitted: true as const,
  }),
  Object.freeze({
    statusId: "EX-1:4/Status/Failed",
    status: "Failed" as const,
    description: "One or more Error-severity rule failures.",
    renderPermitted: false as const,
  }),
  Object.freeze({
    statusId: "EX-1:4/Status/Blocked",
    status: "Blocked" as const,
    description: "One or more Critical-severity rule failures.",
    renderPermitted: false as const,
  }),
] as const);

/** Declarative rule-result shape used by the registry. */
export interface ExecutiveStageValidationRuleResultShape {
  readonly ruleId: string;
  readonly category: ExecutiveStageValidationCategoryName;
  readonly severity: ExecutiveStageValidationSeverityLevel;
  readonly passed: boolean;
  readonly message: string;
  readonly preventsRendering: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}
