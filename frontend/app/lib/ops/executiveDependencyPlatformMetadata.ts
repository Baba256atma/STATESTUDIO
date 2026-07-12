import { buildDependencyManifest } from "./dependencyManifestIndex.ts";
import { getDependencyValidationSummary } from "./dependencyValidationIndex.ts";
import { ExecutiveDependencyPlatformRegistry } from "./executiveDependencyPlatformRegistry.ts";
import type {
  ExecutiveDependencyPlatformCompatibilitySummary as ExecutiveDependencyPlatformCompatibilitySummaryShape,
  ExecutiveDependencyPlatformDescriptor as ExecutiveDependencyPlatformDescriptorShape,
  ExecutiveDependencyPlatformMetadata as ExecutiveDependencyPlatformMetadataShape,
  ExecutiveDependencyPlatformReleaseSummary as ExecutiveDependencyPlatformReleaseSummaryShape,
  ExecutiveDependencyPlatformSummary as ExecutiveDependencyPlatformSummaryShape,
} from "./executiveDependencyPlatformTypes.ts";

const manifest = buildDependencyManifest();
const validationSummary = getDependencyValidationSummary();

export const ExecutiveDependencyPlatformIdentity = Object.freeze({
  platformId: ExecutiveDependencyPlatformRegistry.platformId,
  platformName: ExecutiveDependencyPlatformRegistry.platformName,
  platformNamespace: ExecutiveDependencyPlatformRegistry.platformNamespace,
  platformVersion: ExecutiveDependencyPlatformRegistry.version,
  description: ExecutiveDependencyPlatformRegistry.description,
  releaseStatus: "Released",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveDependencyPlatformDescriptorShape);

export const ExecutiveDependencyPlatformCompatibility = Object.freeze({
  internalPhaseCount: manifest.dependencyMap.filter((entry) =>
    entry.sourcePhaseId.startsWith("OPS-7:"),
  ).length,
  crossPlatformCompatibilityCount: manifest.dependencyMap.filter(
    (entry) => entry.sourcePhaseId === "OPS-7",
  ).length,
  compatibilityStatus: manifest.compatibilitySummary.compatibilityStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveDependencyPlatformCompatibilitySummaryShape);

export const ExecutiveDependencyPlatformRelease = Object.freeze({
  platformId: ExecutiveDependencyPlatformRegistry.platformId,
  platformVersion: ExecutiveDependencyPlatformRegistry.version,
  phaseCount: manifest.phaseRegistry.length,
  validationStatus: validationSummary.status,
  manifestStatus:
    manifest.releaseReadinessMetadata.readinessState === "Ready" ? "PASS" : "FAIL",
  publicApiStatus: "Stable",
  releaseReadiness: manifest.releaseReadinessMetadata.readinessState,
  certificationState: "Pending",
  architectureCompleteness: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveDependencyPlatformReleaseSummaryShape);

export const ExecutiveDependencyPlatformMetadata = Object.freeze({
  platformIdentity: ExecutiveDependencyPlatformIdentity,
  consumedPhases: manifest.consumedPhases,
  publicApiCount: manifest.publicApiSurface.length,
  manifestSummary: manifest.summary,
  validationSummary,
  compatibilitySummary: ExecutiveDependencyPlatformCompatibility,
  releaseReadiness: manifest.releaseReadinessMetadata.readinessState,
  deterministicStatus: "Deterministic",
  immutableStatus: "Immutable",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveDependencyPlatformMetadataShape);

export const ExecutiveDependencyPlatformSummary = Object.freeze({
  releaseSummary: ExecutiveDependencyPlatformRelease,
  compatibilitySummary: ExecutiveDependencyPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveDependencyPlatformSummaryShape);
