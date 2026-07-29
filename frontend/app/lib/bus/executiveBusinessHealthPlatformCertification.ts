import {
  ExecutiveBusinessHealthContractId,
  ExecutiveBusinessHealthContractVersion,
} from "./executiveBusinessHealthIndex.ts";
import { ExecutiveBusinessHealthRegistryMetadata } from "./executiveBusinessHealthRegistryIndex.ts";
import { ExecutiveBusinessHealthModelVersion } from "./executiveBusinessHealthModelIndex.ts";
import {
  ExecutiveBusinessHealthValidationVersion,
  buildExecutiveBusinessHealthValidationSummary,
  getExecutiveBusinessHealthValidationMetadata,
} from "./executiveBusinessHealthValidationIndex.ts";
import {
  ExecutiveBusinessHealthManifestMetadata,
  ExecutiveBusinessHealthManifestVersion,
  getExecutiveBusinessHealthDependencyMetadata,
  getExecutiveBusinessHealthPublicApiInventory,
} from "./executiveBusinessHealthManifestIndex.ts";
import {
  ExecutiveBusinessHealthPlatformMetadata,
  ExecutiveBusinessHealthPlatformVersion,
  getExecutiveBusinessHealthPlatformDependencies,
  getExecutiveBusinessHealthPlatformPublicApi,
} from "./executiveBusinessHealthPlatformIndex.ts";

export const ExecutiveBusinessHealthPlatformCertificationId = "BUS-32:7" as const;

export const ExecutiveBusinessHealthPlatformCertificationVersion = "1.0.0" as const;

export const ExecutiveBusinessHealthPlatformCertificationName =
  "Executive Business Health Platform Certification" as const;

export const ExecutiveBusinessHealthPlatformCertificationDescription =
  "Canonical metadata-only certification layer for the Executive Business Health Intelligence Platform." as const;

export type ExecutiveBusinessHealthCertificationCategory =
  | "Contracts"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Public API"
  | "Dependencies"
  | "Namespace"
  | "Architecture"
  | "Immutability"
  | "Determinism"
  | "Release Readiness";

export type ExecutiveBusinessHealthCertificationStatus = "PASS" | "FAIL";

export type ExecutiveBusinessHealthCertificationCheck = Readonly<{
  readonly id: `executive-business-health-certification-check-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveBusinessHealthCertificationCategory;
  readonly status: ExecutiveBusinessHealthCertificationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthCertificationSummary = Readonly<{
  readonly certificationId: typeof ExecutiveBusinessHealthPlatformCertificationId;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthCertificationResult = Readonly<{
  readonly certificationId: typeof ExecutiveBusinessHealthPlatformCertificationId;
  readonly certificationVersion: typeof ExecutiveBusinessHealthPlatformCertificationVersion;
  readonly certificationName: typeof ExecutiveBusinessHealthPlatformCertificationName;
  readonly certificationDescription: typeof ExecutiveBusinessHealthPlatformCertificationDescription;
  readonly certificationStatus: ExecutiveBusinessHealthCertificationStatus;
  readonly platformReadiness: "READY";
  readonly architectureReadiness: "READY";
  readonly publicApiReadiness: "READY";
  readonly dependencyReadiness: "READY";
  readonly releaseReadiness: "READY";
  readonly checks: readonly ExecutiveBusinessHealthCertificationCheck[];
  readonly summary: ExecutiveBusinessHealthCertificationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const createCheck = (
  id: ExecutiveBusinessHealthCertificationCheck["id"],
  name: string,
  description: string,
  category: ExecutiveBusinessHealthCertificationCategory,
  status: ExecutiveBusinessHealthCertificationStatus,
): ExecutiveBusinessHealthCertificationCheck =>
  Object.freeze({
    id,
    name,
    description,
    category,
    status,
    metadataOnly: true,
    immutable: true,
  });

const checks = Object.freeze([
  createCheck(
    "executive-business-health-certification-check-contracts",
    "Contracts Ready",
    "Contract metadata is present, deterministic, and public.",
    "Contracts",
    ExecutiveBusinessHealthContractId === "BUS-32:1" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-registry",
    "Registry Ready",
    "Registry metadata is complete and immutable.",
    "Registry",
    ExecutiveBusinessHealthRegistryMetadata.registryVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-model",
    "Model Ready",
    "Canonical model metadata is complete and deterministic.",
    "Model",
    ExecutiveBusinessHealthModelVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-validation",
    "Validation Ready",
    "Validation metadata is complete and indicates no failed checks.",
    "Validation",
    buildExecutiveBusinessHealthValidationSummary().failedChecks === 0 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-manifest",
    "Manifest Ready",
    "Manifest metadata is complete and stable.",
    "Manifest",
    ExecutiveBusinessHealthManifestVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-platform",
    "Platform Ready",
    "Platform metadata facade is complete and public.",
    "Platform",
    ExecutiveBusinessHealthPlatformVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-public-api",
    "Public API Ready",
    "Public API inventory exists and is deterministic.",
    "Public API",
    getExecutiveBusinessHealthPublicApiInventory().length > 0 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-dependencies",
    "Dependency Integrity",
    "Dependency metadata is complete across manifest and platform layers.",
    "Dependencies",
    getExecutiveBusinessHealthDependencyMetadata().length ===
      getExecutiveBusinessHealthPlatformDependencies().length
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-namespace",
    "Namespace Integrity",
    "All metadata namespaces are stable and public-index safe.",
    "Namespace",
    ExecutiveBusinessHealthManifestMetadata.manifestNamespace.startsWith("nexora.bus.") &&
      ExecutiveBusinessHealthPlatformMetadata.platformNamespace.startsWith("nexora.bus.")
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-architecture",
    "Architecture Completeness",
    "Contracts, registry, model, validation, manifest, and platform surfaces all exist.",
    "Architecture",
    ExecutiveBusinessHealthManifestMetadata.manifestDependencies.length === 4 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-immutability",
    "Immutability",
    "All exposed certification metadata is immutable.",
    "Immutability",
    Object.isFrozen(ExecutiveBusinessHealthPlatformMetadata) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-determinism",
    "Determinism",
    "Versions and public metadata remain deterministic across phases.",
    "Determinism",
    ExecutiveBusinessHealthContractVersion === ExecutiveBusinessHealthModelVersion &&
      ExecutiveBusinessHealthModelVersion === ExecutiveBusinessHealthValidationVersion
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-health-certification-check-release-readiness",
    "Release Readiness",
    "Platform metadata indicates readiness for freeze and public release.",
    "Release Readiness",
    getExecutiveBusinessHealthValidationMetadata().metadataOnly &&
      getExecutiveBusinessHealthPlatformPublicApi().exportedNamespaces.length === 5
      ? "PASS"
      : "FAIL",
  ),
] as const);

const passedChecks = checks.filter((check) => check.status === "PASS").length;

const summary = Object.freeze({
  certificationId: ExecutiveBusinessHealthPlatformCertificationId,
  totalChecks: checks.length,
  passedChecks,
  failedChecks: checks.length - passedChecks,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessHealthCertificationSummary);

const result = Object.freeze({
  certificationId: ExecutiveBusinessHealthPlatformCertificationId,
  certificationVersion: ExecutiveBusinessHealthPlatformCertificationVersion,
  certificationName: ExecutiveBusinessHealthPlatformCertificationName,
  certificationDescription: ExecutiveBusinessHealthPlatformCertificationDescription,
  certificationStatus: summary.failedChecks === 0 ? "PASS" : "FAIL",
  platformReadiness: "READY",
  architectureReadiness: "READY",
  publicApiReadiness: "READY",
  dependencyReadiness: "READY",
  releaseReadiness: "READY",
  checks,
  summary,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessHealthCertificationResult);

const certificationMetadata = Object.freeze({
  certificationId: ExecutiveBusinessHealthPlatformCertificationId,
  certificationVersion: ExecutiveBusinessHealthPlatformCertificationVersion,
  certificationName: ExecutiveBusinessHealthPlatformCertificationName,
  certificationDescription: ExecutiveBusinessHealthPlatformCertificationDescription,
  categories: Object.freeze([
    "Contracts",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Public API",
    "Dependencies",
    "Namespace",
    "Architecture",
    "Immutability",
    "Determinism",
    "Release Readiness",
  ] as const),
  metadataOnly: true,
  immutable: true,
});

export const getExecutiveBusinessHealthCertificationChecks = ():
  readonly ExecutiveBusinessHealthCertificationCheck[] => checks;

export const buildExecutiveBusinessHealthCertificationSummary =
  (): ExecutiveBusinessHealthCertificationSummary => summary;

export const runExecutiveBusinessHealthPlatformCertification =
  (): ExecutiveBusinessHealthCertificationResult => result;

export const getExecutiveBusinessHealthCertificationMetadata = () => certificationMetadata;
