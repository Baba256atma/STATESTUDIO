/**
 * RTC-1:4 — Executive Context Validation Result.
 *
 * Structured immutable validation result model.
 * No exceptions are used as business validation.
 *
 * Ownership: owned exclusively by RTC-1:4.
 */

import type { ExecutiveContextValidationCategoryName } from "./executiveContextValidationCategories.ts";
import type { ExecutiveContextValidationSeverityLevel } from "./executiveContextValidationSeverity.ts";

/** Canonical validation outcome status. */
export type ExecutiveContextValidationStatus =
  | "Passed"
  | "PassedWithWarnings"
  | "Failed"
  | "Blocked";

/** Single rule evaluation result structure. */
export interface ExecutiveContextValidationRuleResultModel {
  readonly resultFieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly required: true;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** ValidationResult structural model. */
export interface ExecutiveContextValidationResultModel {
  readonly resultModelId: "RTC-1:4/ValidationResult";
  readonly fields: readonly ExecutiveContextValidationRuleResultModel[];
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
): ExecutiveContextValidationRuleResultModel =>
  Object.freeze({
    resultFieldId: `RTC-1:4/ValidationResult/Field/${fieldName}`,
    fieldName,
    description,
    required: true as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Structured ValidationResult model.
 * Identity, Status, Rule Results, Warnings, Errors, Timestamp.
 */
export const ExecutiveContextValidationResultModelDeclaration:
  ExecutiveContextValidationResultModel = Object.freeze({
    resultModelId: "RTC-1:4/ValidationResult" as const,
    fields: Object.freeze([
      resultField("identity", "Validation result identity.", 1),
      resultField("status", "Overall validation status.", 2),
      resultField("ruleResults", "Per-rule evaluation results.", 3),
      resultField("warnings", "Non-blocking warning collection.", 4),
      resultField("errors", "Blocking error collection.", 5),
      resultField("timestamp", "Immutable evaluation timestamp metadata.", 6),
    ]),
    fieldCount: 6,
    immutableResults: true as const,
    usesExceptionsAsBusinessValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Declared validation status vocabulary. */
export const ExecutiveContextValidationStatuses = Object.freeze([
  Object.freeze({
    statusId: "RTC-1:4/Status/Passed",
    status: "Passed" as const,
    description: "All rules passed without warnings.",
    activationPermitted: true as const,
  }),
  Object.freeze({
    statusId: "RTC-1:4/Status/PassedWithWarnings",
    status: "PassedWithWarnings" as const,
    description: "Rules passed with non-blocking warnings.",
    activationPermitted: true as const,
  }),
  Object.freeze({
    statusId: "RTC-1:4/Status/Failed",
    status: "Failed" as const,
    description: "One or more Error-severity rule failures.",
    activationPermitted: false as const,
  }),
  Object.freeze({
    statusId: "RTC-1:4/Status/Blocked",
    status: "Blocked" as const,
    description: "One or more Critical-severity rule failures.",
    activationPermitted: false as const,
  }),
] as const);

/** Declarative rule-result shape used by the registry. */
export interface ExecutiveContextValidationRuleResultShape {
  readonly ruleId: string;
  readonly category: ExecutiveContextValidationCategoryName;
  readonly severity: ExecutiveContextValidationSeverityLevel;
  readonly passed: boolean;
  readonly message: string;
  readonly preventsActivation: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}
