/**
 * DKL-7:2 — Knowledge Services Ownership Registry.
 *
 * Registers DKL-7:1 ownership and boundary prohibitions by canonical reference.
 * Preserves exact Foundation inventories without transferring ownership.
 *
 * Ownership: owned exclusively by DKL-7:2.
 */

import {
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
} from "./knowledgeServicesFoundation.ts";
import type {
  KnowledgeServiceBoundaryRegistration,
  KnowledgeServiceOwnershipRegistration,
  KnowledgeServicesBoundaryClassification,
} from "./knowledgeServicesRegistryTypes.ts";

const BOUNDARY_CLASSIFICATIONS: Readonly<
  Record<string, KnowledgeServicesBoundaryClassification>
> = Object.freeze({
  "Runtime execution": "runtime",
  "Repository implementation": "repository",
  SQL: "persistence",
  NoSQL: "persistence",
  "Vector databases": "persistence",
  "Graph databases": "persistence",
  "Caching implementation": "persistence",
  "API implementation": "transport",
  "REST endpoints": "network",
  "HTTP clients": "network",
  Authentication: "security",
  Authorization: "security",
  "External connectors": "integration",
  "Business logic": "reasoning",
  "Executive reasoning": "reasoning",
  Planning: "reasoning",
  "Decision generation": "reasoning",
  "Scene generation": "visualization",
  Visualization: "visualization",
  UI: "visualization",
  Logging: "infrastructure",
  Telemetry: "infrastructure",
  Reflection: "runtime",
  "Dynamic loading": "runtime",
  "Dependency injection": "runtime",
  Threading: "runtime",
  Queues: "runtime",
  "Background jobs": "runtime",
  "Network communication": "network",
});

/** Owned responsibility registrations preserved from Foundation. */
export const KnowledgeServiceOwnedRegistrations: readonly KnowledgeServiceOwnershipRegistration[] =
  Object.freeze(
    KnowledgeServicesFoundation.ownership.owns.map((declaration, index) =>
      Object.freeze({
        id: `DKL-7:2/Ownership/Owns/${index + 1}`,
        name: declaration,
        category: "ownership" as const,
        description: `DKL-7 owned responsibility: ${declaration}.`,
        owner: "DKL-7" as const,
        status: "Registered" as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        ownershipKind: "owns" as const,
        declaration,
        foundationReference: `${KnowledgeServicesFoundation.ownership.ownershipId}#owns/${index + 1}`,
      }),
    ),
  );

/** Non-owned responsibility registrations preserved from Foundation. */
export const KnowledgeServiceNonOwnedRegistrations: readonly KnowledgeServiceOwnershipRegistration[] =
  Object.freeze(
    KnowledgeServicesFoundation.ownership.doesNotOwn.map(
      (declaration, index) =>
        Object.freeze({
          id: `DKL-7:2/Ownership/DoesNotOwn/${index + 1}`,
          name: declaration,
          category: "ownership" as const,
          description: `DKL-7 non-owned responsibility: ${declaration}.`,
          owner: "DKL-7" as const,
          status: "Registered" as const,
          runtimeBehavior: "None" as const,
          metadataOnly: true as const,
          deterministicOrder: index + 1,
          ownershipKind: "doesNotOwn" as const,
          declaration,
          foundationReference: `${KnowledgeServicesFoundation.ownership.ownershipId}#doesNotOwn/${index + 1}`,
        }),
    ),
  );

/** Boundary prohibition registrations preserved from Foundation. */
export const KnowledgeServiceBoundaryRegistrations: readonly KnowledgeServiceBoundaryRegistration[] =
  Object.freeze(
    KnowledgeServicesFoundation.boundaries.prohibitedSurfaces.map(
      (surface, index) =>
        Object.freeze({
          id: `DKL-7:2/Boundary/${index + 1}`,
          name: surface,
          category: "boundary" as const,
          description: `Prohibited Knowledge Services surface: ${surface}.`,
          owner: "DKL-7" as const,
          status: "Registered" as const,
          runtimeBehavior: "None" as const,
          metadataOnly: true as const,
          deterministicOrder: index + 1,
          surface,
          classification: BOUNDARY_CLASSIFICATIONS[surface] ?? "infrastructure",
          foundationReference: `${KnowledgeServicesFoundation.boundaries.boundariesId}#${index + 1}`,
          prohibited: true as const,
        }),
    ),
  );

/** Canonical immutable ownership and boundary registry. */
export const KnowledgeServicesOwnershipRegistry = Object.freeze({
  registryId: "DKL-7:2/KnowledgeServicesOwnershipRegistry",
  sourcePhase: "DKL-7:2" as const,
  foundationId: KnowledgeServicesFoundationId,
  owns: KnowledgeServiceOwnedRegistrations,
  doesNotOwn: KnowledgeServiceNonOwnedRegistrations,
  boundaries: KnowledgeServiceBoundaryRegistrations,
  ownedCount: KnowledgeServiceOwnedRegistrations.length,
  nonOwnedCount: KnowledgeServiceNonOwnedRegistrations.length,
  prohibitedSurfaceCount: KnowledgeServiceBoundaryRegistrations.length,
  foundationOwns: KnowledgeServicesFoundation.ownership.owns,
  foundationDoesNotOwn: KnowledgeServicesFoundation.ownership.doesNotOwn,
  foundationProhibitedSurfaces:
    KnowledgeServicesFoundation.boundaries.prohibitedSurfaces,
  notes: Object.freeze({
    metadataOnly: true,
    preservesExactInventories: true,
    noOwnershipTransfer: true,
    dkl6RetainsRepositoryOwnership: true,
    noRepositoryImplementationOwnership: true,
    noTransportOwnership: true,
    noAuthenticationOwnership: true,
    noReasoningOwnership: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
