/**
 * DKL-8:8 — Knowledge Governance Freeze Extensions.
 *
 * Exactly eight declarative extension locks for additive-only future change.
 *
 * Ownership: owned exclusively by DKL-8:8.
 */

import type { KnowledgeGovernanceFreezeExtensionLock } from "./knowledgeGovernanceFreezeTypes.ts";

const extensionLock = (
  order: number,
  name: string,
  description: string,
  protectedScope: string,
  allowedChange: string,
  prohibitedChange: string,
  breakingChangeRequired: boolean,
): KnowledgeGovernanceFreezeExtensionLock =>
  Object.freeze({
    id: `DKL-8:8/ExtensionLock/${name}`,
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
export const KnowledgeGovernanceFreezeExtensionLocks: readonly KnowledgeGovernanceFreezeExtensionLock[] =
  Object.freeze([
    extensionLock(
      1,
      "NoExistingIdMutation",
      "Existing canonical IDs must not be mutated.",
      "Canonical IDs",
      "Add new IDs under new namespaces",
      "Mutate or reuse existing IDs",
      true,
    ),
    extensionLock(
      2,
      "NoExistingExportRemoval",
      "Existing top-level public exports must not be removed.",
      "Public exports",
      "Add exports only with major-version review",
      "Remove existing exports",
      true,
    ),
    extensionLock(
      3,
      "NoExistingExportRename",
      "Existing top-level public exports must not be renamed.",
      "Public exports",
      "Introduce additive aliases only under version policy",
      "Rename existing exports",
      true,
    ),
    extensionLock(
      4,
      "NoExistingCollectionReconstruction",
      "Frozen upstream collections must not be reconstructed.",
      "Upstream collections",
      "Reference existing collections",
      "Rebuild or rematerialize upstream collections",
      true,
    ),
    extensionLock(
      5,
      "NoBackwardDependency",
      "Later phases must not create backward dependencies.",
      "Dependency chain",
      "Forward-only dependency edges",
      "Import older phases from newer consumers incorrectly",
      true,
    ),
    extensionLock(
      6,
      "NoBoundaryOwnershipExpansion",
      "DKL-8 must not expand into prohibited ownership domains.",
      "Ownership and boundaries",
      "Preserve declared non-ownership",
      "Claim Engine, NEA, UI, Repository, or security ownership",
      true,
    ),
    extensionLock(
      7,
      "AdditiveExtensionsOnly",
      "Future change remains additive-only at Freeze scope.",
      "DKL-8 Freeze architecture",
      "Additive metadata declarations",
      "Destructive or semantic replacement of frozen architecture",
      true,
    ),
    extensionLock(
      8,
      "MajorVersionForBreakingChange",
      "Breaking changes require a major version.",
      "Versioning",
      "Major version bump for breaking change",
      "Silent breaking change under same major version",
      true,
    ),
  ]);
