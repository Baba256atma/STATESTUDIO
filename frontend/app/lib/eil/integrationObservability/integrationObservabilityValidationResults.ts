/**
 * EIL-6:4 — Integration Observability Validation Results.
 *
 * Immutable declared validation result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-6:4.
 */

import {
  IntegrationObservabilityModelCanonicalId,
  IntegrationObservabilityModelIdentity,
} from "./integrationObservabilityModel.ts";

/** Allowed validation result values. */
export type ObservabilityValidationResultValue =
  | "Pass"
  | "Warning"
  | "NotApplicable";

/** Immutable declared result descriptor. */
export interface IntegrationObservabilityValidationResult {
  readonly resultId: `EIL-6:4/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: ObservabilityValidationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-observability.validation";
  readonly sourceModelId: typeof IntegrationObservabilityModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const IntegrationObservabilityValidationResultValues = Object.freeze([
  "Pass",
  "Warning",
  "NotApplicable",
] as const satisfies readonly ObservabilityValidationResultValue[]);

/** Aggregate architectural validation result. */
export const IntegrationObservabilityValidationAggregateResult =
  "Pass" as const satisfies ObservabilityValidationResultValue;

/**
 * Declared result records describing architectural outcomes.
 * Descriptive only — not counted in the validation inventory of 66.
 */
export const IntegrationObservabilityValidationResults: readonly IntegrationObservabilityValidationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-6:4/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: IntegrationObservabilityValidationAggregateResult,
      description:
        "Declared aggregate architectural validation result for Integration Observability Model.",
      order: 1,
      namespace: "nexora.eil.integration-observability.validation" as const,
      sourceModelId: IntegrationObservabilityModelCanonicalId,
      sourceReference: `${IntegrationObservabilityModelIdentity.canonicalId}/validation/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
