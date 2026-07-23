/**
 * EIL-8:4 — Executive Integration Suite Validation Results.
 *
 * Immutable declared validation result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-8:4.
 */

import {
  ExecutiveIntegrationSuiteModelCanonicalId,
  ExecutiveIntegrationSuiteModelIdentity,
} from "./executiveIntegrationSuiteModel.ts";

/** Allowed validation result values. */
export type SuiteValidationResultValue = "Pass" | "Warning" | "NotApplicable";

/** Immutable declared result descriptor. */
export interface ExecutiveIntegrationSuiteValidationResult {
  readonly resultId: `EIL-8:4/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: SuiteValidationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.validation";
  readonly sourceModelId: typeof ExecutiveIntegrationSuiteModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const ExecutiveIntegrationSuiteValidationResultValues = Object.freeze([
  "Pass",
  "Warning",
  "NotApplicable",
] as const satisfies readonly SuiteValidationResultValue[]);

/** Aggregate architectural validation result. */
export const ExecutiveIntegrationSuiteValidationAggregateResult =
  "Pass" as const satisfies SuiteValidationResultValue;

/**
 * Declared result records describing architectural outcomes.
 * Descriptive only — not counted in the validation inventory of 66.
 */
export const ExecutiveIntegrationSuiteValidationResults: readonly ExecutiveIntegrationSuiteValidationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-8:4/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: ExecutiveIntegrationSuiteValidationAggregateResult,
      description:
        "Declared aggregate architectural validation result for Executive Integration Suite Model.",
      order: 1,
      namespace: "nexora.eil.executive-integration-suite.validation" as const,
      sourceModelId: ExecutiveIntegrationSuiteModelCanonicalId,
      sourceReference: `${ExecutiveIntegrationSuiteModelIdentity.canonicalId}/validation/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
