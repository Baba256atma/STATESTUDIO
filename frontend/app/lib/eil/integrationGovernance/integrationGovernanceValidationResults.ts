/**
 * EIL-7:4 — Integration Governance Validation Results.
 *
 * Immutable declared validation result vocabulary and aggregate result.
 * Metadata-only. No runtime evaluation.
 *
 * Ownership: owned exclusively by EIL-7:4.
 */

import {
  IntegrationGovernanceModelCanonicalId,
  IntegrationGovernanceModelIdentity,
} from "./integrationGovernanceModel.ts";

/** Allowed validation result values. */
export type GovernanceValidationResultValue =
  | "Pass"
  | "Warning"
  | "NotApplicable";

/** Immutable declared result descriptor. */
export interface IntegrationGovernanceValidationResult {
  readonly resultId: `EIL-7:4/Result/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly result: GovernanceValidationResultValue;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.integration-governance.validation";
  readonly sourceModelId: typeof IntegrationGovernanceModelCanonicalId;
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly evaluatesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Closed result vocabulary (allowed values only). */
export const IntegrationGovernanceValidationResultValues = Object.freeze([
  "Pass",
  "Warning",
  "NotApplicable",
] as const satisfies readonly GovernanceValidationResultValue[]);

/** Aggregate architectural validation result. */
export const IntegrationGovernanceValidationAggregateResult =
  "Pass" as const satisfies GovernanceValidationResultValue;

/**
 * Declared result records describing architectural outcomes.
 * Descriptive only — not counted in the validation inventory of 66.
 */
export const IntegrationGovernanceValidationResults: readonly IntegrationGovernanceValidationResult[] =
  Object.freeze([
    Object.freeze({
      resultId: "EIL-7:4/Result/AggregatePass" as const,
      canonicalKey: "AggregatePass",
      canonicalName: "Aggregate Pass",
      result: IntegrationGovernanceValidationAggregateResult,
      description:
        "Declared aggregate architectural validation result for Integration Governance Model.",
      order: 1,
      namespace: "nexora.eil.integration-governance.validation" as const,
      sourceModelId: IntegrationGovernanceModelCanonicalId,
      sourceReference: `${IntegrationGovernanceModelIdentity.canonicalId}/validation/results/AggregatePass`,
      executesRuntime: false as const,
      evaluatesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
