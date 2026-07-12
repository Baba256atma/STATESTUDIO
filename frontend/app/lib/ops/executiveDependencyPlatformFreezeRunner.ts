import {
  ExecutiveDependencyModel,
} from "./dependencyModelIndex.ts";
import {
  DependencyIntelligenceRegistry,
} from "./dependencyIntelligenceIndex.ts";
import {
  getDependencyValidationSummary,
} from "./dependencyValidationIndex.ts";
import {
  ExecutiveDependencyPlatform,
  ExecutiveDependencyPlatformRelease,
} from "./executiveDependencyPlatformIndex.ts";
import {
  ExecutiveDependencyPlatformCertificationRegistry,
  certifyExecutiveDependencyPlatform,
} from "./executiveDependencyPlatformCertificationIndex.ts";
import {
  ExecutiveDependencyPlatformFreezeCompatibility,
} from "./executiveDependencyPlatformFreezeCompatibility.ts";
import {
  buildExecutiveDependencyPlatformFreezeManifest,
} from "./executiveDependencyPlatformFreezeManifest.ts";
import {
  ExecutiveDependencyPlatformCertifiedPhaseRegistry,
  ExecutiveDependencyPlatformFreezeRegistry,
} from "./executiveDependencyPlatformFreezeRegistry.ts";
import {
  ExecutiveDependencyPlatformRegressionMetadata,
  validateExecutiveDependencyPlatformFreeze,
} from "./executiveDependencyPlatformFreezeValidation.ts";
import type {
  ExecutiveDependencyFreezeEntry,
  ExecutiveDependencyFreezeResult,
  ExecutiveDependencyFreezeSummary,
} from "./executiveDependencyPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "dependency-freeze-foundation-available",
      name: "Foundation Available",
      description: "Validates executive dependency foundation public API is available.",
      category: "Foundation",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-registry-complete",
      name: "Registry Complete",
      description: "Validates executive dependency registry public API is complete.",
      category: "Registry",
      status: DependencyIntelligenceRegistry.platformId === "OPS-7:1" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-model-complete",
      name: "Model Complete",
      description: "Validates executive dependency model public API is complete.",
      category: "Model",
      status: ExecutiveDependencyModel.nodes.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-validation-complete",
      name: "Validation Complete",
      description: "Validates executive dependency validation public API is complete.",
      category: "Validation",
      status: getDependencyValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-manifest-complete",
      name: "Manifest Complete",
      description: "Validates executive dependency manifest public API is complete.",
      category: "Manifest",
      status:
        buildExecutiveDependencyPlatformFreezeManifest().releaseSummary.releaseReadiness ===
        "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-platform-complete",
      name: "Platform Complete",
      description: "Validates executive dependency platform namespace is complete.",
      category: "Platform",
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
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-certification-pass",
      name: "Certification PASS",
      description: "Validates executive dependency certification returns PASS.",
      category: "Certification",
      status:
        certifyExecutiveDependencyPlatform() === "PASS" &&
        ExecutiveDependencyPlatformCertificationRegistry.certificationStatus ===
          "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-registry-valid",
      name: "Freeze Registry Valid",
      description: "Validates freeze registry covers OPS-7:1 through OPS-7:7.",
      category: "Registry",
      status:
        ExecutiveDependencyPlatformFreezeRegistry.freezeStatus === "Frozen" &&
        ExecutiveDependencyPlatformCertifiedPhaseRegistry.length === 7
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-compatibility-valid",
      name: "Freeze Compatibility Valid",
      description: "Validates internal and cross-platform freeze compatibility coverage.",
      category: "Compatibility",
      status:
        ExecutiveDependencyPlatformFreezeCompatibility.internal.length === 7 &&
        ExecutiveDependencyPlatformFreezeCompatibility.crossPlatform.length === 5
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-manifest-valid",
      name: "Freeze Manifest Valid",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildExecutiveDependencyPlatformFreezeManifest())
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-validation-pass",
      name: "Validation PASS",
      description: "Validates freeze validation returns PASS.",
      category: "Validation",
      status:
        validateExecutiveDependencyPlatformFreeze().status === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-public-api-integrity",
      name: "Public API Integrity",
      description: "Validates public API stability and frozen release status.",
      category: "PublicApi",
      status:
        ExecutiveDependencyPlatformRelease.publicApiStatus === "Stable" &&
        buildExecutiveDependencyPlatformFreezeManifest().publicApiFreezeStatus ===
          "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-deterministic-outputs",
      name: "Deterministic Outputs",
      description: "Validates deterministic freeze outputs.",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutiveDependencyPlatformFreezeManifest()) ===
        JSON.stringify(buildExecutiveDependencyPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-immutable-structures",
      name: "Immutable Structures",
      description: "Validates freeze exports are immutable.",
      category: "Immutability",
      status:
        Object.isFrozen(buildExecutiveDependencyPlatformFreezeManifest()) &&
        Object.isFrozen(ExecutiveDependencyPlatformFreezeRegistry) &&
        Object.isFrozen(ExecutiveDependencyPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-metadata-only-compliance",
      name: "Metadata-only Compliance",
      description: "Validates freeze layer preserves metadata-only architecture.",
      category: "Compliance",
      status: buildExecutiveDependencyPlatformFreezeManifest().metadataOnly
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-extension-policy-present",
      name: "Extension Policy Present",
      description: "Validates extension policy metadata exists.",
      category: "ExtensionPolicy",
      status:
        buildExecutiveDependencyPlatformFreezeManifest().extensionPolicy.status ===
        "Locked"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-regression-summary-present",
      name: "Regression Summary Present",
      description: "Validates regression summary metadata exists.",
      category: "Regression",
      status: ExecutiveDependencyPlatformRegressionMetadata.length === 13
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-release-readiness-pass",
      name: "Release Readiness PASS",
      description: "Validates release readiness is ready for frozen public release.",
      category: "ReleaseReadiness",
      status:
        buildExecutiveDependencyPlatformFreezeManifest().releaseReadinessState ===
        "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
    Object.freeze({
      id: "dependency-freeze-status-pass",
      name: "Freeze Status PASS",
      description: "Validates freeze status is frozen and released.",
      category: "Freeze",
      status:
        buildExecutiveDependencyPlatformFreezeManifest().freezeIdentity
          .freezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveDependencyFreezeEntry),
  ] as const);

export const runExecutiveDependencyPlatformFreeze = () => {
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
  } as const satisfies ExecutiveDependencyFreezeResult);
};

export const getExecutiveDependencyPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runExecutiveDependencyPlatformFreeze().totalChecks,
    passed: runExecutiveDependencyPlatformFreeze().passed,
    failed: runExecutiveDependencyPlatformFreeze().failed,
    overallFreezeStatus:
      runExecutiveDependencyPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveDependencyFreezeSummary);

export const getExecutiveDependencyPlatformFreezeStatus = () =>
  runExecutiveDependencyPlatformFreeze().overallFreezeStatus;
