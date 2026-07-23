/**
 * EIL-6:7 — Integration Observability Certification Results.
 *
 * Immutable declared certification result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-6:7.
 */

import {
  IntegrationObservabilityPlatformCanonicalId,
  IntegrationObservabilityPlatformIdentity,
} from "./integrationObservabilityPlatform.ts";

/** Allowed certification result values. */
export type ObservabilityCertificationResultValue =
  | "Pass"
  | "Conditional"
  | "NotApplicable";

/** Immutable declared result descriptor. */
export interface IntegrationObservabilityCertificationResult {
  readonly resultId: `EIL-6:7/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: ObservabilityCertificationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-observability.certification";
  readonly sourcePlatformId: typeof IntegrationObservabilityPlatformCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const IntegrationObservabilityCertificationResultValues = Object.freeze([
  "Pass",
  "Conditional",
  "NotApplicable",
] as const satisfies readonly ObservabilityCertificationResultValue[]);

/** Aggregate architectural certification result. */
export const IntegrationObservabilityCertificationAggregateResult =
  "Pass" as const satisfies ObservabilityCertificationResultValue;

/**
 * Declared result records describing architectural outcomes.
 */
export const IntegrationObservabilityCertificationResults: readonly IntegrationObservabilityCertificationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-6:7/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: IntegrationObservabilityCertificationAggregateResult,
      description:
        "Declared aggregate architectural certification result for Integration Observability Platform.",
      order: 1,
      namespace: "nexora.eil.integration-observability.certification" as const,
      sourcePlatformId: IntegrationObservabilityPlatformCanonicalId,
      sourceReference: `${IntegrationObservabilityPlatformIdentity.canonicalId}/certification/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
