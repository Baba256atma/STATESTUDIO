/**
 * EIL-1:2 — Integration Responsibility Registry.
 *
 * Canonical registry for the eight Foundation responsibilities.
 * Enforcement classifications are declarative metadata only.
 *
 * Ownership: owned exclusively by EIL-1:2.
 */

import {
  IntegrationFoundationId,
  IntegrationFoundationNamespace,
  IntegrationFoundationPlatform,
} from "./integrationFoundation.ts";
import type {
  IntegrationEnforcementClassification,
  IntegrationResponsibilityRegistryEntry,
} from "./integrationRegistryTypes.ts";

const foundation = IntegrationFoundationPlatform;

const enforcementFor = (
  responsibilityId: string,
): IntegrationEnforcementClassification => {
  if (responsibilityId === "PreservePlatformBoundaries") return "Boundary";
  if (responsibilityId === "PreventIllegalCoupling") return "Boundary";
  if (responsibilityId === "PreserveDependencyDirection") return "Architectural";
  if (responsibilityId === "SupportFutureRuntimeLayers") return "Deferred";
  return "Declarative";
};

/**
 * Exactly eight responsibility registry entries preserving Foundation order.
 */
export const IntegrationResponsibilityRegistry: readonly IntegrationResponsibilityRegistryEntry[] =
  Object.freeze(
    foundation.responsibilityDeclarations.map((responsibility) =>
      Object.freeze({
        id:
          `EIL-1:2/Registry/Responsibility/${responsibility.responsibilityId}` as const,
        key: responsibility.responsibilityId,
        responsibilityKey: responsibility.responsibilityId,
        canonicalName: responsibility.responsibilityName,
        category: "Responsibility" as const,
        description: responsibility.description,
        architecturalOwner: "EIL" as const,
        sourcePhase: "EIL-1:1/IntegrationFoundation" as const,
        sourceNamespace: IntegrationFoundationNamespace,
        ownership: "EIL-1:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        enforcementClassification: enforcementFor(
          responsibility.responsibilityId,
        ),
        ordinal: responsibility.deterministicOrder,
        aliases: Object.freeze([
          responsibility.responsibilityId,
          responsibility.responsibilityName,
        ]),
        tags: Object.freeze(["responsibility", "foundation-reference"]),
        sourceReference:
          `${IntegrationFoundationId}/responsibilities/${responsibility.responsibilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen responsibility-registry catalog with derived count. */
export const IntegrationResponsibilityRegistryCatalog = Object.freeze({
  collectionId: "EIL-1:2/Collection/Responsibilities",
  category: "Responsibility" as const,
  sourcePhase: "EIL-1:2" as const,
  entries: IntegrationResponsibilityRegistry,
  entryCount: IntegrationResponsibilityRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
