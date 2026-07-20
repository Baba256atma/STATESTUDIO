/**
 * NEA-7:1 — Intake Orchestration Capabilities.
 *
 * Immutable capability declarations for Intake Orchestration Foundation.
 * Capabilities are declarative only — no runtime execution.
 *
 * Ownership: owned exclusively by NEA-7:1.
 */

import type {
  IntakeOrchestrationCapabilityDeclaration,
  IntakeOrchestrationCapabilityId,
} from "./intakeOrchestrationFoundationTypes.ts";

const capability = (
  capabilityId: IntakeOrchestrationCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): IntakeOrchestrationCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical intake orchestration capability catalog — exactly eight. */
export const IntakeOrchestrationCapabilities: readonly IntakeOrchestrationCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "IntakeAssemblyDeclaration",
      "Intake Assembly Declaration",
      "Declarative ability to declare intake assembly vocabulary — no runtime assembly.",
      1,
    ),
    capability(
      "IntakeReferenceAggregation",
      "Intake Reference Aggregation",
      "Declarative ability to declare intake reference aggregation — no content duplication.",
      2,
    ),
    capability(
      "IntakeCompletenessDeclaration",
      "Intake Completeness Declaration",
      "Declarative ability to declare intake completeness vocabulary.",
      3,
    ),
    capability(
      "IntakeMetadataDeclaration",
      "Intake Metadata Declaration",
      "Declarative ability to declare intake metadata vocabulary.",
      4,
    ),
    capability(
      "IntakeCorrelationDeclaration",
      "Intake Correlation Declaration",
      "Declarative ability to declare intake correlation vocabulary.",
      5,
    ),
    capability(
      "IntakePublicationDeclaration",
      "Intake Publication Declaration",
      "Declarative ability to declare intake publication vocabulary.",
      6,
    ),
    capability(
      "IntakeSummaryDeclaration",
      "Intake Summary Declaration",
      "Declarative ability to declare intake summary vocabulary.",
      7,
    ),
    capability(
      "IntakeBoundaryDeclaration",
      "Intake Boundary Declaration",
      "Declarative ability to declare intake boundary vocabulary.",
      8,
    ),
  ]);

/** Canonical immutable capability catalog. */
export const IntakeOrchestrationCapabilityCatalog = Object.freeze({
  catalogId: "NEA-7:1/CapabilityCatalog",
  sourcePhase: "NEA-7:1" as const,
  capabilities: IntakeOrchestrationCapabilities,
  capabilityCount: IntakeOrchestrationCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
