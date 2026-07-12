import {
  ExecutiveAutomationFoundation,
} from "./automationIndex.ts";
import {
  ExecutiveAutomationRegistry,
} from "./automationRegistryIndex.ts";
import {
  ExecutiveAutomationModel,
} from "./automationModelIndex.ts";
import {
  getAutomationValidationSummary,
} from "./automationValidationIndex.ts";
import {
  buildAutomationManifest,
  validateAutomationManifest,
} from "./automationManifestIndex.ts";
import {
  ExecutiveAutomationPlatform,
  ExecutiveAutomationPlatformMetadata,
} from "./executiveAutomationPlatformIndex.ts";
import { buildExecutiveAutomationPlatformCertificationManifest } from "./executiveAutomationPlatformCertificationManifest.ts";
import { ExecutiveAutomationPlatformCertificationRegistry } from "./executiveAutomationPlatformCertificationRegistry.ts";
import { ExecutiveAutomationPlatformCompatibility } from "./executiveAutomationPlatformCompatibility.ts";
import type { ExecutiveAutomationCertificationResult } from "./executiveAutomationPlatformCertificationTypes.ts";

const buildChecks = () => {
  const certificationManifest =
    buildExecutiveAutomationPlatformCertificationManifest();
  const platformManifest = buildAutomationManifest();

  return Object.freeze([
    Object.freeze({
      id: "ops-8-7-foundation-available",
      name: "Foundation Available",
      category: "Foundation",
      status: ExecutiveAutomationFoundation ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-registry-available",
      name: "Registry Available",
      category: "Registry",
      status: ExecutiveAutomationRegistry.events.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-model-available",
      name: "Model Available",
      category: "Model",
      status: ExecutiveAutomationModel.events.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-validation-available",
      name: "Validation Available",
      category: "Validation",
      status: getAutomationValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-manifest-available",
      name: "Manifest Available",
      category: "Manifest",
      status: validateAutomationManifest().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-platform-available",
      name: "Platform Available",
      category: "Platform",
      status: ExecutiveAutomationPlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-namespace-integrity",
      name: "Namespace Integrity",
      category: "Namespace",
      status:
        "foundation" in ExecutiveAutomationPlatform &&
        "registry" in ExecutiveAutomationPlatform &&
        "model" in ExecutiveAutomationPlatform &&
        "validation" in ExecutiveAutomationPlatform &&
        "manifest" in ExecutiveAutomationPlatform &&
        "metadata" in ExecutiveAutomationPlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-metadata-integrity",
      name: "Metadata Integrity",
      category: "Metadata",
      status:
        ExecutiveAutomationPlatformMetadata.metadataOnly &&
        certificationManifest.metadataOnly &&
        platformManifest.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-registry-integrity",
      name: "Registry Integrity",
      category: "Registry",
      status:
        ExecutiveAutomationPlatformCertificationRegistry.certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-compatibility-integrity",
      name: "Compatibility Integrity",
      category: "Compatibility",
      status:
        ExecutiveAutomationPlatformCompatibility.internal.length === 6 &&
        ExecutiveAutomationPlatformCompatibility.crossPlatform.length === 6
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-public-api-completeness",
      name: "Public API Completeness",
      category: "PublicApi",
      status: platformManifest.publicApiSurface.length >= 27 ? "PASS" : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-deterministic-output",
      name: "Deterministic Output",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutiveAutomationPlatformCertificationManifest()) ===
        JSON.stringify(buildExecutiveAutomationPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-immutable-structures",
      name: "Immutable Structures",
      category: "Immutability",
      status:
        Object.isFrozen(ExecutiveAutomationPlatform) &&
        Object.isFrozen(certificationManifest) &&
        Object.isFrozen(ExecutiveAutomationPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-metadata-only-compliance",
      name: "Metadata-only Compliance",
      category: "Compliance",
      status:
        ExecutiveAutomationPlatform.metadataOnly &&
        certificationManifest.metadataOnly &&
        platformManifest.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    }),
    Object.freeze({
      id: "ops-8-7-release-readiness",
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

export const runExecutiveAutomationPlatformCertification = () => {
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
  } as const satisfies ExecutiveAutomationCertificationResult);
};
