/**
 * DKL-3:7 — Data Understanding Certification Compatibility.
 *
 * Immutable compatibility declarations for certification.
 * No runtime compatibility logic.
 *
 * Ownership: owned exclusively by DKL-3:7.
 */

import type { CertificationCompatibilityEntry } from "./dataUnderstandingCertificationTypes.ts";

const decl = (
  compatibilityId: string,
  name: string,
  status: CertificationCompatibilityEntry["status"],
  description: string,
): CertificationCompatibilityEntry =>
  Object.freeze({ compatibilityId, name, status, description });

const ENTRIES: readonly CertificationCompatibilityEntry[] = Object.freeze([
  decl(
    "FoundationCertificationCompatible",
    "Foundation Certification Compatible",
    "Compatible",
    "Certification confirms DKL-3:1 Foundation completeness by public identity.",
  ),
  decl(
    "RegistryCertificationCompatible",
    "Registry Certification Compatible",
    "Compatible",
    "Certification confirms DKL-3:2 Registry completeness by public identity.",
  ),
  decl(
    "ModelCertificationCompatible",
    "Model Certification Compatible",
    "Compatible",
    "Certification confirms DKL-3:3 Model completeness by public identity.",
  ),
  decl(
    "ValidationCertificationCompatible",
    "Validation Certification Compatible",
    "Compatible",
    "Certification confirms DKL-3:4 Validation completeness without re-executing validation.",
  ),
  decl(
    "ManifestCertificationCompatible",
    "Manifest Certification Compatible",
    "Compatible",
    "Certification confirms DKL-3:5 Manifest completeness by public identity.",
  ),
  decl(
    "PlatformCertificationCompatible",
    "Platform Certification Compatible",
    "Compatible",
    "Certification confirms DKL-3:6 Platform completeness and namespace integrity.",
  ),
  decl(
    "PipelineCertificationCompatible",
    "Pipeline Certification Compatible",
    "Compatible",
    "Certification depends on Pipeline Understanding Platform ReadyForDKL3Intake.",
  ),
  decl(
    "Dkl2CertificationCompatible",
    "DKL-2 Certification Compatible",
    "Compatible",
    "Certification depends on the DKL-2 Public Index only.",
  ),
  decl(
    "ForwardCompatibleToFreeze",
    "Forward Compatible to Freeze",
    "ForwardCompatible",
    "Certification metadata is intended for DKL-3:8 Freeze without schema rename.",
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
    "Certification must never claim Business Object construction compatibility.",
  ),
  decl(
    "KnowledgeGraphCompatibilityForbidden",
    "Knowledge Graph Compatibility Forbidden",
    "Forbidden",
    "Certification must never claim Knowledge Graph construction compatibility.",
  ),
]);

/** Canonical immutable certification compatibility declarations. */
export const DataUnderstandingCertificationCompatibility = Object.freeze({
  compatibilityId: "DKL-3:7/CertificationCompatibility",
  sourcePhase: "DKL-3:7",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  runtimeCompatibilityLogic: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
