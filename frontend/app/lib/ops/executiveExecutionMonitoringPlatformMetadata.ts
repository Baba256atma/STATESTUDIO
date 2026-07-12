import { buildExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";
import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { ExecutiveExecutionMonitoringPlatformRegistry } from "./executiveExecutionMonitoringPlatformRegistry.ts";
import type { ExecutiveExecutionMonitoringCompatibilitySummary as CompatibilityShape, ExecutiveExecutionMonitoringPlatformDescriptor as DescriptorShape, ExecutiveExecutionMonitoringPlatformMetadata as MetadataShape, ExecutiveExecutionMonitoringPlatformSummary as SummaryShape, ExecutiveExecutionMonitoringReleaseSummary as ReleaseShape } from "./executiveExecutionMonitoringPlatformTypes.ts";

const manifest = buildExecutionMonitoringManifest();
const validationSummary = getExecutionMonitoringValidationSummary();

export const ExecutiveExecutionMonitoringPlatformIdentity = Object.freeze({
  platformId: ExecutiveExecutionMonitoringPlatformRegistry.platformId,
  platformName: ExecutiveExecutionMonitoringPlatformRegistry.platformName,
  platformNamespace: ExecutiveExecutionMonitoringPlatformRegistry.platformNamespace,
  platformVersion: ExecutiveExecutionMonitoringPlatformRegistry.version,
  description: ExecutiveExecutionMonitoringPlatformRegistry.description,
  releaseStatus: "Released", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies DescriptorShape);

export const ExecutiveExecutionMonitoringPlatformCompatibility = Object.freeze({
  internalPhaseCount: manifest.dependencyMap.filter((entry) => entry.scope === "Internal").length,
  crossPlatformCompatibilityCount: manifest.dependencyMap.filter((entry) => entry.scope === "CrossPlatformCompatibility").length,
  compatibilityStatus: manifest.compatibilitySummary.compatibilityStatus,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies CompatibilityShape);

export const ExecutiveExecutionMonitoringPlatformRelease = Object.freeze({
  platformId: ExecutiveExecutionMonitoringPlatformRegistry.platformId,
  platformVersion: ExecutiveExecutionMonitoringPlatformRegistry.version,
  phaseCount: manifest.phaseRegistry.length,
  validationStatus: validationSummary.status,
  manifestStatus: manifest.releaseReadinessMetadata.readinessState === "Ready" ? "PASS" : "FAIL",
  publicApiStatus: "Stable",
  releaseReadiness: manifest.releaseReadinessMetadata.readinessState,
  architectureCompleteness: "Complete",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ReleaseShape);

export const ExecutiveExecutionMonitoringPlatformMetadata = Object.freeze({
  platformIdentity: ExecutiveExecutionMonitoringPlatformIdentity,
  consumedPhases: manifest.consumedPhases,
  publicApiCount: manifest.publicApiSurface.length,
  manifestSummary: manifest.summary,
  validationSummary,
  compatibilitySummary: ExecutiveExecutionMonitoringPlatformCompatibility,
  releaseReadiness: manifest.releaseReadinessMetadata.readinessState,
  deterministicStatus: "Deterministic", immutableStatus: "Immutable", metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies MetadataShape);

export const ExecutiveExecutionMonitoringPlatformSummary = Object.freeze({
  releaseSummary: ExecutiveExecutionMonitoringPlatformRelease,
  compatibilitySummary: ExecutiveExecutionMonitoringPlatformCompatibility,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies SummaryShape);
