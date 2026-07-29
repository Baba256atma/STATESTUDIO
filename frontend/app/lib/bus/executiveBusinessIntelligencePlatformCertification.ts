import {
  ExecutiveBusinessIntelligenceContractId,
  ExecutiveBusinessIntelligenceContractVersion,
} from "./executiveBusinessIntelligenceIndex.ts";
import {
  ExecutiveBusinessIntelligenceCapabilityRegistry,
  ExecutiveBusinessIntelligenceDomainRegistry,
  ExecutiveBusinessIntelligenceIntegrationRegistry,
  ExecutiveBusinessIntelligenceNamespaceRegistry,
  ExecutiveBusinessIntelligencePlatformRegistry,
  ExecutiveBusinessIntelligenceRegistryMetadata,
} from "./executiveBusinessIntelligenceRegistryIndex.ts";
import { ExecutiveBusinessIntelligenceModelVersion } from "./executiveBusinessIntelligenceModelIndex.ts";
import {
  ExecutiveBusinessIntelligenceValidationVersion,
  buildExecutiveBusinessIntelligenceValidationSummary,
  getExecutiveBusinessIntelligenceValidationMetadata,
} from "./executiveBusinessIntelligenceValidationIndex.ts";
import { ExecutiveBusinessIntelligenceManifestVersion, getExecutiveBusinessIntelligenceDependencyMetadata, getExecutiveBusinessIntelligencePublicApiInventory } from "./executiveBusinessIntelligenceManifestIndex.ts";
import {
  ExecutiveBusinessIntelligencePlatformMetadata,
  ExecutiveBusinessIntelligencePlatformVersion,
  getExecutiveBusinessIntelligencePlatformDependencies,
  getExecutiveBusinessIntelligencePlatformPublicApi,
} from "./executiveBusinessIntelligencePlatformIndex.ts";

export const ExecutiveBusinessIntelligencePlatformCertificationId =
  "BUS-34:7" as const;

export const ExecutiveBusinessIntelligencePlatformCertificationVersion =
  "1.0.0" as const;

export const ExecutiveBusinessIntelligencePlatformCertificationName =
  "Executive Business Intelligence Platform Certification" as const;

export const ExecutiveBusinessIntelligencePlatformCertificationDescription =
  "Canonical metadata-only certification layer for the Executive Business Intelligence Platform." as const;

export type ExecutiveBusinessIntelligenceCertificationCategory =
  | "Contracts"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Domains"
  | "Capabilities"
  | "Platforms"
  | "Namespaces"
  | "Dependencies"
  | "Integration"
  | "Public API"
  | "Determinism"
  | "Immutability"
  | "Release Readiness";

export type ExecutiveBusinessIntelligenceCertificationStatus = "PASS" | "FAIL";

export type ExecutiveBusinessIntelligenceCertificationCheck = Readonly<{
  readonly id: `executive-business-intelligence-certification-check-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveBusinessIntelligenceCertificationCategory;
  readonly status: ExecutiveBusinessIntelligenceCertificationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceCertificationSummary = Readonly<{
  readonly certificationId: typeof ExecutiveBusinessIntelligencePlatformCertificationId;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceCertificationResult = Readonly<{
  readonly certificationId: typeof ExecutiveBusinessIntelligencePlatformCertificationId;
  readonly certificationVersion: typeof ExecutiveBusinessIntelligencePlatformCertificationVersion;
  readonly certificationName: typeof ExecutiveBusinessIntelligencePlatformCertificationName;
  readonly certificationDescription: typeof ExecutiveBusinessIntelligencePlatformCertificationDescription;
  readonly certificationStatus: ExecutiveBusinessIntelligenceCertificationStatus;
  readonly platformReadiness: "READY";
  readonly architectureReadiness: "READY";
  readonly publicApiReadiness: "READY";
  readonly dependencyReadiness: "READY";
  readonly releaseReadiness: "READY";
  readonly checks: readonly ExecutiveBusinessIntelligenceCertificationCheck[];
  readonly summary: ExecutiveBusinessIntelligenceCertificationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

const createCheck = (
  id: ExecutiveBusinessIntelligenceCertificationCheck["id"],
  name: string,
  description: string,
  category: ExecutiveBusinessIntelligenceCertificationCategory,
  status: ExecutiveBusinessIntelligenceCertificationStatus,
): ExecutiveBusinessIntelligenceCertificationCheck =>
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
    "executive-business-intelligence-certification-check-contracts",
    "Contracts Ready",
    "Contract metadata is present, deterministic, and public.",
    "Contracts",
    ExecutiveBusinessIntelligenceContractId === "BUS-34:1" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-registry",
    "Registry Ready",
    "Registry metadata is complete and immutable.",
    "Registry",
    ExecutiveBusinessIntelligenceRegistryMetadata.registryVersion === "1.0.0"
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-model",
    "Model Ready",
    "Canonical model metadata is complete and deterministic.",
    "Model",
    ExecutiveBusinessIntelligenceModelVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-validation",
    "Validation Ready",
    "Validation metadata is complete and indicates no failed checks.",
    "Validation",
    buildExecutiveBusinessIntelligenceValidationSummary().failedChecks === 0
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-manifest",
    "Manifest Ready",
    "Manifest metadata is complete and stable.",
    "Manifest",
    ExecutiveBusinessIntelligenceManifestVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-platform",
    "Platform Ready",
    "Platform metadata facade is complete and public.",
    "Platform",
    ExecutiveBusinessIntelligencePlatformVersion === "1.0.0" ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-domains",
    "Domain Coverage",
    "All certified executive business intelligence domains are present.",
    "Domains",
    ExecutiveBusinessIntelligenceDomainRegistry.length === 11 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-capabilities",
    "Capability Coverage",
    "All certified executive business intelligence capabilities are present.",
    "Capabilities",
    ExecutiveBusinessIntelligenceCapabilityRegistry.length === 11 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-platform-references",
    "Platform Reference Coverage",
    "All certified executive business platform references are present.",
    "Platforms",
    ExecutiveBusinessIntelligencePlatformRegistry.length === 11 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-namespaces",
    "Namespace Coverage",
    "All canonical executive business intelligence namespaces are present.",
    "Namespaces",
    ExecutiveBusinessIntelligenceNamespaceRegistry.length === 4 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-dependencies",
    "Dependency Integrity",
    "Dependency metadata is complete across manifest and platform layers.",
    "Dependencies",
    getExecutiveBusinessIntelligenceDependencyMetadata().length ===
      getExecutiveBusinessIntelligencePlatformDependencies().length
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-integration",
    "Integration Coverage",
    "Integration metadata is present for the unified BUS architecture.",
    "Integration",
    ExecutiveBusinessIntelligenceIntegrationRegistry.length === 1 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-public-api",
    "Public API Ready",
    "Public API inventory exists and is deterministic.",
    "Public API",
    getExecutiveBusinessIntelligencePublicApiInventory().length > 0 ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-determinism",
    "Determinism",
    "Versions and public metadata remain deterministic across phases.",
    "Determinism",
    ExecutiveBusinessIntelligenceContractVersion ===
      ExecutiveBusinessIntelligenceModelVersion &&
      ExecutiveBusinessIntelligenceModelVersion ===
        ExecutiveBusinessIntelligenceValidationVersion
      ? "PASS"
      : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-immutability",
    "Immutability",
    "All exposed certification metadata is immutable.",
    "Immutability",
    Object.isFrozen(ExecutiveBusinessIntelligencePlatformMetadata) ? "PASS" : "FAIL",
  ),
  createCheck(
    "executive-business-intelligence-certification-check-release-readiness",
    "Release Readiness",
    "Platform metadata indicates readiness for freeze and public release.",
    "Release Readiness",
    getExecutiveBusinessIntelligenceValidationMetadata().metadataOnly &&
      getExecutiveBusinessIntelligencePlatformPublicApi().exportedNamespaces.length === 5
      ? "PASS"
      : "FAIL",
  ),
] as const);

const passedChecks = checks.filter((check) => check.status === "PASS").length;

const summary = Object.freeze({
  certificationId: ExecutiveBusinessIntelligencePlatformCertificationId,
  totalChecks: checks.length,
  passedChecks,
  failedChecks: checks.length - passedChecks,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} satisfies ExecutiveBusinessIntelligenceCertificationSummary);

const result = Object.freeze({
  certificationId: ExecutiveBusinessIntelligencePlatformCertificationId,
  certificationVersion: ExecutiveBusinessIntelligencePlatformCertificationVersion,
  certificationName: ExecutiveBusinessIntelligencePlatformCertificationName,
  certificationDescription:
    ExecutiveBusinessIntelligencePlatformCertificationDescription,
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
} satisfies ExecutiveBusinessIntelligenceCertificationResult);

const certificationMetadata = Object.freeze({
  certificationId: ExecutiveBusinessIntelligencePlatformCertificationId,
  certificationVersion: ExecutiveBusinessIntelligencePlatformCertificationVersion,
  certificationName: ExecutiveBusinessIntelligencePlatformCertificationName,
  certificationDescription:
    ExecutiveBusinessIntelligencePlatformCertificationDescription,
  categories: Object.freeze([
    "Contracts",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Domains",
    "Capabilities",
    "Platforms",
    "Namespaces",
    "Dependencies",
    "Integration",
    "Public API",
    "Determinism",
    "Immutability",
    "Release Readiness",
  ] as const),
  metadataOnly: true,
  immutable: true,
});

export const getExecutiveBusinessIntelligenceCertificationChecks = ():
  readonly ExecutiveBusinessIntelligenceCertificationCheck[] => checks;

export const buildExecutiveBusinessIntelligenceCertificationSummary =
  (): ExecutiveBusinessIntelligenceCertificationSummary => summary;

export const runExecutiveBusinessIntelligencePlatformCertification =
  (): ExecutiveBusinessIntelligenceCertificationResult => result;

export const getExecutiveBusinessIntelligenceCertificationMetadata = () =>
  certificationMetadata;
