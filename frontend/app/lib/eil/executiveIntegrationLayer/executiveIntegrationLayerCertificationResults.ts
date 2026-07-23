/**
 * EIL-9:7 — Executive Integration Layer Certification Results.
 *
 * Immutable declared certification result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-9:7.
 */

import {
  ExecutiveIntegrationLayerPlatformCanonicalId,
  ExecutiveIntegrationLayerPlatformIdentity,
} from "./executiveIntegrationLayerPlatform.ts";

/** Allowed certification result values. */
export type LayerCertificationResultValue =
  | "Pass"
  | "Conditional"
  | "NotApplicable";

/** Immutable declared result descriptor. */
export interface ExecutiveIntegrationLayerCertificationResult {
  readonly resultId: `EIL-9:7/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: LayerCertificationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-layer.certification";
  readonly sourcePlatformId: typeof ExecutiveIntegrationLayerPlatformCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const ExecutiveIntegrationLayerCertificationResultValues = Object.freeze([
  "Pass",
  "Conditional",
  "NotApplicable",
] as const satisfies readonly LayerCertificationResultValue[]);

/** Aggregate architectural certification result. */
export const ExecutiveIntegrationLayerCertificationAggregateResult =
  "Pass" as const satisfies LayerCertificationResultValue;

/**
 * Declared result records describing architectural outcomes.
 */
export const ExecutiveIntegrationLayerCertificationResults: readonly ExecutiveIntegrationLayerCertificationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-9:7/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: ExecutiveIntegrationLayerCertificationAggregateResult,
      description:
        "Declared aggregate architectural certification result for Executive Integration Layer Platform.",
      order: 1,
      namespace:
        "nexora.eil.executive-integration-layer.certification" as const,
      sourcePlatformId: ExecutiveIntegrationLayerPlatformCanonicalId,
      sourceReference: `${ExecutiveIntegrationLayerPlatformIdentity.canonicalId}/certification/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
