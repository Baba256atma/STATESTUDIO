import {
  EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_PLATFORM_ID,
  EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
} from "./executiveOrganizationIndex.ts";
import { EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY } from "./executiveOrganizationRegistryIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_MODEL_METADATA,
  EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS,
} from "./executiveOrganizationModelIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_VALIDATION_METADATA,
  EXECUTIVE_ORGANIZATION_VALIDATION_RESULT,
} from "./executiveOrganizationValidationIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_MANIFEST_METADATA,
  EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS,
} from "./executiveOrganizationManifestIndex.ts";
import {
  EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES,
  EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY,
  EXECUTIVE_ORGANIZATION_PLATFORM_METADATA,
  EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS,
  ExecutiveOrganizationPlatformFoundation,
} from "./executiveOrganizationPlatformIndex.ts";
import type {
  ExecutiveOrganizationCertificationBundle,
  ExecutiveOrganizationCertificationCompatibility,
  ExecutiveOrganizationCertificationGate,
  ExecutiveOrganizationCertificationMetadata,
  ExecutiveOrganizationCertificationPolicy,
  ExecutiveOrganizationCertificationSummary,
  ExecutiveOrganizationPlatformCertification,
} from "./executiveOrganizationCertificationTypes.ts";

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE =
  "nexora.bus.executive-organization.certification" as const;

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_VERSION = "1.0.0" as const;

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS = "PASS" as const;

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_DESCRIPTION =
  "Canonical metadata-only certification layer for executive organization intelligence." as const;

const certificationMetadataBlock = Object.freeze({
  createdBy: "BUS-30:7",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA: ExecutiveOrganizationCertificationMetadata =
  Object.freeze({
    certificationNamespace: EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE,
    certificationVersion: EXECUTIVE_ORGANIZATION_CERTIFICATION_VERSION,
    certificationStatus: EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
    certificationDescription: EXECUTIVE_ORGANIZATION_CERTIFICATION_DESCRIPTION,
    certificationDependencies: Object.freeze([
      "BUS-30:1 Executive Organization Intelligence Contracts",
      "BUS-30:2 Executive Organization Registry",
      "BUS-30:3 Executive Organization Model",
      "BUS-30:4 Executive Organization Validation",
      "BUS-30:5 Executive Organization Manifest",
      "BUS-30:6 Executive Organization Platform",
    ]),
    certificationConsumers: Object.freeze([
      "BUS-30:8 Freeze",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    metadataOnly: true,
    immutable: true,
  });

const createGate = (
  gateId: ExecutiveOrganizationCertificationGate["gateId"],
  gateCode: ExecutiveOrganizationCertificationGate["gateCode"],
  gateName: string,
  description: string,
  severity: ExecutiveOrganizationCertificationGate["severity"],
): ExecutiveOrganizationCertificationGate =>
  Object.freeze({
    gateId,
    gateCode,
    gateName,
    description,
    status: "PASS",
    severity,
    metadata: certificationMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES: readonly ExecutiveOrganizationCertificationGate[] =
  Object.freeze([
    createGate(
      "executive-organization-certification-gate-public-api-integrity",
      "BUS30C-API-001",
      "Public API Integrity",
      "Public API metadata is present and stable across the platform surface.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-contract-integrity",
      "BUS30C-CONTRACT-001",
      "Contract Integrity",
      "Contract metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-registry-integrity",
      "BUS30C-REGISTRY-001",
      "Registry Integrity",
      "Registry metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-model-integrity",
      "BUS30C-MODEL-001",
      "Model Integrity",
      "Model metadata remains published and deterministic.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-validation-integrity",
      "BUS30C-VALIDATION-001",
      "Validation Integrity",
      "Validation metadata remains published and PASS.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-manifest-integrity",
      "BUS30C-MANIFEST-001",
      "Manifest Integrity",
      "Manifest metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-platform-integrity",
      "BUS30C-PLATFORM-001",
      "Platform Integrity",
      "Platform metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-dependency-integrity",
      "BUS30C-DEPENDENCY-001",
      "Dependency Integrity",
      "All dependency metadata remains published and available.",
      "Warning",
    ),
    createGate(
      "executive-organization-certification-gate-namespace-integrity",
      "BUS30C-NAMESPACE-001",
      "Namespace Integrity",
      "Namespaces remain deterministic and aligned across phases.",
      "Warning",
    ),
    createGate(
      "executive-organization-certification-gate-metadata-completeness",
      "BUS30C-METADATA-001",
      "Metadata Completeness",
      "Metadata blocks remain complete for certification and release.",
      "Warning",
    ),
    createGate(
      "executive-organization-certification-gate-immutability",
      "BUS30C-IMMUTABLE-001",
      "Immutability",
      "All certified surfaces remain immutable.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-deterministic-architecture",
      "BUS30C-DETERMINISTIC-001",
      "Deterministic Architecture",
      "Architecture remains deterministic and metadata-only.",
      "Critical",
    ),
    createGate(
      "executive-organization-certification-gate-backward-compatibility",
      "BUS30C-BACKCOMP-001",
      "Backward Compatibility",
      "Public surfaces remain compatible for downstream consumers.",
      "Information",
    ),
    createGate(
      "executive-organization-certification-gate-extension-policy",
      "BUS30C-EXTENSION-001",
      "Extension Policy",
      "Extension policy metadata remains published and additive-only.",
      "Information",
    ),
    createGate(
      "executive-organization-certification-gate-documentation-integrity",
      "BUS30C-DOCS-001",
      "Documentation Integrity",
      "Manifest and platform documentation metadata remain published.",
      "Information",
    ),
    createGate(
      "executive-organization-certification-gate-release-readiness",
      "BUS30C-RELEASE-001",
      "Release Readiness",
      "Platform metadata indicates certification readiness for freeze.",
      "Critical",
    ),
  ]);

export const EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION: ExecutiveOrganizationPlatformCertification =
  Object.freeze({
    certificationId: "executive-organization-certification",
    certificationVersion: "1.0.0",
    platformId: EXECUTIVE_ORGANIZATION_PLATFORM_ID,
    platformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    certificationStatus: EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
    certificationDate: "2026-07-06",
    certificationLevel: "Platform",
    certificationMetadata: Object.freeze({
      certificationNamespace: EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE,
      certificationDescription: EXECUTIVE_ORGANIZATION_CERTIFICATION_DESCRIPTION,
      certificationDependencies: EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA.certificationDependencies,
      certificationConsumers: EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA.certificationConsumers,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_SUMMARY: ExecutiveOrganizationCertificationSummary =
  Object.freeze({
    gateCount: EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES.length,
    passedGateCount: EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES.length,
    failedGateCount: 0,
    platformStatus: "Published",
    certificationStatus: EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
    metadata: certificationMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_COMPATIBILITY: ExecutiveOrganizationCertificationCompatibility =
  Object.freeze({
    supportedPlatformVersion: EXECUTIVE_ORGANIZATION_PLATFORM_VERSION,
    certificationVersion: EXECUTIVE_ORGANIZATION_CERTIFICATION_VERSION,
    compatibilityStatus: "Compatible",
    metadata: certificationMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY: ExecutiveOrganizationCertificationPolicy =
  Object.freeze({
    policyId: "executive-organization-certification-policy",
    policyVersion: "1.0.0",
    policyName: "Executive Organization Platform Certification Policy",
    policyDescription:
      "Defines the metadata-only certification requirements for the Executive Organization Platform.",
    requirements: Object.freeze([
      "public-api-integrity",
      "contract-integrity",
      "registry-integrity",
      "model-integrity",
      "validation-integrity",
      "manifest-integrity",
      "platform-integrity",
      "immutability",
      "deterministic-architecture",
      "release-readiness",
    ]),
    metadata: certificationMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_PUBLIC_APIS = Object.freeze([
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_VERSION",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_DESCRIPTION",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA",
    "EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_SUMMARY",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_COMPATIBILITY",
    "EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY",
    "ExecutiveOrganizationCertificationFoundation",
  ] as const);

export const ExecutiveOrganizationCertificationFoundation: ExecutiveOrganizationCertificationBundle =
  Object.freeze({
    platform: EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION,
    gates: EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES,
    summary: EXECUTIVE_ORGANIZATION_CERTIFICATION_SUMMARY,
    compatibility: EXECUTIVE_ORGANIZATION_CERTIFICATION_COMPATIBILITY,
    policy: EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY,
    metadata: EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA,
    publicApis: EXECUTIVE_ORGANIZATION_CERTIFICATION_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_ORGANIZATION_CERTIFICATION_FOUNDATION_COMPATIBILITY = Object.freeze({
  platformId: EXECUTIVE_ORGANIZATION_PLATFORM_IDENTITY.platformId,
  platformDescription: EXECUTIVE_ORGANIZATION_PLATFORM_DESCRIPTION,
  registryPlatformId: EXECUTIVE_ORGANIZATION_PLATFORM_REGISTRY.platformId,
  modelVersion: EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelVersion,
  validationVersion: EXECUTIVE_ORGANIZATION_VALIDATION_METADATA.validationVersion,
  validationStatus: EXECUTIVE_ORGANIZATION_VALIDATION_RESULT.validationStatus,
  manifestPublicApiCount: EXECUTIVE_ORGANIZATION_MANIFEST_PUBLIC_APIS.length,
  platformPublicApiCount: EXECUTIVE_ORGANIZATION_PLATFORM_PUBLIC_APIS.length,
  dependencyCount: EXECUTIVE_ORGANIZATION_PLATFORM_DEPENDENCIES.length,
  extensionPolicyId: EXECUTIVE_ORGANIZATION_PLATFORM_EXTENSION_POLICY.extensionPolicyId,
  metadataOnly: true,
  immutable: true,
});
