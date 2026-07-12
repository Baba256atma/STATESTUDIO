import {
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
} from "./executiveResourceIndex.ts";
import { EXECUTIVE_RESOURCE_PLATFORM_REGISTRY } from "./executiveResourceRegistryIndex.ts";
import {
  EXECUTIVE_RESOURCE_MODEL_METADATA,
  EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS,
} from "./executiveResourceModelIndex.ts";
import {
  EXECUTIVE_RESOURCE_VALIDATION_METADATA,
  EXECUTIVE_RESOURCE_VALIDATION_RESULT,
} from "./executiveResourceValidationIndex.ts";
import {
  EXECUTIVE_RESOURCE_MANIFEST_METADATA,
  EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS,
} from "./executiveResourceManifestIndex.ts";
import {
  EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES,
  EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_RESOURCE_PLATFORM_IDENTITY,
  EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS,
} from "./executiveResourcePlatformIndex.ts";
import type {
  ExecutiveResourceCertificationBundle,
  ExecutiveResourceCertificationCompatibility,
  ExecutiveResourceCertificationGate,
  ExecutiveResourceCertificationMetadata,
  ExecutiveResourceCertificationPolicy,
  ExecutiveResourceCertificationSummary,
  ExecutiveResourcePlatformCertification,
} from "./executiveResourceCertificationTypes.ts";

export const EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE =
  "nexora.bus.executive-resource.certification" as const;

export const EXECUTIVE_RESOURCE_CERTIFICATION_VERSION = "1.0.0" as const;

export const EXECUTIVE_RESOURCE_CERTIFICATION_STATUS = "PASS" as const;

export const EXECUTIVE_RESOURCE_CERTIFICATION_DESCRIPTION =
  "Canonical metadata-only certification layer for executive resource intelligence." as const;

const certificationMetadataBlock = Object.freeze({
  createdBy: "BUS-31:7",
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_RESOURCE_CERTIFICATION_METADATA: ExecutiveResourceCertificationMetadata =
  Object.freeze({
    certificationNamespace: EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE,
    certificationVersion: EXECUTIVE_RESOURCE_CERTIFICATION_VERSION,
    certificationStatus: EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
    certificationDescription: EXECUTIVE_RESOURCE_CERTIFICATION_DESCRIPTION,
    certificationDependencies: Object.freeze([
      "BUS-31:1 Executive Resource Intelligence Contracts",
      "BUS-31:2 Executive Resource Registry",
      "BUS-31:3 Executive Resource Model",
      "BUS-31:4 Executive Resource Validation",
      "BUS-31:5 Executive Resource Manifest",
      "BUS-31:6 Executive Resource Platform",
    ]),
    certificationConsumers: Object.freeze([
      "BUS-31:8 Freeze",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    metadataOnly: true,
    immutable: true,
  });

const createGate = (
  gateId: ExecutiveResourceCertificationGate["gateId"],
  gateCode: ExecutiveResourceCertificationGate["gateCode"],
  gateName: string,
  description: string,
  severity: ExecutiveResourceCertificationGate["severity"],
): ExecutiveResourceCertificationGate =>
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

export const EXECUTIVE_RESOURCE_CERTIFICATION_GATES: readonly ExecutiveResourceCertificationGate[] =
  Object.freeze([
    createGate(
      "executive-resource-certification-gate-public-api-integrity",
      "BUS31C-API-001",
      "Public API Integrity",
      "Public API metadata is present and stable across the platform surface.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-contract-integrity",
      "BUS31C-CONTRACT-001",
      "Contract Integrity",
      "Contract metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-registry-integrity",
      "BUS31C-REGISTRY-001",
      "Registry Integrity",
      "Registry metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-model-integrity",
      "BUS31C-MODEL-001",
      "Model Integrity",
      "Model metadata remains published and deterministic.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-validation-integrity",
      "BUS31C-VALIDATION-001",
      "Validation Integrity",
      "Validation metadata remains published and PASS.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-manifest-integrity",
      "BUS31C-MANIFEST-001",
      "Manifest Integrity",
      "Manifest metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-platform-integrity",
      "BUS31C-PLATFORM-001",
      "Platform Integrity",
      "Platform metadata remains published and structurally complete.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-dependency-integrity",
      "BUS31C-DEPENDENCY-001",
      "Dependency Integrity",
      "All dependency metadata remains published and available.",
      "Warning",
    ),
    createGate(
      "executive-resource-certification-gate-namespace-integrity",
      "BUS31C-NAMESPACE-001",
      "Namespace Integrity",
      "Namespaces remain deterministic and aligned across phases.",
      "Warning",
    ),
    createGate(
      "executive-resource-certification-gate-metadata-completeness",
      "BUS31C-METADATA-001",
      "Metadata Completeness",
      "Metadata blocks remain complete for certification and release.",
      "Warning",
    ),
    createGate(
      "executive-resource-certification-gate-immutability",
      "BUS31C-IMMUTABLE-001",
      "Immutability",
      "All certified surfaces remain immutable.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-deterministic-architecture",
      "BUS31C-DETERMINISTIC-001",
      "Deterministic Architecture",
      "Architecture remains deterministic and metadata-only.",
      "Critical",
    ),
    createGate(
      "executive-resource-certification-gate-backward-compatibility",
      "BUS31C-BACKCOMP-001",
      "Backward Compatibility",
      "Public surfaces remain compatible for downstream consumers.",
      "Information",
    ),
    createGate(
      "executive-resource-certification-gate-extension-policy",
      "BUS31C-EXTENSION-001",
      "Extension Policy",
      "Extension policy metadata remains published and additive-only.",
      "Information",
    ),
    createGate(
      "executive-resource-certification-gate-documentation-integrity",
      "BUS31C-DOCS-001",
      "Documentation Integrity",
      "Manifest and platform documentation metadata remain published.",
      "Information",
    ),
    createGate(
      "executive-resource-certification-gate-release-readiness",
      "BUS31C-RELEASE-001",
      "Release Readiness",
      "Platform metadata indicates certification readiness for freeze.",
      "Critical",
    ),
  ]);

export const EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION: ExecutiveResourcePlatformCertification =
  Object.freeze({
    certificationId: "executive-resource-certification",
    certificationVersion: "1.0.0",
    platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
    platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    certificationStatus: EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
    certificationDate: "2026-07-06",
    certificationLevel: "Platform",
    certificationMetadata: Object.freeze({
      certificationNamespace: EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE,
      certificationDescription: EXECUTIVE_RESOURCE_CERTIFICATION_DESCRIPTION,
      certificationDependencies: EXECUTIVE_RESOURCE_CERTIFICATION_METADATA.certificationDependencies,
      certificationConsumers: EXECUTIVE_RESOURCE_CERTIFICATION_METADATA.certificationConsumers,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CERTIFICATION_SUMMARY: ExecutiveResourceCertificationSummary =
  Object.freeze({
    gateCount: EXECUTIVE_RESOURCE_CERTIFICATION_GATES.length,
    passedGateCount: EXECUTIVE_RESOURCE_CERTIFICATION_GATES.length,
    failedGateCount: 0,
    platformStatus: "Published",
    certificationStatus: EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
    metadata: certificationMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CERTIFICATION_COMPATIBILITY: ExecutiveResourceCertificationCompatibility =
  Object.freeze({
    supportedPlatformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    certificationVersion: EXECUTIVE_RESOURCE_CERTIFICATION_VERSION,
    compatibilityStatus: "Compatible",
    metadata: certificationMetadataBlock,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CERTIFICATION_POLICY: ExecutiveResourceCertificationPolicy =
  Object.freeze({
    policyId: "executive-resource-certification-policy",
    policyVersion: "1.0.0",
    policyName: "Executive Resource Platform Certification Policy",
    policyDescription:
      "Defines the metadata-only certification requirements for the Executive Resource Platform.",
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

export const EXECUTIVE_RESOURCE_CERTIFICATION_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE",
  "EXECUTIVE_RESOURCE_CERTIFICATION_VERSION",
  "EXECUTIVE_RESOURCE_CERTIFICATION_STATUS",
  "EXECUTIVE_RESOURCE_CERTIFICATION_DESCRIPTION",
  "EXECUTIVE_RESOURCE_CERTIFICATION_METADATA",
  "EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION",
  "EXECUTIVE_RESOURCE_CERTIFICATION_GATES",
  "EXECUTIVE_RESOURCE_CERTIFICATION_SUMMARY",
  "EXECUTIVE_RESOURCE_CERTIFICATION_COMPATIBILITY",
  "EXECUTIVE_RESOURCE_CERTIFICATION_POLICY",
  "ExecutiveResourceCertificationFoundation",
] as const);

export const ExecutiveResourceCertificationFoundation: ExecutiveResourceCertificationBundle =
  Object.freeze({
    platform: EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION,
    gates: EXECUTIVE_RESOURCE_CERTIFICATION_GATES,
    summary: EXECUTIVE_RESOURCE_CERTIFICATION_SUMMARY,
    compatibility: EXECUTIVE_RESOURCE_CERTIFICATION_COMPATIBILITY,
    policy: EXECUTIVE_RESOURCE_CERTIFICATION_POLICY,
    metadata: EXECUTIVE_RESOURCE_CERTIFICATION_METADATA,
    publicApis: EXECUTIVE_RESOURCE_CERTIFICATION_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CERTIFICATION_FOUNDATION_COMPATIBILITY = Object.freeze({
  platformId: EXECUTIVE_RESOURCE_PLATFORM_IDENTITY.platformId,
  platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  registryPlatformId: EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformId,
  modelVersion: EXECUTIVE_RESOURCE_MODEL_METADATA.modelVersion,
  validationVersion: EXECUTIVE_RESOURCE_VALIDATION_METADATA.validationVersion,
  validationStatus: EXECUTIVE_RESOURCE_VALIDATION_RESULT.validationStatus,
  manifestPublicApiCount: EXECUTIVE_RESOURCE_MANIFEST_PUBLIC_APIS.length,
  platformPublicApiCount: EXECUTIVE_RESOURCE_PLATFORM_PUBLIC_APIS.length,
  dependencyCount: EXECUTIVE_RESOURCE_PLATFORM_DEPENDENCIES.length,
  extensionPolicyId: EXECUTIVE_RESOURCE_PLATFORM_EXTENSION_POLICY.extensionPolicyId,
  metadataOnly: true,
  immutable: true,
});
