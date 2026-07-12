import { buildAutomationManifest } from "./automationManifestIndex.ts";
import { getAutomationValidationSummary } from "./automationValidationIndex.ts";
import { ExecutiveAutomationPlatformRegistry } from "./executiveAutomationPlatformRegistry.ts";
import type {
  ExecutiveAutomationPlatformCompatibilitySummary as ExecutiveAutomationPlatformCompatibilitySummaryShape,
  ExecutiveAutomationPlatformDescriptor as ExecutiveAutomationPlatformDescriptorShape,
  ExecutiveAutomationPlatformMetadata as ExecutiveAutomationPlatformMetadataShape,
  ExecutiveAutomationPlatformReleaseSummary as ExecutiveAutomationPlatformReleaseSummaryShape,
  ExecutiveAutomationPlatformSummary as ExecutiveAutomationPlatformSummaryShape,
} from "./executiveAutomationPlatformTypes.ts";

const manifest = buildAutomationManifest();
const validationSummary = getAutomationValidationSummary();

export const ExecutiveAutomationPlatformIdentity = Object.freeze({
  platformId: ExecutiveAutomationPlatformRegistry.platformId,
  platformName: ExecutiveAutomationPlatformRegistry.platformName,
  platformNamespace: ExecutiveAutomationPlatformRegistry.platformNamespace,
  platformVersion: ExecutiveAutomationPlatformRegistry.version,
  description: ExecutiveAutomationPlatformRegistry.description,
  releaseStatus: "Released",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveAutomationPlatformDescriptorShape);

export const ExecutiveAutomationPlatformCompatibility = Object.freeze({
  internalPhaseCount: manifest.dependencyMap.filter((entry) =>
    entry.sourcePhaseId.startsWith("OPS-8:"),
  ).length,
  crossPlatformCompatibilityCount: manifest.dependencyMap.filter(
    (entry) => entry.sourcePhaseId === "OPS-8",
  ).length,
  compatibilityStatus: manifest.compatibilitySummary.compatibilityStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveAutomationPlatformCompatibilitySummaryShape);

export const ExecutiveAutomationPlatformRelease = Object.freeze({
  platformId: ExecutiveAutomationPlatformRegistry.platformId,
  platformVersion: ExecutiveAutomationPlatformRegistry.version,
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
} as const satisfies ExecutiveAutomationPlatformReleaseSummaryShape);

export const ExecutiveAutomationPlatformMetadata = Object.freeze({
  platformIdentity: ExecutiveAutomationPlatformIdentity,
  consumedPhases: manifest.consumedPhases,
  publicApiCount: manifest.publicApiSurface.length,
  manifestSummary: manifest.summary,
  validationSummary,
  compatibilitySummary: ExecutiveAutomationPlatformCompatibility,
  releaseReadiness: manifest.releaseReadinessMetadata.readinessState,
  deterministicStatus: "Deterministic",
  immutableStatus: "Immutable",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveAutomationPlatformMetadataShape);

export const ExecutiveAutomationPlatformSummary = Object.freeze({
  releaseSummary: ExecutiveAutomationPlatformRelease,
  compatibilitySummary: ExecutiveAutomationPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveAutomationPlatformSummaryShape);
