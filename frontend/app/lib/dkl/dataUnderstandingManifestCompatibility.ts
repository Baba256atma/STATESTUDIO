/**
 * DKL-3:5 — Data Understanding Manifest Compatibility.
 *
 * Immutable compatibility declarations for the Manifest layer.
 * No runtime compatibility logic.
 *
 * Ownership: owned exclusively by DKL-3:5.
 */

import type { ManifestCompatibilityEntry } from "./dataUnderstandingManifestTypes.ts";

const decl = (
  compatibilityId: string,
  name: string,
  status: ManifestCompatibilityEntry["status"],
  description: string,
): ManifestCompatibilityEntry =>
  Object.freeze({ compatibilityId, name, status, description });

const ENTRIES: readonly ManifestCompatibilityEntry[] = Object.freeze([
  decl(
    "ForwardCompatibleToPlatform",
    "Forward Compatible to Platform",
    "ForwardCompatible",
    "Manifest metadata is intended for DKL-3:6 Platform aggregation without schema rename.",
  ),
  decl(
    "BackwardCompatibleWithFoundation",
    "Backward Compatible with Foundation",
    "Compatible",
    "Manifest inventories DKL-3:1 foundation contracts by reference.",
  ),
  decl(
    "BackwardCompatibleWithRegistry",
    "Backward Compatible with Registry",
    "Compatible",
    "Manifest inventories DKL-3:2 registry metadata by reference.",
  ),
  decl(
    "BackwardCompatibleWithModel",
    "Backward Compatible with Model",
    "Compatible",
    "Manifest inventories DKL-3:3 model schemas by reference.",
  ),
  decl(
    "BackwardCompatibleWithValidation",
    "Backward Compatible with Validation",
    "Compatible",
    "Manifest inventories DKL-3:4 validation rules by reference.",
  ),
  decl(
    "PublicApiCompatibility",
    "Public API Compatibility",
    "Compatible",
    "Each DKL-3 phase public API surface remains eight exports and is inventoried.",
  ),
  decl(
    "RegistryCompatibility",
    "Registry Compatibility",
    "Compatible",
    "Registry entry identifiers remain the source of truth for registered kinds.",
  ),
  decl(
    "ModelCompatibility",
    "Model Compatibility",
    "Compatible",
    "Model kinds and field catalogs remain metadata-only and provisional.",
  ),
  decl(
    "ValidationCompatibility",
    "Validation Compatibility",
    "Compatible",
    "Validation summaries remain the only validation outputs; Manifest does not re-validate.",
  ),
  decl(
    "DependencyCompatibility",
    "Dependency Compatibility",
    "Compatible",
    "Only approved upstream dependencies are published; future phases are forbidden.",
  ),
  decl(
    "VersionCompatibility",
    "Version Compatibility",
    "Compatible",
    "Manifest version 1.0.0 aligns with Foundation/Registry/Model/Validation 1.0.0 surfaces.",
  ),
  decl(
    "BusinessObjectCompatibilityForbidden",
    "Business Object Compatibility Forbidden",
    "Forbidden",
    "Manifest must never claim Business Object construction compatibility.",
  ),
]);

/** Canonical immutable compatibility inventory. */
export const DataUnderstandingManifestCompatibility = Object.freeze({
  compatibilityInventoryId: "DKL-3:5/ManifestCompatibility",
  sourcePhase: "DKL-3:5",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  runtimeCompatibilityLogic: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
