/**
 * EIL-1:1 — Integration Foundation Responsibilities.
 *
 * Declared architectural responsibilities for the Executive Integration Layer.
 * Metadata only — no runtime execution.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type {
  IntegrationResponsibilityDeclaration,
  IntegrationResponsibilityId,
} from "./integrationFoundationTypes.ts";

const responsibility = (
  responsibilityId: IntegrationResponsibilityId,
  responsibilityName: string,
  description: string,
  order: number,
): IntegrationResponsibilityDeclaration =>
  Object.freeze({
    responsibilityId,
    responsibilityName,
    description,
    ownedByEil: true as const,
    executesRuntime: false as const,
    performsBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declared Integration Foundation responsibilities.
 */
export const IntegrationFoundationResponsibilities: readonly IntegrationResponsibilityDeclaration[] =
  Object.freeze([
    responsibility(
      "PreservePlatformBoundaries",
      "Preserve platform boundaries",
      "Preserve ownership boundaries of coordinated platforms without absorbing their internals.",
      1,
    ),
    responsibility(
      "CoordinateIntegrations",
      "Coordinate integrations",
      "Coordinate integration metadata across platforms without executing integrations.",
      2,
    ),
    responsibility(
      "ExposeCanonicalMetadata",
      "Expose canonical metadata",
      "Expose canonical identities, contracts, and terminology for downstream EIL phases.",
      3,
    ),
    responsibility(
      "MaintainInteroperability",
      "Maintain interoperability",
      "Maintain declarative interoperability rules across coordinated platforms.",
      4,
    ),
    responsibility(
      "PreventIllegalCoupling",
      "Prevent illegal coupling",
      "Declare rules that prevent illegal cross-platform coupling and boundary leakage.",
      5,
    ),
    responsibility(
      "PreserveDependencyDirection",
      "Preserve dependency direction",
      "Preserve approved dependency direction without introducing circular ownership.",
      6,
    ),
    responsibility(
      "MaintainArchitecturalConsistency",
      "Maintain architectural consistency",
      "Maintain architectural consistency of integration metadata across the EIL ladder.",
      7,
    ),
    responsibility(
      "SupportFutureRuntimeLayers",
      "Support future runtime layers",
      "Support future runtime layers by freezing metadata contracts without implementing them.",
      8,
    ),
  ]);

/** Canonical immutable responsibilities catalog. */
export const IntegrationFoundationResponsibilityCatalog = Object.freeze({
  catalogId: "EIL-1:1/IntegrationFoundationResponsibilities",
  sourcePhase: "EIL-1:1" as const,
  responsibilities: IntegrationFoundationResponsibilities,
  responsibilityCount: IntegrationFoundationResponsibilities.length,
  executesRuntime: false as const,
  performsBusinessLogic: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
