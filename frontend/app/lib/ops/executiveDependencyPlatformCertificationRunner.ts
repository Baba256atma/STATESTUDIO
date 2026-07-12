import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import {
  ExecutiveDependencyRegistry,
} from "./dependencyRegistryIndex.ts";
import {
  ExecutiveDependencyModel,
} from "./dependencyModelIndex.ts";
import {
  getDependencyValidationSummary,
} from "./dependencyValidationIndex.ts";
import {
  buildDependencyManifest,
  validateDependencyManifest,
} from "./dependencyManifestIndex.ts";
import {
  ExecutiveDependencyPlatform,
  ExecutiveDependencyPlatformMetadata,
} from "./executiveDependencyPlatformIndex.ts";
import { buildExecutiveDependencyPlatformCertificationManifest } from "./executiveDependencyPlatformCertificationManifest.ts";
import { ExecutiveDependencyPlatformCertificationRegistry } from "./executiveDependencyPlatformCertificationRegistry.ts";
import { ExecutiveDependencyPlatformCompatibility } from "./executiveDependencyPlatformCompatibility.ts";
import type { ExecutiveDependencyCertificationResult } from "./executiveDependencyPlatformCertificationTypes.ts";

const buildChecks = () => {
  const certificationManifest =
    buildExecutiveDependencyPlatformCertificationManifest();
  const platformManifest = buildDependencyManifest();

  return Object.freeze([
    Object.freeze({
      id: "ops-7-7-foundation-available",
      name: "Foundation Available",
      category: "Foundation",
      status: ExecutiveDependencyIntelligenceFoundation ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-registry-available",
      name: "Registry Available",
      category: "Registry",
      status: ExecutiveDependencyRegistry.entities.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-model-available",
      name: "Model Available",
      category: "Model",
      status: ExecutiveDependencyModel.nodes.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-validation-available",
      name: "Validation Available",
      category: "Validation",
      status: getDependencyValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-manifest-available",
      name: "Manifest Available",
      category: "Manifest",
      status: validateDependencyManifest().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-platform-available",
      name: "Platform Available",
      category: "Platform",
      status: ExecutiveDependencyPlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-namespace-integrity",
      name: "Namespace Integrity",
      category: "Namespace",
      status:
        "foundation" in ExecutiveDependencyPlatform &&
        "registry" in ExecutiveDependencyPlatform &&
        "model" in ExecutiveDependencyPlatform &&
        "validation" in ExecutiveDependencyPlatform &&
        "manifest" in ExecutiveDependencyPlatform &&
        "metadata" in ExecutiveDependencyPlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-metadata-integrity",
      name: "Metadata Integrity",
      category: "Metadata",
      status:
        ExecutiveDependencyPlatformMetadata.metadataOnly &&
        certificationManifest.metadataOnly &&
        platformManifest.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-registry-integrity",
      name: "Registry Integrity",
      category: "Registry",
      status:
        ExecutiveDependencyPlatformCertificationRegistry.certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-compatibility-integrity",
      name: "Compatibility Integrity",
      category: "Compatibility",
      status:
        ExecutiveDependencyPlatformCompatibility.internal.length === 6 &&
        ExecutiveDependencyPlatformCompatibility.crossPlatform.length === 5
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-public-api-completeness",
      name: "Public API Completeness",
      category: "PublicApi",
      status: platformManifest.publicApiSurface.length >= 16 ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-deterministic-output",
      name: "Deterministic Output",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutiveDependencyPlatformCertificationManifest()) ===
        JSON.stringify(buildExecutiveDependencyPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-immutable-structures",
      name: "Immutable Structures",
      category: "Immutability",
      status:
        Object.isFrozen(ExecutiveDependencyPlatform) &&
        Object.isFrozen(certificationManifest) &&
        Object.isFrozen(ExecutiveDependencyPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-metadata-only-compliance",
      name: "Metadata-only Compliance",
      category: "Compliance",
      status:
        ExecutiveDependencyPlatform.metadataOnly &&
        certificationManifest.metadataOnly &&
        platformManifest.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-7-7-release-readiness",
      name: "Release Readiness",
      category: "ReleaseReadiness",
      status:
        certificationManifest.releaseReadiness.status === "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
  ] as const);
};

export const runExecutiveDependencyPlatformCertification = () => {
  const checks = buildChecks();
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;

  return Object.freeze({
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    checks,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveDependencyCertificationResult);
};
