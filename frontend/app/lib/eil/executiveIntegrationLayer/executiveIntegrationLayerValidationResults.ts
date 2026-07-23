/**
 * EIL-9:4 — Executive Integration Layer Validation Results.
 *
 * Immutable declared validation result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-9:4.
 */

import {
  ExecutiveIntegrationLayerModelCanonicalId,
  ExecutiveIntegrationLayerModelIdentity,
} from "./executiveIntegrationLayerModel.ts";

/** Allowed validation result values. */
export type LayerValidationResultValue = "Pass" | "Warning" | "NotApplicable";

/** Immutable declared result descriptor. */
export interface ExecutiveIntegrationLayerValidationResult {
  readonly resultId: `EIL-9:4/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: LayerValidationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.validation";
  readonly sourceModelId: typeof ExecutiveIntegrationLayerModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const ExecutiveIntegrationLayerValidationResultValues = Object.freeze([
  "Pass",
  "Warning",
  "NotApplicable",
] as const satisfies readonly LayerValidationResultValue[]);

/** Aggregate architectural validation result. */
export const ExecutiveIntegrationLayerValidationAggregateResult =
  "Pass" as const satisfies LayerValidationResultValue;

/**
 * Declared result records describing architectural outcomes.
 * Descriptive only — not counted in the validation inventory of 66.
 */
export const ExecutiveIntegrationLayerValidationResults: readonly ExecutiveIntegrationLayerValidationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-9:4/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: ExecutiveIntegrationLayerValidationAggregateResult,
      description:
        "Declared aggregate architectural validation result for Executive Integration Layer Model.",
      order: 1,
      namespace: "nexora.eil.executive-integration-layer.validation" as const,
      sourceModelId: ExecutiveIntegrationLayerModelCanonicalId,
      sourceReference: `${ExecutiveIntegrationLayerModelIdentity.canonicalId}/validation/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
