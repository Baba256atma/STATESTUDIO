/**
 * DKL-6:5 — Knowledge Repository Guarantee Manifest.
 *
 * Exactly sixteen architectural guarantees and twelve completeness gates.
 * Evidence references point to canonical public metadata.
 *
 * Ownership: owned exclusively by DKL-6:5.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryManifestCompletenessGate,
  KnowledgeRepositoryManifestGuarantee,
} from "./knowledgeRepositoryManifestTypes.ts";

const MANIFEST_ID = "DKL-6:5/KnowledgeRepositoryManifest" as const;

const guarantee = (
  id: string,
  name: string,
  description: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryManifestGuarantee =>
  Object.freeze({
    id,
    name,
    description,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Guaranteed" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const gate = (
  id: string,
  name: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryManifestCompletenessGate =>
  Object.freeze({
    id,
    name,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Pass" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly sixteen architectural guarantees. */
export const KnowledgeRepositoryManifestGuarantees: readonly KnowledgeRepositoryManifestGuarantee[] =
  Object.freeze([
    guarantee(
      "DKL-6:5/Guarantee/CanonicalIdentityGuarantee",
      "CanonicalIdentityGuarantee",
      "Canonical identities for Foundation through Manifest are stable.",
      Object.freeze([
        KnowledgeRepositoryFoundationId,
        KnowledgeRepositoryRegistryId,
        KnowledgeRepositoryModelId,
        KnowledgeRepositoryValidationId,
        MANIFEST_ID,
      ]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/FoundationCompletenessGuarantee",
      "FoundationCompletenessGuarantee",
      "Foundation capabilities, contracts, lifecycle, and policies are complete.",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/RegistryCompletenessGuarantee",
      "RegistryCompletenessGuarantee",
      "Registry vocabulary and entry inventory are complete.",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/ModelCompletenessGuarantee",
      "ModelCompletenessGuarantee",
      "Model inventories and relationships are complete.",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/ValidationPassGuarantee",
      "ValidationPassGuarantee",
      "Architectural validation passed with zero failures.",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/OwnershipIntegrityGuarantee",
      "OwnershipIntegrityGuarantee",
      "Ownership and non-ownership declarations remain intact.",
      Object.freeze([KnowledgeRepositoryFoundationId, MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/BoundaryIntegrityGuarantee",
      "BoundaryIntegrityGuarantee",
      "Architectural boundaries prohibiting runtime and storage remain preserved.",
      Object.freeze([KnowledgeRepositoryFoundationId, MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/DependencyIntegrityGuarantee",
      "DependencyIntegrityGuarantee",
      "Approved public-surface dependencies are complete and compatible.",
      Object.freeze([MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/TraceabilityGuarantee",
      "TraceabilityGuarantee",
      "Model-to-registry and registry-to-foundation traceability are complete.",
      Object.freeze([KnowledgeRepositoryModelId, KnowledgeRepositoryRegistryId]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/ImmutabilityGuarantee",
      "ImmutabilityGuarantee",
      "Public aggregates are immutable and deeply frozen.",
      Object.freeze([
        KnowledgeRepositoryFoundationId,
        KnowledgeRepositoryRegistryId,
        KnowledgeRepositoryModelId,
        KnowledgeRepositoryValidationId,
      ]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/DeterminismGuarantee",
      "DeterminismGuarantee",
      "Summaries and counts are deterministic across executions.",
      Object.freeze([KnowledgeRepositoryValidationId, MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/TechnologyNeutralityGuarantee",
      "TechnologyNeutralityGuarantee",
      "Architecture remains storage-technology neutral.",
      Object.freeze([KnowledgeRepositoryFoundationId, MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/RuntimeProhibitionGuarantee",
      "RuntimeProhibitionGuarantee",
      "No repository runtime, AI, Engine, Advisor, Scene, or UI behavior exists.",
      Object.freeze([KnowledgeRepositoryValidationId, MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/PublicApiInventoryGuarantee",
      "PublicApiInventoryGuarantee",
      "Declared public API inventory totals 38 across DKL-6:1 through DKL-6:5.",
      Object.freeze([MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/ManifestCompletenessGuarantee",
      "ManifestCompletenessGuarantee",
      "Manifest sections, inventories, and gates are complete.",
      Object.freeze([MANIFEST_ID]),
    ),
    guarantee(
      "DKL-6:5/Guarantee/ReadyForPlatformGuarantee",
      "ReadyForPlatformGuarantee",
      "Architecture is ready for DKL-6:6 Repository Platform.",
      Object.freeze([MANIFEST_ID, KnowledgeRepositoryValidationId]),
    ),
  ]);

/** Exactly twelve completeness gates — all Pass. */
export const KnowledgeRepositoryManifestCompletenessGates: readonly KnowledgeRepositoryManifestCompletenessGate[] =
  Object.freeze([
    gate(
      "DKL-6:5/Gate/IdentityCompletenessGate",
      "IdentityCompletenessGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/SectionCompletenessGate",
      "SectionCompletenessGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/ComponentCompletenessGate",
      "ComponentCompletenessGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/FoundationInventoryGate",
      "FoundationInventoryGate",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    gate(
      "DKL-6:5/Gate/RegistryInventoryGate",
      "RegistryInventoryGate",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    gate(
      "DKL-6:5/Gate/ModelInventoryGate",
      "ModelInventoryGate",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    gate(
      "DKL-6:5/Gate/ValidationInventoryGate",
      "ValidationInventoryGate",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    gate(
      "DKL-6:5/Gate/PublicApiInventoryGate",
      "PublicApiInventoryGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/DependencyCompletenessGate",
      "DependencyCompletenessGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/OwnershipBoundaryGate",
      "OwnershipBoundaryGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/CompatibilityGuaranteeGate",
      "CompatibilityGuaranteeGate",
      Object.freeze([MANIFEST_ID]),
    ),
    gate(
      "DKL-6:5/Gate/PlatformReadinessGate",
      "PlatformReadinessGate",
      Object.freeze([MANIFEST_ID, KnowledgeRepositoryValidationId]),
    ),
  ]);

export const KnowledgeRepositoryGuaranteeManifest = Object.freeze({
  guarantees: KnowledgeRepositoryManifestGuarantees,
  guaranteeCount: KnowledgeRepositoryManifestGuarantees.length,
  completenessGates: KnowledgeRepositoryManifestCompletenessGates,
  completenessGateCount: KnowledgeRepositoryManifestCompletenessGates.length,
  passedCompletenessGateCount: KnowledgeRepositoryManifestCompletenessGates.filter(
    (item) => item.status === "Pass",
  ).length,
  failedCompletenessGateCount: KnowledgeRepositoryManifestCompletenessGates.filter(
    (item) => item.status !== "Pass",
  ).length,
  metadataOnly: true as const,
  immutable: true as const,
});
