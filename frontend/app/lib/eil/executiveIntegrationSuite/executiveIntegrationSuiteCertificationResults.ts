/**
 * EIL-8:7 — Executive Integration Suite Certification Results.
 *
 * Immutable declared certification result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-8:7.
 */

import {
  ExecutiveIntegrationSuitePlatformCanonicalId,
  ExecutiveIntegrationSuitePlatformIdentity,
} from "./executiveIntegrationSuitePlatform.ts";

/** Allowed certification result values. */
export type SuiteCertificationResultValue =
  | "Pass"
  | "Conditional"
  | "NotApplicable";

/** Immutable declared result descriptor. */
export interface ExecutiveIntegrationSuiteCertificationResult {
  readonly resultId: `EIL-8:7/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: SuiteCertificationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.certification";
  readonly sourcePlatformId: typeof ExecutiveIntegrationSuitePlatformCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const ExecutiveIntegrationSuiteCertificationResultValues = Object.freeze([
  "Pass",
  "Conditional",
  "NotApplicable",
] as const satisfies readonly SuiteCertificationResultValue[]);

/** Aggregate architectural certification result. */
export const ExecutiveIntegrationSuiteCertificationAggregateResult =
  "Pass" as const satisfies SuiteCertificationResultValue;

/**
 * Declared result records describing architectural outcomes.
 */
export const ExecutiveIntegrationSuiteCertificationResults: readonly ExecutiveIntegrationSuiteCertificationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-8:7/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: ExecutiveIntegrationSuiteCertificationAggregateResult,
      description:
        "Declared aggregate architectural certification result for Executive Integration Suite Platform.",
      order: 1,
      namespace:
        "nexora.eil.executive-integration-suite.certification" as const,
      sourcePlatformId: ExecutiveIntegrationSuitePlatformCanonicalId,
      sourceReference: `${ExecutiveIntegrationSuitePlatformIdentity.canonicalId}/certification/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
