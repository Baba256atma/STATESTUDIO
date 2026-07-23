/**
 * EIL-1:4 — Integration Validation Findings.
 *
 * Immutable finding-state declarations for validation metadata.
 * Descriptive only. No finding execution.
 *
 * Ownership: owned exclusively by EIL-1:4.
 */

import type {
  IntegrationValidationFinding,
  IntegrationValidationFindingState,
} from "./integrationValidationTypes.ts";

const finding = (
  state: IntegrationValidationFindingState,
  description: string,
  ordinal: number,
): IntegrationValidationFinding =>
  Object.freeze({
    findingId: `EIL-1:4/Finding/${state}` as const,
    state,
    canonicalKey: state,
    canonicalName: state,
    description,
    ownership: "EIL-1:4" as const,
    ordinal,
    tags: Object.freeze(["finding-state", state.toLowerCase()]),
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly five finding-state declarations.
 */
export const IntegrationValidationFindings: readonly IntegrationValidationFinding[] =
  Object.freeze([
    finding("Pass", "Declared passing validation finding state.", 1),
    finding("Warning", "Declared warning validation finding state.", 2),
    finding("Error", "Declared error validation finding state.", 3),
    finding("Skipped", "Declared skipped validation finding state.", 4),
    finding(
      "NotApplicable",
      "Declared not-applicable validation finding state.",
      5,
    ),
  ]);
