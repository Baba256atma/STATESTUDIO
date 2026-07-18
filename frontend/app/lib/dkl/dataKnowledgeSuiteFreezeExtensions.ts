/**
 * DKL-9:8 — Data Knowledge Suite Freeze Extensions.
 *
 * Exactly eight declarative extension locks for additive-only future change.
 *
 * Ownership: owned exclusively by DKL-9:8.
 */

import type { DataKnowledgeSuiteFreezeExtensionLock } from "./dataKnowledgeSuiteFreezeTypes.ts";

const extensionLock = (
  order: number,
  name: string,
  description: string,
  protectedScope: string,
  allowedChange: string,
  prohibitedChange: string,
  breakingChangeRequired: boolean,
): DataKnowledgeSuiteFreezeExtensionLock =>
  Object.freeze({
    id: `DKL-9:8/ExtensionLock/${name}`,
    name,
    description,
    protectedScope,
    allowedChange,
    prohibitedChange,
    breakingChangeRequired,
    status: "Active" as const,
    deterministicOrder: order,
    metadataOnly: true as const,
  });

/** Exactly eight extension locks. */
export const DataKnowledgeSuiteFreezeExtensionLocks: readonly DataKnowledgeSuiteFreezeExtensionLock[] =
  Object.freeze([
    extensionLock(
      1,
      "AdditiveExtensionsOnly",
      "Future change remains additive-only at Freeze scope.",
      "DKL-9 Freeze architecture",
      "Additive metadata declarations",
      "Destructive or semantic replacement of frozen architecture",
      true,
    ),
    extensionLock(
      2,
      "MajorVersionForBreakingChanges",
      "Breaking changes require a major version.",
      "Versioning",
      "Major version bump for breaking change",
      "Silent breaking change under same major version",
      true,
    ),
    extensionLock(
      3,
      "NoPublicSurfaceMutation",
      "Existing top-level public exports must not be mutated, renamed, or removed.",
      "Public exports",
      "Add exports only with major-version review",
      "Mutate, rename, or remove existing exports",
      true,
    ),
    extensionLock(
      4,
      "NoInventoryReconstruction",
      "Frozen upstream inventories must not be reconstructed.",
      "Upstream inventories",
      "Reference existing Certification inventories",
      "Rebuild or rematerialize upstream inventories",
      true,
    ),
    extensionLock(
      5,
      "NoBackwardDependencies",
      "Later phases must not create backward dependencies.",
      "Dependency chain",
      "Forward-only dependency edges",
      "Import older phases from newer consumers incorrectly",
      true,
    ),
    extensionLock(
      6,
      "NoDuplicateMetadata",
      "Upstream metadata must not be duplicated into Freeze-owned collections.",
      "Metadata uniqueness",
      "Preserve by reference",
      "Duplicate upstream metadata",
      true,
    ),
    extensionLock(
      7,
      "NoReferenceReplacement",
      "Canonical upstream references must not be replaced with reconstructed objects.",
      "Canonical references",
      "Preserve Certification-chain references",
      "Replace references with new object graphs",
      true,
    ),
    extensionLock(
      8,
      "CanonicalReferencePreservation",
      "Canonical reference preservation remains mandatory across Freeze consumers.",
      "Reference integrity",
      "Consume by reference through Certification",
      "Bypass Certification or break reference identity",
      true,
    ),
  ]);
