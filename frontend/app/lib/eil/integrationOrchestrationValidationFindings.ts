/**
 * EIL-4:4 — Integration Orchestration Validation Findings.
 *
 * Immutable finding-state declarations for validation metadata.
 * Descriptive only. No finding execution.
 *
 * Ownership: owned exclusively by EIL-4:4.
 */

import type {
  IntegrationOrchestrationValidationFinding,
  OrchestrationValidationFindingState,
} from "./integrationOrchestrationValidationTypes.ts";

const finding = (
  state: OrchestrationValidationFindingState,
  description: string,
  ordinal: number,
): IntegrationOrchestrationValidationFinding =>
  Object.freeze({
    findingId: `EIL-4:4/Finding/${state}` as const,
    state,
    canonicalKey: state,
    canonicalName: state,
    description,
    ownership: "EIL-4:4" as const,
    ordinal,
    tags: Object.freeze(["finding-state", state.toLowerCase()]),
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly five finding-state declarations.
 */
export const IntegrationOrchestrationValidationFindings: readonly IntegrationOrchestrationValidationFinding[] =
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
