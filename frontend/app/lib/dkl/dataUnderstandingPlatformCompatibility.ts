/**
 * DKL-3:6 — Data Understanding Platform Compatibility.
 *
 * Immutable compatibility declarations for the Platform layer.
 * No runtime compatibility logic.
 *
 * Ownership: owned exclusively by DKL-3:6.
 */

import type { PlatformCompatibilityEntry } from "./dataUnderstandingPlatformTypes.ts";

const decl = (
  compatibilityId: string,
  name: string,
  status: PlatformCompatibilityEntry["status"],
  description: string,
): PlatformCompatibilityEntry =>
  Object.freeze({ compatibilityId, name, status, description });

const ENTRIES: readonly PlatformCompatibilityEntry[] = Object.freeze([
  decl(
    "FoundationCompatibility",
    "Foundation Compatibility",
    "Compatible",
    "Platform foundation section references DKL-3:1 public APIs by identity.",
  ),
  decl(
    "RegistryCompatibility",
    "Registry Compatibility",
    "Compatible",
    "Platform registry section references DKL-3:2 public APIs by identity.",
  ),
  decl(
    "ModelCompatibility",
    "Model Compatibility",
    "Compatible",
    "Platform model section references DKL-3:3 public APIs by identity.",
  ),
  decl(
    "ValidationCompatibility",
    "Validation Compatibility",
    "Compatible",
    "Platform validation section references DKL-3:4 public APIs by identity.",
  ),
  decl(
    "ManifestCompatibility",
    "Manifest Compatibility",
    "Compatible",
    "Platform manifest section references DKL-3:5 public APIs by identity.",
  ),
  decl(
    "PipelineCompatibility",
    "Pipeline Compatibility",
    "Compatible",
    "Platform depends on Pipeline Understanding Platform ReadyForDKL3Intake.",
  ),
  decl(
    "Dkl2Compatibility",
    "DKL-2 Compatibility",
    "Compatible",
    "Platform depends on the DKL-2 Public Index only.",
  ),
  decl(
    "ForwardCompatibleToCertification",
    "Forward Compatible to Certification",
    "ForwardCompatible",
    "Platform metadata is intended for DKL-3:7 Certification without schema rename.",
  ),
  decl(
    "BackwardCompatibleWithCompletedPhases",
    "Backward Compatible with Completed Phases",
    "Compatible",
    "Platform aggregates DKL-3:1 through DKL-3:5 without redefining contracts.",
  ),
  decl(
    "PublicApiCompatibility",
    "Public API Compatibility",
    "Compatible",
    "Each DKL-3 phase and the Platform publish exactly eight public APIs.",
  ),
  decl(
    "Dkl4CompatibilityReferenceOnly",
    "DKL-4 Compatibility (Reference Only)",
    "Restricted",
    "DKL-4 Business Object Construction is a future consumer reference only; not imported or executed.",
  ),
  decl(
    "BusinessObjectCompatibilityForbidden",
    "Business Object Compatibility Forbidden",
    "Forbidden",
    "Platform must never claim Business Object construction compatibility.",
  ),
]);

/** Canonical immutable platform compatibility declarations. */
export const DataUnderstandingPlatformCompatibility = Object.freeze({
  compatibilityId: "DKL-3:6/PlatformCompatibility",
  sourcePhase: "DKL-3:6",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  runtimeCompatibilityLogic: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
