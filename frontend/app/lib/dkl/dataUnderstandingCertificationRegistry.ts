/**
 * DKL-3:7 — Data Understanding Certification Registry.
 *
 * Immutable certification registry of components and gates. Metadata only.
 * Every gate reports PASS / Certified.
 *
 * Ownership: owned exclusively by DKL-3:7.
 */

import type {
  CertificationComponentEntry,
  CertificationGate,
  DataUnderstandingCertificationIdentityDescriptor,
} from "./dataUnderstandingCertificationTypes.ts";

export const DATA_UNDERSTANDING_CERTIFICATION_VERSION = "1.0.0";

export const DATA_UNDERSTANDING_CERTIFICATION_IDENTITY: DataUnderstandingCertificationIdentityDescriptor =
  Object.freeze({
    certificationId: "DKL-3:7/DataUnderstandingCertification",
    certificationVersion: DATA_UNDERSTANDING_CERTIFICATION_VERSION,
    certificationName: "Data Understanding Certification",
    certificationNamespace: "nexora.dkl.data-understanding.certification",
    platformId: "DKL-3",
    platformVersion: "1.0.0",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:7",
    status: "Certified",
    readiness: "ReadyForFreeze",
    metadataOnly: true,
    immutable: true,
  });

const component = (
  componentId: string,
  componentName: string,
  sourcePhase: string,
  kind: string,
): CertificationComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    sourcePhase,
    kind,
    publicApiCount: 8 as const,
    certified: true as const,
  });

const COMPONENTS: readonly CertificationComponentEntry[] = Object.freeze([
  component("DKL-3:1/Foundation", "Data Understanding Foundation", "DKL-3:1", "Foundation"),
  component("DKL-3:2/Registry", "Data Understanding Registry", "DKL-3:2", "Registry"),
  component("DKL-3:3/Model", "Data Understanding Model", "DKL-3:3", "Model"),
  component("DKL-3:4/Validation", "Data Understanding Validation", "DKL-3:4", "Validation"),
  component("DKL-3:5/Manifest", "Data Understanding Manifest", "DKL-3:5", "Manifest"),
  component("DKL-3:6/Platform", "Data Understanding Platform", "DKL-3:6", "Platform"),
]);

const gate = (
  gateId: string,
  gateName: string,
  description: string,
  category: string,
  sourcePhases: readonly string[],
  evidenceIds: readonly string[],
  readinessImpact: string,
): CertificationGate =>
  Object.freeze({
    gateId,
    gateName,
    description,
    category,
    severity: "Critical" as const,
    sourcePhases: Object.freeze([...sourcePhases]),
    evidenceIds: Object.freeze([...evidenceIds]),
    expectedStatus: "PASS" as const,
    actualStatus: "PASS" as const,
    status: "Certified" as const,
    blocking: true as const,
    readinessImpact,
  });

const GATES: readonly CertificationGate[] = Object.freeze([
  gate(
    "GATE-FOUNDATION-CERTIFIED",
    "FoundationCertified",
    "DKL-3:1 Foundation is complete with ReadyForRegistry and eight public APIs.",
    "Completeness",
    ["DKL-3:1"],
    ["EV-FOUNDATION-IDENTITY", "EV-FOUNDATION-READY", "EV-FOUNDATION-EXPORTS"],
    "Blocks freeze until Foundation is certified.",
  ),
  gate(
    "GATE-REGISTRY-CERTIFIED",
    "RegistryCertified",
    "DKL-3:2 Registry is complete with ReadyForModel and eight public APIs.",
    "Completeness",
    ["DKL-3:2"],
    ["EV-REGISTRY-IDENTITY", "EV-REGISTRY-READY", "EV-REGISTRY-EXPORTS"],
    "Blocks freeze until Registry is certified.",
  ),
  gate(
    "GATE-MODEL-CERTIFIED",
    "ModelCertified",
    "DKL-3:3 Model is complete with ReadyForValidation and eight public APIs.",
    "Completeness",
    ["DKL-3:3"],
    ["EV-MODEL-IDENTITY", "EV-MODEL-READY", "EV-MODEL-EXPORTS"],
    "Blocks freeze until Model is certified.",
  ),
  gate(
    "GATE-VALIDATION-CERTIFIED",
    "ValidationCertified",
    "DKL-3:4 Validation is complete with ReadyForManifest and twenty-eight rules.",
    "Integrity",
    ["DKL-3:4"],
    ["EV-VALIDATION-IDENTITY", "EV-VALIDATION-RULES", "EV-VALIDATION-EXPORTS"],
    "Blocks freeze until Validation is certified.",
  ),
  gate(
    "GATE-MANIFEST-CERTIFIED",
    "ManifestCertified",
    "DKL-3:5 Manifest is complete with ReadyForPlatform and eight public APIs.",
    "Completeness",
    ["DKL-3:5"],
    ["EV-MANIFEST-IDENTITY", "EV-MANIFEST-READY", "EV-MANIFEST-EXPORTS"],
    "Blocks freeze until Manifest is certified.",
  ),
  gate(
    "GATE-PLATFORM-CERTIFIED",
    "PlatformCertified",
    "DKL-3:6 Platform is complete with five-section namespace and ReadyForCertification.",
    "Completeness",
    ["DKL-3:6"],
    ["EV-PLATFORM-IDENTITY", "EV-PLATFORM-NAMESPACE", "EV-PLATFORM-EXPORTS"],
    "Blocks freeze until Platform is certified.",
  ),
  gate(
    "GATE-DEPENDENCIES-CERTIFIED",
    "DependenciesCertified",
    "Platform dependencies are limited to Pipeline, DKL-2, and DKL-3:1–5.",
    "DependencySafety",
    ["DKL-3:6"],
    ["EV-PLATFORM-DEPENDENCIES", "EV-NO-FUTURE-PHASES"],
    "Blocks freeze if forbidden dependencies appear.",
  ),
  gate(
    "GATE-COMPATIBILITY-CERTIFIED",
    "CompatibilityCertified",
    "Compatibility declarations forbid Business Objects and restrict DKL-4 to reference-only.",
    "Compatibility",
    ["DKL-3:6", "DKL-3:7"],
    ["EV-PLATFORM-COMPATIBILITY", "EV-CERT-COMPATIBILITY"],
    "Blocks freeze if compatibility claims expand into DKL-4 execution.",
  ),
  gate(
    "GATE-OWNERSHIP-CERTIFIED",
    "OwnershipCertified",
    "Ownership owns/doesNotOwn declarations remain complete and non-overlapping.",
    "Ownership",
    ["DKL-3:1"],
    ["EV-OWNERSHIP"],
    "Blocks freeze if ownership boundaries collapse.",
  ),
  gate(
    "GATE-BOUNDARY-CERTIFIED",
    "BoundaryCertified",
    "Boundaries forbid BO, Knowledge Graph, persistence, AI, Engine, and UI.",
    "Boundary",
    ["DKL-3:1", "DKL-3:6"],
    ["EV-BOUNDARIES"],
    "Blocks freeze if forbidden processing is claimed.",
  ),
  gate(
    "GATE-PUBLIC-API-CERTIFIED",
    "PublicApiCertified",
    "Each DKL-3 phase publishes exactly eight public APIs; Platform namespace sections match.",
    "PublicApi",
    ["DKL-3:1", "DKL-3:2", "DKL-3:3", "DKL-3:4", "DKL-3:5", "DKL-3:6"],
    ["EV-PUBLIC-API-COUNTS", "EV-PLATFORM-NAMESPACE"],
    "Blocks freeze if public API surfaces drift.",
  ),
  gate(
    "GATE-DETERMINISTIC-CERTIFIED",
    "DeterministicCertified",
    "All DKL-3 surfaces declare deterministic metadata with no clock or randomness.",
    "Determinism",
    ["DKL-3:1", "DKL-3:2", "DKL-3:3", "DKL-3:4", "DKL-3:5", "DKL-3:6"],
    ["EV-DETERMINISTIC"],
    "Blocks freeze if non-deterministic behavior is introduced.",
  ),
  gate(
    "GATE-IMMUTABLE-CERTIFIED",
    "ImmutableCertified",
    "All DKL-3 public aggregates are deeply frozen metadata-only objects.",
    "Immutability",
    ["DKL-3:1", "DKL-3:2", "DKL-3:3", "DKL-3:4", "DKL-3:5", "DKL-3:6"],
    ["EV-IMMUTABLE"],
    "Blocks freeze if mutable public state appears.",
  ),
  gate(
    "GATE-READY-FOR-FREEZE",
    "ReadyForFreeze",
    "Platform readiness ReadyForCertification implies ReadyForFreeze after certification.",
    "Readiness",
    ["DKL-3:6", "DKL-3:7"],
    ["EV-PLATFORM-READY", "EV-CERT-READY"],
    "Blocks freeze until ReadyForFreeze is declared.",
  ),
]);

export const DATA_UNDERSTANDING_CERTIFICATION_PUBLIC_API_NAMES = Object.freeze([
  "DataUnderstandingCertification",
  "DataUnderstandingCertificationRegistry",
  "DataUnderstandingCertificationCompatibility",
  "DataUnderstandingCertificationEvidence",
  "DataUnderstandingCertificationManifest",
  "DataUnderstandingCertificationReport",
  "DataUnderstandingCertificationVersion",
  "DataUnderstandingCertificationIdentity",
]);

/** Canonical immutable certification registry. */
export const DataUnderstandingCertificationRegistry = Object.freeze({
  registryId: "DKL-3:7/CertificationRegistry",
  identity: DATA_UNDERSTANDING_CERTIFICATION_IDENTITY,
  version: DATA_UNDERSTANDING_CERTIFICATION_VERSION,
  components: COMPONENTS,
  componentCount: COMPONENTS.length,
  gates: GATES,
  gateCount: GATES.length,
  certifiedGateCount: GATES.length,
  publicApiNames: DATA_UNDERSTANDING_CERTIFICATION_PUBLIC_API_NAMES,
  publicApiCount: DATA_UNDERSTANDING_CERTIFICATION_PUBLIC_API_NAMES.length,
  allGatesCertified: true,
  allGatesPass: true,
  metadataOnly: true,
  certificationOnly: true,
  immutable: true,
  deterministic: true,
});
