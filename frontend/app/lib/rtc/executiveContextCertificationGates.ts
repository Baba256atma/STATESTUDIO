/**
 * RTC-1:7 — Executive Context Certification Gates.
 *
 * Exactly sixteen deterministic certification gates.
 *
 * Ownership: owned exclusively by RTC-1:7.
 */

import type { ExecutiveContextCertificationCategoryName } from "./executiveContextCertificationCategories.ts";

/** Canonical certification gate name. */
export type ExecutiveContextCertificationGateName =
  | "FoundationComplete"
  | "RegistryComplete"
  | "ModelComplete"
  | "ValidationComplete"
  | "ManifestComplete"
  | "PlatformComplete"
  | "ArchitectureVerified"
  | "IdentityVerified"
  | "ContractsStable"
  | "DependenciesVerified"
  | "QualityVerified"
  | "CompatibilityVerified"
  | "ReleaseMetadataVerified"
  | "TestsPassed"
  | "LintPassed"
  | "ReadyForFreeze";

/** Certification gate declaration. */
export interface ExecutiveContextCertificationGateDeclaration {
  readonly gateId: string;
  readonly gateName: ExecutiveContextCertificationGateName;
  readonly description: string;
  readonly category: ExecutiveContextCertificationCategoryName;
  readonly order: number;
  readonly deterministic: true;
  readonly modifiesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  gateName: ExecutiveContextCertificationGateName,
  category: ExecutiveContextCertificationCategoryName,
  description: string,
  order: number,
): ExecutiveContextCertificationGateDeclaration =>
  Object.freeze({
    gateId: `RTC-1:7/Gate/${String(order).padStart(2, "0")}`,
    gateName,
    description,
    category,
    order,
    deterministic: true as const,
    modifiesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly sixteen certification gates. */
export const ExecutiveContextCertificationGates = Object.freeze([
  gate(
    "FoundationComplete",
    "Architecture",
    "RTC-1:1 Foundation phase is complete.",
    1,
  ),
  gate(
    "RegistryComplete",
    "Registry",
    "RTC-1:2 Registry phase is complete.",
    2,
  ),
  gate(
    "ModelComplete",
    "Model",
    "RTC-1:3 Model phase is complete.",
    3,
  ),
  gate(
    "ValidationComplete",
    "Validation",
    "RTC-1:4 Validation phase is complete.",
    4,
  ),
  gate(
    "ManifestComplete",
    "Manifest",
    "RTC-1:5 Manifest phase is complete.",
    5,
  ),
  gate(
    "PlatformComplete",
    "Platform",
    "RTC-1:6 Platform phase is complete.",
    6,
  ),
  gate(
    "ArchitectureVerified",
    "Architecture",
    "Canonical architecture order and boundaries are verified.",
    7,
  ),
  gate(
    "IdentityVerified",
    "Identity",
    "Unique Runtime identity and stable namespace are verified.",
    8,
  ),
  gate(
    "ContractsStable",
    "Contracts",
    "Public contracts are stable, unique, and backward-compatible.",
    9,
  ),
  gate(
    "DependenciesVerified",
    "Dependencies",
    "Upstream dependency chain and prohibited imports are verified.",
    10,
  ),
  gate(
    "QualityVerified",
    "Quality",
    "Strict TypeScript, ESLint, and naming conventions are verified.",
    11,
  ),
  gate(
    "CompatibilityVerified",
    "Compatibility",
    "Contract-level consumer compatibility is verified.",
    12,
  ),
  gate(
    "ReleaseMetadataVerified",
    "ReleaseReadiness",
    "Release metadata completeness is verified.",
    13,
  ),
  gate(
    "TestsPassed",
    "Quality",
    "Certification and upstream Runtime tests have passed.",
    14,
  ),
  gate(
    "LintPassed",
    "Quality",
    "ESLint compliance with zero warnings is verified.",
    15,
  ),
  gate(
    "ReadyForFreeze",
    "ReleaseReadiness",
    "Runtime is certified and ready for Freeze progression.",
    16,
  ),
] as const);

export const ExecutiveContextCertificationGateNames = Object.freeze([
  "FoundationComplete",
  "RegistryComplete",
  "ModelComplete",
  "ValidationComplete",
  "ManifestComplete",
  "PlatformComplete",
  "ArchitectureVerified",
  "IdentityVerified",
  "ContractsStable",
  "DependenciesVerified",
  "QualityVerified",
  "CompatibilityVerified",
  "ReleaseMetadataVerified",
  "TestsPassed",
  "LintPassed",
  "ReadyForFreeze",
] as const satisfies readonly ExecutiveContextCertificationGateName[]);
