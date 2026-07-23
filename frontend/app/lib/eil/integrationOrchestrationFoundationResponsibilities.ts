/**
 * EIL-4:1 — Integration Orchestration Foundation Responsibilities.
 *
 * Declared architectural responsibilities for the Integration Orchestration Platform.
 * Metadata only — no runtime execution.
 *
 * Ownership: owned exclusively by EIL-4:1.
 */

import type {
  OrchestrationResponsibility,
  OrchestrationResponsibilityId,
} from "./integrationOrchestrationFoundationTypes.ts";

const responsibility = (
  responsibilityId: OrchestrationResponsibilityId,
  responsibilityName: string,
  description: string,
  order: number,
): OrchestrationResponsibility =>
  Object.freeze({
    responsibilityId,
    responsibilityName,
    description,
    ownedByEil4: true as const,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declared Integration Orchestration Foundation responsibilities.
 */
export const IntegrationOrchestrationFoundationResponsibilities: readonly OrchestrationResponsibility[] =
  Object.freeze([
    responsibility(
      "PreserveOrchestrationIdentity",
      "Preserve orchestration identity",
      "Preserve canonical orchestration identities across EIL-4 without mutation.",
      1,
    ),
    responsibility(
      "PreserveArchitecturalBoundaries",
      "Preserve architectural boundaries",
      "Preserve Nexora architectural boundaries when declaring orchestration metadata.",
      2,
    ),
    responsibility(
      "PublishOrchestrationMetadata",
      "Publish orchestration metadata",
      "Publish canonical orchestration categories, contracts, and terminology for downstream phases.",
      3,
    ),
    responsibility(
      "PreserveDependencyDirection",
      "Preserve dependency direction",
      "Preserve approved dependency direction without circular orchestration ownership.",
      4,
    ),
    responsibility(
      "PreserveCompatibility",
      "Preserve compatibility",
      "Preserve declarative compatibility rules for orchestration definitions.",
      5,
    ),
    responsibility(
      "PreserveDeterministicInventories",
      "Preserve deterministic inventories",
      "Preserve deterministic inventories derived from canonical orchestration collections.",
      6,
    ),
    responsibility(
      "SupportFutureRuntimePlatforms",
      "Support future runtime platforms",
      "Support future orchestration runtime platforms by freezing metadata without implementing them.",
      7,
    ),
    responsibility(
      "PreserveArchitecturalConsistency",
      "Preserve architectural consistency",
      "Preserve architectural consistency of orchestration metadata across the EIL-4 ladder.",
      8,
    ),
  ]);

/** Canonical immutable responsibilities catalog. */
export const IntegrationOrchestrationFoundationResponsibilityCatalog =
  Object.freeze({
    catalogId: "EIL-4:1/IntegrationOrchestrationFoundationResponsibilities",
    sourcePhase: "EIL-4:1" as const,
    responsibilities: IntegrationOrchestrationFoundationResponsibilities,
    responsibilityCount:
      IntegrationOrchestrationFoundationResponsibilities.length,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
