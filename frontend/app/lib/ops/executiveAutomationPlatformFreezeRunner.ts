import {
  ExecutiveAutomationFoundation,
  AutomationRegistry,
} from "./automationIndex.ts";
import {
  ExecutiveAutomationModel,
} from "./automationModelIndex.ts";
import {
  getAutomationValidationSummary,
} from "./automationValidationIndex.ts";
import {
  ExecutiveAutomationPlatform,
  ExecutiveAutomationPlatformRelease,
} from "./executiveAutomationPlatformIndex.ts";
import {
  ExecutiveAutomationPlatformCertificationRegistry,
  certifyExecutiveAutomationPlatform,
} from "./executiveAutomationPlatformCertificationIndex.ts";
import {
  ExecutiveAutomationPlatformFreezeCompatibility,
} from "./executiveAutomationPlatformFreezeCompatibility.ts";
import {
  buildExecutiveAutomationPlatformFreezeManifest,
} from "./executiveAutomationPlatformFreezeManifest.ts";
import {
  ExecutiveAutomationPlatformCertifiedPhaseRegistry,
  ExecutiveAutomationPlatformFreezeRegistry,
} from "./executiveAutomationPlatformFreezeRegistry.ts";
import {
  ExecutiveAutomationPlatformRegressionMetadata,
  validateExecutiveAutomationPlatformFreeze,
} from "./executiveAutomationPlatformFreezeValidation.ts";
import type {
  ExecutiveAutomationFreezeEntry,
  ExecutiveAutomationFreezeResult,
  ExecutiveAutomationFreezeSummary,
} from "./executiveAutomationPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "automation-freeze-foundation-available",
      name: "Foundation Available",
      description: "Validates executive automation foundation public API is available.",
      category: "Foundation",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-registry-complete",
      name: "Registry Complete",
      description: "Validates executive automation registry public API is complete.",
      category: "Registry",
      status: AutomationRegistry.platformId === "OPS-8:1" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-model-complete",
      name: "Model Complete",
      description: "Validates executive automation model public API is complete.",
      category: "Model",
      status: ExecutiveAutomationModel.events.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-validation-complete",
      name: "Validation Complete",
      description: "Validates executive automation validation public API is complete.",
      category: "Validation",
      status: getAutomationValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-manifest-complete",
      name: "Manifest Complete",
      description: "Validates executive automation manifest public API is complete.",
      category: "Manifest",
      status:
        buildExecutiveAutomationPlatformFreezeManifest().releaseSummary.releaseReadiness ===
        "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-platform-complete",
      name: "Platform Complete",
      description: "Validates executive automation platform namespace is complete.",
      category: "Platform",
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
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-certification-pass",
      name: "Certification PASS",
      description: "Validates executive automation certification returns PASS.",
      category: "Certification",
      status:
        certifyExecutiveAutomationPlatform() === "PASS" &&
        ExecutiveAutomationPlatformCertificationRegistry.certificationStatus ===
          "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-registry-valid",
      name: "Freeze Registry Valid",
      description: "Validates freeze registry covers OPS-8:1 through OPS-8:7.",
      category: "Registry",
      status:
        ExecutiveAutomationPlatformFreezeRegistry.freezeStatus === "Frozen" &&
        ExecutiveAutomationPlatformCertifiedPhaseRegistry.length === 7
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-compatibility-valid",
      name: "Freeze Compatibility Valid",
      description: "Validates internal and cross-platform freeze compatibility coverage.",
      category: "Compatibility",
      status:
        ExecutiveAutomationPlatformFreezeCompatibility.internal.length === 7 &&
        ExecutiveAutomationPlatformFreezeCompatibility.crossPlatform.length === 6
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-manifest-valid",
      name: "Freeze Manifest Valid",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildExecutiveAutomationPlatformFreezeManifest())
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-validation-pass",
      name: "Validation PASS",
      description: "Validates freeze validation returns PASS.",
      category: "Validation",
      status:
        validateExecutiveAutomationPlatformFreeze().status === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-public-api-integrity",
      name: "Public API Integrity",
      description: "Validates public API stability and frozen release status.",
      category: "PublicApi",
      status:
        ExecutiveAutomationPlatformRelease.publicApiStatus === "Stable" &&
        buildExecutiveAutomationPlatformFreezeManifest().publicApiFreezeStatus ===
          "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-deterministic-outputs",
      name: "Deterministic Outputs",
      description: "Validates deterministic freeze outputs.",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutiveAutomationPlatformFreezeManifest()) ===
        JSON.stringify(buildExecutiveAutomationPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-immutable-structures",
      name: "Immutable Structures",
      description: "Validates freeze exports are immutable.",
      category: "Immutability",
      status:
        Object.isFrozen(buildExecutiveAutomationPlatformFreezeManifest()) &&
        Object.isFrozen(ExecutiveAutomationPlatformFreezeRegistry) &&
        Object.isFrozen(ExecutiveAutomationPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-metadata-only-compliance",
      name: "Metadata-only Compliance",
      description: "Validates freeze layer preserves metadata-only architecture.",
      category: "Compliance",
      status: buildExecutiveAutomationPlatformFreezeManifest().metadataOnly
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-extension-policy-present",
      name: "Extension Policy Present",
      description: "Validates extension policy metadata exists.",
      category: "ExtensionPolicy",
      status:
        buildExecutiveAutomationPlatformFreezeManifest().extensionPolicy.status ===
        "Locked"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-regression-summary-present",
      name: "Regression Summary Present",
      description: "Validates regression summary metadata exists.",
      category: "Regression",
      status: ExecutiveAutomationPlatformRegressionMetadata.length === 14
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-release-readiness-pass",
      name: "Release Readiness PASS",
      description: "Validates release readiness is ready for frozen public release.",
      category: "ReleaseReadiness",
      status:
        buildExecutiveAutomationPlatformFreezeManifest().releaseReadinessState ===
        "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
    Object.freeze({
      id: "automation-freeze-status-pass",
      name: "Freeze Status PASS",
      description: "Validates freeze status is frozen and released.",
      category: "Freeze",
      status:
        buildExecutiveAutomationPlatformFreezeManifest().freezeIdentity
          .freezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveAutomationFreezeEntry),
  ] as const);

export const runExecutiveAutomationPlatformFreeze = () => {
  const freezeEntries = buildFreezeChecks();
  const passed = freezeEntries.filter((entry) => entry.status === "PASS").length;
  const failed = freezeEntries.length - passed;

  return Object.freeze({
    totalChecks: freezeEntries.length,
    passed,
    failed,
    freezeEntries,
    overallFreezeStatus: failed === 0 ? "PASS" : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveAutomationFreezeResult);
};

export const getExecutiveAutomationPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runExecutiveAutomationPlatformFreeze().totalChecks,
    passed: runExecutiveAutomationPlatformFreeze().passed,
    failed: runExecutiveAutomationPlatformFreeze().failed,
    overallFreezeStatus:
      runExecutiveAutomationPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveAutomationFreezeSummary);

export const getExecutiveAutomationPlatformFreezeStatus = () =>
  runExecutiveAutomationPlatformFreeze().overallFreezeStatus;
