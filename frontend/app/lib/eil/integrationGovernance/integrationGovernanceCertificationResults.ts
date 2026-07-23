/**
 * EIL-7:7 — Integration Governance Certification Results.
 *
 * Immutable declared certification result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-7:7.
 */

import {
  IntegrationGovernancePlatformCanonicalId,
  IntegrationGovernancePlatformIdentity,
} from "./integrationGovernancePlatform.ts";

/** Allowed certification result values. */
export type GovernanceCertificationResultValue =
  | "Pass"
  | "Conditional"
  | "NotApplicable";

/** Immutable declared result descriptor. */
export interface IntegrationGovernanceCertificationResult {
  readonly resultId: `EIL-7:7/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: GovernanceCertificationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.certification";
  readonly sourcePlatformId: typeof IntegrationGovernancePlatformCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const IntegrationGovernanceCertificationResultValues = Object.freeze([
  "Pass",
  "Conditional",
  "NotApplicable",
] as const satisfies readonly GovernanceCertificationResultValue[]);

/** Aggregate architectural certification result. */
export const IntegrationGovernanceCertificationAggregateResult =
  "Pass" as const satisfies GovernanceCertificationResultValue;

/**
 * Declared result records describing architectural outcomes.
 */
export const IntegrationGovernanceCertificationResults: readonly IntegrationGovernanceCertificationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-7:7/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: IntegrationGovernanceCertificationAggregateResult,
      description:
        "Declared aggregate architectural certification result for Integration Governance Platform.",
      order: 1,
      namespace: "nexora.eil.integration-governance.certification" as const,
      sourcePlatformId: IntegrationGovernancePlatformCanonicalId,
      sourceReference: `${IntegrationGovernancePlatformIdentity.canonicalId}/certification/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
