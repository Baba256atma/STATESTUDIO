/**
 * DKL-8:2 — Knowledge Governance Registry Catalog.
 *
 * Ownership declarations, boundary registrations, and catalog aggregation
 * counts. Metadata only.
 *
 * Ownership: owned exclusively by DKL-8:2.
 */

import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import type {
  KnowledgeGovernanceBoundaryRegistration,
  KnowledgeGovernanceOwnershipRegistration,
} from "./knowledgeGovernanceRegistryTypes.ts";

const foundation = KnowledgeGovernanceFoundationPlatform;

/** Ownership declarations — what DKL-8 owns. */
export const KnowledgeGovernanceOwnershipRegistry: readonly KnowledgeGovernanceOwnershipRegistration[] =
  Object.freeze(
    foundation.ownership.owns.map((name, index) =>
      Object.freeze({
        id: `DKL-8:2/Ownership/Owns/${index + 1}`,
        name,
        description: `DKL-8 owns: ${name}`,
        category: "ownership" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        owned: true as const,
      }),
    ),
  );

/** Non-ownership declarations — responsibilities owned elsewhere. */
export const KnowledgeGovernanceNonOwnershipRegistry: readonly KnowledgeGovernanceOwnershipRegistration[] =
  Object.freeze(
    foundation.ownership.doesNotOwn.map((name, index) =>
      Object.freeze({
        id: `DKL-8:2/Ownership/DoesNotOwn/${index + 1}`,
        name,
        description: `DKL-8 does not own: ${name}`,
        category: "ownership" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        owned: false as const,
      }),
    ),
  );

const BOUNDARY_OWNING_LAYER: Readonly<Record<string, string>> = Object.freeze({
  Authentication: "Security/runtime infrastructure",
  "Authorization enforcement": "Security/runtime infrastructure",
  "Identity provider integration": "Security/runtime infrastructure",
  "Channel communication": "NEA",
  "External API transport": "NEA",
  "Repository persistence": "DKL-6",
  "Database access": "DKL-6",
  "Knowledge retrieval": "DKL-7",
  "Knowledge search": "DKL-7",
  "Knowledge graph traversal": "DKL-7",
  "Knowledge interpretation": "DKL-3/DKL-4",
  "Knowledge validation": "DKL-5",
  "Business Object construction": "CORE/Business Object layer",
  "Executive reasoning": "Executive Engine",
  "Decision-making": "Executive Engine",
  Recommendations: "Executive Engine",
  "Workflow execution": "Operational runtime",
  "Task creation": "Operational runtime",
  Notifications: "Operational runtime",
  "Runtime audit logging": "Operational runtime",
  "Runtime compliance evaluation": "Operational runtime",
  "Legal interpretation": "External legal authority",
  "UI rendering": "UI",
  "Advisor responses": "Advisor",
  "Scene rendering": "Scene",
  "Policy execution": "Security/runtime infrastructure",
});

/** Boundary registrations for prohibited ownership areas. */
export const KnowledgeGovernanceBoundaryRegistry: readonly KnowledgeGovernanceBoundaryRegistration[] =
  Object.freeze(
    foundation.ownership.doesNotOwn.map((name, index) =>
      Object.freeze({
        id: `DKL-8:2/Boundary/${index + 1}`,
        name,
        description: `Prohibited DKL-8 ownership: ${name}`,
        category: "boundary" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        owningLayer: BOUNDARY_OWNING_LAYER[name] ?? "External/other layer",
        prohibited: true as const,
      }),
    ),
  );

/** Additional prohibited surfaces from foundation boundaries not already covered. */
export const KnowledgeGovernanceProhibitedSurfaceRegistry: readonly KnowledgeGovernanceBoundaryRegistration[] =
  Object.freeze(
    foundation.boundaries.prohibitedSurfaces.map((name, index) =>
      Object.freeze({
        id: `DKL-8:2/ProhibitedSurface/${index + 1}`,
        name,
        description: `Prohibited surface: ${name}`,
        category: "boundary" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        owningLayer: "External/other layer",
        prohibited: true as const,
      }),
    ),
  );

export const KnowledgeGovernanceRegistryCatalogMeta = Object.freeze({
  catalogId: "DKL-8:2/RegistryCatalog",
  ownershipCount: KnowledgeGovernanceOwnershipRegistry.length,
  nonOwnershipCount: KnowledgeGovernanceNonOwnershipRegistry.length,
  boundaryCount: KnowledgeGovernanceBoundaryRegistry.length,
  prohibitedSurfaceCount: KnowledgeGovernanceProhibitedSurfaceRegistry.length,
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});
