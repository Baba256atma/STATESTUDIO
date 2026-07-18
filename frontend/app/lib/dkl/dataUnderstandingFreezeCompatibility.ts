/**
 * DKL-3:8 — Data Understanding Freeze Compatibility.
 *
 * Immutable compatibility declarations for freeze.
 * No runtime compatibility logic.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

import type { FreezeCompatibilityEntry } from "./dataUnderstandingFreezeTypes.ts";

const decl = (
  compatibilityId: string,
  name: string,
  status: FreezeCompatibilityEntry["status"],
  description: string,
): FreezeCompatibilityEntry =>
  Object.freeze({ compatibilityId, name, status, description });

const ENTRIES: readonly FreezeCompatibilityEntry[] = Object.freeze([
  decl(
    "FoundationFreezeCompatible",
    "Foundation Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:1 Foundation public identity and readiness declarations.",
  ),
  decl(
    "RegistryFreezeCompatible",
    "Registry Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:2 Registry public identity and inventories.",
  ),
  decl(
    "ModelFreezeCompatible",
    "Model Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:3 Model kinds and schema descriptors.",
  ),
  decl(
    "ValidationFreezeCompatible",
    "Validation Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:4 Validation rules without re-executing validation.",
  ),
  decl(
    "ManifestFreezeCompatible",
    "Manifest Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:5 Manifest inventories and readiness.",
  ),
  decl(
    "PlatformFreezeCompatible",
    "Platform Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:6 Platform namespace and section public APIs.",
  ),
  decl(
    "CertificationFreezeCompatible",
    "Certification Freeze Compatible",
    "Compatible",
    "Freeze locks DKL-3:7 Certification gates and ReadyForFreeze status.",
  ),
  decl(
    "PipelineFreezeCompatible",
    "Pipeline Freeze Compatible",
    "Compatible",
    "Freeze depends on Pipeline Understanding Platform ReadyForDKL3Intake.",
  ),
  decl(
    "Dkl2FreezeCompatible",
    "DKL-2 Freeze Compatible",
    "Compatible",
    "Freeze depends on the DKL-2 Public Index only.",
  ),
  decl(
    "ForwardCompatibleToPublicIndex",
    "Forward Compatible to Public Index",
    "ForwardCompatible",
    "Freeze metadata is intended for DKL-3:9 Public Index without schema rename.",
  ),
  decl(
    "Dkl4CompatibilityReferenceOnly",
    "DKL-4 Compatibility (Reference Only)",
    "Restricted",
    "DKL-4 remains a future consumer reference only; not imported or executed.",
  ),
  decl(
    "BusinessObjectCompatibilityForbidden",
    "Business Object Compatibility Forbidden",
    "Forbidden",
    "Freeze must never claim Business Object construction compatibility.",
  ),
  decl(
    "KnowledgeGraphCompatibilityForbidden",
    "Knowledge Graph Compatibility Forbidden",
    "Forbidden",
    "Freeze must never claim Knowledge Graph construction compatibility.",
  ),
  decl(
    "ExtensionSurfaceLocked",
    "Extension Surface Locked",
    "Locked",
    "Additive extensions require a future major migration after Public Index.",
  ),
]);

/** Canonical immutable freeze compatibility declarations. */
export const DataUnderstandingFreezeCompatibility = Object.freeze({
  compatibilityId: "DKL-3:8/FreezeCompatibility",
  sourcePhase: "DKL-3:8",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  runtimeCompatibilityLogic: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
